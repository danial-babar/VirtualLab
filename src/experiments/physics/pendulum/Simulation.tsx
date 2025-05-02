'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  length: number; // in meters
  gravity: number; // in m/s²
  initialAngle: number; // in degrees
  damping: number; // damping coefficient (0-1)
}

// Main simulation component
function PendulumSimulationContent({ length, gravity, initialAngle, damping }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [period, setPeriod] = useState(0);
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const angleRef = useRef(initialAngle * Math.PI / 180); // Convert to radians
  const angularVelocityRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  
  // Calculate the theoretical period
  useEffect(() => {
    // T = 2π√(L/g) for small angles
    const theoreticalPeriod = 2 * Math.PI * Math.sqrt(length / gravity);
    setPeriod(theoreticalPeriod);
  }, [length, gravity]);

  // Animation loop
  const animate = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }

    const deltaTime = (time - previousTimeRef.current) / 1000; // convert to seconds
    previousTimeRef.current = time;

    // Physics update
    // Equation of motion for a pendulum: d²θ/dt² = -(g/L)sin(θ) - damping*(dθ/dt)
    const angularAcceleration = -(gravity / length) * Math.sin(angleRef.current) - damping * angularVelocityRef.current;
    angularVelocityRef.current += angularAcceleration * deltaTime;
    angleRef.current += angularVelocityRef.current * deltaTime;

    // Draw
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const pixelsPerMeter = 100; // scale
        const pivotX = canvas.width / 2;
        const pivotY = 50;
        const bobRadius = 20;
        
        // Calculate bob position
        const bobX = pivotX + Math.sin(angleRef.current) * length * pixelsPerMeter;
        const bobY = pivotY + Math.cos(angleRef.current) * length * pixelsPerMeter;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw pivot
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw string
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();
        
        // Draw bob
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw angle indicator
        ctx.strokeStyle = "#3498db";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 30, -Math.PI / 2, -Math.PI / 2 + angleRef.current, angleRef.current > 0);
        ctx.stroke();
        
        // Display angle
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.fillText(`Angle: ${(angleRef.current * 180 / Math.PI).toFixed(1)}°`, 10, 20);
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Reset when props change
  useEffect(() => {
    angleRef.current = initialAngle * Math.PI / 180;
    angularVelocityRef.current = 0;
    startTimeRef.current = null;
  }, [initialAngle, length, gravity, damping]);

  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="w-full h-auto border rounded bg-white"
      />
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="text-sm">
          <span className="font-semibold">Theoretical Period:</span> {period.toFixed(3)}s
        </div>
        <div className="text-sm">
          <span className="font-semibold">Length:</span> {length}m
        </div>
        <div className="text-sm">
          <span className="font-semibold">Gravity:</span> {gravity}m/s²
        </div>
        <div className="text-sm">
          <span className="font-semibold">Damping:</span> {damping.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const PendulumSimulation = dynamic(() => Promise.resolve(PendulumSimulationContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] border rounded bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading pendulum simulation...</div>
    </div>
  )
});

export default PendulumSimulation; 