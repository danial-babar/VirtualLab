'use client';

import React, { useEffect, useRef } from 'react';

interface BondingSimulationProps {
  bondType: 'ionic' | 'covalent' | 'metallic' | 'hydrogen';
  moleculeType: 'simple' | 'complex';
  electronegativityDiff: number;
  showElectronCloud: boolean;
  showDipoles: boolean;
  showLabels: boolean;
  rotationSpeed: number;
  isPaused: boolean;
}

export default function BondingSimulation({
  bondType,
  moleculeType,
  electronegativityDiff,
  showElectronCloud,
  showDipoles,
  showLabels,
  rotationSpeed,
  isPaused
}: BondingSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get molecule information based on current settings
  const getMoleculeInfo = () => {
    switch (bondType) {
      case 'ionic':
        return {
          name: moleculeType === 'simple' ? 'Sodium Chloride (NaCl)' : 'Calcium Fluoride (CaF₂)',
          atoms: moleculeType === 'simple' ? ['Na', 'Cl'] : ['Ca', 'F', 'F'],
          description: 'Complete electron transfer from metal to non-metal'
        };
      case 'covalent':
        return {
          name: moleculeType === 'simple' ? 'Hydrogen (H₂)' : 'Methane (CH₄)',
          atoms: moleculeType === 'simple' ? ['H', 'H'] : ['C', 'H', 'H', 'H', 'H'],
          description: 'Electron sharing between atoms'
        };
      case 'metallic':
        return {
          name: moleculeType === 'simple' ? 'Sodium (Na)' : 'Copper (Cu)',
          atoms: [bondType],
          description: 'Sea of delocalized electrons'
        };
      case 'hydrogen':
        return {
          name: moleculeType === 'simple' ? 'Water Dimer (H₂O···H₂O)' : 'DNA Base Pairs',
          atoms: moleculeType === 'simple' ? ['H', 'O', 'H', '···', 'H', 'O', 'H'] : ['Complex structure'],
          description: 'Weak attraction between H and electronegative atom'
        };
      default:
        return { name: '', atoms: [], description: '' };
    }
  };
  
  const moleculeInfo = getMoleculeInfo();

  // Simple canvas rendering of molecules
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let frameId: number | null = null;
    let angle = 0;
    
    const renderFrame = () => {
      if (!isPaused) {
        angle += 0.01 * rotationSpeed;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw based on bond type
      switch (bondType) {
        case 'ionic':
          drawIonicBond(ctx, canvas.width, canvas.height, angle);
          break;
        case 'covalent':
          drawCovalentBond(ctx, canvas.width, canvas.height, angle);
          break;
        case 'metallic':
          drawMetallicBond(ctx, canvas.width, canvas.height, angle);
          break;
        case 'hydrogen':
          drawHydrogenBond(ctx, canvas.width, canvas.height, angle);
          break;
      }
      
      frameId = requestAnimationFrame(renderFrame);
    };
    
    renderFrame();
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [bondType, moleculeType, electronegativityDiff, showElectronCloud, showDipoles, isPaused, rotationSpeed]);
  
  // Draw ionic bond visualization
  const drawIonicBond = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Positive ion (smaller)
    ctx.beginPath();
    ctx.arc(centerX - 50, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(70, 130, 180)'; // Steel blue
    ctx.fill();
    
    // Negative ion (larger)
    ctx.beginPath();
    ctx.arc(centerX + 50, centerY, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(152, 251, 152)'; // Pale green
    ctx.fill();
    
    if (showLabels) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Na⁺', centerX - 50, centerY);
      ctx.fillText('Cl⁻', centerX + 50, centerY);
    }
    
    if (showElectronCloud) {
      // Electron cloud around negative ion
      ctx.beginPath();
      ctx.arc(centerX + 50, centerY, 60, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(152, 251, 152, 0.2)';
      ctx.fill();
    }
    
    if (showDipoles) {
      // Electrostatic attraction
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY);
      ctx.lineTo(centerX + 20, centerY);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Arrow
      ctx.beginPath();
      ctx.moveTo(centerX + 10, centerY - 5);
      ctx.lineTo(centerX + 20, centerY);
      ctx.lineTo(centerX + 10, centerY + 5);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.stroke();
    }
  };
  
  // Draw covalent bond visualization
  const drawCovalentBond = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // First atom
    ctx.beginPath();
    ctx.arc(centerX - 40, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(100, 149, 237)'; // Cornflower blue
    ctx.fill();
    
    // Second atom
    ctx.beginPath();
    ctx.arc(centerX + 40, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(100, 149, 237)'; // Same color for nonpolar bond
    ctx.fill();
    
    if (showLabels) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', centerX - 40, centerY);
      ctx.fillText('H', centerX + 40, centerY);
    }
    
    // Shared electrons
    if (showElectronCloud) {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 20, 15, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Yellow electron cloud
      ctx.fill();
    }
    
    // Bond
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (showDipoles && electronegativityDiff > 0.8) {
      // Partial charges for polar covalent bond
      ctx.font = '12px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText('δ-', centerX + 40, centerY - 35);
      ctx.fillText('δ+', centerX - 40, centerY - 35);
    }
  };
  
  // Draw metallic bond visualization
  const drawMetallicBond = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 100;
    
    // Draw metal ion lattice
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = centerX - radius + i * radius;
        const y = centerY - radius + j * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(192, 192, 192)'; // Silver
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        if (showLabels) {
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Na⁺', x, y);
        }
      }
    }
    
    // Draw electron sea
    if (showElectronCloud) {
      for (let i = 0; i < 20; i++) {
        const x = centerX - radius + Math.random() * radius * 2;
        const y = centerY - radius + Math.random() * radius * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 144, 255, 0.7)'; // Blue electron dots
        ctx.fill();
      }
      
      // Electron cloud overlay
      ctx.fillStyle = 'rgba(30, 144, 255, 0.1)';
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    }
  };
  
  // Draw hydrogen bond visualization
  const drawHydrogenBond = (ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // First water molecule
    ctx.beginPath();
    ctx.arc(centerX - 70, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(255, 0, 0)'; // Red oxygen
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX - 100, centerY - 20, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(100, 149, 237)'; // Blue hydrogen
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX - 40, centerY - 20, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(100, 149, 237)'; // Blue hydrogen
    ctx.fill();
    
    // Second water molecule
    ctx.beginPath();
    ctx.arc(centerX + 70, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(255, 0, 0)'; // Red oxygen
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + 100, centerY - 20, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(100, 149, 237)'; // Blue hydrogen
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + 40, centerY - 20, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(100, 149, 237)'; // Blue hydrogen
    ctx.fill();
    
    if (showLabels) {
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillStyle = 'white';
      ctx.fillText('O', centerX - 70, centerY);
      ctx.fillText('H', centerX - 100, centerY - 20);
      ctx.fillText('H', centerX - 40, centerY - 20);
      
      ctx.fillText('O', centerX + 70, centerY);
      ctx.fillText('H', centerX + 100, centerY - 20);
      ctx.fillText('H', centerX + 40, centerY - 20);
    }
    
    // Hydrogen bond
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX - 40, centerY - 20);
    ctx.lineTo(centerX + 70, centerY);
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    
    if (showDipoles) {
      // Dipole arrows
      ctx.font = '12px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText('δ-', centerX - 70, centerY - 30);
      ctx.fillText('δ+', centerX - 40, centerY - 35);
      ctx.fillText('δ-', centerX + 70, centerY - 30);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chemical Bonding Visualization</h2>
        <div className="bg-blue-100 px-3 py-1 rounded">
          {moleculeInfo.name}
        </div>
      </div>
      
      <div className="mb-6">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="w-full border border-gray-200 rounded"
        />
      </div>
      
      <div className="bg-gray-50 p-3 rounded mb-4">
        <h3 className="font-medium mb-1">Bond Description</h3>
        <p className="text-sm">{moleculeInfo.description}</p>
        
        {electronegativityDiff > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Electronegativity Difference:</span> {electronegativityDiff.toFixed(1)}
            {electronegativityDiff < 0.5 && " (Nonpolar covalent)"}
            {electronegativityDiff >= 0.5 && electronegativityDiff < 1.7 && " (Polar covalent)"}
            {electronegativityDiff >= 1.7 && " (Ionic character)"}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className={`p-2 border rounded ${bondType === 'ionic' ? 'bg-blue-100' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium">Ionic Bond</div>
          <div className="text-xs">Electron transfer</div>
        </div>
        <div className={`p-2 border rounded ${bondType === 'covalent' ? 'bg-blue-100' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium">Covalent Bond</div>
          <div className="text-xs">Electron sharing</div>
        </div>
        <div className={`p-2 border rounded ${bondType === 'metallic' ? 'bg-blue-100' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium">Metallic Bond</div>
          <div className="text-xs">Electron sea</div>
        </div>
        <div className={`p-2 border rounded ${bondType === 'hydrogen' ? 'bg-blue-100' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium">Hydrogen Bond</div>
          <div className="text-xs">Dipole attraction</div>
        </div>
      </div>
    </div>
  );
} 