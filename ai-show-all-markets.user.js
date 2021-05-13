// ==UserScript==
// @name         CryptoHopper AI Show All Markets
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/ai-show-all-markets.user.js
// @version      0.1
// @description  Add an option to show all market results on the AI results page
// @author       coffeeneer
// @match        https://www.cryptohopper.com/strategies?edit_ai*
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        GM.setClipboard
// ==/UserScript==

(function () {
    'use strict';

    function showAllMarkets() {
        jQuery('#best_scoring_markets_table tr').show();
    }

    function addElements() {
        const button = jQuery('<a href="#">Show hidden &gt;</a>');
        const col = jQuery('<div class="col-md-12"></div>');
        const row = jQuery('<div class="row"></div>');
        col.append(button);
        row.append(col);

        jQuery('#best_scoring_markets_table').parent().before(row);

        button.on('click', () => showAllMarkets());
    }

    jQuery(document).ready(() => addElements());
})();
