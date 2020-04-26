const SwapContract = artifacts.require("SwapContract");

module.exports = function(deployer) {
  deployer.deploy(SwapContract);
};
