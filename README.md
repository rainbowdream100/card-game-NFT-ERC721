# FT5004 Lab 4

## Setup
Install npm dependancies:
```
npm install
```

## (ex1) Running suite of local test
1. Run in a terminal window:
   ```
   npx ganache-cli
   ```
   This will be the EVM environment

2. Run in a separate window:
   ```
   npx truffle test --networks development
   ```
   This runs the entire test suite

## (ex2) Run the test suite on rinkeby testnet
See the changes made to `truffle-config.js`

1. Setup your infura endpoint.
   - Signup for an infura account at https://infura.io
   - Create am 'ethereum' project
   - copy the "Project ID" to  `infuraProjectId` in `truffle-config.js`

2. Setup ethereum address for testnet
   - Run a random instance of `ganache-cli`
   - Notice the following output:
     ```
     Available Accounts
     ==================
     (0) 0x<account address>
     (1) 0x<account address>
     ...

     HD Wallet
     ==================
     Mnemonic: <Mnemonic phrase>
     Base HD Path:  m/44'/60'/0'/0/{account_index}
     ```
   - Fil the Mnemonic phrase into `truffle-config.js`
   - Use a rinkeby faucet to fill `account[0]` and `account[1]` with some ether
3. Run the test suite using rinkeby testnet:
```
npx truffle test --networks rinkeby
```
