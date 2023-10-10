const Dice = artifacts.require("Dice");
const DiceBattle = artifacts.require("DiceBattle");
const DiceMarket = artifacts.require("DiceMarket");

module.exports = function(deployer, networks, accounts) {
  let diceInstance;
  deployer.then(() => {
    return deployer.deploy(Dice, {overwrite: false});
  }).then(_diceInstance => {
    diceInstance = _diceInstance;
    console.log("Dice contract at address=" + diceInstance.address);
    return deployer.deploy(DiceBattle, diceInstance.address, {from: accounts[0], overwrite: false});
  }).then(diceBattleInstance => {
    console.log("DiceBattle contract at address=" + diceBattleInstance.address);
    return deployer.deploy(DiceMarket, diceInstance.address, 200000000000000, {from: accounts[0], overwrite: false});
  }).then(diceMarketInstance => {
    console.log("DiceMarket contract at address=" + diceMarketInstance.address);
  })
};
