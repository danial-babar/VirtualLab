'use client';

import dynamic from 'next/dynamic';

// Dynamically import the CirculatorySystemExperiment component
const CirculatorySystemExperiment = dynamic(
  () => import('@/experiments/biology/circulatory-system'),
  { ssr: false }
);

export default function CirculatorySystemPage() {
  return <CirculatorySystemExperiment />;
} 