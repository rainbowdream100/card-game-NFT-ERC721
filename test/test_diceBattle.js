var Dice = artifacts.require('./Dice.sol');
var DiceBattle = artifacts.require('./DiceBattle.sol');

contract('DiceBattle', function(accounts) {
  let diceInstance;
  let diceBattleInstance;
  before(async () => {
    diceInstance = await Dice.deployed();
    diceBattleInstance = await DiceBattle.deployed();
  });

  //Test case: Only the original owner of the „myDice‟ dice, is able to trigger the battle() function
  //Test case: battle() function will return ownership of both dices to the winner
  it('battle() function will return ownership of both dices to the winner', async () => {
    let diceId1 = await diceInstance.numDices.call();
    await diceInstance.add(6,0, {
      from: accounts[0],
      value: 20000000000000000
    });

    let diceId2 = await diceInstance.numDices.call();
    await diceInstance.add(6,0, {
      from: accounts[1],
      value: 20000000000000000
    });
    diceInstance.transfer(diceId1, diceBattleInstance.address,{from: accounts[0]});
    diceInstance.transfer(diceId2, diceBattleInstance.address,{from: accounts[1]});

    diceBattleInstance.battle(diceId1, diceId2, {
      from: accounts[2] //not owner of dice1
    }).catch(err => {
      //this transaction expected to fail
    }).then(rsl => {
      assert.strictEqual(rsl, undefined, "Only the original owner of the „myDice‟ dice, is able to trigger the battle() function");
    });

    let tx = await diceBattleInstance.battle(diceId1, diceId2, {
      from: accounts[0]
    })
    const log = tx.logs[0];

    let dice1Addr = await diceInstance.getOwner.call(diceId1.toNumber());
    let dice2Addr = await diceInstance.getOwner.call(diceId2.toNumber());

    if(log.event === 'battlewin'){
      let winnerAddr;
      if(log.args.myDice.toNumber() == diceId1.toNumber())
        winnerAddr = accounts[0];
      else
        winnerAddr = accounts[1];

      assert.strictEqual(
        winnerAddr,
        dice1Addr,
        'Did not transfer dice to winner'
      );  
      assert.strictEqual(
        winnerAddr,
        dice2Addr,
        'Did not transfer dice to winner'
      );  
      
    }else if(log.event === 'battleDraw'){
      assert.strictEqual(
        dice1Addr,
        diceBattleInstance.address,
        'Dice should remain with DiceBattle on draw'
      );
      assert.strictEqual(
        dice2Addr,
        diceBattleInstance.address,
        'Dice should remain with DiceBattle on draw'
      );
    }else{
      throw new Error('DiceBattle didnt emit either battlewin or battleDraw');
    }
  });
});
