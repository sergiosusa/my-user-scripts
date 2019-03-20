// ==UserScript==
// @name         Auto Leveling Alienware
// @namespace    http://sergiosusa.com/
// @version      0.1
// @description  try to take over the world!
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://*.alienwarearena.com/forums/
// @match        https://*.alienwarearena.com/forums/board/*
// @match        https://*.alienwarearena.com/ucf/show/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let alienware = new Alienware();

    if (window.location.href === 'https://eu.alienwarearena.com/forums/' || window.location.href === 'https://na.alienwarearena.com/forums/') {
        alienware.render();

        if (alienware.load('vote_started') == true) {

            setTimeout(() => {
                alienware.selectRandomForm();
            }, 4000);


        }

    } else if (window.location.href.indexOf('https://eu.alienwarearena.com/forums/board/') !== -1 || window.location.href.indexOf('https://na.alienwarearena.com/forums/board/') !== -1) {
        if (alienware.load('vote_started') == true) {

            setTimeout(() => {
                alienware.selectRamdomThreat();
            }, 4000);

        }
    } else if (window.location.href.indexOf('https://eu.alienwarearena.com/ucf/show/') !== -1 || window.location.href.indexOf('https://na.alienwarearena.com/ucf/show/') !== -1) {
        if (alienware.load('vote_started') == true) {

            setTimeout(() => {

                if (document.querySelector("#arp-toast > div.toast-body > table:nth-child(2) > tbody > tr:nth-child(2) > td.text-center").innerText === "20 of 20") {
                    alienware.store('vote_started', false);
                } else {
                    alienware.vote();
                }

                setTimeout(() => {
                    window.location.href = 'https://na.alienwarearena.com/forums/';
                }, 4000);

            }, 4000);
        }
    }

})();


function Alienware() {

    this.render = () => {

        let voteContent = document.querySelector("#arp-toast > div.toast-body > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(1)");
        let a = document.createElement('a');
        a.onclick = this.startVoting;
        a.href = '#';
        a.style.paddingLeft = "10px";
        a.innerHTML = 'Auto';
        voteContent.appendChild(a);

        let dailyQuest = document.querySelector("#arp-toast > div.toast-body > table:nth-child(1) > tbody > tr > td:nth-child(1)");

        let b = document.createElement('a');
        b.href = '#';
        b.style.paddingLeft = "10px";
        b.innerHTML = 'Auto';
        dailyQuest.appendChild(b);

        if (dailyQuest.innerText === 'Converse and be Merry!'){
            b.onclick = this.startPosting;
        } else if (dailyQuest.innerText === 'Extra! Extra! Read all about it!') {
            b.onclick = this.openNews;
        }

    };

    this.startPosting = () => {
        this.store('posting_started', true);
    };

    this.startVoting = () => {
        this.store('vote_started', true);
        this.selectRandomForm();
    };

    this.openNews = () => {

        window.open('https://uk.alienwarearena.com/ucf/show/1831688/boards/gaming-news/News/paladins-announces-battle-royale-game-mode-named-battlegrounds', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1831365/boards/gaming-news/News/publisher-of-lawbreakers-written-off-the-game-and-the-guilt-of-poor-sales-moved-to-pubg', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1830476/boards/gaming-news/News/hellbound-in-the-news', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1831200/boards/gaming-news/News/the-most-interesting-new-games-01-2018', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1831120/boards/gaming-news/News/steam-reveals-2017s-biggest-earners-including-the-witcher-3-h1z1-and-pubg', '_blank');

    };

    this.selectRandomForm = () => {

        let forum = document.querySelectorAll("div.forum-heading > strong > a");
        let numForum = Math.floor((Math.random() * forum.length));
        forum[numForum].click();
    };

    this.selectRamdomThreat = () => {
        let threat = document.getElementsByClassName("board-topic-title");
        let numThreat = Math.floor((Math.random() * threat.length) );
        threat[numThreat].click();
    };

    this.vote = () => {
        document.getElementsByClassName("up-vote")[0].click();
    };

    this.store = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    this.load = key => JSON.parse(localStorage.getItem(key))

}
