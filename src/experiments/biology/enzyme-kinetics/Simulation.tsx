'use client';

import React, { useEffect, useRef } from 'react';

interface EnzymeSimulationProps {
  substrateConcentration: number;
  enzymeConcentration: number;
  temperature: number;
  pH: number;
  inhibitorPresent: boolean;
  inhibitorType: 'competitive' | 'noncompetitive' | 'uncompetitive' | 'none';
  speed: number;
  isPaused: boolean;
}

export default function EnzymeSimulation({
  substrateConcentration,
  enzymeConcentration,
  temperature,
  pH,
  inhibitorPresent,
  inhibitorType,
  speed,
  isPaused
}: EnzymeSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // Calculate reaction parameters based on inputs
  const calculateReactionRate = () => {
    // Michaelis-Menten kinetics: v = (Vmax * [S]) / (Km + [S])
    const Vmax = enzymeConcentration * 10; // Max velocity proportional to enzyme concentration
    
    // Km affected by temperature and pH (simplified model)
    let Km = 5;
    
    // Temperature affects the rate: higher temps increase rate until denaturation
    const tempEffect = temperature < 40 ? temperature / 40 : (100 - temperature) / 60;
    
    // pH affects the rate: optimal pH is around 7 for most enzymes
    const pHEffect = 1 - Math.abs(pH - 7) / 7;
    
    // Inhibitors affect kinetics
    let rateModifier = 1;
    if (inhibitorPresent) {
      switch (inhibitorType) {
        case 'competitive':
          Km = Km * 3; // Competitive inhibitors increase Km
          break;
        case 'noncompetitive':
          rateModifier = 0.5; // Noncompetitive inhibitors decrease Vmax
          break;
        case 'uncompetitive':
          Km = Km * 0.5; // Uncompetitive inhibitors decrease Km
          rateModifier = 0.7; // And also decrease Vmax
          break;
      }
    }
    
    // Final rate calculation with modifiers
    const rate = (Vmax * rateModifier * substrateConcentration * tempEffect * pHEffect) / (Km + substrateConcentration);
    return Math.max(0, rate);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Particle properties
    const substrates: any[] = [];
    const enzymes: any[] = [];
    const products: any[] = [];
    
    // Initialize particles
    const initParticles = () => {
      // Clear arrays
      substrates.length = 0;
      enzymes.length = 0;
      products.length = 0;
      
      // Create substrate particles
      for (let i = 0; i < substrateConcentration * 2; i++) {
        substrates.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 6,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: '#ff5733' // Orange for substrate
        });
      }
      
      // Create enzyme particles
      for (let i = 0; i < enzymeConcentration * 2; i++) {
        enzymes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 10,
          vx: (Math.random() - 0.5),
          vy: (Math.random() - 0.5),
          color: '#3498db', // Blue for enzyme
          bound: false,
          boundTime: 0,
          substrate: null
        });
      }
    };
    
    initParticles();
    
    // Animation logic
    let lastTime = 0;
    const reactionRate = calculateReactionRate();
    
    const animate = (time: number) => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Define the active area (cell environment)
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(20, 20, width - 40, height - 40);
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(20, 20, width - 40, height - 40);
      
      // Draw inhibitors if present
      if (inhibitorPresent) {
        const inhibitorColor = 
          inhibitorType === 'competitive' ? '#e74c3c' : // Red for competitive
          inhibitorType === 'noncompetitive' ? '#9b59b6' : // Purple for noncompetitive
          '#2ecc71'; // Green for uncompetitive
        
        for (let i = 0; i < 5; i++) {
          const x = 40 + (i * (width - 80) / 5);
          const y = 40 + (i % 2) * (height - 80) / 3;
          
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = inhibitorColor;
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.stroke();
        }
      }
      
      // Update and draw substrate particles
      for (let i = 0; i < substrates.length; i++) {
        const s = substrates[i];
        
        // Update position
        s.x += s.vx * speed;
        s.y += s.vy * speed;
        
        // Boundary check
        if (s.x < 25) { s.x = 25; s.vx *= -1; }
        if (s.x > width - 25) { s.x = width - 25; s.vx *= -1; }
        if (s.y < 25) { s.y = 25; s.vy *= -1; }
        if (s.y > height - 25) { s.y = height - 25; s.vy *= -1; }
        
        // Draw substrate
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }
      
      // Update and draw enzyme particles
      for (let i = 0; i < enzymes.length; i++) {
        const e = enzymes[i];
        
        if (!e.bound) {
          // Move freely if not bound
          e.x += e.vx * speed * 0.5;
          e.y += e.vy * speed * 0.5;
          
          // Boundary check
          if (e.x < 30) { e.x = 30; e.vx *= -1; }
          if (e.x > width - 30) { e.x = width - 30; e.vx *= -1; }
          if (e.y < 30) { e.y = 30; e.vy *= -1; }
          if (e.y > height - 30) { e.y = height - 30; e.vy *= -1; }
          
          // Check for substrate binding
          for (let j = 0; j < substrates.length; j++) {
            const s = substrates[j];
            const dx = e.x - s.x;
            const dy = e.y - s.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Bind if close enough
            if (distance < e.size + s.size) {
              e.bound = true;
              e.substrate = j;
              e.boundTime = 0;
              break;
            }
          }
        } else {
          // Process the bound substrate
          e.boundTime += deltaTime * speed * (temperature / 30);
          
          // Check if processing is complete
          if (e.boundTime > 2000) {
            // Create product
            products.push({
              x: e.x + (Math.random() - 0.5) * 20,
              y: e.y + (Math.random() - 0.5) * 20,
              size: 4,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              color: '#2ecc71' // Green for product
            });
            
            // Remove substrate
            substrates.splice(e.substrate, 1);
            
            // Reset enzyme
            e.bound = false;
            e.substrate = null;
            e.boundTime = 0;
          } else {
            // While bound, enzyme and substrate move together
            const s = substrates[e.substrate];
            s.x = e.x;
            s.y = e.y;
            
            // Small random movement
            e.x += (Math.random() - 0.5) * speed * 0.2;
            e.y += (Math.random() - 0.5) * speed * 0.2;
          }
        }
        
        // Draw enzyme
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.bound ? '#27ae60' : e.color; // Change color when bound
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();
        
        // Draw binding animation
        if (e.bound) {
          const completion = e.boundTime / 2000;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size + 5, 0, Math.PI * 2 * completion);
          ctx.strokeStyle = '#27ae60';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
      
      // Update and draw product particles
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        
        // Update position
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        
        // Boundary check
        if (p.x < 25) { p.x = 25; p.vx *= -1; }
        if (p.x > width - 25) { p.x = width - 25; p.vx *= -1; }
        if (p.y < 25) { p.y = 25; p.vy *= -1; }
        if (p.y > height - 25) { p.y = height - 25; p.vy *= -1; }
        
        // Draw product
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      
      // Draw the legend
      ctx.fillStyle = '#fff';
      ctx.fillRect(width - 150, 10, 140, 110);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(width - 150, 10, 140, 110);
      
      // Legend items
      const legend = [
        { color: '#3498db', label: 'Enzyme' },
        { color: '#ff5733', label: 'Substrate' },
        { color: '#2ecc71', label: 'Product' }
      ];
      
      if (inhibitorPresent) {
        const inhibitorLabel = 
          inhibitorType === 'competitive' ? 'Competitive Inhibitor' : 
          inhibitorType === 'noncompetitive' ? 'Noncompetitive Inhibitor' : 
          'Uncompetitive Inhibitor';
        
        const inhibitorColor = 
          inhibitorType === 'competitive' ? '#e74c3c' : 
          inhibitorType === 'noncompetitive' ? '#9b59b6' : 
          '#2ecc71';
        
        legend.push({ color: inhibitorColor, label: inhibitorLabel });
      }
      
      // Draw legend items
      for (let i = 0; i < legend.length; i++) {
        const item = legend[i];
        const y = 30 + i * 20;
        
        // Color dot
        ctx.beginPath();
        ctx.arc(width - 130, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        
        // Label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, width - 115, y + 4);
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [substrateConcentration, enzymeConcentration, temperature, pH, inhibitorPresent, inhibitorType, speed, isPaused]);
  
  // Display current reaction rate and parameters
  const reactionRate = calculateReactionRate().toFixed(2);
  const optimalTemp = 37; // Body temperature
  const optimalPH = 7; // Neutral pH
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={500} 
        className="border rounded shadow-sm bg-white w-full h-auto"
      />
      
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        <div className="bg-blue-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Reaction Kinetics</h3>
          <div className="text-sm">
            <div><strong>Reaction Rate:</strong> {reactionRate} units/sec</div>
            <div><strong>Substrate Concentration:</strong> {substrateConcentration} mM</div>
            <div><strong>Enzyme Concentration:</strong> {enzymeConcentration} μM</div>
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Environmental Factors</h3>
          <div className="text-sm">
            <div><strong>Temperature:</strong> {temperature}°C {temperature > 45 ? "⚠️ Denaturing" : ""}</div>
            <div><strong>pH:</strong> {pH} {Math.abs(pH - 7) > 3 ? "⚠️ Suboptimal" : ""}</div>
            <div>
              <strong>Inhibition:</strong> {
                inhibitorPresent ? 
                (inhibitorType.charAt(0).toUpperCase() + inhibitorType.slice(1) + " inhibitor present") : 
                "None"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 