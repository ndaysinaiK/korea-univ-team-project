const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

async function main() {

 const nxttokem = await ethers.getContractFactory("MCT");
  console.log("Deploying MCT...");
  const nxt = await upgrades.deployProxy(nxttokem, {
    initializer: "initialize",
    });

  await nxt.deployed();
  const nxtaddr = nxt.address;

  console.log("token deployed at :", nxtaddr);

  console.log("Deploying Logic contract...");
  const NFTMarket = await ethers.getContractFactory("Logic");
  const nftMarket = await upgrades.deployProxy(NFTMarket, [nxtaddr], {
    initializer: "initialize",
    });

  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);
  

  let config = `
  export const nftmarketeth = "${nftMarket.address}"
  export const tokenAddresseth ="${nxtaddr}"
  `


  let data = JSON.stringify(config)
  fs.writeFileSync('./contract-addresses/ethconfig.js', JSON.parse(data))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });