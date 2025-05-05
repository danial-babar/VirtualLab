'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ProteinSynthesisExperiment component
const ProteinSynthesisExperiment = dynamic(
  () => import('@/experiments/biology/protein-synthesis'),
  { ssr: false }
);

export default function ProteinSynthesisPage() {
  return <ProteinSynthesisExperiment />;
} 