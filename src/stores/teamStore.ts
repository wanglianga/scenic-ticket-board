import { writable, derived } from 'svelte/store';
import type { TeamOrder, TimeSlot } from '../types';
import { mockTeams, mockTimeSlots } from '../data/mockTeams';

const createTeamStore = () => {
  const { subscribe, set, update } = writable<TeamOrder[]>(mockTeams);
  const { subscribe: subscribeSlots, set: setSlots, update: updateSlots } = writable<TimeSlot[]>(mockTimeSlots);

  return {
    subscribe,
    subscribeSlots,
    
    verifyVisitor: (teamId: string, visitorId: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        const visitors = team.visitors.map(v => 
          v.id === visitorId ? { ...v, isVerified: true } : v
        );
        const verifiedCount = visitors.filter(v => v.isVerified).length;
        const status = verifiedCount === team.totalVisitors ? 'verified' as const : 'partial' as const;
        return { ...team, visitors, verifiedCount, status };
      }));
    },

    markAbsent: (teamId: string, visitorId: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        const visitors = team.visitors.map(v => 
          v.id === visitorId ? { ...v, isAbsent: true, isVerified: false } : v
        );
        const absentCount = visitors.filter(v => v.isAbsent).length;
        const verifiedCount = visitors.filter(v => v.isVerified).length;
        return { ...team, visitors, absentCount, verifiedCount };
      }));
    },

    verifyAll: (teamId: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        const visitors = team.visitors.map(v => ({ ...v, isVerified: true, isAbsent: false }));
        return { ...team, visitors, verifiedCount: team.totalVisitors, absentCount: 0, status: 'verified' };
      }));
    },

    confirmGuide: (teamId: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        return { ...team, guide: { ...team.guide, isConfirmed: true } };
      }));
    },

    getTeamById: (id: string) => {
      let team: TeamOrder | undefined;
      subscribe(t => {
        team = t.find(tm => tm.id === id);
      })();
      return team;
    }
  };
};

export const teamStore = createTeamStore();

export const abnormalTeams = derived(teamStore, $teams => 
  $teams.filter(t => t.isOverCapacity || t.missingIdCardCount > 0 || !t.guide.isConfirmed)
);

export const pendingTeams = derived(teamStore, $teams => 
  $teams.filter(t => t.status === 'pending' || t.status === 'partial').sort((a, b) => {
    const timeA = a.timeSlot.startTime;
    const timeB = b.timeSlot.startTime;
    return timeA.localeCompare(timeB);
  })
);
