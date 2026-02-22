import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Gemini 对话导航',
        version: '1.0.0',
        description: 'Gemini 对话导航，增加上一条、下一条、到底部导航按钮，支持 MD3 动效，自动消除隐藏按钮间的残留间距',
        author: 'marioplus',
        match: ['https://gemini.google.com/*'],
        namespace: 'https://github.com/marioplus/gemini-navigator',
        homepage: 'https://github.com/marioplus/gemini-navigator',
        'run-at': 'document-end',
      },
    }),
  ],
});
