import {supabase} from "$lib/supabaseClient"
import {player, otherPlayers} from "$lib/stores";

// TODO either find out why load isn't being called or move this logic to onMount in +page.svelte
export const load = async () => {
  // const {data: players, error} = await supabase
  // .from('players')
  // .select("*")
  // .eq('email', 'mischa@koischwitz.de')
  //
  // if (error) {
  //   throw error;
  // }
  //
  // const myPlayer = players.find(player => player.email === 'mischa@koischwitz.de');
  // const others = players.filter(player => player.email !== 'mischa@koischwitz.de');
  //
  // player.set(myPlayer);
  // otherPlayers.set(others);
  //
  // return {myPlayer, otherPlayers};
}
