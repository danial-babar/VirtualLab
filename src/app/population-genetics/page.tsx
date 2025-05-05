'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PopulationGeneticsExperiment component
const PopulationGeneticsExperiment = dynamic(
  () => import('@/experiments/biology/population-genetics'),
  { ssr: false }
);

export default function PopulationGeneticsPage() {
  return <PopulationGeneticsExperiment />;
} 