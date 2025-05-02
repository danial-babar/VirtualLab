'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Charge {
  id: string;
  x: number;
  y: number;
  charge: number; // positive or negative value
  color: string;
}

interface Props {
  showFieldLines: boolean;
  showForceVectors: boolean;
  numFieldLines: number;
  testChargeEnabled: boolean;
}

export default function ElectricFieldSimulation({
  showFieldLines,
  showForceVectors,
  numFieldLines,
  testChargeEnabled
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', x: 200, y: 300, charge: 1, color: '#FF5555' },
    { id: '2', x: 600, y: 300, charge: -1, color: '#5555FF' },
  ]);
  const [testCharge, setTestCharge] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Calculate electric field at a point
  const calculateField = (x: number, y: number): [number, number] => {
    const k = 9000; // electric constant (simplified)
    let Ex = 0;
    let Ey = 0;

    charges.forEach(charge => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const distSquared = dx * dx + dy * dy;
      
      if (distSquared < 100) return; // Avoid division by near-zero
      
      const magnitude = k * charge.charge / distSquared;
      const distance = Math.sqrt(distSquared);
      
      Ex += magnitude * dx / distance;
      Ey += magnitude * dy / distance;
    });

    return [Ex, Ey];
  };

  // Normalize vector for display purposes
  const normalizeVector = (x: number, y: number, scale = 20): [number, number] => {
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude === 0) return [0, 0];
    
    const normalizedX = (x / magnitude) * Math.min(magnitude, scale);
    const normalizedY = (y / magnitude) * Math.min(magnitude, scale);
    
    return [normalizedX, normalizedY];
  };

  // Draw the simulation
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous drawings
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Add charges
    const chargeGroups = svg
      .selectAll('.charge')
      .data(charges)
      .enter()
      .append('g')
      .attr('class', 'charge')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer');

    // Add charge circles
    chargeGroups
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d: Charge) => d.color)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Add charge labels
    chargeGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text((d: Charge) => d.charge > 0 ? '+' : '−');

    // Event listeners for dragging charges
    chargeGroups
      .on('mousedown', (event: MouseEvent, d: Charge) => {
        setIsDragging(d.id);
        event.preventDefault();
      });

    // Draw field lines if enabled
    if (showFieldLines) {
      charges.forEach(charge => {
        const angleStep = (2 * Math.PI) / numFieldLines;
        
        for (let i = 0; i < numFieldLines; i++) {
          const angle = i * angleStep;
          const startX = charge.x + 25 * Math.cos(angle);
          const startY = charge.y + 25 * Math.sin(angle);
          
          // Field line path
          const linePoints: [number, number][] = [];
          let currentX = startX;
          let currentY = startY;
          
          // Draw field line segments
          for (let step = 0; step < 100; step++) {
            linePoints.push([currentX, currentY]);
            
            const [fieldX, fieldY] = calculateField(currentX, currentY);
            if (Math.abs(fieldX) < 0.001 && Math.abs(fieldY) < 0.001) break;
            
            // Normalize and scale
            const [normalizedX, normalizedY] = normalizeVector(
              charge.charge > 0 ? fieldX : -fieldX,
              charge.charge > 0 ? fieldY : -fieldY,
              5
            );
            
            // Update position
            currentX += normalizedX;
            currentY += normalizedY;
            
            // Break if out of bounds
            if (
              currentX < 0 || currentX > width ||
              currentY < 0 || currentY > height
            ) break;
            
            // Break if close to another charge
            const nearCharge = charges.some(c => {
              if (c.id === charge.id) return false;
              const dx = currentX - c.x;
              const dy = currentY - c.y;
              return dx * dx + dy * dy < 400;
            });
            
            if (nearCharge) break;
          }
          
          // Create line path
          const lineGenerator = d3.line();
          svg.append('path')
            .attr('d', lineGenerator(linePoints) || '')
            .attr('fill', 'none')
            .attr('stroke', charge.charge > 0 ? '#FF8888' : '#8888FF')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.6);
        }
      });
    }

    // Draw grid of field vectors if enabled
    if (showForceVectors) {
      const gridStep = 50;
      for (let x = gridStep; x < width; x += gridStep) {
        for (let y = gridStep; y < height; y += gridStep) {
          // Skip points too close to charges
          const tooClose = charges.some(charge => {
            const dx = x - charge.x;
            const dy = y - charge.y;
            return dx * dx + dy * dy < 900;
          });
          
          if (tooClose) continue;
          
          const [fieldX, fieldY] = calculateField(x, y);
          if (Math.abs(fieldX) < 0.001 && Math.abs(fieldY) < 0.001) continue;
          
          const [normalizedX, normalizedY] = normalizeVector(fieldX, fieldY);
          const magnitude = Math.sqrt(fieldX * fieldX + fieldY * fieldY);
          const opacity = Math.min(1, magnitude / 5000);
          
          // Draw vector
          svg.append('line')
            .attr('x1', x)
            .attr('y1', y)
            .attr('x2', x + normalizedX)
            .attr('y2', y + normalizedY)
            .attr('stroke', '#333333')
            .attr('stroke-width', 1.5)
            .attr('opacity', opacity);
          
          // Draw arrowhead
          const angle = Math.atan2(normalizedY, normalizedX);
          svg.append('polygon')
            .attr('points', '0,-3 6,0 0,3')
            .attr('transform', `translate(${x + normalizedX}, ${y + normalizedY}) rotate(${angle * 180 / Math.PI})`)
            .attr('fill', '#333333')
            .attr('opacity', opacity);
        }
      }
    }

    // Draw test charge if enabled
    if (testChargeEnabled && testCharge) {
      // Draw test charge
      svg.append('circle')
        .attr('cx', testCharge.x)
        .attr('cy', testCharge.y)
        .attr('r', 10)
        .attr('fill', '#FFAA00')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);

      // Calculate and draw force vector
      const [fieldX, fieldY] = calculateField(testCharge.x, testCharge.y);
      const [normalizedX, normalizedY] = normalizeVector(fieldX, fieldY, 40);
      
      svg.append('line')
        .attr('x1', testCharge.x)
        .attr('y1', testCharge.y)
        .attr('x2', testCharge.x + normalizedX)
        .attr('y2', testCharge.y + normalizedY)
        .attr('stroke', '#FF6600')
        .attr('stroke-width', 2);
      
      // Draw arrowhead
      const angle = Math.atan2(normalizedY, normalizedX);
      svg.append('polygon')
        .attr('points', '0,-5 10,0 0,5')
        .attr('transform', `translate(${testCharge.x + normalizedX}, ${testCharge.y + normalizedY}) rotate(${angle * 180 / Math.PI})`)
        .attr('fill', '#FF6600');
    }

  }, [charges, showFieldLines, showForceVectors, numFieldLines, testCharge, testChargeEnabled, width, height]);

  // Handle mouse events
  useEffect(() => {
    if (!svgRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      if (isDragging) {
        setCharges(prev => prev.map(charge => 
          charge.id === isDragging 
            ? { ...charge, x, y } 
            : charge
        ));
      } else if (testChargeEnabled) {
        setTestCharge({ x, y });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, testChargeEnabled]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setWidth(container.clientWidth);
        setHeight(Math.min(600, Math.max(400, window.innerHeight - 300)));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-300 rounded-lg shadow-inner">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
      <div className="absolute bottom-0 left-0 p-2 bg-white bg-opacity-70 rounded-tr-md text-sm">
        <p>Drag charges to reposition them</p>
        {testChargeEnabled && <p>Move mouse to place test charge</p>}
      </div>
    </div>
  );
} 