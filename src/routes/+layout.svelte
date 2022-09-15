<script>
  import '../app.scss';
  import {user, player} from "$lib/stores"
  import {supabase} from "$lib/supabaseClient"
  import Auth from "$lib/Auth.svelte"
  import {allPlanets} from "../models/planet.model";

  user.set(supabase.auth.user());
  $player = {email: supabase.auth.user.email, planets: [allPlanets[3]]};

  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session.user);
    if ($player) {
      $player.email = supabase.auth.user.email;
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
