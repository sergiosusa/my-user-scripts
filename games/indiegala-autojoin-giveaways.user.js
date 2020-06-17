// ==UserScript==
// @name         AutoJoin IndieGala Giveaways
// @namespace    http://sergiosusa.com
// @version      0.30
// @description  Autojoin for IndieGala Giveaways!
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://www.indiegala.com/giveaways*
// @grant        none
// ==/UserScript==

/******* Global Variables *******/
var reloading = 30;
var minLevelInterface = 3;
var minCoins = 15;
/******* Script Variables *******/
var intervalId;

(function () {
    'use strict';

    reloadWhenError500();

    let indiegalaGiveaways = new IndiegalaGiveaways();

    setTimeout(() => {
        indiegalaGiveaways.render();
        indiegalaGiveaways.tryToJoinGiveaways();

        setInterval(
            indiegalaGiveaways.tryToJoinGiveaways,
            1000 * 60 * reloading
        );

    }, 1000 * 10)

})();

function reloadWhenError500() {
    let errorMessage = document.getElementsByTagName('h1');
    if (errorMessage.length > 0 && errorMessage[0].innerText === '500 Internal Server Error') {
        window.location = 'https://www.indiegala.com/giveaways';
    }
}

function IndiegalaGiveaways() {
    this.render = () => {

        let action = 'Join';

        if (this.load('indiegala-auto-join') === true) {
            action = 'Stop';
        }

        let html =
            '<div style="margin: 0 auto;width: 100px;" class="page-slider-title bg-gradient-red"><a style="color:white;" id="joinButton" href="#" class="palette-background-5 btn-sort">' + action + '</a></div>';

        let voteContent = document.querySelectorAll('.page-subtitle')[0];
        let div = document.createElement('div');
        div.innerHTML = html;
        voteContent.appendChild(div);

        let joinButton = document.getElementById("joinButton");

        joinButton.onclick = this.startJoin;

        if (this.load('indiegala-auto-join') === true) {
            joinButton.onclick = this.stopJoin;
        }
    };

    this.startJoin = () => {
        this.store('indiegala-auto-join', true);
        this.store('indiegala-auto-join-level', this.getMaxLevel());
        window.location = 'https://www.indiegala.com/giveaways';
    };

    this.stopJoin = () => {
        this.store('indiegala-auto-join', false);
        window.location = 'https://www.indiegala.com/giveaways';
    };

    this.getMaxLevel = () => {
        return 5;
    };

    this.tryToJoinGiveaways = () => {

        if (this.load('indiegala-auto-join') === false) {
            return;
        }

        if (parseInt(document.querySelector('a.page-contents-list-submenu-current-level > span').innerText.replace('Level ', '')) !== this.load('indiegala-auto-join-level')){
            document.querySelector('ul.page-contents-list-submenu-level > li > a[onclick="setLevel(\'' + this.load('indiegala-auto-join-level') + '\', this, event)"]').click();
        }

        setTimeout(() => {
            this.joinGiveaways().then((value) => this.goToNextPage);
        }, 1000 * 5);


    }

    this.goToNextPage = (canContinue) => {

        if (!canContinue) {
            return;
        }

        if (document.querySelector('a.prev-next > i.fa-angle-right')) {
            document.querySelector('a.prev-next > i.fa-angle-right').parentElement.click();
        } else {
            let actualLevel = this.load('indiegala-auto-join-level');
            actualLevel = actualLevel - 1;

            if (actualLevel < 0 || actualLevel < this.getMaxLevel() - minLevelInterface) {
                actualLevel = this.getMaxLevel();
            }

            this.store('indiegala-auto-join-level', actualLevel);
            document.querySelector('ul.page-contents-list-submenu-level > li > a[onclick="setLevel(\'' + actualLevel + '\', this, event)"]').click();
        }
    }

    this.joinGiveaways = () => {

        return new Promise((resolve) => {

            let giveawayButtons = document.querySelectorAll('.page-contents-to-hide div.items-list-item-ticket a.items-list-item-ticket-click');

            if (giveawayButtons.length > 0) {

                let index = 0;

                intervalId = setInterval(function () {

                    giveawayButtons[index].click();
                    index++;

                    if (parseInt(document.querySelector('#galasilver-amount').innerText) < minCoins) {
                        clearInterval(intervalId);
                        resolve(false);
                    }

                    if (index >= giveawayButtons.length) {
                        clearInterval(intervalId);
                        resolve(true);
                    }

                }, 3000);
            } else {
                if (parseInt(document.querySelector('#galasilver-amount').innerText) < minCoins) {
                    resolve(false);
                }
                resolve(true);
            }

        });
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
