import { writable, derived } from 'svelte/store';
import type { GateStatus, GateDetail } from '../types';
import { mockGates } from '../data/mockGates';
import { mockGateDetails } from '../data/mockGateDetails';

const createGateStore = () => {
  const { subscribe, set, update } = writable<GateStatus[]>(mockGates);
  const { subscribe: subscribeDetails, set: setDetails, update: updateDetails } = writable<GateDetail[]>(mockGateDetails);

  return {
    subscribe,
    subscribeDetails,
    
    toggleGate: (gateId: string) => {
      update(gates => gates.map(gate => 
        gate.id === gateId ? { ...gate, isOnline: !gate.isOnline } : gate
      ));
      updateDetails(gates => gates.map(gate =>
        gate.id === gateId ? { ...gate, isOnline: !gate.isOnline } : gate
      ));
    },

    updateQueueLength: (gateId: string, length: number) => {
      update(gates => gates.map(gate => 
        gate.id === gateId ? { ...gate, currentQueueLength: length } : gate
      ));
      updateDetails(gates => gates.map(gate =>
        gate.id === gateId ? { ...gate, currentQueueLength: length } : gate
      ));
    },

    openBackupGate: (gateId: string) => {
      updateDetails(gates => gates.map(gate =>
        gate.id === gateId ? { ...gate, isOnline: true, isBackup: false } : gate
      ));
      update(gates => gates.map(gate => 
        gate.id === gateId ? { ...gate, isOnline: true } : gate
      ));
    },

    closeAsBackup: (gateId: string) => {
      updateDetails(gates => gates.map(gate =>
        gate.id === gateId ? { ...gate, isOnline: false, isBackup: true, currentQueueLength: 0 } : gate
      ));
      update(gates => gates.map(gate => 
        gate.id === gateId ? { ...gate, isOnline: false, currentQueueLength: 0 } : gate
      ));
    }
  };
};

export const gateStore = createGateStore();

export const backupGates = derived(gateStore, $gates => 
  $gates.filter(g => g.todayPassengerCount > 0 && g.currentQueueLength === 0)
);

export const busyGates = derived(gateStore, $gates =>
  $gates.filter(g => g.isOnline && g.currentQueueLength > 10)
);
