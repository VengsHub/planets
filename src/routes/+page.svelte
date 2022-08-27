<script lang="ts">
  import { onMount } from 'svelte';
  import { Planet, allPlanets, RotationAbility } from '../models/planet.model';
  import { Moon } from '../models/moon.model';
  import SelectionOverlay from '$lib/SelectionOverlay.svelte';

  let sun: HTMLElement;
  let planets: {data: Planet, html?: HTMLElement}[] = allPlanets.map(planet => ({data: planet}));
  let orbits = [...Array(10).keys()];

  let points = 0;
  let timeToChoose = false;
  let elementToPlace: Planet|Moon;

  onMount(() => {
    console.log('before', allPlanets[0].x)
    RotationAbility[allPlanets[0].rotationAbility](allPlanets[0]);
    console.log('after', allPlanets[0].x)
  })

  const onSelection = (element: Planet|Moon) => {
    console.log('selected', element);
    elementToPlace = element;
    // TODO here
    // TODO show options under solar system instead of in front of it, so that players can look at their solar system
    // TODO let players test their solar system x seconds into the future?
    // TODO when planet push into solarSystem.planets, when moon pick planet (UI) then add moon to planet
    timeToChoose = false;
  };

  const getAngle = (basePos: {x: number, y: number}, targetPos: {x: number, y: number}): number => {
    const xDifference = targetPos.x - basePos.x;
    const yDifference = targetPos.y - basePos.y;
    const radians = Math.atan2(yDifference, xDifference);
    const angle = radians * (180 / Math.PI);
    return angle + 180;
  };

  const getAngleToSun = (planetPosition: {x: number, y: number}): number => getAngle(sun?.getBoundingClientRect(), planetPosition);
  // TODO add $
  const orbitSizes = planets.map((planet, index) => {
    const previousPlanetSizes = planets.slice(0, index).map(p => p.data.size).reduce((a, b) => a + b, 0);
    return 160 + 20 * index + 2 * previousPlanetSizes + planet.data.size;
  });
</script>

{#if timeToChoose}
    <SelectionOverlay on:select={event => onSelection(event.detail)}></SelectionOverlay>
{/if}

<div class="background">
    <div class="points">{points}</div>

    <button on:click="{() => {timeToChoose = true}}">Open</button>

    <div class="stars">
        <div class="star"></div>
    </div>

    <div class="planets">
        <div class="sun" bind:this={sun}></div>

        {#each orbits as orbit, index}
            {#if planets[index]}
                <div class="orbit" class:paused={timeToChoose || elementToPlace}
                     style="--planet-size: {planets[index].data.size}px; --orbit-size: {orbitSizes[index]}">
                    <div class="planet {planets[index].data.name.toLowerCase()}" bind:this={planets[index].html}></div>
                </div>
            {/if}
        {/each}
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
    background: #222;
    overflow: hidden;
    height: 100%;

    button, .points {
      font-size: 64px;
      color: white;
    }

    button {
      background-color: #222222;
    }

    .planets {
      width: 100%;
      position: absolute;
      top: 50%;

      .sun {
        background: linear-gradient(90deg, #BB513E, darken(#BB513E, 9%));
        box-shadow: inset 15px 10px 0px darken(#BB513E, 9%);
        width: $sun-size;
        height: $sun-size;
        border-radius: 100%;
        position: absolute;
        top: calc(50% - #{$half-sun-size});
        left: calc(50% - #{$half-sun-size});
        z-index: 50;
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
        top: calc(50% - var(--half-orbit-size));
        left: calc(50% - var(--half-orbit-size));
        animation: gravity var(--rotation-speed) linear infinite;

        &.paused {
          animation-play-state: paused !important;
        }

        &:hover {
          border: 1px solid green;
        }

        &:active:hover {
          animation-play-state: paused;
        }

        .planet {
          width: var(--planet-size);
          height: var(--planet-size);
          border-radius: 100%;
          margin-left: calc(-1 * var(--planet-size) / 2);
          margin-top: calc(var(--half-orbit-size) - var(--planet-size) / 2);
        }
      }

      @for $i from 1 through 9 {
        .orbit:nth-of-type(#{$i}) {
          z-index: 50 - $i;
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
</style>
