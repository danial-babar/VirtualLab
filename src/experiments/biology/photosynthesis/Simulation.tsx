'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface SimulationProps {
  lightIntensity: number;
  co2Concentration: number;
  temperature: number;
  showLightReactions: boolean;
  showDarkReactions: boolean;
  isPaused: boolean;
}

interface Molecule {
  id: number;
  type: 'co2' | 'o2' | 'h2o' | 'glucose' | 'electron' | 'atp' | 'nadph';
  x: number;
  y: number;
  vx: number;
  vy: number;
  stage: 'lightReaction' | 'calvinCycle' | 'environment';
}

export default function PhotosynthesisSimulation({
  lightIntensity,
  co2Concentration,
  temperature,
  showLightReactions,
  showDarkReactions,
  isPaused
}: SimulationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(700);
  const [height, setHeight] = useState(500);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [atpCount, setAtpCount] = useState(0);
  const [glucoseCount, setGlucoseCount] = useState(0);
  const [o2Count, setO2Count] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Initialize simulation when parameters change
  useEffect(() => {
    resetSimulation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lightIntensity, co2Concentration, temperature, showLightReactions, showDarkReactions]);
  
  // Reset the simulation with new parameters
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const newMolecules: Molecule[] = [];
    let nextId = 0;
    
    // Add CO2 molecules based on concentration
    const co2Count = Math.round(co2Concentration * 3);
    for (let i = 0; i < co2Count; i++) {
      newMolecules.push({
        id: nextId++,
        type: 'co2',
        x: Math.random() * width,
        y: Math.random() * height * 0.3 + height * 0.1,
        vx: (Math.random() - 0.5) * 1 * (temperature / 25),
        vy: (Math.random() - 0.5) * 1 * (temperature / 25),
        stage: 'environment'
      });
    }
    
    // Add water molecules
    const waterCount = 30;
    for (let i = 0; i < waterCount; i++) {
      newMolecules.push({
        id: nextId++,
        type: 'h2o',
        x: Math.random() * width,
        y: Math.random() * height * 0.3 + height * 0.6,
        vx: (Math.random() - 0.5) * 1.2 * (temperature / 25),
        vy: (Math.random() - 0.5) * 1.2 * (temperature / 25),
        stage: 'environment'
      });
    }
    
    setMolecules(newMolecules);
    setAtpCount(0);
    setGlucoseCount(0);
    setO2Count(0);
    
    animate();
  };
  
  // Animation loop
  const animate = () => {
    if (isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    setMolecules(prevMolecules => {
      const newMolecules = [...prevMolecules];
      let newAtpProduced = 0;
      let newGlucoseProduced = 0;
      let newO2Produced = 0;
      
      // Process light reactions when light is present
      if (showLightReactions && lightIntensity > 10) {
        const lightReactionProbability = lightIntensity / 100 * (temperature / 25);
        
        // Find water molecules to use in light reactions
        const waterMolecules = newMolecules.filter(m => m.type === 'h2o' && m.stage === 'environment');
        for (let i = 0; i < Math.min(waterMolecules.length, Math.round(lightReactionProbability * 3)); i++) {
          const waterMolecule = waterMolecules[i];
          
          // Move water to light reaction stage
          waterMolecule.stage = 'lightReaction';
          waterMolecule.x = width * 0.3 + Math.random() * 50;
          waterMolecule.y = height * 0.4 + Math.random() * 50;
          
          // Create ATP
          if (Math.random() < lightReactionProbability) {
            newMolecules.push({
              id: Math.max(...newMolecules.map(m => m.id)) + 1,
              type: 'atp',
              x: width * 0.3 + Math.random() * 50,
              y: height * 0.4 + Math.random() * 50,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              stage: 'lightReaction'
            });
            newAtpProduced++;
          }
          
          // Create NADPH
          if (Math.random() < lightReactionProbability * 0.8) {
            newMolecules.push({
              id: Math.max(...newMolecules.map(m => m.id)) + 1,
              type: 'nadph',
              x: width * 0.3 + Math.random() * 50,
              y: height * 0.4 + Math.random() * 50,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              stage: 'lightReaction'
            });
          }
          
          // Create oxygen as byproduct
          if (Math.random() < lightReactionProbability * 0.7) {
            newMolecules.push({
              id: Math.max(...newMolecules.map(m => m.id)) + 1,
              type: 'o2',
              x: width * 0.3 + Math.random() * 50,
              y: height * 0.4 + Math.random() * 50,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              stage: 'environment'
            });
            newO2Produced++;
          }
        }
      }
      
      // Process Calvin cycle (dark reactions)
      if (showDarkReactions) {
        const calvinCycleProbability = (co2Concentration / 100) * (temperature / 30) * 0.8;
        
        // Find CO2, ATP and NADPH for Calvin cycle
        const co2Molecules = newMolecules.filter(m => m.type === 'co2' && m.stage === 'environment');
        const atpMolecules = newMolecules.filter(m => m.type === 'atp' && m.stage === 'lightReaction');
        const nadphMolecules = newMolecules.filter(m => m.type === 'nadph' && m.stage === 'lightReaction');
        
        // Need at least 3 CO2, 9 ATP, and 6 NADPH to create 1 glucose molecule
        const maxGlucosePossible = Math.floor(Math.min(
          co2Molecules.length / 3,
          atpMolecules.length / 9,
          nadphMolecules.length / 6
        ));
        
        for (let i = 0; i < maxGlucosePossible; i++) {
          if (Math.random() < calvinCycleProbability) {
            // Use up molecules
            for (let j = 0; j < 3; j++) {
              const co2Index = newMolecules.findIndex(m => m.type === 'co2' && m.stage === 'environment');
              if (co2Index >= 0) {
                newMolecules.splice(co2Index, 1);
              }
            }
            
            for (let j = 0; j < 9; j++) {
              const atpIndex = newMolecules.findIndex(m => m.type === 'atp' && m.stage === 'lightReaction');
              if (atpIndex >= 0) {
                newMolecules.splice(atpIndex, 1);
              }
            }
            
            for (let j = 0; j < 6; j++) {
              const nadphIndex = newMolecules.findIndex(m => m.type === 'nadph' && m.stage === 'lightReaction');
              if (nadphIndex >= 0) {
                newMolecules.splice(nadphIndex, 1);
              }
            }
            
            // Create glucose
            newMolecules.push({
              id: Math.max(...newMolecules.map(m => m.id)) + 1,
              type: 'glucose',
              x: width * 0.7 + Math.random() * 50,
              y: height * 0.5 + Math.random() * 50,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              stage: 'calvinCycle'
            });
            newGlucoseProduced++;
          }
        }
      }
      
      // Update positions of all molecules
      newMolecules.forEach(molecule => {
        // Apply a small amount of random motion to simulate Brownian motion
        molecule.vx += (Math.random() - 0.5) * 0.05 * (temperature / 25);
        molecule.vy += (Math.random() - 0.5) * 0.05 * (temperature / 25);
        
        // Update position
        molecule.x += molecule.vx;
        molecule.y += molecule.vy;
        
        // Boundary collisions
        if (molecule.x < 0) {
          molecule.x = 0;
          molecule.vx = -molecule.vx;
        } else if (molecule.x > width) {
          molecule.x = width;
          molecule.vx = -molecule.vx;
        }
        
        if (molecule.y < 0) {
          molecule.y = 0;
          molecule.vy = -molecule.vy;
        } else if (molecule.y > height) {
          molecule.y = height;
          molecule.vy = -molecule.vy;
        }
      });
      
      // Update ATP, glucose, and O2 counts
      if (newAtpProduced > 0) setAtpCount(prev => prev + newAtpProduced);
      if (newGlucoseProduced > 0) setGlucoseCount(prev => prev + newGlucoseProduced);
      if (newO2Produced > 0) setO2Count(prev => prev + newO2Produced);
      
      return newMolecules;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Render the simulation
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Draw cell structures
    const cellGroup = svg.append('g');
    
    // Draw chloroplast outer membrane
    cellGroup.append('ellipse')
      .attr('cx', width * 0.5)
      .attr('cy', height * 0.45)
      .attr('rx', width * 0.45)
      .attr('ry', height * 0.35)
      .attr('fill', 'rgba(230, 255, 230, 0.2)')
      .attr('stroke', '#006600')
      .attr('stroke-width', 2);
    
    // Draw thylakoid membranes (light reactions)
    if (showLightReactions) {
      const thylakoidGroup = cellGroup.append('g');
      
      // Draw stacked thylakoids
      for (let i = 0; i < 5; i++) {
        thylakoidGroup.append('ellipse')
          .attr('cx', width * 0.3)
          .attr('cy', height * 0.4 + i * 12)
          .attr('rx', 80)
          .attr('ry', 10)
          .attr('fill', 'rgba(144, 238, 144, 0.6)')
          .attr('stroke', '#006600')
          .attr('stroke-width', 1);
      }
      
      // Draw sun/light source
      svg.append('circle')
        .attr('cx', 50)
        .attr('cy', 50)
        .attr('r', 30 + lightIntensity / 10)
        .attr('fill', 'rgba(255, 255, 0, 0.7)');
      
      // Draw light rays
      const lightRays = Math.max(1, Math.floor(lightIntensity / 20));
      for (let i = 0; i < lightRays; i++) {
        const angle = (i / lightRays) * Math.PI;
        const rayLength = 80 + lightIntensity;
        
        svg.append('line')
          .attr('x1', 50)
          .attr('y1', 50)
          .attr('x2', 50 + Math.cos(angle) * rayLength)
          .attr('y2', 50 + Math.sin(angle) * rayLength)
          .attr('stroke', 'rgba(255, 255, 0, 0.5)')
          .attr('stroke-width', 2);
      }
    }
    
    // Draw stroma (dark reactions / Calvin cycle)
    if (showDarkReactions) {
      const stromaGroup = cellGroup.append('g');
      
      stromaGroup.append('ellipse')
        .attr('cx', width * 0.7)
        .attr('cy', height * 0.5)
        .attr('rx', 100)
        .attr('ry', 70)
        .attr('fill', 'rgba(144, 238, 144, 0.3)')
        .attr('stroke', '#006600')
        .attr('stroke-dasharray', '5,3')
        .attr('stroke-width', 1);
      
      stromaGroup.append('text')
        .attr('x', width * 0.7)
        .attr('y', height * 0.5 - 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text('Calvin Cycle');
    }
    
    // Draw molecules
    molecules.forEach(molecule => {
      if (molecule.type === 'co2') {
        const moleculeGroup = svg.append('g')
          .attr('transform', `translate(${molecule.x}, ${molecule.y})`);
        
        moleculeGroup.append('circle')
          .attr('r', 5)
          .attr('fill', '#333333');
        
        moleculeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', 8)
          .text('CO₂');
      } else if (molecule.type === 'o2') {
        const moleculeGroup = svg.append('g')
          .attr('transform', `translate(${molecule.x}, ${molecule.y})`);
        
        moleculeGroup.append('circle')
          .attr('r', 5)
          .attr('fill', '#6699ff');
        
        moleculeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', 8)
          .text('O₂');
      } else if (molecule.type === 'h2o') {
        const moleculeGroup = svg.append('g')
          .attr('transform', `translate(${molecule.x}, ${molecule.y})`);
        
        moleculeGroup.append('circle')
          .attr('r', 4)
          .attr('fill', '#42adf5');
        
        moleculeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', 6)
          .text('H₂O');
      } else if (molecule.type === 'glucose') {
        const moleculeGroup = svg.append('g')
          .attr('transform', `translate(${molecule.x}, ${molecule.y})`);
        
        moleculeGroup.append('circle')
          .attr('r', 7)
          .attr('fill', '#ffcc00');
        
        moleculeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#333')
          .attr('font-size', 6)
          .text('C₆H₁₂O₆');
      } else if (molecule.type === 'atp') {
        const moleculeGroup = svg.append('g')
          .attr('transform', `translate(${molecule.x}, ${molecule.y})`);
        
        moleculeGroup.append('circle')
          .attr('r', 5)
          .attr('fill', '#ff5500');
        
        moleculeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', 6)
          .text('ATP');
      } else if (molecule.type === 'nadph') {
        const moleculeGroup = svg.append('g')
          .attr('transform', `translate(${molecule.x}, ${molecule.y})`);
        
        moleculeGroup.append('circle')
          .attr('r', 5)
          .attr('fill', '#9933cc');
        
        moleculeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .attr('font-size', 6)
          .text('NADPH');
      }
    });
    
    // Draw process labels
    if (showLightReactions) {
      svg.append('text')
        .attr('x', width * 0.3)
        .attr('y', height * 0.37 - 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .text('Light Reactions');
      
      svg.append('text')
        .attr('x', width * 0.3)
        .attr('y', height * 0.37 - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .text('H₂O → O₂ + ATP + NADPH');
    }
    
    if (showDarkReactions) {
      svg.append('text')
        .attr('x', width * 0.7)
        .attr('y', height * 0.5 - 60)
        .attr('text-anchor', 'middle')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .text('Calvin Cycle');
      
      svg.append('text')
        .attr('x', width * 0.7)
        .attr('y', height * 0.5 - 45)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .text('CO₂ + ATP + NADPH → Glucose');
    }
    
    // Draw arrows connecting processes
    if (showLightReactions && showDarkReactions) {
      svg.append('path')
        .attr('d', `M ${width * 0.4}, ${height * 0.45} C ${width * 0.5}, ${height * 0.45} ${width * 0.5}, ${height * 0.5} ${width * 0.6}, ${height * 0.5}`)
        .attr('stroke', 'green')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');
      
      // Add arrowhead
      svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'green');
    }
    
    // Draw counters
    const counterGroup = svg.append('g')
      .attr('transform', `translate(10, ${height - 90})`);
    
    counterGroup.append('rect')
      .attr('width', 150)
      .attr('height', 80)
      .attr('fill', 'rgba(255, 255, 255, 0.8)')
      .attr('stroke', '#333')
      .attr('rx', 5);
    
    counterGroup.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('font-size', 12)
      .attr('font-weight', 'bold')
      .text('Products:');
    
    counterGroup.append('text')
      .attr('x', 20)
      .attr('y', 40)
      .attr('font-size', 12)
      .text(`ATP: ${atpCount}`);
    
    counterGroup.append('text')
      .attr('x', 20)
      .attr('y', 60)
      .attr('font-size', 12)
      .text(`Glucose: ${glucoseCount}`);
    
    counterGroup.append('text')
      .attr('x', 20)
      .attr('y', 80)
      .attr('font-size', 12)
      .text(`Oxygen: ${o2Count}`);
    
  }, [molecules, width, height, lightIntensity, showLightReactions, showDarkReactions, atpCount, glucoseCount, o2Count]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        setWidth(container.clientWidth);
        setHeight(Math.min(600, Math.max(500, window.innerHeight - 300)));
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
    <div ref={containerRef} className="relative w-full bg-white border border-gray-300 rounded-lg shadow">
      <div className="flex justify-between items-center p-2 bg-gray-100 border-b text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-black mr-1"></div>
            <span>CO₂</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>H₂O</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>Glucose</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-600 mr-1"></div>
            <span>ATP</span>
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
    </div>
  );
} 