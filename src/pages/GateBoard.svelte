<script lang="ts">
  import { Search, Building2, Clock, QrCode } from 'lucide-svelte';
  import TeamCard from '../components/TeamCard.svelte';
  import GateStatusCard from '../components/GateStatusCard.svelte';
  import VerifyPanel from '../components/VerifyPanel.svelte';
  import VisitorList from '../components/VisitorList.svelte';
  import { teamStore, pendingTeams } from '../stores/teamStore';
  import { gateStore } from '../stores/gateStore';
  import type { TeamOrder } from '../types';

  let searchQuery = '';
  let selectedTeam: TeamOrder | null = null;

  $: filteredTeams = $pendingTeams.filter(team => 
    team.agency.name.includes(searchQuery) || 
    team.orderNo.includes(searchQuery) ||
    team.guide.name.includes(searchQuery)
  );

  const selectTeam = (team: TeamOrder) => {
    selectedTeam = team;
  };

  const handleVerifyAll = () => {
    if (selectedTeam) {
      teamStore.verifyAll(selectedTeam.id);
    }
  };

  const handleVerifyVisitor = (visitorId: string) => {
    if (selectedTeam) {
      teamStore.verifyVisitor(selectedTeam.id, visitorId);
    }
  };

  const handleMarkAbsent = (visitorId: string) => {
    if (selectedTeam) {
      teamStore.markAbsent(selectedTeam.id, visitorId);
    }
  };

  const handleConfirmGuide = () => {
    if (selectedTeam) {
      teamStore.confirmGuide(selectedTeam.id);
    }
  };

  const handleToggleGate = (gateId: string) => {
    gateStore.toggleGate(gateId);
  };

  $: {
    if (selectedTeam) {
      const updated = $teamStore.find(t => t.id === (selectedTeam as TeamOrder).id);
      if (updated) selectedTeam = updated;
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div class="lg:col-span-2 space-y-6">
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <QrCode class="w-5 h-5 text-primary-600" />
          待核验队列
        </h2>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="快速搜索团队"
            class="pl-9 pr-4 py-2 w-56 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>

      <div class="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
        {#each filteredTeams as team}
          <div 
            class="cursor-pointer transition-all"
            class:ring-2="{selectedTeam?.id === team.id}"
            class:ring-primary-500="{selectedTeam?.id === team.id}"
            on:click={() => selectTeam(team)}
          >
            <TeamCard team={team} expanded={selectedTeam?.id === team.id} />
          </div>
        {/each}
        
        {#if filteredTeams.length === 0}
          <div class="text-center py-12 bg-white rounded-xl border border-gray-100">
            <QrCode class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">暂无待核验团队</p>
          </div>
        {/if}
      </div>
    </section>
  </div>

  <div class="space-y-6">
    <section>
      <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <Building2 class="w-5 h-5 text-primary-600" />
        闸口状态
      </h2>
      <div class="grid grid-cols-2 gap-3">
        {#each $gateStore as gate}
          <GateStatusCard gate={gate} onToggle={() => handleToggleGate(gate.id)} />
        {/each}
      </div>
    </section>

    {#if selectedTeam}
      <section class="space-y-4">
        <VerifyPanel 
          team={selectedTeam}
          onVerifyAll={handleVerifyAll}
          onConfirmGuide={handleConfirmGuide}
        />
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">游客核验清单</h3>
          </div>
          <VisitorList 
            visitors={selectedTeam.visitors}
            canOperate={true}
            onVerify={handleVerifyVisitor}
            onMarkAbsent={handleMarkAbsent}
          />
        </div>
      </section>
    {:else}
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <QrCode class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-500">请从左侧选择一个团队进行核验</p>
      </div>
    {/if}
  </div>
</div>
