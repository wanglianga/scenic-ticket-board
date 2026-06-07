<script lang="ts">
  import { Search, Filter, AlertTriangle, Users, Clock } from 'lucide-svelte';
  import CapacityCard from '../components/CapacityCard.svelte';
  import TeamCard from '../components/TeamCard.svelte';
  import RefundRecordList from '../components/RefundRecordList.svelte';
  import { teamStore, abnormalTeams } from '../stores/teamStore';
  import { getNextDays } from '../utils/format';
  import type { TeamOrder, TimeSlot, RefundRecord } from '../types';

  const nextDays = getNextDays(1);
  let searchQuery = '';
  let filterType: 'all' | 'abnormal' | 'pending' = 'all';
  let expandedTeamId: string | null = null;
  let selectedTimeSlot: string | null = null;
  let slots: TimeSlot[] = [];
  let refundRecords: RefundRecord[] = [];
  
  teamStore.subscribeSlots(s => {
    slots = s;
  });

  teamStore.subscribeRefunds(r => {
    refundRecords = r;
  });

  $: filteredTeams = $teamStore.filter(team => {
    const matchesSearch = team.agency.name.includes(searchQuery) || 
                         team.orderNo.includes(searchQuery) ||
                         team.guide.name.includes(searchQuery);
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'abnormal' && (team.isOverCapacity || team.missingIdCardCount > 0 || !team.guide.isConfirmed)) ||
                         (filterType === 'pending' && (team.status === 'pending' || team.status === 'partial'));
    const matchesSlot = !selectedTimeSlot || team.timeSlot.id === selectedTimeSlot;
    return matchesSearch && matchesFilter && matchesSlot;
  });

  $: groupedTeams = filteredTeams.reduce((groups, team) => {
    const slotId = team.timeSlot.id;
    if (!groups[slotId]) {
      groups[slotId] = { slot: team.timeSlot, teams: [] };
    }
    groups[slotId].teams.push(team);
    return groups;
  }, {} as Record<string, { slot: any, teams: TeamOrder[] }>);

  const toggleExpand = (teamId: string) => {
    expandedTeamId = expandedTeamId === teamId ? null : teamId;
  };
</script>

<div class="space-y-6">
  <CapacityCard date={nextDays[0]} slots={slots} />

  {#if refundRecords.length > 0}
    <RefundRecordList records={refundRecords} />
  {/if}

  <section>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users class="w-5 h-5 text-primary-600" />
          团队预约列表
        </h2>
        <p class="text-sm text-gray-500">共 {filteredTeams.length} 个团队</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="搜索旅行社/订单号/导游"
            class="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        
        <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            on:click={() => filterType = 'all'}
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all {filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
          >
            全部
          </button>
          <button
            on:click={() => filterType = 'abnormal'}
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 {filterType === 'abnormal' ? 'bg-white text-danger shadow-sm' : 'text-gray-500 hover:text-danger'}"
          >
            <AlertTriangle class="w-3.5 h-3.5" />
            异常 ({$abnormalTeams.length})
          </button>
          <button
            on:click={() => filterType = 'pending'}
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all {filterType === 'pending' ? 'bg-white text-warning shadow-sm' : 'text-gray-500 hover:text-warning'}"
          >
            待核验
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      {#each Object.values(groupedTeams) as group}
        <div>
          <div class="flex items-center gap-2 mb-3">
            <Clock class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-gray-700">{group.slot.startTime} - {group.slot.endTime}</span>
            <span class="text-xs text-gray-500">({group.teams.length} 个团队)</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each group.teams as team}
              <TeamCard 
                team={team} 
                expanded={expandedTeamId === team.id}
                onExpand={() => toggleExpand(team.id)}
              />
            {/each}
          </div>
        </div>
      {/each}

      {#if filteredTeams.length === 0}
        <div class="text-center py-12">
          <Users class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">暂无匹配的团队记录</p>
        </div>
      {/if}
    </div>
  </section>
</div>
