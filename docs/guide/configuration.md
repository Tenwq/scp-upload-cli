# 配置指南

本指南将详细介绍 SCP Upload CLI 的各种配置选项，帮助您根据需求定制工具的行为。

## 配置文件结构

SCP Upload CLI 的配置文件位于 `~/.scp-upload-cli/config.json`，采用 JSON 格式存储：

```json
{
  "configs": {
    "server-name": {
      "host": "example.com",
      "port": 22,
      "username": "user",
      "authType": "password|key",
      "password": "encrypted_password",
      "keyPath": "~/.ssh/id_rsa",
      "remotePath": "/var/www/html",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUsed": "2024-01-15T10:30:00.000Z"
    }
  },
  "defaultConfig": "server-name",
  "globalSettings": {
    "theme": "auto",
    "concurrent": 1,
    "timeout": 30,
    "retryAttempts": 3,
    "compression": false,
    "verbose": false
  }
}
```

## 服务器配置

### 基本连接配置

每个服务器配置包含以下基本信息：

| 字段 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `host` | string | ✅ | 服务器地址或 IP |
| `port` | number | ❌ | SSH 端口（默认 22） |
| `username` | string | ✅ | 登录用户名 |
| `remotePath` | string | ❌ | 默认远程路径 |

```bash
# 交互式配置
$ scp-upload config add
? 配置名称: my-server
? 服务器地址: 192.168.1.100
? 端口号: 22
? 用户名: admin
? 默认远程路径: /home/admin/uploads
```

### 认证配置

#### 密码认证

```json
{
  "authType": "password",
  "password": "encrypted_password_hash"
}
```

::: warning 安全提示
密码会使用 AES-256 加密存储，但仍建议使用密钥认证以获得更高安全性。
:::

#### 密钥认证

```json
{
  "authType": "key",
  "keyPath": "~/.ssh/id_rsa",
  "keyPassphrase": "encrypted_passphrase"
}
```

**支持的密钥类型：**
- RSA (2048, 3072, 4096 位)
- ECDSA (P-256, P-384, P-521)
- Ed25519
- DSA (已弃用，不推荐)

```bash
# 配置密钥认证
$ scp-upload config edit my-server
? 认证方式: 密钥认证
? 私钥路径: ~/.ssh/id_ed25519
? 私钥是否有密码: Yes
? 请输入私钥密码: ********
```

### 高级连接选项

```json
{
  "host": "example.com",
  "port": 2222,
  "username": "deploy",
  "authType": "key",
  "keyPath": "~/.ssh/deploy_key",
  "remotePath": "/var/www/html",
  "options": {
    "connectTimeout": 30000,
    "keepaliveInterval": 30000,
    "algorithms": {
      "kex": ["ecdh-sha2-nistp256", "diffie-hellman-group14-sha256"],
      "cipher": ["aes128-gcm", "aes256-gcm"],
      "hmac": ["hmac-sha2-256", "hmac-sha2-512"]
    },
    "compress": true,
    "debug": false
  }
}
```

## 全局设置

### 主题配置

```bash
# 设置主题
$ scp-upload config theme auto|light|dark

# 查看当前主题
$ scp-upload config theme
当前主题: auto
```

**可用主题：**
- `auto`: 自动跟随系统主题
- `light`: 浅色主题
- `dark`: 深色主题

### 传输设置

```bash
# 设置并发传输数
$ scp-upload config set concurrent 3

# 设置连接超时时间（秒）
$ scp-upload config set timeout 60

# 设置重试次数
$ scp-upload config set retryAttempts 5

# 启用压缩传输
$ scp-upload config set compression true
```

### 日志配置

```bash
# 设置日志级别
$ scp-upload config set logLevel info|debug|warn|error

# 设置日志保留天数
$ scp-upload config set logRetentionDays 30

# 启用详细输出
$ scp-upload config set verbose true
```

## 配置管理命令

### 查看配置

```bash
# 列出所有配置
$ scp-upload config list
📋 已保存的配置:
  ✓ production-server (默认)
    主机: prod.example.com:22
    用户: deploy
    认证: 密钥认证
    路径: /var/www/html
    
  ✓ staging-server
    主机: staging.example.com:22
    用户: admin
    认证: 密码认证
    路径: /home/admin

# 查看特定配置详情
$ scp-upload config show production-server
```

### 编辑配置

```bash
# 交互式编辑
$ scp-upload config edit production-server

# 直接设置属性
$ scp-upload config set production-server.port 2222
$ scp-upload config set production-server.remotePath /var/www/new-path
```

### 测试配置

```bash
# 测试连接
$ scp-upload config test production-server
🔍 测试连接: production-server
✅ 连接成功！
📊 服务器信息:
   - 系统: Ubuntu 20.04.3 LTS
   - 架构: x86_64
   - 内核: 5.4.0-91-generic
   - 可用空间: 45.2GB
   - 负载: 0.15, 0.12, 0.08

# 测试所有配置
$ scp-upload config test-all
```

### 导入导出配置

```bash
# 导出所有配置
$ scp-upload config export configs-backup.json
✅ 配置已导出到: configs-backup.json

# 导出特定配置
$ scp-upload config export production.json --config production-server

# 导入配置
$ scp-upload config import configs-backup.json
? 发现重复配置，如何处理?
  ❯ 跳过重复项
    覆盖已存在的配置
    重命名导入的配置

✅ 成功导入 2 个配置，跳过 1 个重复项
```

## 环境变量配置

支持通过环境变量覆盖配置：

```bash
# 设置默认配置
export SCP_UPLOAD_DEFAULT_CONFIG=production-server

# 设置全局选项
export SCP_UPLOAD_TIMEOUT=60
export SCP_UPLOAD_CONCURRENT=3
export SCP_UPLOAD_VERBOSE=true

# 临时覆盖服务器配置
export SCP_UPLOAD_HOST=temp.example.com
export SCP_UPLOAD_PORT=2222
export SCP_UPLOAD_USERNAME=temp-user

# 使用环境变量
$ scp-upload -f file.txt
```

## 配置文件模板

### 生产环境模板

```json
{
  "configs": {
    "production": {
      "host": "prod.example.com",
      "port": 22,
      "username": "deploy",
      "authType": "key",
      "keyPath": "~/.ssh/production_key",
      "remotePath": "/var/www/html",
      "options": {
        "connectTimeout": 30000,
        "compress": true,
        "algorithms": {
          "cipher": ["aes256-gcm", "aes128-gcm"]
        }
      }
    }
  },
  "globalSettings": {
    "concurrent": 1,
    "timeout": 30,
    "retryAttempts": 3,
    "compression": true,
    "verbose": false,
    "logLevel": "info"
  }
}
```

### 开发环境模板

```json
{
  "configs": {
    "development": {
      "host": "dev.example.com",
      "port": 22,
      "username": "developer",
      "authType": "password",
      "password": "encrypted_dev_password",
      "remotePath": "/home/developer/www"
    }
  },
  "globalSettings": {
    "concurrent": 2,
    "timeout": 15,
    "retryAttempts": 1,
    "compression": false,
    "verbose": true,
    "logLevel": "debug"
  }
}
```

## 安全最佳实践

### 密钥管理

1. **使用强密钥**：
   ```bash
   # 生成 Ed25519 密钥（推荐）
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # 或生成 4096 位 RSA 密钥
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. **设置正确的权限**：
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/id_ed25519
   chmod 644 ~/.ssh/id_ed25519.pub
   ```

3. **使用密钥密码**：
   ```bash
   # 为现有密钥添加密码
   ssh-keygen -p -f ~/.ssh/id_ed25519
   ```

### 配置文件安全

1. **设置文件权限**：
   ```bash
   chmod 600 ~/.scp-upload-cli/config.json
   ```

2. **定期备份配置**：
   ```bash
   # 创建备份脚本
   #!/bin/bash
   DATE=$(date +%Y%m%d)
   cp ~/.scp-upload-cli/config.json ~/.scp-upload-cli/backups/config-$DATE.json
   ```

3. **使用配置加密**：
   ```bash
   # 启用配置文件加密
   $ scp-upload config encrypt
   ? 请设置配置文件密码: ********
   ✅ 配置文件已加密
   ```

## 故障排除

### 常见配置问题

1. **连接超时**：
   ```bash
   # 增加超时时间
   $ scp-upload config set timeout 60
   
   # 或在配置中设置
   "options": {
     "connectTimeout": 60000
   }
   ```

2. **密钥权限错误**：
   ```bash
   # 修复密钥权限
   chmod 600 ~/.ssh/id_rsa
   
   # 检查 SSH 配置
   ssh -vvv user@host
   ```

3. **路径不存在**：
   ```bash
   # 测试远程路径
   $ scp-upload config test server-name --check-path
   
   # 创建远程目录
   ssh user@host "mkdir -p /path/to/directory"
   ```

### 调试配置

```bash
# 启用调试模式
$ scp-upload --debug config test server-name

# 查看详细连接日志
$ scp-upload --verbose -c server-name -f test.txt

# 导出调试信息
$ scp-upload debug export debug-info.json
```

## 配置迁移

### 从旧版本迁移

```bash
# 自动迁移旧配置
$ scp-upload config migrate
🔄 检测到旧版本配置文件
✅ 成功迁移 3 个配置
📝 备份文件: ~/.scp-upload-cli/config.json.backup

# 手动迁移
$ scp-upload config import-legacy ~/.scp-upload/old-config.json
```

### 跨设备同步

```bash
# 导出配置到云存储
$ scp-upload config export ~/Dropbox/scp-configs.json

# 在新设备上导入
$ scp-upload config import ~/Dropbox/scp-configs.json
```

---

需要更多帮助？请查看 [常见问题](/guide/faq) 或访问我们的 [GitHub Issues](https://github.com/Tenwq/scp-upload-cli/issues)。