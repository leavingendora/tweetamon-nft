from brownie import network, accounts, exceptions
from scripts.helper import get_account, MOCK_PRICE
from scripts.deploy import deploy_avatar
import pytest


def deploy(prize=10):
    account = get_account()
    contract = deploy_avatar(prize=prize)
    return account, contract


def test_deploy_price():
    account, contract = deploy(10)
    assert contract.usdFee() == 10 * 10**(8+18)


def test_setUsdFee():
    account, contract = deploy(10)
    contract.setUsdFee(15)
    assert contract.usdFee() == 15 * 10**(8+18)


def test_getRequiredWei():
    account, contract = deploy(10)
    assert contract.usdFee() == 10 * 10**(8+18)
    wei = contract.getRequiredWei()
    expected_value = 10 * 10**18 / (MOCK_PRICE / 100000000)
    assert wei < expected_value + 10 and wei > expected_value - 10


def test_createAvatar_insufficient_funds():
    account, contract = deploy(10)

    with pytest.raises(exceptions.VirtualMachineError):
        contract.createAvatar("", {"from": account, "value": 10})


def test_createAvatar_ownership():
    account, contract = deploy(10)
    non_owner = get_account(index=1)

    wei = contract.getRequiredWei() + 10
    tx = contract.createAvatar("test", {"from": account, "value": wei})
    tx.wait(1)

    id = tx.return_value

    # Check if id is 0
    assert id == 0

    # Check if minter is owner
    assert contract.ownerOf(id) == account
    # Check if non-minter is not owner
    assert contract.ownerOf(id) != non_owner

    # Check if unminted has no owner
    with pytest.raises(exceptions.VirtualMachineError):
        contract.ownerOf(id + 1)
