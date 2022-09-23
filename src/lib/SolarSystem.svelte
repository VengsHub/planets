<script lang="ts">
  import { onMount } from 'svelte';
  import { Planet, allPlanets, Ability, isPlanet } from '../models/planet.model';
  import { Moon } from '../models/moon.model';
  import { player, otherPlayers } from '$lib/stores';
  import { supabase } from './supabaseClient';

  let sun: HTMLElement;
  export let elementToPlace: Planet|Moon;
  let hoveredOrbit = -1;
  $: console.log('player', $player);
  $: console.log('other players', $otherPlayers);
  $: console.log('element', elementToPlace);
  $: console.log('hovered orbit', hoveredOrbit);

  let playing = true;

  onMount(() => {
    Ability[allPlanets[0].ability](allPlanets[0]);
    setInterval(updateDatabase, 60 * 1000);
  });

  const insertElementIntoArray = (array: any[], element: any, index: number): any[] => ([
    ...array.slice(0, index), element, ...array.slice(index)
  ]);

  const clickOrbit = (planet: {planet: Planet, html?: HTMLElement}) => {
    if (elementToPlace && isPlanet(elementToPlace)) {
      $player.planets[hoveredOrbit] = {planet: elementToPlace};
      elementToPlace = undefined;
      hoveredOrbit = -1;
    }
  };

  const triggerPlanetAbility = (planet: {planet: Planet, html?: HTMLElement}) => {
    $player.points += Ability[planet.planet.ability](planet, $player);
  };
  const increasePoints = () => $player.points++;

  const updateDatabase = async () => {
    if ($player.user.email) {
      const {data, error} = await supabase.from('players')
      .update({planets: $player.planets.map(planet => planet.planet), points: $player.points})
      .eq('email', $player.user.email);

      if (error) {
        throw error;
      }

      console.log('updated data', data);
    }
  };

  $: $player.planets.forEach(planet => {
    if (planet.html) {
      planet.html.addEventListener('animationiteration', increasePoints);
    }
  });

  $: orbitSizes = $player.planets.map((planet, index) => {
    const previousPlanetSizes = $player.planets.slice(0, index).map(p => p.planet.size).reduce((a, b) => a + b, 0);
    return 160 + 20 * index + 2 * previousPlanetSizes + planet.planet.size;
  });
</script>

<div class="background">
    <button on:click={() => {playing = !playing}}>
        {playing ? 'Points: ' + ($player.points || 0) : 'Start'}
    </button>
    <div class="stars">
        <div class="star"></div>
    </div>
    <div class="instructions">{elementToPlace ? 'Select orbit to place ' + elementToPlace.name + ' on' : ''}</div>

    <div class="planets">
        <div class="sun" bind:this={sun}></div>

        {#if $player.planets}
            {#each $player.planets as planet, index}
                <div class="orbit" class:paused={!playing} bind:this={planet.html}
                     style="--planet-size: {planet.planet.size}px; --orbit-size: {orbitSizes[index]}; --index: {10 - index}px"
                     on:mouseenter={() => {planet.planet.orbit = index; hoveredOrbit = index;}}
                     on:click={() => clickOrbit(planet)}>
                    <div class="planet {planet.planet.name.toLowerCase()}"
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
      background-color: #222222;
    }

    .instructions {
      font-size: 64px;
      color: white;
      position: fixed;
      left: 25%;
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
          box-shadow: inset 0 0 5px #fff, /* inner white */
          inset 2px 0 8px #f0f, /* inner left magenta short */
          inset -2px 0 8px #0ff, /* inner right cyan short */
          inset 2px 0 30px #f0f, /* inner left magenta broad */
          inset -2px 0 30px #0ff, /* inner right cyan broad */
          0 0 5px #fff, /* outer white */
          -5px 0 10px #f0f, /* outer left magenta */
          5px 0 10px #0ff; /* outer right cyan */
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
    from {
      transform: translateZ(var(--index)) rotate(0deg);
    }
    to {
      transform: translateZ(var(--index)) rotate(360deg);
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
