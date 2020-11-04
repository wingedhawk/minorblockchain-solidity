const Web3 = require('web3');
const MyContract = require('../build/contracts/IDO.json');
var abi = require('ethereumjs-abi')

var Bob;
var Alice;
var idchannel = 0;
var web3 = new Web3("http://192.168.2.10:8545");

async function initWeb3Accounts() {
  var web3Accounts = await web3.eth.getAccounts().then(result => {
    Bob = result[0];
    Alice = result[1];
  });
}

var PKBob = "7fa77344defa33c63243fe76980ed096c2e4cac0b57925b58c2faf2828f62a5e";

const initPChannel = async (val) => {
  await initWeb3Accounts();

  var MyEscrowContractJSON = require('../build/contracts/ContributionChannel.json');
  var Nonce = 1 ; 
  var byte32 =  web3.utils.fromAscii(1);
  var hash;
  var PKSignedHash;
  var signatureOfhash; 
  var splittedSignatureOfhash; 
  var userAccount = await displayInformation(val);

  const networkId = await web3.eth.net.getId();
  MyEscrowContract = new web3.eth.Contract(
    MyEscrowContractJSON.abi,
    MyEscrowContractJSON.networks[networkId].address
  );

  async function displayInformation(val) {
    //
    await MyEscrowContract.methods.deposit(val).send({from:Bob}).then(
      deposit => console.log("deposited IDO from Bob to MPE: " + val)
    ).catch((error) => console.log(error + "------------------"));

    async function signPayment(recipient, amount, groupid, nonce, contractAddress) {

    hash = await MyEscrowContract.methods.getMessageHash(Alice, 1, "validation", 1).call()
    .then(result => {return result});
    console.log("Hash is :");
    console.log(hash);

    PKSignedHash = await web3.eth.accounts.sign(hash, PKBob);
    console.log("PKSignedHash is :");
    console.log(PKSignedHash);

    signatureOfhash = await MyEscrowContract.methods.getEthSignedMessageHash(PKSignedHash.message).call()
    .then(result => { return result } );
    console.log("signatureOfhash is :");
    console.log(signatureOfhash);

    verify = await MyEscrowContract.methods.verify(Bob,Alice,1,"validation",1,PKSignedHash.signature).call()
    .then(result => { return result } );
    console.log("Verify is :" + verify);

    splittedSignatureOfhash = await MyEscrowContract.methods.splitSignature(PKSignedHash.signature).call()
    .then(result => { return result } );
    }

    await signPayment(Alice, 1, 1 , 1, MyEscrowContractJSON.networks[networkId].address);

    var checkIfChannelExist = await MyEscrowContract.methods.getAddresToChannelId().call({from:Alice}).then(
      result => {return result} );

    if(checkIfChannelExist) {
      idchannel = checkIfChannelExist;

      await MyEscrowContract.methods.channelAddFunds(idchannel,1).send({from:Bob, gas: 6721975, gasPrice: 2000000}).then()
        .catch(error => console.log(error + " send"));
    }
    else{
      await MyEscrowContract.methods.openChannelByThirdParty(
      Bob,
      Bob, // Ganache[0]
      Alice, // Ganache[1]
      byte32,  // groupId,
      1, //  Deposit value
      10000000, // expiration(in ms)
      1, //messageNonce
      splittedSignatureOfhash.v,
      splittedSignatureOfhash.r,
      splittedSignatureOfhash.s,
      PKSignedHash.signature
      ).send({from:Bob, gas: 6721975, gasPrice: 2000000}).then()
      .catch(error => console.log(error + " send"));
    }

    await MyEscrowContract.methods.balances(Bob).call().then(
      balances => console.log("BALANCE OF Bob BEFORE Withdraw === " + balances));
    await MyEscrowContract.methods.balances(Alice).call().then(
      balances => console.log("BALANCE OF ALICE BEFORE Withdraw === " + balances));
    await MyEscrowContract.methods.channels(idchannel).call().then(
      balances => console.log("CHANNEL VALUE BEFORE Claim? === " + balances.value));

   await MyEscrowContract.methods.channelClaim(
    idchannel,
    1, // Actual ammount
    1, // planned ammount
    splittedSignatureOfhash.v,
    splittedSignatureOfhash.r,
    splittedSignatureOfhash.s,
    true,
    Alice,
    PKSignedHash.signature
    ).send({from: Bob, gas: 6721975, gasPrice: 2000000}) // is sendback)

    // AFTER CLAIM CHECK ALICE BALANCE.
    await MyEscrowContract.methods.balances(Alice).call().then(
      balances => console.log("BALANCE OF ALICE After Claim === "+balances));
    await MyEscrowContract.methods.channels(idchannel).call().then(
      balances => console.log("CHANNEL VALUE OF 0 After Claim? === "+balances.value));
    await MyEscrowContract.methods.withdraw(1, Alice).send({from:Bob}).then(
        balances => console.log("Alice withdrew 1 === "+balances));
    await MyEscrowContract.methods.balances(Alice).call().then(
          balances => console.log("BALANCE OF ALICE After Withdraw(SHould be lowered) === "+balances));
  }
}

initPChannel(100);