// ==UserScript==
// @name         CryptoHopper Stats Exporter
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/export-stats.user.js
// @version      0.1
// @description  Add a more feature rich stats exporter to the trade overview
// @author       coffeeneer
// @match        https://www.cryptohopper.com/config
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function exportStats(dateRange, startBalance) {
        const url = '/export_trade_history.php';
        const params = new URLSearchParams({
            type: 'csv',
            timezone: timezoneOffset(),
            daterange: dateRange,
            buys: 1,
            sells: 1,
            arbitrage: 0,
        });

        fetch(url, {
            method: 'GET',
            body: params,
        }).then((res) => {
            console.log(res);
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
        const button = jQuery(
            '<button type="button" class="btn btn-primary waves-effect waves-light">Export Stats</button>'
        );

        jQuery('.exportDiv .text-right').append(button);

        button.on('click', () => getStatsInput());
    }

    jQuery(document).ready(() => addElements());
})();
