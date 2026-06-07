<script lang="ts">
  import { Calendar, Users, Clock, AlertTriangle } from 'lucide-svelte';
  import type { TimeSlot } from '../types';
  import { formatDate, getWeekDay } from '../utils/format';

  export let date: Date;
  export let slots: TimeSlot[];
  
  const totalCapacity = slots.reduce((sum, s) => sum + s.totalCapacity, 0);
  const totalBooked = slots.reduce((sum, s) => sum + s.bookedCount, 0);
  const totalRemaining = slots.reduce((sum, s) => sum + s.remainingCount, 0);
  const usageRate = Math.round((totalBooked / totalCapacity) * 100);
  
  const getUsageColor = (rate: number) => {
    if (rate >= 95) return 'bg-danger';
    if (rate >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getSlotColor = (slot: TimeSlot) => {
    const rate = (slot.bookedCount / slot.totalCapacity) * 100;
    if (slot.remainingCount < 0) return 'border-danger bg-danger/5';
    if (rate >= 90) return 'border-warning bg-warning/5';
    return 'border-gray-200 bg-white';
  };
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div class="p-5 border-b border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
          <Calendar class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{formatDate(date)}</h3>
          <p class="text-sm text-gray-500">{getWeekDay(date)}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold font-mono text-gray-900">{totalRemaining}</p>
        <p class="text-xs text-gray-500">剩余名额</p>
      </div>
    </div>
    
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">整体使用率</span>
        <span class="font-medium font-mono {usageRate >= 95 ? 'text-danger' : usageRate >= 80 ? 'text-warning' : 'text-success'}">
          {usageRate}%
        </span>
      </div>
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500 {getUsageColor(usageRate)}"
          style="width: {Math.min(usageRate, 100)}%"
        />
      </div>
    </div>
  </div>

  <div class="p-4 grid grid-cols-3 md:grid-cols-6 gap-2">
    {#each slots as slot}
      <div class="p-3 rounded-lg border transition-all duration-200 hover:shadow-md {getSlotColor(slot)}">
        <div class="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Clock class="w-3 h-3" />
          <span class="font-mono">{slot.startTime}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-lg font-bold font-mono {slot.remainingCount <= 0 ? 'text-danger' : slot.remainingCount <= 10 ? 'text-warning' : 'text-success'}">
            {slot.remainingCount}
          </span>
          <span class="text-xs text-gray-400">/ {slot.totalCapacity}</span>
        </div>
        {#if slot.remainingCount < 0}
          <div class="mt-1 flex items-center gap-1 text-xs text-danger">
            <AlertTriangle class="w-3 h-3" />
            <span>超员 {Math.abs(slot.remainingCount)}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
