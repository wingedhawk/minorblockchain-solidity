import React, { Component } from 'react'
import Web3 from 'web3'
import BalancesERC20 from './BalancesERC20'
import ErrorPage from './404'
import ERC721 from './ERC721'
import Paymentzb from './Paymentzb'
import Paymentmb from './Paymentmb'
import './App.css'
import Image from 'react-bootstrap/Image'
import Dropdown from 'react-bootstrap/Dropdown';

class App extends Component {
  _isMounted = false;

  componentWillMount() { //deprecated
    this._isMounted = true;
    this.loadBlockchainData();
    this.loadEthereumBalance();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  changePageState(e){
    this.setState({ page: e.target.value });
    this.getPage();
  }

  
  getPage() {
    switch(this.state.page){
      case 'transfer':  {return {'left':<BalancesERC20 balanceERC20={0} account={this.state.account}/>, 'right':<BalancesERC20 balanceERC20={0} account={this.state.account2}/>} }
      case 'paymentzb': {return {'left':<Paymentzb role="payer" balanceERC20={0} account={this.state.account}/>, 'right':<Paymentzb role="receiver" balanceERC20={0} account={this.state.account2}/>} }
      case 'paymentmb': {return {'left':<Paymentmb role="payer" balanceERC20={0} account={this.state.account}/>, 'right':<Paymentmb role="receiver" balanceERC20={0} account={this.state.account2}/>} }
      case 'erc721':    {return {'left':<ERC721 balanceERC20={0} account={this.state.account}/>, 'right':<ERC721 balanceERC20={0} account={this.state.account2}/>} }
      default: {return <ErrorPage/>}
    }
  }  

  getPaymentChannel() {
    switch(this.state.page){
      case 'paymentzb':
        { return  (<div>
                      <h1>BALANCE PAYMENTCHANNEL</h1>
                      <div id="balancePaymentchannel">Balance</div>
                      Channel: <input value="none" id="paymentchannelid" disabled></input>
                   </div> 
                  )
        }

      case 'paymentmb': 
        {return (<div>
                    <div className="form-group row">
                        <label for="buffered" className="col-sm-3 col-form-label">Buffered amount:</label>
                        <div class="col-sm-9">
                            <input className="form-control" type="input" id="buffered" value="0" disabled></input>
                        </div>
                    </div>                                       
                      <h1>BALANCE PAYMENTCHANNEL</h1>
                      <div id="balancePaymentchannel">Balance</div>
                      Channel: <input value="none" id="paymentchannelid" disabled></input>
                </div>)
      }
      default: {return ''}
    }    
  }

  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:8545");
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0], account2: accounts[1] })
  }

  resetField() {
    document.getElementById('hash-comparison').innerHTML = '';
  }

  async loadEthereumBalance(address) {
    const web3 = new Web3("http://localhost:8545");
    const accounts = await web3.eth.getAccounts()
    var bal = await web3.eth.getBalance(accounts[0]);
    var bal2 = await web3.eth.getBalance(accounts[1]);
    this.setState({ accountBalance: bal, accountBalance2: bal2})
    return bal
  }

  constructor(props) {
    super(props)
    this.state = { account: '', account2: '', accountBalance: 0, accountBalance2: 0, page:"transfer"}
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 address">
            <h1>Bob</h1>
            <b>Your account address: {this.state.account}</b>
            <p>BEGIN ETH: {this.state.accountBalance}</p>
            {this.getPage().left}
          </div>
          <div className="col-md-4 address">
            <h1>Functions</h1>
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Function</label>
              <select className="form-control" id="exampleFormControlSelect1" onChange={this.changePageState.bind(this)} value={this.state.page}>
                <option value="transfer">Transfer</option>
                <option value="paymentzb">Paymentchannel without buffer</option>
                <option value="paymentmb">Paymentchannel with buffer</option>
                <option value="erc721">ERC721</option>
              </select>
            </div>
            {this.getPaymentChannel()}
          </div>
          <div className="col-md-4 address">
            <h1>Alice</h1>
            <b>Your account address: {this.state.account2}</b>
            <p>BEGIN ETH: {this.state.accountBalance2}</p>
            {this.getPage().right}
          </div>
        </div>
        <div className="row">
          <h3>LOG:</h3>
        </div>
        <div className="row">
          <button className="btn btn-primary" onClick={this.resetField.bind(this)}>Reset log</button>
        </div>
        <div id="log" className="row">
          <div>
            <div id="hash-comparison" className="col-md-12"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;