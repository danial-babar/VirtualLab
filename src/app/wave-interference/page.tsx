'use client';

import dynamic from 'next/dynamic';

// Dynamically import the experiment component 
const WaveInterferenceExperiment = dynamic(
  () => import('@/experiments/physics/wave-interference'),
  {
    loading: () => <div className="p-12 text-center">Loading Wave Interference Simulator...</div>,
    ssr: false,
  }
);

export default function WaveInterferencePage() {
  return <WaveInterferenceExperiment />;
} 