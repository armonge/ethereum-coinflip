contract CusucoCoinFlip {
  address public minter;
  mapping (address => uint) public balances;
  uint public bankBalance;
  uint public flips;

  event Sent(address to, uint amount);
  event Received(address from, uint amount);
  event Minted(uint amount);

  function mint(uint amount) {
    bankBalance += amount;
    Minted(amount);
  }

  function send(address receiver, uint amount) {
    if (bankBalance < amount) throw;
    bankBalance -= amount;
    balances[receiver] += amount;

    Sent(receiver, amount);
  }

  function receive(address sender, uint amount) {
    if (balances[sender] < amount) throw;
    bankBalance += amount;
    balances[sender] -= amount;

    Received(sender, amount);
  }

  function flip(bool selection, uint bet) returns (bool result){
     if (balances[msg.sender] < bet) throw;
     if (bankBalance < bet) throw;

     flips += 1;

     // guaranteed to be random, chosen by fair dice roll 
     var randomResult = (now % 2 == 0);

     if (selection && randomResult) {
      send(msg.sender, bet);
     } else {
      receive(msg.sender, bet);
     }

     return randomResult;
  }


}
