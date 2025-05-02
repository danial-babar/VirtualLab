'use client';

import { useState } from 'react';
import { Element, ELEMENT_CATEGORIES } from './ElementData';
import dynamic from 'next/dynamic';

interface Props {
  selectedElement: Element | null;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onResetSelection: () => void;
}

function PeriodicTableControlsContent({
  selectedElement,
  selectedCategory,
  onSelectCategory,
  onResetSelection
}: Props) {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Periodic Table Controls</h3>
      
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Filter by Category</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ELEMENT_CATEGORIES).map(([id, { name, color }]) => (
            <button
              key={id}
              onClick={() => onSelectCategory(id === selectedCategory ? null : id)}
              className="py-2 px-3 text-sm rounded transition-colors flex items-center"
              style={{ 
                backgroundColor: color,
                opacity: selectedCategory && id !== selectedCategory ? 0.6 : 1,
                border: id === selectedCategory ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div 
                className="w-3 h-3 mr-2 rounded-full" 
                style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.2)' }}
              ></div>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={onResetSelection}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          disabled={!selectedElement && !selectedCategory}
        >
          Reset Selection
        </button>
      </div>
      
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="text-blue-500 hover:text-blue-700 mb-4 text-sm flex items-center"
      >
        {showInfo ? '▼ Hide' : '► Show'} periodic table information
      </button>
      
      {showInfo && (
        <div className="mb-6 border-t pt-4">
          <h4 className="font-bold mb-2">About the Periodic Table</h4>
          <p className="text-sm mb-3">
            The periodic table organizes elements by their atomic number, electron configuration, and recurring chemical properties.
          </p>
          
          <div className="mb-3">
            <h5 className="font-medium">Table Structure</h5>
            <ul className="list-disc pl-5 text-xs">
              <li>Elements are arranged in order of increasing atomic number</li>
              <li>Groups (columns) contain elements with similar properties</li>
              <li>Periods (rows) show trends in properties as atomic number increases</li>
              <li>Colors indicate element categories with similar characteristics</li>
            </ul>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium">Element Properties</h5>
            <ul className="list-disc pl-5 text-xs">
              <li><strong>Atomic Number:</strong> Number of protons in the nucleus</li>
              <li><strong>Atomic Mass:</strong> Average mass of all isotopes of an element</li>
              <li><strong>Electronegativity:</strong> Ability to attract electrons when forming bonds</li>
              <li><strong>Electron Configuration:</strong> Arrangement of electrons in atomic orbitals</li>
            </ul>
          </div>
          
          <div className="text-xs italic mt-4">
            Click on any element to view detailed information, or select a category to highlight elements of that type.
          </div>
        </div>
      )}
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const PeriodicTableControls = dynamic(() => Promise.resolve(PeriodicTableControlsContent), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Loading controls...</h3>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default PeriodicTableControls; 