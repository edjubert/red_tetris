<script>
  import {socket} from "$lib/user.js";
  import { _ } from "../services/i18n";

  let roomname = $props()
</script>

<button class="red-button" on:click={() => {
                  socket.emit(`restart:${roomname}`);
                }}>
    {$_('game.restart')}
</button>
