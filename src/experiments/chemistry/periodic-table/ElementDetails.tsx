'use client';

import { Element, ELEMENT_CATEGORIES } from './ElementData';

interface ElementDetailsProps {
  element: Element | null;
}

export default function ElementDetails({ element }: ElementDetailsProps) {
  if (!element) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-center">
          Select an element from the periodic table to view its details
        </p>
      </div>
    );
  }

  // Get category color and name
  const category = ELEMENT_CATEGORIES[element.category as keyof typeof ELEMENT_CATEGORIES] || { name: 'Unknown', color: '#cccccc' };
  
  // Format values with units
  const formatValue = (value: number | undefined, unit: string): string => {
    if (value === undefined) return 'Data not available';
    return `${value} ${unit}`;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Element header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{ backgroundColor: category.color }}
      >
        <div className="flex items-center">
          <div className="text-5xl font-bold mr-4">{element.symbol}</div>
          <div>
            <div className="text-xl font-semibold">{element.name}</div>
            <div className="text-sm">{category.name}</div>
          </div>
        </div>
        <div className="text-3xl font-bold">{element.atomicNumber}</div>
      </div>
      
      {/* Element details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DetailItem label="Atomic Mass" value={`${element.atomicMass} u`} />
          <DetailItem label="Group" value={element.group.toString()} />
          <DetailItem label="Period" value={element.period.toString()} />
          <DetailItem label="Block" value={element.block} />
        </div>
        
        <div className="grid grid-cols-1 gap-2 border-t pt-4">
          <DetailItem 
            label="Electron Configuration" 
            value={element.electronConfiguration} 
          />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 border-t pt-4">
          <DetailItem 
            label="Electronegativity" 
            value={element.electronegativity !== undefined ? element.electronegativity.toString() : 'N/A'} 
          />
          <DetailItem 
            label="Atomic Radius" 
            value={formatValue(element.atomicRadius, 'pm')} 
          />
          <DetailItem 
            label="Ionization Energy" 
            value={formatValue(element.ionizationEnergy, 'eV')} 
          />
          <DetailItem 
            label="Density" 
            value={formatValue(element.density, 'g/cm³')} 
          />
          <DetailItem 
            label="Melting Point" 
            value={formatValue(element.meltingPoint, '°C')} 
          />
          <DetailItem 
            label="Boiling Point" 
            value={formatValue(element.boilingPoint, '°C')} 
          />
        </div>
        
        {element.discoveredBy && (
          <div className="mt-4 border-t pt-4">
            <DetailItem 
              label="Discovered by" 
              value={`${element.discoveredBy}${element.yearDiscovered ? ` (${element.yearDiscovered})` : ''}`} 
            />
          </div>
        )}
        
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-gray-700">{element.description}</p>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying a labeled value
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
} 