'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ProteinSynthesisSimulationProps {
  dnaSequence: string;
  displayMode: 'transcription' | 'translation' | 'both';
  speed: number;
  isPaused: boolean;
  showLabels: boolean;
}

// Map of codons to amino acids
const codonToAminoAcid: Record<string, string> = {
  'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
  'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
  'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile', 'AUG': 'Met', // AUG is also the start codon
  'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
  'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
  'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
  'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
  'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
  'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'STOP', 'UAG': 'STOP',
  'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
  'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
  'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
  'UGU': 'Cys', 'UGC': 'Cys', 'UGA': 'STOP', 'UGG': 'Trp',
  'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
  'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
  'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly'
};

// DNA to RNA complement map
const dnaToRna: Record<string, string> = {
  'A': 'U',
  'T': 'A',
  'G': 'C',
  'C': 'G'
};

export default function ProteinSynthesisSimulation({
  dnaSequence,
  displayMode,
  speed,
  isPaused,
  showLabels
}: ProteinSynthesisSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // State for animation progress
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [translationProgress, setTranslationProgress] = useState(0);
  
  // Convert DNA to mRNA
  const getMrnaSequence = (dna: string) => {
    return dna.split('').map(nucleotide => dnaToRna[nucleotide]).join('');
  };
  
  // Convert mRNA to amino acids
  const getAminoAcids = (mrna: string) => {
    const aminoAcids: string[] = [];
    for (let i = 0; i < mrna.length; i += 3) {
      const codon = mrna.slice(i, i + 3);
      if (codon.length === 3) {
        const aminoAcid = codonToAminoAcid[codon] || '?';
        aminoAcids.push(aminoAcid);
        if (aminoAcid === 'STOP') break;
      }
    }
    return aminoAcids;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Animation timing
    let lastTime = 0;
    
    const mrnaSequence = getMrnaSequence(dnaSequence);
    const aminoAcids = getAminoAcids(mrnaSequence);
    
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
      
      // Define cell nucleus area for transcription
      const nucleusX = 50;
      const nucleusY = 150;
      const nucleusWidth = width - 100;
      const nucleusHeight = 180;
      
      // Define cytoplasm area for translation
      const cytoplasmY = nucleusY + nucleusHeight + 40;
      
      // Draw cell membrane
      ctx.fillStyle = '#e6f7ff';
      ctx.fillRect(20, 20, width - 40, height - 40);
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, width - 40, height - 40);
      
      // Draw nucleus
      ctx.fillStyle = '#fff0f5';
      ctx.fillRect(nucleusX, nucleusY, nucleusWidth, nucleusHeight);
      ctx.strokeStyle = '#d3a4b5';
      ctx.lineWidth = 1;
      ctx.strokeRect(nucleusX, nucleusY, nucleusWidth, nucleusHeight);
      
      if (showLabels) {
        // Label areas
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Cell Nucleus', width / 2, nucleusY - 10);
        ctx.fillText('Cytoplasm', width / 2, cytoplasmY - 10);
      }
      
      // Progress for animation
      if (displayMode === 'transcription' || displayMode === 'both') {
        // Update transcription progress for animation
        setTranscriptionProgress(prev => {
          const increment = (deltaTime / 1000) * speed * 5;
          return Math.min(prev + increment, 100);
        });
      }
      
      if ((displayMode === 'translation' || displayMode === 'both') && 
          (displayMode === 'translation' || transcriptionProgress >= 50)) {
        // Update translation progress for animation
        setTranslationProgress(prev => {
          const increment = (deltaTime / 1000) * speed * 3;
          return Math.min(prev + increment, 100);
        });
      }
      
      // Draw DNA, mRNA, and protein based on current mode
      if (displayMode === 'transcription' || displayMode === 'both') {
        drawTranscription(ctx, nucleusX, nucleusY, nucleusWidth, nucleusHeight);
      }
      
      if (displayMode === 'translation' || displayMode === 'both') {
        drawTranslation(ctx, nucleusX, cytoplasmY, nucleusWidth, 180);
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Draw transcription process
    const drawTranscription = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      width: number, 
      height: number
    ) => {
      const progress = transcriptionProgress / 100;
      
      // DNA strand
      const dnaY = y + 50;
      const dnaLength = Math.min(dnaSequence.length, 30); // Show at most 30 nucleotides
      const nucleotideWidth = Math.min(20, width / dnaLength);
      
      // Draw DNA double helix structure
      for (let i = 0; i < dnaLength; i++) {
        const dnaX = x + (i * nucleotideWidth);
        
        // Top strand (template)
        ctx.fillStyle = getNucleotideColor(dnaSequence[i]);
        ctx.fillRect(dnaX, dnaY, nucleotideWidth - 2, 20);
        
        // Bottom strand (complementary)
        const complement = getComplementaryBase(dnaSequence[i]);
        ctx.fillStyle = getNucleotideColor(complement);
        ctx.fillRect(dnaX, dnaY + 30, nucleotideWidth - 2, 20);
        
        // Draw connecting lines between strands
        ctx.beginPath();
        ctx.moveTo(dnaX + nucleotideWidth/2, dnaY + 20);
        ctx.lineTo(dnaX + nucleotideWidth/2, dnaY + 30);
        ctx.strokeStyle = '#888';
        ctx.stroke();
        
        if (showLabels && i < 15) { // Show labels for first 15 nucleotides only
          // Label nucleotides
          ctx.font = '10px monospace';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.fillText(dnaSequence[i], dnaX + nucleotideWidth/2, dnaY + 15);
          ctx.fillText(complement, dnaX + nucleotideWidth/2, dnaY + 45);
        }
      }
      
      // RNA polymerase position
      const polymeraseProgress = Math.min(Math.floor(dnaLength * progress), dnaLength - 1);
      const polymeraseX = x + (polymeraseProgress * nucleotideWidth);
      
      // Draw RNA polymerase
      ctx.fillStyle = '#ff9966';
      ctx.beginPath();
      ctx.arc(polymeraseX + nucleotideWidth/2, dnaY + 25, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cc6600';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (showLabels) {
        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('RNA Polymerase', polymeraseX + nucleotideWidth/2, dnaY + 25 + 25);
      }
      
      // Draw mRNA being synthesized
      const mrnaY = dnaY + 70;
      for (let i = 0; i <= polymeraseProgress; i++) {
        const mrnaX = x + (i * nucleotideWidth);
        const rnaBase = dnaToRna[dnaSequence[i]];
        
        ctx.fillStyle = getNucleotideColor(rnaBase, true);
        ctx.fillRect(mrnaX, mrnaY, nucleotideWidth - 2, 20);
        
        if (showLabels && i < 15) {
          ctx.font = '10px monospace';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.fillText(rnaBase, mrnaX + nucleotideWidth/2, mrnaY + 15);
        }
      }
      
      if (showLabels) {
        // Label strands
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.fillText('DNA Template Strand:', x - 5, dnaY + 15);
        ctx.fillText('DNA Coding Strand:', x - 5, dnaY + 45);
        ctx.fillText('mRNA:', x - 5, mrnaY + 15);
      }
    };
    
    // Draw translation process
    const drawTranslation = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      width: number, 
      height: number
    ) => {
      if (displayMode === 'translation' || transcriptionProgress >= 30) {
        const progress = translationProgress / 100;
        
        // mRNA strand
        const mrnaY = y + 30;
        const mrnaLength = Math.min(mrnaSequence.length, 30); // Show at most 30 nucleotides
        const nucleotideWidth = Math.min(20, width / mrnaLength);
        
        // Draw mRNA strand
        for (let i = 0; i < mrnaLength; i++) {
          const mrnaX = x + (i * nucleotideWidth);
          
          ctx.fillStyle = getNucleotideColor(mrnaSequence[i], true);
          ctx.fillRect(mrnaX, mrnaY, nucleotideWidth - 2, 20);
          
          if (showLabels && i < 15) {
            ctx.font = '10px monospace';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(mrnaSequence[i], mrnaX + nucleotideWidth/2, mrnaY + 15);
          }
        }
        
        // Ribosome position
        const ribosomeProgress = Math.min(Math.floor((mrnaLength - 3) * progress), mrnaLength - 3);
        const ribosomeX = x + (ribosomeProgress * nucleotideWidth);
        
        // Draw ribosome
        ctx.fillStyle = '#99ccff';
        ctx.beginPath();
        ctx.ellipse(
          ribosomeX + nucleotideWidth * 1.5, 
          mrnaY + 10, 
          nucleotideWidth * 2.5, 
          25, 
          0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = '#3366cc';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        if (showLabels) {
          ctx.font = '10px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.fillText('Ribosome', ribosomeX + nucleotideWidth * 1.5, mrnaY + 10 - 15);
          
          // Highlight current codon
          if (ribosomeProgress + 2 < mrnaLength) {
            const codon = mrnaSequence.substring(ribosomeProgress, ribosomeProgress + 3);
            ctx.font = '10px Arial';
            ctx.fillStyle = '#ff3300';
            ctx.textAlign = 'center';
            ctx.fillText('Current Codon: ' + codon, ribosomeX + nucleotideWidth * 1.5, mrnaY + 40);
          }
        }
        
        // Draw polypeptide chain
        const aaY = mrnaY + 60;
        const numAminoAcids = Math.floor((ribosomeProgress + 3) / 3);
        
        if (numAminoAcids > 0) {
          for (let i = 0; i < numAminoAcids; i++) {
            if (i >= aminoAcids.length) break;
            if (aminoAcids[i] === 'STOP') break;
            
            const aaX = x + (i * nucleotideWidth * 1.5);
            
            // Draw amino acid
            ctx.fillStyle = getAminoAcidColor(aminoAcids[i]);
            ctx.beginPath();
            ctx.arc(aaX + nucleotideWidth * 0.75, aaY, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            if (showLabels) {
              ctx.font = '9px Arial';
              ctx.fillStyle = 'black';
              ctx.textAlign = 'center';
              ctx.fillText(aminoAcids[i], aaX + nucleotideWidth * 0.75, aaY + 4);
            }
            
            // Draw peptide bonds
            if (i > 0) {
              ctx.beginPath();
              ctx.moveTo(aaX - nucleotideWidth * 0.75, aaY);
              ctx.lineTo(aaX + nucleotideWidth * 0.75 - 15, aaY);
              ctx.strokeStyle = '#333';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        }
        
        if (showLabels) {
          // Label strands
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'right';
          ctx.fillText('mRNA:', x - 5, mrnaY + 15);
          ctx.fillText('Polypeptide:', x - 5, aaY + 5);
        }
      }
    };
    
    // Helper function to get DNA/RNA nucleotide color
    function getNucleotideColor(base: string, isRna = false) {
      switch (base) {
        case 'A': return isRna ? '#ff9999' : '#ff6666'; // Adenine - red
        case 'T': return '#66ff66'; // Thymine - green
        case 'U': return '#99ff99'; // Uracil - light green (RNA)
        case 'G': return isRna ? '#9999ff' : '#6666ff'; // Guanine - blue
        case 'C': return isRna ? '#ffff99' : '#ffff66'; // Cytosine - yellow
        default: return '#cccccc';
      }
    }
    
    // Helper function to get DNA complementary base
    function getComplementaryBase(base: string) {
      switch (base) {
        case 'A': return 'T';
        case 'T': return 'A';
        case 'G': return 'C';
        case 'C': return 'G';
        default: return 'N';
      }
    }
    
    // Helper function to get amino acid color
    function getAminoAcidColor(aa: string) {
      // Simplified color scheme based on amino acid properties
      switch (aa) {
        case 'STOP': return '#ff0000'; // Stop codon - red
        case 'Met': return '#00ff00'; // Start codon - green
        case 'Phe':
        case 'Leu':
        case 'Ile':
        case 'Val': 
        case 'Trp':
        case 'Tyr': return '#ffffcc'; // Hydrophobic - pale yellow
        case 'Ser':
        case 'Thr':
        case 'Asn':
        case 'Gln': return '#ccffff'; // Polar - pale cyan
        case 'Lys':
        case 'Arg':
        case 'His': return '#ffcccc'; // Basic - pale red
        case 'Asp':
        case 'Glu': return '#ccccff'; // Acidic - pale blue
        case 'Cys':
        case 'Met': return '#ffccff'; // Sulfur-containing - pale purple
        case 'Pro':
        case 'Gly':
        case 'Ala': return '#dddddd'; // Special structure - gray
        default: return '#ffffff';
      }
    }
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dnaSequence, displayMode, speed, isPaused, showLabels, transcriptionProgress, translationProgress]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="border rounded shadow-sm bg-white w-full h-auto"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
        <div className="bg-blue-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Nucleotide Key</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 mr-2"></div>
              <span>Adenine (A)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 mr-2"></div>
              <span>Thymine (T)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-300 mr-2"></div>
              <span>Uracil (U)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 mr-2"></div>
              <span>Guanine (G)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-300 mr-2"></div>
              <span>Cytosine (C)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded shadow-sm">
          <h3 className="font-medium text-lg mb-2">Current Progress</h3>
          <div className="space-y-2 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span>Transcription:</span>
                <span>{Math.round(transcriptionProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${transcriptionProgress}%`}}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Translation:</span>
                <span>{Math.round(translationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{width: `${translationProgress}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information about current sequence */}
      <div className="w-full mt-4 p-3 bg-gray-50 rounded shadow-sm">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <strong>DNA:</strong> {dnaSequence.length > 50 ? `${dnaSequence.substring(0, 50)}...` : dnaSequence}
          </div>
          <div>
            <strong>mRNA:</strong> {getMrnaSequence(dnaSequence).length > 50 ? 
              `${getMrnaSequence(dnaSequence).substring(0, 50)}...` : 
              getMrnaSequence(dnaSequence)}
          </div>
          <div>
            <strong>Protein:</strong> {getAminoAcids(getMrnaSequence(dnaSequence)).join('-')}
          </div>
        </div>
      </div>
    </div>
  );
} 