# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- 

### Changed
- 

### Deprecated
- 

### Removed
- 

### Fixed
- 

### Security
- 

## [1.0.0] - 2026-02-22

### Added
- **语义化章节导航**：以 `user-query` 为锚点，实现精准的问题跳转。
- **MD3 视觉规范**：引入玻璃拟态 (Glassmorphism) 和 Material Design 3 风格 UI。
- **自动化构建**：集成 Vite + `vite-plugin-monkey` 开发环境。
- **CI/CD**：新增 GitHub Actions 自动构建并发布 Draft Release。

### Changed
- 迁移原 `user.js` 至 TypeScript 模块化架构。
- 优化 UI 显隐逻辑，解决虚拟滚动下的初始化显示问题。

### Removed
- 移除旧版复杂的 SVG 路径匹配逻辑。
- 移除不稳定的 Resize 自适应对齐逻辑。
