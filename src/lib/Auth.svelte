<script>
  import {supabase} from "$lib/supabaseClient"
  import {user as session, player} from "$lib/stores"
  import {Player} from "../models/player.model";

  let loading = false
  let email;

  const handleLogin = async () => {
    try {
      loading = true
      const { user, error } = await supabase.auth.signIn({ email })
      if (error) throw error
      session.update(() => {user.email});
      player.update(() => new Player({email: user.email}, 100, 0, []));

      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      loading = false
    }
  }
</script>

<form class="row flex flex-center" on:submit|preventDefault={handleLogin}>
    <div class="col-6 form-widget">
        <h1 class="header">Supabase + Svelte</h1>
        <p class="description">Sign in via magic link with your email below</p>
        <div>
            <input
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    bind:value={email}
            />
        </div>
        <div>
            <input type="submit" class='button block' value={loading ? "Loading" : "Send magic link"} disabled={loading} />
        </div>
    </div>
</form>
