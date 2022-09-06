<script>
  import '../app.scss';
  import {user, player} from "$lib/stores"
  import {supabase} from "$lib/supabaseClient"
  import Auth from "$lib/Auth.svelte"
  import {Player} from "../models/player.model";

  user.set(supabase.auth.user());
  player.set(new Player({email: supabase.auth.user.email}, 100, 0, []));

  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session.user);
    player.set(new Player({email: session.user.email}, 100, 0, []));
  })
</script>

{#if $user}
    <slot></slot>
{:else}
    <Auth/>
{/if}

<style global>
</style>
