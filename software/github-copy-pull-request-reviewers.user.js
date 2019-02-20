// ==UserScript==
// @name         Copy Github pull request reviewers.
// @namespace    https://sergiosusa.com/
// @version      0.1
// @description  Copy Github pull request reviewers.
// @author       You
// @match        https://github.com/*pull/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let graphicInterface = new GraphicInterface(new PullRequestReviewers());
    graphicInterface.render();

})();

function GraphicInterface(pullRequestReviewers) {

    this.render = () => {

        let container = document.querySelector("div.discussion-sidebar-item").parentNode.parentNode;
        container.innerHTML = this.html() + container.innerHTML;

        let copyBtn = document.getElementById('copy_btn');
        copyBtn.onclick = pullRequestReviewers.copy;
        let pasteBtn = document.getElementById('paste_btn');
        pasteBtn.onclick = pullRequestReviewers.paste;

        let clearBtn = document.getElementById('clear_btn');
        clearBtn.onclick = pullRequestReviewers.clear;

    };

    this.html = () => {

        let html = '<div style="border-bottom: 1px solid #e6ebf1;margin-bottom: -11px;text-align: center;padding-bottom: 6px;" class="discussion-sidebar-item sidebar-assignee js-discussion-sidebar-item">';

        let reviewersId = JSON.parse(localStorage.getItem('github_reviewers'));

        html+='<div style="margin-bottom: 5px;">';

        for (let x = 0; x < reviewersId.length; x++) {
            html+='<img class="avatar" src="https://avatars3.githubusercontent.com/u/'+ reviewersId[x] +'?s=40&amp;v=4" width="20" height="20">';
        }

        html+='</div>';

        html+= '<button type="button" id="copy_btn" class="btn btn-sm js-details-target" >Copy</button> ' +
            '<button type="button" id="paste_btn" class="btn btn-sm js-details-target" >Paste</button> ' +
            '<button type="button" id="clear_btn" class="btn btn-sm js-details-target" >Clear</button>' +
            '</div>';

        return html;

    }
}

function PullRequestReviewers() {
    this.copy = () => {

        document.querySelectorAll("div.sidebar-assignee > form > details")[0].setAttribute('open', '');


        setTimeout(() => {

            let reviewers = document.querySelectorAll('input[name="reviewer_user_ids[]"]');
            let reviewersId = [];

            for (let x = 0; x < reviewers.length; x++) {
                if (reviewers[x].parentNode.getAttribute("class").includes("selected")) {
                    reviewersId .push(reviewers[x].value);
                }
            }

            localStorage.setItem('github_reviewers', JSON.stringify(reviewersId));

        }, 1000);


        setTimeout(() => {
            document.querySelectorAll("div.sidebar-assignee > form > details")[0].removeAttribute('open');
        }, 2000);

    };

    this.paste = () => {

        document.querySelectorAll("div.sidebar-assignee > form > details")[0].setAttribute('open', '');

        setTimeout(() => {

            let reviewers = document.querySelectorAll('input[name="reviewer_user_ids[]"]');

            let reviewersId = JSON.parse(localStorage.getItem('github_reviewers'));

            for (let x = 0; x < reviewers.length; x++) {
                if (reviewersId.includes(reviewers[x].value) && !reviewers[x].parentNode.getAttribute("class").includes("selected")) {
                    reviewers[x].click();
                }
            }

        }, 1000);

        setTimeout(() => {
            document.querySelectorAll("div.sidebar-assignee > form > details")[0].removeAttribute('open');
        }, 2000);

    };

    this.clear = () => {
        document.querySelectorAll("div.sidebar-assignee > form > details")[0].setAttribute('open', '');

        setTimeout(() => {

            let reviewers = document.querySelectorAll('input[name="reviewer_user_ids[]"]');

            for (let x = 0; x < reviewers.length; x++) {
                if (reviewers[x].parentNode.getAttribute("class").includes("selected")) {
                    reviewers[x].click();
                }
            }

        }, 1000);


        setTimeout(() => {
            document.querySelectorAll("div.sidebar-assignee > form > details")[0].removeAttribute('open');
        }, 2000);
    }
}

