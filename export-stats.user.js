// ==UserScript==
// @name         CryptoHopper Stats Exporter
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/export-stats.user.js
// @version      0.1
// @description  Add a more feature rich stats exporter to the trade overview
// @author       coffeeneer
// @match        https://www.cryptohopper.com/trade-history
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function exportStats(dateRange, startBalance) {
        const params = new URLSearchParams({
            type: 'csv',
            timezone: timezoneOffset(),
            daterange: dateRange,
            buys: 1,
            sells: 1,
            arbitrage: 0,
        });

        fetch('/export_trade_history.php?' + params)
            .then((res) => res.text())
            .then((history) => {
                const lines = history.split('\n');
                // Remove header
                lines.splice(0, 1);

                const buyOrders = new Map();

                for (const line of lines) {
                    const trade = {};
                    ({
                        0: trade.date,
                        1: trade.id,
                        2: trade.orderId,
                        3: trade.currency,
                        4: trade.pair,
                        5: trade.type,
                        6: trade.orderAmount,
                        7: trade.orderRate,
                        8: trade.orderValue,
                        9: trade.orderCurrency,
                        10: trade.fee,
                        11: trade.trigger,
                        12: trade.result,
                        13: trade.buyOrderId,
                    } = line.split(','));

                    if (trade.type === 'buy') {
                        buyOrders.set(trade.id, trade);
                    } else {
                        const buyOrder = buyOrders.get(trade.buyOrderId);
                        console.log(trade, buyOrder);
                    }
                }
            });
    }

    function getStatsInput() {
        swal({
            title: 'Export Trade Stats',
            input: 'number',
            text: 'Input your starting balance for the selected export date',
            showCancelButton: true,
        }).then((result) => {
            if (result.value) {
                const dateRange = jQuery('#export_daterange').val();

                exportStats(dateRange, result.value);
            }
        });
    }

    function addElements() {
        const style = jQuery('<style>.swal2-popup .swal2-input { color: #4c5667; }</style>');
        const button = jQuery(
            '<button type="button" class="btn btn-primary waves-effect waves-light">Export Stats</button>'
        );

        jQuery('body').prepend(style);
        jQuery('#exportDiv .text-right').append(button);

        button.on('click', () => getStatsInput());
    }

    jQuery(document).ready(() => addElements());
})();
