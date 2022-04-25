<script>
    import { getContext } from "svelte";

    // Props
    const { connectMetamask, hasMetamask } = getContext("helper");

    /*Toggle dropdown list*/
    /*https://gist.github.com/slavapas/593e8e50cf4cc16ac972afcbad4f70c8*/

    document.onclick = check;
    function check(e) {
        var navMenuDiv = document.getElementById("nav-content");
        var navMenu = document.getElementById("nav-toggle");
        var target = (e && e.target) || (event && event.srcElement);
        //Nav Menu
        if (!checkParent(target, navMenuDiv)) {
            // click NOT on the menu
            if (checkParent(target, navMenu)) {
                // click on the link
                if (navMenuDiv.classList.contains("hidden")) {
                    navMenuDiv.classList.remove("hidden");
                } else {
                    navMenuDiv.classList.add("hidden");
                }
            } else {
                // click both outside link and outside menu, hide menu
                navMenuDiv.classList.add("hidden");
            }
        }
    }
    function checkParent(t, elm) {
        while (t.parentNode) {
            if (t == elm) {
                return true;
            }
            t = t.parentNode;
        }
        return false;
    }
</script>

<!--Nav-->
<nav id="header" class="fixed w-full z-30 top-0 text-white nav-bg">
    <div
        class="mx-auto flex flex-wrap items-center justify-between p-2 max-w-full sm:max-w-screen-xl"
    >
        <div class="pl-4 flex items-center">
            <a
                class="toggleColour text-white visited:text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl "
                href="#"
            >
                <img
                    src="./assets/icon.png"
                    class="h-7 inline"
                    style="width: 36px; height: 36px"
                    alt="NFT Avatars for Twitter"
                />
                Tweetamon
            </a>
        </div>
        <div class="block lg:hidden pr-4">
            <button
                id="nav-toggle"
                class="flex items-center p-1 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
                <svg
                    class="fill-current h-6 w-6"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </button>
        </div>
        <div
            class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0  lg:bg-transparent text-black p-4 lg:p-0 z-20  pr-4"
            id="nav-content"
        >
            <ul class="list-reset lg:flex justify-end flex-1 items-center">
                <li class="mr-3">
                    <a
                        class="inline-block text-white visited:text-white py-2 px-4 font-bold no-underline"
                        href="#mint">Mint</a
                    >
                </li>
                <li class="mr-3">
                    <a
                        class="inline-block text-white visited:text-white no-underline hover:text-underline py-2 px-4"
                        href="#faq">FAQ</a
                    >
                </li>
            </ul>
            {#if hasMetamask()}
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
            {:else}
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    class="inline-flex items-center py-2 px-3 font-medium text-center button hover:bg-transparent focus:bg-transparent hover:text-white focus:text-white hover:no-underline"
                >
                    <img
                        src="./assets/metamask_icon.png"
                        alt="Connect with Metamask"
                        class="pr-1"
                    />
                    Get Metamask
                </a>
            {/if}
        </div>
    </div>
    <hr class="border-b border-gray-100 opacity-25 my-0 py-0" />
</nav>

<!--Hero-->

<div class="hero">
    <div class="sliding-background absolute" />

    <div
        class=" px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center relative pt-10 md:pt-36 sm:pt-20 max-w-full sm:max-w-screen-xl"
    >
        <div
            class="flex flex-col w-3/5  justify-center items-start text-center md:text-left"
        >
            <h1 class="my-4 text-3xl font-bold leading-tight text-shadow">
                Mint your very own unique NFT Tweetamon avatar for Twitter!
            </h1>
            <p class="leading-normal text-2xl mb-8 text-shadow">
                Why pay thousands for a stupid NFT when you can pay $10?<br
                />The upcoming game will let your Tweetamon fight against other
                users.
            </p>
        </div>
    </div>
</div>

<style>
    .nav-bg {
        background: #18142501;
        backdrop-filter: blur(2px);
    }

    .hero {
        overflow: hidden;
        max-width: 100% !important;
        height: 354px;
        position: relative;
    }

    .sliding-background {
        background: url(../assets/hero_scrolling_bg.png) repeat-x;
        height: 354px;
        width: 7260px;
        animation: slide 10s linear infinite;
    }
    .text-shadow {
        text-shadow: 1px 1px #181425;
    }
    @keyframes slide {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-2420px, 0, 0);
        }
    }
</style>
