require("@nomiclabs/hardhat-ethers")
require( "@openzeppelin/hardhat-upgrades")
require( "@nomiclabs/hardhat-etherscan")


const fs = require('fs')
const privateKey = fs.readFileSync("secret").toString().trim() // || "another key" // nxt account private key 
const projectId ="a7f442a9089b4e56848787858b0cf14c"
const keylocal = "17abeb9c3c27fbef99ea5ad66619cf56bc677198450d4836734f4061a726f39b" // ganache

module.exports = {
  paths:{
    artifacts: './pages/artifacts',
  },
  defaultNetwork: "hardhat",
  networks: {

    /*localhost: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [`${keylocal}`]
    },*/
    
    hardhat: {
      //url: "http://127.0.0.1:7545",
      chainId: 1337,
      //accounts: [`${keylocal}`]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts: [privateKey]
     
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${projectId}`,
      accounts: [privateKey]
     
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${projectId}`, 
      accounts: [privateKey]
     
    },
    eth: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
     
    }
  },
  etherscan: {
    apiKey: "AT9HM2CY1HHS27WAI2J3WF6FGC3NH5V8TX",
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}