<script>
    export let state;
    export let text;
    export let hash;
    export let config;
    const T_MINT_STATE_OPEN = 0;
    const T_MINT_STATE_DONE = 1;
    const T_MINT_STATE_FAILED = 2;
</script>

<div class="inline-flex items-center w-full">
    {#if state == T_MINT_STATE_OPEN}
        <i class="fa-regular fa-circle mint_state_open" />
    {/if}
    {#if state == T_MINT_STATE_DONE}
        <i class="fa-regular fa-circle-check mint_state_done" />
    {/if}
    {#if state == T_MINT_STATE_FAILED}
        <i class="fa-regular fa-circle-xmark mint_state_failed" />
    {/if}
    {#if hash}
        <p class="pl-2 text-sm">
            {text}
            <a
                class="no-underline hover:underline"
                href="{config.etherscan}{hash}"
                >{hash}<i class="fas fa-external-link" /></a
            >
        </p>
    {:else}
        <p class="pl-2 text-sm">{text}</p>
    {/if}
</div>

<style>
    .mint_state_open {
        color: #8b9bb4;
    }

    .mint_state_done {
        color: #3e8948;
    }

    .mint_state_failed {
        color: #e43b44;
    }
</style>
