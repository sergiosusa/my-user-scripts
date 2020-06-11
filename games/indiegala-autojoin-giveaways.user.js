// ==UserScript==
// @name         AutoJoin IndieGala Giveaways
// @namespace    http://sergiosusa.com
// @version      0.18
// @description  Autojoin for IndieGala Giveaways!
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://www.indiegala.com/giveaways*
// @grant        none
// ==/UserScript==

/******* Global Variables *******/
var reloading = 30;
var minLevelInterface = 3;
var minCoins = 50;
var intentos = 0;
/******* Script Variables *******/
var intervalId;

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

        let errorMessage = document.getElementsByTagName('h1');
        if (errorMessage.length > 0 && errorMessage[0].innerText === '500 Internal Server Error') {
            window.location = this.load('last_redirected_page', location);
        }

        let html =
            '<div style="margin: 0 auto;width: 100px;" class="page-slider-title bg-gradient-red"><a style="color:white;" id="joinButton" href="#" class="palette-background-5 btn-sort">Join</a></div>';

        let voteContent = document.querySelectorAll('.page-subtitle')[0];
        let div = document.createElement('div');
        div.innerHTML = html;
        voteContent.appendChild(div);

        let joinButton = document.getElementById("joinButton");
        joinButton.onclick = this.startJoin;

        setTimeout(this.startJoin, 1000 * 30);
    };

    this.startJoin = () => {
        this.store('indiegala-auto-join', true);
        let maxLevel = this.getMaxLevel();
        this.store('indiegala-auto-join-level', maxLevel);
        this.redirectToPage(1, maxLevel);
    };

    this.getMaxLevel = () => {
        return 5;
    };

    this.tryToJoinGiveaways = () => {
        if (this.load('indiegala-auto-join') === true && window.location.href.indexOf('/expiry/asc/level/') !== -1) {

            if (!this.haveGiveawaysAvailable()) {
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

            if (newLevel < 0 || newLevel < this.getMaxLevel() - minLevelInterface) {
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


            let giveawayButtons = document.querySelectorAll('div.items-list-item-data-cont.items-list-item-ticket > div > a.items-list-item-ticket-click[href="#"]');

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

    this.haveGiveawaysAvailable = () => {
        return true;
    };

    this.removeExtraOddsGiveaways = () => {

        let giveaways = document.getElementsByClassName("extra-odds");

        for (let i = 0; i < giveaways.length; i++) {
            giveaways[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
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
