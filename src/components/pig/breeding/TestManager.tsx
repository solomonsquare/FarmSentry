import React from 'react';
import { BreedingCycle } from '../../../types/pig';

interface Props {
  breedingCycles: BreedingCycle[];
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onUpdate: (cycles: BreedingCycle[]) => void;
}

export function TestManager(props: Props) {
  console.log('TestManager attempting to render');
  
  return (
    <div className="p-4 bg-red-100 border-4 border-red-500">
      <h2 className="text-xl font-bold">Test Manager</h2>
      <p>If you can see this red box, the component is rendering</p>
      <pre className="text-xs mt-2">
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
} 