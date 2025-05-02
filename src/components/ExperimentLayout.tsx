'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ExperimentLayoutProps {
  title: string;
  category: 'physics' | 'chemistry' | 'biology';
  description: string;
  formula?: string;
  formulaExplanation?: string;
  children: ReactNode;
}

export default function ExperimentLayout({
  title,
  category,
  description,
  formula,
  formulaExplanation,
  children
}: ExperimentLayoutProps) {
  const categoryLabels = {
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology'
  };
  
  const categoryColors = {
    physics: 'bg-blue-50 border-blue-100',
    chemistry: 'bg-green-50 border-green-100',
    biology: 'bg-purple-50 border-purple-100'
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Experiments
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="w-24"></div> {/* Spacer for flex alignment */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">Experiment Overview</h2>
            <span className={`ml-auto px-3 py-1 text-sm rounded ${categoryColors[category]}`}>
              {categoryLabels[category]}
            </span>
          </div>
          
          <p className="mb-4">{description}</p>
          
          {formula && (
            <div className="bg-gray-100 p-4 text-center text-xl font-bold mb-4">
              {formula}
            </div>
          )}
          
          {formulaExplanation && <p>{formulaExplanation}</p>}
        </div>

        {children}
      </div>
    </main>
  );
} 