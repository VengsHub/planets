<script>
  import '../app.scss';
  import {user} from "$lib/sessionStore"
  import {supabase} from "$lib/supabaseClient"
  import Auth from "$lib/Auth.svelte"

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session.user);
  })
</script>

{#if $user}
    <slot></slot>
{:else}
    <Auth/>
{/if}

<style global>
</style>
