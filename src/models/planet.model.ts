import type { SolarSystem } from './solar-system.model';
import type { Moon } from './moon.model';

export class Planet {
  constructor(public name: string,
              public size: number,
              public moonSlots: number,
              public rotationTime: number,
              public rotationAbility: string,
              public orbitAbility: string,
              public orbit?: number,
              public x = 0,
              public startingAngle = 0,
              public moons: Moon[] = [],
              public buffs: Buff[] = []) {
  }
}

export class Buff {
  constructor(public planet: string,
              public amount: number,
              public type: string) {
  }
}

export class Effect {
  constructor(public amount: number,
              public type: 'damage'|'heal'|'shield'|'poison',
              public target: 'self'|'enemy') {
  }
}

export const RotationAbility = {
  mercury: (planet: Planet, solarSystem: SolarSystem) => {
    planet.x--;
  },
  venus: (planet: Planet, solarSystem: SolarSystem) => {
    planet.x++;
  },
  earth: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  },
  mars: (planet: Planet, solarSystem: SolarSystem) => {
    return new Effect(1, 'damage', 'enemy');
  },
  jupiter: (planet: Planet, solarSystem: SolarSystem) => {
    return new Effect(1, 'damage', 'self');
  },
  saturn: (planet: Planet, solarSystem: SolarSystem) => {
    return new Effect(2, 'shield', 'self');
  },
  uranus: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  },
  neptune: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  }
};

export const RotationAbilityDescription = {
  mercury: 'description',
  venus: 'description',
  earth: 'description',
  mars: 'description',
  jupiter: 'description',
  saturn: 'description',
  uranus: 'description',
  neptune: 'description'
}

export const OrbitAbility = {
  mercury: (planet: Planet, solarSystem: SolarSystem) => {
    const x = planet.x;
    planet.x += 5;
    return new Effect(x, 'damage', 'enemy');
  },
  venus: (planet: Planet, solarSystem: SolarSystem) => {
    const x = planet.x;
    planet.x = 0;
    return new Effect(x * x, 'damage', 'enemy');
  },
  earth: (planet: Planet, solarSystem: SolarSystem) => {
    return new Effect(10, 'damage', 'enemy');
  },
  mars: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  },
  // TODO buff other planets damage -> new Effect 'additive or multiplicative buff' with target planet?
  // TODO add buffs/debuffs directly to planet (reference)
  // TODO we are making the solar system 3d now, should we even consider something like "nearby planets" anymore?
  jupiter: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  },
  saturn: (planet: Planet, solarSystem: SolarSystem) => {
    return new Effect(solarSystem.shield, 'damage', 'enemy');
  },
  uranus: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  },
  neptune: (planet: Planet, solarSystem: SolarSystem) => {
    return;
  }
};

export const OrbitAbilityDescription = {
  mercury: 'description',
  venus: 'description',
  earth: 'description',
  mars: 'description',
  jupiter: 'description',
  saturn: 'description',
  uranus: 'description',
  neptune: 'description'
}

export const allPlanets: Planet[] = [
    new Planet('Mercury', 10, 0, 5, 'mercury', 'mercury', 1),
    new Planet('Venus', 20, 0, 5, 'venus', 'venus', 2),
    new Planet('Earth', 24, 1, 5, 'earth', 'earth', 3),
    new Planet('Mars', 12, 2, 5, 'mars', 'mars', 4),
    new Planet('Jupiter', 80, 79, 5, 'jupiter', 'jupiter', 5),
    new Planet('Saturn', 60, 82, 5, 'saturn', 'saturn', 6),
    new Planet('Uranus', 40, 27, 5, 'uranus', 'uranus', 7),
    new Planet('Neptune', 30, 14, 5, 'neptune', 'neptune', 8),
];
