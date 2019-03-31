// ==UserScript==
// @name         Auto Leveling Alienware
// @namespace    http://sergiosusa.com/
// @version      0.1
// @description  try to take over the world!
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://*.alienwarearena.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let alienware = new Alienware();
    alienware.render();
    alienware.execute();

})();


function Alienware() {

    this.execute = () => {
        let relativePath = (/https:\/\/.{2}\.alienwarearena.com(.*)/g).exec(window.location.href)[1];
        this.executeProfileBorderChange(relativePath);
        this.executeUpdateAboutMe(relativePath);
        this.executeAutoVoting(relativePath);
    };

    this.executeUpdateAboutMe = (relativePath) => {

        if (relativePath === '/account' && this.load('modify_about_me_started') === true) {
            document.getElementById("user_account_model_about").value += '.';
            this.store('modify_about_me_started', false);
            document.querySelectorAll(" button[type='submit']")[0].click();
        }

    };

    this.executeProfileBorderChange = (relativePath) => {

        if (relativePath === '/account/border' && this.load('border_started') === true) {
            let bordersList = document.querySelectorAll("#border-list > li > div:not(.unavailable):not(.border-active)");
            let randomBorder = Math.floor((Math.random() * bordersList.length));
            bordersList[randomBorder].click();
            this.store('border_started', false);
            document.getElementById("btn-save-borders").click();
        }
    };

    this.executeAutoVoting = (relativePath) => {

        if (this.load('vote_started') === true) {

            if (relativePath === '/forums/') {
                setTimeout(() => {
                    this.goToRandomForum();
                }, 4000);
            } else if (relativePath.indexOf('/forums/board/') !== -1) {
                setTimeout(() => {
                    this.goToRandomThread();
                }, 4000);

            } else if (relativePath.indexOf('/ucf/show/') !== -1) {

                setTimeout(() => {
                    if (document.querySelector("#arp-toast > div.toast-body > table:nth-child(2) > tbody > tr:nth-child(2) > td.text-center").innerText === "20 of 20") {
                        this.store('vote_started', false);
                    } else {
                        this.upVote();
                    }

                    setTimeout(() => {
                        window.location.href = 'https://na.alienwarearena.com/forums/';
                    }, 4000);

                }, 4000);
            } else {
                window.location.href = 'https://na.alienwarearena.com/forums/';
            }
        }
    };


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

        if (dailyQuest.innerText === 'Converse and be Merry!') {
            b.onclick = this.startPosting;
        } else if (dailyQuest.innerText === 'Extra Extra! Read all about it!') {
            b.onclick = this.openNews;
        } else if (dailyQuest.innerText === 'Border Swap!') {
            b.onclick = this.changeProfileBorder;
        } else if (dailyQuest.innerText === 'Add your favorite #letsplay video!') {
            b.onclick = this.goToVideoPage;
        } else if (dailyQuest.innerText === 'Soon™ (Need help? Visit the forums)') {
            b.onclick = this.goToAwaInformationPage;
        } else if (dailyQuest.innerText === 'It\'s already been 10 years.  wow! (Need help? Visit the forums)') {
            b.onclick = this.goTo10YearsPost;
        } else if (dailyQuest.innerText === 'Let\'s know more about you. (Update your about me in your account settings)') {
            b.onclick = this.goToAboutMe;
        }  else if (dailyQuest.innerText === 'It cost you nothing to answer the call. (Need help? Visit the forums)') {
            b.onclick = this.goToAnswerTheCall;
        }  else if (dailyQuest.innerText === 'Late to the party, but too late? (Need help? Visit the forums)') {
            b.onclick = this.goToParty;
        }

        dailyQuest.appendChild(b);
    };

    this.goToParty = () => {
        window.location.href = 'https://na.alienwarearena.com/ucf/show/1998176/boards/in-game-media-2/Video/firestorm-gameplay-and-impressions-battlefield-5';
    };

    this.goToAnswerTheCall = () => {
        window.location.href = 'https://eu.alienwarearena.com/ucf/show/1997482/boards/gaming-news/News/call-of-duty-mobile-will-be-free-and-exclusive-for-android-and-ios';
    };

    this.goToAboutMe = () => {
        this.store('modify_about_me_started', true);
        window.location.href = 'https://na.alienwarearena.com/account';

    };

    this.goTo10YearsPost = () => {
        window.location.href = 'https://eu.alienwarearena.com/ucf/show/1995478/boards/in-game-media-2/Video/evolution-of-minecraft-2009-2019';
    };

    this.startPosting = () => {
        this.store('posting_started', true);
    };

    this.startVoting = () => {
        this.store('vote_started', true);
        this.goToRandomForum();
    };

    this.goToVideoPage = () => {
        window.location.href = 'https://na.alienwarearena.com/ucf/Video/new?boardId=464';
    };

    this.goToAwaInformationPage = () => {
        window.location.href = 'https://na.alienwarearena.com/ucf/show/1995393/boards/awa-information/News/new-features-and-changes-coming-to-alienware-arena-in-2019';
    };

    this.changeProfileBorder = () => {
        this.store('border_started', true);
        window.location.href = 'https://na.alienwarearena.com/account/border';
    };

    this.openNews = () => {
        window.open('https://uk.alienwarearena.com/ucf/show/1831688/boards/gaming-news/News/paladins-announces-battle-royale-game-mode-named-battlegrounds', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1831365/boards/gaming-news/News/publisher-of-lawbreakers-written-off-the-game-and-the-guilt-of-poor-sales-moved-to-pubg', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1830476/boards/gaming-news/News/hellbound-in-the-news', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1831200/boards/gaming-news/News/the-most-interesting-new-games-01-2018', '_blank');
        window.open('https://uk.alienwarearena.com/ucf/show/1831120/boards/gaming-news/News/steam-reveals-2017s-biggest-earners-including-the-witcher-3-h1z1-and-pubg', '_blank');
    };

    this.goToRandomForum = () => {
        let forumLinks = document.querySelectorAll("div.forum-heading > strong > a");
        let randomForum = Math.floor((Math.random() * forumLinks.length));
        forumLinks[randomForum].click();
    };

    this.goToRandomThread = () => {
        let threadLinks = document.getElementsByClassName("board-topic-title");
        let randomThread = Math.floor((Math.random() * threadLinks.length));
        threadLinks[randomThread].click();
    };

    this.upVote = () => {
        let voteButtons = document.getElementsByClassName("up-vote");
        if (voteButtons.length > 0) {
            voteButtons[0].click();
        }
    };

    this.store = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    this.load = key => JSON.parse(localStorage.getItem(key))
}
