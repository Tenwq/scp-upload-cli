# 最佳实践

本章节总结了使用 SCP Upload CLI 的最佳实践，帮助您安全、高效地管理文件传输。

## 🔐 安全最佳实践

### SSH 密钥管理

**✅ 推荐做法：**

```bash
# 1. 生成专用的部署密钥
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -C "deploy@yourproject.com"

# 2. 设置适当的权限
chmod 600 ~/.ssh/deploy_key
chmod 644 ~/.ssh/deploy_key.pub

# 3. 在配置中使用密钥文件
{
  "servers": {
    "production": {
      "host": "prod.example.com",
      "username": "deploy",
      "keyFile": "~/.ssh/deploy_key"
    }
  }
}
```

**❌ 避免的做法：**

```bash
# 不要在命令行中直接输入密码
scp-upload -s myserver -p plaintext_password  # 危险！

# 不要使用默认的 SSH 密钥进行部署
# 不要在配置文件中存储明文密码
```

### 权限控制

```bash
# 创建专用的部署用户
sudo useradd -m -s /bin/bash deploy
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# 配置 sudo 权限（如需要）
echo "deploy ALL=(www-data) NOPASSWD: /bin/systemctl reload nginx" | sudo tee /etc/sudoers.d/deploy
```

### 网络安全

```json
{
  "servers": {
    "production": {
      "host": "prod.example.com",
      "port": 2222,  // 使用非标准端口
      "username": "deploy",
      "keyFile": "~/.ssh/deploy_key",
      "strictHostKeyChecking": true,  // 严格主机密钥检查
      "connectionTimeout": 30,
      "serverAliveInterval": 60
    }
  }
}
```

## 🏗️ 项目结构最佳实践

### 配置文件组织

```
project/
├── .scp-config.json          # 主配置文件
├── .scp-config.dev.json      # 开发环境配置
├── .scp-config.staging.json  # 测试环境配置
├── .scp-config.prod.json     # 生产环境配置
├── .scpignore                # 忽略文件规则
├── scripts/
│   ├── pre-deploy.sh         # 部署前脚本
│   ├── post-deploy.sh        # 部署后脚本
│   └── rollback.sh           # 回滚脚本
└── dist/                     # 构建输出目录
```

### 环境配置分离

**主配置文件 (.scp-config.json)：**

```json
{
  "extends": "./configs/base.json",
  "environments": {
    "development": "./configs/dev.json",
    "staging": "./configs/staging.json", 
    "production": "./configs/prod.json"
  },
  "scripts": {
    "preDeploy": "./scripts/pre-deploy.sh",
    "postDeploy": "./scripts/post-deploy.sh",
    "rollback": "./scripts/rollback.sh"
  }
}
```

**基础配置 (configs/base.json)：**

```json
{
  "options": {
    "verbose": true,
    "backup": true,
    "checksum": "sha256",
    "exclude": ["*.log", "*.tmp", ".DS_Store"],
    "parallel": 3,
    "timeout": 60,
    "retry": 2
  }
}
```

## 🚀 部署流程最佳实践

### 标准部署流程

```bash
#!/bin/bash
# deploy.sh - 标准部署脚本

set -e  # 遇到错误立即退出

# 1. 环境检查
echo "🔍 检查部署环境..."
if [ -z "$DEPLOY_ENV" ]; then
    echo "❌ 错误：未设置 DEPLOY_ENV 环境变量"
    exit 1
fi

# 2. 构建检查
echo "🏗️ 检查构建文件..."
if [ ! -d "./dist" ]; then
    echo "❌ 错误：dist 目录不存在，请先运行构建"
    exit 1
fi

# 3. 运行测试
echo "🧪 运行测试..."
npm test

# 4. 备份当前版本
echo "💾 创建备份..."
scp-upload --env $DEPLOY_ENV --backup-only

# 5. 部署新版本
echo "🚀 开始部署..."
scp-upload --env $DEPLOY_ENV ./dist/

# 6. 健康检查
echo "🏥 执行健康检查..."
./scripts/health-check.sh $DEPLOY_ENV

echo "✅ 部署完成！"
```

### 渐进式部署

```bash
# 1. 金丝雀部署 - 先部署到一台服务器
scp-upload --env production --servers canary ./dist/

# 2. 验证金丝雀服务器
./scripts/verify-canary.sh

# 3. 全量部署
if [ $? -eq 0 ]; then
    scp-upload --env production --exclude-servers canary ./dist/
else
    echo "❌ 金丝雀验证失败，停止部署"
    exit 1
fi
```

## 📊 监控与日志

### 日志配置

```json
{
  "logging": {
    "level": "info",
    "file": "./logs/deploy-{date}.log",
    "format": "json",
    "rotation": {
      "maxFiles": 30,
      "maxSize": "10MB"
    }
  }
}
```

### 监控脚本

```bash
#!/bin/bash
# monitor-deploy.sh - 部署监控脚本

DEPLOY_LOG="./logs/deploy-$(date +%Y%m%d).log"
WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# 监控部署状态
tail -f $DEPLOY_LOG | while read line; do
    if echo "$line" | grep -q "ERROR"; then
        # 发送告警
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 部署错误: $line\"}" \
            $WEBHOOK_URL
    elif echo "$line" | grep -q "部署完成"; then
        # 发送成功通知
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ 部署成功完成\"}" \
            $WEBHOOK_URL
    fi
done
```

## 🔄 版本管理与回滚

### 版本标记

```bash
# 使用 Git 标签进行版本管理
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3

# 在部署时记录版本信息
echo "$(git describe --tags)" > ./dist/VERSION
scp-upload --env production ./dist/
```

### 自动回滚机制

```bash
#!/bin/bash
# auto-rollback.sh - 自动回滚脚本

HEALTH_CHECK_URL="https://your-app.com/health"
MAX_RETRIES=5
RETRY_INTERVAL=30

echo "🏥 开始健康检查..."

for i in $(seq 1 $MAX_RETRIES); do
    if curl -f -s $HEALTH_CHECK_URL > /dev/null; then
        echo "✅ 健康检查通过"
        exit 0
    else
        echo "❌ 健康检查失败 ($i/$MAX_RETRIES)"
        if [ $i -eq $MAX_RETRIES ]; then
            echo "🔄 开始自动回滚..."
            scp-upload --env production --rollback
            exit 1
        fi
        sleep $RETRY_INTERVAL
    fi
done
```

## 🎯 性能优化

### 传输优化

```json
{
  "performance": {
    "compression": true,
    "parallel": 5,
    "chunkSize": "1MB",
    "keepAlive": true,
    "reuseConnection": true
  },
  "optimization": {
    "excludePatterns": [
      "*.map",
      "*.log", 
      "node_modules/",
      ".git/"
    ],
    "syncMode": "incremental",
    "checksumAlgorithm": "xxhash"
  }
}
```

### 缓存策略

```bash
# 使用本地缓存加速重复部署
scp-upload --env production --cache-dir ./.scp-cache ./dist/

# 清理过期缓存
scp-upload --cache-clean --older-than 7d
```

## 🔧 故障排除

### 常见问题检查清单

```bash
#!/bin/bash
# troubleshoot.sh - 故障排除脚本

echo "🔍 SCP Upload CLI 故障排除"
echo "=========================="

# 1. 检查网络连接
echo "1. 检查网络连接..."
if ping -c 1 your-server.com > /dev/null 2>&1; then
    echo "   ✅ 网络连接正常"
else
    echo "   ❌ 网络连接失败"
fi

# 2. 检查 SSH 连接
echo "2. 检查 SSH 连接..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes your-server.com exit > /dev/null 2>&1; then
    echo "   ✅ SSH 连接正常"
else
    echo "   ❌ SSH 连接失败"
fi

# 3. 检查配置文件
echo "3. 检查配置文件..."
if [ -f ".scp-config.json" ]; then
    if jq empty .scp-config.json > /dev/null 2>&1; then
        echo "   ✅ 配置文件格式正确"
    else
        echo "   ❌ 配置文件格式错误"
    fi
else
    echo "   ❌ 配置文件不存在"
fi

# 4. 检查目标目录权限
echo "4. 检查目标目录权限..."
scp-upload --env production --test-permissions
```

### 调试技巧

```bash
# 启用详细调试输出
export SCP_DEBUG=1
scp-upload --env production --verbose --dry-run ./dist/

# 使用 strace 跟踪系统调用（Linux）
strace -e trace=network scp-upload --env production ./dist/

# 分析网络流量
tcpdump -i any -w scp-debug.pcap host your-server.com
```

## 📋 检查清单

### 部署前检查

- [ ] 代码已通过所有测试
- [ ] 构建文件已生成且完整
- [ ] 配置文件语法正确
- [ ] SSH 连接和权限正常
- [ ] 目标服务器磁盘空间充足
- [ ] 备份策略已配置
- [ ] 回滚方案已准备

### 部署后验证

- [ ] 应用程序正常启动
- [ ] 健康检查端点响应正常
- [ ] 关键功能测试通过
- [ ] 日志中无错误信息
- [ ] 性能指标正常
- [ ] 监控告警正常

### 安全检查

- [ ] 敏感信息未暴露在日志中
- [ ] 文件权限设置正确
- [ ] SSH 密钥安全存储
- [ ] 网络连接使用加密
- [ ] 访问控制策略生效

## 🎓 团队协作

### 配置标准化

```json
{
  "team": {
    "configVersion": "1.0",
    "requiredTools": {
      "node": ">=16.0.0",
      "scp-upload-cli": ">=2.0.0"
    },
    "conventions": {
      "branchNaming": "feature/*, hotfix/*, release/*",
      "commitMessage": "conventional-commits",
      "deploymentApproval": true
    }
  }
}
```

### 文档维护

```markdown
# 部署文档模板

## 项目信息
- 项目名称：
- 负责人：
- 部署环境：

## 部署步骤
1. 检查前置条件
2. 执行构建
3. 运行测试
4. 部署到环境
5. 验证部署结果

## 回滚步骤
1. 确认问题
2. 执行回滚命令
3. 验证回滚结果

## 联系信息
- 技术支持：
- 紧急联系人：
```

遵循这些最佳实践，可以帮助您建立稳定、安全、高效的部署流程。

::: tip 建议
定期回顾和更新您的部署流程，根据项目发展和团队反馈持续改进。
:::

::: warning 重要
在生产环境中实施任何更改之前，请务必在测试环境中充分验证。
:::