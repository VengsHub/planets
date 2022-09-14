<script lang="ts">
  import { allPlanets, Planet } from '../models/planet.model';
  import { allMoons, Moon, MoonEffectDescription } from '../models/moon.model';
  import { createEventDispatcher } from 'svelte';
  import { AbilityDescription } from '../models/planet.model.js';

  const dispatch = createEventDispatcher();

  let options: (Planet|Moon)[] = [
    {...allPlanets[1]}, {...allPlanets[2]}, {...allMoons[0]}
  ];

  // planet pick -> push to myPlanets array
  // how to change orbits?
  // OR on click: stick planet to mouse (& remove from option tile) and then react to dragenters?
  // create empty most outer orbit for hover?
  // no grab necessary, just a trail to show that it's "attached"

  // moon pick -> choose planet for moon

  // confirm = start next fight

  let selectedOption: Planet|Moon;
  $: dispatch('select', selectedOption || undefined);
</script>

<div class="backdrop">
    {#each options as option}
        <div class="option"
             on:click={() => !selectedOption || selectedOption !== option ? selectedOption = option : selectedOption = undefined}
             class:selected={option === selectedOption}>
            <div class="symbol"></div>
            <h2>{option.name}</h2>
            {#if option.ability}
                <div>{AbilityDescription[option.rotationAbility]}</div>
            {/if}
            {#if option.effect}
                <div>{MoonEffectDescription[option.name]}</div>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
  // TODO add box shadows
  .backdrop {
    position: absolute;
    width: 100%;
    height: 20%;
    background: #222;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    padding: 16px;
    display: flex;
    grid-gap: 16px;
    justify-content: center;
    align-items: center;

    .option {
      height: 100%;
      width: 12%;
      background: linear-gradient(45deg, rgb(0, 0, 0, 0), rgb(0, 0, 0, 1));
      border: 1px solid rgb(255, 255, 255, 0.5);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;
      padding: 8px;
      box-sizing: border-box;

      &:hover {
        outline: 2px solid rgb(255, 255, 255, 0.5);
        cursor: pointer;
      }

      &.selected {
        outline: 2px solid rgb(255, 255, 255);
      }
    }
  }

/*  // code-snippet for linear-gradient borders
  background: linear-gradient(#222, #222), linear-gradient(90deg, black, white);
  background-origin: padding-box, border-box;
  background-repeat: no-repeat;
  border-top: 5px solid transparent;*/
</style>
