<script>
  import '../app.scss';
  import {user, player} from "$lib/stores"
  import {supabase} from "$lib/supabaseClient"
  import Auth from "$lib/Auth.svelte"

  user.set(supabase.auth.user());
  $: if ($user) $player = {user: {email: $user.email}, planets: []};

  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session.user);
    if ($player && $user) {
      $player.user.email = $user.email;
    }
  })
</script>

{#if $user}
    <slot></slot>
{:else}
    <Auth/>
{/if}

<style global>
</style>
