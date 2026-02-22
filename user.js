// ==UserScript==
// @name         Gemini 智能导航 - 究极兼容稳定版
// @version      19.0
// @description  解决 TrustedHTML 报错，支持 MD3 动效，自动消除隐藏按钮间的残留间距
// @author       Gemini
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置常量 ---
    const SELECTOR = 'infinite-scroller[data-test-id="chat-history-container"]';
    const ICON_STAR_PATH = 'M-3.9000000953674316,-84.94999694824219';
    const PATHS = {
        up: "M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z",
        down: "M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z",
        bottom: "M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"
    };

    // --- 变量定义 ---
    let btnUp, btnDown, btnBottom, divider, container;
    let isAdjusting = false;
    let ticking = false;

    // --- 1. 原生 SVG 构造函数 (绕过 TrustedHTML) ---
    function createSvgIcon(pathData) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 -960 960 960");
        svg.setAttribute("style", "width:24px; height:24px; fill:currentColor; flex-shrink:0;");
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        svg.appendChild(path);
        return svg;
    }

    // --- 2. 注入优化样式 ---
    const style = document.createElement('style');
    style.textContent = `
        .md3-nav-container {
            position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
            z-index: 9999; display: flex; flex-direction: column; 
            padding: 8px; background-color: #f3f6fc; border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e0e2e6;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
            opacity: 0; pointer-events: none; visibility: hidden;
        }
        /* 激活状态 */
        .md3-nav-container.active { opacity: 0.4; pointer-events: auto; visibility: visible; }
        .md3-nav-container:hover { opacity: 1 !important; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        
        .md3-btn {
            width: 44px; height: 44px; border: none; border-radius: 16px;
            background-color: transparent; color: #444746; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden; 
            max-height: 44px; 
            margin: 4px 0; /* 使用 margin 代替父级的 gap */
            transform: scale(1); opacity: 1; outline: none; padding: 10px;
        }
        .md3-btn:hover { background-color: #dfe2eb; color: #1b1b1f; }
        .md3-btn:active { transform: scale(0.9); }

        /* 关键：隐藏状态下清除 margin 和高度，彻底消除间距 */
        .md3-btn.hidden { 
            max-height: 0; 
            margin-top: 0; 
            margin-bottom: 0; 
            padding-top: 0; 
            padding-bottom: 0; 
            opacity: 0; 
            transform: scale(0.6); 
            pointer-events: none; 
        }

        .md3-divider { 
            height: 1px; background-color: #c4c7c5; 
            margin: 4px 8px; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            opacity: 1;
        }
        .md3-divider.hidden { 
            opacity: 0; height: 0; margin-top: 0; margin-bottom: 0; 
        }
    `;
    document.head.appendChild(style);

    // --- 3. 逻辑处理函数 ---
    function getAnchorPositions(c) {
        // 通过寻找助理头像的星星路径定位回复起点
        const allIcons = Array.from(c.querySelectorAll('svg')).filter(svg => svg.outerHTML.indexOf(ICON_STAR_PATH) !== -1);
        return allIcons.map(svg => {
            const rect = svg.getBoundingClientRect();
            const containerRect = c.getBoundingClientRect();
            return rect.top - containerRect.top + c.scrollTop - 70;
        }).sort((a, b) => a - b);
    }

    function updateBtnStatus() {
        const c = document.querySelector(SELECTOR);
        if (!c || !btnUp) return;

        const now = c.scrollTop;
        const pos = getAnchorPositions(c);
        const isAtBottom = c.scrollTop + c.clientHeight >= c.scrollHeight - 30;

        // 按钮显隐切换
        btnUp.classList.toggle('hidden', !pos.some(p => p < now - 60));
        btnDown.classList.toggle('hidden', !pos.some(p => p > now + 60) || isAtBottom);
        btnBottom.classList.toggle('hidden', isAtBottom);
        divider.classList.toggle('hidden', isAtBottom);

        // 只有存在回复内容时才显示面板
        const anyVisible = pos.length > 0;
        container.classList.toggle('active', anyVisible);
    }

    function navigate(direction) {
        const c = document.querySelector(SELECTOR);
        if (!c) return;
        const pos = getAnchorPositions(c);
        const now = c.scrollTop;
        let target;

        if (direction === 'up') target = [...pos].reverse().find(p => p < now - 50);
        else if (direction === 'down') target = pos.find(p => p > now + 50);
        else target = c.scrollHeight;

        if (target !== undefined) {
            isAdjusting = true;
            c.scrollTo({ top: target, behavior: 'smooth' });
            // 滚动结束后强制同步一次状态
            setTimeout(() => { isAdjusting = false; updateBtnStatus(); }, 800);
        }
    }

    // --- 4. 初始化 UI 树 ---
    function initUI() {
        if (container) return;

        container = document.createElement('div');
        container.className = 'md3-nav-container';

        const createBtn = (pathKey, label, onClick) => {
            const btn = document.createElement('button');
            btn.className = 'md3-btn';
            btn.title = label;
            btn.onclick = onClick;
            btn.appendChild(createSvgIcon(PATHS[pathKey]));
            container.appendChild(btn);
            return btn;
        };

        btnUp = createBtn('up', '上一条', () => navigate('up'));
        btnDown = createBtn('down', '下一条', () => navigate('down'));

        divider = document.createElement('div');
        divider.className = 'md3-divider';
        container.appendChild(divider);

        btnBottom = createBtn('bottom', '到底部', () => navigate('bottom'));

        document.body.appendChild(container);

        // 帧率优化后的滚动监听
        document.addEventListener('scroll', (e) => {
            const c = document.querySelector(SELECTOR);
            if (c && e.target === c) {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateBtnStatus();
                        ticking = false;
                    });
                    ticking = true;
                }
            }
        }, { passive: true, capture: true });

        updateBtnStatus();
    }

    // --- 5. 哨兵：检测到首条助理回复后才注入 ---
    const observer = new MutationObserver((mutations, obs) => {
        // 使用高效的字符串搜索检测图标
        if (document.body.innerHTML.indexOf(ICON_STAR_PATH) !== -1) {
            initUI();
            obs.disconnect(); // 任务完成，停止观察
            console.log("Gemini Nav: UI 注入完成。");
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();