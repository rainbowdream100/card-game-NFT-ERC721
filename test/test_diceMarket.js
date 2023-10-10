var Dice = artifacts.require('./Dice.sol');
var DiceMarket = artifacts.require('./DiceMarket.sol');
//BN = require('bn.js');

contract('DiceMarket', function(accounts) {
  let diceInstance;
  let diceMarketInstance;
  let diceId1;
  let price = web3.utils.toWei('0.25', 'ether');

  before(async () => {
    diceInstance = await Dice.deployed();
    diceMarketInstance = await DiceMarket.deployed();

    //create a new dice belonging to accounts[0]
    diceId1 = await diceInstance.numDices.call();
    diceId1 = diceId1.toNumber();
    await diceInstance.add(6,0, {
      from: accounts[0],
      value: 20000000000000000
    });
  });

  it('should be able to unlist a dice', async () => {
    //transfer new dice to DiceMarket
    await diceInstance.transfer(diceId1, diceMarketInstance.address, {from: accounts[0]});

    //unlist from DiceMarket
    await diceMarketInstance.unlist(diceId1, {
      from: accounts[0]
    });

    //assert dice is returned to accounts[0]
    let dice1Addr = await diceInstance.getOwner.call(diceId1);
    assert.strictEqual(
      dice1Addr,
      accounts[0],
      'Dice should return to original owner after unlist()'
    );
  });

  //main DiceMarket test sequence
  it('should be able to list & buy a dice', async () => {
    //transfer new dice to DiceMarket
    await diceInstance.transfer(diceId1, diceMarketInstance.address,{ from: accounts[0]});

    //list dice
    await diceMarketInstance.list(diceId1, price, {
      from: accounts[0]
    })

    let comissionFee = (await diceMarketInstance.comissionFee.call());

    //buy dice
    await diceMarketInstance.buy(diceId1, {
      from: accounts[1],
      value: web3.utils.toBN(price).add(comissionFee)
    })
    
    //assert ownership is transferred to accounts[1] after buy
    let dice1Addr = await diceInstance.getOwner.call(diceId1);
    assert.strictEqual(
      dice1Addr,
      accounts[1],
      'Did not transfer dice to accounts[1] after buy()'
    );
  });
});
