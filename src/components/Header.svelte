<script lang="ts">
  import { Ticket, ScanLine, User } from 'lucide-svelte';
  import type { UserRole } from '../types';

  export let currentRole: UserRole = 'ticket';
  export let onRoleChange: (role: UserRole) => void;
</script>

<header class="bg-gradient-to-r from-primary-950 to-primary-900 text-white shadow-lg">
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <Ticket class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight">景区票务团队预约看板</h1>
          <p class="text-xs text-white/60">Team Ticket Reservation Dashboard</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="bg-white/10 rounded-lg p-1 flex gap-1">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 {currentRole === 'ticket' ? 'bg-white text-primary-900' : 'text-white/80 hover:text-white hover:bg-white/10'}"
            on:click={() => onRoleChange('ticket')}
          >
            <Ticket class="w-4 h-4" />
            <span class="hidden sm:inline">票务视角</span>
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 {currentRole === 'gate' ? 'bg-white text-primary-900' : 'text-white/80 hover:text-white hover:bg-white/10'}"
            on:click={() => onRoleChange('gate')}
          >
            <ScanLine class="w-4 h-4" />
            <span class="hidden sm:inline">闸口视角</span>
          </button>
        </div>
        <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <User class="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
</header>
