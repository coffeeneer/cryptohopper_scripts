# Crypto Hopper user scripts
This repository contains user scripts to enhance the Crypto Hopper user experience.

# ⚠️ Security implications: ⚠️

> User scripts have access to your browser window, they can manipulate elements on a financial site while you are logged in. Please read and understand what the code is doing before you run it!

You are responsible for the code you run on your own computer. By downloading and executing this script you take responsibility for anything it may do, so please read and understand the code *before* installing it.

# Installation:

1. Install a userscript extension in your browser like [TamperMonkey](https://www.tampermonkey.net/).
2. Select a the user script you want from this repository (ex. ai-bulk-training.user.js).
3. Read through the script and familiarize yourself with the code. Make sure you understand what it does before you install it!
4. Click the "Raw" button and your browser extension should ask you to install it.
5. Navigate to the Cryptohopper website and enjoy added functionality :)
6. (optional) You can turn on auto-updates to the script or check back here for new versions.

# Available scripts

## AI Bulk Training (`ai-bulk-training.user.js`)
The `ai-bulk-training.user.js` script adds a dialog option to the AI training page where you can add a comma seperated list of coin pairs to train.

### Usage
1. Navigate to the AI training page.
2. Select your exchange
3. You will see a new button called "Bulk Learn", clicking this will open the dialog. ![Bulk Button](/docs/bulk_learn.png)
4. Enter a comma seperated list of the coin pairs you want to train. ![Bulk Dialog](/docs/bulk_learn_popup.png)
5. Click OK and watch it go!
6. (optional) You can see some diagnostic logs in the console (F12 or ctrl-i). ![Bulk Logs](/docs/bulk_learn_logs.png)

## Export coin list (`export-coin-list.user.js`)
The `export-coin-list.user.js` script adds an export action for the allowed coin list to the hopper configuration page.

### Usage
1. Navigate to the hopper configuration page.
2. Click the Actions dropdown
3. You will see a new action called "Copy coinlist", clicking this will copy the selected coins list to the clipboard. ![Export Action](/docs/export_coinlist_action.png)