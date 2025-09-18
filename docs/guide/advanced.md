# 高级用法

本章节介绍 SCP Upload CLI 的高级功能和使用技巧，帮助您更好地利用工具的强大功能。

## 🚀 批量操作

### 批量文件上传

```bash
# 上传整个目录
scp-upload -s myserver -d /var/www/html ./dist/

# 上传多个文件
scp-upload -s myserver -d /var/www/html file1.txt file2.txt file3.txt

# 使用通配符上传
scp-upload -s myserver -d /var/www/html *.js *.css
```

### 批量服务器操作

```bash
# 同时上传到多个服务器
scp-upload -s server1,server2,server3 -d /var/www/html ./dist/

# 使用配置文件批量操作
scp-upload --batch-config batch-servers.json ./dist/
```

**batch-servers.json 示例：**

```json
{
  "servers": [
    {
      "name": "production",
      "host": "prod.example.com",
      "username": "deploy",
      "remotePath": "/var/www/html"
    },
    {
      "name": "staging",
      "host": "staging.example.com", 
      "username": "deploy",
      "remotePath": "/var/www/staging"
    }
  ],
  "options": {
    "parallel": true,
    "maxConcurrency": 3
  }
}
```

## 🔄 同步功能

### 增量同步

```bash
# 只上传修改过的文件
scp-upload -s myserver -d /var/www/html --sync ./dist/

# 基于时间戳同步
scp-upload -s myserver -d /var/www/html --sync --newer-than "2024-01-01"

# 基于文件大小同步
scp-upload -s myserver -d /var/www/html --sync --size-diff ./dist/
```

### 双向同步

```bash
# 下载远程文件到本地
scp-upload -s myserver --download /var/www/html ./backup/

# 双向同步（谨慎使用）
scp-upload -s myserver -d /var/www/html --bidirectional ./dist/
```

## 🔐 高级安全配置

### SSH 密钥管理

```bash
# 使用特定的私钥文件
scp-upload -s myserver -i ~/.ssh/deploy_key -d /var/www/html ./dist/

# 使用 SSH Agent
eval $(ssh-agent)
ssh-add ~/.ssh/deploy_key
scp-upload -s myserver -d /var/www/html ./dist/

# 使用密钥密码保护
scp-upload -s myserver -i ~/.ssh/encrypted_key --ask-pass -d /var/www/html ./dist/
```

### 跳板机配置

```bash
# 通过跳板机连接
scp-upload -s myserver --jump-host bastion.example.com -d /var/www/html ./dist/

# 多级跳板机
scp-upload -s myserver --jump-host "bastion1.example.com,bastion2.example.com" -d /var/www/html ./dist/
```

**配置文件示例：**

```json
{
  "servers": {
    "production": {
      "host": "prod-internal.example.com",
      "username": "deploy",
      "jumpHost": {
        "host": "bastion.example.com",
        "username": "admin",
        "keyFile": "~/.ssh/bastion_key"
      }
    }
  }
}
```

## 📊 监控与日志

### 详细日志记录

```bash
# 启用详细日志
scp-upload -s myserver -d /var/www/html --verbose ./dist/

# 保存日志到文件
scp-upload -s myserver -d /var/www/html --log-file upload.log ./dist/

# 设置日志级别
scp-upload -s myserver -d /var/www/html --log-level debug ./dist/
```

### 进度监控

```bash
# 显示传输进度
scp-upload -s myserver -d /var/www/html --progress ./dist/

# JSON 格式输出（适合脚本处理）
scp-upload -s myserver -d /var/www/html --output json ./dist/

# 实时统计信息
scp-upload -s myserver -d /var/www/html --stats ./dist/
```

## 🔧 性能优化

### 并发传输

```bash
# 设置并发连接数
scp-upload -s myserver -d /var/www/html --parallel 5 ./dist/

# 限制传输速度
scp-upload -s myserver -d /var/www/html --limit-rate 1MB ./dist/

# 压缩传输
scp-upload -s myserver -d /var/www/html --compress ./dist/
```

### 大文件处理

```bash
# 分块传输大文件
scp-upload -s myserver -d /var/www/html --chunk-size 10MB large-file.zip

# 断点续传
scp-upload -s myserver -d /var/www/html --resume large-file.zip

# 校验文件完整性
scp-upload -s myserver -d /var/www/html --checksum md5 ./dist/
```

## 🎯 过滤与排除

### 文件过滤

```bash
# 排除特定文件
scp-upload -s myserver -d /var/www/html --exclude "*.log,*.tmp" ./dist/

# 只包含特定文件
scp-upload -s myserver -d /var/www/html --include "*.js,*.css,*.html" ./dist/

# 使用 .gitignore 规则
scp-upload -s myserver -d /var/www/html --gitignore ./dist/
```

### 高级过滤规则

创建 `.scpignore` 文件：

```gitignore
# 忽略日志文件
*.log
logs/

# 忽略临时文件
*.tmp
*.temp
.DS_Store

# 忽略开发文件
node_modules/
.git/
.vscode/

# 忽略大文件
*.zip
*.tar.gz
```

```bash
# 使用 .scpignore 文件
scp-upload -s myserver -d /var/www/html --ignore-file .scpignore ./dist/
```

## 🔄 钩子和脚本

### 预处理和后处理

```bash
# 上传前执行脚本
scp-upload -s myserver -d /var/www/html --pre-script "npm run build" ./dist/

# 上传后执行远程脚本
scp-upload -s myserver -d /var/www/html --post-script "sudo systemctl reload nginx" ./dist/

# 失败时执行回滚脚本
scp-upload -s myserver -d /var/www/html --rollback-script "git checkout HEAD~1" ./dist/
```

### 自定义钩子

创建钩子脚本 `hooks/pre-upload.sh`：

```bash
#!/bin/bash
echo "开始上传前检查..."

# 检查文件是否存在
if [ ! -d "./dist" ]; then
    echo "错误：dist 目录不存在"
    exit 1
fi

# 运行测试
npm test
if [ $? -ne 0 ]; then
    echo "错误：测试失败"
    exit 1
fi

echo "预检查完成"
```

```bash
# 使用自定义钩子
scp-upload -s myserver -d /var/www/html --hooks-dir ./hooks ./dist/
```

## 🌐 环境管理

### 多环境配置

```json
{
  "environments": {
    "development": {
      "host": "dev.example.com",
      "username": "developer",
      "remotePath": "/var/www/dev",
      "options": {
        "verbose": true,
        "dryRun": false
      }
    },
    "staging": {
      "host": "staging.example.com",
      "username": "deploy",
      "remotePath": "/var/www/staging",
      "options": {
        "backup": true,
        "checksum": "md5"
      }
    },
    "production": {
      "host": "prod.example.com",
      "username": "deploy",
      "remotePath": "/var/www/html",
      "options": {
        "backup": true,
        "checksum": "sha256",
        "requireConfirmation": true
      }
    }
  }
}
```

```bash
# 部署到不同环境
scp-upload --env development ./dist/
scp-upload --env staging ./dist/
scp-upload --env production ./dist/
```

## 🔍 故障排除

### 调试模式

```bash
# 启用调试模式
scp-upload -s myserver -d /var/www/html --debug ./dist/

# 测试连接
scp-upload -s myserver --test-connection

# 干运行模式（不实际传输）
scp-upload -s myserver -d /var/www/html --dry-run ./dist/
```

### 网络问题处理

```bash
# 设置连接超时
scp-upload -s myserver -d /var/www/html --timeout 60 ./dist/

# 重试机制
scp-upload -s myserver -d /var/www/html --retry 3 --retry-delay 5 ./dist/

# 使用 IPv4/IPv6
scp-upload -s myserver -d /var/www/html --ipv4 ./dist/
scp-upload -s myserver -d /var/www/html --ipv6 ./dist/
```

## 📈 性能分析

### 传输统计

```bash
# 生成详细报告
scp-upload -s myserver -d /var/www/html --report ./dist/

# 基准测试
scp-upload -s myserver -d /var/www/html --benchmark ./dist/

# 网络延迟测试
scp-upload -s myserver --ping-test
```

### 优化建议

1. **网络优化**
   - 使用压缩传输减少数据量
   - 调整并发连接数
   - 选择合适的传输块大小

2. **文件优化**
   - 排除不必要的文件
   - 使用增量同步
   - 压缩大文件

3. **服务器优化**
   - 配置 SSH 连接复用
   - 优化服务器网络设置
   - 使用 SSD 存储

## 🔗 集成示例

### CI/CD 集成

**GitHub Actions 示例：**

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy with SCP Upload CLI
        run: |
          npx scp-upload-cli \
            --env production \
            --config .scp-config.json \
            --backup \
            --checksum sha256 \
            ./dist/
        env:
          SCP_PASSWORD: ${{ secrets.DEPLOY_PASSWORD }}
```

### Docker 集成

```dockerfile
FROM node:16-alpine

# 安装 SCP Upload CLI
RUN npm install -g scp-upload-cli

# 复制配置文件
COPY .scp-config.json /app/
COPY deploy.sh /app/

WORKDIR /app

# 设置入口点
ENTRYPOINT ["./deploy.sh"]
```

通过这些高级功能，您可以构建强大的自动化部署流程，提高开发效率和部署可靠性。

::: tip 提示
建议在生产环境中使用这些高级功能前，先在测试环境中充分验证配置和脚本的正确性。
:::

::: warning 注意
使用批量操作和自动化脚本时，请确保有适当的备份和回滚机制，以防止意外的数据丢失。
:::