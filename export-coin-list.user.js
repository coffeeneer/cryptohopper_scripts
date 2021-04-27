// ==UserScript==
// @name         CryptoHopper AI Coin List Exporter
// @namespace    https://github.com/coffeeneer/cryptohopper_scripts
// @updateUrl    https://github.com/coffeeneer/cryptohopper_scripts/raw/main/export-coin-list.user.js
// @version      0.1
// @description  Add an export option for the coin list on the Crypto Hopper Hopper config page
// @author       coffeeneer
// @match        https://www.cryptohopper.com/config
// @icon         https://www.google.com/s2/favicons?domain=www.cryptohopper.com
// @grant        GM.setClipboard
// ==/UserScript==

(function () {
  'use strict';

  function exportCoinList() {
    const base = window.jQuery('#collect_currency').val().toUpperCase();
    const coinPairs = window
      .jQuery('#allowed_coins')
      .val()
      .map((coin) => `${coin}/${base}`)
      .join(', ');

    GM.setClipboard(coinPairs);
    window.swal({ title: 'Success', text: 'Coinlist copied to clipboard!', type: 'success' });
  }

  function addElements() {
    const button = window.jQuery('<a href="#"><i class="fa fa-copy m-r-5"></i> Copy coinlist</a>');
    const listItem = window.jQuery('<li></li>');
    listItem.append(button);

    window.jQuery('.page-title-box .dropdown-menu').append(listItem);

    button.on('click', () => exportCoinList());
  }

  window.jQuery(() => addElements());
})();
