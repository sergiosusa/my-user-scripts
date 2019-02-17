// ==UserScript==
// @name         Massive Steam Game Activator
// @namespace    http://sergiosusa.com
// @version      0.4
// @description  Multiple games activation on your steam account via web.
// @author       Sergio Susa (http://sergiosusa.com) y David Jimenez (https://djimenez.me)
// @match        https://store.steampowered.com/account/registerkey*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';
    $.noConflict();

    let graphicInterface = new GraphicInterface(
        new SteamActivator()
    );

    graphicInterface.render();

})();

function SteamActivator() {
    this.activated = [];

    this.completeForm = () => {
        jQuery('#accept_ssa').prop('checked', true);
    };

    this.activate = () => {

        this.completeForm();

        let keyList = jQuery('#textarea-keys').val();

        if (null === keyList || "" === keyList) {
            alert("Please, enter a list of keys separated by ','.");
            return;
        }

        let keys = keyList.split(",");
        let that = this;

        let processId = setInterval(() => {

            if (keys.length === 0) {
                clearInterval(processId);

                let finishMessage = "The activation process has finished.\n\nNo game was activated";

                if (that.activated.length > 0) {
                    finishMessage = "The activation process has finished.\n\nThe following games have been activated:\n " + that.activated.join("\n");
                }

                alert(finishMessage);
                return;
            }

            let key = keys.shift();

            jQuery('#product_key')[0].value = key.trim();
            RegisterProductKey();

            setTimeout(
                () => {
                    let game = jQuery('div.registerkey_lineitem')[0].innerHTML;
                    if (that.activated.indexOf(game) === -1) {
                        that.activated.push(game);
                    }
                },
                3000);

        }, 5000);

    };
}

function GraphicInterface(steamActivator) {

    this.steamActivator = steamActivator;

    this.render = () => {
        let buttonContainer = jQuery("#registerkey_form div:nth-child(4)");
        buttonContainer.append('<br><label for="textarea-keys">Activate massive keys (Separated with comma)</label><textarea id="textarea-keys"></textarea>');
        let anchor = document.createElement('a');
        anchor.className += " btnv6_blue_hoverfade btn_medium";
        anchor.style = "margin-top: 15px";
        anchor.innerHTML = '<span>Activate massive keys</span>';
        anchor.href = "#";
        anchor.onclick = this.steamActivator.activate;
        buttonContainer.append('<br>');
        buttonContainer.append(anchor);
    }
}
