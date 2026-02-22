# Gemini 对话导航 (Gemini Navigation)

一个为 [Gemini](https://gemini.google.com/) 提供对话导航增强脚本。提供平滑、直观的高级导航体验。

## 功能说明

1. **上一条 (Up)**：跳转至上一个用户提问。
2. **下一条 (Down)**：跳转至下一个用户提问。
3. **到底部 (Bottom)**：一键触底，快速查看最新回复。

## 开发与发布流程

本项目通过自动化工具链实现“开发-发版-分发”的闭环。

### 1. 本地开发 (Dev)
```bash
npm install
npm run dev
```
启动后在 Tampermonkey 中安装控制台提示的本地代理链接，支持 **HMR (热更新)**。

### 2. 发布新版本 (Release)
当准备好发布时，建议遵循以下流程：
1. 更新主逻辑代码。
2. 在 `CHANGELOG.md` 中记录变更。
3. 执行 `git add .` 暂存所有修改。
4. 执行发布命令（自动 Bump 版本、打标签并推送）：
   - `npm run version:patch` (1.0.x)
   - `npm run version:minor` (1.x.0)

### 3. CI/CD 自动分发
代码推送到 GitHub 后，Actions 会自动构建并在 **Releases** 页面产出一个 **Draft Release**，包含最新的 `.user.js` 构建产物。

## 技术栈
- **构建**: Vite + `vite-plugin-monkey`
- **语言**: TypeScript (Vanilla)

## 协议
MIT
