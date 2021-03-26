// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract GuessGame {
  event GuessResult(uint playerChoice, uint computerChoice, uint result);

  function play(uint playerChoice, uint computerChoice) public payable returns (bool) {
    if (playerChoice > 0 && playerChoice <= 3 && computerChoice > 0 && computerChoice <= 3) {
      if (playerChoice == computerChoice) {
        emit GuessResult(playerChoice, computerChoice, 1);
      } else if (playerChoice == (computerChoice + 1) % 3) {
        emit GuessResult(playerChoice, computerChoice, 2);
      } else {
        emit GuessResult(playerChoice, computerChoice, 3);
      }
      return true;
    } else {
      return false;
    }
  }

  function test() public pure returns (bool) {
    return true;
  }

}