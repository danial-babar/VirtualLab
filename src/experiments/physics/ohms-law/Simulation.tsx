'use client';

import dynamic from 'next/dynamic';

interface Props {
    voltage: number;
    resistance: number;
  }
  
  // Main simulation component
  function OhmsLawSimulationContent({ voltage, resistance }: Props) {
    // Calculate current using Ohm's Law: I = V/R
    const current = voltage / resistance;
    
    // Control animation based on current - higher current = faster animation
    const speed = Math.min(1 + current * 0.5, 5);
    
    // Number of electrons to show based on current
    const electronCount = Math.max(1, Math.min(Math.floor(current * 2), 8));
  
    return (
      <div className="w-full max-w-2xl h-64 border-2 border-gray-300 rounded-lg bg-gray-100 relative overflow-hidden mb-8">
        {/* Circuit diagram */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Battery */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-100 border border-blue-400 p-2 rounded">
            <div className="text-center font-bold">{voltage}V</div>
            <div className="h-12 w-16 flex flex-col justify-between items-center">
              <div className="w-full h-1 bg-black"></div>
              <div className="w-full h-1 bg-black"></div>
            </div>
          </div>
          
          {/* Resistor */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-orange-100 border border-orange-400 p-2 rounded">
            <div className="text-center font-bold">{resistance}Ω</div>
            <div className="h-6 w-16 flex items-center justify-center">
              <div className="w-full h-4 bg-orange-300 rounded-sm flex items-center justify-center">
                <div className="text-xs">Resistor</div>
              </div>
            </div>
          </div>
          
          {/* Wire */}
          <div className="w-3/4 h-1/2 border-t-2 border-b-2 border-black mx-auto"></div>
        </div>
        
        {/* Electrons */}
        {Array.from({ length: electronCount }).map((_, index) => (
          <div
            key={index}
            className="w-6 h-6 bg-yellow-400 rounded-full absolute animate-flow"
            style={{
              animationDuration: `${6 / speed}s`,
              animationDelay: `${(index * (6 / speed)) / electronCount}s`,
              top: `${32 + (index % 2) * 16}%`,
            }}
          />
        ))}
        
        {/* Current reading */}
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded border">
          Current: {current.toFixed(2)}A
        </div>
        
        <style jsx>{`
          .animate-flow {
            animation-name: flow;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
          @keyframes flow {
            0% {
              left: 10%;
            }
            100% {
              left: 90%;
            }
          }
        `}</style>
      </div>
    );
  }
  
  // Export a dynamically loaded version that only renders on client
  const OhmsLawSimulation = dynamic(() => Promise.resolve(OhmsLawSimulationContent), {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading circuit simulation...</div>
      </div>
    )
  });
  
  export default OhmsLawSimulation;
  