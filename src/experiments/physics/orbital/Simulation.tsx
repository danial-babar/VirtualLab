'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface CelestialBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  name: string;
  fixed?: boolean;
}

interface Props {
  gravitationalConstant: number;
  showOrbits: boolean;
  showVelocityVectors: boolean;
  showForceVectors: boolean;
  timeScale: number;
}

export default function OrbitalSimulation({
  gravitationalConstant,
  showOrbits,
  showVelocityVectors,
  showForceVectors,
  timeScale
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bodies, setBodies] = useState<CelestialBody[]>([]);
  const [orbitPaths, setOrbitPaths] = useState<{[key: string]: {x: number, y: number}[]}>({});
  const [isRunning, setIsRunning] = useState(true);
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

  // Reset with a solar system simulation
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Center coordinates
    const centerX = width / 2;
    const centerY = height / 2;

    // Create a simple solar system (simplified scales and relationships)
    const newBodies: CelestialBody[] = [
      // Sun (at center)
      {
        id: 'sun',
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        radius: 25,
        mass: 10000,
        color: '#FDB813',
        name: 'Star',
        fixed: true
      },
      // Mercury
      {
        id: 'planet1',
        x: centerX,
        y: centerY - 80,
        vx: 4, // Initial velocity to achieve orbit
        vy: 0,
        radius: 5,
        mass: 10,
        color: '#97979F',
        name: 'Planet 1'
      },
      // Venus
      {
        id: 'planet2',
        x: centerX,
        y: centerY - 140,
        vx: 3, // Initial velocity to achieve orbit
        vy: 0,
        radius: 8,
        mass: 20,
        color: '#FDDCAB',
        name: 'Planet 2'
      },
      // Earth
      {
        id: 'planet3',
        x: centerX,
        y: centerY - 200,
        vx: 2.5, // Initial velocity to achieve orbit
        vy: 0,
        radius: 10,
        mass: 30,
        color: '#4B9CD3',
        name: 'Planet 3'
      },
      // Mars
      {
        id: 'planet4',
        x: centerX,
        y: centerY - 260,
        vx: 2.2, // Initial velocity to achieve orbit
        vy: 0,
        radius: 7,
        mass: 15,
        color: '#F17C67',
        name: 'Planet 4'
      }
    ];

    setBodies(newBodies);
    setOrbitPaths({});
    lastTimeRef.current = performance.now();
    setIsRunning(true);
    animate();
  };

  // Apply gravitational forces and update position
  const updatePositions = (deltaTime: number) => {
    const deltaFactor = deltaTime * timeScale * 0.01;
    
    setBodies(prevBodies => {
      // Calculate forces
      const updatedBodies = [...prevBodies];
      
      // Calculate gravitational force for each pair of bodies
      for (let i = 0; i < updatedBodies.length; i++) {
        if (updatedBodies[i].fixed) continue;
        
        let totalForceX = 0;
        let totalForceY = 0;
        
        for (let j = 0; j < updatedBodies.length; j++) {
          if (i === j) continue;
          
          const body1 = updatedBodies[i];
          const body2 = updatedBodies[j];
          
          // Calculate distance
          const dx = body2.x - body1.x;
          const dy = body2.y - body1.y;
          const distSquared = dx * dx + dy * dy;
          
          // Avoid division by zero and limit forces at very close distances
          if (distSquared < Math.pow(body1.radius + body2.radius, 2)) continue;
          
          // Calculate gravitational force magnitude (F = G * m1 * m2 / r²)
          const forceMagnitude = gravitationalConstant * body1.mass * body2.mass / distSquared;
          
          // Calculate force components
          const distance = Math.sqrt(distSquared);
          totalForceX += forceMagnitude * dx / distance;
          totalForceY += forceMagnitude * dy / distance;
        }
        
        // Calculate acceleration (F = ma, so a = F/m)
        const ax = totalForceX / updatedBodies[i].mass;
        const ay = totalForceY / updatedBodies[i].mass;
        
        // Update velocity
        updatedBodies[i].vx += ax * deltaFactor;
        updatedBodies[i].vy += ay * deltaFactor;
        
        // Update position
        updatedBodies[i].x += updatedBodies[i].vx * deltaFactor;
        updatedBodies[i].y += updatedBodies[i].vy * deltaFactor;
      }
      
      // Update orbit paths
      if (showOrbits) {
        setOrbitPaths(prev => {
          const newPaths = { ...prev };
          
          updatedBodies.forEach(body => {
            if (body.fixed) return;
            
            if (!newPaths[body.id]) {
              newPaths[body.id] = [];
            }
            
            // Add current position to the path
            newPaths[body.id].push({ x: body.x, y: body.y });
            
            // Limit the number of points in the path to avoid performance issues
            if (newPaths[body.id].length > 300) {
              newPaths[body.id] = newPaths[body.id].slice(-300);
            }
          });
          
          return newPaths;
        });
      }
      
      return updatedBodies;
    });
  };

  // Animation loop
  const animate = () => {
    if (!isRunning) return;
    
    const now = performance.now();
    const deltaTime = (now - lastTimeRef.current);
    lastTimeRef.current = now;
    
    updatePositions(deltaTime);
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  };

  // Render simulation with D3
  useEffect(() => {
    if (!svgRef.current || bodies.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw orbit paths
    if (showOrbits) {
      Object.entries(orbitPaths).forEach(([bodyId, pathPoints]) => {
        const body = bodies.find(b => b.id === bodyId);
        if (!body || pathPoints.length < 2) return;
        
        const lineGenerator = d3.line<{x: number, y: number}>()
          .x(d => d.x)
          .y(d => d.y)
          .curve(d3.curveBasis);
        
        svg.append('path')
          .attr('d', lineGenerator(pathPoints))
          .attr('fill', 'none')
          .attr('stroke', body.color)
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.5);
      });
    }

    // Draw bodies
    bodies.forEach(body => {
      const group = svg.append('g');
      
      // Planet/star circle
      group.append('circle')
        .attr('cx', body.x)
        .attr('cy', body.y)
        .attr('r', body.radius)
        .attr('fill', body.color)
        .attr('stroke', '#333')
        .attr('stroke-width', 1);

      // Velocity vector
      if (showVelocityVectors && !body.fixed) {
        const velocityScale = 10;
        const velocityX = body.x + body.vx * velocityScale;
        const velocityY = body.y + body.vy * velocityScale;
        
        group.append('line')
          .attr('x1', body.x)
          .attr('y1', body.y)
          .attr('x2', velocityX)
          .attr('y2', velocityY)
          .attr('stroke', '#FF9900')
          .attr('stroke-width', 2);
        
        // Arrow head
        const angle = Math.atan2(velocityY - body.y, velocityX - body.x);
        group.append('polygon')
          .attr('points', '0,-3 8,0 0,3')
          .attr('transform', `translate(${velocityX},${velocityY}) rotate(${angle * 180 / Math.PI})`)
          .attr('fill', '#FF9900');
      }

      // Force vectors
      if (showForceVectors && !body.fixed) {
        // Calculate net force from all other bodies
        let forceX = 0;
        let forceY = 0;
        
        bodies.forEach(otherBody => {
          if (otherBody.id === body.id) return;
          
          const dx = otherBody.x - body.x;
          const dy = otherBody.y - body.y;
          const distSquared = dx * dx + dy * dy;
          
          if (distSquared < Math.pow(body.radius + otherBody.radius, 2)) return;
          
          const forceMagnitude = gravitationalConstant * body.mass * otherBody.mass / distSquared;
          const distance = Math.sqrt(distSquared);
          
          forceX += forceMagnitude * dx / distance;
          forceY += forceMagnitude * dy / distance;
        });
        
        // Normalize and scale the force vector for display
        const forceScale = 0.5;
        const forceMagnitude = Math.sqrt(forceX * forceX + forceY * forceY);
        const normalizedForceX = body.x + (forceX / forceMagnitude) * Math.min(forceMagnitude * forceScale, 50);
        const normalizedForceY = body.y + (forceY / forceMagnitude) * Math.min(forceMagnitude * forceScale, 50);
        
        group.append('line')
          .attr('x1', body.x)
          .attr('y1', body.y)
          .attr('x2', normalizedForceX)
          .attr('y2', normalizedForceY)
          .attr('stroke', '#4CAF50')
          .attr('stroke-width', 2);
        
        // Arrow head
        const angle = Math.atan2(normalizedForceY - body.y, normalizedForceX - body.x);
        group.append('polygon')
          .attr('points', '0,-3 8,0 0,3')
          .attr('transform', `translate(${normalizedForceX},${normalizedForceY}) rotate(${angle * 180 / Math.PI})`)
          .attr('fill', '#4CAF50');
      }
      
      // Label with name
      group.append('text')
        .attr('x', body.x)
        .attr('y', body.y + body.radius + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        .attr('font-size', '12px')
        .text(body.name);
    });
  }, [bodies, showOrbits, showVelocityVectors, showForceVectors, orbitPaths]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setWidth(container.clientWidth);
        setHeight(Math.min(600, Math.max(400, window.innerHeight - 200)));
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
          <span className="font-semibold mr-2">Orbital Mechanics</span>
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
          {showForceVectors && <span className="ml-2">—— <span className="text-green-600">Force</span></span>}
        </p>
      </div>
    </div>
  );
} 