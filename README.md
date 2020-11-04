# dataunion_solidity
This repository contains the smart contracts for the DataUnion project.

# SETUP

We need truffle to compile and migrate 
> npm install -g truffle 


Before hand the program Ganache needs to be installed and running
After Ganache is succesfully executed change the following variables

- truffle-config.js, line 7 (host: "{insert your IP from Ganache}")
- Change the following lines of app/scripts.js


``` js
const MyContract = require('../build/contracts/DataUnion.json');

// Wallet1
var Bob = "0x441BB33A9Bc578aCED984e8C10F0EB43e951a471"; 

//Wallet2
var Alice = "0x0C622B7746cCe7C4b8d7CC935B50d856D0Cb9A16"; 

// Private key of wallet2
var PKalice = "eef9c39b76e87254b2fde21533aa594a6b37f2e26fab8bf4c2667aa658a1e251";

// Change to your Ganache Client
var web3 = new Web3("http://localhost:8545");


```

Install dependencies 

> npm install


After changing the line you can migrate the contracts by using the command

```bash
truffle migrate
```

Finally to run the test script. 
```bash
cd app
```

After run 
```bash
node script.js
```



testmemnoic

> alpha unfold penalty man day repeat park top film weekend combine lion


1e 0x2d0E93f89c0f932704B30f94aAC704Cb6a89705B
2e 0x6dD25d5E75FFcF52F73368fE037EdDe856191Eef

pkbob = 0x0994015c73b384ad73938aa7f10df0ed305883cbaa8d252d0a24e1603f30bda9