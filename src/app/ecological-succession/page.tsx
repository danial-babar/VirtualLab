'use client';

import dynamic from 'next/dynamic';

// Dynamically import the EcologicalSuccessionExperiment component
const EcologicalSuccessionExperiment = dynamic(
  () => import('@/experiments/biology/ecological-succession'),
  { ssr: false }
);

export default function EcologicalSuccessionPage() {
  return <EcologicalSuccessionExperiment />;
} 