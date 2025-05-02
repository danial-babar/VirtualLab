'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Define molecular data structures
interface Atom {
  element: string;
  position: [number, number, number];
}

interface Bond {
  atomIndex1: number;
  atomIndex2: number;
  bondOrder: number;
}

interface Molecule {
  name: string;
  atoms: Atom[];
  bonds: Bond[];
}

// Predefined set of molecules
const MOLECULES: Record<string, Molecule> = {
  'water': {
    name: 'Water (H₂O)',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'H', position: [0.757, 0.586, 0] },
      { element: 'H', position: [-0.757, 0.586, 0] }
    ],
    bonds: [
      { atomIndex1: 0, atomIndex2: 1, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 2, bondOrder: 1 }
    ]
  },
  'methane': {
    name: 'Methane (CH₄)',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'H', position: [0.635, 0.635, 0.635] },
      { element: 'H', position: [-0.635, -0.635, 0.635] },
      { element: 'H', position: [0.635, -0.635, -0.635] },
      { element: 'H', position: [-0.635, 0.635, -0.635] }
    ],
    bonds: [
      { atomIndex1: 0, atomIndex2: 1, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 2, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 3, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 4, bondOrder: 1 }
    ]
  },
  'ammonia': {
    name: 'Ammonia (NH₃)',
    atoms: [
      { element: 'N', position: [0, 0, 0] },
      { element: 'H', position: [0.94, -0.09, 0] },
      { element: 'H', position: [-0.42, 0.84, 0] },
      { element: 'H', position: [-0.42, -0.75, 0] }
    ],
    bonds: [
      { atomIndex1: 0, atomIndex2: 1, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 2, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 3, bondOrder: 1 }
    ]
  },
  'carbon-dioxide': {
    name: 'Carbon Dioxide (CO₂)',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'O', position: [1.16, 0, 0] },
      { element: 'O', position: [-1.16, 0, 0] }
    ],
    bonds: [
      { atomIndex1: 0, atomIndex2: 1, bondOrder: 2 },
      { atomIndex1: 0, atomIndex2: 2, bondOrder: 2 }
    ]
  },
  'ethanol': {
    name: 'Ethanol (C₂H₅OH)',
    atoms: [
      { element: 'C', position: [1.1, 0, 0] },
      { element: 'C', position: [0, 0, 0] },
      { element: 'O', position: [-1.1, 0, 0] },
      { element: 'H', position: [-1.5, 0.85, 0] },
      { element: 'H', position: [1.5, 1, 0] },
      { element: 'H', position: [1.5, -0.5, 0.85] },
      { element: 'H', position: [1.5, -0.5, -0.85] },
      { element: 'H', position: [-0.4, 0.85, 0.5] },
      { element: 'H', position: [-0.4, -0.85, -0.5] }
    ],
    bonds: [
      { atomIndex1: 0, atomIndex2: 1, bondOrder: 1 },
      { atomIndex1: 1, atomIndex2: 2, bondOrder: 1 },
      { atomIndex1: 2, atomIndex2: 3, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 4, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 5, bondOrder: 1 },
      { atomIndex1: 0, atomIndex2: 6, bondOrder: 1 },
      { atomIndex1: 1, atomIndex2: 7, bondOrder: 1 },
      { atomIndex1: 1, atomIndex2: 8, bondOrder: 1 }
    ]
  },
  'benzene': {
    name: 'Benzene (C₆H₆)',
    atoms: [
      { element: 'C', position: [0, 1.4, 0] },
      { element: 'C', position: [1.212, 0.7, 0] },
      { element: 'C', position: [1.212, -0.7, 0] },
      { element: 'C', position: [0, -1.4, 0] },
      { element: 'C', position: [-1.212, -0.7, 0] },
      { element: 'C', position: [-1.212, 0.7, 0] },
      { element: 'H', position: [0, 2.48, 0] },
      { element: 'H', position: [2.147, 1.24, 0] },
      { element: 'H', position: [2.147, -1.24, 0] },
      { element: 'H', position: [0, -2.48, 0] },
      { element: 'H', position: [-2.147, -1.24, 0] },
      { element: 'H', position: [-2.147, 1.24, 0] }
    ],
    bonds: [
      { atomIndex1: 0, atomIndex2: 1, bondOrder: 1.5 },
      { atomIndex1: 1, atomIndex2: 2, bondOrder: 1.5 },
      { atomIndex1: 2, atomIndex2: 3, bondOrder: 1.5 },
      { atomIndex1: 3, atomIndex2: 4, bondOrder: 1.5 },
      { atomIndex1: 4, atomIndex2: 5, bondOrder: 1.5 },
      { atomIndex1: 5, atomIndex2: 0, bondOrder: 1.5 },
      { atomIndex1: 0, atomIndex2: 6, bondOrder: 1 },
      { atomIndex1: 1, atomIndex2: 7, bondOrder: 1 },
      { atomIndex1: 2, atomIndex2: 8, bondOrder: 1 },
      { atomIndex1: 3, atomIndex2: 9, bondOrder: 1 },
      { atomIndex1: 4, atomIndex2: 10, bondOrder: 1 },
      { atomIndex1: 5, atomIndex2: 11, bondOrder: 1 }
    ]
  }
};

// Element data: colors and atom radii
const ELEMENT_DATA: Record<string, { color: string; radius: number }> = {
  'H': { color: '#FFFFFF', radius: 0.25 },
  'C': { color: '#909090', radius: 0.7 },
  'N': { color: '#3050F8', radius: 0.65 },
  'O': { color: '#FF0D0D', radius: 0.6 },
  'F': { color: '#90E050', radius: 0.5 },
  'P': { color: '#FF8000', radius: 1.0 },
  'S': { color: '#FFFF30', radius: 1.0 },
  'Cl': { color: '#1FF01F', radius: 1.0 },
  'Br': { color: '#A62929', radius: 1.15 },
  'I': { color: '#940094', radius: 1.4 }
};

interface Props {
  selectedMolecule: string;
  rotationSpeed: number;
  renderStyle: 'ball-and-stick' | 'space-filling';
  showLabels: boolean;
  bondWidth: number;
}

export default function MolecularViewer({
  selectedMolecule,
  rotationSpeed,
  renderStyle,
  showLabels,
  bondWidth
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const molObjectRef = useRef<THREE.Group | null>(null);

  const [infoText, setInfoText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Three.js
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (molObjectRef.current && rotationSpeed > 0) {
        molObjectRef.current.rotation.y += 0.01 * rotationSpeed;
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [rotationSpeed]);
  
  // Create molecular model when selectedMolecule changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    setIsLoading(true);
    
    // Remove previous molecular model
    if (molObjectRef.current) {
      sceneRef.current.remove(molObjectRef.current);
    }
    
    // Get molecule data
    const molecule = MOLECULES[selectedMolecule];
    if (!molecule) {
      setInfoText('Molecule not found');
      setIsLoading(false);
      return;
    }
    
    // Set molecule info
    setInfoText(`${molecule.name} - ${molecule.atoms.length} atoms, ${molecule.bonds.length} bonds`);
    
    // Create a new group for the molecular model
    const molObject = new THREE.Group();
    
    // Create geometries based on renderStyle
    const atomObjects: THREE.Mesh[] = [];
    
    // Add atoms
    molecule.atoms.forEach((atom, i) => {
      const element = atom.element;
      const elementData = ELEMENT_DATA[element] || { color: '#FFFFFF', radius: 0.5 };
      
      // Adjust radius based on render style
      const radius = renderStyle === 'ball-and-stick' 
        ? elementData.radius * 0.3 
        : elementData.radius;
      
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: elementData.color,
        specular: 0x111111,
        shininess: 30
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...atom.position);
      
      // Store mesh for bond connections
      atomObjects.push(mesh);
      molObject.add(mesh);
      
      // Add label if enabled
      if (showLabels) {
        // Create canvas for text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = 128;
          canvas.height = 128;
          
          context.fillStyle = 'rgba(255,255,255,0.7)';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          context.font = 'Bold 60px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillStyle = 'black';
          context.fillText(element, canvas.width/2, canvas.height/2);
          
          const texture = new THREE.CanvasTexture(canvas);
          const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(spriteMaterial);
          
          sprite.position.set(...atom.position);
          sprite.position.y += radius + 0.3;
          sprite.scale.set(0.5, 0.5, 0.5);
          
          molObject.add(sprite);
        }
      }
    });
    
    // Add bonds if in ball-and-stick mode
    if (renderStyle === 'ball-and-stick') {
      molecule.bonds.forEach(bond => {
        const atom1 = molecule.atoms[bond.atomIndex1];
        const atom2 = molecule.atoms[bond.atomIndex2];
        
        // Skip if atoms don't exist
        if (!atom1 || !atom2) return;
        
        const start = new THREE.Vector3(...atom1.position);
        const end = new THREE.Vector3(...atom2.position);
        
        // Calculate bond properties
        const bondLength = start.distanceTo(end);
        const bondCenter = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        
        // Create bond cylinder
        const direction = new THREE.Vector3().subVectors(end, start);
        const bondGeometry = new THREE.CylinderGeometry(
          bondWidth * 0.1, // top radius
          bondWidth * 0.1, // bottom radius
          bondLength, // height
          8, // radial segments
          1, // height segments
          false // open-ended
        );
        
        // Rotate cylinder to align with bond direction
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), // cylinder's default orientation
          direction.clone().normalize()
        );
        
        // Create bond material
        const bondMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xFFFFFF,
          specular: 0x111111,
          shininess: 20
        });
        
        // Create bond mesh and position it
        const bondMesh = new THREE.Mesh(bondGeometry, bondMaterial);
        bondMesh.position.copy(bondCenter);
        bondMesh.quaternion.copy(quaternion);
        
        // Add to molecule group
        molObject.add(bondMesh);
        
        // Add double or triple bonds if needed
        if (bond.bondOrder > 1) {
          // For simplicity, we'll just make additional bonds as a visual cue
          // In a real app, you'd calculate proper offset vectors perpendicular to bond axis
          const offset = 0.15; // offset distance
          
          // Create a perpendicular vector to the bond
          const perpVector = new THREE.Vector3(1, 0, 0);
          if (Math.abs(direction.dot(perpVector)) > 0.9) {
            perpVector.set(0, 1, 0);
          }
          perpVector.crossVectors(direction, perpVector).normalize();
          
          // Add second bond if order >= 1.5 (for aromatic bonds)
          if (bond.bondOrder >= 1.5) {
            const secondBondPos = bondCenter.clone().add(
              perpVector.clone().multiplyScalar(offset)
            );
            
            const secondBondMesh = bondMesh.clone();
            secondBondMesh.position.copy(secondBondPos);
            molObject.add(secondBondMesh);
          }
          
          // Add third bond if order >= 3
          if (bond.bondOrder >= 3) {
            const thirdBondPos = bondCenter.clone().add(
              perpVector.clone().multiplyScalar(-offset)
            );
            
            const thirdBondMesh = bondMesh.clone();
            thirdBondMesh.position.copy(thirdBondPos);
            molObject.add(thirdBondMesh);
          }
        }
      });
    }
    
    // Center the molecule
    const box = new THREE.Box3().setFromObject(molObject);
    const center = box.getCenter(new THREE.Vector3());
    molObject.position.sub(center);
    
    // Add to scene
    sceneRef.current.add(molObject);
    molObjectRef.current = molObject;
    
    // Reset camera position based on molecule size
    if (cameraRef.current) {
      const boxSize = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
      const distance = maxDim * 2.5;
      cameraRef.current.position.z = distance;
    }
    
    setIsLoading(false);
  }, [selectedMolecule, renderStyle, showLabels, bondWidth]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight || 500;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center p-2 bg-white border-b text-sm">
        <div>
          <span className="font-semibold mr-2">Viewing:</span>
          <span>{infoText}</span>
        </div>
        <div>
          <span className="text-xs text-gray-600">Drag to rotate, scroll to zoom</span>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-[500px] bg-gray-100 overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading molecule...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 