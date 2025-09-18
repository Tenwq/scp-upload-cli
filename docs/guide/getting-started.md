# 快速开始

欢迎使用 SCP Upload CLI！本指南将帮助您快速安装和配置工具，开始您的第一次文件传输。

## 系统要求

在开始之前，请确保您的系统满足以下要求：

- **Node.js**: 版本 14.0 或更高
- **操作系统**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
- **网络**: 能够访问目标服务器的 SSH 端口（通常是 22）

::: tip 提示
如果您还没有安装 Node.js，请访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新的 LTS 版本。
:::

## 安装方式

### 方式一：NPM 全局安装（推荐）

```bash
# 使用 npm 全局安装
npm install -g scp-upload-cli

# 验证安装
scp-upload --version
```

### 方式二：Yarn 全局安装

```bash
# 使用 yarn 全局安装
yarn global add scp-upload-cli

# 验证安装
scp-upload --version
```

### 方式三：从源码安装

```bash
# 克隆仓库
git clone https://github.com/Tenwq/scp-upload-cli.git

# 进入目录
cd scp-upload-cli

# 安装依赖
npm install

# 创建全局链接
npm link

# 验证安装
scp-upload --version
```

## 首次使用

### 1. 启动工具

安装完成后，在终端中运行：

```bash
scp-upload
```

### 2. 配置服务器信息

首次运行时，工具会引导您配置服务器连接信息：

```bash
? 请输入服务器地址: your-server.com
? 请输入端口号 (默认: 22): 22
? 请输入用户名: username
? 请选择认证方式: 
  ❯ 密码认证
    密钥认证
? 请输入密码: ********
? 请输入远程目录路径: /var/www/html
? 是否保存此配置? (Y/n) Y
? 请为此配置起个名字: my-server
```

### 3. 选择要上传的文件

配置完成后，选择要上传的文件或目录：

```bash
? 请选择要上传的文件/目录: 
  ❯ 选择文件
    选择目录
    输入路径

? 请选择文件: 
  ❯ document.pdf
    image.jpg
    project.zip
```

### 4. 开始传输

确认信息后，工具将开始传输文件：

```bash
✓ 连接服务器成功
✓ 验证远程目录
📁 开始上传文件...

document.pdf ████████████████████ 100% | 2.5MB/2.5MB | 速度: 1.2MB/s

✅ 上传完成！
📊 传输统计:
   - 文件数量: 1
   - 总大小: 2.5MB
   - 用时: 2.1s
   - 平均速度: 1.2MB/s
```

## 基本命令

### 查看帮助

```bash
# 查看所有可用命令
scp-upload --help

# 查看特定命令的帮助
scp-upload config --help
```

### 配置管理

```bash
# 查看所有保存的配置
scp-upload config list

# 编辑指定配置
scp-upload config edit my-server

# 删除指定配置
scp-upload config delete my-server

# 测试配置连接
scp-upload config test my-server
```

### 直接上传

```bash
# 使用保存的配置上传文件
scp-upload -c my-server -f ./document.pdf

# 上传整个目录
scp-upload -c my-server -d ./dist

# 上传到指定远程路径
scp-upload -c my-server -f ./file.txt -r /tmp/
```

## 高级配置

### 使用密钥认证

如果您的服务器支持 SSH 密钥认证，推荐使用这种更安全的方式：

```bash
# 生成 SSH 密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 将公钥复制到服务器
ssh-copy-id username@your-server.com
```

然后在配置时选择"密钥认证"：

```bash
? 请选择认证方式: 密钥认证
? 请输入私钥文件路径 (默认: ~/.ssh/id_rsa): 
? 私钥是否有密码? (y/N) n
```

### 配置文件格式

工具的配置文件保存在 `~/.scp-upload-cli/config.json`，格式如下：

```json
{
  "configs": {
    "my-server": {
      "host": "your-server.com",
      "port": 22,
      "username": "username",
      "authType": "password",
      "password": "encrypted_password",
      "remotePath": "/var/www/html",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "defaultConfig": "my-server"
}
```

::: warning 安全提示
配置文件中的密码会被加密存储，但仍建议使用密钥认证方式以获得更高的安全性。
:::

## 常见问题

### 连接失败

如果遇到连接问题，请检查：

1. **网络连接**: 确保能够访问目标服务器
2. **端口设置**: 确认 SSH 端口是否正确（默认 22）
3. **防火墙**: 检查本地和服务器防火墙设置
4. **认证信息**: 验证用户名、密码或密钥是否正确

### 权限错误

如果上传时遇到权限错误：

1. **目录权限**: 确保用户对目标目录有写权限
2. **文件权限**: 检查要上传的文件是否可读
3. **用户组**: 确认用户是否属于正确的用户组

### 传输中断

如果传输过程中断：

1. **网络稳定性**: 检查网络连接是否稳定
2. **文件大小**: 大文件传输可能需要更长时间
3. **服务器资源**: 确认服务器有足够的磁盘空间

## 下一步

现在您已经成功安装并配置了 SCP Upload CLI，可以：

- 📖 查看 [功能特性](/guide/features) 了解更多高级功能
- 🔧 阅读 [配置指南](/guide/configuration) 学习详细配置选项
- ❓ 查看 [常见问题](/guide/faq) 解决使用中的疑问
- 💬 访问 [GitHub Issues](https://github.com/Tenwq/scp-upload-cli/issues) 获取技术支持

祝您使用愉快！🎉