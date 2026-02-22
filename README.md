# Gemini 对话导航 (Gemini Navigation)

一个为 [Gemini](https://gemini.google.com/) 深度定制的对话导航增强脚本。提供平滑、直观的高级导航体验。

## 核心特性

- **🚀 章节级跳转**：以用户的“提问”作为章节锚点，实现精准的一键溯源，拒绝无意义的细碎跳转。
- **✨ MD3 美学**：采用 Material Design 3 设计语言，支持**玻璃拟态 (Glassmorphism)** 和动态阴影，优雅融入 Gemini 原生界面。
- **🧩 智能感知**：基于 `IntersectionObserver` 实时追踪阅读位置，导航面板随对话状态自动显隐。
- **🛡️ 极致稳定**：通过变量局部隔离与语义化标签锚定，彻底解决虚拟滚动导致的 ID 丢失和 UI 冲突问题。

## 功能说明

1. **上一条 (Up)**：跳转至上一个用户提问。
2. **下一条 (Down)**：跳转至下一个用户提问。
3. **到底部 (Bottom)**：一键触底，快速查看最新回复。

## 开发与安装

### 环境准备
- Node.js
- 脚本管理器 (Tampermonkey / Violentmonkey)

### 运行开发
```bash
npm install
npm run dev
```

### 构建交付
```bash
npm run build
```
生成的脚本文件位于 `dist/gemini-navigator.user.js`。

## 技术栈
- Vite + `vite-plugin-monkey`
- TypeScript (Vanilla)
- MD3 / CSS Variables Scope

## 协议
MIT
