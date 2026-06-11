<script lang="ts">
  import { Search, Building2, Clock, QrCode, Users, Activity, UserPlus, ChevronRight } from 'lucide-svelte';
  import TeamCard from '../components/TeamCard.svelte';
  import GateStatusCard from '../components/GateStatusCard.svelte';
  import VerifyPanel from '../components/VerifyPanel.svelte';
  import VisitorList from '../components/VisitorList.svelte';
  import SubstituteModal from '../components/SubstituteModal.svelte';
  import SubstituteCompare from '../components/SubstituteCompare.svelte';
  import GateDiversionView from '../components/GateDiversionView.svelte';
  import { teamStore, pendingTeams } from '../stores/teamStore';
  import { gateStore } from '../stores/gateStore';
  import type { TeamOrder, Visitor, GateDetail } from '../types';

  type ViewMode = 'verify' | 'diversion';
  let currentView: ViewMode = 'verify';

  let searchQuery = '';
  let selectedTeam: TeamOrder | null = null;
  let showSubstituteModal = false;

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

  const handleOpenBackup = (gateId: string) => {
    gateStore.openBackupGate(gateId);
  };

  const handleCloseAsBackup = (gateId: string) => {
    gateStore.closeAsBackup(gateId);
  };

  const handleOpenSubstitute = () => {
    showSubstituteModal = true;
  };

  const handleSubstituteSubmit = (originalVisitorId: string, substituteVisitor: Visitor, reason: string) => {
    if (selectedTeam) {
      teamStore.substituteVisitor(selectedTeam.id, originalVisitorId, substituteVisitor, reason, '闸口工作人员');
      showSubstituteModal = false;
    }
  };

  $: {
    if (selectedTeam) {
      const updated = $teamStore.find(t => t.id === (selectedTeam as TeamOrder).id);
      if (updated) selectedTeam = updated;
    }
  }

  let gateDetails: GateDetail[] = [];
  gateStore.subscribeDetails(d => {
    gateDetails = d;
  });

  $: onlineGateCount = $gateStore.filter(g => g.isOnline).length;
  $: backupGateCount = gateDetails.filter(g => g.isBackup).length;
  $: totalQueue = $gateStore.reduce((sum, g) => sum + g.currentQueueLength, 0);
</script>

<div class="space-y-6">
  <div class="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 w-fit">
    <button
      on:click={() => currentView = 'verify'}
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all {currentView === 'verify' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}"
    >
      <QrCode class="w-4 h-4" />
      团队核验
    </button>
    <button
      on:click={() => currentView = 'diversion'}
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all {currentView === 'diversion' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}"
    >
      <Activity class="w-4 h-4" />
      闸口分流
    </button>
  </div>

  {#if currentView === 'verify'}
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
              onHandleSubstitute={handleOpenSubstitute}
            />

            {#if selectedTeam.substitutes.length > 0}
              <SubstituteCompare team={selectedTeam} />
            {/if}
            
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

    {#if showSubstituteModal && selectedTeam}
      <SubstituteModal 
        team={selectedTeam}
        onClose={() => showSubstituteModal = false}
        onSubmit={handleSubstituteSubmit}
      />
    {/if}
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity class="w-5 h-5 text-primary-600" />
            闸口分流视图
          </h2>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-success" />
              在线 {onlineGateCount}
            </span>
            <span class="flex items-center gap-1">
              <Users class="w-4 h-4" />
              总排队 {totalQueue}
            </span>
            <span class="flex items-center gap-1">
              <ChevronRight class="w-4 h-4" />
              备用 {backupGateCount}
            </span>
          </div>
        </div>

        <GateDiversionView 
          gates={gateDetails}
          onOpenBackup={handleOpenBackup}
          onCloseAsBackup={handleCloseAsBackup}
        />
      </div>

      <div class="space-y-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock class="w-5 h-5 text-primary-600" />
            分流提示
          </h3>
          <div class="space-y-3">
            {#each gateDetails as gate}
              {#if gate.isOnline && gate.currentQueueLength >= 10}
                <div class="p-3 bg-danger/10 border border-danger/30 rounded-lg">
                  <p class="text-sm font-medium text-danger">{gate.name} 拥堵</p>
                  <p class="text-xs text-danger/70 mt-0.5">
                    当前排队 {gate.currentQueueLength} 人，建议引导至备用通道
                  </p>
                </div>
              {/if}
            {/each}
            {#if gateDetails.filter(g => g.isBackup && !g.isOnline).length > 0 && totalQueue > 20}
              <div class="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <p class="text-sm font-medium text-warning">建议启用备用通道</p>
                <p class="text-xs text-warning/70 mt-0.5">
                  当前总排队人数较多，可启用备用闸口缓解压力
                </p>
              </div>
            {/if}
            {#if totalQueue <= 5 && gateDetails.filter(g => g.isBackup && g.isOnline).length > 0}
              <div class="p-3 bg-success/10 border border-success/30 rounded-lg">
                <p class="text-sm font-medium text-success">通行顺畅</p>
                <p class="text-xs text-success/70 mt-0.5">
                  当前排队人数较少，可考虑关闭备用通道
                </p>
              </div>
            {/if}
            {#if !gateDetails.some(g => g.isOnline && g.currentQueueLength >= 10) && totalQueue <= 20}
              <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p class="text-sm font-medium text-gray-600">通行正常</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  各闸口通行有序，暂无拥堵风险
                </p>
              </div>
            {/if}
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users class="w-5 h-5 text-primary-600" />
            今日统计
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-2xl font-bold font-mono text-gray-900">
                {$gateStore.reduce((sum, g) => sum + g.todayPassengerCount, 0)}
              </p>
              <p class="text-xs text-gray-500">总通行人次</p>
            </div>
            <div class="text-center p-3 bg-primary-50 rounded-lg">
              <p class="text-2xl font-bold font-mono text-primary-600">{onlineGateCount}</p>
              <p class="text-xs text-gray-500">运行闸口</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
