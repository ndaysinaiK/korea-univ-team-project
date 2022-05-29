const hre = require("hardhat");
const fs = require('fs');

async function main() {

 /* const nxttokem = await hre.ethers.getContractFactory("NxTB");
  const nxt = await nxttokem.deploy();
  await nxt.deployed();
  const nxtaddr = nxt.address;

  console.log("token deployed at :", nxtaddr);

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy(nxtaddr);
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);*/

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy("0x324a3D5951F94b40C566B180066D6B2ab7BE8D54","https://www.nxtshare-public.com/api/metadata/");
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let config = `
  export const nftaddress = "${nft.address}"

  `

  let data = JSON.stringify(config)
  fs.writeFileSync('./contracts-config/config.js', JSON.parse(data))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });