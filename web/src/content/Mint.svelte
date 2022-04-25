<script>
  // Props
  export let config;

  import { getContext } from "svelte";
  import Contract from "../../data/contracts/Avatar.json";
  import Map from "../../data/deployments/map.json";

  import Ethicon from "../ethicon";
  import ConnectMetamask from "./subs/ConnectMetamask.svelte";
  import MintStateItem from "./subs/MintStateItem.svelte";

  const DEBUG = false;

  const T_MINT_STATE_OPEN = 0;
  const T_MINT_STATE_DONE = 1;
  const T_MINT_STATE_FAILED = 2;

  const SAFETY_MARGIN = 5000000000000;

  const { connectMetamask, hasMetamask, isConnected } = getContext("helper");

  console.log(config.network_id);
  const { abi } = Contract;
  const contract_address = Map[config.network_id]["Avatar"][0];

  const ipfs = IpfsHttpClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: config.ipfs_auth,
    },
  });

  var loading = false;
  var network = ""; // Network name
  var address = ""; // User addr
  var isUnlocked = false; // Metamask isUnlocked

  var contract;

  var mint_state = {
    started: false,
    tx_hash: "",
    creation: T_MINT_STATE_OPEN,
    uploading: T_MINT_STATE_OPEN,
    tx: T_MINT_STATE_OPEN,
    minted: T_MINT_STATE_OPEN,
    mint_url: "",
  };

  var price_fetch = {
    error: false,
    required_wei: 0,
    required_ether: 0,
  };

  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  web3 = new Web3(Web3.givenProvider || config.endpoint);
  connect_and_query_price();

  function connect_and_query_price() {
    web3.eth.net.getNetworkType().then(function (type) {
      network = type;
      web3.eth.getAccounts().then(function (account) {
        isUnlocked = false;

        if (account.length != 0) {
          isUnlocked = true;
          address = account[0];
          price_fetch.error = true;

          contract = new web3.eth.Contract(abi, contract_address);
          contract.methods
            .getRequiredWei()
            .call({ from: address }, (error, result) => {
              if (error == null) {
                price_fetch.required_wei = web3.utils.toBN(result);
                price_fetch.required_wei = price_fetch.required_wei.add(
                  web3.utils.toBN(SAFETY_MARGIN)
                );
                price_fetch.required_ether = web3.utils.fromWei(
                  price_fetch.required_wei,
                  "ether"
                );
                price_fetch.error = false;
              }
            });
        }
      });
    });
  }

  async function mintAvatar() {
    if (price_fetch.required_wei != 0) {
      var image = new Ethicon(address, 128);
      var image_data = b64toBlob(image.getBase64());
      var stats = image.getStats();

      mint_state.started = true;
      mint_state.creation = T_MINT_STATE_DONE;

      // Upload Image
      var path = "";
      loading = true;
      await ipfs.add(image_data).then((res) => {
        //console.log("upload done");
        loading = false;
        path = "https://ipfs.io/ipfs/" + res.path;
        //console.log(path);
        // mint_state.uploading = T_MINT_STATE_DONE; // Not setting it yet, since we upload another file
      });
      if (path == "") {
        console.error("error uploading avatar");
        mint_state.uploading = T_MINT_STATE_FAILED;
        return;
      }

      // Upload metadata
      var metadata = JSON.stringify({
        name: "Tweetamon",
        descpription: "Description",
        image: path,
        background_color: "#181425",
        attributes: [
          {
            trait_type: "Type",
            value: stats.type,
          },
          {
            display_type: "number",
            trait_type: "Base CP",
            value: stats.base_cp,
          },
          {
            display_type: "number",
            trait_type: "Base Attack",
            value: stats.base_attack,
          },
          {
            display_type: "number",
            trait_type: "Base Defend",
            value: stats.base_defend,
          },
        ], //https://docs.opensea.io/docs/metadata-standards
      });
      loading = true;
      path = "";
      await ipfs.add(metadata).then((res) => {
        loading = false;
        path = "https://ipfs.io/ipfs/" + res.path;
        console.log(path);
        mint_state.uploading = T_MINT_STATE_DONE;
      });
      if (path == "") {
        console.log("error uploading metadata");
        mint_state.uploading = T_MINT_STATE_FAILED;
        return;
      }
      loading = true;
      contract.methods
        .createAvatar(path) //function in contract
        .send({
          from: ethereum.selectedAddress,
          to: contract_address,
          value: web3.utils.toHex(price_fetch.required_wei),
          gasPrice: "20000000000",
        })
        .on("error", function (error) {
          console.log("error call:");
          console.log(error);
          mint_state.tx = T_MINT_STATE_FAILED;
        })
        .on("transactionHash", function (transactionHash) {
          console.log("tx hash call:");
          console.log(transactionHash);
          mint_state.tx = T_MINT_STATE_DONE;
          mint_state.tx_hash = transactionHash;
        })
        .then((status) => {
          loading = false;
          console.log(status);

          if (status.hasOwnProperty("events")) {
            if (status.events.hasOwnProperty("Transfer")) {
              var tx = status.events.Transfer;
              if (tx.returnValues.hasOwnProperty("tokenId")) {
                var url =
                  config.marketplace +
                  contract_address +
                  "/" +
                  tx.returnValues.tokenId;
                mint_state.mint_url = url;
                mint_state.minted = T_MINT_STATE_DONE;
                return;
              }
            }
          }

          mint_state.minted = T_MINT_STATE_FAILED;
        });
    }
  }

  function b64toBlob(b64Data) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += 512) {
      var slice = byteCharacters.slice(offset, offset + 512);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: "image/png" });
    return blob;
  }
</script>

<section class="pb-8 pt-4 scroll-mt-24" id="mint">
  {#if isUnlocked == false}
    <!-- Metamask not connected/unlocked  -->
    <ConnectMetamask />
  {:else if network == config.network}
    <!-- Mint page -->
    <div
      class="p-4 mb-4 text-sm info-network rounded-lg inline-flex items-center w-full"
      role="alert"
    >
      <img
        src="./assets/metamask_icon.png"
        alt="Connect with Metamask"
        class="pr-1"
      />
      <span class="ml-2 font-medium">Network: </span><span
        class="capitalize ml-1">{network}</span
      >
      <span class="ml-2 font-medium">Address: </span><span
        class="capitalize ml-1">{address}</span
      >
    </div>
    <div class="w-full p-3 mx-auto mint-box">
      <h1>Mint</h1>
      <p class="pb-1">You are now one step away from minting your avatar.</p>

      {#if price_fetch.error}
        <div
          class="p-4 mb-4 text-sm error-network rounded-lg inline-flex items-center w-full"
          role="alert"
        >
          <span
            >Error fetching current Ethereum price. Please do not continue, if
            you don't know what that means.</span
          >
        </div>
      {/if}
      <p class="text-xl pb-2">
        <span>Approx. Costs: {price_fetch.required_ether} Ethereum (~$10)</span>
      </p>
      {#if loading}
        <a
          href="javascript:void(0)"
          class="inline-flex items-center py-2 px-3 font-medium text-center button hover:bg-transparent focus:bg-transparent hover:text-white focus:text-white hover:no-underline"
        >
          <i class="fas fa-cog fa-spin mr-2" />
          Minting...
        </a>
      {:else}
        <a
          href="javascript:void(0)"
          on:click={mintAvatar}
          class="inline-flex items-center py-2 px-3 font-medium text-center button hover:bg-transparent focus:bg-transparent hover:text-white focus:text-white hover:no-underline"
        >
          <img
            src="./assets/metamask_icon.png"
            alt="Mint with Metamask"
            class="pr-1"
          />
          Mint now
        </a>
      {/if}
      <p class="text-xs pb-2 pt-2">
        Your avatar will be revealed after minting. This will cost you around
        $10 + additional Gas fee. Note that due to the nature of smart
        contracts, this transaction cannot be undone so there will be no refund.
      </p>
      <p class="text-xs">
        Also note that the creation process as well as the indexing on platforms
        like OpenSea can take a few minutes.
      </p>

      {#if mint_state.started == true}
        <div class="mint_state_window mt-2 p-2">
          <p>Status:</p>
          <MintStateItem state={mint_state.creation} text="Creating Avatar" />
          <MintStateItem state={mint_state.uploading} text="Uploading Avatar" />
          {#if mint_state.tx == T_MINT_STATE_DONE}
            <MintStateItem
              state={mint_state.tx}
              text="Transaction done: "
              hash={mint_state.tx_hash}
              {config}
            />
          {:else}
            <MintStateItem
              state={mint_state.tx}
              text="Waiting for transaction"
            />
          {/if}
          <MintStateItem state={mint_state.minted} text="Minting complete" />
          {#if mint_state.minted == T_MINT_STATE_DONE}
            <p>
              Minting complete. In a few minutes it should be visible on <a
                class="no-underline hover:underline"
                href={mint_state.mint_url}
                target="_blank">OpenSea<i class="fas fa-external-link" /></a
              >. If not, please refresh the metadata on the page.
            </p>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <!-- Wrong network -->
    <div
      class="p-4 mb-4 text-sm error-network rounded-lg inline-flex items-center w-full"
      role="alert"
    >
      <img
        src="./assets/metamask_icon.png"
        alt="Connect with Metamask"
        class="pr-1"
      />
      <span class="ml-2 font-medium">Please change your Metamask network.</span>
      <span class="ml-2 font-medium">Network is not supported:</span><span
        class="capitalize ml-1">{network}</span
      >
    </div>
  {/if}

  {#if DEBUG}
    <ul class="text-xs mt-5">
      <li>network: {network}</li>
      <li>address: {address}</li>
      <li>isUnlocked: {isUnlocked}</li>
      <li>isConnected: {isConnected()}</li>

      <li>hasMetamask: {hasMetamask()}</li>
      <li>required_wei: {price_fetch.required_wei}</li>
      <li>required_ether: {price_fetch.required_ether}</li>
    </ul>
  {/if}
</section>

<style>
  .info-network {
    background-color: #5a6988;
    color: #262b44;
  }

  .mint_state_window {
    background-color: #262b44;
  }

  .error-network {
    background-color: #a22633;
    color: #181425;
  }

  .mint-box {
    background-color: #3a4466;
  }
</style>
