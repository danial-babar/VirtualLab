'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface SimulationProps {
  divisionType: 'mitosis' | 'meiosis';
  speed: number;
  chromosomePairs: number;
  showLabels: boolean;
  isPaused: boolean;
}

interface Chromosome {
  id: number;
  pair: number;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  duplicate: boolean;
  stage: string;
}

export default function CellDivisionSimulation({
  divisionType,
  speed,
  chromosomePairs,
  showLabels,
  isPaused
}: SimulationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(700);
  const [height, setHeight] = useState(500);
  const [chromosomes, setChromosomes] = useState<Chromosome[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageTimer, setStageTimer] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Define stages of cell division
  const mitosisStages = [
    { name: 'Interphase', duration: 100 },
    { name: 'Prophase', duration: 100 },
    { name: 'Metaphase', duration: 80 },
    { name: 'Anaphase', duration: 60 },
    { name: 'Telophase', duration: 80 },
    { name: 'Cytokinesis', duration: 60 }
  ];
  
  const meiosisStages = [
    { name: 'Interphase', duration: 100 },
    { name: 'Prophase I', duration: 100 },
    { name: 'Metaphase I', duration: 80 },
    { name: 'Anaphase I', duration: 60 },
    { name: 'Telophase I', duration: 60 },
    { name: 'Prophase II', duration: 60 },
    { name: 'Metaphase II', duration: 60 },
    { name: 'Anaphase II', duration: 60 },
    { name: 'Telophase II', duration: 60 },
    { name: 'Final Result', duration: 100 }
  ];
  
  const stages = divisionType === 'mitosis' ? mitosisStages : meiosisStages;
  
  // Initialize simulation when parameters change
  useEffect(() => {
    resetSimulation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [divisionType, chromosomePairs]);
  
  // Reset the simulation
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setCurrentStage(0);
    setStageTimer(0);
    
    // Initialize chromosomes
    initializeChromosomes();
    
    animate();
  };
  
  // Initialize chromosomes based on the number of pairs
  const initializeChromosomes = () => {
    const newChromosomes: Chromosome[] = [];
    const colors = [
      '#ff5555', '#55ff55', '#5555ff', '#ffff55', 
      '#ff55ff', '#55ffff', '#ff9955', '#55ff99'
    ];
    
    // Create initial chromosomes
    for (let i = 0; i < chromosomePairs; i++) {
      // Create pair of homologous chromosomes
      for (let j = 0; j < 2; j++) {
        newChromosomes.push({
          id: i * 2 + j,
          pair: i,
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height / 2 + (Math.random() - 0.5) * 100,
          color: colors[i % colors.length],
          width: 10,
          height: 40,
          rotation: Math.random() * 360,
          duplicate: false,
          stage: 'interphase'
        });
      }
    }
    
    setChromosomes(newChromosomes);
  };
  
  // Animation loop
  const animate = () => {
    if (isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    // Update stage timer
    setStageTimer(prevTimer => {
      const newTimer = prevTimer + speed;
      
      // Check if it's time to move to the next stage
      if (newTimer >= stages[currentStage].duration) {
        setCurrentStage(prevStage => {
          const nextStage = prevStage + 1;
          
          // If we reached the end, reset to beginning
          if (nextStage >= stages.length) {
            resetSimulation();
            return 0;
          }
          
          // Update chromosomes based on the new stage
          updateChromosomesForStage(nextStage);
          
          return nextStage;
        });
        
        return 0;
      }
      
      return newTimer;
    });
    
    // Update chromosome positions based on current animation stage
    updateChromosomePositions();
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Update chromosomes for the new stage
  const updateChromosomesForStage = (stageIndex: number) => {
    const stageName = stages[stageIndex].name;
    
    setChromosomes(prevChromosomes => {
      const newChromosomes = [...prevChromosomes];
      
      if (divisionType === 'mitosis') {
        switch (stageName) {
          case 'Interphase':
            // Reset chromosomes to initial state
            return newChromosomes.map(c => ({
              ...c,
              x: width / 2 + (Math.random() - 0.5) * 100,
              y: height / 2 + (Math.random() - 0.5) * 100,
              rotation: Math.random() * 360,
              duplicate: false,
              stage: 'interphase'
            }));
            
          case 'Prophase':
            // Duplicate chromosomes
            return newChromosomes.map(c => ({
              ...c,
              duplicate: true,
              stage: 'prophase'
            }));
            
          case 'Metaphase':
            // Align chromosomes at the center
            return newChromosomes.map((c, i) => ({
              ...c,
              x: width / 2,
              y: height / 2 - 100 + ((i % chromosomePairs) * 200 / chromosomePairs),
              rotation: 0,
              stage: 'metaphase'
            }));
            
          case 'Anaphase':
            // Separate sister chromatids
            return newChromosomes.map((c, i) => {
              const isLeft = i < prevChromosomes.length / 2;
              return {
                ...c,
                x: isLeft ? width / 3 : (2 * width) / 3,
                stage: 'anaphase'
              };
            });
            
          case 'Telophase':
            // Decondense chromosomes
            return newChromosomes.map((c, i) => {
              const isLeft = i < prevChromosomes.length / 2;
              return {
                ...c,
                x: isLeft ? width / 4 : (3 * width) / 4,
                y: height / 2 + (Math.random() - 0.5) * 50,
                rotation: Math.random() * 360,
                stage: 'telophase'
              };
            });
            
          case 'Cytokinesis':
            // Form two cells
            return newChromosomes.map((c, i) => {
              const isLeft = i < prevChromosomes.length / 2;
              return {
                ...c,
                x: isLeft ? width / 4 + (Math.random() - 0.5) * 40 : (3 * width) / 4 + (Math.random() - 0.5) * 40,
                y: height / 2 + (Math.random() - 0.5) * 40,
                duplicate: false,
                stage: 'cytokinesis'
              };
            });
        }
      } else if (divisionType === 'meiosis') {
        switch (stageName) {
          case 'Interphase':
            // Reset chromosomes to initial state
            return newChromosomes.map(c => ({
              ...c,
              x: width / 2 + (Math.random() - 0.5) * 100,
              y: height / 2 + (Math.random() - 0.5) * 100,
              rotation: Math.random() * 360,
              duplicate: false,
              stage: 'interphase'
            }));
            
          case 'Prophase I':
            // Duplicate chromosomes and pair homologous chromosomes
            return newChromosomes.map((c, i) => ({
              ...c,
              duplicate: true,
              x: width / 2 + ((i % 2) === 0 ? -10 : 10),
              y: height / 2 - 100 + (Math.floor(i / 2) * 200 / chromosomePairs),
              rotation: 0,
              stage: 'prophase_i'
            }));
            
          case 'Metaphase I':
            // Align homologous pairs at the center
            return newChromosomes.map((c, i) => ({
              ...c,
              x: width / 2 + ((i % 2) === 0 ? -10 : 10),
              y: height / 2 - 100 + (Math.floor(i / 2) * 200 / chromosomePairs),
              rotation: 0,
              stage: 'metaphase_i'
            }));
            
          case 'Anaphase I':
            // Separate homologous chromosomes (not sister chromatids)
            return newChromosomes.map((c, i) => {
              const isLeft = (i % 2) === 0;
              return {
                ...c,
                x: isLeft ? width / 3 : (2 * width) / 3,
                y: height / 2 - 50 + (Math.floor(i / 4) * 100 / (chromosomePairs / 2)),
                stage: 'anaphase_i'
              };
            });
            
          case 'Telophase I':
            // Form two cells with haploid number of chromosomes
            return newChromosomes.map((c, i) => {
              const isLeft = (i % 2) === 0;
              return {
                ...c,
                x: isLeft ? width / 4 : (3 * width) / 4,
                y: height / 2 - 50 + (Math.floor(i / 4) * 100 / (chromosomePairs / 2)),
                stage: 'telophase_i'
              };
            });
            
          case 'Prophase II':
            // Prepare for second division
            return newChromosomes.map((c, i) => {
              const isTopRow = i < prevChromosomes.length / 2;
              const isLeft = (i % 2) === 0;
              return {
                ...c,
                x: isLeft ? width / 4 : (3 * width) / 4,
                y: isTopRow ? height / 4 : (3 * height) / 4,
                stage: 'prophase_ii'
              };
            });
            
          case 'Metaphase II':
            // Align chromosomes at the equator of each cell
            return newChromosomes.map((c, i) => {
              const isTopRow = i < prevChromosomes.length / 2;
              const isLeft = (i % 2) === 0;
              return {
                ...c,
                x: isLeft ? width / 4 : (3 * width) / 4,
                y: isTopRow ? height / 4 : (3 * height) / 4,
                stage: 'metaphase_ii'
              };
            });
            
          case 'Anaphase II':
            // Separate sister chromatids
            return newChromosomes.map((c, i) => {
              const quadrant = Math.floor(i / (prevChromosomes.length / 4));
              const positions = [
                { x: width / 5, y: height / 5 },
                { x: (4 * width) / 5, y: height / 5 },
                { x: width / 5, y: (4 * height) / 5 },
                { x: (4 * width) / 5, y: (4 * height) / 5 }
              ];
              return {
                ...c,
                x: positions[quadrant].x,
                y: positions[quadrant].y,
                stage: 'anaphase_ii'
              };
            });
            
          case 'Telophase II':
            // Four haploid cells
            return newChromosomes.map((c, i) => {
              const quadrant = Math.floor(i / (prevChromosomes.length / 4));
              const positions = [
                { x: width / 6, y: height / 6 },
                { x: (5 * width) / 6, y: height / 6 },
                { x: width / 6, y: (5 * height) / 6 },
                { x: (5 * width) / 6, y: (5 * height) / 6 }
              ];
              return {
                ...c,
                x: positions[quadrant].x + (Math.random() - 0.5) * 20,
                y: positions[quadrant].y + (Math.random() - 0.5) * 20,
                duplicate: false,
                stage: 'telophase_ii'
              };
            });
            
          case 'Final Result':
            // Show final four haploid cells
            return newChromosomes.map((c, i) => {
              const quadrant = Math.floor(i / (prevChromosomes.length / 4));
              const positions = [
                { x: width / 6, y: height / 6 },
                { x: (5 * width) / 6, y: height / 6 },
                { x: width / 6, y: (5 * height) / 6 },
                { x: (5 * width) / 6, y: (5 * height) / 6 }
              ];
              return {
                ...c,
                x: positions[quadrant].x + (Math.random() - 0.5) * 30,
                y: positions[quadrant].y + (Math.random() - 0.5) * 30,
                rotation: Math.random() * 360,
                duplicate: false,
                stage: 'final'
              };
            });
        }
      }
      
      return newChromosomes;
    });
  };
  
  // Update chromosome positions during animation
  const updateChromosomePositions = () => {
    // Add small jittering movements to chromosomes
    setChromosomes(prevChromosomes => {
      return prevChromosomes.map(c => ({
        ...c,
        x: c.x + (Math.random() - 0.5) * 0.5,
        y: c.y + (Math.random() - 0.5) * 0.5,
        rotation: c.rotation + (Math.random() - 0.5) * 0.5
      }));
    });
  };
  
  // Render the simulation
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Draw cell boundaries
    const cellGroup = svg.append('g');
    
    if (divisionType === 'mitosis') {
      if (currentStage < 4) { // Before telophase
        // Single cell
        cellGroup.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', 150)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', currentStage >= 3 ? '5,5' : 'none'); // Dashed during anaphase
      } else {
        // Two cells
        cellGroup.append('circle')
          .attr('cx', width / 4)
          .attr('cy', height / 2)
          .attr('r', 100)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2);
        
        cellGroup.append('circle')
          .attr('cx', (3 * width) / 4)
          .attr('cy', height / 2)
          .attr('r', 100)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2);
      }
    } else if (divisionType === 'meiosis') {
      if (currentStage < 4) { // Before telophase I
        // Single cell
        cellGroup.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', 150)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', currentStage >= 3 ? '5,5' : 'none');
      } else if (currentStage < 7) { // Before anaphase II
        // Two cells
        cellGroup.append('circle')
          .attr('cx', width / 4)
          .attr('cy', height / 2)
          .attr('r', 100)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', currentStage >= 6 ? '5,5' : 'none');
        
        cellGroup.append('circle')
          .attr('cx', (3 * width) / 4)
          .attr('cy', height / 2)
          .attr('r', 100)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', currentStage >= 6 ? '5,5' : 'none');
      } else {
        // Four cells
        cellGroup.append('circle')
          .attr('cx', width / 6)
          .attr('cy', height / 6)
          .attr('r', 70)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2);
        
        cellGroup.append('circle')
          .attr('cx', (5 * width) / 6)
          .attr('cy', height / 6)
          .attr('r', 70)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2);
        
        cellGroup.append('circle')
          .attr('cx', width / 6)
          .attr('cy', (5 * height) / 6)
          .attr('r', 70)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2);
        
        cellGroup.append('circle')
          .attr('cx', (5 * width) / 6)
          .attr('cy', (5 * height) / 6)
          .attr('r', 70)
          .attr('fill', 'none')
          .attr('stroke', '#999')
          .attr('stroke-width', 2);
      }
    }
    
    // Draw chromosomes
    const chromatidSpacing = 5;
    
    chromosomes.forEach(chromosome => {
      const chromosomeGroup = svg.append('g')
        .attr('transform', `translate(${chromosome.x}, ${chromosome.y}) rotate(${chromosome.rotation})`);
      
      if (chromosome.duplicate) {
        // Sister chromatids
        chromosomeGroup.append('rect')
          .attr('x', -chromosome.width / 2 - chromatidSpacing)
          .attr('y', -chromosome.height / 2)
          .attr('width', chromosome.width)
          .attr('height', chromosome.height)
          .attr('fill', chromosome.color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('rx', 4);
        
        chromosomeGroup.append('rect')
          .attr('x', chromatidSpacing - chromosome.width / 2)
          .attr('y', -chromosome.height / 2)
          .attr('width', chromosome.width)
          .attr('height', chromosome.height)
          .attr('fill', chromosome.color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('rx', 4);
        
        // Centromere
        chromosomeGroup.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 4)
          .attr('fill', '#333');
      } else {
        // Single chromosome
        chromosomeGroup.append('rect')
          .attr('x', -chromosome.width / 2)
          .attr('y', -chromosome.height / 2)
          .attr('width', chromosome.width)
          .attr('height', chromosome.height)
          .attr('fill', chromosome.color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('rx', 4);
        
        // Centromere
        chromosomeGroup.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 3)
          .attr('fill', '#333');
      }
      
      // Add chromosome number/label if enabled
      if (showLabels) {
        chromosomeGroup.append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', 10)
          .attr('fill', 'white')
          .attr('font-weight', 'bold')
          .text(chromosome.pair + 1);
      }
    });
    
    // Draw stage information
    svg.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 150)
      .attr('height', 50)
      .attr('fill', 'rgba(255, 255, 255, 0.8)')
      .attr('stroke', '#333')
      .attr('rx', 5);
    
    svg.append('text')
      .attr('x', 15)
      .attr('y', 30)
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
      .text(`Stage: ${stages[currentStage].name}`);
    
    svg.append('text')
      .attr('x', 15)
      .attr('y', 50)
      .attr('font-size', 12)
      .text(`Type: ${divisionType.charAt(0).toUpperCase() + divisionType.slice(1)}`);
    
    // Draw progress bar
    const progressBarWidth = 200;
    svg.append('rect')
      .attr('x', width - progressBarWidth - 20)
      .attr('y', 20)
      .attr('width', progressBarWidth)
      .attr('height', 10)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('rx', 5);
    
    svg.append('rect')
      .attr('x', width - progressBarWidth - 20)
      .attr('y', 20)
      .attr('width', (progressBarWidth * stageTimer) / stages[currentStage].duration)
      .attr('height', 10)
      .attr('fill', '#4CAF50')
      .attr('rx', 5);
    
  }, [chromosomes, width, height, divisionType, currentStage, stageTimer, stages, showLabels]);
  
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
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Chromosome Pair 1</span>
          </div>
          {chromosomePairs > 1 && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Chromosome Pair 2</span>
            </div>
          )}
          {chromosomePairs > 2 && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Chromosome Pair 3</span>
            </div>
          )}
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