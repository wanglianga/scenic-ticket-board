import { writable } from 'svelte/store';
import type { GateStatus } from '../types';
import { mockGates } from '../data/mockGates';

const createGateStore = () => {
  const { subscribe, set, update } = writable<GateStatus[]>(mockGates);

  return {
    subscribe,
    
    toggleGate: (gateId: string) => {
      update(gates => gates.map(gate => 
        gate.id === gateId ? { ...gate, isOnline: !gate.isOnline } : gate
      ));
    },

    updateQueueLength: (gateId: string, length: number) => {
      update(gates => gates.map(gate => 
        gate.id === gateId ? { ...gate, currentQueueLength: length } : gate
      ));
    }
  };
};

export const gateStore = createGateStore();
