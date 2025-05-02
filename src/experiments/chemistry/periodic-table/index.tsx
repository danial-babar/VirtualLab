'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';
import ELEMENTS, { Element } from './ElementData';

// Dynamically import components with client-side only rendering
const PeriodicTableComponent = dynamic(() => import('./PeriodicTable'), { ssr: false });
const ElementDetails = dynamic(() => import('./ElementDetails'), { ssr: false });
const PeriodicTableControls = dynamic(() => import('./Controls'), { ssr: false });

export default function PeriodicTableExperiment() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleElementClick = (element: Element) => {
    // If element contains a category property but no atomicNumber, it's a category selection
    if (!element.atomicNumber && element.category) {
      setSelectedCategory(element.category);
      return;
    }

    setSelectedElement(element);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleReset = () => {
    setSelectedElement(null);
    setSelectedCategory(null);
  };

  return (
    <ExperimentLayout 
      title="Interactive Periodic Table"
      category="chemistry"
      description="Explore elements and their properties"
      formula=""
      formulaExplanation=""
    >
      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">The Periodic Table of Elements</h2>
          <PeriodicTableComponent 
            onElementClick={handleElementClick}
            selectedElement={selectedElement || undefined}
            highlightCategory={selectedCategory || undefined}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <ElementDetails element={selectedElement} />
            
            <div className="mt-6 bg-white p-4 rounded-lg shadow text-sm">
              <h3 className="font-semibold mb-2">About this Periodic Table</h3>
              <p className="mb-2">
                This interactive periodic table allows you to explore the 118 elements that make up our world.
                Click on any element to view detailed information about its properties, history, and uses.
              </p>
              <p>
                The table is color-coded to show different element categories. You can also filter the table
                to highlight specific element categories using the controls panel.
              </p>
              
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-1">Science Fact</h4>
                <p className="text-xs">
                  The periodic table was developed by Russian chemist Dmitri Mendeleev in 1869. 
                  His original table organized elements by atomic mass and chemical properties, 
                  but today's table arranges elements by increasing atomic number (number of protons) 
                  and electron configuration.
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:w-96">
            <PeriodicTableControls
              selectedElement={selectedElement}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              onResetSelection={handleReset}
            />
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 