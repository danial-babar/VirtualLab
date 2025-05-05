'use client';

import { useEffect, useRef, useState } from 'react';

// Types for our props
interface EquilibriumSimulationProps {
  temperature: number;
  pressure: number;
  reactionType: 'exothermic' | 'endothermic';
  initialConcentrations: {
    reactantA: number;
    reactantB: number;
    productC: number;
    productD: number;
  };
  showConcentrationGraph: boolean;
  isPaused: boolean;
}

export default function EquilibriumSimulation({
  temperature,
  pressure,
  reactionType,
  initialConcentrations,
  showConcentrationGraph,
  isPaused
}: EquilibriumSimulationProps) {
  // Canvas reference for molecular animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Current concentrations
  const [currentConcentrations, setCurrentConcentrations] = useState({
    ...initialConcentrations
  });
  
  // Equilibrium constant calculation
  const [keq, setKeq] = useState(0);
  
  // Data for concentration history
  const [concentrationHistory, setConcentrationHistory] = useState({
    reactantA: [initialConcentrations.reactantA],
    reactantB: [initialConcentrations.reactantB],
    productC: [initialConcentrations.productC],
    productD: [initialConcentrations.productD],
  });
  
  // Animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);
  
  // Calculate forward and reverse rate constants based on temperature and reaction type
  const calculateRateConstants = () => {
    // Base rate constants
    let kf = 0.1; // forward rate
    let kr = 0.05; // reverse rate
    
    // Temperature effect (Arrhenius equation simplified)
    const tempFactor = Math.exp((temperature - 25) / 20);
    
    if (reactionType === 'exothermic') {
      // For exothermic, higher temp decreases forward rate, increases reverse rate
      kf = kf / tempFactor;
      kr = kr * tempFactor;
    } else {
      // For endothermic, higher temp increases forward rate, decreases reverse rate
      kf = kf * tempFactor;
      kr = kr / tempFactor;
    }
    
    // Pressure effect (simplified for gaseous reactions)
    const pressureFactor = Math.pow(pressure, 0.5);
    
    // If we assume pressure affects the side with more gaseous molecules
    // This is a simplification - in reality depends on reaction stoichiometry
    kf = kf * pressureFactor;
    
    return { kf, kr };
  };
  
  // Update simulation step
  const updateSimulation = () => {
    if (isPaused) return;
    
    // Get rate constants
    const { kf, kr } = calculateRateConstants();
    
    // Calculate reaction rates
    const forwardRate = kf * currentConcentrations.reactantA * currentConcentrations.reactantB;
    const reverseRate = kr * currentConcentrations.productC * currentConcentrations.productD;
    
    // Calculate concentration changes
    const deltaConc = (forwardRate - reverseRate) * 0.1; // 0.1 is time step
    
    // Update concentrations
    setCurrentConcentrations(prev => {
      const newConcentrations = {
        reactantA: Math.max(0, prev.reactantA - deltaConc),
        reactantB: Math.max(0, prev.reactantB - deltaConc),
        productC: Math.max(0, prev.productC + deltaConc),
        productD: Math.max(0, prev.productD + deltaConc)
      };
      
      // Calculate Keq
      if (newConcentrations.reactantA > 0 && newConcentrations.reactantB > 0) {
        setKeq((newConcentrations.productC * newConcentrations.productD) / 
              (newConcentrations.reactantA * newConcentrations.reactantB));
      }
      
      return newConcentrations;
    });
    
    // Update history
    setConcentrationHistory(prev => {
      const newHistory = {
        reactantA: [...prev.reactantA, currentConcentrations.reactantA],
        reactantB: [...prev.reactantB, currentConcentrations.reactantB],
        productC: [...prev.productC, currentConcentrations.productC],
        productD: [...prev.productD, currentConcentrations.productD],
      };
      
      // Limit history length
      if (newHistory.reactantA.length > 50) {
        Object.keys(newHistory).forEach(key => {
          newHistory[key as keyof typeof newHistory] = newHistory[key as keyof typeof newHistory].slice(-50);
        });
      }
      
      return newHistory;
    });
    
    // Render particles on canvas
    renderParticles();
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateSimulation);
  };
  
  // Render particles in canvas
  const renderParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define particle counts based on concentrations
    const totalParticles = 100;
    const totalConcentration = currentConcentrations.reactantA + 
                              currentConcentrations.reactantB + 
                              currentConcentrations.productC + 
                              currentConcentrations.productD;
    
    if (totalConcentration === 0) return;
    
    const reactantACount = Math.round((currentConcentrations.reactantA / totalConcentration) * totalParticles);
    const reactantBCount = Math.round((currentConcentrations.reactantB / totalConcentration) * totalParticles);
    const productCCount = Math.round((currentConcentrations.productC / totalConcentration) * totalParticles);
    const productDCount = totalParticles - reactantACount - reactantBCount - productCCount;
    
    // Draw particles
    drawParticles(ctx, reactantACount, 'rgb(255, 99, 132)', 10, 0, canvas.width/2, 0, canvas.height);
    drawParticles(ctx, reactantBCount, 'rgb(53, 162, 235)', 10, 0, canvas.width/2, 0, canvas.height);
    drawParticles(ctx, productCCount, 'rgb(75, 192, 192)', 10, canvas.width/2, canvas.width, 0, canvas.height);
    drawParticles(ctx, productDCount, 'rgb(255, 206, 86)', 10, canvas.width/2, canvas.width, 0, canvas.height);
    
    // Draw container divider
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.stroke();
    
    // Draw labels
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Reactants', canvas.width/4, 20);
    ctx.fillText('Products', 3*canvas.width/4, 20);
  };
  
  // Draw a number of particles in a region
  const drawParticles = (
    ctx: CanvasRenderingContext2D, 
    count: number, 
    color: string, 
    radius: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) => {
    for (let i = 0; i < count; i++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };
  
  // Simple concentration graph renderer
  const renderConcentrationGraph = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    
    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Find max concentration for scaling
    const allValues = [
      ...concentrationHistory.reactantA,
      ...concentrationHistory.reactantB,
      ...concentrationHistory.productC,
      ...concentrationHistory.productD
    ];
    const maxConc = Math.max(...allValues, 0.1);
    
    // Draw lines
    const drawLine = (data: number[], color: string) => {
      if (data.length < 2) return;
      
      ctx.beginPath();
      data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * graphWidth;
        const y = height - padding - (value / maxConc) * graphHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    
    drawLine(concentrationHistory.reactantA, 'rgb(255, 99, 132)');
    drawLine(concentrationHistory.reactantB, 'rgb(53, 162, 235)');
    drawLine(concentrationHistory.productC, 'rgb(75, 192, 192)');
    drawLine(concentrationHistory.productD, 'rgb(255, 206, 86)');
    
    return canvas.toDataURL();
  };
  
  // Start simulation on component mount
  useEffect(() => {
    // Reset concentrations when parameters change
    setCurrentConcentrations({...initialConcentrations});
    setConcentrationHistory({
      reactantA: [initialConcentrations.reactantA],
      reactantB: [initialConcentrations.reactantB],
      productC: [initialConcentrations.productC],
      productD: [initialConcentrations.productD],
    });
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(updateSimulation);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [temperature, pressure, reactionType, initialConcentrations, isPaused]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chemical Equilibrium Simulation</h2>
        <div className="bg-blue-100 px-3 py-1 rounded">
          Keq = {keq.toFixed(2)}
        </div>
      </div>
      
      <div className="mb-6">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          className="w-full border border-gray-200 rounded"
        />
      </div>
      
      {showConcentrationGraph && (
        <div className="h-64 mb-4 p-4 bg-gray-100 rounded flex items-center justify-center">
          <div className="text-center">
            {concentrationHistory.reactantA.length > 1 ? (
              <img 
                src={renderConcentrationGraph() || ''} 
                alt="Concentration Graph" 
                className="mx-auto"
              />
            ) : (
              <div>Collecting data...</div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-xs text-gray-500">Reactant A</div>
          <div className="font-medium">{currentConcentrations.reactantA.toFixed(2)} M</div>
        </div>
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-xs text-gray-500">Reactant B</div>
          <div className="font-medium">{currentConcentrations.reactantB.toFixed(2)} M</div>
        </div>
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-xs text-gray-500">Product C</div>
          <div className="font-medium">{currentConcentrations.productC.toFixed(2)} M</div>
        </div>
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-xs text-gray-500">Product D</div>
          <div className="font-medium">{currentConcentrations.productD.toFixed(2)} M</div>
        </div>
      </div>
    </div>
  );
} 