// ==UserScript==
// @name         AutoJoin IndieGala Giveaways
// @namespace    http://sergiosusa.com
// @version      0.14
// @description  Autojoin for IndieGala Giveaways!
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://www.indiegala.com/giveaways*
// @grant        none
// ==/UserScript==

/******* Global Variables *******/
var reloading = 900000;
/******* Script Variables *******/
var intervalId;
/*******************************/

(function () {
    'use strict';

    let indiegalaGiveaways = new IndiegalaGiveaways();
    indiegalaGiveaways.render();

    setTimeout(
        indiegalaGiveaways.tryToJoinGiveaways
        , 10000);

})();


function IndiegalaGiveaways() {
    this.render = () => {

        if (window.location.href !== 'https://www.indiegala.com/giveaways') {
            return;
        }

        if (document.getElementsByTagName('h1')[0].innerText === '500 Internal Server Error') {
            window.location = this.load('last_redirected_page', location);
        }

        let html =
            '<div class="row no-margin no-padding" style="margin-top: 5px;">' +
            '   <div class="col-xs-12 col-xs-12-under-650 filter-giv-mobile">' +
            '       <div class="row">' +
            '           <div class="col-xs-2 mobile-3-elements" style="float:none;margin: 0 auto;">' +
            '               <div class="sort-item">' +
            '                   <a id="joinButton" href="#" class="palette-background-5 btn-sort">Join</a>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';


        let voteContent = document.querySelectorAll("div.giveaways > div > div > div.sort-menu.palette-background-1 > div")[0];
        let div = document.createElement('div');
        div.innerHTML = html;
        voteContent.appendChild(div);

        let joinButton = document.getElementById("joinButton");
        joinButton.onclick = this.startJoin;
    };

    this.startJoin = () => {
        this.store('indiegala-auto-join', true);
        let maxLevel = this.getMaxLevel();
        this.store('indiegala-auto-join-level', maxLevel);
        this.redirectToPage(1, maxLevel);
    };

    this.getMaxLevel = () => {
        return document.querySelectorAll("#ajax_get_user_data > div:nth-child(3) > span")[0].innerText;
    };

    this.tryToJoinGiveaways = () => {
        if (this.load('indiegala-auto-join') === true && window.location.href.indexOf('/expiry/asc/level/') !== -1) {

            if (!this.haveEnoughCoins()) {
                this.tryAgainAfter(reloading);
                return;
            }

            this.removeExtraOddsGiveaways();
            this.joinGiveaways().then(this.goToNextPage);

        }
    };

    this.goToNextPage = () => {

        let nextPage = parseInt((/(?:.*)\/giveaways\/(\d+)/g).exec(window.location.href)[1]) + 1;

        if (nextPage > this.calculateLastPage()) {

            let newLevel = this.load("indiegala-auto-join-level");
            newLevel = newLevel - 1;

            if (newLevel < 0) {
                newLevel = this.getMaxLevel();
            }

            this.store("indiegala-auto-join-level", newLevel);
            nextPage = 1;
        }

        this.redirectToPage(nextPage, this.load('indiegala-auto-join-level'));
    };

    this.calculateLastPage = () => {
        let lastPage = 1;

        if (document.querySelectorAll("div.page-nav div.page-link-cont:last-child a")[0] !== undefined) {
            lastPage = parseInt(
                (/(?:.*)\/giveaways\/(\d+)/g).exec(document.querySelectorAll("div.page-nav div.page-link-cont:last-child a")[0].href)[1]
            );
        }
        return lastPage;
    };

    this.joinGiveaways = () => {

        return new Promise((resolve) => {
            let giveawayButtons = document.querySelectorAll('aside.animated-coupon');

            if (giveawayButtons.length > 0) {

                let index = 0;

                intervalId = setInterval(function () {

                    giveawayButtons[index].click();
                    index++;

                    if (index >= giveawayButtons.length) {
                        clearInterval(intervalId);
                        resolve();
                    }

                }, 2000);
            } else {
                resolve();
            }

        });
    };

    this.tryAgainAfter = (minutes) => {
        setInterval(function () {
            window.location.reload();
        }, minutes * 60 * 1000);
    };

    this.haveEnoughCoins = () => {
        document.querySelectorAll("div.account-galamoney img:last-child")[1].remove();
        let coins = document.querySelectorAll('div.account-galamoney')[2].innerText.replace('GalaSilver', '').trim();
        return coins > 0;
    };

    this.removeExtraOddsGiveaways = () => {

        let giveaways = document.getElementsByClassName("extra-type");

        for (let i = 0; i < giveaways.length; i++) {
            if (giveaways[i].innerText.trim() === 'EXTRA ODDS') {
                giveaways[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
        }

    };

    this.redirectToPage = (page, level) => {
        let location = 'https://www.indiegala.com/giveaways/[NUM_PAGE]/expiry/asc/level/[MIN_LEVEL]'.replace('[NUM_PAGE]', page).replace('[MIN_LEVEL]', level);
        this.store('last_redirected_page', location);
        window.location = location;
    };

    this.store = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    this.load = key => JSON.parse(localStorage.getItem(key))

}

/***********************************************************
 *  Override Functions
 **********************************************************/
window.confirm = function (message, callback, caption) {
    return true;
};
