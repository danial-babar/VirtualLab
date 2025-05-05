'use client';

import React, { useEffect, useRef, useState } from 'react';

interface NeuralSignalingSimulationProps {
  membraneVoltage: number;
  threshold: number;
  stimulationFrequency: number;
  neurotransmitterAmount: number;
  showLabels: boolean;
  isPaused: boolean;
}

export default function NeuralSignalingSimulation({
  membraneVoltage,
  threshold,
  stimulationFrequency,
  neurotransmitterAmount,
  showLabels,
  isPaused
}: NeuralSignalingSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // State for tracking action potentials and current voltage
  const [currentVoltage, setCurrentVoltage] = useState(membraneVoltage);
  const [actionPotentialInProgress, setActionPotentialInProgress] = useState(false);
  const [actionPotentialStage, setActionPotentialStage] = useState(0);
  const [actionPotentialHistory, setActionPotentialHistory] = useState<number[]>(Array(200).fill(membraneVoltage));
  
  // Neurotransmitters and synaptic vesicles
  const [neurotransmitters, setNeurotransmitters] = useState<{x: number, y: number, released: boolean}[]>([]);
  
  // Trigger stimulation effect from outside
  useEffect(() => {
    // Stimulate based on frequency
    const interval = setInterval(() => {
      if (!isPaused && !actionPotentialInProgress && stimulationFrequency > 0) {
        triggerActionPotential();
      }
    }, 1000 / stimulationFrequency);
    
    return () => clearInterval(interval);
  }, [stimulationFrequency, isPaused, actionPotentialInProgress]);
  
  // Function to trigger an action potential
  const triggerActionPotential = () => {
    if (!actionPotentialInProgress) {
      setActionPotentialInProgress(true);
      setActionPotentialStage(0);
    }
  };
  
  useEffect(() => {
    // Reset to resting potential when parameters change
    if (!actionPotentialInProgress) {
      setCurrentVoltage(membraneVoltage);
      setActionPotentialHistory(Array(200).fill(membraneVoltage));
    }
  }, [membraneVoltage]);
  
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
    
    const animate = (time: number) => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Clear canvases
      ctx.clearRect(0, 0, width, height);
      graphCtx.clearRect(0, 0, graphWidth, graphHeight);
      
      // Draw neural structures
      drawNeurons(ctx, width, height);
      
      // Update and draw action potential stages
      if (actionPotentialInProgress) {
        updateActionPotential(deltaTime);
      }
      
      // Draw the voltage graph
      drawVoltageGraph(graphCtx, graphWidth, graphHeight);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Draw presynaptic and postsynaptic neurons
    const drawNeurons = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Background and cell membrane
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Presynaptic neuron (axon terminal)
      const presynapticX = width * 0.3;
      const presynapticY = height * 0.3;
      const presynapticWidth = width * 0.4;
      const presynapticHeight = height * 0.3;
      
      ctx.fillStyle = '#d4f1f9'; // Light blue for presynaptic neuron
      ctx.beginPath();
      ctx.ellipse(presynapticX, presynapticY, presynapticWidth / 2, presynapticHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Axon
      const axonStartX = presynapticX - presynapticWidth / 2;
      const axonStartY = presynapticY;
      const axonEndX = presynapticX - width * 0.3;
      const axonEndY = presynapticY;
      
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(axonStartX, axonStartY);
      ctx.lineTo(axonEndX, axonEndY);
      ctx.stroke();
      
      // Postsynaptic neuron (dendrite)
      const postsynapticX = width * 0.7;
      const postsynapticY = height * 0.7;
      const postsynapticWidth = width * 0.5;
      const postsynapticHeight = height * 0.35;
      
      ctx.fillStyle = '#ffe6e6'; // Light red for postsynaptic neuron
      ctx.beginPath();
      ctx.ellipse(postsynapticX, postsynapticY, postsynapticWidth / 2, postsynapticHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Synaptic cleft
      const cleftWidth = width * 0.1;
      const cleftX = width / 2 - cleftWidth / 2;
      const cleftY = height / 2;
      const cleftHeight = height * 0.2;
      
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(cleftX, cleftY, cleftWidth, cleftHeight);
      
      // Vesicles in presynaptic neuron
      const numVesicles = Math.ceil(neurotransmitterAmount / 2);
      for (let i = 0; i < numVesicles; i++) {
        const vesicleX = presynapticX + (Math.random() - 0.5) * presynapticWidth * 0.5;
        const vesicleY = presynapticY + presynapticHeight * 0.2;
        
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(vesicleX, vesicleY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw neurotransmitters in synaptic cleft
      ctx.fillStyle = '#e74c3c';
      neurotransmitters.forEach(nt => {
        ctx.beginPath();
        ctx.arc(nt.x, nt.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Ion channels in postsynaptic membrane
      const channelCount = 5;
      const channelSpacing = cleftWidth / (channelCount + 1);
      
      for (let i = 0; i < channelCount; i++) {
        const channelX = cleftX + channelSpacing * (i + 1);
        const channelY = cleftY + cleftHeight;
        
        // Channel shape
        ctx.fillStyle = '#3498db';
        ctx.fillRect(channelX - 5, channelY - 5, 10, 10);
        
        // Channel opening
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.arc(channelX, channelY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Labels
      if (showLabels) {
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        
        ctx.fillText('Presynaptic Neuron', presynapticX, presynapticY - presynapticHeight / 2 - 10);
        ctx.fillText('Postsynaptic Neuron', postsynapticX, postsynapticY + postsynapticHeight / 2 + 20);
        ctx.fillText('Synaptic Cleft', width / 2, cleftY + cleftHeight / 2);
        ctx.fillText('Axon', axonEndX + (axonStartX - axonEndX) / 2, axonStartY - 10);
        
        // Voltage indicator
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.fillText(`Membrane Potential: ${Math.round(currentVoltage)} mV`, 10, 20);
        ctx.fillText(`Threshold: ${threshold} mV`, 10, 40);
      }
    };
    
    // Update action potential states
    const updateActionPotential = (deltaTime: number) => {
      const stage = actionPotentialStage;
      
      // Complete action potential cycle
      if (stage === 0) {
        // Depolarization
        setCurrentVoltage(prev => {
          const newVoltage = prev + deltaTime * 0.5;
          if (newVoltage >= 30) {
            setActionPotentialStage(1);
            return 30;
          }
          return newVoltage;
        });
      } else if (stage === 1) {
        // Repolarization
        setCurrentVoltage(prev => {
          const newVoltage = prev - deltaTime * 0.3;
          if (newVoltage <= -80) {
            setActionPotentialStage(2);
            return -80;
          }
          return newVoltage;
        });
      } else if (stage === 2) {
        // Hyperpolarization to resting
        setCurrentVoltage(prev => {
          const newVoltage = prev + deltaTime * 0.1;
          if (newVoltage >= membraneVoltage) {
            setActionPotentialStage(0);
            setActionPotentialInProgress(false);
            // Release neurotransmitters when action potential completes
            releaseNeurotransmitters();
            return membraneVoltage;
          }
          return newVoltage;
        });
      }
      
      // Update history
      setActionPotentialHistory(prev => {
        const newHistory = [...prev.slice(1), currentVoltage];
        return newHistory;
      });
    };
    
    // Release neurotransmitters into the synaptic cleft
    const releaseNeurotransmitters = () => {
      const newNeurotransmitters = [];
      const synapticCleftX = width / 2;
      const synapticCleftY = height / 2 + height * 0.1;
      
      for (let i = 0; i < neurotransmitterAmount * 3; i++) {
        newNeurotransmitters.push({
          x: synapticCleftX + (Math.random() - 0.5) * width * 0.1,
          y: synapticCleftY + (Math.random() - 0.5) * height * 0.1,
          released: false
        });
      }
      
      setNeurotransmitters(newNeurotransmitters);
    };
    
    // Draw the voltage graph
    const drawVoltageGraph = (
      ctx: CanvasRenderingContext2D, 
      width: number, 
      height: number
    ) => {
      // Graph background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Draw axes
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      
      // Y-axis (voltage)
      ctx.beginPath();
      ctx.moveTo(40, 10);
      ctx.lineTo(40, height - 20);
      ctx.stroke();
      
      // X-axis (time)
      ctx.beginPath();
      ctx.moveTo(40, height - 20);
      ctx.lineTo(width - 10, height - 20);
      ctx.stroke();
      
      // Y-axis labels
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'right';
      
      const voltageRange = 140; // From -90 to +50
      const yPixelsPerMv = (height - 30) / voltageRange;
      
      ctx.fillText('+30 mV', 35, 20);
      ctx.fillText('0 mV', 35, height / 2);
      ctx.fillText('-90 mV', 35, height - 25);
      
      // X-axis labels
      ctx.textAlign = 'center';
      ctx.fillText('Time', width / 2, height - 5);
      
      // Draw threshold line
      const thresholdY = height - 20 - (threshold + 90) * yPixelsPerMv;
      ctx.strokeStyle = '#e74c3c';
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(40, thresholdY);
      ctx.lineTo(width - 10, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      if (showLabels) {
        ctx.fillStyle = '#e74c3c';
        ctx.textAlign = 'left';
        ctx.fillText(`Threshold (${threshold} mV)`, 45, thresholdY - 5);
      }
      
      // Plot voltage history
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < actionPotentialHistory.length; i++) {
        const voltage = actionPotentialHistory[i];
        const x = 40 + (i / actionPotentialHistory.length) * (width - 50);
        const y = height - 20 - (voltage + 90) * yPixelsPerMv;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    membraneVoltage, 
    threshold, 
    neurotransmitterAmount, 
    showLabels, 
    isPaused, 
    currentVoltage,
    actionPotentialInProgress,
    actionPotentialStage,
    actionPotentialHistory,
    neurotransmitters
  ]);
  
  return (
    <div className="flex flex-col items-center">
      {/* Neural Structures Visualization */}
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="border rounded shadow-sm bg-white w-full h-auto mb-4"
      />
      
      {/* Voltage Graph */}
      <canvas 
        ref={graphCanvasRef} 
        width={600} 
        height={200} 
        className="border rounded shadow-sm bg-white w-full h-auto"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
        <div className="bg-blue-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Action Potential Phases</h3>
          <div className="text-sm space-y-2">
            <div>
              <div className="font-medium">1. Resting State:</div>
              <div>Membrane is polarized at {membraneVoltage} mV</div>
            </div>
            <div>
              <div className="font-medium">2. Depolarization:</div>
              <div>Voltage-gated Na+ channels open, membrane potential rises</div>
            </div>
            <div>
              <div className="font-medium">3. Repolarization:</div>
              <div>K+ channels open, Na+ channels close, voltage drops</div>
            </div>
            <div>
              <div className="font-medium">4. Hyperpolarization:</div>
              <div>Membrane potential temporarily drops below resting level</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Synaptic Transmission</h3>
          <div className="text-sm space-y-2">
            <div>
              <div className="font-medium">1. Action Potential Arrival:</div>
              <div>Electrical signal reaches axon terminal</div>
            </div>
            <div>
              <div className="font-medium">2. Neurotransmitter Release:</div>
              <div>Vesicles fuse with membrane, releasing {neurotransmitterAmount} units</div>
            </div>
            <div>
              <div className="font-medium">3. Receptor Binding:</div>
              <div>Neurotransmitters bind to receptors on postsynaptic neuron</div>
            </div>
            <div>
              <div className="font-medium">4. Postsynaptic Potential:</div>
              <div>Ion channels open/close, changing membrane potential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 