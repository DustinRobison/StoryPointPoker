<script lang="ts">
  import { Avatar, Card } from "flowbite-svelte";

  const {avatar, title, subtitle, body} = $props();

</script>

<Card>
  <div class="flex flex-row items-center gap-2">
    <Avatar src={avatar} />
    <div class="flex flex-col">
      
      <h3 class="text-sm font-semibold dark:text-white">{title}</h3>
      <p class="text-xs font-medium text-gray-500 dark:text-white/40">{subtitle}</p>
    </div>
  </div>
  <blockquote class="mt-2 text-sm">{body}</blockquote>
</Card>