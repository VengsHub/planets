<script lang="ts">
  import SolarSystem from '$lib/SolarSystem.svelte';
  import NewOptions from "$lib/NewOptions.svelte";
  import { Planet } from '../models/planet.model';
  import { Moon } from '../models/moon.model';
  import {user} from "$lib/sessionStore"
  import { Player } from '../models/player.model';

  let player = new Player({email: 'no user'}, 100, 0, []);
  let elementToPlace: Planet|Moon;

  user.subscribe(u => {
    console.log('user', u);
    player.owner = {email: u.email};
  })
</script>

{#if player}
    <SolarSystem player={player} elementToPlace={elementToPlace}></SolarSystem>
    <NewOptions on:select={option => elementToPlace = option.detail}></NewOptions>
{/if}

<style lang="scss">
</style>
