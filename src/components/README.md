# Component Library

## ExperimentContentLayout

A reusable layout component that provides a consistent and responsive structure for experiment modules, featuring:

- Side-by-side layout on desktop (simulation + controls)
- Stacked layout on mobile
- Sticky simulation area that stays visible while scrolling through info
- Sticky and independently scrollable controls section
- Optimized space management for all screen sizes

### Usage

```jsx
import ExperimentContentLayout from '@/components/ExperimentContentLayout';

// Your component
export default function YourExperiment() {
  // State, effects, etc...

  // Prepare components to pass to layout
  const simulationComponent = (
    <YourSimulation
      // props...
    />
  );

  const controlsComponent = (
    <YourControls
      // props...
    />
  );

  const infoComponent = (
    <>
      <h3 className="text-lg font-semibold mb-2">About Your Experiment</h3>
      <p className="text-sm">
        Description text...
      </p>
      
      {/* Additional info content */}
    </>
  );

  const additionalControlsInfo = (
    <>
      <h4 className="font-medium mb-1">Key Concepts</h4>
      <ul className="list-disc pl-5 text-xs">
        <li><strong>Concept 1:</strong> Description</li>
        <li><strong>Concept 2:</strong> Description</li>
      </ul>
    </>
  );

  return (
    <ExperimentLayout 
      title="Your Experiment"
      category="physics" // or chemistry, biology
      description="Description for the header"
      // other ExperimentLayout props...
    >
      <ExperimentContentLayout
        simulation={simulationComponent}
        controls={controlsComponent}
        info={infoComponent}                    // Optional
        additionalControlsInfo={additionalControlsInfo}  // Optional
      />
    </ExperimentLayout>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `simulation` | ReactNode | Yes | The simulation visualization component |
| `controls` | ReactNode | Yes | The controls for adjusting simulation parameters |
| `info` | ReactNode | No | Informational content about the experiment |
| `additionalControlsInfo` | ReactNode | No | Additional information to display below controls |

### Scrolling Behavior

- On desktop/large screens:
  - Simulation remains sticky at the top of its container
  - Controls are sticky and will scroll independently if content is taller than viewport
  - Info section scrolls with the page

- On mobile:
  - Components stack vertically in the order: simulation, controls, info
  - No sticky behavior to maximize space on small screens

### Styling Notes

- The component uses Tailwind CSS classes
- Custom scrollbar styling is applied to the controls section
- Responsive breakpoints follow Tailwind's default `lg` (1024px) size 