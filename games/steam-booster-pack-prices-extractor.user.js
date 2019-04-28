// ==UserScript==
// @name         Steam Booster Pack Prices Extractor
// @namespace    https://sergiosusa.com
// @version      0.1
// @description  Extract the price of each available booster pack on steam.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://steamcommunity.com/*tradingcards/boostercreator/
// @grant GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';
    let extractor = new SteamBoosterPackPricesExtractor()
    extractor.render();
})();

function SteamBoosterPackPricesExtractor() {

    this.render = () => {
        let container = document.getElementsByClassName('goostatus_right')[0];
        let paragraph = document.createElement('p');
        paragraph.innerHTML = '<a id="extractButton" href="#">Extract List of Games with Prices</a>';
        container.appendChild(paragraph);

        let extractButton = document.getElementById('extractButton');
        extractButton.onclick = this.extract;
    };

    this.extract = () => {
        let htmlSelect = document.getElementById("booster_game_selector");
        let result = '';

        for (let i = 1; i < htmlSelect.options.length; i++) {

            let boosterNode = CBoosterCreatorPage.CreateBoosterOption(htmlSelect.options[i].value, false);
            if (boosterNode && boosterNode[0] !== undefined) {
                result += htmlSelect.options[i].text + '\t' + parseInt((/\d+\.*\d+/g).exec(boosterNode[0].innerText)[0].replace('.', '')) + '\n';
            }
        }
        GM_setClipboard(result);
        alert("List copied");
    };
};
