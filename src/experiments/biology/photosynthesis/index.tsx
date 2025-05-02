'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ExperimentLayout from '@/components/ExperimentLayout';

// Dynamically import components with client-side only rendering
const PhotosynthesisSimulation = dynamic(() => import('./Simulation'), { ssr: false });
const PhotosynthesisControls = dynamic(() => import('./Controls'), { ssr: false });

export default function PhotosynthesisExperiment() {
  const [lightIntensity, setLightIntensity] = useState(70);
  const [co2Concentration, setCo2Concentration] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [showLightReactions, setShowLightReactions] = useState(true);
  const [showDarkReactions, setShowDarkReactions] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Force simulation reset when parameters change
  const [resetCounter, setResetCounter] = useState(0);
  
  const resetSimulation = useCallback(() => {
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <ExperimentLayout 
      title="Photosynthesis Simulator"
      category="biology"
      description="Visualize light reactions and the Calvin cycle in photosynthesis"
      formula="6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂"
      formulaExplanation="Plants convert carbon dioxide and water into glucose and oxygen using light energy"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <PhotosynthesisSimulation
            key={resetCounter} // Force component re-mount on reset
            lightIntensity={lightIntensity}
            co2Concentration={co2Concentration}
            temperature={temperature}
            showLightReactions={showLightReactions}
            showDarkReactions={showDarkReactions}
            isPaused={isPaused}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">About Photosynthesis</h3>
            <p className="text-sm">
              Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy 
              into chemical energy that can later be released to fuel the organism's activities. This simulation 
              demonstrates the two main stages of photosynthesis: the light-dependent reactions and the Calvin cycle.
            </p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium mb-1">Light-Dependent Reactions</h4>
                <p className="text-xs">
                  Occur in the thylakoid membrane of the chloroplast. Light energy is captured by chlorophyll and 
                  converted into chemical energy in the form of ATP and NADPH. Water is split, releasing oxygen as 
                  a byproduct. This stage directly requires light to proceed.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium mb-1">Calvin Cycle (Light-Independent Reactions)</h4>
                <p className="text-xs">
                  Takes place in the stroma of the chloroplast. Uses the ATP and NADPH from the light reactions
                  to fix carbon dioxide from the air and produce glucose (sugar). Though it doesn't directly use 
                  light, it depends on the products of the light reactions.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <h4 className="font-medium mb-1">Key Factors Affecting Photosynthesis</h4>
              <ul className="list-disc pl-5 text-xs">
                <li><strong>Light intensity:</strong> More light generally increases the rate of photosynthesis until other factors become limiting</li>
                <li><strong>Carbon dioxide concentration:</strong> Higher CO₂ levels can increase photosynthetic rate</li>
                <li><strong>Temperature:</strong> Enzymes work best at optimal temperatures (typically 25-30°C for most plants)</li>
                <li><strong>Water availability:</strong> Required for the light reactions</li>
                <li><strong>Chlorophyll concentration:</strong> More chlorophyll can capture more light energy</li>
              </ul>
            </div>
            
            <div className="mt-4 text-xs">
              <p>
                In this simulation, you can adjust light intensity, CO₂ concentration, and temperature to observe 
                how these factors affect the rate of photosynthesis. You can also toggle the visibility of the 
                light reactions and Calvin cycle to focus on specific parts of the process.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:w-96">
          <PhotosynthesisControls
            lightIntensity={lightIntensity}
            co2Concentration={co2Concentration}
            temperature={temperature}
            showLightReactions={showLightReactions}
            showDarkReactions={showDarkReactions}
            isPaused={isPaused}
            setLightIntensity={setLightIntensity}
            setCo2Concentration={setCo2Concentration}
            setTemperature={setTemperature}
            setShowLightReactions={setShowLightReactions}
            setShowDarkReactions={setShowDarkReactions}
            setIsPaused={setIsPaused}
            resetSimulation={resetSimulation}
          />
        </div>
      </div>
    </ExperimentLayout>
  );
} 