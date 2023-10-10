// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Dice.sol";

contract DiceBattle {

    Dice diceContract;

    constructor(Dice diceAddress) {
        diceContract = diceAddress;
    }

    event battlewin(uint256 myDice,uint256 enemyDice);
    event battleDraw(uint256 myDice,uint256 enemyDice);

    function battle(uint256 myDice, uint256 enemyDice) public {
        require(diceContract.getOwner(myDice) == address(this));
        require(diceContract.getOwner(enemyDice) == address(this));
        require(diceContract.getPrevOwner(myDice) == msg.sender);

        diceContract.roll(myDice);
        diceContract.stopRoll(myDice);
        diceContract.roll(enemyDice);
        diceContract.stopRoll(enemyDice);

      if ( diceContract.getDiceNumber(myDice) > diceContract.getDiceNumber(enemyDice) ) {
          //myDice wins
          address winner = diceContract.getPrevOwner(myDice);
          diceContract.transfer(myDice, winner); //last owner before sending to DiceBattle
          diceContract.transfer(enemyDice, winner);
          emit battlewin(myDice,enemyDice);
      }
     if ( diceContract.getDiceNumber(myDice) < diceContract.getDiceNumber(enemyDice) ) {
         //enemyDice wins
          address winner = diceContract.getPrevOwner(enemyDice);
          diceContract.transfer(enemyDice, winner); //last owner before sending to DiceBattle
          diceContract.transfer(myDice, winner);
          emit battlewin(enemyDice,myDice);
      }
      if ( diceContract.getDiceNumber(myDice) == diceContract.getDiceNumber(enemyDice) ) {
          emit battleDraw(myDice,enemyDice);
      }
    }

    function getDiceOwner(uint256 id) public view  returns (address){
        return diceContract.getPrevOwner(id);
    }

    function getDiceNumber (uint256 diceId) public view returns (uint256) {
        return diceContract.getDiceNumber(diceId);
    }

}
