<script>
    var imprint_hidden = true;

    function toggleImprint() {
        imprint_hidden = !imprint_hidden;
    }
</script>

<section class="mt-1">
    {#if imprint_hidden == false}
        <div id="imprint" class="imprint p-2 mb-1 text-small">
            <p>Responsible for the content:</p>
            <p>leavingendora@gmail.com</p>
        </div>
    {/if}
    <p class="text-xs text-center mb-1 color">
        Created with <i class="fas fa-heart" />, Svelte, TailwindCSS and web3.js
        by Leaving Endora &copy; 2022 |
        <a href="javascript:void(0)" on:click={toggleImprint}>Imprint</a>
    </p>
</section>

<style>
    .color {
        color: #5a6988;
    }

    .imprint {
        border: 2px solid;
        border-color: #5a6988 !important;
        background-color: #3a4466 !important;
        padding: 4px;
        margin-bottom: 1rem;
    }
</style>
