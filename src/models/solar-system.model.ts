import type { User } from './user.model';
import type { Planet } from './planet.model';

export class SolarSystem {
  constructor(public owner: User,
              public health: number,
              public shield: number,
              public planets: {planet: Planet, html?: HTMLElement}[]) {
  }
}
