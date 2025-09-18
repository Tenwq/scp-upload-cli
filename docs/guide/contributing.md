# 贡献指南

感谢您对 SCP Upload CLI 项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🎨 优化用户体验

## 🚀 快速开始

### 环境准备

确保您的开发环境满足以下要求：

```bash
# Node.js 版本要求
node --version  # >= 16.0.0
npm --version   # >= 8.0.0

# 或使用 Yarn
yarn --version  # >= 1.22.0
```

### 获取代码

```bash
# 1. Fork 项目到您的 GitHub 账户
# 2. 克隆您的 Fork
git clone https://github.com/YOUR_USERNAME/scp-upload-cli.git
cd scp-upload-cli

# 3. 添加上游仓库
git remote add upstream https://github.com/original-owner/scp-upload-cli.git

# 4. 安装依赖
npm install
```

### 开发环境设置

```bash
# 安装开发依赖
npm install --dev

# 运行测试确保环境正常
npm test

# 启动开发模式
npm run dev
```

## 📋 开发流程

### 1. 创建功能分支

```bash
# 同步最新代码
git checkout main
git pull upstream main

# 创建功能分支
git checkout -b feature/your-feature-name
# 或修复分支
git checkout -b fix/issue-number-description
```

### 2. 开发规范

#### 代码风格

我们使用 ESLint 和 Prettier 来保持代码风格一致：

```bash
# 检查代码风格
npm run lint

# 自动修复风格问题
npm run lint:fix

# 格式化代码
npm run format
```

#### 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能提交
git commit -m "feat: add batch upload support"

# 修复提交
git commit -m "fix: resolve connection timeout issue"

# 文档提交
git commit -m "docs: update installation guide"

# 样式提交
git commit -m "style: fix code formatting"

# 重构提交
git commit -m "refactor: optimize file transfer logic"

# 测试提交
git commit -m "test: add unit tests for config parser"

# 构建提交
git commit -m "build: update webpack configuration"
```

#### 代码注释

```javascript
/**
 * 上传文件到远程服务器
 * @param {string} localPath - 本地文件路径
 * @param {string} remotePath - 远程文件路径
 * @param {Object} options - 上传选项
 * @param {boolean} options.backup - 是否创建备份
 * @param {number} options.timeout - 超时时间（秒）
 * @returns {Promise<UploadResult>} 上传结果
 * @throws {UploadError} 上传失败时抛出错误
 */
async function uploadFile(localPath, remotePath, options = {}) {
    // 实现代码...
}
```

### 3. 测试要求

#### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --grep "config parser"

# 生成覆盖率报告
npm run test:coverage
```

#### 集成测试

```bash
# 运行集成测试
npm run test:integration

# 在 Docker 环境中测试
npm run test:docker
```

#### 测试编写示例

```javascript
// tests/unit/config.test.js
import { describe, it, expect } from 'vitest';
import { parseConfig } from '../src/config.js';

describe('Config Parser', () => {
    it('should parse valid JSON config', () => {
        const config = {
            servers: {
                production: {
                    host: 'example.com',
                    username: 'deploy'
                }
            }
        };
        
        const result = parseConfig(config);
        expect(result.servers.production.host).toBe('example.com');
    });

    it('should throw error for invalid config', () => {
        expect(() => {
            parseConfig({ invalid: 'config' });
        }).toThrow('Invalid configuration');
    });
});
```

### 4. 文档更新

如果您的更改影响用户使用方式，请同时更新相关文档：

```bash
# 启动文档开发服务器
cd docs
npm run docs:dev

# 构建文档
npm run docs:build
```

## 🐛 Bug 报告

### 报告前检查

在提交 Bug 报告前，请：

1. 搜索现有 Issues，确认问题未被报告
2. 使用最新版本重现问题
3. 收集必要的调试信息

### Bug 报告模板

```markdown
## Bug 描述
简要描述遇到的问题

## 重现步骤
1. 执行命令 `scp-upload ...`
2. 观察到的错误行为
3. 预期的正确行为

## 环境信息
- OS: macOS 12.0
- Node.js: v16.14.0
- SCP Upload CLI: v2.1.0
- SSH Client: OpenSSH_8.6p1

## 错误日志
```
粘贴相关的错误日志
```

## 配置文件
```json
{
  "servers": {
    // 您的配置（请移除敏感信息）
  }
}
```

## 其他信息
任何可能有助于诊断问题的额外信息
```

## 💡 功能建议

### 建议模板

```markdown
## 功能描述
描述您希望添加的功能

## 使用场景
说明这个功能解决什么问题，在什么情况下使用

## 建议的实现方式
如果有想法，可以描述期望的实现方式

## 替代方案
是否考虑过其他解决方案

## 其他信息
任何相关的参考资料或示例
```

## 🔍 代码审查

### 提交 Pull Request

```bash
# 1. 推送分支到您的 Fork
git push origin feature/your-feature-name

# 2. 在 GitHub 上创建 Pull Request
# 3. 填写 PR 模板
```

### PR 模板

```markdown
## 更改描述
简要描述这个 PR 的更改内容

## 更改类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 测试
- [ ] 已添加单元测试
- [ ] 已添加集成测试
- [ ] 所有测试通过
- [ ] 手动测试通过

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 提交信息符合规范
- [ ] 已更新相关文档
- [ ] 无破坏性更改（或已在描述中说明）

## 相关 Issue
Closes #123
```

### 代码审查标准

审查者会关注以下方面：

1. **功能正确性**：代码是否实现了预期功能
2. **代码质量**：是否遵循最佳实践和项目规范
3. **测试覆盖**：是否有足够的测试覆盖
4. **性能影响**：是否对性能有负面影响
5. **安全性**：是否引入安全风险
6. **向后兼容**：是否破坏现有 API

## 📚 开发资源

### 项目结构

```
scp-upload-cli/
├── src/                    # 源代码
│   ├── commands/          # 命令实现
│   ├── config/            # 配置管理
│   ├── core/              # 核心功能
│   ├── utils/             # 工具函数
│   └── index.js           # 入口文件
├── tests/                 # 测试文件
│   ├── unit/              # 单元测试
│   ├── integration/       # 集成测试
│   └── fixtures/          # 测试数据
├── docs/                  # 文档
├── scripts/               # 构建脚本
├── .github/               # GitHub 配置
└── package.json           # 项目配置
```

### 有用的命令

```bash
# 开发相关
npm run dev              # 开发模式
npm run build            # 构建项目
npm run test             # 运行测试
npm run test:watch       # 监视模式运行测试
npm run lint             # 代码检查
npm run format           # 代码格式化

# 文档相关
npm run docs:dev         # 启动文档服务器
npm run docs:build       # 构建文档

# 发布相关
npm run version          # 版本管理
npm run changelog        # 生成更新日志
```

### 调试技巧

```bash
# 启用调试模式
export DEBUG=scp-upload:*
npm run dev

# 使用 Node.js 调试器
node --inspect-brk src/index.js

# 分析性能
node --prof src/index.js
node --prof-process isolate-*.log > profile.txt
```

## 🏆 贡献者认可

我们重视每一位贡献者的努力：

- 所有贡献者都会在 README 中得到认可
- 重要贡献者会被邀请成为项目维护者
- 我们会在发布说明中感谢贡献者

### 贡献者类型

- 🐛 **Bug Hunter**：报告和修复 Bug
- 💡 **Feature Creator**：提出和实现新功能
- 📝 **Documentation Writer**：改进文档
- 🎨 **UX Improver**：优化用户体验
- 🔧 **Code Reviewer**：参与代码审查
- 🌍 **Translator**：翻译文档和界面

## 📞 获取帮助

如果您在贡献过程中遇到问题：

1. **查看文档**：首先查看项目文档和 FAQ
2. **搜索 Issues**：查看是否有类似问题的讨论
3. **提问**：在 GitHub Discussions 中提问
4. **联系维护者**：通过 Issue 或邮件联系

### 社区资源

- 📖 [项目文档](https://your-docs-site.com)
- 💬 [GitHub Discussions](https://github.com/owner/repo/discussions)
- 🐛 [Issue Tracker](https://github.com/owner/repo/issues)
- 📧 [邮件列表](mailto:dev@yourproject.com)

## 📄 许可证

通过贡献代码，您同意您的贡献将在与项目相同的许可证下发布。

---

再次感谢您的贡献！每一个贡献都让 SCP Upload CLI 变得更好。

::: tip 提示
如果您是第一次贡献开源项目，建议从小的改进开始，比如修复文档中的错别字或添加示例。
:::

::: warning 注意
在开始大型功能开发之前，建议先创建 Issue 讨论设计方案，避免重复工作。
:::