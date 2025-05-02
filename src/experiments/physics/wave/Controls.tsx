'use client';

import dynamic from 'next/dynamic';

interface Props {
  amplitude: number;
  frequency: number;
  waveType: 'sine' | 'square' | 'triangle' | 'sawtooth';
  damping: number;
  showWavelength: boolean;
  setAmplitude: (value: number) => void;
  setFrequency: (value: number) => void;
  setWaveType: (value: 'sine' | 'square' | 'triangle' | 'sawtooth') => void;
  setDamping: (value: number) => void;
  setShowWavelength: (value: boolean) => void;
}

function WaveControlsContent({
  amplitude,
  frequency,
  waveType,
  damping,
  showWavelength,
  setAmplitude,
  setFrequency,
  setWaveType,
  setDamping,
  setShowWavelength,
}: Props) {
  const waveTypes: { id: 'sine' | 'square' | 'triangle' | 'sawtooth'; name: string }[] = [
    { id: 'sine', name: 'Sine Wave' },
    { id: 'square', name: 'Square Wave' },
    { id: 'triangle', name: 'Triangle Wave' },
    { id: 'sawtooth', name: 'Sawtooth Wave' }
  ];

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-6">
        <label className="text-sm font-medium mb-1 block">Wave Type</label>
        <div className="grid grid-cols-2 gap-2">
          {waveTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setWaveType(type.id)}
              className={`py-2 px-3 text-sm rounded transition-colors ${
                waveType === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Amplitude: {amplitude}%
        </label>
        <div className="flex items-center">
          <span className="mr-2">0%</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">100%</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Frequency: {frequency} Hz
        </label>
        <div className="flex items-center">
          <span className="mr-2">1 Hz</span>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">10 Hz</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Damping: {damping.toFixed(2)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">1</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          0 = no damping | 1 = maximum damping
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showWavelength}
            onChange={(e) => setShowWavelength(e.target.checked)}
            className="mr-2"
          />
          Show wavelength indicator
        </label>
      </div>

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setAmplitude(80);
          setFrequency(2);
          setWaveType('sine');
          setDamping(0);
          setShowWavelength(true);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Wave Equations</h4>
        <p className="mb-2">Basic wave formulas:</p>
        <div className="grid grid-cols-1 gap-2 font-mono">
          <div>
            <p className="font-medium">Wave Speed (v):</p>
            <p>v = λ × f</p>
          </div>
          <div>
            <p className="font-medium">Wavelength (λ):</p>
            <p>λ = v / f</p>
          </div>
          <div>
            <p className="font-medium">Frequency (f):</p>
            <p>f = 1 / T</p>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Where λ is wavelength, f is frequency, v is wave speed, and T is period
        </p>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Application Examples:</span>
          <ul className="list-disc ml-4 mt-1">
            <li>Sine waves: Sound waves, AC electricity</li>
            <li>Square waves: Digital signals, pulse modulation</li>
            <li>Triangle waves: Audio synthesis, function generators</li>
            <li>Sawtooth waves: Musical instruments, relaxation oscillators</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Export a dynamically loaded version that only renders on client
const WaveControls = dynamic(() => Promise.resolve(WaveControlsContent), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Loading controls...</h3>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default WaveControls; 