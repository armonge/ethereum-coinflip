contract CusucoCoinFlip {
  mapping (address => int) public balances;
  uint public flips;
  bool public lastResult;
  bool public lastSelection;

  event Flipped(address from, int amount);

  function flip(bool selection, int bet) returns (bool result){
     flips += 1;

     // guaranteed to be random, chosen by fair dice roll 
     var randomResult = (now % 2 == 0);
     lastResult = randomResult;
     lastSelection = selection;


     if (!(selection == randomResult)) {
       bet = -1 * bet;
     }

     balances[msg.sender] += bet;
     Flipped(msg.sender, bet);

     return randomResult;
  }


}
