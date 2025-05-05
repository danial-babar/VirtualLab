'use client';

import Link from 'next/link';
import { useState } from 'react';

// Define experiment type to fix TypeScript errors
interface Experiment {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
  comingSoon?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  experiments: Experiment[];
}

// All experiments data organized by category
const categories: Category[] = [
  {
    id: 'physics',
    name: 'Physics',
    description: 'Explore mechanics, electricity, and waves',
    icon: '⚛️',
    experiments: [
      {
        id: 'wave-interference',
        title: 'Wave Interference Simulator',
        description: 'Visualize constructive and destructive interference patterns between waves',
        image: '〰️',
        path: '/wave-interference'
      },
      {
        id: 'electric-field',
        title: 'Electric Field Simulator',
        description: 'Visualize electric fields, field lines, and forces between charges',
        image: '⚡',
        path: '/electric-field'
      },
      {
        id: 'collision',
        title: 'Collision Physics',
        description: 'Simulate elastic and inelastic collisions and observe conservation of momentum',
        image: '🎱',
        path: '/collision'
      },
      {
        id: 'orbital',
        title: 'Orbital Mechanics',
        description: 'Explore planetary motion, gravitational forces, and Kepler\'s laws',
        image: '🪐',
        path: '/orbital'
      },
      {
        id: 'ohms-law',
        title: 'Ohm\'s Law',
        description: 'Explore the relationship between voltage, current, and resistance',
        image: '🔌',
        path: '/ohms-law'
      },
      {
        id: 'pendulum',
        title: 'Simple Pendulum',
        description: 'Investigate how period relates to pendulum length and gravity',
        image: '🔄',
        path: '/pendulum'
      },
      {
        id: 'projectile',
        title: 'Projectile Motion',
        description: 'Study the motion of objects under gravity with different launch angles',
        image: '🚀',
        path: '/projectile'
      },
      {
        id: 'wave',
        title: 'Wave Properties',
        description: 'Explore different wave types and their characteristics',
        image: '〰️',
        path: '/wave'
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Discover reactions, molecular structures, and properties of matter',
    icon: '🧪',
    experiments: [
      {
        id: 'chemical-equilibrium',
        title: 'Chemical Equilibrium Simulator',
        description: 'Visualize how reaction conditions affect chemical equilibrium',
        image: '⚖️',
        path: '/chemical-equilibrium'
      },
      {
        id: 'acid-base-reactions',
        title: 'Acid-Base Reactions Simulator',
        description: 'Visualize titrations and monitor pH changes between acids and bases',
        image: '🧪',
        path: '/acid-base-reactions'
      },
      {
        id: 'chemical-bonding',
        title: 'Chemical Bonding Visualizer',
        description: 'Explore different types of chemical bonds and molecular structures',
        image: '⚛️',
        path: '/chemical-bonding'
      },
      {
        id: 'gas-laws',
        title: 'Gas Laws Simulator',
        description: 'Explore the relationship between pressure, volume, and temperature in gases',
        image: '💨',
        path: '/gas-laws'
      },
      {
        id: 'titration',
        title: 'Acid-Base Titration',
        description: 'Determine the concentration of an acid or base through titration',
        image: '🧫',
        path: '/titration'
      },
      {
        id: 'molecular-viewer',
        title: 'Molecular Viewer',
        description: 'Visualize and interact with 3D molecular structures',
        image: '🔍',
        path: '/molecular-viewer'
      },
      {
        id: 'periodic-table',
        title: 'Interactive Periodic Table',
        description: 'Explore elements and their properties',
        image: '📊',
        path: '/periodic-table'
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Explore cells, genetics, and ecological systems',
    icon: '🧬',
    experiments: [
      {
        id: 'cell-membrane',
        title: 'Cell Membrane Transport',
        description: 'Simulate diffusion and osmosis across cell membranes',
        image: '🔬',
        path: '/cell-membrane'
      },
      {
        id: 'genetics',
        title: 'Genetics Simulator',
        description: 'Model inheritance patterns and genetic crosses',
        image: '🧬',
        path: '/genetics'
      },
      {
        id: 'photosynthesis',
        title: 'Photosynthesis Simulator',
        description: 'Visualize light and dark reactions in photosynthesis',
        image: '🌿',
        path: '/photosynthesis'
      },
      {
        id: 'cell-division',
        title: 'Cell Division Visualizer',
        description: 'Explore mitosis and meiosis processes',
        image: '🧫',
        path: '/cell-division'
      }
    ]
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('physics');
  
  const currentCategory = categories.find(cat => cat.id === activeCategory) || categories[0];

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-2">Virtual Science Lab</h1>
      <p className="text-lg text-gray-600 mb-8">Interactive experiments for learning science concepts</p>
      
      {/* Category Tabs */}
      <div className="flex justify-center mb-8 border-b border-gray-200 w-full max-w-6xl">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`py-3 px-6 text-lg font-medium border-b-2 transition-all 
              ${activeCategory === category.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Category Description */}
      <div className="mb-8 text-center max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">{currentCategory.name} Experiments</h2>
        <p className="text-gray-600">{currentCategory.description}</p>
      </div>
      
      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {currentCategory.experiments.map((exp) => (
          <div 
            key={exp.id}
            className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all hover:shadow-lg 
              ${exp.comingSoon ? 'opacity-70' : 'hover:border-blue-300'}`}
          >
            <div className="text-4xl mb-4">{exp.image}</div>
            <h2 className="text-xl font-bold mb-2">{exp.title}</h2>
            <p className="text-gray-600 mb-4">{exp.description}</p>
            {exp.comingSoon ? (
              <div className="bg-yellow-100 text-yellow-800 text-sm py-1 px-3 rounded">
                Coming Soon
              </div>
            ) : (
              <Link href={exp.path}>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                  Start Experiment
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
