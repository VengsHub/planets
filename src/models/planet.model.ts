import type { Moon } from './moon.model';
import type { Player } from './player.model';

export class Planet {
  constructor(public name: string,
              public size: number,
              public moonSlots: number,
              public rotationTime: number,
              public ability: string,
              public price: number,
              public orbit?: number,
              public x = 0,
              public moons: Moon[] = []) {
  }
}

export const isPlanet = (element: any): element is Planet => element.moonSlots !== undefined;

export const Ability = {
  mercury: (planet: Planet, player: Player): number => {
    return 1;
  },
  venus: (planet: Planet, player: Player): number => {
    planet.x++;
    return planet.x;
  },
  earth: (planet: Planet, player: Player): number => {
    return player.planets.findIndex(p => p.name === planet.name);
  },
  mars: (planet: Planet, player: Player): number => {
    return 1;
  },
  jupiter: (planet: Planet, player: Player): number => {
    return 1;
  },
  saturn: (planet: Planet, player: Player): number => {
    return 1;
  },
  uranus: (planet: Planet, player: Player): number => {
    return 1;
  },
  neptune: (planet: Planet, player: Player): number => {
    return 1;
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
    new Planet('Mercury', 10, 0, 5, 'mercury', 10),
    new Planet('Venus', 20, 0, 5, 'venus', 20),
    new Planet('Earth', 24, 1, 5, 'earth', 30),
    new Planet('Mars', 12, 2, 5, 'mars', 40),
    new Planet('Jupiter', 80, 79, 5, 'jupiter', 50),
    new Planet('Saturn', 60, 82, 5, 'saturn', 60),
    new Planet('Uranus', 40, 27, 5, 'uranus', 70),
    new Planet('Neptune', 30, 14, 5, 'neptune', 80),
];
