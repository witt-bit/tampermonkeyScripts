// ==UserScript==
// @name         JIRA图片优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化JIRA中图片样式的展示
// @author       witt
// @match        http://jira.coolcollege.cn/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        div.issue-body-content .image-wrap img {
            width: 50%;
            max-width: 700px;
        }
    `);

})();