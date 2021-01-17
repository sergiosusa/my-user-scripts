// ==UserScript==
// @name         Steam Trade Matcher Scan Utilities
// @namespace    https://sergiosusa.com
// @version      0.5
// @description  Bring some utilities to the Steam Trade Matcher results page.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.steamtradematcher.com/compare
// @match        https://www.steamtradematcher.com/tools/fullsets
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

var intervalId;

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

        if (window.location.href.includes('/tools/fullsets')) {
            intervalId = setInterval(function(){
                if (document.querySelector("#fullsets-calculator-progress").style.display=='none'){
                    document.querySelectorAll(".app-image-container").forEach(function(element){
                        var steamAppId = element.querySelector(".badge-link a").getAttribute('href').match(/https:\/\/steamcommunity\.com\/my\/gamecards\/(\d+)\//i)[1];
                        element.innerHTML = element.innerHTML + '<div class="badge-link center-block"><a target="_blank" href="https://www.steamcardexchange.net/index.php?inventorygame-appid-' + steamAppId + '"><img src="https://www.steamcardexchange.net/include/design/img/navbar-logo.png"/></a></div>';
                    });
                    clearInterval(intervalId);
                }

            },1000);
        }

        if (window.location.href.includes('/compare')){

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
        }
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
            '<h3 class="panel-title">Filter Results</h3>' +
            '</div>' +
            '<div class="panel-body" style="display:flex;flex-wrap: wrap;justify-content: center;">' +
            '<div id="show-trade-bots-btn" class="trade-button" style="margin-right: 5px;margin-left: 5px;">Only Trade Bots</div>' +
            '<div id="show-non-trade-bots-btn" class="trade-button" style="margin-right: 5px;margin-left: 5px;">Not Trade Bots</div>' +
            '<div id="show-all-btn" class="trade-button" style="margin-right: 5px;margin-left: 5px;">All</div>' +
            '<hr>' +
            '<div id="order-by-trade-quantity-btn" class="trade-button" style="margin-right: 5px;margin-left: 5px;">Order by trades quantity</div>' +
            '</div>' +
            '</div>';
    }
}
