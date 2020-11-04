const { pathExists } = require('fs-extra');
const PrivateKeyProvider = require('truffle-privatekey-provider');

const path = require('path');

const ethPrivateKey = process.env.ETH_PK;
const infuraId = process.env.INFURA_ID || '';
const ip = "localhost"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "../src/contract-info"),
  networks: {
    // ganache-cli
    development: {
      host: ip ,
      port: 8545,
      network_id: '*',
    },
    // truffle develop
    develop: {
      host: ip ,
      port: 8545,
      network_id: '*',
    },
    // Ganache UI
    ganacheUI: {
      host: ip ,
      port: 8545,
      network_id: '*',
    },
    // rinkeby
    rinkeby: {
      provider: () =>
        new PrivateKeyProvider(
          ethPrivateKey,
          `https://rinkeby.infura.io/${infuraId}`,
        ),
      network_id: 4,
      gas: 1000000,
      gasPrice: 4000000000,
    },
    // live Ethereum network
    live: {
      provider: () =>
        new PrivateKeyProvider(
          ethPrivateKey,
          `https://mainnet.infura.io/${infuraId}`,
        ),
      network_id: 1,
      // Set the gas and gasPrice very carefully.
      // If set incorrectly they can prevent deploys, or clean out your account!
      gas: 1000000,
      gasPrice: 4000000000,
    },
  },
  compilers: { 
    solc: {
      version: "0.4.24",
      settings: {
        optimizer: {
          enabled: false, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
