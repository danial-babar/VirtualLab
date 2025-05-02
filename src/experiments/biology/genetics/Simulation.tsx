'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

type Allele = 'A' | 'a' | 'B' | 'b' | 'AB' | 'O';
type Genotype = `${Allele}${Allele}`;
type TraitType = 'mendelian' | 'incomplete-dominance' | 'codominance' | 'blood-type';

interface Trait {
  name: string;
  genotype1: Genotype;
  genotype2: Genotype;
  type: TraitType;
}

interface PunnettProps {
  trait: Trait;
  numOffspring: number;
  showProbabilities: boolean;
  showGenotypes: boolean;
}

// Determine phenotype based on genotype and trait type
const getPhenotype = (genotype: Genotype, traitType: TraitType): string => {
  if (traitType === 'mendelian') {
    // For Mendelian, capital letter is dominant
    return genotype.includes('A') ? 'Dominant' : 'Recessive';
  } else if (traitType === 'incomplete-dominance') {
    // For incomplete dominance, heterozygous shows intermediate phenotype
    if (genotype === 'AA') return 'Red';
    if (genotype === 'aa') return 'White';
    return 'Pink'; // Aa
  } else if (traitType === 'codominance') {
    // For codominance, both alleles expressed in heterozygous
    if (genotype === 'AA') return 'Red';
    if (genotype === 'aa') return 'White';
    return 'Red and White Spotted'; // Aa
  } else if (traitType === 'blood-type') {
    // Blood type is a special codominance case
    if (genotype === 'AA' || genotype === 'AO') return 'Type A';
    if (genotype === 'BB' || genotype === 'BO') return 'Type B';
    if (genotype === 'AB') return 'Type AB';
    return 'Type O'; // OO
  }
  return '';
};

// Get color for phenotype visualization
const getPhenotypeColor = (phenotype: string): string => {
  switch (phenotype) {
    case 'Dominant': return '#4287f5';
    case 'Recessive': return '#f5a742';
    case 'Red': return '#e74c3c';
    case 'White': return '#ecf0f1';
    case 'Pink': return '#f8c9d4';
    case 'Red and White Spotted': return '#ff7675';
    case 'Type A': return '#e74c3c';
    case 'Type B': return '#3498db';
    case 'Type AB': return '#9b59b6';
    case 'Type O': return '#f39c12';
    default: return '#cccccc';
  }
};

// Split genotype into alleles
const splitGenotype = (genotype: Genotype): Allele[] => {
  if (genotype.length === 2) {
    return [genotype[0] as Allele, genotype[1] as Allele];
  }
  // Handle special cases like 'AB' blood type
  if (genotype === 'AB') {
    return ['A', 'B'];
  }
  return [genotype[0] as Allele, genotype[1] as Allele];
};

export default function GeneticsSimulation({ trait, numOffspring, showProbabilities, showGenotypes }: PunnettProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(500);
  const [offspring, setOffspring] = useState<Genotype[]>([]);
  const [punnettSquare, setPunnettSquare] = useState<Genotype[][]>([]);
  
  // Calculate possible gametes (alleles) from each parent
  const getGametes = (genotype: Genotype): Allele[] => {
    const alleles = splitGenotype(genotype);
    
    // For blood type, handle special case
    if (trait.type === 'blood-type') {
      if (genotype === 'AB') {
        return ['A', 'B'];
      }
    }
    
    // If homozygous, only one type of gamete
    if (alleles[0] === alleles[1]) {
      return [alleles[0]];
    }
    
    // If heterozygous, two types of gametes
    return [alleles[0], alleles[1]];
  };
  
  // Generate Punnett square based on parent genotypes
  useEffect(() => {
    const parent1Gametes = getGametes(trait.genotype1);
    const parent2Gametes = getGametes(trait.genotype2);
    
    const square: Genotype[][] = [];
    
    for (let i = 0; i < parent1Gametes.length; i++) {
      const row: Genotype[] = [];
      for (let j = 0; j < parent2Gametes.length; j++) {
        // Create genotype by combining gametes
        // Sort alleles alphabetically for consistency (except for blood type)
        let alleles = [parent1Gametes[i], parent2Gametes[j]];
        
        // For blood type, special handling of AB genotype
        if (trait.type === 'blood-type') {
          if ((alleles[0] === 'A' && alleles[1] === 'B') || 
              (alleles[0] === 'B' && alleles[1] === 'A')) {
            row.push('AB' as Genotype);
            continue;
          }
        }
        
        // For other types, sort alleles
        alleles.sort((a, b) => {
          // Capital letters come before lowercase
          if (a === a.toUpperCase() && b !== b.toUpperCase()) return -1;
          if (a !== a.toUpperCase() && b === b.toUpperCase()) return 1;
          return a.localeCompare(b);
        });
        
        row.push(`${alleles[0]}${alleles[1]}` as Genotype);
      }
      square.push(row);
    }
    
    setPunnettSquare(square);
  }, [trait]);
  
  // Generate random offspring based on Punnett square probabilities
  useEffect(() => {
    if (punnettSquare.length === 0) return;
    
    // Flatten Punnett square for sampling
    const flattenedSquare: Genotype[] = [];
    punnettSquare.forEach(row => {
      row.forEach(genotype => {
        flattenedSquare.push(genotype);
      });
    });
    
    // Generate random offspring
    const newOffspring: Genotype[] = [];
    for (let i = 0; i < numOffspring; i++) {
      const randomIndex = Math.floor(Math.random() * flattenedSquare.length);
      newOffspring.push(flattenedSquare[randomIndex]);
    }
    
    setOffspring(newOffspring);
  }, [punnettSquare, numOffspring]);
  
  // Render Punnett square and offspring distribution
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const parent1Gametes = getGametes(trait.genotype1);
    const parent2Gametes = getGametes(trait.genotype2);
    
    const squareSize = Math.min(width, height) * 0.4;
    const cellSize = squareSize / (Math.max(parent1Gametes.length, parent2Gametes.length) + 1);
    const squareX = (width - squareSize) / 2;
    const squareY = 20;
    
    // Draw Punnett square
    const squareGroup = svg.append('g')
      .attr('transform', `translate(${squareX}, ${squareY})`);
    
    // Draw grid
    for (let i = 0; i <= parent1Gametes.length; i++) {
      squareGroup.append('line')
        .attr('x1', 0)
        .attr('y1', i * cellSize)
        .attr('x2', parent2Gametes.length * cellSize)
        .attr('y2', i * cellSize)
        .attr('stroke', '#333')
        .attr('stroke-width', i === 0 ? 2 : 1);
    }
    
    for (let j = 0; j <= parent2Gametes.length; j++) {
      squareGroup.append('line')
        .attr('x1', j * cellSize)
        .attr('y1', 0)
        .attr('x2', j * cellSize)
        .attr('y2', parent1Gametes.length * cellSize)
        .attr('stroke', '#333')
        .attr('stroke-width', j === 0 ? 2 : 1);
    }
    
    // Add parent1 gametes labels (rows)
    for (let i = 0; i < parent1Gametes.length; i++) {
      squareGroup.append('text')
        .attr('x', -cellSize / 3)
        .attr('y', i * cellSize + cellSize / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', cellSize / 3)
        .attr('font-weight', 'bold')
        .text(parent1Gametes[i]);
    }
    
    // Add parent2 gametes labels (columns)
    for (let j = 0; j < parent2Gametes.length; j++) {
      squareGroup.append('text')
        .attr('x', j * cellSize + cellSize / 2)
        .attr('y', -cellSize / 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', cellSize / 3)
        .attr('font-weight', 'bold')
        .text(parent2Gametes[j]);
    }
    
    // Add genotypes and background colors
    for (let i = 0; i < punnettSquare.length; i++) {
      for (let j = 0; j < punnettSquare[i].length; j++) {
        const genotype = punnettSquare[i][j];
        const phenotype = getPhenotype(genotype, trait.type);
        
        // Add background color based on phenotype
        squareGroup.append('rect')
          .attr('x', j * cellSize + 1)
          .attr('y', i * cellSize + 1)
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .attr('fill', getPhenotypeColor(phenotype))
          .attr('opacity', 0.7);
        
        // Add genotype text
        if (showGenotypes) {
          squareGroup.append('text')
            .attr('x', j * cellSize + cellSize / 2)
            .attr('y', i * cellSize + cellSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', cellSize / 3)
            .attr('font-weight', 'bold')
            .text(genotype);
        }
      }
    }
    
    // Add parent labels
    svg.append('text')
      .attr('x', squareX + squareSize / 2)
      .attr('y', squareY - 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
      .text(`Parent 2 Genotype: ${trait.genotype2}`);
    
    svg.append('text')
      .attr('x', squareX - 30)
      .attr('y', squareY + squareSize / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
      .attr('transform', `rotate(-90, ${squareX - 30}, ${squareY + squareSize / 2})`)
      .text(`Parent 1 Genotype: ${trait.genotype1}`);
    
    // Draw offspring distribution
    const chartHeight = 120;
    const chartWidth = width * 0.8;
    const chartX = (width - chartWidth) / 2;
    const chartY = squareY + squareSize + 50;
    
    // Group offspring by genotype and calculate frequencies
    const offspringCounts: Record<string, { genotype: Genotype, count: number, phenotype: string }> = {};
    
    offspring.forEach(genotype => {
      if (!offspringCounts[genotype]) {
        offspringCounts[genotype] = {
          genotype,
          count: 0,
          phenotype: getPhenotype(genotype, trait.type)
        };
      }
      offspringCounts[genotype].count++;
    });
    
    const genotypeData = Object.values(offspringCounts).sort((a, b) => 
      a.genotype.localeCompare(b.genotype)
    );
    
    // Draw genotype distribution chart
    const barWidth = chartWidth / (genotypeData.length || 1) - 10;
    
    genotypeData.forEach((data, i) => {
      const proportion = data.count / numOffspring;
      const barHeight = chartHeight * proportion;
      const barX = chartX + i * (barWidth + 10) + 5;
      const barY = chartY + chartHeight - barHeight;
      
      // Add bar
      svg.append('rect')
        .attr('x', barX)
        .attr('y', barY)
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('fill', getPhenotypeColor(data.phenotype))
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
      
      // Add genotype label
      svg.append('text')
        .attr('x', barX + barWidth / 2)
        .attr('y', chartY + chartHeight + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text(data.genotype);
      
      // Add phenotype label
      svg.append('text')
        .attr('x', barX + barWidth / 2)
        .attr('y', chartY + chartHeight + 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .text(data.phenotype);
      
      // Add count/percentage
      if (showProbabilities) {
        svg.append('text')
          .attr('x', barX + barWidth / 2)
          .attr('y', barY - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .text(`${(proportion * 100).toFixed(1)}%`);
      } else {
        svg.append('text')
          .attr('x', barX + barWidth / 2)
          .attr('y', barY - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .text(`${data.count}`);
      }
    });
    
    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', chartY - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
      .text(`Offspring Distribution (n=${numOffspring})`);
    
    // Add axis
    svg.append('line')
      .attr('x1', chartX)
      .attr('y1', chartY + chartHeight)
      .attr('x2', chartX + chartWidth)
      .attr('y2', chartY + chartHeight)
      .attr('stroke', '#333')
      .attr('stroke-width', 1);
    
  }, [punnettSquare, offspring, width, height, trait, numOffspring, showGenotypes, showProbabilities]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        setWidth(container.clientWidth);
        setHeight(Math.min(600, Math.max(500, window.innerHeight - 300)));
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div ref={containerRef} className="relative w-full bg-white border border-gray-300 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Inheritance Pattern: {trait.name}</h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded text-xs">
        {trait.type === 'mendelian' && (
          <span>Note: "A" represents the dominant allele, "a" represents the recessive allele</span>
        )}
        {trait.type === 'incomplete-dominance' && (
          <span>Note: In incomplete dominance, heterozygotes show an intermediate phenotype</span>
        )}
        {trait.type === 'codominance' && (
          <span>Note: In codominance, both alleles are fully expressed in heterozygotes</span>
        )}
        {trait.type === 'blood-type' && (
          <span>Note: Blood type inheritance involves multiple alleles with A and B being codominant, and O recessive</span>
        )}
      </div>
    </div>
  );
} 