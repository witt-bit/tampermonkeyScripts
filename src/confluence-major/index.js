// ==UserScript==
// @name         Confluence 复制原始 pageId 链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 Confluence 页面顶部的导航栏插入"复制pageId链接"按钮，一键复制该页面的原始 pageId 链接（.../pages/viewpage.action?pageId=xxx）到剪贴板。
// @author       witt
// @match        https://*/*pages*
// @match        http://*/*pages*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 从当前 URL 路径中提取 pageId：/spaces/.../pages/710517128/... -> 710517128
  function getPageId() {
    const m = location.pathname.match(/\/pages\/(\d+)(?:\/|$)/);
    return m ? m[1] : null;
  }

  // 复制到剪贴板（优先现代 API，兜底 execCommand）
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function injectButton(pageId) {
    if (document.getElementById('copy-wiki-link-li')) return true; // 已注入
    // 优先定位头部右侧导航：.aui-header-inner .aui-header-secondary ul.aui-nav
    // 兜底：任意 ul.aui-nav（防止个别页面结构差异）
    const nav =
      document.querySelector('.aui-header-inner .aui-header-secondary ul.aui-nav') ||
      document.querySelector('ul.aui-nav');
    if (!nav) return false; // 元素未渲染，等待

    const li = document.createElement('li');
    li.id = 'copy-wiki-link-li';

    const btn = document.createElement('button');
    btn.id = 'copy-wiki-link-btn';
    btn.type = 'button';
    btn.className = 'aui-button aui-button-primary';
    btn.textContent = '复制pageId链接';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = `${location.origin}/pages/viewpage.action?pageId=${pageId}`;
      copyToClipboard(url)
        .then(() => flash(btn, '已复制 ✓'))
        .catch(() => flash(btn, '复制失败'));
    });

    li.appendChild(btn);
    nav.insertBefore(li, nav.firstChild); // 第一位插入
    return true;
  }

  // 等待 ul.aui-nav 出现（Confluence 部分内容异步渲染）
  function waitForNavAndInject(pageId) {
    if (injectButton(pageId)) return;
    let tries = 0;
    const timer = setInterval(() => {
      if (injectButton(pageId) || ++tries > 60) clearInterval(timer);
    }, 500);
  }

  function flash(btn, msg) {
    const old = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => (btn.textContent = old), 1500);
  }

  function init() {
    const pageId = getPageId();
    if (pageId) waitForNavAndInject(pageId);
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);

  // 兜底：部分跳转为前端路由，URL 变化后重新检测
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      init();
    }
  }, 1000);
})();