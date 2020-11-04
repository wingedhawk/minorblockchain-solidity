# dataunion_solidity
This repository contains the smart contracts for the DataUnion project.

# SETUP

We need truffle to compile and migrate 
> npm install -g truffle 

We also need Ganache CLI to get a private blockchain network
> npm install -g ganache-cli

Install dependencies 

> npm install

It is recommended to use 3 different CMD to run these
After installing above use the following lines in order:
```bash 
npm run ganache-m
```
This causes the ganache cli to start with the testmemnoic:
> alpha unfold penalty man day repeat park top film weekend combine lion

```bash 
npm run migrate
```
This initializes the smart-contracts

```bash 
npm run start 
```
This initialize the website

If the website gives error about undefined methods
rerun the command
```bash 
npm run migrate
```

In the website there is in the middle 3 different functions
ERC20 is your standard transfer via a DApp
Paymentchannel without buffer is the earn system where a person can get tokens without paying for it 1 each time
Paymentchannel with buffer is the earn system where a person can get tokens without paying for it, but in this version the amount of contribution gets stored and
send in total.
