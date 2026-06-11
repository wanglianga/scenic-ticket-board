import type { GateDetail } from '../types';
import { mockTeams } from './mockTeams';

const pendingTeams = mockTeams.filter(t => t.status === 'pending' || t.status === 'partial');

function generateRecentTimes(count: number): string[] {
  const times: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const t = new Date(now.getTime() - i * 15000 - Math.random() * 10000);
    times.push(t.toISOString());
  }
  return times;
}

function calculateAvgSpeed(passTimes: string[]): number {
  if (passTimes.length < 2) return 0;
  let totalInterval = 0;
  for (let i = 0; i < passTimes.length - 1; i++) {
    totalInterval += new Date(passTimes[i]).getTime() - new Date(passTimes[i + 1]).getTime();
  }
  const avgInterval = totalInterval / (passTimes.length - 1);
  return Math.round(3600000 / avgInterval);
}

const recentTimes1 = generateRecentTimes(15);
const recentTimes2 = generateRecentTimes(12);
const recentTimes4 = generateRecentTimes(18);
const recentTimes5 = generateRecentTimes(8);
const recentTimes6 = generateRecentTimes(10);

export const mockGateDetails: GateDetail[] = [
  {
    id: 'gate1',
    name: '1号闸口',
    isOnline: true,
    todayPassengerCount: 856,
    currentQueueLength: 5,
    currentTeam: pendingTeams[0],
    pendingTeams: pendingTeams.slice(1, 3),
    avgPassSpeed: calculateAvgSpeed(recentTimes1),
    abnormalVisitors: [],
    recentPassTime: recentTimes1,
    isBackup: false,
  },
  {
    id: 'gate2',
    name: '2号闸口',
    isOnline: true,
    todayPassengerCount: 723,
    currentQueueLength: 8,
    currentTeam: pendingTeams[2],
    pendingTeams: pendingTeams.slice(3, 5),
    avgPassSpeed: calculateAvgSpeed(recentTimes2),
    abnormalVisitors: pendingTeams[2]?.visitors.filter(v => !v.hasIdCard).slice(0, 2) || [],
    recentPassTime: recentTimes2,
    isBackup: false,
  },
  {
    id: 'gate3',
    name: '3号闸口',
    isOnline: false,
    todayPassengerCount: 412,
    currentQueueLength: 0,
    pendingTeams: [],
    avgPassSpeed: 0,
    abnormalVisitors: [],
    recentPassTime: [],
    isBackup: true,
  },
  {
    id: 'gate4',
    name: '4号闸口',
    isOnline: true,
    todayPassengerCount: 934,
    currentQueueLength: 3,
    currentTeam: pendingTeams[5],
    pendingTeams: pendingTeams.slice(6, 7),
    avgPassSpeed: calculateAvgSpeed(recentTimes4),
    abnormalVisitors: [],
    recentPassTime: recentTimes4,
    isBackup: false,
  },
  {
    id: 'gate5',
    name: '5号闸口',
    isOnline: true,
    todayPassengerCount: 678,
    currentQueueLength: 12,
    currentTeam: pendingTeams[1],
    pendingTeams: pendingTeams.slice(2, 4),
    avgPassSpeed: calculateAvgSpeed(recentTimes5),
    abnormalVisitors: pendingTeams[1]?.visitors.filter(v => !v.hasIdCard).slice(0, 3) || [],
    recentPassTime: recentTimes5,
    isBackup: false,
  },
  {
    id: 'gate6',
    name: '6号闸口',
    isOnline: true,
    todayPassengerCount: 545,
    currentQueueLength: 2,
    currentTeam: undefined,
    pendingTeams: [],
    avgPassSpeed: calculateAvgSpeed(recentTimes6),
    abnormalVisitors: [],
    recentPassTime: recentTimes6,
    isBackup: true,
  },
];
