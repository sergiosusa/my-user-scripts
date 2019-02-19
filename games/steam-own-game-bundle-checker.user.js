// ==UserScript==
// @name         Steam Own Game Bundle Checker
// @namespace    https://sergiosusa.com/
// @version      0.2
// @description  Check against your games library if you have already got the game (sites support: humblebundle, indiegala, fanatical, bunchkeys).
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.bunchkeys.com/*
// @match        https://www.humblebundle.com/games/*
// @match        https://www.indiegala.com/*
// @match        https://www.fanatical.com/*/bundle/*
// @match        https://otakubundle.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

const STEAM_API = '';
const STEAM_USER_ID = '76561198041196449';

(function () {
    'use strict';
    $.noConflict();

    let steamApi = new SteamAPI(STEAM_API);
    let checkerFactory = new CheckerFactory();
    let checker = checkerFactory.createChecker(getDomainFromCurrentUrl());

    steamApi.getOwnedGames(STEAM_USER_ID).then(
        (games) => {
            checker.check(games);
        }
    );
})();

function CheckerFactory() {

    this.createChecker = (page) => {
        let checker;

        switch (page) {
            case 'humblebundle':
                checker = new HumbleBundle();
                break;
            case 'indiegala':
                checker = new IndieGala();
                break;
            case 'fanatical':
                checker = new Fanatical();
                break;
            case 'bunchkeys':
                checker = new BunchKeys();
                break;
            case 'otakubundle':
                checker = new OtakuBundle();
                break;
        }
        return checker;
    }
}

function Checker() {
    this.own = [];
    this.notOwn = [];

    this.compareGames = (games, myGames) => {

        for (let x = 0; x < games.length; x++) {
            let found = false;
            for (let y = 0; y < myGames.game_count; y++) {
                if (myGames.games[y].name.trim().toLowerCase() === games[x].innerText.trim().toLowerCase()) {
                    this.own.push(games[x]);
                    found = true;
                }
            }
            if (!found) {
                this.notOwn.push(games[x]);
            }
        }
    }
}

function HumbleBundle() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = jQuery(".dd-image-box-white");

        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#C92B2F', 'Own');
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    };

    this.addResult = (item, color, text) => {
        jQuery(item).parent().css('border-color', color);
        jQuery(item).parent().css('border-bottom-style', 'solid');
        jQuery(item).html(jQuery(item).html() + this.getHtmlSpanResult(color, text));
    };

    this.getHtmlSpanResult = (color, text) => {
        return '<span style="color:' + color + ';margin-left: 5px;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
    }
}

HumbleBundle.prototype = Object.create(Checker.prototype);

function IndieGala() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = jQuery('.bundle-item-trading-cards-cont');
        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#EA242A', 'Own');
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    };

    this.addResult = (item, color, text) => {
        jQuery(item).parent().parent().find('a').css('border-color', color);
        jQuery(item).parent().parent().find('a').css('border-bottom-style', 'solid');
        jQuery(item).parent().html(jQuery(item).parent().html() + this.getHtmlSpanResult(color, text));
    };

    this.getHtmlSpanResult = (color, text) => {
        return '<span style="color:' + color + ';margin-left:0;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
    }
}

IndieGala.prototype = Object.create(Checker.prototype);

function Fanatical() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = jQuery('.card-overlay');
        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#D88000', 'Own');
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    };

    this.addResult = (item, color, text) => {
        jQuery(item).parent().parent().find('.card-content').css('border-color', color);
        jQuery(item).parent().parent().find('.card-content').css('border-bottom-style', 'solid');
        jQuery(item).parent().parent().find('.card-icons-container').html(jQuery(item).parent().parent().find('.card-icons-container').html() + this.getHtmlSpanResult(color, text));
    };

    this.getHtmlSpanResult = (color, text) => {
        return '<span style="color:' + color + ';margin-left:0;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
    }
}

Fanatical.prototype = Object.create(Checker.prototype);

function BunchKeys() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = jQuery('div[data-packed="true"] > h5 > span[style="color:#FFFFFF;"] > span[style="font-size:19px;"]')
        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#D88000', 'Own');
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    };

    this.addResult = (item, color, text) => {
        jQuery(item).parent().parent().parent().parent().find('div[data-mesh-internal="true"] > div').css('border-color', color);
        jQuery(item).parent().parent().parent().parent().find('div[data-mesh-internal="true"] > div').css('border-bottom-style', 'solid');
        jQuery(item).parent().parent().parent().html(jQuery(item).parent().parent().parent().html() + this.getHtmlSpanResult(color, text));
    };

    this.getHtmlSpanResult = (color, text) => {
        return '<span style="color:' + color + ';margin-left:0;font-weight: bold;display: block;width: 100%;text-align: center;">(' + text + ')</span>';
    }
}

BunchKeys.prototype = Object.create(Checker.prototype);

function OtakuBundle() {
    Checker.call(this);

    this.check = (myGames) => {
        let games = jQuery('h5.title');
        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#EE3737', 'Own');
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#1A697B', 'Not Own');
        }
    }

    this.addResult = (item, color, text) => {
        jQuery(item).parent().css('border-color', color);
        jQuery(item).parent().css('border-bottom-style', 'solid');
        jQuery(item).parent().html(jQuery(item).parent().html() + this.getHtmlSpanResult(color, text));
    };

    this.getHtmlSpanResult = (color, text) => {
        return '<span style="color:' + color + ';margin-left:0;font-weight: bold;display: block;width: 100%;text-align: center;">(' + text + ')</span>';
    }
}

OtakuBundle.prototype = Object.create(Checker.prototype);

function SteamAPI(steamApiKey) {
    const OWN_GAMES_ENDPOINT = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=[STEAM-API-ID]&steamid=[STEAM-USER-ID]&include_appinfo=1";

    this.steamApiKey = steamApiKey;

    this.getOwnedGames = (steamUserId) => {
        let that = this;

        return new Promise((resolve, reject) => {

            jQuery.ajax({
                url: OWN_GAMES_ENDPOINT.replace('[STEAM-API-ID]', that.steamApiKey).replace('[STEAM-USER-ID]', steamUserId),
                dataType: 'JSONP',
                type: 'GET',
                jsonp: 'jsonp',
                success: (data) => {
                    that.storeGames(steamUserId, data.response);
                    resolve(that.retrieveGames(steamUserId));
                },
                error: () => {
                    reject(null);
                }
            });
        });
    };

    this.storeGames = (steamUserId, response) => {
        localStorage.setItem(steamUserId, JSON.stringify(response));
    };

    this.retrieveGames = steamUserId => JSON.parse(localStorage.getItem(steamUserId))
}




function getDomainFromCurrentUrl() {
    let matches = window.location.href.match(/https?:\/\/(www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256})(\.[a-z]{2,6})/i);
    return matches[2];
}
