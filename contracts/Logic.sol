// SPDX-License-Identifier: NxtBloc and MIT 
pragma solidity ^0.8.3;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

contract Logic is Initializable, UUPSUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
   using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _itemIds;
  CountersUpgradeable.Counter private _itemsSold;
  IERC20Upgradeable public tokenAccepted;
  uint256 listingPrice ;
  uint256 promotionPrice ;
  uint256 tradingpercentage;
  address payable plateformfeeaddress;

   function initialize(address _token, address _feeaddr) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();
        tokenAccepted =IERC20Upgradeable(_token);
        plateformfeeaddress=payable(_feeaddr);
        listingPrice=500 ether;
       promotionPrice=200 ether;
       tradingpercentage=1;
    }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

    function getPromotionPrice() public view returns (uint256) {
    return promotionPrice;
  }

  function changeListingPrice(uint256 _newprice) public onlyOwner returns(bool result){
    listingPrice=_newprice;
    return true;
  }

    function changeTradingfee(uint256 _newprice) public onlyOwner returns(bool result){
    tradingpercentage=_newprice;
    return true;
  }

   function changePromotionPrice(uint256 _newprice) public onlyOwner returns(bool result){
    promotionPrice=_newprice;
    return true;
  }

  function changePlatformFeeaddress(address _newaddr) public onlyOwner returns(bool result){
    plateformfeeaddress=payable(_newaddr);
    return true;
  }

  function promotion(uint256 totaldays) public payable nonReentrant{
     
      //require(_promotionPrice>getPromotionPrice(),"unsufficient funds");
      IERC20Upgradeable(tokenAccepted).transferFrom(msg.sender,address(owner()), promotionPrice*totaldays);
 
  }

  function payMintingfee() public payable nonReentrant {
    
    IERC20Upgradeable(tokenAccepted).transferFrom(msg.sender,address(owner()), listingPrice);
  }

  function createListNFT(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
   // require(lp>getListingPrice(),"unsufficient funds");
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
  
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    //IERC20(tokenAccepted).transferFrom(msg.sender,address(owner()), lp);
    ERC721Upgradeable(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  function buyNFT(
    address nftContract,
    uint256 itemId,
    uint256 royalty,
    address payable firstAuthor
    ) public payable nonReentrant {
    uint256 price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    uint256 TotheOwner = (msg.value/100)*royalty;
    uint256 Totheplateform = (msg.value-TotheOwner/100)*tradingpercentage;
    uint256 toTheseller = msg.value-Totheplateform;
    firstAuthor.transfer(TotheOwner);
    plateformfeeaddress.transfer(Totheplateform);
    idToMarketItem[itemId].seller.transfer(toTheseller);
    ERC721Upgradeable(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
  
  }

  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function winthdraw (address payable _addr) public onlyOwner { // just in case
    _addr.transfer(address(this).balance);
  }

    function winthdrawNXT (address payable _addr, uint256 _amount) public onlyOwner { // just in case
        IERC20Upgradeable(tokenAccepted).transferFrom(address(this),_addr, _amount);
  }

      function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}


}