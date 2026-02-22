# Gemini 对话导航 (Gemini Navigation)

一个为 [Gemini](https://gemini.google.com/) 提供对话导航增强脚本。提供平滑、直观的高级导航体验。

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
