// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Dice {

    enum diceState { stationary, rolling }

    struct dice {
        uint8 numberOfSides;
        uint8 color;
        uint8 currentNumber;
        diceState state;
        uint256 creationValue; // amount given to smart contract in ETH when dice is created
        uint256 luckytimes;
        address owner;
        address prevOwner;
    }

    event diceCreated(uint256 diceId, address owner);
    event rolling (uint256 diceId);
    event rolled (uint256 diceId, uint8 newNumber);
    event luckytimesEvent(uint256 diceId);

    uint256 public numDices = 0;
    mapping(uint256 => dice) public dices;


    //function to create a new dice, and add to 'dices' map. requires at least 0.01ETH to create
    function add(
        uint8 numberOfSides,
        uint8 color
    ) public payable returns(uint256) {
        require(numberOfSides > 0);
        require(msg.value > 0.01 ether, "at least 0.01 ETH is needed to spawn a new dice");

        //new dice object
        dice memory newDice = dice(
            numberOfSides,
            color,
            (uint8)(block.timestamp % numberOfSides) + 1,  //non-secure random number
            diceState.stationary,
            msg.value,
            0,
            msg.sender,  //owner
            address(0)
        );

        uint256 newDiceId = numDices++;
        dices[newDiceId] = newDice; //commit to state variable
        emit diceCreated(newDiceId, msg.sender);
        return newDiceId;   //return new diceId
    }

    //modifier to ensure a function is callable only by its owner
    modifier ownerOnly(uint256 diceId) {
        require(dices[diceId].owner == msg.sender);
        _;
    }

    modifier validDiceId(uint256 diceId) {
        require(diceId < numDices);
        _;
    }

    //owner can roll a dice
    function roll(uint256 diceId) external ownerOnly(diceId) validDiceId(diceId) {
            dices[diceId].state = diceState.rolling;    //set state to rolling
            dices[diceId].currentNumber = 0;    //number will become 0 while rolling
            emit rolling(diceId);   //emit rolling event
    }

    function stopRoll(uint256 diceId) external ownerOnly(diceId) validDiceId(diceId) {
            dices[diceId].state = diceState.stationary; //set state to stationary

            //this is not a secure randomization
            uint8 newNumber = (uint8)((block.timestamp*(diceId+1)) % dices[diceId].numberOfSides) + 1;
            dices[diceId].currentNumber = newNumber;
            if(dices[diceId].currentNumber == dices[diceId].numberOfSides){
                dices[diceId].luckytimes++;
                emit luckytimesEvent(diceId);
            }
            emit rolled(diceId, newNumber); //emit rolled
    }

    //transfer ownership to new owner
    function transfer(uint256 diceId, address newOwner) external ownerOnly(diceId) validDiceId(diceId) {
        dices[diceId].prevOwner = dices[diceId].owner;
        dices[diceId].owner = newOwner;
    }

    //get number of sides of dice
    function getDiceSides(uint256 diceId) public view validDiceId(diceId) returns (uint8) {
        return dices[diceId].numberOfSides;
    }

    //get current dice number
    function getDiceNumber(uint256 diceId) public view validDiceId(diceId) returns (uint8) {
        return dices[diceId].currentNumber;
    }

    //get ether put in during creation
    function getDiceValue(uint256 diceId) external view validDiceId(diceId) returns (uint256) {
        return dices[diceId].creationValue;
    }

    function getOwner(uint256 diceId) external view validDiceId(diceId) returns (address) {
        return dices[diceId].owner;
    }

    function getPrevOwner(uint256 diceId) external view validDiceId(diceId) returns(address) {
        return dices[diceId].prevOwner;
    }

    function getLuckyTimes(uint256 diceId) public view validDiceId(diceId) returns(uint256){
        return dices[diceId].luckytimes;
    }

    function destroyDice(uint256 diceId) payable public ownerOnly(diceId) validDiceId(diceId) {
        //for security: "check-effect-interact" rule
        uint256 value = dices[diceId].creationValue;
        delete dices[diceId];
        payable(msg.sender).transfer(value);
    }

}
