<script lang="ts">
  import { FileWarning, Clock, User, Check, Calendar, AlertTriangle } from 'lucide-svelte';
  import type { TeamOrder, MissingDocInfo } from '../types';
  import { teamStore } from '../stores/teamStore';
  import { formatDateTime } from '../utils/format';

  export let team: TeamOrder;
  export let isTicketStaff = true;

  let showDeadlinePicker = false;
  let selectedDeadline = '';

  const missingDocTypeLabels: Record<string, string> = {
    id_card: '身份证',
    child_statement: '儿童身份说明',
    passport: '护照',
  };

  const missingDocTypeColors: Record<string, string> = {
    id_card: 'bg-amber-100 text-amber-700',
    child_statement: 'bg-blue-100 text-blue-700',
    passport: 'bg-purple-100 text-purple-700',
  };

  const handleSetDeadline = () => {
    if (!selectedDeadline) return;
    teamStore.setSupplementDeadline(team.id, selectedDeadline);
    showDeadlinePicker = false;
  };

  const handleMarkSupplied = (visitorId: string) => {
    teamStore.markDocSupplied(team.id, visitorId);
  };

  const getDefaultDeadline = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  const pendingMissingDocs = team.missingDocs?.filter(d => !d.isSupplied) || [];
</script>

<div class="bg-warning/5 border border-warning/20 rounded-xl overflow-hidden">
  <div class="p-4">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
        <FileWarning class="w-5 h-5 text-warning" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-warning">证件信息缺失</h4>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">
            {pendingMissingDocs.length} 人待补齐
          </span>
        </div>
        <p class="text-sm text-gray-600">
          有 <strong class="text-warning">{pendingMissingDocs.length}</strong> 名游客的证件信息尚未补充，团队暂不可核验
        </p>
        {#if team.supplementDeadline}
          <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Clock class="w-3.5 h-3.5" />
            补充期限：{formatDateTime(new Date(team.supplementDeadline))}
          </p>
        {/if}
      </div>
    </div>

    {#if pendingMissingDocs.length > 0}
      <div class="mt-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-700 flex items-center gap-1">
            <User class="w-4 h-4 text-gray-400" />
            待补齐名单
          </p>
          {#if isTicketStaff && !team.supplementDeadline}
            <button
              on:click={() => { showDeadlinePicker = true; selectedDeadline = getDefaultDeadline(); }}
              class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <Calendar class="w-3.5 h-3.5" />
              设置补充期限
            </button>
          {/if}
        </div>

        {#if showDeadlinePicker}
          <div class="mb-3 p-3 bg-white rounded-lg border border-gray-200">
            <p class="text-xs text-gray-500 mb-2">选择补充截止时间</p>
            <div class="flex gap-2">
              <input 
                type="datetime-local" 
                bind:value={selectedDeadline}
                class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <button
                on:click={handleSetDeadline}
                disabled={!selectedDeadline}
                class="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                确认
              </button>
              <button
                on:click={() => showDeadlinePicker = false}
                class="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        {/if}

        <div class="space-y-2 max-h-60 overflow-y-auto">
          {#each pendingMissingDocs as doc}
            <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User class="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{doc.visitorName}</p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {missingDocTypeColors[doc.missingType]}">
                    缺{missingDocTypeLabels[doc.missingType]}
                  </span>
                </div>
              </div>
              {#if isTicketStaff}
                <button
                  on:click={() => handleMarkSupplied(doc.visitorId)}
                  class="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                  title="标记已补充"
                >
                  <Check class="w-4 h-4" />
                </button>
              {:else}
                <AlertTriangle class="w-4 h-4 text-warning" />
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
