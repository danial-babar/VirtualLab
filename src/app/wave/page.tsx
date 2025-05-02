'use client';

import { useState } from 'react';
import ExperimentLayout from '@/components/ExperimentLayout';
import Controls from '@/experiments/physics/wave/Controls';
import Simulation from '@/experiments/physics/wave/Simulation';

export default function WavePage() {
  const [amplitude, setAmplitude] = useState(80);
  const [frequency, setFrequency] = useState(2);
  const [waveType, setWaveType] = useState<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine');
  const [damping, setDamping] = useState(0);
  const [showWavelength, setShowWavelength] = useState(true);

  return (
    <ExperimentLayout
      title="Wave Properties Lab"
      category="physics"
      description="Waves are disturbances that transfer energy through matter or space. This lab allows you to explore different types of waves and understand their properties such as amplitude, frequency, wavelength, and damping."
      formula="y(x,t) = A·sin(kx - ωt)"
      formulaExplanation="Where y is the displacement, A is amplitude, k is wave number (2π/λ), ω is angular frequency (2πf), x is position, and t is time. This is the equation for a traveling sine wave. Different wave types have different mathematical representations."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Controls
          amplitude={amplitude}
          frequency={frequency}
          waveType={waveType}
          damping={damping}
          showWavelength={showWavelength}
          setAmplitude={setAmplitude}
          setFrequency={setFrequency}
          setWaveType={setWaveType}
          setDamping={setDamping}
          setShowWavelength={setShowWavelength}
        />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Wave Visualization</h3>
          <Simulation
            amplitude={amplitude}
            frequency={frequency}
            waveType={waveType}
            damping={damping}
            showWavelength={showWavelength}
          />
          
          <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-100">
            <h4 className="font-bold mb-2">Observations:</h4>
            <ul className="list-disc ml-5">
              <li>Amplitude determines the maximum displacement from equilibrium</li>
              <li>Frequency controls how many wave cycles appear in a given space</li>
              <li>Different wave types have applications in various fields</li>
              <li>Damping shows how waves lose energy as they travel</li>
              <li>Wavelength and frequency are inversely related (λ = v/f)</li>
            </ul>
          </div>
        </div>
      </div>
    </ExperimentLayout>
  );
} 