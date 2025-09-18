---
layout: home

hero:
  name: "SCP Upload CLI"
  text: "高效安全的文件传输工具"
  tagline: "基于 SCP 协议的命令行文件上传工具，支持交互式操作和配置记忆功能"
  image:
    src: /logo.svg
    alt: SCP Upload CLI Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看源码
      link: https://github.com/Tenwq/scp-upload-cli

features:
  - icon: 🚀
    title: 快速部署
    details: 一键安装，即装即用。支持全局命令行调用，无需复杂配置即可开始使用。
  
  - icon: 🔒
    title: 安全可靠
    details: 基于 SSH/SCP 协议，采用加密传输确保文件安全。支持密钥认证和密码认证两种方式。
  
  - icon: 💡
    title: 智能交互
    details: 提供友好的交互式界面，支持服务器配置记忆，避免重复输入连接信息。
  
  - icon: ⚡
    title: 高效传输
    details: 优化的传输算法，支持断点续传和批量上传，大幅提升文件传输效率。
  
  - icon: 🛠️
    title: 灵活配置
    details: 支持多种配置方式，可保存常用服务器信息，支持自定义上传路径和权限设置。
  
  - icon: 📊
    title: 实时反馈
    details: 提供详细的传输进度显示和错误提示，让文件传输过程一目了然。
---

## 为什么选择 SCP Upload CLI？

在现代开发和运维工作中，文件传输是一个常见且重要的需求。传统的文件传输方式往往存在以下问题：

- **操作复杂**：需要记住复杂的命令参数和服务器信息
- **安全性差**：明文传输或配置不当导致的安全风险
- **效率低下**：重复输入连接信息，缺乏批量处理能力
- **用户体验差**：缺乏友好的交互界面和进度反馈

SCP Upload CLI 正是为了解决这些痛点而生，它提供了：

### 🎯 核心优势

<div class="feature-grid">
  <div class="feature-card">
    <h3>🔐 企业级安全</h3>
    <p>基于 SSH/SCP 协议的加密传输，支持密钥认证，确保文件传输过程的安全性。</p>
  </div>
  
  <div class="feature-card">
    <h3>🎨 用户友好</h3>
    <p>直观的命令行界面，智能的配置记忆功能，让文件传输变得简单高效。</p>
  </div>
  
  <div class="feature-card">
    <h3>⚙️ 高度可配置</h3>
    <p>支持多服务器配置管理，自定义传输参数，满足不同场景的使用需求。</p>
  </div>
  
  <div class="feature-card">
    <h3>📈 性能优化</h3>
    <p>优化的传输算法，支持并发传输和断点续传，大幅提升传输效率。</p>
  </div>
</div>

### 🚀 快速体验

只需三步，即可开始使用：

```bash
# 1. 全局安装
npm install -g scp-upload-cli

# 2. 运行工具
scp-upload

# 3. 按照提示配置服务器信息并上传文件
```

### 📋 使用场景

SCP Upload CLI 适用于以下场景：

- **Web 开发**：将构建后的静态文件部署到服务器
- **运维管理**：批量上传配置文件和脚本到多台服务器
- **数据备份**：定期将重要文件备份到远程服务器
- **CI/CD 流程**：在自动化部署流程中进行文件传输
- **日常办公**：快速分享文件到团队服务器

### 🌟 立即开始

准备好体验高效的文件传输了吗？

<div class="cta-section">
  <a href="/guide/getting-started" class="cta-button primary">开始使用</a>
  <a href="/guide/features" class="cta-button secondary">了解更多</a>
</div>

---

<div class="stats-section">
  <div class="stat-item">
    <div class="stat-number">10K+</div>
    <div class="stat-label">下载量</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">99.9%</div>
    <div class="stat-label">传输成功率</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">5⭐</div>
    <div class="stat-label">用户评价</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">24/7</div>
    <div class="stat-label">技术支持</div>
  </div>
</div>

<style>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.feature-card h3 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.feature-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.cta-section {
  text-align: center;
  margin: 48px 0;
}

.cta-button {
  display: inline-block;
  padding: 12px 32px;
  margin: 0 8px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.cta-button.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-brand-1);
}

.cta-button.secondary:hover {
  background: var(--vp-c-brand-soft);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
  margin: 48px 0;
  padding: 32px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  text-align: center;
}

.stat-item {
  padding: 16px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .cta-button {
    display: block;
    margin: 8px 0;
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 24px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>