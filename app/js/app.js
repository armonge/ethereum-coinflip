(function() {
  // jquery elements
  var $coinBalance;
  var $coinFlips;
  var $flipForm;
  var $bet;
  var $loader;
  var $results;

  // account status
  var balance;
  var coinFlips;
  var lastResult;
  var lastSelection;

  // eth account
  var account = web3.eth.accounts[0];

  $(function() {
    $result = $('#results');
    $coinBalance = $('#coin-balance');
    $coinFlips = $('#coin-flips');
    $flipForm = $('#flip-form');
    $loader = $('.loader');
    $bet = $('#bet');

    $flipForm.on('submit', flipCoin);

    updateTable();
  });

  function formatNumber(number) {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString();
  }

  CusucoCoinFlip.allEvents().watch(updateTable);

  function updateTable(err, result) {
    console.log(err, result);
    balance = CusucoCoinFlip.balances(account).toNumber();
    $coinBalance.text(formatNumber(balance));

    coinFlips = CusucoCoinFlip.flips().toString();
    $coinFlips.text(coinFlips);

    lastResult = CusucoCoinFlip.lastResult();
    lastSelection = CusucoCoinFlip.lastSelection();
    $result.text('Result: {result}, Selection: {selection}'
                     .replace('{selection}', formatResult(lastSelection))
                     .replace('{result}', formatResult(lastResult)));

    enableForms();
  }

  function formatResult(result){
     return result ? 'Heads' : 'Tails';
  }

  function flipCoin(e) {
    e.preventDefault();
    var selection = $('input:checked', $flipForm).val() === 'head';
    var bet = parseInt($bet.val(), 10);

    disableForms();
    CusucoCoinFlip.flip(selection, bet);
  }

  function enableForms() {
    $(':input, button').removeAttr('disabled');
    $loader.removeClass('active');
  }

  function disableForms() {
    $(':input, button').attr('disabled', true);
    $loader.addClass('active');
  }
})();
