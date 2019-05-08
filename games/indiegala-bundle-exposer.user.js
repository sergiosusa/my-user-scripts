// ==UserScript==
// @name         Indiegala Bundles' Exposer
// @namespace    https://sergiosusa.com
// @version      0.4
// @description  Reveal and copy each game of a indiegala's bundle.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.indiegala.com/gift?gift_id=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// ==/UserScript==

(function () {
    'use strict';
    $.noConflict();

    checkIfReady().then(
        () => {
            let exposer = new IndieGalaExposer();
            insertGraphicElements(exposer);
        }
    );
})();

function checkIfReady() {

    if (jQuery("#gift-validation-btn").length > 0) {

        return new Promise((resolve) => {

            let intervalId = setInterval(() => {
                    if (jQuery("div.gift-contents-password-cont[style='display: none;']").length > 0) {
                        clearInterval(intervalId);
                        resolve();
                    }
                }, 3000
            );
        });
    } else {
        return Promise.resolve();
    }
}

function IndieGalaExposer() {

    let that = this;

    this.revealAndCopy = () => {
        that.reveal().then(() => {
            that.copy();
        })
    };

    this.reveal = () => {

        return new Promise((resolve) => {

            let revealButtons = jQuery('a.create-permalink-btn');
            let x = 0;

            let revealIntervalId = setInterval(() => {

                if (x === revealButtons.length) {
                    clearInterval(revealIntervalId);
                    resolve();
                    return;
                }
                revealButtons[x].click();
                x++;

            }, 2000);
        });
    };

    this.copyToExcel = () => {
        let titles = document.querySelectorAll('h4.title_game');
        let serials = document.querySelectorAll('input.keys');
        let list = [];

        for(let x = 0; x < titles.length; x++) {
            list.push(titles[x].innerText + '\t' + serials[x].value);
        }

        GM_setClipboard(list.join('\n'));
        alert("Seriales copiados al portapapeles");
    };

    this.copy = () => {

        let serials = [];
        let inputSerials = jQuery('input.keys');

        for (let x = 0; x < inputSerials.length; x++) {
            serials.push(inputSerials[x].value);
        }

        GM_setClipboard(serials.join());
        alert("Seriales copiados al portapapeles");
    }
}

function insertGraphicElements(revealer) {
    let buttonContainer = jQuery('#indie_gala_2 > div')[0];
    let anchor = document.createElement('a');
    anchor.innerHTML = '( Reveal and Copy )';
    anchor.href = '#';
    anchor.style.color='#EC2028';
    anchor.style.fontWeight = 'bold';
    anchor.onclick = revealer.revealAndCopy;
    buttonContainer.append(anchor);

    let copyAnchor = document.createElement('a');
    copyAnchor.innerHTML = '( Copy )';
    copyAnchor.href = '#';
    copyAnchor.style.color='#EC2028';
    copyAnchor.style.fontWeight = 'bold';
    copyAnchor.onclick = revealer.copy;
    buttonContainer.append(copyAnchor);

    let copyExcelAnchor = document.createElement('a');
    copyExcelAnchor.innerHTML = '( Copy To Excel )';
    copyExcelAnchor.href = '#';
    copyExcelAnchor.style.color='#EC2028';
    copyExcelAnchor.style.fontWeight = 'bold';
    copyExcelAnchor.onclick = revealer.copyToExcel;
    buttonContainer.append(copyExcelAnchor);
}

/***********************************************************
 *  Override Functions
 **********************************************************/

let confirm = window.confirm;
unsafeWindow.confirm = function (message, callback, caption) {
    return true;
};
