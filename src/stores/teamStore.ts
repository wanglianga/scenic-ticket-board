import { writable, derived } from 'svelte/store';
import type { TeamOrder, TimeSlot, RefundRecord, SplitBatch } from '../types';
import { mockTeams, mockTimeSlots, mockRefundRecords } from '../data/mockTeams';

const createTeamStore = () => {
  const { subscribe, set, update } = writable<TeamOrder[]>(mockTeams);
  const { subscribe: subscribeSlots, set: setSlots, update: updateSlots } = writable<TimeSlot[]>(mockTimeSlots);
  const { subscribe: subscribeRefunds, set: setRefunds, update: updateRefunds } = writable<RefundRecord[]>(mockRefundRecords);

  return {
    subscribe,
    subscribeSlots,
    subscribeRefunds,
    
    verifyVisitor: (teamId: string, visitorId: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        if (!team.canVerify) return team;
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
        if (!team.canVerify) return team;
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

    confirmSplit: (teamId: string, batches: SplitBatch[]) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        return { 
          ...team, 
          splitBatches: batches,
          overCapacityInfo: team.overCapacityInfo 
            ? { ...team.overCapacityInfo, isSplitConfirmed: true }
            : undefined
        };
      }));
    },

    setSupplementDeadline: (teamId: string, deadline: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        const hasMissingDocs = team.missingDocs && team.missingDocs.some(d => !d.isSupplied);
        return { 
          ...team, 
          supplementDeadline: deadline,
          status: hasMissingDocs ? 'pending_docs' as const : team.status,
          canVerify: !hasMissingDocs
        };
      }));
    },

    markDocSupplied: (teamId: string, visitorId: string) => {
      update(teams => teams.map(team => {
        if (team.id !== teamId) return team;
        const missingDocs = team.missingDocs?.map(d => 
          d.visitorId === visitorId ? { ...d, isSupplied: true } : d
        );
        const visitors = team.visitors.map(v => 
          v.id === visitorId ? { ...v, hasIdCard: true, missingDocType: 'none' as const } : v
        );
        const hasMissingDocs = missingDocs && missingDocs.some(d => !d.isSupplied);
        const missingIdCardCount = missingDocs?.filter(d => !d.isSupplied).length || 0;
        return { 
          ...team, 
          missingDocs,
          visitors,
          missingIdCardCount,
          canVerify: !hasMissingDocs,
          status: hasMissingDocs ? 'pending_docs' as const : (team.status === 'pending_docs' ? 'pending' as const : team.status)
        };
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
  $teams.filter(t => t.isOverCapacity || t.missingIdCardCount > 0 || !t.guide.isConfirmed || t.status === 'pending_docs')
);

export const pendingTeams = derived(teamStore, $teams => 
  $teams.filter(t => t.status === 'pending' || t.status === 'partial' || t.status === 'pending_docs').sort((a, b) => {
    const timeA = a.timeSlot.startTime;
    const timeB = b.timeSlot.startTime;
    return timeA.localeCompare(timeB);
  })
);
