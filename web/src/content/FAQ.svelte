<script>
    function toggleAccordion(e) {
        e.target.classList.toggle("active");
        var panel = e.target.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
</script>

<section class="pb-8 scroll-mt-24" id="faq">
    <h1>FAQ</h1>

    <button class="accordion flex mb-1" on:click={toggleAccordion}
        >What is Tweetamons? <p class="ml-auto">
            <i class="fas fa-expand-alt text-xs" />
        </p></button
    >
    <div class="panel">
        <p>
            Tweetamons is the result of two ideas. First, we wanted to create an
            NFT smart contract where everyone can have an unique NFT and second,
            we want to create a Twitter game.
        </p>
        <p>
            The game is currently in planning and requires the avatar to be used
            as a Twitter profile picture. There is no planned release date for
            that game yet.
        </p>
    </div>

    <button class="accordion flex mb-1" on:click={toggleAccordion}
        >How to buy? <p class="ml-auto">
            <i class="fas fa-expand-alt text-xs" />
        </p></button
    >
    <div class="panel">
        <p>
            To acquire an NFT it is necessary to connect Metamask. Through an
            oracle, the current conversion rate of ETH/USD is provided. Mining
            an NFT costs about $5 plus gas fee.
        </p>
        <p>
            Due to the nature of smart contracts, there is no possibility of a
            refund. Also, we cannot take back NFTs as the transaction costs
            would exceed the value of the NFT. Please not: If there is an error
            in the creation process, there will be no transaction.
        </p>
    </div>

    <button class="accordion flex mb-1" on:click={toggleAccordion}
        >Where is my NFT?
        <p class="ml-auto">
            <i class="fas fa-expand-alt text-xs" />
        </p></button
    >
    <div class="panel">
        <p>
            After calling the smart contract an ERC-721 non-fungible token will
            be created. This will be transfered to your selected address. This
            token has metadata attached to it which will tell sites like
            OpenSea, where the avatar is stored as well as the avatars stats.
            Both metadata and the png will be stored on decentralized IPFS.
        </p>
    </div>
</section>

<style>
    .accordion {
        background-color: #3a4466;
        color: #ffffff;
        cursor: pointer;
        padding: 18px;
        width: 100%;
        text-align: left;
        border: none;
        outline: none;
        transition: 0.4s;
    }
    .active,
    .accordion:hover {
        background-color: #5a6988;
    }

    .panel {
        padding: 12px;
        background-color: #262b44;
        display: none;
        overflow: hidden;
    }
</style>
