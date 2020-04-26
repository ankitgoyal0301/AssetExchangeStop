import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import SwapContract from "../abis/SwapContract.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'identicon.js'
import  Send from "./Send"
import  Home from "./Home"
import  Verify from"./Verify"
import  Refund from "./Refund"


class Check extends Component {

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
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    this.setState({networkId})
    const networkData = SwapContract.networks[networkId]
    if(networkData) {
      const swapcontract = new web3.eth.Contract(SwapContract.abi, networkData.address)
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
  }

  checkFunds=(transactionId)=>{

    this.setState({ loading: true })
    for(var i=0; i< transactionId.length;i++){
      if(!(transactionId[i]>='0' && transactionId[i]<='9')){
        window.alert("Wrong Transaction Id")
        this.setState({loading:false})
        return;
      }
    }

    this.state.swapcontract.methods.checkFunds(transactionId).send({from:this.state.account}).then(result=>
    {
      result = result.events.fundChecked.returnValues
      window.alert("The Fund Value id "+ window.web3.utils.fromWei(result._fundValue.toString(), 'ether')+" ETH\n\n"+
      "The Owner Address is  "+ result._owner+"\n\n"+
      "The Receiver Address is "+ result._receiver+"\n\n"+
      "The Verification Status is "+ result._verified+"\n\n"+
      "The Transferring Status is "+ result._status+"\n\n"+
      "The Refund Status is "+ result._refunded)
      this.setState({loading : false})
    },e=>{
      window.alert("You are Not Authorised")
      this.setState({loading : false})
    })

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
                  <button className="btn btn-success btn-sm mx-3" onClick={this.renderSend}>Send</button>
                  <button className="btn btn-secondary btn-sm mx-3" onClick={this.renderCheck}>Check</button>
                  <button className="btn btn-danger btn-sm mx-3" onClick={this.renderVerify}>Verify/Receive</button>
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
                <h1 className="mt-2 text-danger" align="center" ><strong>You Are Checking On {this.getNetworkName()} Blockchain</strong></h1> 
                {   
                  this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  :
                  <div>
                    <h3 className="text-secondary mt-5 mb-3">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                      <strong>Check Status Of Your Transaction</strong>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h3>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      const transactionId = this.transactionId.value
                      this.checkFunds(transactionId)
                    }}>
                      <div className="form-group mr-sm-2 my-4">
                        <input
                          id="transactionId"
                          type="text"
                          ref={(input) => { this.transactionId = input }}
                          className="form-control"
                          placeholder="Enter Transaction Id"
                         required />
                      </div>
                      <button
                        style = {{fontSize:20}} 
                        className = "btn btn-warning btn-sm mt-3">
                          Check Funds
                        </button>
                      </form>
                      <hr/>
                  </div>
                }
              </div>
            </main>
		      </div>
        </div>  
        <footer className="page-footer font-small blue" >
        	<div className="footer-copyright text-center py-3 fixed-bottom">
              <p>© 2020 Copyright: Developed Through Trust</p>
          </div>  
        </footer> 
      </div>
    );
  }
}

export default Check;
