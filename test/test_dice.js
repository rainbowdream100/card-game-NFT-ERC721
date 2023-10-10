var Dice = artifacts.require('./Dice.sol');

contract('Dice', function(accounts) {
  let diceInstance;
  let newDiceId;

  before(async () => {
    diceInstance = await Dice.deployed();
  });

  //Test case 1: "ensure > 0.01eth is needed to create a dice"
  it('ensure > 0.01eth is needed to create a dice', async () => {
    //.call does not save the data
    //dice(id=0) created
    let numDices = await diceInstance.numDices.call();
    newDiceId = numDices.toNumber();

    diceInstance.add(6, 2, {
      from: accounts[0],
      value: web3.utils.toWei("10", "finney")
    }).catch(err => {
      //this transaction expected to fail
    }).then(rsl => {
      assert.strictEqual(rsl, undefined, "Dice creation should fail if <0.01eth is provided.");
    });
  });

  //Test case: positive test of test case 1
  it('Should add a Dice', async () => {
    //.call does not save the data
    //dice(id=0) created
    let numDices = await diceInstance.numDices.call();
    newDiceId = numDices.toNumber();

    let result = await diceInstance.add(6, 2, {
      from: accounts[0],
      value: web3.utils.toWei("11", "finney")
    });

    assert.strictEqual(
      result.logs[0].event,
      "diceCreated",
      'Dice add() did not emit diceCreated()'
    );

    assert.strictEqual(
      result.logs[0].args['0'].toNumber(),
      newDiceId,
      'Dice add() did emit correct diceId'
    );
  });

  //Test case: roll() should work for owner
  it('Should roll a Dice', async () => {
    let tx = await diceInstance.roll(newDiceId, {
      from: accounts[0]
    });
    const log= tx.logs[0];
    //console.log(tx);

    assert.strictEqual(
      log.event,
      'rolling',
      'Did not emit roll event'
    );
  });

  //Test case: stopRoll() should work for owner
  it('Should stop rolling a Dice', async () => {
    let diceId = await diceInstance.numDices.call();
    let tx = await diceInstance.stopRoll(newDiceId, {
      from: accounts[0]
    });
    const log = tx.logs[0];

    if(log.event === 'luckytimesEvent') {
      assert.strictEqual(
        log.event,
        'luckytimesEvent',
        'Did not emit roll event'
      );
    }

    if(log.event === 'rolled') {
      assert.strictEqual(
        log.event,
        'rolled',
        'Did not emit roll event'
      );
    }
  });

  //Test case: transfer() should work for owner
  it('Able to transfer ownership', async () => {
    let diceId1 = await diceInstance.numDices.call();
    await diceInstance.add(6, 2, {
      from: accounts[0],
      value: 20000000000000000
    });

    await diceInstance.transfer(diceId1, accounts[1]);

    let newOwner = await diceInstance.getOwner.call(diceId1);
    assert.equal(
      newOwner,
      accounts[1],
      'Owner no changed properly'
    );
  });

  //Test case: roll(), stopRoll(), transfer() should fail for non-owner
  it('roll(), stopRoll(), transfer() should fail for non-owner', async () => {
    let tx = await diceInstance.roll(newDiceId, {
      from: accounts[1] //non-owner
    }).catch(err => {
      //this transaction expected to fail
    }).then(rsl => {
      assert.strictEqual(rsl, undefined, "roll() should fail for non-owner");
    });

    tx = await diceInstance.stopRoll(newDiceId, {
      from: accounts[1] //non-owner
    }).catch(err => {
      //this transaction expected to fail
    }).then(rsl => {
      assert.strictEqual(rsl, undefined, "stopRoll() should fail for non-owner");
    });

    tx = await diceInstance.transfer(newDiceId, accounts[2], {
      from: accounts[1] //non-owner
    }).catch(err => {
      //this transaction expected to fail
    }).then(rsl => {
      assert.strictEqual(rsl, undefined, "transfer() should fail for non-owner");
    });
  });

  //Additional test case (optional)
  it('Return number of dices', async () => {
    let numDices = await diceInstance.numDices.call();
    await diceInstance.add(6, 2, {
      from: accounts[1],
      value: 20000000000000000
    });

    let numDicesAfter = await diceInstance.numDices.call();

    assert.strictEqual(
      numDicesAfter.toNumber()-1,
      numDices.toNumber(),
      'Did not increment numDices after add()'
    );
  });

});
