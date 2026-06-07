<script lang="ts">
  import { CheckSquare, UserX, UserPlus, AlertTriangle } from 'lucide-svelte';
  import type { TeamOrder } from '../types';

  export let team: TeamOrder;
  export let onVerifyAll: (() => void) | undefined = undefined;
  export let onMarkAbsentBatch: (() => void) | undefined = undefined;
  export let onHandleSubstitute: (() => void) | undefined = undefined;
  export let onConfirmGuide: (() => void) | undefined = undefined;

  const pendingCount = team.totalVisitors - team.verifiedCount - team.absentCount;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
  <h3 class="font-semibold text-gray-900 mb-4">快速核验操作</h3>
  
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
    <div class="text-center p-3 bg-gray-50 rounded-lg">
      <p class="text-2xl font-bold font-mono text-gray-900">{team.totalVisitors}</p>
      <p class="text-xs text-gray-500">总人数</p>
    </div>
    <div class="text-center p-3 bg-success/5 rounded-lg">
      <p class="text-2xl font-bold font-mono text-success">{team.verifiedCount}</p>
      <p class="text-xs text-gray-500">已核验</p>
    </div>
    <div class="text-center p-3 bg-warning/5 rounded-lg">
      <p class="text-2xl font-bold font-mono text-warning">{pendingCount}</p>
      <p class="text-xs text-gray-500">待核验</p>
    </div>
    <div class="text-center p-3 bg-danger/5 rounded-lg">
      <p class="text-2xl font-bold font-mono text-danger">{team.absentCount}</p>
      <p class="text-xs text-gray-500">未到</p>
    </div>
  </div>

  {#if !team.guide.isConfirmed}
    <div class="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-primary-700">
          <AlertTriangle class="w-4 h-4" />
          <span class="text-sm font-medium">导游尚未确认签到</span>
        </div>
        <button
          on:click={onConfirmGuide}
          class="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
        >
          确认导游
        </button>
      </div>
    </div>
  {/if}

  {#if team.missingIdCardCount > 0}
    <div class="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
      <div class="flex items-center gap-2 text-warning-700">
        <AlertTriangle class="w-4 h-4" />
        <span class="text-sm">有 <strong>{team.missingIdCardCount}</strong> 名游客证件信息缺失，请核对</span>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <button
      on:click={onVerifyAll}
      disabled={pendingCount === 0}
      class="flex items-center justify-center gap-2 py-3 px-4 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      <CheckSquare class="w-5 h-5" />
      一键全部核验
    </button>
    <button
      on:click={onMarkAbsentBatch}
      disabled={pendingCount === 0}
      class="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      <UserX class="w-5 h-5" />
      批量标记未到
    </button>
    <button
      on:click={onHandleSubstitute}
      class="flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all active:scale-[0.98]"
    >
      <UserPlus class="w-5 h-5" />
      临时换人
    </button>
  </div>
</div>
