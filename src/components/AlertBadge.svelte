<script lang="ts">
  export let type: 'over' | 'missing' | 'unconfirmed' | 'success' | 'warning' = 'warning';
  export let text: string;

  const typeConfig = {
    over: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/30' },
    missing: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
    unconfirmed: { bg: 'bg-primary-500/10', text: 'text-primary-500', border: 'border-primary-500/30' },
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  };

  const config = typeConfig[type];
</script>

<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border {config.bg} {config.text} {config.border}">
  {text}
</span>
