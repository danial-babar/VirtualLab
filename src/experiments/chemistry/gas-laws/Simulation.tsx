'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface GasParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Props {
  temperature: number;
  volume: number;
  particleCount: number;
  showCollisions: boolean;
  selectedLaw: 'boyle' | 'charles' | 'gay-lussac' | 'combined';
}

export default function GasLawsSimulation({
  temperature,
  volume,
  particleCount,
  showCollisions,
  selectedLaw
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [particles, setParticles] = useState<GasParticle[]>([]);
  const [pressure, setPressure] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const animationRef = useRef<number | null>(null);
  const collisionsRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Calculate container dimensions based on volume parameter
  const maxContainerWidth = width * 0.8;
  const maxContainerHeight = height * 0.8;
  
  // Calculate container width and height based on volume
  // We'll keep container's aspect ratio consistent but scale based on volume
  const volumeScale = Math.sqrt(volume / 100);
  const containerWidth = Math.min(maxContainerWidth * volumeScale, maxContainerWidth);
  const containerHeight = Math.min(maxContainerHeight * volumeScale, maxContainerHeight);
  
  // Container position
  const containerX = (width - containerWidth) / 2;
  const containerY = (height - containerHeight) / 2;

  // Initialize simulation
  useEffect(() => {
    resetSimulation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, temperature, volume]);

  // Reset with new particles
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Create new particles
    const newParticles: GasParticle[] = [];
    
    // Speed scale based on temperature (higher temp = faster particles)
    const speedScale = temperature / 50;
    
    for (let i = 0; i < particleCount; i++) {
      // Random position within container boundaries
      const x = containerX + Math.random() * containerWidth;
      const y = containerY + Math.random() * containerHeight;
      
      // Random velocity based on temperature
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.5 + Math.random() * speedScale;
      
      newParticles.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 4
      });
    }
    
    setParticles(newParticles);
    collisionsRef.current = 0;
    timeRef.current = 0;
    lastTimeRef.current = performance.now();
    setIsRunning(true);
    animate();
  };

  // Animation loop to update particle positions
  const animate = () => {
    if (!isRunning) return;
    
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    // Update time counter for pressure calculation
    timeRef.current += deltaTime;
    
    // If enough time has passed, calculate pressure
    if (timeRef.current > 1000) { // Update pressure every second
      const containerArea = containerWidth * containerHeight;
      const pressureValue = (collisionsRef.current / timeRef.current) * 1000 * (temperature / 50);
      setPressure(pressureValue);
      
      // Reset counters
      collisionsRef.current = 0;
      timeRef.current = 0;
    }
    
    // Update particle positions
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        let { x, y, vx, vy } = particle;
        
        // Update position
        x += vx * (deltaTime / 16); // Normalize to ~60fps
        y += vy * (deltaTime / 16);
        
        // Wall collisions
        if (x - particle.radius < containerX) {
          x = containerX + particle.radius;
          vx = -vx;
          collisionsRef.current++;
        } else if (x + particle.radius > containerX + containerWidth) {
          x = containerX + containerWidth - particle.radius;
          vx = -vx;
          collisionsRef.current++;
        }
        
        if (y - particle.radius < containerY) {
          y = containerY + particle.radius;
          vy = -vy;
          collisionsRef.current++;
        } else if (y + particle.radius > containerY + containerHeight) {
          y = containerY + containerHeight - particle.radius;
          vy = -vy;
          collisionsRef.current++;
        }
        
        return { ...particle, x, y, vx, vy };
      });
    });
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle particle-particle collisions
  useEffect(() => {
    if (!showCollisions) return;
    
    // Simple collision detection and response
    const resolveCollisions = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if particles are colliding
          if (distance < p1.radius + p2.radius) {
            // Calculate collision normal
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Calculate relative velocity
            const relVx = p2.vx - p1.vx;
            const relVy = p2.vy - p1.vy;
            
            // Calculate relative velocity along normal
            const relVelocityDotNormal = relVx * nx + relVy * ny;
            
            // No collision if objects are moving away from each other
            if (relVelocityDotNormal > 0) continue;
            
            // Apply simplified elastic collision
            const p1NewVx = p1.vx + nx * relVelocityDotNormal;
            const p1NewVy = p1.vy + ny * relVelocityDotNormal;
            const p2NewVx = p2.vx - nx * relVelocityDotNormal;
            const p2NewVy = p2.vy - ny * relVelocityDotNormal;
            
            setParticles(prevParticles => {
              return prevParticles.map(p => {
                if (p.id === p1.id) {
                  return { ...p, vx: p1NewVx, vy: p1NewVy };
                } else if (p.id === p2.id) {
                  return { ...p, vx: p2NewVx, vy: p2NewVy };
                }
                return p;
              });
            });
            
            collisionsRef.current++;
          }
        }
      }
    };
    
    if (particles.length > 0) {
      resolveCollisions();
    }
  }, [particles, showCollisions]);

  // Render container and particles
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Draw container rectangle
    svg.append('rect')
      .attr('x', containerX)
      .attr('y', containerY)
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    
    // Add gas particles
    const particleGroups = svg
      .selectAll('.particle')
      .data(particles)
      .enter()
      .append('g')
      .attr('class', 'particle');
    
    // Draw particles as circles
    particleGroups.append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', getParticleColor)
      .attr('opacity', 0.7);
    
    // Draw direction indicators based on velocity
    if (temperature > 50) {
      particleGroups.append('line')
        .attr('x1', d => d.x)
        .attr('y1', d => d.y)
        .attr('x2', d => d.x + d.vx * 3)
        .attr('y2', d => d.y + d.vy * 3)
        .attr('stroke', '#333')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    }
    
  }, [particles, containerX, containerY, containerWidth, containerHeight, temperature]);

  // Get particle color based on selected law
  const getParticleColor = (d: GasParticle) => {
    switch (selectedLaw) {
      case 'boyle':
        return '#4F86F7'; // Blue for pressure-volume relationship
      case 'charles':
        return '#FF5349'; // Red for temperature-volume relationship
      case 'gay-lussac':
        return '#76C043'; // Green for temperature-pressure relationship
      case 'combined':
        // Mix of colors for combined law
        return d3.interpolateRainbow(d.id / particleCount);
      default:
        return '#6082B6'; // Default blue
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
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

  // Calculate ideal gas law values
  const idealGasLawDisplay = () => {
    const pressureFormatted = pressure.toFixed(2);
    const volumeFormatted = volume.toFixed(2);
    const temperatureFormatted = temperature.toFixed(2);
    
    // PV = nRT (simplified)
    const idealGasLawValue = (pressure * volume / temperature).toFixed(2);
    
    return (
      <div className="text-center">
        <div className="grid grid-cols-3 gap-4 text-xs bg-white p-2 rounded shadow-inner">
          <div>
            <span className="font-bold">P</span>
            <br />{pressureFormatted}
          </div>
          <div>
            <span className="font-bold">V</span>
            <br />{volumeFormatted}
          </div>
          <div>
            <span className="font-bold">T</span>
            <br />{temperatureFormatted}
          </div>
        </div>
        <div className="mt-1 text-xs">
          <span className="font-bold">PV/T = </span>
          <span>{idealGasLawValue}</span>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full bg-gray-100 border border-gray-300 rounded-lg shadow-inner">
      <div className="flex justify-between items-center p-2 bg-white border-b">
        <div className="text-sm">
          <span className="font-semibold mr-2">Pressure:</span>
          <span>{pressure.toFixed(2)} units</span>
        </div>
        <div>
          {idealGasLawDisplay()}
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
      <div className="absolute bottom-2 left-2 text-sm bg-white bg-opacity-80 p-2 rounded">
        <div>{getLawDescription(selectedLaw)}</div>
      </div>
    </div>
  );
}

function getLawDescription(law: string): string {
  switch (law) {
    case 'boyle':
      return "Boyle's Law: P ∝ 1/V (constant T)";
    case 'charles':
      return "Charles's Law: V ∝ T (constant P)";
    case 'gay-lussac':
      return "Gay-Lussac's Law: P ∝ T (constant V)";
    case 'combined':
      return "Combined Gas Law: PV/T = constant";
    default:
      return "";
  }
} 