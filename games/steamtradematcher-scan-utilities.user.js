// ==UserScript==
// @name         Steam Trade Matcher Scan Utilities
// @namespace    https://sergiosusa.com
// @version      0.6
// @description  Bring some utilities to the Steam Trade Matcher results page.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.steamtradematcher.com/compare
// @match        https://www.steamtradematcher.com/tools/fullsets
// @grant        none
// ==/UserScript==

var intervalId;

(function () {
    'use strict';
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
        document.querySelectorAll('.stm-user').forEach(function(item) {

            let userType = item.innerHTML;
            let traderNode = item.parentNode.parentNode.parentNode;

            if (userType === type || type === null) {
                traderNode.style.display = '';
            } else {
                traderNode.style.display = 'none';
            }
        });
    };

    this.orderByTradeQuantity = () => {
        let results = document.querySelectorAll('#match-results > div');
        let arrayNodes = [];

        results.forEach(function(item){
            item.parentElement.removeChild(item);
            arrayNodes.push(item);
        });

        arrayNodes.sort(
            (a, b) => {
                let tradesA = a.querySelectorAll('.match-container').length;
                let tradesB = b.querySelectorAll('.match-container').length;

                return (tradesA < tradesB) ? ((tradesA < tradesB) ? 1 : 0) : -1;
            }
        );

        arrayNodes.forEach(function(item){
            document.querySelector('#match-results').append(item);
        });
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
