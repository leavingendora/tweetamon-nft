from brownie import (
    network,
    config,
    accounts,
    MockV3Aggregator,)
from web3 import Web3


DECIMALS = 8
MOCK_PRICE = 280526000000  # 2805


LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]

priceFeedMock = MockV3Aggregator


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])


def deploy_mocks():
    print("Deploying mocks")
    MockV3Aggregator.deploy(
        DECIMALS, MOCK_PRICE, {"from": get_account()}
    )
