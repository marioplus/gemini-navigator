import './style.css';

// --- 配置常量 ---
const SCROLLER_SELECTOR = 'infinite-scroller[data-test-id="chat-history-container"]';
const MESSAGE_TAGS = ['user-query'];
const NAV_DATA_ATTR = 'data-gemini-nav-idx';

const PATHS = {
  up: "M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z",
  down: "M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z",
  bottom: "M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"
};

// --- 全局状态 ---
class NavState {
  static activeIdx = -1;
  static elements: HTMLElement[] = [];
}

// --- UI 组件引用 ---
let btnUp: HTMLButtonElement, btnDown: HTMLButtonElement, btnBottom: HTMLButtonElement, divider: HTMLDivElement, container: HTMLDivElement;

// --- 辅助函数 ---
function createSvgIcon(pathData: string): SVGSVGElement {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 -960 960 960");
  svg.setAttribute("style", "width:24px; height:24px; fill:currentColor; flex-shrink:0;");
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  return svg;
}

function updateBtnStatus() {
  if (!btnUp || !container) return;

  const scroller = document.querySelector(SCROLLER_SELECTOR);
  if (!scroller) return;

  const isAtBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 50;
  const canUp = NavState.activeIdx > 0;
  const canDown = NavState.activeIdx !== -1 && NavState.activeIdx < NavState.elements.length - 1 && !isAtBottom;
  const canBottom = !isAtBottom; // 只要没在底部，就允许显示“到底部”按钮

  // 更新各组件显隐
  btnUp.classList.toggle('hidden', !canUp);
  btnDown.classList.toggle('hidden', !canDown);
  btnBottom.classList.toggle('hidden', !canBottom);
  divider.classList.toggle('hidden', !canBottom);

  // 面板激活逻辑：必须有消息，且至少有一个按钮可见
  const hasVisibleAction = canUp || canDown || canBottom;
  container.classList.toggle('active', NavState.elements.length > 0 && hasVisibleAction);
}

// --- 核心追踪逻辑 ---
class MessageTracker {
  private mutationObs: MutationObserver;
  private intersectionObs: IntersectionObserver;

  constructor() {
    this.mutationObs = new MutationObserver(() => this.tagMessages());
    this.intersectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).getAttribute(NAV_DATA_ATTR) || "-1");
            if (idx !== -1) NavState.activeIdx = idx;
            updateBtnStatus();
          }
        });
      },
      { threshold: 0.5 }
    );
  }

  public start() {
    this.tagMessages();
    this.mutationObs.observe(document.body, { childList: true, subtree: true });
  }

  private tagMessages() {
    const scroller = document.querySelector(SCROLLER_SELECTOR);
    if (!scroller) return;

    const messages = Array.from(scroller.querySelectorAll(MESSAGE_TAGS.join(','))) as HTMLElement[];
    let changed = false;

    messages.forEach((el, index) => {
      if (el.getAttribute(NAV_DATA_ATTR) !== index.toString()) {
        el.setAttribute(NAV_DATA_ATTR, index.toString());
        this.intersectionObs.observe(el);
        changed = true;
      }
    });

    if (changed || NavState.elements.length !== messages.length) {
      NavState.elements = messages;
      updateBtnStatus();
    }
  }
}

// --- 导航执行 ---
function navigate(direction: 'up' | 'down' | 'bottom') {
  const scroller = document.querySelector(SCROLLER_SELECTOR) as HTMLElement;
  if (!scroller) return;

  if (direction === 'bottom') {
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
  } else {
    const currentIdx = NavState.activeIdx;
    let targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;

    if (targetIdx < 0) targetIdx = 0;
    if (targetIdx >= NavState.elements.length) targetIdx = NavState.elements.length - 1;

    const targetEl = NavState.elements[targetIdx];
    if (targetEl) {
      const targetPos = targetEl.offsetTop;
      scroller.scrollTo({ top: targetPos, behavior: 'smooth' });
      NavState.activeIdx = targetIdx;
    }
  }
  setTimeout(updateBtnStatus, 800);
}

// --- 初始化 UI ---
function initUI() {
  if (container) return;

  container = document.createElement('div');
  container.className = 'md3-nav-container';

  const createBtn = (pathKey: keyof typeof PATHS, label: string, onClick: () => void) => {
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

  document.addEventListener('scroll', (e) => {
    if (e.target instanceof HTMLElement && e.target.matches(SCROLLER_SELECTOR)) {
      updateBtnStatus();
    }
  }, { passive: true, capture: true });
}

// --- 启动脚本 ---
const tracker = new MessageTracker();
tracker.start();
initUI();
