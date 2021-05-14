// ==UserScript==
// @name         CryptoHopper AI Learn allowed coins
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/ai-learn-allowed-coins.user.js
// @version      0.1
// @description  Add a learn allowed coins option to CryptoHopper AI training page
// @author       0SkillAllLuck
// @match        https://www.cryptohopper.com/strategies?edit_ai*
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function trainCoinPairs(config, coinPairs, currentQueueSize) {
        if (coinPairs.length < 1) {
            swal({
                title: 'Success',
                text: 'All allowed coins added to training queue!',
                type: 'success',
            });
            return finishTraining(currentQueueSize);
        }

        if (currentQueueSize >= max_trainings) {
            const pairsRemaining = coinPairs.join(', ');
            swal({
                title: 'Full queue',
                text: `Training queue filled up! Remaining coins: ${pairsRemaining}`,
                type: 'error',
            });
            return finishTraining(currentQueueSize);
        }

        const currentCoinPair = coinPairs.pop();
        console.log(`Starting training for coin pair ${currentCoinPair}...`);

        doApiCall(
            'convertmarket',
            {
                exchange: config.exchange,
                market: currentCoinPair,
            },
            (result) => {
                doApiCall(
                    'trainai',
                    {
                        ...config,
                        pair: result.pair,
                    },
                    (_result) => {
                        console.log(`${currentCoinPair} added to training queue`);

                        refreshAITrainings();
                        setTimeout(
                            () => trainCoinPairs(config, coinPairs, currentQueueSize + 1),
                            1200
                        );
                    },
                    (error) => {
                        swal({ title: 'Error', text: error, timer: 4e3, type: 'error' });
                        finishTraining(currentQueueSize);
                    }
                );
            },
            (error) => {
                swal({ title: 'Error', text: error, timer: 4e3, type: 'error' });
                finishTraining(currentQueueSize);
            }
        );
    }

    function startTrainingCoinPairs(coinPairs) {
        const config = {};
        config.id = jQuery('#ai_id').val();
        if (config.id == 'new') {
            return swal({
                title: 'Error',
                text: 'You cannot train a new AI. Please save your AI first.',
                timer: 4e3,
                type: 'error',
            });
        }

        const button = jQuery('#learnAIButton');
        button.html('<i class="fa fa-refresh fa-spin m-r-5"></i>');
        button.prop('disabled', true);

        const strategy = jQuery('#selected_strategy_id option:selected');
        config.exchange = jQuery('#select_exchange').val();
        config.strategy_id = strategy.val();
        config.strategy_type = strategy.data('type');

        // Get training queue and start training
        doApiCall(
            'loadaitraining',
            {
                id: config.id,
            },
            (result) => {
                // Filter out unavailable pairs
                const availablePairs = window
                    .jQuery('#select_market option')
                    .map(function () {
                        return jQuery(this).val();
                    })
                    .get();

                coinPairs = coinPairs.filter((coinPair) => {
                    const splitPair = coinPair.split('/');
                    return (
                        !!availablePairs.find((availablePair) => availablePair === coinPair) &&
                        !result.data.find(
                            (training) =>
                                training.strategy_id == config.strategy_id &&
                                training.exchange == config.exchange &&
                                training.pair.includes(splitPair[0]) &&
                                training.pair.includes(splitPair[1])
                        )
                    );
                });
                console.log('Coins available to train: ', coinPairs.join(', '));

                // Start training
                trainCoinPairs(config, coinPairs, result.total_trainings);
            },
            (error) => {
                swal({ title: 'Error', text: error, timer: 4e3, type: 'error' });
                jQuery('#learnAIButton').html('<i class="md md-android m-r-5"></i> Learn');
            }
        );
    }

    function finishTraining(currentQueueSize) {
        jQuery('#learnAIButton').html('<i class="md md-android m-r-5"></i> Learn');
        return setAILearnButton(currentQueueSize);
    }

    function doTrainAIAllowedCoins() {
        $.get('https://www.cryptohopper.com/config', function(configPage) {
            const base = $(configPage).find('#collect_currency').val().toUpperCase();
            const coinPairList = $(configPage).find('#allowed_coins').val().map((coin) => `${coin}/${base}`);
            console.log(coinPairList);
            startTrainingCoinPairs(coinPairList);
        });
    }

    function addElements() {
        const button = jQuery('<button type="button" class="btn waves-effect waves-light btn-primary"><i class="md md-android m-r-5"></i> Learn Allowed Coins</button>');
        const buttonGroup = jQuery('<div class="input-group pull-right"></div>');
        buttonGroup.append(button);

        jQuery('#ai_training > div:nth-child(1) > div > div > div > div.col-md-8.col-lg-9 > div').append(buttonGroup);

        button.on('click', () => doTrainAIAllowedCoins());
    }

    jQuery(document).ready(() => addElements());
})();
