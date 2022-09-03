import type { Moon } from './moon.model';
import type { Player } from './player.model';

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
  constructor(public amount: number,
              public type: string,
              public planet?: string) {
  }
}

export class Effect {
  constructor(public amount: number,
              public type: 'damage'|'heal'|'shield'|'poison',
              public target: 'self'|'enemy') {
  }
}

export const RotationAbility = {
  mercury: (planet: Planet, player: Player) => {
    planet.x--;
  },
  venus: (planet: Planet, player: Player) => {
    planet.x++;
  },
  earth: (planet: Planet, player: Player) => {
    return;
  },
  mars: (planet: Planet, player: Player) => {
    return new Effect(1, 'damage', 'enemy');
  },
  jupiter: (planet: Planet, player: Player) => {
    return new Effect(1, 'damage', 'self');
  },
  saturn: (planet: Planet, player: Player) => {
    return new Effect(2, 'shield', 'self');
  },
  uranus: (planet: Planet, player: Player) => {
    return;
  },
  neptune: (planet: Planet, player: Player) => {
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
  mercury: (planet: Planet, player: Player) => {
    const x = planet.x;
    planet.x += 5;
    return new Effect(x, 'damage', 'enemy');
  },
  venus: (planet: Planet, player: Player) => {
    const x = planet.x;
    planet.x = 0;
    return new Effect(x * x, 'damage', 'enemy');
  },
  earth: (planet: Planet, player: Player) => {
    return new Effect(10, 'damage', 'enemy');
  },
  mars: (planet: Planet, player: Player) => {
    return;
  },
  // TODO buff other planets damage -> new Effect 'additive or multiplicative buff' with target planet?
  // TODO add buffs/debuffs directly to planet (reference)
  // TODO we are making the solar system 3d now, should we even consider something like "nearby planets" anymore?
  jupiter: (planet: Planet, player: Player) => {
    return;
  },
  saturn: (planet: Planet, player: Player) => {
    return new Effect(player.shield, 'damage', 'enemy');
  },
  uranus: (planet: Planet, player: Player) => {
    return;
  },
  neptune: (planet: Planet, player: Player) => {
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
    new Planet('Mercury', 10, 0, 5, 'mercury', 'mercury'),
    new Planet('Venus', 20, 0, 5, 'venus', 'venus'),
    new Planet('Earth', 24, 1, 5, 'earth', 'earth'),
    new Planet('Mars', 12, 2, 5, 'mars', 'mars'),
    new Planet('Jupiter', 80, 79, 5, 'jupiter', 'jupiter'),
    new Planet('Saturn', 60, 82, 5, 'saturn', 'saturn'),
    new Planet('Uranus', 40, 27, 5, 'uranus', 'uranus'),
    new Planet('Neptune', 30, 14, 5, 'neptune', 'neptune'),
];
