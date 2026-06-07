import type { GateStatus } from '../types';

export const mockGates: GateStatus[] = [
  { id: 'gate1', name: '1号闸口', isOnline: true, todayPassengerCount: 856, currentQueueLength: 5 },
  { id: 'gate2', name: '2号闸口', isOnline: true, todayPassengerCount: 723, currentQueueLength: 8 },
  { id: 'gate3', name: '3号闸口', isOnline: false, todayPassengerCount: 412, currentQueueLength: 0 },
  { id: 'gate4', name: '4号闸口', isOnline: true, todayPassengerCount: 934, currentQueueLength: 3 },
  { id: 'gate5', name: '5号闸口', isOnline: true, todayPassengerCount: 678, currentQueueLength: 12 },
  { id: 'gate6', name: '6号闸口', isOnline: true, todayPassengerCount: 545, currentQueueLength: 2 },
];
