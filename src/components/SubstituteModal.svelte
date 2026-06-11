<script lang="ts">
  import { X, UserPlus, AlertTriangle, FileText } from 'lucide-svelte';
  import type { TeamOrder, Visitor } from '../types';
  import { maskIdCard } from '../utils/format';

  export let team: TeamOrder;
  export let onClose: () => void;
  export let onSubmit: (originalVisitorId: string, substituteVisitor: Visitor, reason: string) => void;

  let selectedOriginalVisitorId = '';
  let substituteName = '';
  let substituteIdCard = '';
  let substituteIdCardType: Visitor['idCardType'] = 'id_card';
  let reason = '';
  let operator = '闸口工作人员';

  const replaceableVisitors = team.visitors.filter(v => !v.isVerified && !v.isAbsent);

  let errorMsg = '';

  const handleSubmit = () => {
    errorMsg = '';
    if (!selectedOriginalVisitorId) {
      errorMsg = '请选择被替换的游客';
      return;
    }
    if (!substituteName.trim()) {
      errorMsg = '请输入替换游客姓名';
      return;
    }
    if (!substituteIdCard.trim()) {
      errorMsg = '请输入替换游客证件号';
      return;
    }
    if (!reason.trim()) {
      errorMsg = '请输入换人原因';
      return;
    }

    const substituteVisitor: Visitor = {
      id: '',
      name: substituteName.trim(),
      idCard: substituteIdCard.trim(),
      idCardType: substituteIdCardType,
      isVerified: false,
      isAbsent: false,
      hasIdCard: true,
      missingDocType: 'none',
    };

    onSubmit(selectedOriginalVisitorId, substituteVisitor, reason.trim());
  };

  const selectOriginal = (visitor: Visitor) => {
    selectedOriginalVisitorId = visitor.id;
  };
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
    <div class="flex items-center justify-between p-5 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
          <UserPlus class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">临时换人核验</h3>
          <p class="text-sm text-gray-500">{team.agency.name} · {team.orderNo}</p>
        </div>
      </div>
      <button on:click={onClose} class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <X class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-5 space-y-6">
      <div class="p-4 bg-primary-50 border border-primary-200 rounded-xl">
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div class="text-sm text-primary-700">
            <p class="font-medium mb-1">换人规则说明</p>
            <ul class="space-y-1 text-primary-600">
              <li>• 仅可替换未核验、未标记为未到的游客</li>
              <li>• 替换后原游客信息保留记录，不可再次使用该名额</li>
              <li>• 替换游客需携带有效证件原件</li>
              <li>• 换人操作需记录原因和操作人</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-bold">1</span>
          选择被替换游客
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-xl">
          {#each replaceableVisitors as visitor}
            <button
              on:click={() => selectOriginal(visitor)}
              class="p-3 rounded-lg border-2 text-left transition-all hover:border-primary-300 {selectedOriginalVisitorId === visitor.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}"
            >
              <p class="font-medium text-gray-900 text-sm truncate">{visitor.name}</p>
              <p class="text-xs text-gray-500 font-mono truncate">{maskIdCard(visitor.idCard)}</p>
            </button>
          {/each}
          {#if replaceableVisitors.length === 0}
            <div class="col-span-full text-center py-4 text-gray-400 text-sm">
              暂无可替换的游客
            </div>
          {/if}
        </div>
      </div>

      <div>
        <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-bold">2</span>
          录入替换游客信息
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="substitute-name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              id="substitute-name"
              type="text"
              bind:value={substituteName}
              placeholder="请输入姓名"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div>
            <label for="substitute-id-type" class="block text-sm font-medium text-gray-700 mb-1">证件类型</label>
            <select
              id="substitute-id-type"
              bind:value={substituteIdCardType}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="id_card">身份证</option>
              <option value="passport">护照</option>
              <option value="child_statement">儿童身份证明</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label for="substitute-id-card" class="block text-sm font-medium text-gray-700 mb-1">证件号码</label>
            <input
              id="substitute-id-card"
              type="text"
              bind:value={substituteIdCard}
              placeholder="请输入证件号码"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-bold">3</span>
          换人原因
        </h4>
        <textarea
          id="substitute-reason"
          bind:value={reason}
          placeholder="请输入换人原因，如：游客临时身体不适、游客迟到无法赶到等"
          rows={3}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
          aria-label="换人原因"
        />
      </div>

      <div>
        <label for="substitute-operator" class="block text-sm font-medium text-gray-700 mb-1">操作人</label>
        <input
          id="substitute-operator"
          type="text"
          bind:value={operator}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {#if errorMsg}
        <div class="p-3 bg-danger/10 border border-danger/30 rounded-lg">
          <div class="flex items-center gap-2 text-danger text-sm">
            <AlertTriangle class="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        </div>
      {/if}
    </div>

    <div class="p-5 border-t border-gray-100 flex justify-end gap-3">
      <button
        on:click={onClose}
        class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        取消
      </button>
      <button
        on:click={handleSubmit}
        class="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <FileText class="w-4 h-4" />
        确认换人
      </button>
    </div>
  </div>
</div>
