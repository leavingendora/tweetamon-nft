# Tweetamon
Tweetamon is the result of two ideas. First, we wanted to create an NFT smart contract where everyone can have an unique NFT and second, we want to create a Twitter game.
The game is currently in planning and requires the avatar to be used as a Twitter profile picture. There is no planned release date for that game yet.

## Minting on Rinkeby Testnet
To mint a NFT on [rinkeby testnet](https://tweetamon-rinkeby.surge.sh/)

Faucets for rinkeby:
[rinkeby.io](https://faucet.rinkeby.io/) | [rinkebyfaucet](https://rinkebyfaucet.com/)


## Run Dev Test
The current setup requires infura endpoints for Ethereum and IPFS.

1. Setting up .env files
In order to run your dev test you will need to setup the .env files. There is one .env file for the brownie test & deploy mechanics and one for the web front end. This project provides example.env files.

2. Adapt brownie-config
You can easily deploy to any ethereum net by adapting the brownie-config.yaml

3. Compile the smart contract
To compile the NFT contract run:
> brownie compile

4. Running tests
There are a bunch of test for the contract which can be run locally using ganache:
> brownie test
In the contracts folder you can find a mock version of the price aggregator.
For running tests on a specific network run: 
> brownie test --network rinkeby

5. Deploy to a network
To deploy the contract to a network run:
> brownie run .\scripts\deploy.py --network rinkeby
Deploying will also copy over "./build" to "./web/data".

6. Run Front-End
Run the following command in the web folder:
> npm install
> npm run dev

## Deploy

7. Build
> npm run build

8. Upload public folder
> surge



