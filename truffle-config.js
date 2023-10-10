const HDWalletProvider = require('@truffle/hdwallet-provider');

const infuraProjectId = "..."; //create an account on https://infura.io/
//use ganache to create a random mnemonic phase. 
//then use a rinkeby faucet to fill in some ether to account[0] and account[1]
const mnemonic = "..."; 

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      evmVersion: "byzantium",
      gas: 4600000,
    },

    // Deployment to testnet
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
          numberOfAddresses: 3,
          shareNonce: true,
          derivationPath: "m/44'/60'/0'/0/"
        }),
      network_id: '4',
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.7",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
