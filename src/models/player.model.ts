import type { User } from './user.model';
import type { Planet } from './planet.model';

export class Player {
  constructor(public owner: User,
              public health: number,
              public shield: number,
              public planets: Planet[]) {
  }
}
