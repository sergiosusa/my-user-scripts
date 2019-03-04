// ==UserScript==
// @name         My Amazon Affiliate
// @namespace    https://sergiosusa.com
// @version      0.3
// @description  This script add my affiliate tag to all amazon.es product pages, thanks for your help.
// @author       Sergio Susa (https://sergiosusa.com)
// @match        https://www.amazon.es/*/dp/*
// @match        https://www.amazon.es/dp/*
// @match        https://www.amazon.es/*/gp/*
// @match        https://www.amazon.es/gp/*
// @exclude      https://www.amazon.es/gp/huc/*
// @grant        none
// ==/UserScript==

const AMAZON_AFFILIATE_ID = 'sergiosusa-21';

(function () {
    'use strict';

    let originalUrl = document.URL;

    if (!originalUrl.includes('tag=' + AMAZON_AFFILIATE_ID)) {
        window.location.href = updateQueryStringParameter(originalUrl, "tag", AMAZON_AFFILIATE_ID);
    }
})();

function updateQueryStringParameter(uri, key, value) {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2");
    } else {
        return uri + separator + key + "=" + value;
    }
}
