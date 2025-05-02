'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'solute' | 'water';
  side: 'left' | 'right'; // Which side of the membrane the particle is on
}

interface MembraneChannel {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'water' | 'solute' | 'both';
  isOpen: boolean;
}

interface Props {
  membranePermeability: number;
  initialConcentrationLeft: number; 
  initialConcentrationRight: number;
  osmolarityDifference: number;
  channelType: 'water' | 'solute' | 'both';
  isPaused: boolean;
}

export default function CellMembraneSimulation({
  membranePermeability,
  initialConcentrationLeft,
  initialConcentrationRight,
  osmolarityDifference,
  channelType,
  isPaused
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [channels, setChannels] = useState<MembraneChannel[]>([]);
  const animationRef = useRef<number | null>(null);
  const [leftConcentration, setLeftConcentration] = useState(0);
  const [rightConcentration, setRightConcentration] = useState(0);
  
  // Initialize simulation
  useEffect(() => {
    resetSimulation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialConcentrationLeft, initialConcentrationRight, membranePermeability, channelType]);
  
  // Reset simulation with new parameters
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const newParticles: Particle[] = [];
    const soluteCountLeft = Math.round(initialConcentrationLeft * 5);
    const soluteCountRight = Math.round(initialConcentrationRight * 5);
    
    // Calculate water particles based on osmolarity difference
    const waterCountLeft = 50 + Math.round(osmolarityDifference * -5); // Negative osmolarity means more water on left
    const waterCountRight = 50 + Math.round(osmolarityDifference * 5); // Positive osmolarity means more water on right
    
    // Create membrane channels
    const newChannels: MembraneChannel[] = [];
    const channelCount = Math.round(membranePermeability * 6);
    const channelSpacing = height / (channelCount + 1);
    
    for (let i = 0; i < channelCount; i++) {
      newChannels.push({
        x: width / 2 - 5,
        y: channelSpacing * (i + 1) - 10,
        width: 10,
        height: 20,
        type: channelType,
        isOpen: true
      });
    }
    setChannels(newChannels);
    
    // Create solute particles on left side
    for (let i = 0; i < soluteCountLeft; i++) {
      const x = Math.random() * (width / 2 - 20) + 10;
      const y = Math.random() * (height - 20) + 10;
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.2 + Math.random() * 0.3;
      
      newParticles.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 5,
        type: 'solute',
        side: 'left'
      });
    }
    
    // Create solute particles on right side
    for (let i = 0; i < soluteCountRight; i++) {
      const x = Math.random() * (width / 2 - 20) + width / 2 + 10;
      const y = Math.random() * (height - 20) + 10;
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.2 + Math.random() * 0.3;
      
      newParticles.push({
        id: soluteCountLeft + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 5,
        type: 'solute',
        side: 'right'
      });
    }
    
    // Create water particles on left side
    for (let i = 0; i < waterCountLeft; i++) {
      const x = Math.random() * (width / 2 - 20) + 10;
      const y = Math.random() * (height - 20) + 10;
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.3 + Math.random() * 0.4;
      
      newParticles.push({
        id: soluteCountLeft + soluteCountRight + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3,
        type: 'water',
        side: 'left'
      });
    }
    
    // Create water particles on right side
    for (let i = 0; i < waterCountRight; i++) {
      const x = Math.random() * (width / 2 - 20) + width / 2 + 10;
      const y = Math.random() * (height - 20) + 10;
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.3 + Math.random() * 0.4;
      
      newParticles.push({
        id: soluteCountLeft + soluteCountRight + waterCountLeft + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3,
        type: 'water',
        side: 'right'
      });
    }
    
    setParticles(newParticles);
    updateConcentrations(newParticles);
    animate();
  };
  
  // Update concentration values
  const updateConcentrations = (currentParticles: Particle[]) => {
    const leftSolutes = currentParticles.filter(p => p.side === 'left' && p.type === 'solute').length;
    const rightSolutes = currentParticles.filter(p => p.side === 'right' && p.type === 'solute').length;
    const leftWater = currentParticles.filter(p => p.side === 'left' && p.type === 'water').length;
    const rightWater = currentParticles.filter(p => p.side === 'right' && p.type === 'water').length;
    
    // Calculate concentrations
    const leftConc = leftSolutes / (leftSolutes + leftWater) * 100;
    const rightConc = rightSolutes / (rightSolutes + rightWater) * 100;
    
    setLeftConcentration(leftConc);
    setRightConcentration(rightConc);
  };
  
  // Animation loop
  const animate = () => {
    if (isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    setParticles(prevParticles => {
      const newParticles = [...prevParticles];
      
      // Update particle positions
      for (let i = 0; i < newParticles.length; i++) {
        const p = newParticles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Check for wall collisions
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = -p.vx;
        } else if (p.x + p.radius > width) {
          p.x = width - p.radius;
          p.vx = -p.vx;
        }
        
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy = -p.vy;
        } else if (p.y + p.radius > height) {
          p.y = height - p.radius;
          p.vy = -p.vy;
        }
        
        // Check for membrane collision
        const membraneX = width / 2;
        if (p.side === 'left' && p.x + p.radius > membraneX) {
          // Check if particle can pass through a channel
          let canPass = false;
          for (const channel of channels) {
            if (
              channel.isOpen && 
              (channel.type === 'both' || channel.type === p.type) &&
              p.y > channel.y && 
              p.y < channel.y + channel.height
            ) {
              canPass = true;
              break;
            }
          }
          
          if (canPass) {
            // Particle passes through to right side
            p.side = 'right';
          } else {
            // Particle bounces off membrane
            p.x = membraneX - p.radius;
            p.vx = -p.vx;
          }
        } else if (p.side === 'right' && p.x - p.radius < membraneX) {
          // Check if particle can pass through a channel
          let canPass = false;
          for (const channel of channels) {
            if (
              channel.isOpen && 
              (channel.type === 'both' || channel.type === p.type) &&
              p.y > channel.y && 
              p.y < channel.y + channel.height
            ) {
              canPass = true;
              break;
            }
          }
          
          if (canPass) {
            // Particle passes through to left side
            p.side = 'left';
          } else {
            // Particle bounces off membrane
            p.x = membraneX + p.radius;
            p.vx = -p.vx;
          }
        }
      }
      
      updateConcentrations(newParticles);
      return newParticles;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Render simulation
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Draw cell membrane
    svg.append('rect')
      .attr('x', width / 2 - 2)
      .attr('y', 0)
      .attr('width', 4)
      .attr('height', height)
      .attr('fill', '#666')
      .attr('stroke', 'none');
    
    // Draw channels
    channels.forEach(channel => {
      svg.append('rect')
        .attr('x', channel.x)
        .attr('y', channel.y)
        .attr('width', channel.width)
        .attr('height', channel.height)
        .attr('fill', (() => {
          if (channel.type === 'water') return '#a8d5ff';
          if (channel.type === 'solute') return '#ff9e7a';
          return '#d0f0c0'; // Both
        })())
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
    });
    
    // Draw particles
    svg.selectAll('.solute')
      .data(particles.filter(p => p.type === 'solute'))
      .enter()
      .append('circle')
      .attr('class', 'solute')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', '#e74c3c')
      .attr('stroke', '#c0392b')
      .attr('stroke-width', 1);
    
    svg.selectAll('.water')
      .data(particles.filter(p => p.type === 'water'))
      .enter()
      .append('circle')
      .attr('class', 'water')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', '#3498db')
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 0.5);
    
    // Update concentration indicators
    const leftBox = svg.select('.left-box');
    const rightBox = svg.select('.right-box');
    
    if (leftBox.empty()) {
      svg.append('rect')
        .attr('class', 'left-box')
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 60)
        .attr('height', 40)
        .attr('fill', 'rgba(255, 255, 255, 0.7)')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
      
      svg.append('text')
        .attr('class', 'left-label')
        .attr('x', 40)
        .attr('y', 24)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .text('Concentration:');
      
      svg.append('text')
        .attr('class', 'left-value')
        .attr('x', 40)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .text(`${leftConcentration.toFixed(1)}%`);
    } else {
      svg.select('.left-value')
        .text(`${leftConcentration.toFixed(1)}%`);
    }
    
    if (rightBox.empty()) {
      svg.append('rect')
        .attr('class', 'right-box')
        .attr('x', width - 70)
        .attr('y', 10)
        .attr('width', 60)
        .attr('height', 40)
        .attr('fill', 'rgba(255, 255, 255, 0.7)')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
      
      svg.append('text')
        .attr('class', 'right-label')
        .attr('x', width - 40)
        .attr('y', 24)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .text('Concentration:');
      
      svg.append('text')
        .attr('class', 'right-value')
        .attr('x', width - 40)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .text(`${rightConcentration.toFixed(1)}%`);
    } else {
      svg.select('.right-value')
        .text(`${rightConcentration.toFixed(1)}%`);
    }
    
  }, [particles, channels, width, height, leftConcentration, rightConcentration]);
  
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
  
  // Start/stop animation when isPaused changes
  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    } else {
      if (!animationRef.current) {
        animate();
      }
    }
  }, [isPaused]);
  
  return (
    <div ref={containerRef} className="relative w-full bg-gray-100 border border-gray-300 rounded-lg shadow-inner">
      <div className="flex justify-between items-center p-2 bg-white border-b text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Solute Particles</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>Water Molecules</span>
          </div>
        </div>
        <div>
          <span className="font-semibold">Channel Type: </span>
          <span className={`px-2 py-1 rounded ${
            channelType === 'water' ? 'bg-blue-100' :
            channelType === 'solute' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {channelType === 'water' ? 'Water Only' :
             channelType === 'solute' ? 'Solute Only' : 'Both'}
          </span>
        </div>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
      <div className="absolute bottom-2 text-xs left-2 bg-white bg-opacity-80 p-2 rounded">
        <div className="font-bold">Concentration Difference: {Math.abs(leftConcentration - rightConcentration).toFixed(1)}%</div>
        <div>
          {leftConcentration > rightConcentration 
            ? 'Net diffusion: Left → Right' 
            : leftConcentration < rightConcentration 
              ? 'Net diffusion: Right → Left' 
              : 'Equilibrium reached'}
        </div>
      </div>
    </div>
  );
} 