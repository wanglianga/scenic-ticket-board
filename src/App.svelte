<script lang="ts">
  import type { UserRole } from './types';
  import Header from './components/Header.svelte';
  import TicketBoard from './pages/TicketBoard.svelte';
  import GateBoard from './pages/GateBoard.svelte';
  import { teamStore } from './stores/teamStore';
  import { getNextDays } from './utils/format';

  let currentRole: UserRole = 'ticket';

  const handleRoleChange = (role: UserRole) => {
    currentRole = role;
  };

  const nextDays = getNextDays(1);
  
  let slots: any[] = [];
  teamStore.subscribeSlots(s => {
    slots = s;
  });
</script>

<div class="min-h-screen bg-gray-50">
  <Header currentRole={currentRole} onRoleChange={handleRoleChange} />
  
  <main class="max-w-7xl mx-auto px-4 py-6">
    {#if currentRole === 'ticket'}
      <TicketBoard />
    {:else}
      <GateBoard />
    {/if}
  </main>
</div>
