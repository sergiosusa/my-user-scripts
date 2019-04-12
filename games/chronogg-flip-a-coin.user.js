// ==UserScript==
// @name         ChronoGG Flip a Coin
// @namespace    http://sergiosusa.com/
// @version      0.3
// @description  ChronoGG Auto Flip a Coin
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://chrono.gg
// @match        https://wwww.chrono.gg
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let chronoGG = new ChronoGG(3);

    setTimeout(
        chronoGG.flipACoin,
        10 * 1000
    );

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
