<script lang="ts">
  import SolarSystem from '$lib/SolarSystem.svelte';
  import NewOptions from "$lib/NewOptions.svelte";
  import { Planet } from '../models/planet.model';
  import { Moon } from '../models/moon.model';

  let elementToPlace: Planet|Moon;
</script>

<SolarSystem elementToPlace={elementToPlace}></SolarSystem>
<NewOptions on:select={option => elementToPlace = option.detail}></NewOptions>

<style lang="scss">
</style>
