<!-- <script defer src="https://cloud.umami.is/script.js data-website-id="" ></script> -->

<script>
  import { page } from '$app/state';
  import { env } from '$env/dynamic/private';
  import { onMount } from 'svelte';

  let umaiLoaded = $state(false);
  
  onMount(() => {
    // Load Umai analytics script
    const script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-website-id', env.SECRET_UMAI_ID);
    
    script.onload = () => {
      umaiLoaded = true;
    };

    document.head.appendChild(script);
  });

  $effect(() => {
    if (typeof window !== 'undefined' && $page.url.pathname) {
      if (window?.umai) window.umai.trackPageview();
    }
  })

  // Track page views when route changes using runes syntax
  $effect(() => {
    if (typeof window !== 'undefined' && $page.url.pathname && umaiLoaded) {
      // In Umami, the window object property is 'umami', not 'umai'
      if (window?.umami) window.umami.trackPageview();
    }
  });
</script>

<slot />
