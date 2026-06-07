<script lang="ts">
  import { Check, X, User, FileText, AlertTriangle } from 'lucide-svelte';
  import type { Visitor } from '../types';
  import { maskIdCard } from '../utils/format';

  export let visitors: Visitor[];
  export let canOperate = false;
  export let onVerify: ((visitorId: string) => void) | undefined = undefined;
  export let onMarkAbsent: ((visitorId: string) => void) | undefined = undefined;
</script>

<div class="overflow-x-auto">
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="text-left py-3 px-4 font-medium text-gray-500">游客</th>
        <th class="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">证件号</th>
        <th class="text-center py-3 px-4 font-medium text-gray-500">证件</th>
        <th class="text-center py-3 px-4 font-medium text-gray-500">状态</th>
        {#if canOperate}
          <th class="text-center py-3 px-4 font-medium text-gray-500">操作</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each visitors as visitor}
        <tr 
          class="border-b border-gray-100 transition-colors hover:bg-gray-50 {visitor.isVerified ? 'bg-emerald-50' : visitor.isAbsent ? 'bg-rose-50' : !visitor.hasIdCard ? 'bg-amber-50' : ''}"
        >
          <td class="py-3 px-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User class="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{visitor.name}</p>
                <p class="text-xs text-gray-500 sm:hidden">
                  {visitor.hasIdCard ? maskIdCard(visitor.idCard) : '未上传证件'}
                </p>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 font-mono text-gray-600 hidden sm:table-cell">
            {#if visitor.hasIdCard}
              {maskIdCard(visitor.idCard)}
            {:else}
              <span class="text-warning flex items-center gap-1">
                <AlertTriangle class="w-3.5 h-3.5" />
                未上传
              </span>
            {/if}
          </td>
          <td class="py-3 px-4 text-center">
            {#if visitor.hasIdCard}
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
                <FileText class="w-3.5 h-3.5 text-emerald-600" />
              </span>
            {:else}
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-warning/10">
                <AlertTriangle class="w-3.5 h-3.5 text-warning" />
              </span>
            {/if}
          </td>
          <td class="py-3 px-4 text-center">
            {#if visitor.isVerified}
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                <Check class="w-3 h-3" />
                已核验
              </span>
            {:else if visitor.isAbsent}
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-danger/10 text-danger">
                <X class="w-3 h-3" />
                未到
              </span>
            {:else}
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                待核验
              </span>
            {/if}
          </td>
          {#if canOperate && !visitor.isVerified}
            <td class="py-3 px-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  on:click={() => onVerify?.(visitor.id)}
                  class="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                  title="核验通过"
                >
                  <Check class="w-4 h-4" />
                </button>
                <button
                  on:click={() => onMarkAbsent?.(visitor.id)}
                  class="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                  title="标记未到"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </td>
          {:else if canOperate}
            <td class="py-3 px-4 text-center text-gray-400">
              —
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
