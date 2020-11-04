import React, { Component } from 'react';
import Web3 from 'web3';
import './css/BalancesERC20.css';

let Bob = ""
let Alice = ""
let PKBob = "0x0994015c73b384ad73938aa7f10df0ed305883cbaa8d252d0a24e1603f30bda9"; 

const PrivateKeyProvider = require('truffle-privatekey-provider');
//PrivateKeyProvider[0]


export default class Paymentzb extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            ethBalance: 0, 
            balanceERC20: props.balanceERC20, 
            account: props.account, 
            to: "", 
            amount: 0,
            role: props.role,
            hash: "",
            hashMessagePKSigned: "",
            splittedSignatureOfhash: "",
            idchannel: 0,
            message: "",
            secret: ""
        }
    }
    
  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    Bob = accounts[0];
    Alice = accounts[1];
  }

    getInput() {
        if(this.state.role == "payer"){
            return (
                <div>
                </div>
            )
        }
    }

    getButtons() {
        if(this.state.role == "payer"){
            return(
                <div>
                    <div>
                        <div className="form-group row">
                          <label for="sign" className="col-sm-3 col-form-label">Message:</label>
                          <div class="col-sm-9">
                            <input className="form-control" type="input" id="sign" placeholder="Message to Sign" onChange={this.setMessage.bind(this)}></input>
                          </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-7">
                            <button onClick={this.depositToChannel.bind(this)} className="btn btn-primary">Fill Channel with balance</button>
                        </div>
                        <div class="col-sm-5">
                            <button onClick={this.openChannelByThirdParty.bind(this)} id="openchannelbutton" className="btn btn-primary">Open channel</button>
                        </div>                        
                    </div>
                </div>
            )
        }
        else {
            return(
                <div>
                    <div class="row">
                        <div class="col-md-4 offset-md-4">
                            <svg onClick={this.addFunds.bind(this)} width="5em" height="5em" viewBox="0 0 16 16" className="bi bi-camera2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5C7.343 5 5 6.343 5 8a4 4 0 0 1 4-4v1z"/>
                                <path fillRule="evenodd" d="M14.333 3h-2.015A5.97 5.97 0 0 0 9 2a5.972 5.972 0 0 0-3.318 1H1.667C.747 3 0 3.746 0 4.667v6.666C0 12.253.746 13 1.667 13h4.015c.95.632 2.091 1 3.318 1a5.973 5.973 0 0 0 3.318-1h2.015c.92 0 1.667-.746 1.667-1.667V4.667C16 3.747 15.254 3 14.333 3zM1.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM9 13A5 5 0 1 0 9 3a5 5 0 0 0 0 10z"/>
                                <path d="M2 3a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="secret" className="col-sm-3 col-form-label">Secret:</label>
                        <div class="col-sm-9">                          
                        <input className="form-control" type="input" id="secret" placeholder="Secret Message" onChange={this.setMessageSecret.bind(this)}></input>
                        </div>                          
                    </div>                    
                    <div className="row">
                        <div class="col-sm-6">
                            <button type="button" onClick={this.claim.bind(this)} className="btn btn-primary">CLAIM</button>
                        </div>
                        <div class="col-sm-6">
                            <button type="button" onClick={this.withdraw.bind(this)} className="btn btn-primary">CASH IN</button>
                        </div>
                    </div>
                </div>
                
            )      
        }
    }

    async setMessageSecret(e) {
        this.setState(
          {
            secret : e.target.value
          }
        )
        //await this.signPayment(e.target.value);
        //console.log("first SECRET" + this.state.secret);
      }

    async setMessage(e) {
      this.setState(
        {
          message : e.target.value
        }
      )
    }
//
    async claim() {
        let MyEscrowContract = await this.getContractCC();
        let bobMessage = document.getElementById('sign').value;
        console.log('bobMessage = ' + bobMessage)
        await this.signPayment(bobMessage);

        console.log("SECRET = " + this.state.secret )
        var idchannel = document.getElementById('paymentchannelid').value;

        if(await this.verify(this.state.secret)){
            await MyEscrowContract.methods.channelClaim(
                idchannel,
                1, // Actual ammount
                1, // planned ammount
                this.state.secret,
                this.state.splittedSignatureOfhash.v,
                this.state.splittedSignatureOfhash.r,
                this.state.splittedSignatureOfhash.s,
                false,
                Alice,
                this.state.hashMessagePKSigned.signature
                ).send({from: Bob, gas: 6721975, gasPrice: 2000000}) // is sendback)
        }
        else {
            window.alert("not verified");
        }

        console.log("secret " + this.state.secret + " - " + " message" + this.state.message);
        this.displayContributionChannelBalances();
        document.getElementById('hash-comparison').innerHTML += 'Alice claimed 1' + '<br>';
    }

    async withdraw() {
        let MyEscrowContract = await this.getContractCC();
        await MyEscrowContract.methods.withdraw(1, this.state.account).send({from:Bob});
        document.getElementById('hash-comparison').innerHTML += 'Withdrawed: 1 <br>';
        this.displayContributionChannelBalances();

    }

    async getContract() {
        var web3 = new Web3("http://localhost:8545");
        var contractInfo = require('../contract-info/IDO.json');
        try {
            const networkId = await web3.eth.net.getId();
            var MyIdoContract = new web3.eth.Contract(
                contractInfo.abi,
                contractInfo.networks[networkId].address
            );
            return MyIdoContract;
        }
        catch (error) {
            console.log("error " + error);
        }
    }

    async getBalance(contractMethods) {
        var balance = 0;
        balance = await contractMethods.methods.balanceOf(this.state.account).call()
            .then(result => { return result });
        this.setState({
            balanceERC20: balance
        })
        return balance;
    }


    async getEthereumBalance(account) {
        const web3 = new Web3("http://localhost:8545");
        var bal = await web3.eth.getBalance(account);
        this.setState({ ethBalance: bal })
    }

    async initComponent() {
        try {
            let contractMethods = await this.getContract();

            const interval = setInterval(async () => {
                await this.getBalance(contractMethods);
            }, 5000);

        }
        catch (error) {
            console.log(error)
        }
    }
    async gethbalance() {
        try {
            let contractMethods = await this.getContract();

            const interval = setInterval(async () => {
                await this.getEthereumBalance(this.state.account);
            }, 5000);
        }
        catch (error) {
            console.log(error)
        }
    }

    existingChannel() {
        document.getElementById('openchannelbutton').disabled = true;
    }

    async componentDidMount() {
        try {
            this.initComponent();
            this.gethbalance();
            await this.loadBlockchainData();
            await this.displayContributionChannelBalances();
            var check = await this.checkForChannel();
            if(check){
                this.existingChannel();
            }
            //await this.signPayment();
        }
        catch (error) { console.log(error) }

    }

    static getDerivedStateFromProps(props, state) {
        return { account: props.account, balanceERC20: state.balanceERC20, ethBalance: state.ethBalance };
    }

    async sendMoney() {
        try {
            let contractMethods = await this.getContract();
            //console.log(this.state.to + " - " + this.state.account);
            await contractMethods.methods.transfer(this.state.to, this.state.amount).send({ from: this.state.account })
        }
        catch (error) {
            console.log(error)

        }
    }

    toAddress(e) {
        this.setState({ to: e.target.value });
    }

    amount(e) {
        this.setState({ amount: e.target.value });
    }

    shouldComponentUpdate(nextProps, nextState) {
        //Probleem was er werd alleen naar account gekeken (als balance update update account niet en is het false)
        //de || check was nodig om ook te kijken of balance is veranderd
        return this.state.account != nextProps.account || this.state.balanceERC20 != nextState.balanceERC20 || this.state.ethBalance != nextProps.ethBalance;
    }

    async getContractCC() {
        var web3 = new Web3("http://localhost:8545");
        var contractInfo = require('../contract-info/ContributionChannel.json');
        try {
            const networkId = await web3.eth.net.getId();
            var MyIdoContract = new web3.eth.Contract(
                contractInfo.abi,
                contractInfo.networks[networkId].address
            );
            return MyIdoContract;
        }
        catch (error) {
            console.log("error " + error);
        }
    }
    //async signPayment(groupid, nonce) {
    async signPayment(message) {
        const web3 = new Web3("http://localhost:8545");; 
    
        await this.hash(message);
        await this.PKSignedHash();
        await this.splittedSignatureOfhash();
    }

    async splittedSignatureOfhash() {
        let MyEscrowContract = await this.getContractCC();
        let splittedSignatureOfhash = await MyEscrowContract.methods.splitSignature(this.state.hashMessagePKSigned.signature).call()
        .then(result => { return result } );

        this.setState({
            splittedSignatureOfhash: splittedSignatureOfhash
        })

    }

    async PKSignedHash() {
        const web3 = new Web3("http://localhost:8545");

        let PKSignedHash = await web3.eth.accounts.sign(this.state.hash, PKBob);

        console.log("PKSignedHash is :");
        console.log(PKSignedHash);

        this.setState({
            hashMessagePKSigned: PKSignedHash
        })
    }

    async hash(message) {
        let MyEscrowContract = await this.getContractCC();
        let hash = await MyEscrowContract.methods.getMessageHash(Alice, 1, message, 1).call()
        .then(result => {return result});

        console.log("Hash is :");
        console.log(hash);

        this.setState({
            hash: hash
        })
    }

    async verify(message) {
        let MyEscrowContract = await this.getContractCC();

        let verify = await MyEscrowContract.methods.verify(Bob,Alice,1,message,1,this.state.hashMessagePKSigned.signature).call()
        .then(result => { return result } );
        console.log("Verify is :" + verify);
        return verify;
    }

    async addFunds() {
        let MyEscrowContract = await this.getContractCC();
        var idchannel = document.getElementById('paymentchannelid').value;

        if(idchannel <= 0 ){
            window.alert("Channel is not open");
            return;
        }

        await MyEscrowContract.methods.channelAddFunds(idchannel,1).send({from:Bob, gas: 6721975, gasPrice: 2000000}).then()
            .catch(error => console.log(error + " send"));

        await this.displayContributionChannelBalances();

        document.getElementById('hash-comparison').innerHTML += 'Alice made contribution ' + '<br>';
    }

    async checkForChannel() {
        let MyEscrowContract = await this.getContractCC();
        let idchannel = 0;

        var checkIfChannelExist = await MyEscrowContract.methods.getAddresToChannelId().call({from:Alice}).then(
            result => {return result} );

        if(checkIfChannelExist > 0) {
            idchannel = checkIfChannelExist;
            this.setState({
                idchannel: idchannel
            })
            document.getElementById('hash-comparison').innerHTML += 'Existing channel found: ' + idchannel + '<br>';
            document.getElementById('paymentchannelid').value = idchannel;
            return true;
        }
        //BOOKMARK
        return false;
    }

    async openChannelByThirdParty() {

        let MyEscrowContract = await this.getContractCC();
        var byte32 =  Web3.utils.fromAscii(1);
        let idchannel = 1;

        if(this.state.idchannel > 0) {
            console.log("IF CHANNEL IS NOT NULL \n " +this.state.message);
        }
        else {
            console.log("IF CHANNEL IS NULL \n" );
            console.log(" dit is gevuld" +this.state.message);
            await this.signPayment(this.state.message);

            await MyEscrowContract.methods.openChannelByThirdParty(
            Bob,
            Bob, // Ganache[0]
            Alice, // Ganache[1]
            byte32,  // groupId,
            0, //  Deposit value
            10000000, // expiration(in ms)
            1, //messageNonce
            this.state.message,
            this.state.splittedSignatureOfhash.v,
            this.state.splittedSignatureOfhash.r,
            this.state.splittedSignatureOfhash.s,
            this.state.hashMessagePKSigned.signature
            ).send({from:Bob, gas: 6721975, gasPrice: 2000000}).then()
            .catch(error => console.log(error + " send"));
            this.setState({
                channelid : idchannel
            })
        }

        document.getElementById('hash-comparison').innerHTML += 'Bob opened channel:' + idchannel + '<br>';
        document.getElementById('hash-comparison').innerHTML += 'HashedMessage: ' + this.state.hashMessagePKSigned.signature + '<br>';
        document.getElementById('paymentchannelid').value = idchannel;

        console.log(this.state.channelid + "channelid after open");

        this.existingChannel();
        await this.displayContributionChannelBalances();

    }

    async displayContributionChannelBalances() {
        let idchannel = 0;
            if(document.getElementById('paymentchannelid').value != "none"){
                idchannel = document.getElementById('paymentchannelid').value;
            }
          
            document.getElementById("balancePaymentchannel").innerHTML = 'Contribution for Channel : ' + await this.checkBalanceMPE(Bob).then(result => {return result})
            document.getElementById("balancePaymentchannel").innerHTML +='<br/> Channel claimable Balance: ' + await this.valueOfChannelID(idchannel).then(result => {return result})
            document.getElementById("balancePaymentchannel").innerHTML +='<br/> Claimable by Alice : ' + await this.checkBalanceMPE(Alice).then(result => {return result})
        }

    async depositToChannel() {
        try {
            let contractMethods = await this.getContractCC();
            await contractMethods.methods.deposit(1000).send({from: this.state.account }).then( () => console.log("deposited IDO from Bob to MPE: " + 1));
            await this.displayContributionChannelBalances();
            document.getElementById('hash-comparison').innerHTML += 'Bob deposit 1000 channel' + '<br>';
        }
        catch(e){
            throw e
        }
    }

    async checkBalanceMPE(address) {
        try {
            let contractMethods = await this.getContractCC();
            let i = await contractMethods.methods.balances(address).call();
            return i ;
        }
        catch(e){
            throw e
        }
    }

    async valueOfChannelID(idchannel) {
        try {
            let contractMethods = await this.getContractCC();
            let i = await contractMethods.methods.channels(idchannel).call();
            return i.value ;
        }
        catch(e){
            throw e
        }
    }

    render() {
        return (
            <div className="container">
                <h1>PaymentZB</h1>
                <p>Tokens: {this.state.balanceERC20} </p>
                <p>ETH: {this.state.ethBalance} </p>
                { this.getInput() }
                <div className="form-group">
                    {this.getButtons()}
                </div>
            </div>
        )
    };

}