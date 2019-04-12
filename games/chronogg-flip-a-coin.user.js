// ==UserScript==
// @name         ChronoGG Flip a Coin
// @namespace    http://sergiosusa.com/
// @version      0.1
// @description  ChronoGG Auto Flip a Coin
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://chrono.gg
// @match        https://wwww.chrono.gg
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let chronoGG = new ChronoGG(0.01);
    chronoGG.flipACoin();
})();

function ChronoGG(hoursToReload) {

    this.hoursToReload = hoursToReload;

    this.flipACoin = () => {
        document.getElementById('reward-coin').click();
        this.reloadPage(this.hoursToReload)
    };

    this.reloadPage = (hours) => {
        setTimeout(function () {
            window.location.reload();
        }, hours * 60 * 60 * 1000);
    };
}
