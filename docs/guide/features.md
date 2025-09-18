# 功能特性

SCP Upload CLI 提供了丰富的功能特性，旨在为用户提供安全、高效、便捷的文件传输体验。

## 🚀 核心功能

### 交互式文件上传

提供友好的命令行交互界面，无需记忆复杂的命令参数：

```bash
$ scp-upload

? 请选择配置: my-server
? 请选择要上传的文件/目录: 
  ❯ 选择文件
    选择目录
    输入路径
? 请选择文件: document.pdf
? 确认上传到 /var/www/html/document.pdf? Yes

✓ 上传完成！
```

**特点：**
- 🎯 直观的选择界面
- 📁 支持文件和目录选择
- ✅ 上传前确认机制
- 📊 实时进度显示

### 配置记忆功能

智能保存服务器配置，避免重复输入连接信息：

```bash
# 保存配置
? 是否保存此配置? Yes
? 请为此配置起个名字: production-server

# 下次使用
$ scp-upload -c production-server -f ./file.txt
```

**优势：**
- 💾 加密存储敏感信息
- 🏷️ 自定义配置名称
- 🔄 快速切换不同服务器
- 🛡️ 安全的密码管理

### 多种认证方式

支持密码认证和密钥认证两种方式：

::: code-group

```bash [密码认证]
? 请选择认证方式: 密码认证
? 请输入密码: ********
```

```bash [密钥认证]
? 请选择认证方式: 密钥认证
? 请输入私钥文件路径: ~/.ssh/id_rsa
? 私钥是否有密码? No
```

:::

**安全特性：**
- 🔐 SSH/SCP 协议加密传输
- 🗝️ 支持 RSA、ECDSA、Ed25519 密钥
- 🛡️ 密码本地加密存储
- 🔒 支持密钥密码保护

## 📈 高级功能

### 批量文件传输

支持单文件、多文件和整个目录的上传：

```bash
# 上传单个文件
scp-upload -c server -f ./document.pdf

# 上传多个文件
scp-upload -c server -f "./file1.txt,./file2.txt,./file3.txt"

# 上传整个目录
scp-upload -c server -d ./dist

# 上传目录（保持结构）
scp-upload -c server -d ./src --preserve-structure
```

**功能特点：**
- 📦 批量文件处理
- 🗂️ 目录结构保持
- 🔄 递归目录上传
- 📋 文件过滤支持

### 传输进度监控

实时显示传输进度和统计信息：

```bash
📁 正在上传: project.zip
████████████████████ 100% | 15.2MB/15.2MB | 速度: 2.3MB/s | 剩余: 0s

✅ 上传完成！
📊 传输统计:
   - 文件数量: 1
   - 总大小: 15.2MB
   - 用时: 6.6s
   - 平均速度: 2.3MB/s
   - 成功率: 100%
```

**监控指标：**
- 📊 实时进度条
- ⚡ 传输速度显示
- ⏱️ 剩余时间估算
- 📈 详细统计信息

### 错误处理与重试

智能的错误处理和自动重试机制：

```bash
⚠️  传输中断，正在重试... (1/3)
✓ 重试成功，继续传输

❌ 传输失败: 连接超时
💡 建议: 检查网络连接或增加超时时间
🔄 是否重试? (Y/n)
```

**错误处理：**
- 🔄 自动重试机制
- 📝 详细错误日志
- 💡 智能错误提示
- 🛠️ 故障排除建议

## 🛠️ 配置管理

### 多配置支持

管理多个服务器配置，快速切换：

```bash
# 列出所有配置
$ scp-upload config list
📋 已保存的配置:
  ✓ production-server (默认)
  ✓ staging-server
  ✓ development-server

# 设置默认配置
$ scp-upload config default staging-server
✅ 默认配置已设置为: staging-server

# 测试配置连接
$ scp-upload config test production-server
🔍 测试连接: production-server
✅ 连接成功！服务器信息:
   - 系统: Ubuntu 20.04.3 LTS
   - 架构: x86_64
   - 可用空间: 45.2GB
```

### 配置编辑与导入导出

灵活的配置管理功能：

```bash
# 编辑配置
$ scp-upload config edit production-server

# 导出配置
$ scp-upload config export --output ./configs.json
✅ 配置已导出到: ./configs.json

# 导入配置
$ scp-upload config import ./configs.json
✅ 成功导入 3 个配置
```

**管理功能：**
- ✏️ 在线编辑配置
- 📤 配置导出备份
- 📥 批量配置导入
- 🔄 配置同步功能

## 🎨 用户体验

### 智能路径补全

支持文件路径的智能补全和验证：

```bash
? 请输入文件路径: ./src/
  📁 components/
  📁 utils/
  📄 index.js
  📄 App.vue
  
? 请输入远程路径: /var/www/
  📁 html/
  📁 logs/
  📁 backup/
```

### 主题与样式定制

支持多种显示主题和样式配置：

```bash
# 设置显示主题
$ scp-upload config theme dark
✅ 主题已设置为: dark

# 配置进度条样式
$ scp-upload config progress-style blocks
✅ 进度条样式已设置为: blocks
```

**定制选项：**
- 🎨 多种颜色主题
- 📊 进度条样式选择
- 🔤 字体大小调整
- 🌈 彩色输出控制

## 🔧 开发者功能

### 命令行 API

提供完整的命令行参数支持：

```bash
# 基本上传
scp-upload -c server -f file.txt

# 高级选项
scp-upload \
  --config production \
  --file ./dist/app.js \
  --remote-path /var/www/html/ \
  --overwrite \
  --verbose \
  --timeout 30
```

**参数说明：**
- `-c, --config`: 指定配置名称
- `-f, --file`: 指定文件路径
- `-d, --directory`: 指定目录路径
- `-r, --remote-path`: 指定远程路径
- `--overwrite`: 覆盖已存在文件
- `--verbose`: 详细输出模式
- `--timeout`: 连接超时时间

### 脚本集成

支持在脚本中使用，适合 CI/CD 集成：

```bash
#!/bin/bash
# 部署脚本示例

echo "构建项目..."
npm run build

echo "上传文件..."
scp-upload -c production -d ./dist --quiet

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
else
    echo "❌ 部署失败！"
    exit 1
fi
```

### 日志与调试

详细的日志记录和调试功能：

```bash
# 启用详细日志
$ scp-upload --verbose -c server -f file.txt

# 查看日志文件
$ scp-upload logs show
📄 日志文件位置: ~/.scp-upload-cli/logs/
📅 最近日志:
   - 2024-01-15 10:30:25 [INFO] 连接服务器成功
   - 2024-01-15 10:30:26 [INFO] 开始上传文件: file.txt
   - 2024-01-15 10:30:28 [INFO] 上传完成

# 清理日志
$ scp-upload logs clean --days 7
✅ 已清理 7 天前的日志文件
```

## 🚀 性能优化

### 并发传输

支持多文件并发上传，提升传输效率：

```bash
# 设置并发数
$ scp-upload config set concurrent 3
✅ 并发传输数已设置为: 3

# 并发上传多个文件
$ scp-upload -c server -f "file1.txt,file2.txt,file3.txt"
📁 并发上传 3 个文件...
file1.txt ████████████ 100% | 1.2MB/s
file2.txt ████████████ 100% | 1.5MB/s  
file3.txt ████████████ 100% | 1.1MB/s
```

### 压缩传输

支持文件压缩传输，减少网络带宽占用：

```bash
# 启用压缩传输
$ scp-upload -c server -f large-file.txt --compress
📦 启用压缩传输...
✅ 压缩率: 65% | 原始: 10MB → 压缩后: 3.5MB
```

### 断点续传

支持大文件的断点续传功能：

```bash
# 大文件传输中断后自动续传
📁 检测到未完成的传输: large-video.mp4
🔄 是否继续上次的传输? (Y/n) Y
📊 从 45% 处继续传输...
████████████████████ 100% | 完成！
```

## 📱 跨平台支持

### 操作系统兼容

全面支持主流操作系统：

| 操作系统 | 支持版本 | 特殊功能 |
|---------|---------|---------|
| Windows | 10+ | PowerShell 集成 |
| macOS | 10.14+ | Keychain 密码存储 |
| Linux | Ubuntu 18.04+ | 系统服务集成 |

### 终端兼容

兼容各种终端环境：

- ✅ Windows Terminal
- ✅ PowerShell
- ✅ macOS Terminal
- ✅ iTerm2
- ✅ Linux 各发行版终端
- ✅ VS Code 集成终端

## 🔮 即将推出

我们正在开发更多激动人心的功能：

- 🌐 **Web 界面**: 基于浏览器的图形化界面
- 📱 **移动端支持**: iOS 和 Android 应用
- 🔄 **双向同步**: 文件双向同步功能
- 📊 **传输分析**: 详细的传输性能分析
- 🤖 **AI 助手**: 智能配置建议和故障诊断
- 🔗 **云存储集成**: 支持 AWS S3、阿里云 OSS 等

---

想要了解更多功能的详细使用方法？请查看我们的 [使用文档](/guide/configuration) 或 [常见问题](/guide/faq)。