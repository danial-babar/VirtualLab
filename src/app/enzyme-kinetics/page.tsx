'use client';

import dynamic from 'next/dynamic';

// Dynamically import the EnzymeKineticsExperiment component
const EnzymeKineticsExperiment = dynamic(
  () => import('@/experiments/biology/enzyme-kinetics'),
  { ssr: false }
);

export default function EnzymeKineticsPage() {
  return <EnzymeKineticsExperiment />;
} 