<script lang="ts">
  import { allPlanets, Planet } from '../models/planet.model';
  import { Moon, MoonEffectDescription } from '../models/moon.model';
  import { createEventDispatcher } from 'svelte';
  import { OrbitAbilityDescription, RotationAbilityDescription } from '../models/planet.model.js';

  const dispatch = createEventDispatcher();

  let options: (Planet|Moon)[] = [
    allPlanets[0], allPlanets[1], allPlanets[2]
  ];

  let selectedOption: Planet|Moon;
  $: dispatch('select', selectedOption || undefined);
</script>

<div class="backdrop">
    {#each options as option}
        <div class="option" on:click={() => selectedOption = option} class:selected={option === selectedOption}>
            <div class="symbol"></div>
            <h2>{option.name}</h2>
            {#if option.rotationAbility}
                <div>{RotationAbilityDescription[option.rotationAbility]}</div>
            {/if}
            {#if option.orbitAbility}
                <div>{OrbitAbilityDescription[option.orbitAbility]}</div>
            {/if}
            {#if option.effect}
                <div>{MoonEffectDescription[option.effect]}</div>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
  .backdrop {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 20%;
    z-index: 100;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .option {
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      color: white;
      padding: 8px;
    }
  }
</style>
