'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PopulationGeneticsSimulationProps {
  populationSize: number;
  initialFrequency: number;
  selectionCoefficient: number;
  mutationRate: number;
  migrationRate: number;
  generationsPerSecond: number;
  isPaused: boolean;
  showLegend: boolean;
  selectionMode: 'neutral' | 'positive' | 'negative' | 'balancing';
}

interface Genotype {
  count: number;
  fitness: number;
}

export default function PopulationGeneticsSimulation({
  populationSize,
  initialFrequency,
  selectionCoefficient,
  mutationRate,
  migrationRate,
  generationsPerSecond,
  isPaused,
  showLegend,
  selectionMode
}: PopulationGeneticsSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // State for tracking population genetics over time
  const [generation, setGeneration] = useState(0);
  const [alleleFrequency, setAlleleFrequency] = useState(initialFrequency);
  const [alleleFrequencyHistory, setAlleleFrequencyHistory] = useState<number[]>([initialFrequency]);
  const [genotypes, setGenotypes] = useState<{AA: Genotype, Aa: Genotype, aa: Genotype}>({
    AA: { count: 0, fitness: 1 },
    Aa: { count: 0, fitness: 1 },
    aa: { count: 0, fitness: 1 }
  });
  
  // Reset the simulation when parameters change
  useEffect(() => {
    setGeneration(0);
    setAlleleFrequency(initialFrequency);
    setAlleleFrequencyHistory([initialFrequency]);
    updateGenotypeCounts(initialFrequency);
  }, [initialFrequency, populationSize]);
  
  // Update genotype counts based on allele frequency and population size
  const updateGenotypeCounts = (frequency: number) => {
    // Hardy-Weinberg proportions: p^2 + 2pq + q^2 = 1
    const p = frequency; // Frequency of allele A
    const q = 1 - p; // Frequency of allele a
    
    // Calculate genotype frequencies
    const freqAA = p * p;
    const freqAa = 2 * p * q;
    const freqaa = q * q;
    
    // Calculate genotype counts
    const countAA = Math.round(freqAA * populationSize);
    const countAa = Math.round(freqAa * populationSize);
    // Ensure the total adds up to populationSize
    const countaa = populationSize - countAA - countAa;
    
    // Set fitness values based on selection mode
    let fitnessAA = 1;
    let fitnessAa = 1;
    let fitnessaa = 1;
    
    switch(selectionMode) {
      case 'positive':
        // Dominant allele (A) is advantageous
        fitnessAA = 1;
        fitnessAa = 1;
        fitnessaa = 1 - selectionCoefficient;
        break;
      case 'negative':
        // Dominant allele (A) is disadvantageous
        fitnessAA = 1 - selectionCoefficient;
        fitnessAa = 1 - selectionCoefficient;
        fitnessaa = 1;
        break;
      case 'balancing':
        // Heterozygote advantage
        fitnessAA = 1 - selectionCoefficient * 0.5;
        fitnessAa = 1;
        fitnessaa = 1 - selectionCoefficient * 0.5;
        break;
      case 'neutral':
      default:
        // No selection
        fitnessAA = 1;
        fitnessAa = 1;
        fitnessaa = 1;
    }
    
    setGenotypes({
      AA: { count: countAA, fitness: fitnessAA },
      Aa: { count: countAa, fitness: fitnessAa },
      aa: { count: countaa, fitness: fitnessaa }
    });
  };
  
  // Update fitness values when selection parameters change
  useEffect(() => {
    // Update fitness without changing counts
    setGenotypes(prev => {
      const { AA, Aa, aa } = prev;
      let fitnessAA = 1;
      let fitnessAa = 1;
      let fitnessaa = 1;
      
      switch(selectionMode) {
        case 'positive':
          fitnessAA = 1;
          fitnessAa = 1;
          fitnessaa = 1 - selectionCoefficient;
          break;
        case 'negative':
          fitnessAA = 1 - selectionCoefficient;
          fitnessAa = 1 - selectionCoefficient;
          fitnessaa = 1;
          break;
        case 'balancing':
          fitnessAA = 1 - selectionCoefficient * 0.5;
          fitnessAa = 1;
          fitnessaa = 1 - selectionCoefficient * 0.5;
          break;
        case 'neutral':
        default:
          fitnessAA = 1;
          fitnessAa = 1;
          fitnessaa = 1;
      }
      
      return {
        AA: { ...AA, fitness: fitnessAA },
        Aa: { ...Aa, fitness: fitnessAa },
        aa: { ...aa, fitness: fitnessaa }
      };
    });
  }, [selectionCoefficient, selectionMode]);
  
  // Simulation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const graphCanvas = graphCanvasRef.current;
    if (!canvas || !graphCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const graphCtx = graphCanvas.getContext('2d');
    if (!ctx || !graphCtx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const graphWidth = graphCanvas.width;
    const graphHeight = graphCanvas.height;
    
    // Animation timing
    let lastTime = 0;
    let timeAccumulator = 0;
    
    const animate = (time: number) => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Accumulate time and advance generation when enough time has passed
      timeAccumulator += deltaTime;
      const generationTime = 1000 / generationsPerSecond;
      
      if (timeAccumulator >= generationTime) {
        timeAccumulator -= generationTime;
        advanceGeneration();
      }
      
      // Clear canvases
      ctx.clearRect(0, 0, width, height);
      graphCtx.clearRect(0, 0, graphWidth, graphHeight);
      
      // Draw population visualization
      drawPopulation(ctx, width, height);
      
      // Draw allele frequency graph
      drawFrequencyGraph(graphCtx, graphWidth, graphHeight);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Advance the simulation by one generation
    const advanceGeneration = () => {
      // 1. Calculate fitness-weighted genotype frequencies
      const { AA, Aa, aa } = genotypes;
      const totalFitness = AA.count * AA.fitness + Aa.count * Aa.fitness + aa.count * aa.fitness;
      
      // Get the number of each genotype after selection
      let selectedAA = Math.round((AA.count * AA.fitness / totalFitness) * populationSize);
      let selectedAa = Math.round((Aa.count * Aa.fitness / totalFitness) * populationSize);
      let selectedaa = populationSize - selectedAA - selectedAa;
      
      // 2. Calculate allele frequencies after selection
      let newFreqA = (selectedAA * 2 + selectedAa) / (populationSize * 2);
      let newFreqa = 1 - newFreqA;
      
      // 3. Apply mutation
      if (mutationRate > 0) {
        // A → a mutation
        newFreqA = newFreqA * (1 - mutationRate) + newFreqa * mutationRate;
        newFreqa = 1 - newFreqA;
      }
      
      // 4. Apply migration
      if (migrationRate > 0) {
        // Migrant population has allele frequency of 0.8 for A
        const migrantFreqA = 0.8;
        newFreqA = newFreqA * (1 - migrationRate) + migrantFreqA * migrationRate;
        newFreqa = 1 - newFreqA;
      }
      
      // 5. Update allele frequency
      setAlleleFrequency(newFreqA);
      
      // 6. Update genotype counts using Hardy-Weinberg proportions
      updateGenotypeCounts(newFreqA);
      
      // 7. Update history and generation counter
      setAlleleFrequencyHistory(prev => {
        const newHistory = [...prev, newFreqA];
        // Keep only the last 200 generations
        if (newHistory.length > 200) {
          return newHistory.slice(newHistory.length - 200);
        }
        return newHistory;
      });
      
      setGeneration(prev => prev + 1);
    };
    
    // Draw population visualization
    const drawPopulation = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Draw individuals as circles in a grid
      const { AA, Aa, aa } = genotypes;
      const totalIndividuals = populationSize;
      
      // Calculate grid dimensions
      const maxCols = Math.ceil(Math.sqrt(totalIndividuals));
      const maxRows = Math.ceil(totalIndividuals / maxCols);
      
      const circleSize = Math.min(
        Math.floor((width - 40) / maxCols),
        Math.floor((height - 40) / maxRows)
      ) - 2;
      
      // Draw individuals
      let drawnCount = 0;
      
      // Function to draw batches of individuals
      const drawBatch = (count: number, color: string, label: string) => {
        for (let i = 0; i < count && drawnCount < totalIndividuals; i++) {
          const col = drawnCount % maxCols;
          const row = Math.floor(drawnCount / maxCols);
          
          const x = 20 + col * (circleSize + 2) + circleSize / 2;
          const y = 20 + row * (circleSize + 2) + circleSize / 2;
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, circleSize / 2, 0, Math.PI * 2);
          ctx.fill();
          
          drawnCount++;
        }
      };
      
      // Draw each genotype with different colors
      drawBatch(AA.count, '#3498db', 'AA (Homozygous Dominant)');
      drawBatch(Aa.count, '#9b59b6', 'Aa (Heterozygous)');
      drawBatch(aa.count, '#e74c3c', 'aa (Homozygous Recessive)');
      
      // Draw legend
      if (showLegend) {
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        // Legend box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(width - 220, 10, 210, 105);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(width - 220, 10, 210, 105);
        
        // Legend items
        const legendItems = [
          { color: '#3498db', label: 'AA (Homozygous Dominant)', count: AA.count },
          { color: '#9b59b6', label: 'Aa (Heterozygous)', count: Aa.count },
          { color: '#e74c3c', label: 'aa (Homozygous Recessive)', count: aa.count }
        ];
        
        legendItems.forEach((item, index) => {
          const y = 35 + index * 25;
          
          // Color box
          ctx.fillStyle = item.color;
          ctx.fillRect(width - 210, y - 10, 15, 15);
          
          // Label
          ctx.fillStyle = 'black';
          ctx.fillText(`${item.label}: ${item.count}`, width - 190, y);
        });
        
        // Generation counter
        ctx.fillStyle = 'black';
        ctx.fillText(`Generation: ${generation}`, 10, 20);
        
        // Allele frequency
        ctx.fillText(`Allele A Frequency: ${alleleFrequency.toFixed(3)}`, 10, 45);
        ctx.fillText(`Allele a Frequency: ${(1 - alleleFrequency).toFixed(3)}`, 10, 70);
      }
    };
    
    // Draw allele frequency graph
    const drawFrequencyGraph = (
      ctx: CanvasRenderingContext2D, 
      width: number, 
      height: number
    ) => {
      // Background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Draw axes
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      
      // Y-axis (allele frequency)
      ctx.beginPath();
      ctx.moveTo(40, 10);
      ctx.lineTo(40, height - 20);
      ctx.stroke();
      
      // X-axis (generations)
      ctx.beginPath();
      ctx.moveTo(40, height - 20);
      ctx.lineTo(width - 10, height - 20);
      ctx.stroke();
      
      // Y-axis labels
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'right';
      
      ctx.fillText('1.0', 35, 15);
      ctx.fillText('0.5', 35, height / 2);
      ctx.fillText('0.0', 35, height - 15);
      
      // X-axis label
      ctx.textAlign = 'center';
      ctx.fillText('Generations', width / 2, height - 5);
      
      // Plot allele frequency history
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // If we have history data, plot it
      if (alleleFrequencyHistory.length > 0) {
        for (let i = 0; i < alleleFrequencyHistory.length; i++) {
          const freq = alleleFrequencyHistory[i];
          const x = 40 + (i / (alleleFrequencyHistory.length - 1 || 1)) * (width - 50);
          const y = height - 20 - freq * (height - 30);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      // HW equilibrium lines
      if (showLegend) {
        // p^2 line
        ctx.strokeStyle = '#3498db';
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        
        for (let i = 0; i <= 100; i++) {
          const p = i / 100;
          const x = 40 + (i / 100) * (width - 50);
          const y = height - 20 - (p * p) * (height - 30);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add labels if enabled
        ctx.font = '10px Arial';
        ctx.fillStyle = '#3498db';
        ctx.textAlign = 'left';
        ctx.fillText('Allele A Frequency', width - 100, 20);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    populationSize,
    selectionCoefficient,
    mutationRate,
    migrationRate,
    generationsPerSecond,
    isPaused,
    showLegend,
    genotypes,
    alleleFrequency,
    alleleFrequencyHistory,
    generation
  ]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={400} 
        className="border rounded shadow-sm bg-white w-full h-auto mb-4"
      />
      
      <canvas 
        ref={graphCanvasRef} 
        width={700} 
        height={250} 
        className="border rounded shadow-sm bg-white w-full h-auto"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
        <div className="bg-blue-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Population Statistics</h3>
          <div className="text-sm space-y-1">
            <div><strong>Current Generation:</strong> {generation}</div>
            <div><strong>Population Size:</strong> {populationSize}</div>
            <div><strong>Allele Frequency (A):</strong> {alleleFrequency.toFixed(3)}</div>
            <div><strong>Allele Frequency (a):</strong> {(1 - alleleFrequency).toFixed(3)}</div>
            <div><strong>Genotype AA:</strong> {genotypes.AA.count} individuals (fitness: {genotypes.AA.fitness.toFixed(2)})</div>
            <div><strong>Genotype Aa:</strong> {genotypes.Aa.count} individuals (fitness: {genotypes.Aa.fitness.toFixed(2)})</div>
            <div><strong>Genotype aa:</strong> {genotypes.aa.count} individuals (fitness: {genotypes.aa.fitness.toFixed(2)})</div>
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Evolutionary Forces</h3>
          <div className="text-sm space-y-2">
            <div>
              <div className="font-medium">Selection Mode: {selectionMode}</div>
              <div>Selection Coefficient: {selectionCoefficient.toFixed(2)}</div>
            </div>
            <div>
              <div className="font-medium">Mutation Rate: {mutationRate.toFixed(3)}</div>
              <div>The probability of A ↔ a mutation per generation</div>
            </div>
            <div>
              <div className="font-medium">Migration Rate: {migrationRate.toFixed(2)}</div>
              <div>The proportion of the population replaced by migrants each generation</div>
            </div>
            <div>
              <div className="font-medium">Genetic Drift Effect:</div>
              <div>{populationSize < 50 ? "Strong - small population size leads to random changes" : "Weak - large population minimizes random changes"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 