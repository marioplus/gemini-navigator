import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// 读取当前项目的版本号和日期
const pkgPath = resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const date = new Date().toISOString().split('T')[0];

const changelogPath = resolve(process.cwd(), 'CHANGELOG.md');
let changelog = readFileSync(changelogPath, 'utf8');

// 匹配 [Unreleased] 部分
const unreleasedHeader = '## [Unreleased]';
const newVersionHeader = `## [${version}] - ${date}`;

// 如果 [Unreleased] 存在且下方有内容，则进行迁移
if (changelog.includes(unreleasedHeader)) {
    // 插入新版本标题，并重置 [Unreleased] 下的内容模板
    const template = `## [Unreleased]

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
`;

    // 找到 [Unreleased] 之后到下一个 ## 之前的内容，或者到文件结尾
    const parts = changelog.split(unreleasedHeader);
    if (parts.length > 1) {
        let contentAfter = parts[1];
        // 找到下一个二级标题的位置
        const nextHeaderIndex = contentAfter.indexOf('\n## ');

        let unreleasedContent = '';
        let restOfFile = '';

        if (nextHeaderIndex !== -1) {
            unreleasedContent = contentAfter.substring(0, nextHeaderIndex).trim();
            restOfFile = contentAfter.substring(nextHeaderIndex);
        } else {
            unreleasedContent = contentAfter.trim();
        }

        // 拼接新的内容
        const updatedChangelog = parts[0] + template + '\n' + newVersionHeader + '\n\n' + unreleasedContent + '\n' + restOfFile;

        writeFileSync(changelogPath, updatedChangelog, 'utf8');
        console.log(`✅ CHANGELOG.md 已自动归档至版本 [${version}]`);
    }
} else {
    console.warn('⚠️ 未在 CHANGELOG.md 中找到 [Unreleased] 标记，跳过自动归档。');
}
