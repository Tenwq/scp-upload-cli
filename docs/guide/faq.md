# 常见问题

本页面收集了用户在使用 SCP Upload CLI 过程中遇到的常见问题及解决方案。

## 🚀 安装与配置

### Q: 安装时提示权限错误怎么办？

**A:** 这通常是因为没有管理员权限导致的。请尝试以下解决方案：

::: code-group

```bash [macOS/Linux]
# 使用 sudo 安装
sudo npm install -g scp-upload-cli

# 或配置 npm 全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g scp-upload-cli
```

```powershell [Windows]
# 以管理员身份运行 PowerShell
npm install -g scp-upload-cli

# 或使用 Chocolatey
choco install nodejs
npm install -g scp-upload-cli
```

:::

### Q: 如何检查是否安装成功？

**A:** 运行以下命令验证安装：

```bash
# 检查版本
scp-upload --version

# 查看帮助信息
scp-upload --help

# 测试基本功能
scp-upload config list
```

### Q: Node.js 版本要求是什么？

**A:** SCP Upload CLI 需要 Node.js 14.0 或更高版本：

```bash
# 检查 Node.js 版本
node --version

# 如果版本过低，请升级 Node.js
# 推荐使用 nvm 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

## 🔐 连接与认证

### Q: 连接服务器时提示 "Connection refused" 怎么办？

**A:** 这个错误通常有以下几种原因：

1. **检查服务器地址和端口**：
   ```bash
   # 测试服务器连通性
   ping your-server.com
   
   # 测试 SSH 端口
   telnet your-server.com 22
   # 或使用 nc
   nc -zv your-server.com 22
   ```

2. **确认 SSH 服务运行状态**：
   ```bash
   # 在服务器上检查 SSH 服务
   sudo systemctl status ssh
   # 或
   sudo service ssh status
   ```

3. **检查防火墙设置**：
   ```bash
   # 检查防火墙规则
   sudo ufw status
   # 允许 SSH 连接
   sudo ufw allow ssh
   ```

### Q: 密钥认证失败怎么解决？

**A:** 密钥认证问题的排查步骤：

1. **检查密钥权限**：
   ```bash
   # 设置正确的权限
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/id_rsa
   chmod 644 ~/.ssh/id_rsa.pub
   ```

2. **验证公钥是否已添加到服务器**：
   ```bash
   # 查看服务器上的授权密钥
   cat ~/.ssh/authorized_keys
   
   # 添加公钥到服务器
   ssh-copy-id -i ~/.ssh/id_rsa.pub user@server
   ```

3. **测试 SSH 连接**：
   ```bash
   # 使用详细模式测试连接
   ssh -vvv -i ~/.ssh/id_rsa user@server
   ```

4. **检查密钥格式**：
   ```bash
   # 查看私钥信息
   ssh-keygen -l -f ~/.ssh/id_rsa
   
   # 如果是新格式，可能需要转换
   ssh-keygen -p -m PEM -f ~/.ssh/id_rsa
   ```

### Q: 如何处理 "Host key verification failed" 错误？

**A:** 这个错误表示服务器的主机密钥发生了变化：

```bash
# 查看错误详情
ssh user@server

# 如果确认服务器是安全的，删除旧的主机密钥
ssh-keygen -R server-hostname

# 或编辑 known_hosts 文件
nano ~/.ssh/known_hosts

# 重新连接以添加新的主机密钥
ssh user@server
```

::: warning 安全警告
只有在确认服务器安全的情况下才删除主机密钥。如果不确定，请联系系统管理员。
:::

## 📁 文件传输

### Q: 上传大文件时经常中断怎么办？

**A:** 大文件传输中断的解决方案：

1. **增加超时时间**：
   ```bash
   # 设置更长的超时时间
   scp-upload config set timeout 300
   
   # 或在上传时指定
   scp-upload -c server -f large-file.zip --timeout 300
   ```

2. **启用压缩传输**：
   ```bash
   # 启用压缩以减少传输时间
   scp-upload config set compression true
   
   # 或临时启用
   scp-upload -c server -f file.zip --compress
   ```

3. **使用断点续传**：
   ```bash
   # 工具会自动检测未完成的传输
   scp-upload -c server -f large-file.zip --resume
   ```

### Q: 如何批量上传文件？

**A:** 支持多种批量上传方式：

```bash
# 上传多个文件
scp-upload -c server -f "file1.txt,file2.txt,file3.txt"

# 上传整个目录
scp-upload -c server -d ./dist

# 使用通配符
scp-upload -c server -f "*.pdf"

# 上传时保持目录结构
scp-upload -c server -d ./src --preserve-structure
```

### Q: 上传后文件权限不正确怎么办？

**A:** 可以在上传时设置文件权限：

```bash
# 设置文件权限
scp-upload -c server -f file.txt --chmod 644

# 设置目录权限
scp-upload -c server -d ./dist --chmod 755

# 在配置中设置默认权限
scp-upload config set server-name.defaultFileMode 644
scp-upload config set server-name.defaultDirMode 755
```

## ⚙️ 配置管理

### Q: 忘记了配置密码怎么办？

**A:** 如果忘记了配置密码，可以重置配置：

```bash
# 重置所有配置（会丢失所有保存的服务器信息）
scp-upload config reset

# 或删除配置文件后重新配置
rm ~/.scp-upload-cli/config.json
scp-upload config add
```

::: tip 建议
定期备份配置文件，避免数据丢失：
```bash
cp ~/.scp-upload-cli/config.json ~/backup/scp-config-$(date +%Y%m%d).json
```
:::

### Q: 如何在多台电脑间同步配置？

**A:** 可以通过导入导出功能同步配置：

```bash
# 在电脑 A 上导出配置
scp-upload config export ~/Dropbox/scp-configs.json

# 在电脑 B 上导入配置
scp-upload config import ~/Dropbox/scp-configs.json
```

### Q: 配置文件在哪里？

**A:** 配置文件位置因操作系统而异：

| 操作系统 | 配置文件路径 |
|---------|-------------|
| macOS | `~/.scp-upload-cli/config.json` |
| Linux | `~/.scp-upload-cli/config.json` |
| Windows | `%USERPROFILE%\.scp-upload-cli\config.json` |

```bash
# 查看配置文件路径
scp-upload config path

# 直接编辑配置文件
scp-upload config edit-file
```

## 🐛 错误处理

### Q: 提示 "Permission denied" 怎么解决？

**A:** 权限错误的常见解决方案：

1. **检查用户权限**：
   ```bash
   # 确认用户对目标目录有写权限
   ssh user@server "ls -la /target/directory"
   
   # 修改目录权限
   ssh user@server "chmod 755 /target/directory"
   ```

2. **检查文件所有者**：
   ```bash
   # 查看文件所有者
   ssh user@server "ls -la /target/directory"
   
   # 修改所有者
   ssh user@server "sudo chown user:group /target/directory"
   ```

3. **使用 sudo 权限**：
   ```bash
   # 如果用户有 sudo 权限，可以在服务器配置中启用
   scp-upload config set server-name.useSudo true
   ```

### Q: 传输速度很慢怎么优化？

**A:** 优化传输速度的方法：

1. **启用压缩**：
   ```bash
   scp-upload config set compression true
   ```

2. **调整并发数**：
   ```bash
   # 增加并发传输数（适用于多文件）
   scp-upload config set concurrent 3
   ```

3. **优化 SSH 算法**：
   ```bash
   # 在配置中指定更快的加密算法
   scp-upload config edit server-name
   # 添加以下配置：
   "options": {
     "algorithms": {
       "cipher": ["aes128-gcm", "aes128-ctr"]
     }
   }
   ```

4. **检查网络状况**：
   ```bash
   # 测试网络延迟
   ping server-hostname
   
   # 测试带宽
   iperf3 -c server-hostname
   ```

### Q: 出现 "No space left on device" 错误怎么办？

**A:** 这表示服务器磁盘空间不足：

```bash
# 检查服务器磁盘空间
ssh user@server "df -h"

# 清理临时文件
ssh user@server "sudo apt-get clean"
ssh user@server "sudo rm -rf /tmp/*"

# 查找大文件
ssh user@server "find / -type f -size +100M 2>/dev/null"
```

## 🔧 高级用法

### Q: 如何在 CI/CD 中使用？

**A:** 在自动化流程中使用的最佳实践：

```yaml
# GitHub Actions 示例
name: Deploy
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
          
      - name: Install SCP Upload CLI
        run: npm install -g scp-upload-cli
        
      - name: Configure server
        run: |
          scp-upload config add production \
            --host ${{ secrets.SERVER_HOST }} \
            --username ${{ secrets.SERVER_USER }} \
            --key-path ./deploy-key \
            --remote-path /var/www/html
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          
      - name: Deploy files
        run: scp-upload -c production -d ./dist --quiet
```

### Q: 如何自定义上传后的处理？

**A:** 可以使用钩子脚本在上传前后执行自定义操作：

```bash
# 配置上传后钩子
scp-upload config set server-name.postUploadHook "sudo systemctl restart nginx"

# 配置上传前钩子
scp-upload config set server-name.preUploadHook "mkdir -p /var/www/backup && cp -r /var/www/html/* /var/www/backup/"
```

### Q: 如何实现增量上传？

**A:** 使用文件比较功能实现增量上传：

```bash
# 启用增量上传
scp-upload -c server -d ./dist --incremental

# 基于文件修改时间比较
scp-upload -c server -d ./dist --compare-mtime

# 基于文件哈希比较
scp-upload -c server -d ./dist --compare-hash
```

## 📞 获取帮助

### Q: 如何报告 Bug 或请求新功能？

**A:** 我们欢迎您的反馈：

1. **GitHub Issues**: [https://github.com/Tenwq/scp-upload-cli/issues](https://github.com/Tenwq/scp-upload-cli/issues)
2. **功能请求**: 使用 "enhancement" 标签
3. **Bug 报告**: 使用 "bug" 标签，并提供详细的复现步骤

### Q: 如何获取技术支持？

**A:** 多种方式获取帮助：

- 📖 查看 [使用文档](/guide/getting-started)
- 💬 GitHub Discussions
- 📧 发送邮件到 support@example.com
- 🐛 提交 Issue 到 GitHub

### Q: 如何贡献代码？

**A:** 欢迎贡献代码：

1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

---

## 🔍 故障排除工具

如果以上解决方案都无法解决您的问题，可以使用内置的诊断工具：

```bash
# 运行系统诊断
scp-upload doctor

# 生成诊断报告
scp-upload debug report

# 启用详细日志
scp-upload --verbose --debug -c server -f test.txt
```

还有问题？请访问我们的 [GitHub Issues](https://github.com/Tenwq/scp-upload-cli/issues) 或查看 [联系我们](/contact) 页面获取更多帮助。