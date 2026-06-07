<script lang="ts">
  import { RefreshCw, Undo2, Clock, User } from 'lucide-svelte';
  import type { RefundRecord } from '../types';
  import { formatDateTime } from '../utils/format';

  export let records: RefundRecord[];
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div class="p-4 border-b border-gray-100">
    <h3 class="font-semibold text-gray-900 flex items-center gap-2">
      <RefreshCw class="w-5 h-5 text-primary-600" />
      退改记录
    </h3>
    <p class="text-sm text-gray-500 mt-1">共 {records.length} 条记录</p>
  </div>

  <div class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
    {#each records as record}
      <div class="p-4 hover:bg-gray-50 transition-colors">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 {record.type === 'refund' ? 'bg-danger/10' : 'bg-primary-50'}">
              {#if record.type === 'refund'}
                <Undo2 class="w-4 h-4 text-danger" />
              {:else}
                <RefreshCw class="w-4 h-4 text-primary-600" />
              {/if}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900">
                  {record.type === 'refund' ? '退票' : '改签'}
                </span>
                <span class="text-xs font-mono text-gray-500">
                  {record.orderId}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{record.reason}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <User class="w-3.5 h-3.5" />
                  {record.operator}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" />
                  {formatDateTime(record.operateTime)}
                </span>
              </div>
            </div>
          </div>
          <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium {record.type === 'refund' ? 'bg-danger/10 text-danger' : 'bg-primary-50 text-primary-600'}">
            {record.type === 'refund' ? '已退款' : '已改签'}
          </span>
        </div>
      </div>
    {/each}

    {#if records.length === 0}
      <div class="text-center py-12">
        <RefreshCw class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">暂无退改记录</p>
      </div>
    {/if}
  </div>
</div>
