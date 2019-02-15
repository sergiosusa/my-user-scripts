// ==UserScript==
// @name         Steam Own Game Checker
// @namespace    http://sergiosusa.com/
// @version      0.2
// @description  Check against your steam library if you have already got the game
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.gogobundle.com/latest/bundles/*
// @match        https://www.humblebundle.com/games/*
// @match        https://www.indiegala.com/*
// @match        https://www.fanatical.com/*/bundle/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

const STEAM_API = '';
const STEAM_USER_ID = '76561198041196449';

(function () {
    'use strict';
    $.noConflict();

    var steamApi = new SteamAPI(STEAM_API);
    var checkerFactory = new CheckerFactory();
    var checker = checkerFactory.createChecker(getDomainFromCurrentUrl());

    steamApi.getOwnedGames(STEAM_USER_ID).then(
        function (games) {
            checker.check(games);
        }
    );
})();

function CheckerFactory() {

    this.createChecker = function (page) {

        let checker;

        switch (page) {
            case 'humblebundle':
                checker = new HumbleBundle();
                break;
            case 'indiegala':
                checker = new IndieGala();
                break;
            case 'gogobundle':
                checker = new GoGoBundle();
                break;

            case 'fanatical':
                checker = new Fanatical();
                break;
        }
        return checker;
    }
}

function Checker() {
    this.own = [];
    this.notOwn = [];

    this.compareGames = function (games, myGames) {

        for (var x = 0; x < games.length; x++) {
            var found = false;
            for (var y = 0; y < myGames.game_count; y++) {
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

    this.check = function (myGames) {
        var games = jQuery(".dd-image-box-white");

        this.compareGames(games, myGames);

        for (var x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#C92B2F', 'Own');
        }

        for (var y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    }

    this.addResult = function (item, color, text) {
        jQuery(item).parent().css('border-color', color);
        jQuery(item).parent().css('border-bottom-style', 'solid');
        jQuery(item).html(jQuery(item).html() + this.getHtmlSpanResult(color, text));
    }

    this.getHtmlSpanResult = function (color, text) {
        return '<span style="color:' + color + ';margin-left: 5px;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
    }
}


HumbleBundle.prototype = Object.create(Checker.prototype);

function IndieGala() {

    Checker.call(this);

    this.check = function (myGames) {
        var games = jQuery('.bundle-item-trading-cards-cont');
        this.compareGames(games, myGames);

        for (var x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#EA242A', 'Own');
        }

        for (var y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    }

    this.addResult = function (item, color, text) {
        jQuery(item).parent().parent().find('a').css('border-color', color);
        jQuery(item).parent().parent().find('a').css('border-bottom-style', 'solid');
        jQuery(item).parent().html(jQuery(item).parent().html() + this.getHtmlSpanResult(color, text));
    }

    this.getHtmlSpanResult = function (color, text) {
        return '<span style="color:' + color + ';margin-left: 0px;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
    }
}

IndieGala.prototype = Object.create(Checker.prototype);

function Fanatical() {

    Checker.call(this);

    this.check = function (myGames) {
        var games = jQuery('.card-overlay');
        this.compareGames(games, myGames);

        for (var x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x], '#D88000', 'Own');
        }

        for (var y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y], '#18a3ff', 'Not Own');
        }
    }

    this.addResult = function (item, color, text) {
        jQuery(item).parent().parent().find('.card-content').css('border-color', color);
        jQuery(item).parent().parent().find('.card-content').css('border-bottom-style', 'solid');
        jQuery(item).parent().parent().find('.card-icons-container').html(jQuery(item).parent().parent().find('.card-icons-container').html() + this.getHtmlSpanResult(color, text));
    }

    this.getHtmlSpanResult = function (color, text) {
        return '<span style="color:' + color + ';margin-left: 0px;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
    }
}

Fanatical.prototype = Object.create(Checker.prototype);

function GoGoBundle() {

    Checker.call(this);

    this.check = function () {

    }
}

GoGoBundle.prototype = Object.create(Checker.prototype);

function SteamAPI(steamApiKey) {
    const OWN_GAMES_ENDPOINT = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=[STEAM-API-ID]&steamid=[STEAM-USER-ID]&include_appinfo=1";

    this.steamApiKey = steamApiKey;

    this.getOwnedGames = function (steamUserId) {

        var that = this;

        return new Promise(function (resolve, reject) {

            jQuery.ajax({
                url: OWN_GAMES_ENDPOINT.replace('[STEAM-API-ID]', that.steamApiKey).replace('[STEAM-USER-ID]', steamUserId),
                dataType: 'JSONP',
                type: 'GET',
                jsonp: 'jsonp',
                success: function (data) {
                    that.storeGames(steamUserId, data.response)
                    resolve(that.retrieveGames(steamUserId));
                },
                error: function () {
                    reject(null);
                }
            });
        });
    }

    this.storeGames = function (steamUserId, response) {
        localStorage.setItem(steamUserId, JSON.stringify(response));
    }

    this.retrieveGames = function (steamUserId) {
        return JSON.parse(localStorage.getItem(steamUserId))
    }
}

function getDomainFromCurrentUrl() {
    var matches = window.location.href.match(/https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})(\.[a-z]{2,6})/i);
    return matches[2];
}
