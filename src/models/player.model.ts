import type { User } from './user.model';
import type { Planet } from './planet.model';

export class Player {
  constructor(public user: User,
              public points: number,
              public planets: Planet[]) {
  }
}
