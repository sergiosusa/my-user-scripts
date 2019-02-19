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
        html = '<i class="fas fa-igloo"></i><div style="border-bottom: 1px solid #e6ebf1;margin-bottom: 15px;" class="discussion-sidebar-item sidebar-assignee js-discussion-sidebar-item"><span id="copy_btn"  style="cursor:pointer">Copy</span> - <span id="paste_btn" style="cursor:pointer">Paste</span></div>';
        container.innerHTML = html + container.innerHTML;

        let copyBtn = document.getElementById('copy_btn');
        copyBtn.onclick = pullRequestReviewers.copy;
        let pasteBtn = document.getElementById('paste_btn');
        pasteBtn.onclick = pullRequestReviewers.paste;
    }
}

function PullRequestReviewers() {
    this.copy = () => {

        setTimeout(() => {

            document.querySelectorAll("div.sidebar-assignee > form > details")[0].setAttribute('open', '');

        }, 500);


        setTimeout(() => {

            let reviewers = document.querySelectorAll('input[name="reviewer_user_ids[]"]');

            let reviewersId = [];

            for (let x = 0; x < reviewers.length; x++) {



                if (reviewers[x].parentNode.getAttribute("class").includes("selected")) {
                    reviewersId .push(reviewers[x].value);
                }

            }

            localStorage.setItem('github_reviewers', JSON.stringify(reviewersId));

        }, 2000);


        setTimeout(() => {

            document.querySelectorAll("div.sidebar-assignee > form > details")[0].removeAttribute('open');

        }, 3000);

    };

    this.paste = () => {


        setTimeout(() => {

            document.querySelectorAll("div.sidebar-assignee > form > details")[0].setAttribute('open', '');

        }, 500);


        setTimeout(() => {

            let reviewers = document.querySelectorAll('input[name="reviewer_user_ids[]"]');

            let reviewersId = JSON.parse(localStorage.getItem('github_reviewers'));

            for (let x = 0; x < reviewers.length; x++) {
                if (reviewersId.includes(reviewers[x].value) && !reviewers[x].parentNode.getAttribute("class").includes("selected")) {
                    reviewers[x].click();
                }
            }

        }, 2000);


        setTimeout(() => {

            document.querySelectorAll("div.sidebar-assignee > form > details")[0].removeAttribute('open');

        }, 3000);

    };
}

//xaf -> 994837


//$("div.sidebar-assignee > form > details[name='reviewer_user_ids[]']")


