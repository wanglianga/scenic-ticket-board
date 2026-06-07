<script lang="ts">
  import { Building2, UserCheck, Users, Clock, ChevronDown, ChevronUp, FileWarning, UserX } from 'lucide-svelte';
  import type { TeamOrder } from '../types';
  import AlertBadge from './AlertBadge.svelte';
  import OverCapacityAlert from './OverCapacityAlert.svelte';
  import MissingDocsAlert from './MissingDocsAlert.svelte';

  export let team: TeamOrder;
  export let expanded = false;
  export let onExpand: (() => void) | undefined = undefined;
  export let onSelect: (() => void) | undefined = undefined;

  const statusConfig = {
    pending: { text: '待核验', bg: 'bg-warning/10', textColor: 'text-warning', border: 'border-warning/30' },
    verified: { text: '已核验', bg: 'bg-success/10', textColor: 'text-success', border: 'border-success/30' },
    partial: { text: '部分核验', bg: 'bg-primary-500/10', textColor: 'text-primary-500', border: 'border-primary-500/30' },
    cancelled: { text: '已取消', bg: 'bg-gray-100', textColor: 'text-gray-500', border: 'border-gray-200' },
    pending_docs: { text: '待补证件', bg: 'bg-amber-100', textColor: 'text-amber-700', border: 'border-amber-300' },
  };

  const status = statusConfig[team.status];
</script>

<div 
  class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
  class:ring-2="{team.isOverCapacity || team.missingIdCardCount > 0 || !team.guide.isConfirmed}"
  class:ring-danger="{team.isOverCapacity}"
  class:ring-warning="{!team.isOverCapacity && (team.missingIdCardCount > 0 || !team.guide.isConfirmed)}"
  on:click={onExpand}
>
  <div class="p-4">
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-mono text-sm text-gray-500">{team.orderNo}</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border {status.bg} {status.textColor} {status.border}">
            {status.text}
          </span>
        </div>
        <h3 class="font-semibold text-gray-900 truncate flex items-center gap-2">
          <Building2 class="w-4 h-4 text-gray-400 flex-shrink-0" />
          {team.agency.name}
        </h3>
      </div>
      <button on:click|stopPropagation={onExpand} class="p-1 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0">
        {#if expanded}
          <ChevronUp class="w-5 h-5 text-gray-400" />
        {:else}
          <ChevronDown class="w-5 h-5 text-gray-400" />
        {/if}
      </button>
    </div>

    <div class="grid grid-cols-3 gap-2 mb-3">
      <div class="text-center p-2 bg-gray-50 rounded-lg">
        <p class="text-lg font-bold font-mono text-gray-900">{team.totalVisitors}</p>
        <p class="text-xs text-gray-500">总人数</p>
      </div>
      <div class="text-center p-2 bg-success/5 rounded-lg">
        <p class="text-lg font-bold font-mono text-success">{team.verifiedCount}</p>
        <p class="text-xs text-gray-500">已核验</p>
      </div>
      <div class="text-center p-2 bg-warning/5 rounded-lg">
        <p class="text-lg font-bold font-mono text-warning">{team.totalVisitors - team.verifiedCount - team.absentCount}</p>
        <p class="text-xs text-gray-500">待核验</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
      <span class="flex items-center gap-1">
        <Clock class="w-3.5 h-3.5" />
        {team.timeSlot.startTime} - {team.timeSlot.endTime}
      </span>
      <span class="flex items-center gap-1">
        <UserCheck class="w-3.5 h-3.5" />
        {team.guide.name}
      </span>
    </div>

    {#if team.isOverCapacity || team.missingIdCardCount > 0 || !team.guide.isConfirmed}
      <div class="mt-3 flex flex-wrap gap-2">
        {#if team.isOverCapacity}
          <AlertBadge type="over" text="超员预警" />
        {/if}
        {#if team.missingIdCardCount > 0}
          <AlertBadge type="missing" text="缺证件 {team.missingIdCardCount}人" />
        {/if}
        {#if !team.guide.isConfirmed}
          <AlertBadge type="unconfirmed" text="导游未确认" />
        {/if}
      </div>
    {/if}
  </div>

  {#if expanded}
    <div class="border-t border-gray-100 p-4 bg-gray-50">
      <div class="space-y-4">
        {#if team.isOverCapacity}
          <OverCapacityAlert {team} />
        {/if}

        {#if team.missingIdCardCount > 0}
          <MissingDocsAlert {team} />
        {/if}

        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 flex items-center gap-2">
            <Users class="w-4 h-4" />
            游客名单
          </span>
          {#if team.absentCount > 0}
            <span class="text-xs text-danger flex items-center gap-1">
              <UserX class="w-3.5 h-3.5" />
              未到 {team.absentCount}人
            </span>
          {/if}
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {#each team.visitors.slice(0, 16) as visitor}
            <div 
              class="aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all {visitor.isVerified ? 'bg-emerald-50 text-emerald-600' : visitor.isAbsent ? 'bg-rose-50 text-rose-600' : 'bg-gray-200 text-gray-500'} {!visitor.hasIdCard ? 'border-2 border-amber-500' : ''}"
              title="{visitor.name}{!visitor.hasIdCard && visitor.missingDocType ? ' (缺' + (visitor.missingDocType === 'id_card' ? '身份证' : visitor.missingDocType === 'child_statement' ? '儿童身份说明' : '护照') + ')' : ''}"
            >
              {visitor.name.slice(-2)}
            </div>
          {/each}
          {#if team.visitors.length > 16}
            <div class="aspect-square rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
              +{team.visitors.length - 16}
            </div>
          {/if}
        </div>
        {#if onSelect}
          <button 
            on:click|stopPropagation={onSelect}
            class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!team.canVerify}
          >
            {#if !team.canVerify}
              暂不可核验（请先补齐证件）
            {:else}
              查看详情 / 核验
            {/if}
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
