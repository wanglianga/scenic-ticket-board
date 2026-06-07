<script lang="ts">
  import { AlertTriangle, Users, Clock, CheckCircle, ChevronRight, Calendar } from 'lucide-svelte';
  import type { TeamOrder, TimeSlot, SplitBatch } from '../types';
  import { teamStore } from '../stores/teamStore';

  export let team: TeamOrder;
  
  let selectedSlotId: string | null = null;
  let showSplitPanel = false;

  const handleConfirmSplit = () => {
    if (!team.overCapacityInfo || !selectedSlotId) return;
    
    const selectedSlot = team.overCapacityInfo.availableSlots.find(s => s.id === selectedSlotId);
    if (!selectedSlot) return;

    const splitCount = team.overCapacityInfo.overCount;
    const firstBatchCount = team.totalVisitors - splitCount;

    const batches: SplitBatch[] = [
      {
        batchNo: 1,
        timeSlot: team.timeSlot,
        visitorCount: firstBatchCount,
        visitorIds: team.visitors.slice(0, firstBatchCount).map(v => v.id),
        isConfirmed: true,
      },
      {
        batchNo: 2,
        timeSlot: selectedSlot,
        visitorCount: splitCount,
        visitorIds: team.visitors.slice(firstBatchCount).map(v => v.id),
        isConfirmed: true,
      },
    ];

    teamStore.confirmSplit(team.id, batches);
    showSplitPanel = false;
  };

  const getBatchLabel = (batch: SplitBatch) => {
    return `第${batch.batchNo}批次 ${batch.timeSlot.startTime}-${batch.timeSlot.endTime}`;
  };
</script>

<div class="bg-danger/5 border border-danger/20 rounded-xl overflow-hidden">
  <div class="p-4">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0">
        <AlertTriangle class="w-5 h-5 text-danger" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-danger">团队超员预警</h4>
          {#if team.splitBatches && team.splitBatches.length > 0}
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
              <CheckCircle class="w-3 h-3" />
              已拆分
            </span>
          {/if}
        </div>
        <p class="text-sm text-gray-600">
          该团队共 <strong class="text-danger">{team.totalVisitors}</strong> 人，超出预约容量 
          <strong class="text-danger">{team.overCapacityInfo?.overCount || 0}</strong> 人
        </p>
      </div>
    </div>

    {#if team.splitBatches && team.splitBatches.length > 0}
      <div class="mt-4 space-y-2">
        <p class="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Calendar class="w-4 h-4 text-primary-600" />
          入园批次
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#each team.splitBatches as batch}
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-primary-600">第{batch.batchNo}批次</span>
                <span class="text-xs text-gray-500">{batch.visitorCount}人</span>
              </div>
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <Clock class="w-3.5 h-3.5 text-gray-400" />
                {batch.timeSlot.startTime} - {batch.timeSlot.endTime}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if team.overCapacityInfo && team.overCapacityInfo.availableSlots.length > 0}
      <div class="mt-4">
        {#if !showSplitPanel}
          <button
            on:click={() => showSplitPanel = true}
            class="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
          >
            <div class="flex items-center gap-2">
              <Users class="w-4 h-4 text-primary-600" />
              <span class="text-sm font-medium text-gray-700">选择调整时段，拆分入园</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
        {:else}
          <div class="space-y-3">
            <p class="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Clock class="w-4 h-4 text-gray-400" />
              可调整时段（超出 {team.overCapacityInfo.overCount} 人）
            </p>
            <div class="space-y-2">
              {#each team.overCapacityInfo.availableSlots as slot}
                <label 
                  class="flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer transition-all {selectedSlotId === slot.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <div class="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="slot" 
                      value={slot.id}
                      bind:group={selectedSlotId}
                      class="w-4 h-4 text-primary-600"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p class="text-xs text-gray-500">
                        剩余名额：<span class={slot.remainingCount <= 10 ? 'text-warning' : 'text-success'}>{slot.remainingCount}</span> / {slot.totalCapacity}
                      </p>
                    </div>
                  </div>
                </label>
              {/each}
            </div>
            <div class="flex gap-2">
              <button
                on:click={() => showSplitPanel = false}
                class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                on:click={handleConfirmSplit}
                disabled={!selectedSlotId}
                class="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认拆分
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
