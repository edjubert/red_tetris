<script>
  import { _ } from "../services/i18n";
  import { muted, user } from "$lib/user";
  import ButtonLeave from "./ButtonLeave.svelte";
  import ButtonRestart from "./ButtonRestart.svelte";

  let roomname = '';
  let usersBoard = new Map();
  let gameover = false;

  let board = new Array(20)
    .fill(0)
    .map(() => new Array(10).fill(0))

  let score = 0;
  let lines = 0;

  let owner = false;

  let indestructibleLines = 0;

  let nextShape = {
    shape: []
  };

  let endPlayerList = [];
  let isEndGame = false;
</script>

<main>
    <button class="mute-button" on:click={() => muted.set(!$muted)}>
        <img src={`${$muted ? '/sound-down.svg' : '/sound-up.svg'}`} alt="sound">
    </button>
    <aside class="others">
        {#each [...usersBoard.entries()] as [_, { username, heights, scores, gameover }]}
            <div>
                {username}<br>
                {scores.score}
                <div class="small-board {gameover ? 'small-gameover' : ''}">
                    {#each heights as height}
                        <div style="height: {height / 20 * 100}%"/>
                    {/each}
                </div>
            </div>
        {/each}
    </aside>

    <div class="container">
        {#if gameover}
            <div class="gameover">
                <h2>{$_('game.gameover')}</h2>
                <div class="gameover-score">
                    {$_('game.score')}<br>
                    {score}
                </div>
            </div>
        {/if}

        <div class="board">
            {#each board as row}
                <div class="row">
                    {#each row as cell}
                        <div class="cell cell-{cell}" />
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <aside class="self">
        <h1>{roomname}</h1>
        <h2>{$user}</h2>
        <div>
            {$_('game.high_score')}<br>
            0<br>
            {$_('game.score')}<br>
            {score}<br>
            {$_('game.lines')}<br>
            {lines}<br>
            {$_('game.incoming_lines')}<br>
            {indestructibleLines}<br>
            <br>

            <div class="board next-piece">
                {#each nextShape.shape as row}
                    <div class="row">
                        {#each row as cell}
                            <div class="cell cell-{cell ? nextShape.colorid : 0}" />
                        {/each}
                    </div>
                {/each}
            </div>
        </div>

        {#if !isEndGame}
            <ButtonLeave />
        {/if}
    </aside>

    {#if isEndGame}
        <div class="card card-endgame">
            <h2>{$_('game.scores_label')}</h2>
            <div class="score-div">
                <p>{$_('game.scores_top')}</p>
                <p>{$_('game.scores_name')}</p>
                <p>{$_('game.scores_score')}</p>
            </div>

            {#each endPlayerList as player, i}
                <div class="score-div">
                    <p>{i+1}</p>
                    <p>{player.username}</p>
                    <p>{player.score}</p>
                </div>
                <hr>
            {/each}

            <div class="action">
                <ButtonLeave />

                {#if owner}
                    <ButtonRestart roomname={roomname} />
                {/if}
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        overflow: hidden;
        width: 100%;
        height: 100%;
        background: var(--theme-base);
        padding: 20px;
        display: flex;
        gap: 20px;
        justify-content: center;
    }
    .mute-button {
        position: fixed;
        top: 2%;
        left: 75%;
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
    }
    .mute-button img {
        height: 25px;
    }
    .others {
        max-width: 15vw;
        overflow-y: auto;
        padding-right: 10px;
    }
    .others > div{
        width: 100%;
    }

    .small-board {
        display: flex;
        aspect-ratio: 1/2;
        background: var(--theme-overlay2);
    }
    .small-board > div {
        background: var(--theme-overlay0);
        flex: 1;
    }
    .small-gameover {
        filter: brightness(.3) saturate(.6);
    }

    .container {
        width: 100%;
        max-width: calc(90vh / 2);
        position: relative;
        height: fit-content;
    }
    .board {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden;
        transition: .4s
    }
    .gameover + .board {
        filter: brightness(.5) saturate(.8);
    }

    .row {
        display: flex;
        gap: 4px;
    }
    .cell {
        flex: 1;
        aspect-ratio: 1/1;
        border-radius: 1px;
        transition: .04s;
        background: var(--theme-subtext1);
        --shadow: inset 0 0 0 5px var(--theme-subtext2), inset -5px -5px var(--theme-subtext2);
        box-shadow: var(--shadow), 0 0 6px var(--theme-subtext1);
    }
    .cell-9 {
        background: radial-gradient(circle at 5px 4px, var(--theme-overlay0) 0%, var(--theme-overlay1) 49%);
        --color: var(--theme-base);
    }
    .cell-1 { --color: var(--theme-rosewater); }
    .cell-2 { --color: var(--theme-flamingo); }
    .cell-3 { --color: var(--theme-pink); }
    .cell-4 { --color: var(--theme-mauve); }
    .cell-5 { --color: var(--theme-red); }
    .cell-6 { --color: var(--theme-maroon); }
    .cell-7 { --color: var(--theme-peach); }
    .cell-8 { --color: var(--theme-yellow); }
    .cell-0, .cell-8 {
        --shadow-color: #0d0d171e;
        box-shadow: var(--theme-subtext2);
    }
    .cell-0 { --color: var(--theme-overlay0); }

</style>