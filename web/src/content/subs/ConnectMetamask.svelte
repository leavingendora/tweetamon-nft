<script>
    import { getContext } from "svelte";
    const { connectMetamask, isConnected } = getContext("helper");
</script>

<div class="box">
    {#if isConnected()}
        <h5
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            Unlock Metamask
        </h5>

        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            In order to mint, you will need to unlock your Metamask. No
            transaction will be made now. Please refresh this page after
            unlocking.
        </p>
    {:else}
        <h5
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            Connect Metamask
        </h5>

        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            In order to mint, you will need to connect and unlock your Metamask.
            No transaction will be made now. Please refresh this page after
            login.
        </p>
        <a
            href="#"
            on:click={connectMetamask}
            class="inline-flex items-center py-2 px-3 font-medium text-center button hover:bg-transparent focus:bg-transparent hover:text-white focus:text-white hover:no-underline"
        >
            <img
                src="./assets/metamask_icon.png"
                alt="Connect with Metamask"
                class="pr-1"
            />
            Connect
        </a>
    {/if}
</div>
