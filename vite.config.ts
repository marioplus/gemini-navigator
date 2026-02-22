import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Gemini 对话导航',
        version: version,
        description: 'Gemini 对话导航，增加上一条、下一条、到底部导航按钮',
        author: 'marioplus',
        match: ['https://gemini.google.com/*'],
        namespace: 'https://github.com/marioplus/gemini-navigator',
        homepage: 'https://github.com/marioplus/gemini-navigator',
        'run-at': 'document-end',
      },
    }),
  ],
});
