import { writable } from 'svelte/store';
import type { User } from '../models/user.model';
import type { Player } from '../models/player.model';

export const user = writable<User>(undefined);

export const player = writable<Player>(undefined);
