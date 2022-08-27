import type { Buff, Effect } from './planet.model';

export class Moon {
  constructor(public name: string,
              public effect: Effect | Buff,
              public planet?: string) {
  }
}

export const MoonEffectDescription = {
  moon1: 'description',
  moon2: 'description',
  moon3: 'description',
  moon4: 'description',
  moon5: 'description',
  moon6: 'description'
}
