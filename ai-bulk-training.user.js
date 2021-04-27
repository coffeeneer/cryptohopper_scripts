// ==UserScript==
// @name         CryptoHopper AI Bulk Train
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/ai-bulk-training.user.js
// @version      0.2
// @description  Add a bulk train option to CryptoHopper AI training page
// @author       coffeeneer
// @match        https://www.cryptohopper.com/strategies?edit_ai*
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function trainCoinPairs(config, coinPairs, currentQueueSize) {
    if (coinPairs.length < 1) {
      window.swal({
        title: 'Success',
        text: 'All available coin pairs added to training queue!',
        type: 'success',
      });
      return finishTraining(currentQueueSize);
    }

    if (currentQueueSize >= window.max_trainings) {
      const pairsRemaining = coinPairs.join(', ');
      window.swal({
        title: 'Full queue',
        text: `Training queue filled up! Remaining coins: ${pairsRemaining}`,
        type: 'error',
      });
      return finishTraining(currentQueueSize);
    }

    const currentCoinPair = coinPairs.pop();
    console.log(`Starting training for coin pair ${currentCoinPair}...`);

    window.doApiCall(
      'trainai',
      {
        ...config,
        pair: currentCoinPair.replace('/', ''),
      },
      (_result) => {
        console.log(`${currentCoinPair} added to training queue`);

        window.refreshAITrainings();
        setTimeout(() => trainCoinPairs(config, coinPairs, currentQueueSize + 1), 1200);
      },
      (error) => {
        swal({ title: 'Error', text: error, timer: 4e3, type: 'error' });
        finishTraining(currentQueueSize);
      }
    );
  }

  function finishTraining(currentQueueSize) {
    window.jQuery('#learnAIButton').html('<i class="md md-android m-r-5"></i> Learn');
    return window.setAILearnButton(currentQueueSize);
  }

  function startTrainCoinPairs(coinPairs) {
    const config = {};
    config.id = window.jQuery('#ai_id').val();
    if (config.id == 'new') {
      return window.swal({ title: 'Error', text: 'You cannot train a new AI. Please save your AI first.', timer: 4e3, type: 'error' });
    }

    const button = window.jQuery('#learnAIButton');
    button.html('<i class="fa fa-refresh fa-spin m-r-5"></i>');
    button.prop('disabled', true);

    const strategy = window.jQuery('#selected_strategy_id option:selected');
    config.exchange = window.jQuery('#select_exchange').val();
    config.strategy_id = strategy.val();
    config.strategy_type = strategy.data('type');

    // Get training queue and start training
    window.doApiCall(
      'loadaitraining',
      {
        id: config.id,
      },
      (result) => {
        // Filter out unavailable pairs
        const availablePairs = window
          .jQuery('#select_market option')
          .map(function () {
            return window.jQuery(this).val();
          })
          .get();

        coinPairs = coinPairs.filter(
          (coinPair) =>
            !!availablePairs.find((availablePair) => availablePair === coinPair) &&
            !result.data.find(
              (training) =>
                training.strategy_id == config.strategy_id &&
                training.exchange == config.exchange &&
                training.pair == coinPair.replace('/', '')
            )
        );
        console.log('Coins available to train: ', coinPairs.join(', '));

        // Start training
        trainCoinPairs(config, coinPairs, result.total_trainings);
      },
      (error) => {
        swal({ title: 'Error', text: error, timer: 4e3, type: 'error' });
        window.jQuery('#learnAIButton').html('<i class="md md-android m-r-5"></i> Learn');
      }
    );
  }

  function promptCoinPairs() {
    window
      .swal({
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
          startTrainCoinPairs(coinPairList.map((pair) => pair.trim()));
        }
      });
  }

  function addElements() {
    const style = window.jQuery('<style>.swal2-popup .swal2-textarea { color: #4c5667; }</style>');
    const button = window.jQuery(
      '<button type="button" class="btn waves-effect waves-light btn-primary"><i class="md md-school m-r-5"></i> Bulk Learn</button>'
    );
    const buttonGroup = window.jQuery('<div class="btn-group m-t-5" style="display: none;"></div>');
    buttonGroup.append(button);

    window.jQuery('body').prepend(style);
    window.jQuery('#ai_designer_wrapper .btn-toolbar').append(buttonGroup);

    window.jQuery('#viewTrainingButton').on('click', () => {
      buttonGroup.show();
    });
    window.jQuery('#viewEditorButton, #viewResultsButton').on('click', () => {
      buttonGroup.hide();
    });
    button.on('click', () => promptCoinPairs());
  }

  window.jQuery(() => addElements());
})();
