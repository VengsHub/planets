<script lang="ts">
  import SolarSystem from '$lib/SolarSystem.svelte';
  import NewOptions from '$lib/NewOptions.svelte';
  import { allPlanets, Planet } from '../models/planet.model';
  import { Moon } from '../models/moon.model';
  import { supabase } from '$lib/supabaseClient';
  import { user, otherPlayers, player } from '$lib/stores';
  import { Player } from '../models/player.model';

  let elementToPlace: Planet|Moon;

  supabase.from('players').select("*").then(({data: players, error}) => {
    if (error) {
      throw error;
    }

    const myPlayer = players.find(player => player.email === $user.email);
    const others = players.filter(player => player.email !== $user.email);
    myPlayer.planets = allPlanets;
    player.update(player => ({...player, planets: myPlayer.planets} as Player));
    otherPlayers.set(others);
  });
</script>

<SolarSystem elementToPlace={elementToPlace}></SolarSystem>
<NewOptions on:select={option => elementToPlace = option.detail}></NewOptions>

<style lang="scss">
</style>
