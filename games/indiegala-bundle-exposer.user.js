// ==UserScript==
// @name         Indiegala Bundles' Exposer
// @namespace    https://sergiosusa.com
// @version      0.5
// @description  Reveal and copy each game of a indiegala's bundle.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.indiegala.com/gift-bundle/*
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

    this.revealAndCopyExcel = () => {
        that.reveal().then(() => {
            that.copyToExcel();
        })
    };

    this.reveal = () => {

        return new Promise((resolve) => {

            let revealButtons = document.querySelectorAll("div.profile-private-page-library-serial-dialog > div > button.profile-private-page-library-get-serial-btn.bg-gradient-blue");
            let x = 0;

            let revealIntervalId = setInterval(() => {

                if (x === revealButtons.length) {
                    clearInterval(revealIntervalId);
                    resolve();
                    return;
                }
                revealButtons[x].click();
                x++;

            }, 4000)
        });
    };

    this.copyToExcel = () => {
        let titles = document.querySelectorAll('div.profile-private-page-library-title-row-full');
        let serials = document.querySelectorAll('input.profile-private-page-library-key-serial');
        let list = [];

        for(let x = 0; x < titles.length; x++) {
            list.push(titles[x].innerText + '\t' + serials[x].value);
        }

        GM_setClipboard(list.join('\n'));
        alert("Seriales copiados al portapapeles");
    };

    this.copy = () => {

        let serials = [];
        let inputSerials = jQuery('input.profile-private-page-library-key-serial');

        for (let x = 0; x < inputSerials.length; x++) {
            serials.push(inputSerials[x].value);
        }

        GM_setClipboard(serials.join());
        alert("Seriales copiados al portapapeles");
    }
}

function insertGraphicElements(revealer) {

    let manuContainer = document.querySelectorAll("nav.profile-private-page-library-menu > ul")[0];

    let emptyOption = document.createElement('li');
    emptyOption.innerHTML = '<div class="profile-private-page-library-menu-item-inner"><a href="#" onclick="return false"></a></div>';
    manuContainer.appendChild(emptyOption);

    let revealAndCopyOption = document.createElement('li');
    revealAndCopyOption.style.padding = "0 1px";
    revealAndCopyOption.innerHTML = '<li class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a id="revealCopybtn" href="#" onclick="return false">Reveal + Copy</a></div></li>';
    manuContainer.appendChild(revealAndCopyOption);

    let copyOption = document.createElement('li');
    copyOption.style.padding = "0 1px";
    copyOption.innerHTML = '<li class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a id="copybtn" href="#" onclick="return false">Copy</a></div></li>';
    manuContainer.appendChild(copyOption);

    let revealAndCopyExcelOption = document.createElement('li');
    revealAndCopyExcelOption.style.padding = "0 1px";
    revealAndCopyExcelOption.innerHTML = '<li class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a id="revealCopyExcelbtn" href="#" onclick="return false">Reveal + Copy Excel</a></div></li>';
    manuContainer.appendChild(revealAndCopyExcelOption);

    let copyExcelOption = document.createElement('li');
    copyExcelOption.style.padding = "0 1px";
    copyExcelOption.innerHTML = '<li class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a id="copyExcelbtn" href="#" onclick="return false">Copy Excel</a></div></li>';
    manuContainer.appendChild(copyExcelOption);


    let revealCopybtn= document.getElementById('revealCopybtn');
    revealCopybtn.onclick = revealer.revealAndCopy;
    let copybtn= document.getElementById('copybtn');
    copybtn.onclick = revealer.copy;
    let revealCopyExcelbtn= document.getElementById('revealCopyExcelbtn');
    revealCopyExcelbtn.onclick = revealer.revealAndCopyExcel
    let copyExcelbtn= document.getElementById('copyExcelbtn');
    copyExcelbtn.onclick = revealer.copyToExcel;

}

/***********************************************************
 *  Override Functions
 **********************************************************/

let confirm = window.confirm;
unsafeWindow.confirm = function (message, callback, caption) {
    return true;
};
