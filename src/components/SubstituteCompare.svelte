<script lang="ts">
  import { Users, UserCheck, UserX, UserPlus, Clock, FileText, AlertCircle } from 'lucide-svelte';
  import type { TeamOrder, SubstituteRecord } from '../types';
  import { maskIdCard, formatDateTime } from '../utils/format';

  export let team: TeamOrder;

  $: originalCount = team.totalVisitors;
  $: verifiedCount = team.verifiedCount;
  $: substituteCount = team.substitutes.length;
  $: verifiedSubstitutes = team.substitutes.filter(s => s.isVerified).length;
  $: pendingCount = team.totalVisitors - team.verifiedCount - team.absentCount;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div class="p-4 border-b border-gray-100">
    <h3 class="font-semibold text-gray-900 flex items-center gap-2">
      <UserPlus class="w-5 h-5 text-primary-600" />
      换人核验对比
    </h3>
  </div>

  <div class="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-gray-100">
    <div class="text-center p-3 bg-gray-50 rounded-lg">
      <p class="text-2xl font-bold font-mono text-gray-900">{originalCount}</p>
      <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
        <Users class="w-3 h-3" />
        原名单总数
      </p>
    </div>
    <div class="text-center p-3 bg-success/5 rounded-lg">
      <p class="text-2xl font-bold font-mono text-success">{verifiedCount}</p>
      <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
        <UserCheck class="w-3 h-3" />
        已入园
      </p>
    </div>
    <div class="text-center p-3 bg-primary-50 rounded-lg">
      <p class="text-2xl font-bold font-mono text-primary-600">{substituteCount}</p>
      <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
        <UserPlus class="w-3 h-3" />
        替换人数
      </p>
    </div>
    <div class="text-center p-3 bg-warning/5 rounded-lg">
      <p class="text-2xl font-bold font-mono text-warning">{pendingCount}</p>
      <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
        <Clock class="w-3 h-3" />
        待核验
      </p>
    </div>
  </div>

  {#if team.substitutes.length > 0}
    <div class="p-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <FileText class="w-4 h-4 text-gray-400" />
        换人记录
      </h4>
      <div class="space-y-3 max-h-64 overflow-y-auto">
        {#each team.substitutes as sub}
          <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium {sub.isVerified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}">
                    {sub.isVerified ? '已核验入园' : '待核验'}
                  </span>
                  <span class="text-xs text-gray-400">{formatDateTime(new Date(sub.operateTime))}</span>
                </div>
                <p class="text-xs text-gray-500">操作人：{sub.operator}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-2 bg-rose-50 rounded-md">
                <p class="text-xs text-rose-500 mb-1 flex items-center gap-1">
                  <UserX class="w-3 h-3" />
                  原游客
                </p>
                <p class="text-sm font-medium text-gray-900 truncate">{sub.originalVisitorName}</p>
                <p class="text-xs text-gray-500 font-mono truncate">{maskIdCard(sub.originalVisitorIdCard) || '无证件号'}</p>
              </div>
              <div class="p-2 bg-emerald-50 rounded-md">
                <p class="text-xs text-emerald-600 mb-1 flex items-center gap-1">
                  <UserPlus class="w-3 h-3" />
                  替换游客
                </p>
                <p class="text-sm font-medium text-gray-900 truncate">{sub.substituteVisitor.name}</p>
                <p class="text-xs text-gray-500 font-mono truncate">{maskIdCard(sub.substituteVisitor.idCard) || '无证件号'}</p>
              </div>
            </div>

            <div class="mt-2 pt-2 border-t border-gray-200">
              <p class="text-xs text-gray-500">
                <span class="text-gray-400">原因：</span>
                {sub.reason}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="p-6 text-center">
      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
        <UserPlus class="w-6 h-6 text-gray-400" />
      </div>
      <p class="text-sm text-gray-500">暂无换人记录</p>
    </div>
  {/if}

  <div class="p-4 bg-amber-50 border-t border-amber-200">
    <div class="flex items-start gap-2">
      <AlertCircle class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <div class="text-xs text-amber-700">
        <p class="font-medium mb-0.5">入园防重复提示</p>
        <p>原名单 {originalCount} 人，已入园 {verifiedCount} 人，换人 {substituteCount} 次。系统已自动校验同一名额不可重复入园，替换游客入园后将占用原名额。</p>
      </div>
    </div>
  </div>
</div>
