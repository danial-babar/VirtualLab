'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
}

interface Props {
  elasticity: number;
  showVelocityVectors: boolean;
  showMomentumVectors: boolean;
  useGravity: boolean;
  slowMotion: boolean;
}

export default function CollisionSimulation({
  elasticity,
  showVelocityVectors,
  showMomentumVectors,
  useGravity,
  slowMotion
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [totalKineticEnergy, setTotalKineticEnergy] = useState(0);
  const [totalMomentum, setTotalMomentum] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize the simulation
  useEffect(() => {
    resetSimulation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Function to create random ball data
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const newBalls: Ball[] = [
      {
        id: '1',
        x: width * 0.2,
        y: height / 2,
        vx: 2.5,
        vy: 0,
        radius: 30,
        mass: 10,
        color: '#4C7BD9'
      },
      {
        id: '2',
        x: width * 0.8,
        y: height / 2,
        vx: -1.5,
        vy: 0,
        radius: 40,
        mass: 20,
        color: '#D95C4C'
      },
      {
        id: '3',
        x: width * 0.5,
        y: height * 0.3,
        vx: 0,
        vy: 1,
        radius: 25,
        mass: 7,
        color: '#4CD97B'
      }
    ];

    setBalls(newBalls);
    calculateEnergy(newBalls);
    calculateMomentum(newBalls);
    lastTimeRef.current = performance.now();
    setIsRunning(true);
    animate();
  };

  // Calculate kinetic energy
  const calculateEnergy = (currentBalls: Ball[]) => {
    const totalEnergy = currentBalls.reduce((sum, ball) => {
      const velocity = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      return sum + 0.5 * ball.mass * velocity * velocity;
    }, 0);
    setTotalKineticEnergy(totalEnergy);
  };

  // Calculate momentum
  const calculateMomentum = (currentBalls: Ball[]) => {
    const momentum = currentBalls.reduce(
      (sum, ball) => ({
        x: sum.x + ball.mass * ball.vx,
        y: sum.y + ball.mass * ball.vy
      }),
      { x: 0, y: 0 }
    );
    setTotalMomentum(momentum);
  };

  // Handle collisions between balls
  const handleBallCollision = (ball1: Ball, ball2: Ball) => {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if the balls are colliding
    if (distance < ball1.radius + ball2.radius) {
      // Normal vector
      const nx = dx / distance;
      const ny = dy / distance;
      
      // Relative velocity
      const relVx = ball2.vx - ball1.vx;
      const relVy = ball2.vy - ball1.vy;
      
      // Project relative velocity onto collision normal
      const velAlongNormal = relVx * nx + relVy * ny;
      
      // If balls are moving away from each other, no collision response needed
      if (velAlongNormal > 0) return;
      
      // Calculate impulse scalar
      const j = -(1 + elasticity) * velAlongNormal;
      const impulse = j / (1/ball1.mass + 1/ball2.mass);
      
      // Apply impulse to velocities
      const impulseX = impulse * nx;
      const impulseY = impulse * ny;
      
      // Update velocities
      const updatedBalls = balls.map(ball => {
        if (ball.id === ball1.id) {
          return {
            ...ball,
            vx: ball.vx - impulseX / ball.mass,
            vy: ball.vy - impulseY / ball.mass
          };
        } else if (ball.id === ball2.id) {
          return {
            ...ball,
            vx: ball.vx + impulseX / ball.mass,
            vy: ball.vy + impulseY / ball.mass
          };
        }
        return ball;
      });
      
      // Separate the balls to prevent sticking
      const overlap = (ball1.radius + ball2.radius - distance) / 2;
      const correctionX = overlap * nx;
      const correctionY = overlap * ny;
      
      setBalls(prevBalls => prevBalls.map(ball => {
        if (ball.id === ball1.id) {
          return {
            ...ball,
            x: ball.x - correctionX,
            y: ball.y - correctionY,
            vx: (updatedBalls.find(b => b.id === ball.id) || ball).vx,
            vy: (updatedBalls.find(b => b.id === ball.id) || ball).vy
          };
        } else if (ball.id === ball2.id) {
          return {
            ...ball,
            x: ball.x + correctionX,
            y: ball.y + correctionY,
            vx: (updatedBalls.find(b => b.id === ball.id) || ball).vx,
            vy: (updatedBalls.find(b => b.id === ball.id) || ball).vy
          };
        }
        return ball;
      }));
    }
  };

  // Animation loop
  const animate = () => {
    if (!isRunning) return;
    
    const now = performance.now();
    const deltaTime = (now - lastTimeRef.current) / (slowMotion ? 5 : 1);
    const deltaSeconds = deltaTime / 1000;
    lastTimeRef.current = now;
    
    // Update ball positions and handle wall collisions
    setBalls(prevBalls => {
      const updatedBalls = prevBalls.map(ball => {
        let { x, y, vx, vy } = ball;
        
        // Apply gravity if enabled
        if (useGravity) {
          vy += 0.2 * deltaSeconds * 60; // A simple gravity constant adjusted for time
        }
        
        // Update position
        x += vx * deltaSeconds * 60;
        y += vy * deltaSeconds * 60;
        
        // Wall collision: x-axis
        if (x - ball.radius < 0) {
          x = ball.radius;
          vx = -vx * elasticity;
        } else if (x + ball.radius > width) {
          x = width - ball.radius;
          vx = -vx * elasticity;
        }
        
        // Wall collision: y-axis
        if (y - ball.radius < 0) {
          y = ball.radius;
          vy = -vy * elasticity;
        } else if (y + ball.radius > height) {
          y = height - ball.radius;
          vy = -vy * elasticity;
        }
        
        return { ...ball, x, y, vx, vy };
      });
      
      // Check for collisions between balls
      for (let i = 0; i < updatedBalls.length; i++) {
        for (let j = i + 1; j < updatedBalls.length; j++) {
          handleBallCollision(updatedBalls[i], updatedBalls[j]);
        }
      }
      
      calculateEnergy(updatedBalls);
      calculateMomentum(updatedBalls);
      
      return updatedBalls;
    });
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  };

  // Render simulation with D3
  useEffect(() => {
    if (!svgRef.current || balls.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw balls
    balls.forEach(ball => {
      const group = svg.append('g');
      
      // Ball circle
      group.append('circle')
        .attr('cx', ball.x)
        .attr('cy', ball.y)
        .attr('r', ball.radius)
        .attr('fill', ball.color)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);
      
      // Mass label
      group.append('text')
        .attr('x', ball.x)
        .attr('y', ball.y + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', `${Math.min(14, ball.radius * 0.6)}px`)
        .text(`${ball.mass}`);
      
      // Velocity vector
      if (showVelocityVectors) {
        const velocityScale = 10;
        const velocityX = ball.x + ball.vx * velocityScale;
        const velocityY = ball.y + ball.vy * velocityScale;
        
        group.append('line')
          .attr('x1', ball.x)
          .attr('y1', ball.y)
          .attr('x2', velocityX)
          .attr('y2', velocityY)
          .attr('stroke', '#FF9900')
          .attr('stroke-width', 2);
        
        // Arrow head
        const angle = Math.atan2(velocityY - ball.y, velocityX - ball.x);
        group.append('polygon')
          .attr('points', '0,-5 10,0 0,5')
          .attr('transform', `translate(${velocityX},${velocityY}) rotate(${angle * 180 / Math.PI})`)
          .attr('fill', '#FF9900');
      }
      
      // Momentum vector
      if (showMomentumVectors) {
        const momentumScale = 0.5;
        const momentumX = ball.x + (ball.vx * ball.mass) * momentumScale;
        const momentumY = ball.y + (ball.vy * ball.mass) * momentumScale;
        
        group.append('line')
          .attr('x1', ball.x)
          .attr('y1', ball.y)
          .attr('x2', momentumX)
          .attr('y2', momentumY)
          .attr('stroke', '#9900FF')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '4');
        
        // Arrow head
        const angle = Math.atan2(momentumY - ball.y, momentumX - ball.x);
        group.append('polygon')
          .attr('points', '0,-6 12,0 0,6')
          .attr('transform', `translate(${momentumX},${momentumY}) rotate(${angle * 180 / Math.PI})`)
          .attr('fill', '#9900FF');
      }
    });

  }, [balls, showVelocityVectors, showMomentumVectors]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setWidth(container.clientWidth);
        setHeight(Math.min(500, Math.max(400, window.innerHeight - 300)));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle simulation
  const toggleSimulation = () => {
    if (isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      lastTimeRef.current = performance.now();
      animate();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-300 rounded-lg shadow-inner flex flex-col">
      <div className="flex justify-between items-center p-2 bg-white border-b">
        <div className="text-sm">
          <span className="font-semibold mr-2">Total Kinetic Energy:</span>
          <span>{totalKineticEnergy.toFixed(2)} J</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold mr-2">Total Momentum:</span>
          <span>({totalMomentum.x.toFixed(2)}, {totalMomentum.y.toFixed(2)}) kg·m/s</span>
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
            onClick={toggleSimulation}
          >
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
            onClick={resetSimulation}
          >
            Reset
          </button>
        </div>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
      <div className="p-2 bg-white text-sm">
        <p>
          <span className="font-semibold">Vector Legend:</span>
          {showVelocityVectors && <span className="ml-2">—— <span className="text-orange-500">Velocity</span></span>}
          {showMomentumVectors && <span className="ml-2">- - - <span className="text-purple-700">Momentum</span></span>}
        </p>
      </div>
    </div>
  );
} 