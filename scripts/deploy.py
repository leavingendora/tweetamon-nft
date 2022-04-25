from brownie import network, config, MockV3Aggregator, Avatar
from scripts.helper import get_account, deploy_mocks, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import os
import shutil


def deploy_avatar(prize=16, updateFrontEnd=False):
    account = get_account()

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        price_feed_address = config["networks"][network.show_active()][
            "eth_usd_price_feed"
        ]
    else:
        deploy_mocks()
        price_feed_address = MockV3Aggregator[-1].address

    contract = Avatar.deploy(
        price_feed_address,
        prize,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )
    print(f"Contract deployed to {contract.address}")

    if updateFrontEnd:
        update()
    return contract


def main():
    deploy_avatar(10, True)


def update():
    copy_folders_to_front_end("./build", "./web/data")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
