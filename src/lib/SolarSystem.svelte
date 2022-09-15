<script lang="ts">
  import { onMount } from 'svelte';
  import { Planet, allPlanets, Ability, isPlanet } from '../models/planet.model';
  import { Moon } from '../models/moon.model';
  import { player, otherPlayers } from '$lib/stores';
  import { Player } from '../models/player.model';

  let sun: HTMLElement;
  let planets: Planet[] = $player.planets;
  export let elementToPlace: Planet|Moon;
  $: console.log('player', $player);
  $: console.log('other players', $otherPlayers);
  $: console.log('planets', planets);
  $: console.log('element', elementToPlace);
  $: console.log('hovered orbit', hoveredOrbit);

  let playing = false;

  onMount(() => {
    console.log('before', allPlanets[0].x);
    Ability[allPlanets[0].ability](allPlanets[0]);
    console.log('after', allPlanets[0].x);
  });

  // TODO let players test their solar system x seconds into the future?

  const insertElementIntoArray = (array: any[], element: any, index: number): any[] => ([
    ...array.slice(0, index), element, ...array.slice(index)
  ]);

  const clickOrbit = (planet: Planet) => {
    if (elementToPlace) {
      // TODO write method to only update planets of store
      // TODO update player in db
      player.update(player => ({...player, planets} as Player));
      elementToPlace = undefined;
    }
  };

  $: hoveredOrbit = elementToPlace && isPlanet(elementToPlace) ? elementToPlace.orbit || $player.planets.length : -1;
  $: planets = elementToPlace && isPlanet(elementToPlace) ? insertElementIntoArray($player.planets, elementToPlace, hoveredOrbit) : $player.planets;

  $: orbitSizes = planets.map((planet, index) => {
    const previousPlanetSizes = planets.slice(0, index).map(p => p.size).reduce((a, b) => a + b, 0);
    return 160 + 20 * index + 2 * previousPlanetSizes + planet.size;
  });
</script>

<div class="background">
    <button on:click={() => {playing = !playing}}>
        {playing ? 'Playing...' : 'Start'} {elementToPlace?.name || ''}
    </button>
    <div class="stars">
        <div class="star"></div>
    </div>

    <div class="planets">
        <div class="sun" bind:this={sun}></div>

        {#if planets}
            {#each planets as planet, index}
                <div class="orbit" class:paused={!playing}
                     style="--planet-size: {planet.size}px; --orbit-size: {orbitSizes[index]}"
                     on:mouseenter={() => {planet.orbit = index; hoveredOrbit = index;}}
                     on:click={() => clickOrbit(planet)}>
                    <div class="planet {planet.name.toLowerCase()}"
                         class:highlight={elementToPlace && index === hoveredOrbit}
                         class:paused={!playing}>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
  @use "sass:math";

  @function strip-unit($number) {
    @return math.div($number, ($number * 0 + 1));
  }

  $stars: 100;
  $sun-size: 120px;
  $half-sun-size: math.div($sun-size, 2);

  .background {
    position: relative;
    background: #222;
    overflow: hidden;
    height: 80%;

    button {
      font-size: 64px;
      color: white;
      position: fixed;
    }

    button {
      background-color: #222222;
    }

    .planets {
      width: 100%;
      height: 100%;
      position: absolute;
      transform: rotateX(65deg);
      transform-style: preserve-3d;

      .sun {
        background: linear-gradient(90deg, #BB513E, darken(#BB513E, 9%));
        box-shadow: inset 15px 10px 0px darken(#BB513E, 9%);
        border-radius: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        width: $sun-size;
        height: $sun-size;
        margin-top: - #{$half-sun-size};
        margin-left: - #{$half-sun-size};
        z-index: 50;
        transform: rotateX(-65deg);
      }

      .orbit {
        position: absolute;
        border: 1px solid #333;
        box-sizing: border-box;
        box-shadow: 0px 1px 1px #4096EE;
        border-radius: 100%;

        --half-orbit-size: calc(1px * var(--orbit-size) / 2);
        --rotation-speed: calc(0.067s * var(--orbit-size));
        width: calc(1px * var(--orbit-size));
        height: calc(1px * var(--orbit-size));
        top: 50%;
        left: 50%;
        margin-top: calc(0px - var(--half-orbit-size));
        margin-left: calc(0px - var(--half-orbit-size));
        animation: gravity var(--rotation-speed) linear infinite;
        transform-style: preserve-3d;

        &.paused {
          animation-play-state: paused !important;
        }

        &:hover {
          border: 1px solid green;
        }

        .planet {
          --half-planet-size: calc(var(--planet-size) / 2);
          position: absolute;
          width: var(--planet-size);
          height: var(--planet-size);
          border-radius: 100%;
          left: 0;
          top: 50%;
          margin-left: calc(0px - var(--half-planet-size));
          margin-top: calc(0px - var(--half-planet-size));
          animation: face-camera var(--rotation-speed) linear infinite;
          transform-style: preserve-3d;

          &.paused {
            animation-play-state: paused !important;
          }

          &.highlight {
            box-shadow: 0 0 20px #fff, /* outer white */
            -5px 0 30px #f0f, /* outer left magenta */
            5px 0 30px #0ff; /* outer right cyan */
          }
        }
      }

      @for $i from 1 through 11 {
        .paused:nth-of-type(#{$i}) {
          // TODO remove during fight as its only necessary for editing your solar system
          transform: translateZ(10 - $i + px);
        }
      }
    }
  }

  // Animate Stars
  @keyframes flash {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  // Gravitational Pull
  @keyframes gravity {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes face-camera {
    0% {
      transform: rotateX(-65deg) rotateY(0deg) rotateZ(0deg);
    }
    50% {
      transform: rotateX(-130deg) rotateY(180deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(-65deg) rotateY(360deg) rotateZ(0deg);
    }
  }
</style>
