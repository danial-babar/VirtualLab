'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface Props {
  initialVelocity: number; // in m/s
  launchAngle: number; // in degrees
  gravity: number; // in m/s²
  airResistance: number; // coefficient 0-1
  height: number; // initial height in meters
}

interface Point {
  x: number;
  y: number;
  t: number;
}

// Main simulation component
function ProjectileSimulationContent({
  initialVelocity,
  launchAngle,
  gravity,
  airResistance,
  height,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trajectory, setTrajectory] = useState<Point[]>([]);
  const [maxRange, setMaxRange] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [flightTime, setFlightTime] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate the projectile trajectory whenever parameters change
  useEffect(() => {
    // Convert angle to radians
    const angleRad = (launchAngle * Math.PI) / 180;
    
    // Initial velocity components
    const v0x = initialVelocity * Math.cos(angleRad);
    const v0y = initialVelocity * Math.sin(angleRad);
    
    // Calculate trajectory
    const points: Point[] = [];
    let t = 0;
    const dt = 0.05; // time step in seconds
    let maxY = height;
    let reachedGround = false;
    
    // For numerical integration with air resistance
    let x = 0;
    let y = height;
    let vx = v0x;
    let vy = v0y;
    
    while (!reachedGround && points.length < 1000) {
      points.push({ x, y, t });
      
      // Update velocities with air resistance
      const v = Math.sqrt(vx * vx + vy * vy);
      const ax = -airResistance * v * vx;
      const ay = -gravity - airResistance * v * vy;
      
      // Update positions and velocities (Euler method)
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      
      // Track maximum height
      if (y > maxY) maxY = y;
      
      // Check if projectile has hit the ground
      if (y < 0) {
        // Final point at ground level (y=0)
        const tGround = t + (-points[points.length - 1].y) / vy;
        const xGround = points[points.length - 1].x + vx * (-points[points.length - 1].y) / vy;
        points.push({ x: xGround, y: 0, t: tGround });
        reachedGround = true;
      }
      
      t += dt;
    }
    
    setTrajectory(points);
    setMaxHeight(maxY);
    
    // Get range and flight time from the last point
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      setMaxRange(lastPoint.x);
      setFlightTime(lastPoint.t);
    }
  }, [initialVelocity, launchAngle, gravity, airResistance, height]);
  
  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (trajectory.length === 0) return;
    
    // Scale factors to fit trajectory in canvas
    const padding = 20;
    const scaleX = (canvas.width - 2 * padding) / maxRange;
    const scaleY = (canvas.height - 2 * padding) / Math.max(maxHeight, 1);
    const scale = Math.min(scaleX, scaleY);
    
    // Draw ground
    ctx.fillStyle = '#8B4513'; // brown
    ctx.fillRect(0, canvas.height - padding, canvas.width, padding);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines (distance markers)
    const gridSpacingX = Math.max(Math.round(maxRange / 5), 1);
    for (let x = 0; x <= Math.ceil(maxRange); x += gridSpacingX) {
      ctx.beginPath();
      ctx.moveTo(padding + x * scale, padding);
      ctx.lineTo(padding + x * scale, canvas.height - padding);
      ctx.stroke();
      
      // Distance labels
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.fillText(`${x}m`, padding + x * scale, canvas.height - 5);
    }
    
    // Horizontal grid lines (height markers)
    const gridSpacingY = Math.max(Math.round(maxHeight / 5), 1);
    for (let y = 0; y <= Math.ceil(maxHeight); y += gridSpacingY) {
      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding - y * scale);
      ctx.lineTo(canvas.width - padding, canvas.height - padding - y * scale);
      ctx.stroke();
      
      // Height labels
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.fillText(`${y}m`, 5, canvas.height - padding - y * scale);
    }
    
    // Draw trajectory
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    trajectory.forEach((point, i) => {
      const canvasX = padding + point.x * scale;
      const canvasY = canvas.height - padding - point.y * scale;
      
      if (i === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    });
    ctx.stroke();
    
    // Draw projectile
    if (isAnimating && trajectory.length > 0) {
      const frameIndex = Math.min(
        animationFrame, 
        trajectory.length - 1
      );
      const point = trajectory[frameIndex];
      const canvasX = padding + point.x * scale;
      const canvasY = canvas.height - padding - point.y * scale;
      
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [trajectory, maxHeight, maxRange, animationFrame, isAnimating]);
  
  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    if (isAnimating && trajectory.length > 0) {
      let lastTime = 0;
      const animate = (time: number) => {
        if (!lastTime) lastTime = time;
        const deltaTime = time - lastTime;
        
        // Advance animation frame every 30ms for appropriate speed
        if (deltaTime > 30) {
          setAnimationFrame(prev => {
            if (prev >= trajectory.length - 1) {
              setIsAnimating(false);
              return 0;
            }
            return prev + 1;
          });
          lastTime = time;
        }
        
        if (isAnimating) {
          animationId = requestAnimationFrame(animate);
        }
      };
      
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isAnimating, trajectory]);
  
  const handlePlayPause = () => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      setAnimationFrame(0);
      setIsAnimating(true);
    }
  };
  
  return (
    <div className="w-full">
      <div className="relative border rounded bg-white mb-3">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="w-full h-auto"
        />
        
        {/* Playback controls */}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded shadow flex items-center">
          <button 
            onClick={handlePlayPause}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
          >
            {isAnimating ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Range:</span> {maxRange.toFixed(2)}m
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Max Height:</span> {maxHeight.toFixed(2)}m
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Flight Time:</span> {flightTime.toFixed(2)}s
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const ProjectileSimulation = dynamic(() => Promise.resolve(ProjectileSimulationContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] border rounded bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading simulation...</div>
    </div>
  )
});

export default ProjectileSimulation; 