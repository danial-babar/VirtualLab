import Simulation from "./Simulation";
import Controls from "./Controls";
import { useState } from "react";

export default function OhmsLawPage() {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(3);

  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Ohm's Law Virtual Lab</h1>
      <Controls
        voltage={voltage}
        resistance={resistance}
        setVoltage={setVoltage}
        setResistance={setResistance}
      />
      <Simulation voltage={voltage} resistance={resistance} />
    </main>
  );
}
