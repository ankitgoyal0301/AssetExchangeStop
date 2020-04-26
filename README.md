# Asset Exchange Stop

## Prerequisites :-
- Node.js should be installed.
- ***“npm i -g truffle”*** command must have been run previously.

## INSTRUCTIONS : -
- Download the git repository.
- Delete the ***"package-lock.json"*** file.
- Open cmd/windows powershell in same directory and run ***“npm install”***.
- In case of any ERROR, try again and again deleting the partially created ***"node_modules"*** folder and ***"package-lock.json"***.( in case they are created)
- If error persists, try changing proxy settings of your computer (this hack may work).
- When everything is successfully installed, run ***“npm run start”*** in the same directory.
(Hopefully site will launch)

## WORKING :-
### Lets understand by an example:
Suppose User A wants to send ether from his wallet on Kovan to his wallet on Ropsten.
And User B wants to send ether from his wallet on Ropsten to his wallet on Kovan.
As they cannot do this, so they will help each other.
So A will send to B’s account on Kovan and B will send to A’s account on Ropsten.
The website will detect the account and network from Metamask.
Metamask automatically detects network change and site reloads but if you only change account selected then it is mandatory to refresh the page or else all transactions will fail.

### SENDING PROCESS :
• 4 smart contracts are already deployed on 4 blockchains and website connects to them automatically.
• The Users decide the amount of ether to send , exchange wallet addresses, agree on a consensus key and exchange e-mails.(This has to be done offline).
• A will now send 0.1 Eth(suppose) from his/her Account 1 on Kovan to smart contract of Kovan. (He/she will select Kovan network on Metamask and then the account from which to send).
• Similarly B will send 0.1 Eth from Account 1’ on Ropsten to Ropsten smart contract.
• All fields must be properly filled as directed on the webpage.
• Proper checks are there to check whether entered information is correct.
• Once the sending is successful, users will be assigned a transaction id.
• Remember it, next a mail sending pop up will open (if pop ups are not disabled) and user has to enter the details asked by it.
• Now both users can check the status of the transaction done by both of them (sender and receiver accounts both are allowed to check).
• Transaction Verification has to be done in 15 minutes.
• After 15 minutes, only refund can be claimed by the sending user (obviously from the account and network from which he/ she had sent the funds).

![](example.png)

### VERIFICATION PROCESS :
• Any user can verify both transactions.
• A can verify only by changing network to other blockchain (in this case Ropsten ) and through the account A had told B to send funds for.
• Same case is with B , can verify only on Kovan blockchain and using same account he had told A to send funds on.
• Lets suppose A will verify.
• A will change Metamask network to Ropsten and select account 2.
• He/she will fill the said details correctly.
• Then The transaction will be successfully verified and both will receive money.
OTHER PROCESSES ARE QUITE CLEAR.
