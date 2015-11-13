(function() {
  // jquery elements
  var $bankBalance;
  var $coinBalance;
  var $coinFlips;
  var $flipForm;
  var $bet;
  var $withdrawForm;
  var $withdrawAmount;
  var $mintForm;
  var $mintAmount;
  var $loader;

  // account status
  var balance;
  var bankBalance;
  var coinFlips;

  // eth account
  var account = web3.eth.accounts[0];

  $(function() {
    $bankBalance = $('#bank-coin-balance');
    $coinBalance = $('#coin-balance');
    $coinFlips = $('#coin-flips');
    $loader = $('.loader');
    updateTable();

    $flipForm = $('#flip-form');
    $bet = $('#bet');

    $mintForm = $('#mint-form');
    $mintAmount = $('#mint-amount');

    $withdrawForm = $('#withdraw-form');
    $withdrawAmount = $('#withdraw-amount');

    $withdrawForm.on('submit', withdraw);
    $flipForm.on('submit', flipCoin);
    $mintForm.on('submit', mint);
  });

  CusucoCoinFlip.Sent().watch(updateTable);
  CusucoCoinFlip.Received().watch(updateTable);
  CusucoCoinFlip.Minted().watch(updateTable);

  function formatNumber(number) {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString();
  }

  function updateTable() {
    balance = CusucoCoinFlip.balances(account).toNumber();
    $coinBalance.text(formatNumber(balance));

    bankBalance = CusucoCoinFlip.bankBalance().toNumber();
    $bankBalance.text(formatNumber(bankBalance));

    coinFlips = CusucoCoinFlip.flips().toString();
    $coinFlips.text(coinFlips);

    enableForms();
  }

  function flipCoin(e) {
    e.preventDefault();
    var selection = $('input:checked', $flipForm).val() === 'head';
    var bet = parseInt($bet.val(), 10);

    if (balance < bet) {
      return alert('Can\'t bet coins you don\'t have!');
    }

    if (bankBalance < bet) {
      return alert('Sorry, we don\'t have as much money as you');
    }

    console.log(CusucoCoinFlip.flip(selection, bet));
    disableForms();
  }

  function mint(e) {
    e.preventDefault();
    var amount = parseInt($mintAmount.val(), 10);

    CusucoCoinFlip.mint(amount);
    disableForms();
  }

  function withdraw(e) {
    e.preventDefault();
    var amount = parseInt($withdrawAmount.val(), 10);

    if (bankBalance < amount) {
      return alert('Money has no coins, better mint some!');
    }

    CusucoCoinFlip.send(account, amount);
    disableForms();
  }

  function enableForms(error, result) {
    $(':input, button').removeAttr('disabled');
    $loader.removeClass('active');
  }

  function disableForms() {
    $(':input, button').attr('disabled', true);
    $loader.addClass('active');
  }
})();
