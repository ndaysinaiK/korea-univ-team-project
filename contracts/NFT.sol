// SPDX-License-Identifier: NxtBloc and MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract NFT is ERC721Enumerable, Ownable, Pausable  {
  using Strings for uint256;
  string baseURI="";
  address contractAddress;
  uint256 supplycount =0;
  uint256 public price;

  constructor (address marketplaceAddress, string memory _URI ) ERC721("NxtShare ERC 721", "NXTS-721") {
   contractAddress = marketplaceAddress;
   baseURI=_URI;
  }
 
  function changeUri(string memory _newUri) public onlyOwner returns (bool)  { 
    baseURI=_newUri;
    return true;
  }


 function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function createNFT()public returns (uint256 result){
     
      supplycount++;
     _safeMint(msg.sender, supplycount);
     setApprovalForAll(contractAddress, true);
     return supplycount;
  }


   function tokenURI(uint256 tokenId)public view virtual override returns (string memory)
  {
    require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, tokenId.toString())) : "";
  }

  function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

}