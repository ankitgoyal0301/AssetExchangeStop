import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import  Send from "./Send"
import  Check from "./Check"
import  Verify from"./Verify"
import  Refund from "./Refund"


class Home extends Component{

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

	render(){
		return(
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
				      		<button className="btn btn-secondary btn-sm mx-3" onClick={this.renderHome}>Home</button>
				      		<button className="btn btn-success btn-sm mx-3" onClick={this.renderSend}>Send</button>
				      		<button className="btn btn-primary btn-sm mx-3" onClick={this.renderCheck}>Check</button>
				      		<button className="btn btn-danger btn-sm mx-3" onClick={this.renderVerify}>Verify/Receive</button>
				      		<button className="btn btn-success btn-sm mx-3" onClick={this.renderRefund}>Refund</button>
				    	</div>
				  	</div>	
				</nav>
				<div className="jumbotron" >
				  <h1 className="display-4"><strong>ASSET EXCHANGE STOP</strong>	</h1>
				  <p className="blockquote">This is a one stop solution for Ethereum Blockchain Interoperability</p>
				  <hr className="my-4"/>
				  <h4>The Future of Cross Chain Coin Swaps</h4>
				   <a className="btn btn-primary btn-lg" href="https://cointelegraph.com/explained/blockchain-interoperability-explained" rel="noopener noreferrer" role="button" target="_blank">Learn more</a>
				</div>
				<h5 align="center">DEVELOPERS:</h5>
				<div className="container" align="center">
					<img src="ankit.jpg" className="rounded-circle mx-5 img-responsive" width="200" height="200" alt="Dev"/>
					&emsp;&emsp;&emsp;&emsp;
					<img src="me.jpeg" className="rounded-circle mx-5 img-responsive" width="200" height="200" alt="Dev"/>
				</div>
				<div className="container" align="center">
					<span className="mx-5 py-5"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ANKIT GOYAL&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</strong></span>
					<span className="mx-5 py-5"><strong>&nbsp;&nbsp;SHIVAM RAINA</strong></span>
				</div>
				<footer className="page-footer font-small blue">
					<div className="footer-copyright text-center py-3">
						<p>© 2020 Copyright: Developed Through Trust</p>
					</div>	
				</footer>
			</div>
		);
	}
}
export default Home;