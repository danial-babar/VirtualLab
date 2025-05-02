'use client';

interface Props {
  initialVelocity: number;
  launchAngle: number;
  gravity: number;
  airResistance: number;
  height: number;
  setInitialVelocity: (value: number) => void;
  setLaunchAngle: (value: number) => void;
  setGravity: (value: number) => void;
  setAirResistance: (value: number) => void;
  setHeight: (value: number) => void;
}

export default function ProjectileControls({
  initialVelocity,
  launchAngle,
  gravity,
  airResistance,
  height,
  setInitialVelocity,
  setLaunchAngle,
  setGravity,
  setAirResistance,
  setHeight,
}: Props) {
  // Calculate theoretical maximum range and height (without air resistance)
  const angleRad = (launchAngle * Math.PI) / 180;
  const theoreticalRange = (initialVelocity ** 2 * Math.sin(2 * angleRad)) / gravity;
  const theoreticalMaxHeight = height + (initialVelocity ** 2 * Math.sin(angleRad) ** 2) / (2 * gravity);
  
  // Presets for different planetary gravities
  const gravityPresets = [
    { name: 'Earth', value: 9.81 },
    { name: 'Moon', value: 1.62 },
    { name: 'Mars', value: 3.72 },
    { name: 'Jupiter', value: 24.79 }
  ];

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Initial Velocity: {initialVelocity.toFixed(1)} m/s
        </label>
        <div className="flex items-center">
          <span className="mr-2">5 m/s</span>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={initialVelocity}
            onChange={(e) => setInitialVelocity(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">50 m/s</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Launch Angle: {launchAngle}°
        </label>
        <div className="flex items-center">
          <span className="mr-2">0°</span>
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={launchAngle}
            onChange={(e) => setLaunchAngle(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">90°</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Initial Height: {height.toFixed(1)} m
        </label>
        <div className="flex items-center">
          <span className="mr-2">0 m</span>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">50 m</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Gravity: {gravity.toFixed(2)} m/s²
        </label>
        <div className="flex items-center">
          <span className="mr-2">1 m/s²</span>
          <input
            type="range"
            min="1"
            max="25"
            step="0.1"
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">25 m/s²</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {gravityPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setGravity(preset.value)}
              className={`px-2 py-1 text-xs rounded ${
                Math.abs(gravity - preset.value) < 0.1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {preset.name} ({preset.value})
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Air Resistance: {airResistance.toFixed(3)}
        </label>
        <div className="flex items-center">
          <span className="mr-2">0</span>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.001"
            value={airResistance}
            onChange={(e) => setAirResistance(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">0.05</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          0 = no air resistance | 0.05 = significant resistance
        </div>
      </div>

      <button 
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => {
          setInitialVelocity(20);
          setLaunchAngle(45);
          setGravity(9.81);
          setAirResistance(0.01);
          setHeight(0);
        }}
      >
        Reset to Default
      </button>

      <div className="mt-6 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Projectile Motion</h4>
        <p className="mb-2">For projectile motion without air resistance:</p>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="font-medium">Range (R):</p>
            <p className="font-mono">R = (v₀² × sin(2θ)) / g</p>
          </div>
          <div>
            <p className="font-medium">Max Height (H):</p>
            <p className="font-mono">H = h₀ + (v₀² × sin²(θ)) / (2g)</p>
          </div>
          <div>
            <p className="font-medium">Flight Time (T):</p>
            <p className="font-mono">T = (v₀ × sin(θ) + √((v₀ × sin(θ))² + 2gh₀)) / g</p>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Where v₀ is initial velocity, θ is launch angle, g is gravity, h₀ is initial height
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Theoretical Range:</span><br />
          {theoreticalRange.toFixed(2)} m
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Theoretical Max Height:</span><br />
          {theoreticalMaxHeight.toFixed(2)} m
        </div>
      </div>
    </div>
  );
} 