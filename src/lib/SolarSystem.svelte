<script lang="ts">
  import { onMount } from 'svelte';
  import { Planet, allPlanets, RotationAbility, isPlanet } from '../models/planet.model';
  import { Moon } from '../models/moon.model';
  import { player } from '$lib/stores';
  import { Player } from '../models/player.model';
  import {get} from 'svelte/store'

  let sun: HTMLElement;
  let planets: Planet[] = [];
  export let elementToPlace: Planet|Moon;
  $: hoveredOrbit = elementToPlace && isPlanet(elementToPlace) ? get(player).planets.length : -1;
  $: console.log('element', elementToPlace);

  player.subscribe(player => {
    console.log('player', player);
    if (player) {
      planets = elementToPlace && isPlanet(elementToPlace) ? insertElementIntoArray(player.planets, elementToPlace, hoveredOrbit) : player.planets;
    }
  });

  let playing = false;

  onMount(() => {
    console.log('before', allPlanets[0].x);
    RotationAbility[allPlanets[0].rotationAbility](allPlanets[0]);
    console.log('after', allPlanets[0].x);
  });

  // TODO let players test their solar system x seconds into the future?

  const getAngle = (basePos: {x: number, y: number}, targetPos: {x: number, y: number}): number => {
    const xDifference = targetPos.x - basePos.x;
    const yDifference = targetPos.y - basePos.y;
    const radians = Math.atan2(yDifference, xDifference);
    const angle = radians * (180 / Math.PI);
    return angle + 180;
  };
  const getAngleToSun = (planetPosition: {x: number, y: number}): number => getAngle(sun?.getBoundingClientRect(), planetPosition);
  const insertElementIntoArray = (array: any[], element: any, index: number): any[] => ([
    ...array.slice(0, index), element, ...array.slice(index)
  ]);

  $: console.log('planets', planets);

  const clickOrbit = (planet: Planet) => {
    if (elementToPlace) {
      // TODO write method to only update planets of store
      player.update(player => ({...player, planets} as Player));
    } else {
      elementToPlace = planet;
    }
  };

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
                     on:click={() => clickOrbit(planet)}>
                    <div class="planet {planet.name.toLowerCase()}" class:paused={!playing}></div>
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
        }
      }

      @for $i from 1 through 11 {
        .orbit:nth-of-type(#{$i}) {
          // z-index: 50 - $i;

          // TODO remove during fight as its only necessary for editing your solar system
          transform: translateZ(10 - $i + px);
        }
      }

      .mercury {
        background: linear-gradient(90deg, #453217, darken(#453217, 7%));
        box-shadow: inset 7px 0px 0px darken(#453217, 7%);
      }

      .venus {
        background: linear-gradient(90deg, #AC6339, darken(#AC6339, 7%));
        box-shadow: inset 7px 0px 0px darken(#AC6339, 12%);
      }

      .earth {
        background: linear-gradient(90deg, #3E8EBB, darken(#3E8EBB, 7%));
        box-shadow: inset 7px 0px 0px darken(#3E8EBB, 12%);
      }

      .mars {
        background: linear-gradient(90deg, #6F3125, darken(#6F3125, 7%));
        box-shadow: inset 7px 0px 0px darken(#6F3125, 9%);
      }

      .jupiter {
        background: linear-gradient(90deg, #3D2C14, darken(#3D2C14, 7%));
        box-shadow: inset 7px 0px 0px darken(#3D2C14, 5%);
      }

      .saturn {
        background: linear-gradient(90deg, #E97340, darken(#E97340, 7%));
        box-shadow: inset 7px 0px 0px darken(#E97340, 14%);
      }

      .uranus {
        background: linear-gradient(90deg, #337799, darken(#337799, 7%));
        box-shadow: inset 7px 0px 0px darken(#337799, 12%);
      }

      .neptune {
        background: linear-gradient(90deg, #6ACDC0, darken(#6ACDC0, 7%));
        box-shadow: inset 7px 0px 0px darken(#6ACDC0, 17%);
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
