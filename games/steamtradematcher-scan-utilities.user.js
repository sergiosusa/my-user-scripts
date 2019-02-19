// ==UserScript==
// @name         Steam Trade Matcher Scan Utilities
// @namespace    https://sergiosusa.com
// @version      0.4
// @description  Bring some utilities to the Steam Trade Matcher results page.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        http://www.steamtradematcher.com/compare
// @match        https://www.steamtradematcher.com/compare
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';
    $.noConflict();

    let graphicInterface = new GraphicInterface(
        new SteamTradeMatcherUtilities()
    );
    graphicInterface.render();
})();

function SteamTradeMatcherUtilities() {

    this.BOT_USER_TYPE = '(Trade bot)';
    this.STM_USER_TYPE = '(STM user)';

    this.showAll = () => {
        this.showUserByType(null);
    };

    this.showTradeBots = () => {
        this.showUserByType(this.BOT_USER_TYPE);
    };

    this.showNonTradeBots = () => {
        this.showUserByType(this.STM_USER_TYPE);
    };

    this.showUserByType = (type) => {
        jQuery('.stm-user').each((index, item) => {

            let userType = jQuery(item).html();
            let traderNode = jQuery(item).parent().parent().parent();

            if (userType === type || type === null) {
                traderNode.show();
            } else {
                traderNode.hide();
            }
        });
    };

    this.orderByTradeQuantity = () => {
        let results = jQuery('#match-results > div');

        results.detach().sort(
            (a, b) => {
                let tradesA = jQuery(a).find('.match-container').length;
                let tradesB = jQuery(b).find('.match-container').length;

                return (tradesA < tradesB) ? ((tradesA < tradesB) ? 1 : 0) : -1;
            }
        );
        jQuery('#match-results').append(results);
    };

    this.openTrades = () => {
        let totalTrades = parseInt(jQuery('#totalTrades')[0].value);
        let secondsBetweenTrades = parseInt(jQuery('#secondsBetweenTrades')[0].value);

        if (isNaN(totalTrades)) {
            totalTrades = 3;
        }

        if (isNaN(secondsBetweenTrades)) {
            secondsBetweenTrades = 10;
        }

        let tradeButtons = jQuery('a div.trade-button:visible');

        if (tradeButtons.length < totalTrades) {
            totalTrades = tradeButtons.length;
        }

        let x = 0;
        let refreshIntervalId = setInterval(() => {
            if (x >= totalTrades) {
                clearInterval(refreshIntervalId);
                return;
            }
            tradeButtons[x].click();
            x++;
        }, 1000 * secondsBetweenTrades);
    };
}

function GraphicInterface(steamTradeMatcherUtilities) {

    this.steamTradeMatcherUtilities = steamTradeMatcherUtilities;

    this.render = () => {

        let progressDiv = document.getElementById('progress-div');
        let newElement = document.createElement('div');
        newElement.innerHTML = this.template();
        this.insertBefore(newElement, progressDiv);

        let showTradeBotsBtn = document.getElementById('show-trade-bots-btn');
        showTradeBotsBtn.onclick = () => {
            this.steamTradeMatcherUtilities.showTradeBots();
            return false;
        };

        let showNonTradeBotsBtn = document.getElementById('show-non-trade-bots-btn');
        showNonTradeBotsBtn.onclick = () => {
            this.steamTradeMatcherUtilities.showNonTradeBots();
            return false;
        };

        let showAllBtn = document.getElementById('show-all-btn');
        showAllBtn.onclick = () => {
            this.steamTradeMatcherUtilities.showAll();
            return false;
        };

        let orderByBtn = document.getElementById('order-by-trade-quantity-btn');
        orderByBtn.onclick = () => {
            this.steamTradeMatcherUtilities.orderByTradeQuantity();
            return false;
        };

        let openTradeBtn = document.getElementById('open-trades-btn');
        openTradeBtn.onclick = () => {
            this.steamTradeMatcherUtilities.openTrades();
            return false;
        };

        let numTradesInput = document.getElementById('totalTrades');
        numTradesInput.onclick = () => {
            event.stopPropagation();
            return false;
        };

        let secondsBetweenTrades = document.getElementById('secondsBetweenTrades');
        secondsBetweenTrades.onclick = () => {
            event.stopPropagation();
            return false;
        };
    };

    this.insertBefore = (newNode, referenceNode) => {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    };

    this.insertAfter = (newNode, referenceNode) => {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    this.template = () => {
        return '<div class="panel panel-default" id="utilities-div">' +
            '<div class="panel-heading">' +
            '<h3 class="panel-title">Filter Utilities</h3>' +
            '</div>' +
            '<div class="panel-body"> ' +
            '<div id="show-trade-bots-btn" class="trade-button">Show trade bots</div>' +
            '<div id="show-non-trade-bots-btn" class="trade-button">Show non trade bots</div>' +
            '<div id="show-all-btn" class="trade-button">Show all</div>' +
            '<hr>' +
            '<div id="order-by-trade-quantity-btn" class="trade-button">Order by trade quantity</div>' +
            '<hr>' +
            '<div id="open-trades-btn" class="trade-button">Open the first <input style="width: 23px;height: 23px;" id="totalTrades" type="text" value="3" > trades each seconds <input style="width: 23px;height: 23px;" id="secondsBetweenTrades" type="text" value="10" >.</div>' +
            '</div>' +
            '</div>';
    }
}
