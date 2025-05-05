'use client';

import dynamic from 'next/dynamic';

// Dynamically import the NeuralSignalingExperiment component
const NeuralSignalingExperiment = dynamic(
  () => import('@/experiments/biology/neural-signaling'),
  { ssr: false }
);

export default function NeuralSignalingPage() {
  return <NeuralSignalingExperiment />;
} 