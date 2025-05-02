'use client';

interface Props {
  length: number;
  gravity: number;
  initialAngle: number;
  damping: number;
  setLength: (length: number) => void;
  setGravity: (gravity: number) => void;
  setInitialAngle: (angle: number) => void;
  setDamping: (damping: number) => void;
}

export default function PendulumControls({
  length,
  gravity,
  initialAngle,
  damping,
  setLength,
  setGravity,
  setInitialAngle,
  setDamping,
}: Props) {
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Pendulum Length (m): {length.toFixed(2)}m
        </label>
        <div className="flex items-center">
          <span className="mr-2">0.1m</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.05"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">2.0m</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Gravity (m/s²): {gravity.toFixed(2)}m/s²
        </label>
        <div className="flex items-center">
          <span className="mr-2">1</span>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">20</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Earth: 9.8 m/s² | Moon: 1.6 m/s² | Mars: 3.7 m/s²
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Initial Angle: {initialAngle}°
        </label>
        <div className="flex items-center">
          <span className="mr-2">0°</span>
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={initialAngle}
            onChange={(e) => setInitialAngle(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">90°</span>
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
            max="0.5"
            step="0.01"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">0.5</span>
        </div>
      </div>

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setInitialAngle(30);
          setDamping(0.05);
          setLength(1);
          setGravity(9.8);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Pendulum Period</h4>
        <p>For small angles, the period (T) is given by:</p>
        <div className="font-semibold my-2 text-center">T = 2π√(L/g)</div>
        <p>Where:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>T = Period (seconds)</li>
          <li>L = Length (meters)</li>
          <li>g = Gravity (m/s²)</li>
        </ul>
        <p className="mt-2 text-xs">
          Note: This approximation works best for small angles. For larger angles, the period slightly increases.
        </p>
      </div>
    </div>
  );
} 