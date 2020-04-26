pragma solidity ^0.6.3;

contract SwapContract
{
    struct transaction
    {   
        uint transactionId; 
        uint fundValue;
        address payable owner;
        bool status;
        address payable receiver;
        bool verified;
        uint startTime;
        bool refunded;
        address payable expected;
    }

    uint256 currentTransactionId = 0;
    event fundReceived(uint _currentTransactionId);
    event fundChecked(uint _fundValue, address payable _owner,bool _status,address payable _receiver, bool _verified, bool _refunded);
    event detailsFetched(uint _fundValue, address payable _owner,bool _status,address payable _receiver, bool _verified, bool _refunded,address payable _expected);
    mapping(uint256 => transaction) public transactions;
    
    function sendFunds(address payable _receiver,address payable _expectedAddress) public payable
    {
        require(msg.value>0,"No money Sent");
        transactions[currentTransactionId] = transaction(currentTransactionId, msg.value, msg.sender, false,_receiver,false,now,false,_expectedAddress);
        emit fundReceived(currentTransactionId);
        currentTransactionId++;
    }
    
    function checkFunds(uint256 _transactionId) public
    {
        require(msg.sender==transactions[_transactionId].owner || msg.sender==transactions[_transactionId].receiver, "You are not Authorised");
        emit fundChecked(transactions[_transactionId].fundValue, transactions[_transactionId].owner, 
        transactions[_transactionId].status,transactions[_transactionId].receiver, transactions[_transactionId].verified,transactions[_transactionId].refunded);
    }
    
    function verifyFunds(uint256 _transactionId) public
    {
        require(msg.sender == transactions[_transactionId].receiver || msg.sender == transactions[_transactionId].expected, "You are not Authorised");
        require(transactions[_transactionId].verified==false,"Transaction already verified");
        require(transactions[_transactionId].startTime + 900 >= now ,"Now you can only ask for Refunds.");
        transactions[_transactionId].verified = true;
        
        transactions[_transactionId].receiver.transfer(transactions[_transactionId].fundValue);
        transactions[_transactionId].status = true;
        transactions[_transactionId].fundValue = 0;
    }

    function getDetails(uint256 _transactionId) public{
        emit detailsFetched(transactions[_transactionId].fundValue, transactions[_transactionId].owner, 
        transactions[_transactionId].status,transactions[_transactionId].receiver, transactions[_transactionId].verified,transactions[_transactionId].refunded,transactions[_transactionId].expected);
    }
    
    function initiateRefunds(uint256 _transactionId) public
    {
        require(transactions[_transactionId].owner==msg.sender, "You are not Authorised");
        require(transactions[_transactionId].status==false,"Transaction already done");
        require(transactions[_transactionId].refunded==false,"Transaction already refunded");
        require(transactions[_transactionId].fundValue>0,"Not enough funds");
        require(transactions[_transactionId].startTime + 900 < now ,"Refund can only be initiated after 5 mins of Transaction");
        transactions[_transactionId].owner.transfer(transactions[_transactionId].fundValue);
        transactions[_transactionId].fundValue = 0;
        transactions[_transactionId].refunded=true;
    }
}