// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Avatar is ERC721URIStorage, Ownable {
    uint256 _counter = 0;
    uint256 public usdFee;
    AggregatorV3Interface internal _ethUsdPriceFeed;

    constructor(address priceFeedAddress, uint256 usd)
        public
        ERC721("YourNFTAvatar", "UNFT")
    {
        _counter = 0;
        _setUsdFee(usd);
        _ethUsdPriceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function createAvatar(string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(
            (msg.value >= getRequiredWei() || usdFee == 0),
            "Error: More WEIs required. Check out getRequiredWei()"
        );

        _safeMint(msg.sender, _counter);
        _setTokenURI(_counter, tokenURI);

        _counter = _counter + 1;
        return _counter - 1;
    }

    function getRequiredWei() public view returns (uint256) {
        (, int256 price, , , ) = _ethUsdPriceFeed.latestRoundData();
        return uint256((usdFee) / uint256(price));
    }

    // function getEth() public view returns (uint256) {
    //     (, int256 price, , , ) = _ethUsdPriceFeed.latestRoundData();
    //     return uint256(price);
    // }

    function setUsdFee(uint256 usd) public onlyOwner {
        _setUsdFee(usd);
    }

    function _setUsdFee(uint256 usd) internal {
        // 10^8: eth/usd feed is provided in 8 digits precise
        // 10^18: requiredWei = (usdfee * 10^18) / price
        usdFee = usd * (10**(8 + 18));
    }
}
