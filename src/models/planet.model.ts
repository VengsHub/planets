import type { Moon } from './moon.model';
import type { Player } from './player.model';

export class Planet {
  constructor(public name: string,
              public size: number,
              public moonSlots: number,
              public rotationTime: number,
              public ability: string,
              public orbit?: number,
              public x = 0,
              public startingAngle = 0,
              public moons: Moon[] = [],
              public buffs: Buff[] = []) {
  }
}

export const isPlanet = (element: any): element is Planet => element.moonSlots !== undefined;

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

export const Ability = {
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

export const AbilityDescription = {
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
    new Planet('Mercury', 10, 0, 5, 'mercury'),
    new Planet('Venus', 20, 0, 5, 'venus'),
    new Planet('Earth', 24, 1, 5, 'earth'),
    new Planet('Mars', 12, 2, 5, 'mars'),
    new Planet('Jupiter', 80, 79, 5, 'jupiter'),
    new Planet('Saturn', 60, 82, 5, 'saturn'),
    new Planet('Uranus', 40, 27, 5, 'uranus'),
    new Planet('Neptune', 30, 14, 5, 'neptune'),
];
