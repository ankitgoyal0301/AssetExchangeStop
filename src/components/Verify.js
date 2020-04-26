import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import SwapContract from "../abis/SwapContract.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'identicon.js'
import  Send from "./Send"
import  Check from "./Check"
import  Home from"./Home"
import  Refund from "./Refund"


function myFunctionKeyShow(){

  var x = document.getElementById("privateKey");
    if (x.type === "password"){
      x.type = "text";
    } else{
      x.type = "password";
    }
}


class Verify extends Component {

  renderHome(){
    ReactDOM.render(<Home />, document.getElementById('root'));
  }

  renderSend(){
    ReactDOM.render(<Send />, document.getElementById('root'));
  }
  renderCheck(){
    ReactDOM.render(<Check />, document.getElementById('root'));
  }

  renderVerify(){
    ReactDOM.render(<Verify />, document.getElementById('root'));
  }
  renderRefund(){
    ReactDOM.render(<Refund />, document.getElementById('root'));
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    var web3 = window.web3
    var accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    var networkId = await web3.eth.net.getId()
    this.setState({networkId})
    var networkData = SwapContract.networks[networkId]
    if(networkData) {
      var swapcontract = new web3.eth.Contract(SwapContract.abi, networkData.address)
      this.setState({ swapcontract })
      this.setState({ loading: false})
    } else {
      window.alert('SwapContract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true,
    }
    this.verifyFunds = this.verifyFunds.bind(this)
  }

  async verifyFunds(transactionId,mytransactionId,privateKey){

    var myNetwork = document.getElementById("sel").options[document.getElementById("sel").selectedIndex].value

    this.setState({ loading: true })

    for(var i=0;i< transactionId.length;i++){
      if(!(transactionId[i]>='0' && transactionId[i]<='9')){
        window.alert("Other Transaction Id is Invalid")
        this.setState({ loading: false })
        return;
      }
    }

    for(i=0;i< mytransactionId.length;i++){
      if(!(mytransactionId[i]>='0' && mytransactionId[i]<='9')){
        window.alert("Your Transaction Id is Invalid")
        this.setState({ loading: false })
        return;
      }
    }

    if(privateKey.length!==64){
      window.alert("Invalid Private Key")
      this.setState({loading:false})
      return;
    }else{
      for(i=0;i<64;i++){
        if(!((privateKey[i]>='0'&&privateKey[i]<='9') || (privateKey[i]>="A"&& privateKey[i]<='F'))){
          window.alert("Invalid Private Key")
          this.setState({loading:false})
          return;
        }
      }
    }

    var Transaction = require('ethereumjs-tx').Transaction;
    var pk = Buffer.from(privateKey, 'hex');

    var res1;
    var swapcontract2;
    var res2;
    res1 = await this.state.swapcontract.methods.getDetails(transactionId).send({from:this.state.account})
    res1 = res1.events.detailsFetched.returnValues
    var account2
    console.log(this.state.swapcontract)
    var web3;
    if(myNetwork==="Ropsten"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/bfc42eec50c8437c93c61da57df136db"));
      swapcontract2 = new web3.eth.Contract(SwapContract.abi,SwapContract.networks[3].address);
      account2 = SwapContract.networks[3].address;

    }
    else if(myNetwork==="Rinkeby"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/bfc42eec50c8437c93c61da57df136db"));
      swapcontract2 = new web3.eth.Contract(SwapContract.abi,SwapContract.networks[4].address);
      account2 = SwapContract.networks[4].address;

    }
    else if(myNetwork === "Kovan"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/bfc42eec50c8437c93c61da57df136db"));
      swapcontract2 = new web3.eth.Contract(SwapContract.abi,SwapContract.networks[42].address);
      account2 = SwapContract.networks[42].address;

    }
    else if(myNetwork === "Goerli"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/bfc42eec50c8437c93c61da57df136db"));
      swapcontract2 = new web3.eth.Contract(SwapContract.abi,SwapContract.networks[5].address);
      account2 = SwapContract.networks[5].address;

    }
    console.log(web3)
    console.log(swapcontract2)
    
    var account1 = this.state.account;
    var contractFunction = swapcontract2.methods.getDetails(mytransactionId);
    var functionAbi = contractFunction.encodeABI();

    var txCount = await web3.eth.getTransactionCount(account1)
    console.log(txCount)

    // Transaction
     var txObject = {
        nonce:    web3.utils.toHex(txCount),
        to:       account2,
        data:     functionAbi,
        gasLimit: web3.utils.toHex(2100000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
     }

    // Sign the transaction
    var tx;
    if(myNetwork === "Ropsten"){
      tx = new Transaction(txObject, { chain: 'ropsten', hardfork: 'istanbul' })
    }
    if(myNetwork === "Rinkeby"){
      tx = new Transaction(txObject, { chain: 'rinkeby', hardfork: 'istanbul' })
    }
    if(myNetwork === "Kovan"){
      tx = new Transaction(txObject, { chain: 'kovan', hardfork: 'istanbul' })
    }
    if(myNetwork === "Goerli"){
      tx = new Transaction(txObject, { chain: 'goerli', hardfork: 'istanbul' })
    }


    tx.sign(pk)

    var serializedTx = tx.serialize()
    var raw = '0x' + serializedTx.toString('hex')
    console.log(raw)

     // Broadcast the transaction
    var eventAbi = SwapContract.networks[42]['events']["0x1f76c16a84b1d4bde3f2292acef46f099609f501370b1be0a5eed0a900a7c1ae"]["inputs"]
    var receipt = await web3.eth.sendSignedTransaction(raw)
    console.log(receipt)
    res2 = web3.eth.abi.decodeLog(eventAbi,receipt.logs[0].data,receipt.logs[0].topics)
    console.log(res1)
    console.log(res2)

    if(res1._receiver !== this.state.account)
    {
      window.alert("You are not the Authorised Receiver")
      this.setState({loading:false})
      return;
    }

    else if(this.state.account !== res2._expected)
    {
      window.alert("You are not the Authorised Verifier")
      this.setState({loading:false})
      return;
    }
    else if(res1._expected !== res2._receiver)
    {
      window.alert("Addresses Don't Match")
      this.setState({loading:false})
      return;
    }
    else if(res1._status !== false || res2._status !== false)
    {
      window.alert("Transaction already complete")
      this.setState({loading:false})
      return;
    }
    else if(res1._refunded !== false || res2._refunded !== false)
    {
      window.alert("Transaction already refunded")
      this.setState({loading:false})
      return;
    } 
    else if(res1._verified !== false || res2._verified !== false)
    {
      window.alert("Transaction already verified")
      this.setState({loading:false})
      return;
    }
    else if(res1._fundValue !== res2._fundValue)
    {
      window.alert("Funds Don't Match")
      this.setState({loading:false})
      return;
    }
    else
    {    
      functionAbi = swapcontract2.methods.verifyFunds(mytransactionId).encodeABI();
      txCount = await web3.eth.getTransactionCount(account1)
      console.log("1")

      txObject = {
        nonce:    web3.utils.toHex(txCount),
        to:       account2,
        data:     functionAbi,
        gasLimit: web3.utils.toHex(2100000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
     }

       if(myNetwork === "Ropsten"){
          tx = new Transaction(txObject, { chain: 'ropsten', hardfork: 'istanbul' })
        }
        if(myNetwork === "Rinkeby"){
          tx = new Transaction(txObject, { chain: 'rinkeby', hardfork: 'istanbul' })
        }
        if(myNetwork === "Kovan"){
          tx = new Transaction(txObject, { chain: 'kovan', hardfork: 'istanbul' })
        }
        if(myNetwork === "Goerli"){
          tx = new Transaction(txObject, { chain: 'goerli', hardfork: 'istanbul' })
        }

        tx.sign(pk)

        serializedTx = tx.serialize()
        raw = '0x' + serializedTx.toString('hex')
        console.log("2")
        var receipt2 = await web3.eth.sendSignedTransaction(raw)
        console.log(receipt2)
        console.log("3")
        if(receipt2.status){
          // this.state.swapcontract.methods.verifyFunds(transactionId).send({from:this.state.account}).then(res=>{
          //     window.alert("Verification Successful - Transaction Done")
          //     this.setState({loading:false})
          //     return
          //   },e=>{
          //     window.alert("Verification Failed - Transaction Aborted")
          //     this.setState({loading:false})
          //     return
          //   })

          web3 = window.web3
          functionAbi = this.state.swapcontract.methods.verifyFunds(transactionId).encodeABI();
          txCount = await web3.eth.getTransactionCount(account1)

          txObject = {
              nonce:    web3.utils.toHex(txCount),
              to:       SwapContract.networks[this.state.networkId].address,
              data:     functionAbi,
              gasLimit: web3.utils.toHex(2100000),
              gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
          }

           if(this.getNetworkName() === "Ropsten"){
              tx = new Transaction(txObject, { chain: 'ropsten', hardfork: 'istanbul' })
            }
            if(this.getNetworkName() === "Rinkeby"){
              tx = new Transaction(txObject, { chain: 'rinkeby', hardfork: 'istanbul' })
            }
            if(this.getNetworkName() === "Kovan"){
              tx = new Transaction(txObject, { chain: 'kovan', hardfork: 'istanbul' })
            }
            if(this.getNetworkName() === "Goerli"){
              tx = new Transaction(txObject, { chain: 'goerli', hardfork: 'istanbul' })
            }

            tx.sign(pk)

            serializedTx = tx.serialize()
            raw = '0x' + serializedTx.toString('hex')
            receipt2 = await web3.eth.sendSignedTransaction(raw)
            console.log(receipt2)
            console.log("4")
            if(receipt2.status){
              window.alert("Verification Successful - Transaction Done")
              this.setState({loading:false})
              return
            }
            else{
              window.alert("Verification Failed - Transaction Aborted")
              this.setState({loading:false})
              return
            }
        }
    }
  }

  getNetworkName(){
    if(this.state.networkId === 3){
      return "Ropsten"
    }if(this.state.networkId === 42){
      return "Kovan"
    }if(this.state.networkId === 4){
      return "Rinkeby"
    }if(this.state.networkId === 5){
      return "Goerli"
    }if(this.state.networkId === 5777){
      return "Ganache"
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="http://localhost:3000/">
            <img src="a.jpg" width="60" height="50" alt="ETHEREUM EXCHANGE"/>
          </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <button className="btn btn-primary btn-sm mx-3" onClick={this.renderHome}>Home</button>
                  <button className="btn btn-success btn-sm mx-3 " onClick={this.renderSend}>Send</button>
                  <button className="btn btn-primary btn-sm mx-3" onClick={this.renderCheck}>Check</button>
                  <button className="btn btn-secondary btn-sm mx-3" onClick={this.renderVerify}>Verify/Receive</button>
                  <button className="btn btn-success btn-sm mx-3" onClick={this.renderRefund}>Refund</button>
                </div>
            </div>  
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <span className='text-white' id="account">{this.state.account}</span>
              </li>
            </ul>
            { 
              this.state.account ? <img className="ml-2" width='30' height='30' src={`data:image/png ; base64,${new Identicon(this.state.account, 30).toString()}`} alt="Identicon"/>: <span></span>
            }
        </nav>
        <div className="container">
          <div className="row">
            <main role="main" className="col-lg-12 my-3 text-center">
              <div className="content mr-auto ml-auto colour-red">
                <h1 className="mt-2 text-danger" align="center" ><strong>You Are Verifying On {this.getNetworkName()} Blockchain</strong></h1> 
                {   
                  this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading... If You Started A transaction Please Don't Refresh or Close The Browser</p></div>
                  :
                  <div>
                    <h4 className="text-secondary mt-5 mb-4">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>Verify and Receive Funds</strong>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h4>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      var transactionId = this.transactionId.value
                      var mytransactionId = this.mytransactionId.value
                      var privateKey = this.privateKey.value
                      this.verifyFunds(transactionId,mytransactionId,privateKey)
                    }}>
                      <div className="form-group mr-sm-2 my-4">
                        <input
                          id="transactionId"
                          type="text"
                          ref={(input) => { this.transactionId = input }}
                          className="form-control"
                          placeholder="Enter Other Person's Transaction Id"
                          required />
                      </div>
                      <div className="form-group mr-sm-2 my-4">
                        <input
                          id="mytransactionId"
                          type="text"
                          ref={(input) => { this.mytransactionId = input }}
                          className="form-control"
                          placeholder="Enter Your Transaction Id - Id You were given when you performed the Transaction"
                          required />
                      </div>
                      <div className="form-group my-4" align="left">
                        <label>Select Your Transaction Network (Network You Did The Transaction On)</label>
                        <select className="form-control" id="sel">
                          <option>Rinkeby</option>
                          <option>Ropsten</option>
                          <option>Kovan</option>
                          <option>Goerli</option>
                        </select>
                      </div>
                      <div className="form-group mr-sm-2 my-2">
                        <input
                          id="privateKey"
                          type="password"
                          ref={(input) => { this.privateKey = input }}
                          className="form-control"
                          placeholder="Enter Your Private Key Of The Account You are Currently On"
                          required />
                          <small className="form-text text-muted">We Don't Store Your Private Key - It Is Totally Safe</small>
                      </div>
                      <div className="container" align="left">
                        <input id="keyShow"
                          type="checkbox"
                          onClick={(e)=> {myFunctionKeyShow(e)}}
                          /> &nbsp;<font size="3" face="Comic Sans">See Private Key</font>
                      </div>
                      <button
                        style = {{fontSize:20}} 
                        className = "btn btn-warning btn-sm mt-4">
                          Verify Funds And Receive
                      </button>
                    </form>
                    <hr/>
                  </div>
                }
              </div>
            </main>
          </div>
        </div>  
        <footer className="page-footer font-small blue">
          <div className="footer-copyright text-center py-3 fixed-bottom">
            <p>© 2020 Copyright: Developed Through Trust</p>
          </div>  
        </footer> 
      </div>
    );
  }
}

export default Verify;
