<script lang="ts">
  import { Activity, Users, Clock, Zap, AlertTriangle, Building2, ChevronDown, ChevronUp, Power, PowerOff } from 'lucide-svelte';
  import type { GateDetail } from '../types';
  import { maskIdCard } from '../utils/format';

  export let gates: GateDetail[];
  export let onOpenBackup: ((gateId: string) => void) | undefined = undefined;
  export let onCloseAsBackup: ((gateId: string) => void) | undefined = undefined;

  let expandedGateId = '';

  const toggleExpand = (gateId: string) => {
    expandedGateId = expandedGateId === gateId ? '' : gateId;
  };

  const getQueueLevel = (length: number) => {
    if (length >= 10) return { text: '拥堵', color: 'text-danger', bg: 'bg-danger/10' };
    if (length >= 5) return { text: '适中', color: 'text-warning', bg: 'bg-warning/10' };
    return { text: '顺畅', color: 'text-success', bg: 'bg-success/10' };
  };

  const getSpeedLevel = (speed: number) => {
    if (speed >= 200) return { text: '快', color: 'text-success' };
    if (speed >= 100) return { text: '中', color: 'text-warning' };
    return { text: '慢', color: 'text-danger' };
  };
</script>

<div class="space-y-4">
  {#each gates as gate}
    <div 
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all {gate.isBackup && !gate.isOnline ? 'opacity-75' : ''}"
      class:ring-2="{gate.currentQueueLength >= 10 && gate.isOnline}"
      class:ring-danger="{gate.currentQueueLength >= 10 && gate.isOnline}"
    >
      <button
        on:click={() => toggleExpand(gate.id)}
        class="w-full p-4 text-left"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl {gate.isOnline ? 'bg-primary-100' : 'bg-gray-100'} flex items-center justify-center">
              <Activity class="w-6 h-6 {gate.isOnline ? 'text-primary-600' : 'text-gray-400'}" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900">{gate.name}</h3>
                {#if gate.isBackup}
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    备用通道
                  </span>
                {/if}
                {#if gate.isOnline}
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                    <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    运行中
                  </span>
                {:else}
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                    <span class="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    已关闭
                  </span>
                {/if}
              </div>
              {#if gate.currentTeam}
                <p class="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Building2 class="w-3.5 h-3.5" />
                  当前团队：{gate.currentTeam.agency.name}
                </p>
              {:else if gate.isOnline}
                <p class="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock class="w-3.5 h-3.5" />
                  空闲中
                </p>
              {/if}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-xs text-gray-500 mb-1">排队 / 速度</p>
              <p class="font-mono text-sm text-gray-900">
                <span class={getQueueLevel(gate.currentQueueLength).color}>{gate.currentQueueLength}人</span>
                <span class="text-gray-300 mx-1">/</span>
                <span class={getSpeedLevel(gate.avgPassSpeed).color}>{gate.avgPassSpeed}人/时</span>
              </p>
            </div>
            <button class="p-1 hover:bg-gray-100 rounded-md transition-colors">
              {#if expandedGateId === gate.id}
                <ChevronUp class="w-5 h-5 text-gray-400" />
              {:else}
                <ChevronDown class="w-5 h-5 text-gray-400" />
              {/if}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2 mt-4">
          <div class="text-center p-2 bg-gray-50 rounded-lg">
            <p class="text-lg font-bold font-mono text-gray-900">{gate.todayPassengerCount}</p>
            <p class="text-xs text-gray-500">今日通行</p>
          </div>
          <div class="text-center p-2 {getQueueLevel(gate.currentQueueLength).bg} rounded-lg">
            <p class="text-lg font-bold font-mono {getQueueLevel(gate.currentQueueLength).color}">{gate.currentQueueLength}</p>
            <p class="text-xs text-gray-500">排队人数</p>
          </div>
          <div class="text-center p-2 bg-primary-50 rounded-lg">
            <p class="text-lg font-bold font-mono text-primary-600">{gate.avgPassSpeed}</p>
            <p class="text-xs text-gray-500">平均速度</p>
          </div>
          <div class="text-center p-2 {gate.abnormalVisitors.length > 0 ? 'bg-warning/10' : 'bg-gray-50'} rounded-lg">
            <p class="text-lg font-bold font-mono {gate.abnormalVisitors.length > 0 ? 'text-warning' : 'text-gray-900'}">{gate.abnormalVisitors.length}</p>
            <p class="text-xs text-gray-500">异常人数</p>
          </div>
        </div>
      </button>

      {#if expandedGateId === gate.id}
        <div class="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
          {#if gate.pendingTeams && gate.pendingTeams.length > 0}
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users class="w-4 h-4 text-gray-400" />
                待核验团队 ({gate.pendingTeams.length}个)
              </h4>
              <div class="space-y-2">
                {#each gate.pendingTeams as team}
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div>
                      <p class="font-medium text-sm text-gray-900">{team.agency.name}</p>
                      <p class="text-xs text-gray-500">{team.orderNo} · {team.totalVisitors}人</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-mono text-warning">{team.totalVisitors - team.verifiedCount}人待核验</p>
                      <p class="text-xs text-gray-400">{team.timeSlot.startTime} - {team.timeSlot.endTime}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          {#if gate.abnormalVisitors.length > 0}
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlertTriangle class="w-4 h-4 text-warning" />
                异常名单
              </h4>
              <div class="space-y-2">
                {#each gate.abnormalVisitors as visitor}
                  <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertTriangle class="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p class="font-medium text-sm text-gray-900">{visitor.name}</p>
                        <p class="text-xs text-gray-500 font-mono">{maskIdCard(visitor.idCard) || '无证件号'}</p>
                      </div>
                    </div>
                    <span class="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                      {visitor.missingDocType === 'id_card' ? '缺身份证' : visitor.missingDocType === 'child_statement' ? '缺儿童证明' : visitor.missingDocType === 'passport' ? '缺护照' : '异常'}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          {#if gate.recentPassTime && gate.recentPassTime.length > 0}
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Zap class="w-4 h-4 text-gray-400" />
                最近通行记录
              </h4>
              <div class="flex flex-wrap gap-2">
                {#each gate.recentPassTime.slice(0, 10) as time}
                  <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 font-mono">
                    {new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                {/each}
              </div>
            </div>
          {/if}

          {#if gate.isBackup && !gate.isOnline && onOpenBackup}
            <button
              on:click={() => onOpenBackup(gate.id)}
              class="w-full py-2.5 px-4 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-colors flex items-center justify-center gap-2"
            >
              <Power class="w-4 h-4" />
              启用备用通道
            </button>
          {/if}

          {#if !gate.isBackup && gate.isOnline && onCloseAsBackup}
            <button
              on:click={() => onCloseAsBackup(gate.id)}
              class="w-full py-2.5 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <PowerOff class="w-4 h-4" />
              转为备用通道
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>
