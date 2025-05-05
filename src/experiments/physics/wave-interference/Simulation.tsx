'use client';

import { useEffect, useRef } from 'react';

interface Props {
  amplitude1: number;
  amplitude2: number;
  frequency1: number;
  frequency2: number;
  phaseShift: number;
  showComponents: boolean;
}

export default function WaveSimulation({
  amplitude1,
  amplitude2,
  frequency1,
  frequency2,
  phaseShift,
  showComponents
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
    const maxAmplitude1 = height / 4 * (amplitude1 / 100);
    const maxAmplitude2 = height / 4 * (amplitude2 / 100);
    const phaseShiftRad = (phaseShift / 180) * Math.PI;
    
    // Draw x-axis
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Function to calculate the y position for a given wave
    const calculateWaveY = (x: number, freq: number, amp: number, phase: number = 0) => {
      const wavelength = width / (freq + 0.5); // Prevent division by zero
      const position = (x / wavelength) * 2 * Math.PI + phase;
      return Math.sin(position) * amp;
    };
    
    // Draw first wave if showing components
    if (showComponents) {
      ctx.strokeStyle = 'rgba(52, 152, 219, 0.7)'; // Blue
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const y = calculateWaveY(x, frequency1, maxAmplitude1);
        
        if (x === 0) {
          ctx.moveTo(x, centerY + y);
        } else {
          ctx.lineTo(x, centerY + y);
        }
      }
      
      ctx.stroke();
      
      // Draw second wave if showing components
      ctx.strokeStyle = 'rgba(46, 204, 113, 0.7)'; // Green
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const y = calculateWaveY(x, frequency2, maxAmplitude2, phaseShiftRad);
        
        if (x === 0) {
          ctx.moveTo(x, centerY + y);
        } else {
          ctx.lineTo(x, centerY + y);
        }
      }
      
      ctx.stroke();
    }
    
    // Draw resultant wave (interference pattern)
    ctx.strokeStyle = '#e74c3c'; // Red
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      const y1 = calculateWaveY(x, frequency1, maxAmplitude1);
      const y2 = calculateWaveY(x, frequency2, maxAmplitude2, phaseShiftRad);
      const resultantY = y1 + y2; // Superposition principle
      
      if (x === 0) {
        ctx.moveTo(x, centerY + resultantY);
      } else {
        ctx.lineTo(x, centerY + resultantY);
      }
    }
    
    ctx.stroke();
    
    // Identify regions of constructive and destructive interference
    if (frequency1 === frequency2 && maxAmplitude1 > 0 && maxAmplitude2 > 0) {
      // Draw annotation for constructive/destructive interference
      const annotations: { x: number, y: number, type: string }[] = [];
      
      // Analyze the wave to find key interference points
      for (let x = 50; x < width - 50; x += width / 6) {
        const y1 = calculateWaveY(x, frequency1, maxAmplitude1);
        const y2 = calculateWaveY(x, frequency2, maxAmplitude2, phaseShiftRad);
        const resultantY = y1 + y2;
        
        // Determine if constructive or destructive based on amplitude
        const expectedMax = maxAmplitude1 + maxAmplitude2;
        const ratio = Math.abs(resultantY) / expectedMax;
        
        if (ratio > 0.9) {
          annotations.push({ x, y: centerY + resultantY, type: 'Constructive' });
        } else if (ratio < 0.2 && maxAmplitude1 > 10 && maxAmplitude2 > 10) {
          annotations.push({ x, y: centerY, type: 'Destructive' });
        }
      }
      
      // Draw the annotations
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      annotations.forEach(({ x, y, type }) => {
        if (type === 'Constructive') {
          ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillText('Constructive', x, y > centerY ? y + 20 : y - 10);
        } else {
          ctx.fillStyle = 'rgba(52, 73, 94, 0.7)';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillText('Destructive', x, y + 20);
        }
      });
    }
    
  }, [amplitude1, amplitude2, frequency1, frequency2, phaseShift, showComponents]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={350} 
        className="w-full h-auto border rounded bg-white"
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-100 p-3 rounded">
          <div className="font-semibold">Wave 1 (Blue):</div>
          <div>Amplitude: {amplitude1}%</div>
          <div>Frequency: {frequency1} Hz</div>
          <div>Phase: 0°</div>
        </div>
        
        <div className="bg-gray-100 p-3 rounded">
          <div className="font-semibold">Wave 2 (Green):</div>
          <div>Amplitude: {amplitude2}%</div>
          <div>Frequency: {frequency2} Hz</div>
          <div>Phase: {phaseShift}°</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm bg-gray-100 p-3 rounded">
        <div className="font-semibold">Interference Analysis:</div>
        {frequency1 === frequency2 ? (
          <div>
            {phaseShift === 0 && (
              <div>Perfect constructive interference when waves are in phase (0°)</div>
            )}
            {phaseShift === 180 && (
              <div>Perfect destructive interference when waves are out of phase (180°)</div>
            )}
            {phaseShift !== 0 && phaseShift !== 180 && (
              <div>Partial interference at phase difference of {phaseShift}°</div>
            )}
          </div>
        ) : (
          <div>Beat frequency: {Math.abs(frequency1 - frequency2)} Hz (different frequencies create beats)</div>
        )}
      </div>
    </div>
  );
} 