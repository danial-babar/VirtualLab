'use client';

import { useState, useEffect } from 'react';
import ELEMENTS, { Element, ELEMENT_CATEGORIES } from './ElementData';

interface PeriodicTableProps {
  onElementClick: (element: Element) => void;
  selectedElement?: Element;
  highlightCategory?: string;
}

export default function PeriodicTable({ 
  onElementClick, 
  selectedElement,
  highlightCategory
}: PeriodicTableProps) {
  // Maximum dimensions of the table
  const maxGroup = 18;
  const maxPeriod = 7;
  
  const [tableWidth, setTableWidth] = useState(1100);
  const [elementSize, setElementSize] = useState(60);
  
  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 40, 1100);
      setTableWidth(width);
      setElementSize(Math.max(Math.floor(width / maxGroup) - 4, 40));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Function to generate element cells
  const renderElement = (element: Element) => {
    const isSelected = selectedElement?.atomicNumber === element.atomicNumber;
    const isHighlighted = highlightCategory === element.category;
    
    const categoryColor = ELEMENT_CATEGORIES[element.category]?.color || '#cccccc';
    
    return (
      <div
        key={element.atomicNumber}
        className={`absolute transition-all cursor-pointer hover:z-10 hover:scale-110 ${
          isSelected ? 'z-10 scale-110 ring-2 ring-blue-500 shadow-lg' : ''
        } ${
          isHighlighted && !isSelected ? 'z-5 scale-105 ring-1 ring-blue-300' : ''
        }`}
        style={{
          width: elementSize,
          height: elementSize,
          left: (element.group - 1) * elementSize,
          top: (element.period - 1) * elementSize,
          backgroundColor: categoryColor,
          opacity: highlightCategory && !isHighlighted && !isSelected ? 0.5 : 1
        }}
        onClick={() => onElementClick(element)}
      >
        <div className="flex flex-col items-center justify-center h-full p-1 text-center">
          <div className="text-xs absolute top-1 left-1">{element.atomicNumber}</div>
          <div className="font-bold" style={{ fontSize: Math.max(elementSize / 3, 14) }}>{element.symbol}</div>
          <div className="text-xs mt-1 truncate w-full">{element.name}</div>
          {elementSize > 50 && (
            <div className="text-xs mt-0.5">{element.atomicMass.toFixed(1)}</div>
          )}
        </div>
      </div>
    );
  };
  
  // Function to generate category legend
  const renderCategoryLegend = () => {
    return (
      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(ELEMENT_CATEGORIES).map(([key, { name, color }]) => (
          <div 
            key={key} 
            className={`flex items-center rounded px-2 py-1 cursor-pointer ${
              highlightCategory === key ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
            }`}
            style={{ backgroundColor: color, opacity: highlightCategory && highlightCategory !== key ? 0.6 : 1 }}
            onClick={() => highlightCategory === key 
              ? onElementClick({ ...selectedElement! }) // Reset highlight but keep selection
              : onElementClick({
                  // Create a dummy element just to pass the category
                  ...ELEMENTS[0], 
                  category: key as any
                })
            }
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.2)' }}></div>
            <span className="ml-2 text-xs">{name}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Special handling for Lanthanides and Actinides
  const renderSpecialGroups = () => {
    return (
      <div className="mt-4 relative" style={{ height: elementSize * 2 + 8 }}>
        {/* Lanthanides (57-71) */}
        <div className="absolute top-0 left-0 flex flex-wrap" style={{ width: tableWidth }}>
          {ELEMENTS.filter(el => el.atomicNumber >= 57 && el.atomicNumber <= 71)
            .map(element => renderElement({
              ...element,
              period: 8,
              group: element.atomicNumber - 56
            }))}
        </div>
        
        {/* Actinides (89-103) */}
        <div className="absolute top-0 left-0 flex flex-wrap" style={{ width: tableWidth, marginTop: elementSize + 4 }}>
          {ELEMENTS.filter(el => el.atomicNumber >= 89 && el.atomicNumber <= 103)
            .map(element => renderElement({
              ...element,
              period: 9,
              group: element.atomicNumber - 88
            }))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow">
      <div className="relative" style={{ width: tableWidth, height: maxPeriod * elementSize }}>
        {ELEMENTS.filter(el => !(
          (el.atomicNumber >= 57 && el.atomicNumber <= 71) || 
          (el.atomicNumber >= 89 && el.atomicNumber <= 103)
        )).map(renderElement)}
        
        {/* Placeholder for Lanthanides */}
        <div 
          className="absolute cursor-pointer hover:z-10 hover:scale-105 text-center"
          style={{
            width: elementSize,
            height: elementSize,
            left: 2 * elementSize,
            top: 5 * elementSize,
            backgroundColor: ELEMENT_CATEGORIES['lanthanide']?.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          onClick={() => {
            const lanthanum = ELEMENTS.find(el => el.atomicNumber === 57);
            if (lanthanum) onElementClick(lanthanum);
          }}
        >
          <div className="text-xs absolute top-1 left-1">57-71</div>
          <div className="font-bold text-sm">La-Lu</div>
          <div className="text-xs mt-1">Lanthanides</div>
        </div>
        
        {/* Placeholder for Actinides */}
        <div 
          className="absolute cursor-pointer hover:z-10 hover:scale-105 text-center"
          style={{
            width: elementSize,
            height: elementSize,
            left: 2 * elementSize,
            top: 6 * elementSize,
            backgroundColor: ELEMENT_CATEGORIES['actinide']?.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          onClick={() => {
            const actinium = ELEMENTS.find(el => el.atomicNumber === 89);
            if (actinium) onElementClick(actinium);
          }}
        >
          <div className="text-xs absolute top-1 left-1">89-103</div>
          <div className="font-bold text-sm">Ac-Lr</div>
          <div className="text-xs mt-1">Actinides</div>
        </div>
      </div>
      
      {renderSpecialGroups()}
      {renderCategoryLegend()}
    </div>
  );
} 