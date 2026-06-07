<script lang="ts">
  import { Activity, Users, Clock, Wifi, WifiOff } from 'lucide-svelte';
  import type { GateStatus } from '../types';

  export let gate: GateStatus;
  export let onToggle: (() => void) | undefined = undefined;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-center gap-2">
      <div class="w-9 h-9 rounded-lg {gate.isOnline ? 'bg-success/10' : 'bg-gray-100'} flex items-center justify-center">
        <Activity class="w-5 h-5 {gate.isOnline ? 'text-success' : 'text-gray-400'}" />
      </div>
      <div>
        <h4 class="font-semibold text-gray-900">{gate.name}</h4>
        <div class="flex items-center gap-1 text-xs">
          {#if gate.isOnline}
            <Wifi class="w-3 h-3 text-success" />
            <span class="text-success">在线</span>
          {:else}
            <WifiOff class="w-3 h-3 text-gray-400" />
            <span class="text-gray-400">离线</span>
          {/if}
        </div>
      </div>
    </div>
    {#if onToggle}
      <button
        on:click={onToggle}
        class="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div class="w-10 h-5 rounded-full {gate.isOnline ? 'bg-success' : 'bg-gray-300'} relative transition-colors">
          <div class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all {gate.isOnline ? 'left-5' : 'left-0.5'}" />
        </div>
      </button>
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-3">
    <div class="p-2 bg-gray-50 rounded-lg">
      <div class="flex items-center gap-1 text-xs text-gray-500 mb-1">
        <Users class="w-3 h-3" />
        <span>今日通行</span>
      </div>
      <p class="text-xl font-bold font-mono text-gray-900">{gate.todayPassengerCount}</p>
    </div>
    <div class="p-2 bg-gray-50 rounded-lg">
      <div class="flex items-center gap-1 text-xs text-gray-500 mb-1">
        <Clock class="w-3 h-3" />
        <span>排队人数</span>
      </div>
      <p class="text-xl font-bold font-mono {gate.currentQueueLength > 10 ? 'text-danger' : gate.currentQueueLength > 5 ? 'text-warning' : 'text-success'}">
        {gate.currentQueueLength}
      </p>
    </div>
  </div>
</div>
