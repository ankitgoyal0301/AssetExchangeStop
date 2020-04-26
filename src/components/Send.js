import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import SwapContract from "../abis/SwapContract.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'identicon.js'
import  Home from "./Home"
import  Check from "./Check"
import  Verify from"./Verify"
import  Refund from "./Refund"


class Send extends Component {


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

  sendFunds=(amount, address, expectedAddress)=>{
    this.setState({ loading: true })
    var pointCount=0;
    for(var i=0;i< amount.length; i++) {
      if(!((amount[i]>='0' && amount[i]<='9')||amount[i]==='.')){
        window.alert("Invalid Amount Entered")
        this.setState({loading:false})
        return;
      }
      if(amount[i]==='.'){
        pointCount++;
        if(pointCount>1){
          window.alert("Invalid Amount Entered")
          this.setState({loading:false})
          return;
        }
      }
    }
    if(address.length===42 && address[0]==='0' && address[1]==='x'){
      for(i=2;i<42;i++){
        if(!((address[i]>='0'&&address[i]<='9') || (address[i]>='a' && address[i]<='f') || (address[i]>='A' && address[i]<='F'))){
          window.alert("Invalid Address Entered")
          this.setState({loading:false})
          return;
        }
      }
    }else{
      window.alert("Invalid Address Entered")
      this.setState({loading:false})
      return;
    }

    if(expectedAddress.length===42 && expectedAddress[0]==='0' && expectedAddress[1]==='x'){
      for(i=2;i<42;i++){
        if(!((expectedAddress[i]>='0'&&expectedAddress[i]<='9') || (expectedAddress[i]>='a' && expectedAddress[i]<='f') || (expectedAddress[i]>='A' && expectedAddress[i]<='F'))){
          window.alert("Invalid Expected Address Entered")
          this.setState({loading:false})
          return;
        }
      }
    }else{
      window.alert("Invalid Expected Address Entered")
      this.setState({loading:false})
      return;
    }

    amount = window.web3.utils.toWei(amount.toString(),'Ether')
    this.state.swapcontract.methods.sendFunds(address,expectedAddress).send({ from: this.state.account , value:amount}).then(result => 
    {
      window.alert("Your Unique Transaction Id is : "+ result.events.fundReceived.returnValues._currentTransactionId)
      window.open("file.html")
      this.setState({loading:false})
    },e=>{
      window.alert("Transaction Failed")
      this.setState({loading:false})
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
                  <button className="btn btn-secondary btn-sm mx-3 " onClick={this.renderSend}>Send</button>
                  <button className="btn btn-primary btn-sm mx-3" onClick={this.renderCheck}>Check</button>
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
                <h1 className="mt-2 text-danger" align="center" ><strong>You Are Transferring On {this.getNetworkName()} Blockchain</strong></h1> 
                {   
                  this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  :
                  <div>
                    <h3 className="text-secondary mt-5 mb-3">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>Transfer Your Funds</strong>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h3>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      const amount = this.fundAmount.value
                      const address = this.addressOfReceiver.value
                      const expectedAddress = this.expectedAddress.value
                      this.sendFunds(amount, address, expectedAddress)
                    }}>
                      <div className="form-group my-4">
                        <input id="fundAmount" className="form-control" type="text" placeholder="Amount Of Funds You Want To Send (in Ether)" 
                          ref={(input) => { this.fundAmount = input }} required />
                      </div>
                      <div className="form-group my-4">
                        <input id="addressOfReceiver" className="form-control" type="text" placeholder="Address Of Receiver Wallet - On The Same Network You Are Transferring From"
                          ref={(input) => { this.addressOfReceiver = input }} required />
                        <small className="form-text text-muted">Receiver Address On Same Network That They Asked You To Send Funds On</small>
                      </div>
                      <div className="form-group my-4">
                        <input id="expectedAddress" className="form-control" type="text" placeholder="Address Of Your Wallet On The Other Network That You Expect The Funds On"
                          ref={(input) => { this.expectedAddress = input }} required />
                        <small className="form-text text-muted">The Other Person Is Expected To Send The Funds On This Address On Other Network</small>
                      </div>
                      <button style = {{fontSize:20}} className = "btn btn-primary btn-sm my-4">Send Funds</button>
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

export default Send;