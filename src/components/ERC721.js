import React, { Component } from 'react';
import Web3 from 'web3';
import './css/BalancesERC20.css';

export default class ERC721 extends Component {

    constructor(props) {
        super(props)
        this.state = { ethBalance: 0, balanceERC20: props.balanceERC20, account: props.account, to: "", amount: 0 }
    }

    async getContract() {
        var web3 = new Web3("http://localhost:8545");
        var contractInfo = require('../contract-info/IDO.json');
      //  console.log(contractInfo.abi + " hallo");
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

    async componentDidMount() {
        try {
            this.initComponent();
            this.gethbalance();
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

    render() {
        return (
            <div className="container">
                <h1>ERC721</h1>
                <p>Tokens: {this.state.balanceERC20} </p>
                <p>ETH: {this.state.ethBalance} </p>
                <div className="form-group">
                    <label>To:</label>
                    <input className="form-control" type="input" onChange={this.toAddress.bind(this)}></input>
                </div>
                <div className="form-group">
                    <label>Amount:</label>
                    <input className="form-control" type="input" onChange={this.amount.bind(this)}></input>
                </div>
                <div className="form-group">
                    <button type="button" onClick={this.sendMoney.bind(this)} className="btn btn-primary">SEND TO MPE</button>
                </div>
            </div>
        )
    };

}