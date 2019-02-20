var CryptoPass = artifacts.require("./CryptoPass.sol");

module.exports = function (deployer) {
    deployer.deploy(CryptoPass);
};
