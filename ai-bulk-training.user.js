// ==UserScript==
// @name         CryptoHopper AI Bulk Train
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/ai-bulk-training.user.js
// @version      0.1
// @description  Add a bulk train option to CryptoHopper AI training page
// @author       coffeeneer
// @match        https://www.cryptohopper.com/strategies?edit_ai*
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function trainCoinPairs(coinPairs) {
    if (coinPairs.length < 1) {
      console.log('Added all coins!');
      return;
    }

    const currentCoinPair = coinPairs.pop();
    console.log(`Starting training for coin pair ${currentCoinPair}...`);

    if (!isValidCoinPair(currentCoinPair)) {
      console.log('Invalid coin pair!');
      return trainCoinPairs(coinPairs);
    }

    if (coinPairIsInQueue(currentCoinPair)) {
      console.log('Coin pair is already in training queue!');
      return trainCoinPairs(coinPairs);
    }

    window.$('#select_market').val(currentCoinPair);
    window.loadMarket();

    console.log('Waiting for market to be loaded');
    setTimeout(() => startTraining(currentCoinPair, coinPairs), 500);
  }

  function startTraining(coinPair, nextCoinPairs) {
    if (window.$('#learnAIButton').is(':disabled')) {
      return setTimeout(() => startTraining(coinPair, nextCoinPairs), 250);
    }

    window.doTrainAI();
    console.log(`${coinPair} added to training queue`);
    trainCoinPairs(nextCoinPairs);
  }

  function coinPairIsInQueue(coin) {
    const needle = coin.replace('/', '');
    return window.$('#current_ai_trainings table tbody tr td').filter(`:contains('${needle}')`).length > 0;
  }

  function isValidCoinPair(coinPair) {
    return window.$(`#select_market option[value='${coinPair}']`).length > 0;
  }

  function promptCoinPairs() {
    window
      .Sweetalert2({
        title: 'Bulk Add Coin Pairs',
        input: 'textarea',
        text: 'Input your coin pair list, comma seperated',
        inputPlaceholder: 'BTC/USDT, ETH/USDT etc.',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          const coinPairList = result.value.split(',');
          console.log(coinPairList);
          trainCoinPairs(coinPairList.map((pair) => pair.trim()));
        }
      });
  }

  function addElements() {
    const style = window.$('<style>.swal2-popup .swal2-textarea { color: #4c5667; }</style>');
    const button = window.$(
      '<button type="button" class="btn waves-effect waves-light btn-primary"><i class="md md-school m-r-5"></i> Bulk Learn</button>'
    );
    const buttonGroup = window.$('<div class="btn-group m-t-5" style="display: none;"></div>');
    buttonGroup.append(button);

    window.$('body').prepend(style);
    window.$('#ai_designer_wrapper .btn-toolbar').append(buttonGroup);

    window.$('#viewTrainingButton').on('click', () => {
      buttonGroup.show();
    });
    window.$('#viewEditorButton, #viewResultsButton').on('click', () => {
      buttonGroup.hide();
    });
    button.on('click', () => promptCoinPairs());
  }

  window.$(() => addElements());
})();
