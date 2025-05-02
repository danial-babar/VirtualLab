'use client';

import { useEffect, useState } from 'react';

interface Props {
  voltage: number;
  resistance: number;
  setVoltage: (v: number) => void;
  setResistance: (r: number) => void;
}

export default function Controls({
  voltage,
  resistance,
  setVoltage,
  setResistance,
}: Props) {
  const [power, setPower] = useState(0);
  const current = voltage / resistance;

  // Calculate power (P = V*I or P = I²R)
  useEffect(() => {
    setPower(voltage * current);
  }, [voltage, current]);

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Experiment Controls</h3>
      
      <div className="mb-4">
        <label className="block mb-2">
          Voltage (V): {voltage.toFixed(1)}V
        </label>
        <div className="flex items-center">
          <span className="mr-2">1V</span>
          <input
            type="range"
            min="1"
            max="24"
            step="0.5"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">24V</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Resistance (Ω): {resistance.toFixed(1)}Ω
        </label>
        <div className="flex items-center">
          <span className="mr-2">1Ω</span>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">20Ω</span>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-3 rounded border">
        <h4 className="font-bold mb-2">Measurements:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium">Current (I):</p>
            <p className="text-blue-600">{current.toFixed(2)} A</p>
          </div>
          <div>
            <p className="font-medium">Power (P):</p>
            <p className="text-blue-600">{power.toFixed(2)} W</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-100 text-sm">
        <h4 className="font-bold mb-1">Ohm's Law</h4>
        <p>I = V/R where:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>I = Current (Amperes)</li>
          <li>V = Voltage (Volts)</li>
          <li>R = Resistance (Ohms)</li>
        </ul>
        <p className="mt-2">Power: P = V × I = I²R = V²/R</p>
      </div>
    </div>
  );
}
  