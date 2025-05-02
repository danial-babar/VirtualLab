'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  amplitude: number;
  frequency: number;
  waveType: 'sine' | 'square' | 'triangle' | 'sawtooth';
  damping: number;
  showWavelength: boolean;
}

// The main simulation component
function WaveSimulationContent({
  amplitude,
  frequency,
  waveType,
  damping,
  showWavelength
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up canvas dimensions and origin
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Wave parameters
    const wavelength = width / frequency;
    const maxAmplitude = height / 3 * (amplitude / 100);
    
    // Draw x-axis
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Draw wavelength indicator if enabled
    if (showWavelength && frequency > 0) {
      // Draw wavelength indicator arrow
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      
      const arrowStart = 50;
      const arrowEnd = arrowStart + wavelength;
      
      // Draw arrow line
      ctx.beginPath();
      ctx.moveTo(arrowStart, centerY + 40);
      ctx.lineTo(arrowEnd, centerY + 40);
      ctx.stroke();
      
      // Draw arrow heads
      ctx.beginPath();
      ctx.moveTo(arrowStart, centerY + 40);
      ctx.lineTo(arrowStart + 10, centerY + 35);
      ctx.lineTo(arrowStart + 10, centerY + 45);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(arrowEnd, centerY + 40);
      ctx.lineTo(arrowEnd - 10, centerY + 35);
      ctx.lineTo(arrowEnd - 10, centerY + 45);
      ctx.fill();
      
      // Label wavelength
      ctx.fillStyle = '#3498db';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('λ (wavelength)', (arrowStart + arrowEnd) / 2, centerY + 60);
    }
    
    // Draw wave
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      // Calculate position in wave cycle (0 to 2π)
      const position = (x / wavelength) * 2 * Math.PI;
      
      // Calculate damping factor based on x position
      const dampingFactor = 1 - (damping * x / width);
      
      // Calculate y based on wave type
      let y;
      switch (waveType) {
        case 'sine':
          y = Math.sin(position) * maxAmplitude * dampingFactor;
          break;
        case 'square':
          y = Math.sign(Math.sin(position)) * maxAmplitude * dampingFactor;
          break;
        case 'triangle':
          y = (2 / Math.PI) * Math.asin(Math.sin(position)) * maxAmplitude * dampingFactor;
          break;
        case 'sawtooth':
          y = ((position % (2 * Math.PI)) / Math.PI - 1) * maxAmplitude * dampingFactor;
          break;
        default:
          y = 0;
      }
      
      if (x === 0) {
        ctx.moveTo(x, centerY + y);
      } else {
        ctx.lineTo(x, centerY + y);
      }
    }
    
    ctx.stroke();
    
    // Draw amplitude marker
    if (amplitude > 0) {
      ctx.strokeStyle = '#9b59b6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      
      // Draw amplitude line
      ctx.beginPath();
      ctx.moveTo(25, centerY);
      ctx.lineTo(25, centerY - maxAmplitude);
      ctx.stroke();
      
      // Reset line dash
      ctx.setLineDash([]);
      
      // Label amplitude
      ctx.fillStyle = '#9b59b6';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('A', 30, centerY - maxAmplitude / 2);
    }
    
  }, [amplitude, frequency, waveType, damping, showWavelength]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={300} 
        className="w-full h-auto border rounded bg-white"
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-100 p-3 rounded">
          <div className="font-semibold">Wave Properties:</div>
          <div>Type: {waveType}</div>
          <div>Amplitude: {amplitude}%</div>
          <div>Frequency: {frequency} Hz</div>
          <div>Damping: {damping}</div>
        </div>
        
        <div className="bg-gray-100 p-3 rounded">
          <div className="font-semibold">Derived Values:</div>
          <div>Period: {frequency > 0 ? (1 / frequency).toFixed(4) : 'N/A'} s</div>
          <div>Wavelength: {frequency > 0 ? (300 / frequency).toFixed(2) : 'N/A'} m</div>
          <div>Wave Speed: 300 m/s (assumed)</div>
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const WaveSimulation = dynamic(() => Promise.resolve(WaveSimulationContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] border rounded bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading wave simulation...</div>
    </div>
  )
});

export default WaveSimulation; 