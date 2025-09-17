const { Client } = require('ssh2');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

/**
 * SCP文件上传器类
 * 提供安全的文件传输功能，支持进度显示和错误处理
 */
class SCPUploader {
  constructor() {
    this.client = new Client();
    this.spinner = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  /**
   * 上传文件到远程服务器
   * @param {Object} config - 上传配置
   * @param {string} config.localPath - 本地文件路径
   * @param {string} config.remotePath - 远程文件路径
   * @param {string} config.host - 服务器IP地址
   * @param {string} config.username - 用户名
   * @param {string} config.password - 密码（可选）
   * @param {string} config.privateKey - 私钥路径（可选）
   * @param {number} config.port - SSH端口，默认22
   * @returns {Promise<boolean>} 上传是否成功
   */
  async uploadFile(config) {
    const {
      localPath,
      remotePath,
      host,
      username,
      password,
      privateKey,
      port = 22
    } = config;

    try {
      // 验证本地文件是否存在
      if (!await fs.pathExists(localPath)) {
        throw new Error(`本地文件不存在: ${localPath}`);
      }

      // 获取文件信息
      const stats = await fs.stat(localPath);
      const fileSize = stats.size;
      const fileName = path.basename(localPath);

      console.log(chalk.blue(`\n📁 准备上传文件: ${fileName}`));
      console.log(chalk.gray(`   本地路径: ${localPath}`));
      console.log(chalk.gray(`   远程路径: ${remotePath}`));
      console.log(chalk.gray(`   文件大小: ${this.formatFileSize(fileSize)}`));
      console.log(chalk.gray(`   目标服务器: ${username}@${host}:${port}\n`));

      // 开始上传
      this.spinner = ora('正在连接服务器...').start();

      return new Promise((resolve, reject) => {
        // 准备连接配置
        const connectionConfig = {
          host,
          port,
          username,
          readyTimeout: 30000,
          keepaliveInterval: 10000
        };

        // 添加认证方式
        if (privateKey) {
          connectionConfig.privateKey = fs.readFileSync(privateKey);
        } else if (password) {
          connectionConfig.password = password;
        } else {
          // 尝试使用默认的SSH密钥
          const defaultKeyPath = path.join(require('os').homedir(), '.ssh', 'id_rsa');
          if (fs.existsSync(defaultKeyPath)) {
            connectionConfig.privateKey = fs.readFileSync(defaultKeyPath);
          } else {
            reject(new Error('未提供密码或私钥，且未找到默认SSH密钥'));
            return;
          }
        }

        // 连接到服务器
        this.client.connect(connectionConfig);

        this.client.on('ready', () => {
          this.spinner.text = '服务器连接成功，开始传输文件...';

          // 使用SFTP进行文件传输
          this.client.sftp((err, sftp) => {
            if (err) {
              this.spinner.fail('SFTP连接失败');
              reject(err);
              return;
            }

            // 确保远程目录存在
            const remoteDir = path.dirname(remotePath);
            this.ensureRemoteDirectory(sftp, remoteDir, (dirErr) => {
              if (dirErr) {
                this.spinner.fail('创建远程目录失败');
                reject(dirErr);
                return;
              }

              // 开始文件传输
              let uploadedBytes = 0;
              const startTime = Date.now();

              const writeStream = sftp.createWriteStream(remotePath);
              const readStream = fs.createReadStream(localPath);

              // 监听上传进度
              readStream.on('data', (chunk) => {
                uploadedBytes += chunk.length;
                const progress = ((uploadedBytes / fileSize) * 100).toFixed(1);
                const speed = this.calculateSpeed(uploadedBytes, Date.now() - startTime);
                this.spinner.text = `上传中... ${progress}% (${speed})`;
              });

              // 处理传输完成
              writeStream.on('close', () => {
                const duration = ((Date.now() - startTime) / 1000).toFixed(1);
                this.spinner.succeed(
                  chalk.green(`✅ 文件上传成功！耗时 ${duration}s`)
                );
                this.client.end();
                resolve(true);
              });

              // 处理传输错误
              writeStream.on('error', (uploadErr) => {
                this.spinner.fail('文件上传失败');
                this.client.end();
                reject(uploadErr);
              });

              readStream.on('error', (readErr) => {
                this.spinner.fail('读取本地文件失败');
                this.client.end();
                reject(readErr);
              });

              // 开始传输
              readStream.pipe(writeStream);
            });
          });
        });

        this.client.on('error', (err) => {
          if (this.spinner) {
            this.spinner.fail('连接服务器失败');
          }
          reject(err);
        });

        this.client.on('end', () => {
          // 连接正常结束
        });
      });

    } catch (error) {
      if (this.spinner) {
        this.spinner.fail('上传失败');
      }
      throw error;
    }
  }

  /**
   * 确保远程目录存在
   * @param {Object} sftp - SFTP连接对象
   * @param {string} remotePath - 远程目录路径
   * @param {Function} callback - 回调函数
   */
  ensureRemoteDirectory(sftp, remotePath, callback) {
    sftp.stat(remotePath, (err, stats) => {
      if (err) {
        // 目录不存在，尝试创建
        sftp.mkdir(remotePath, { mode: 0o755 }, (mkdirErr) => {
          if (mkdirErr && mkdirErr.code !== 4) { // 4表示目录已存在
            callback(mkdirErr);
          } else {
            callback(null);
          }
        });
      } else if (stats.isDirectory()) {
        // 目录已存在
        callback(null);
      } else {
        // 路径存在但不是目录
        callback(new Error(`远程路径不是目录: ${remotePath}`));
      }
    });
  }

  /**
   * 格式化文件大小显示
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的文件大小
   */
  formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 计算传输速度
   * @param {number} bytes - 已传输字节数
   * @param {number} timeMs - 耗时（毫秒）
   * @returns {string} 格式化后的传输速度
   */
  calculateSpeed(bytes, timeMs) {
    const bytesPerSecond = bytes / (timeMs / 1000);
    return this.formatFileSize(bytesPerSecond) + '/s';
  }

  /**
   * 重试上传
   * @param {Object} config - 上传配置
   * @returns {Promise<boolean>} 上传是否成功
   */
  async uploadWithRetry(config) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.uploadFile(config);
      } catch (error) {
        console.log(chalk.yellow(`\n⚠️  第 ${attempt} 次尝试失败: ${error.message}`));
        
        if (attempt === this.maxRetries) {
          console.log(chalk.red(`❌ 已达到最大重试次数 (${this.maxRetries})，上传失败`));
          throw error;
        }
        
        console.log(chalk.blue(`🔄 ${3 - attempt} 秒后进行第 ${attempt + 1} 次重试...`));
        await this.sleep(3000);
      }
    }
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise} Promise对象
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 关闭连接
   */
  disconnect() {
    if (this.client) {
      this.client.end();
    }
    if (this.spinner) {
      this.spinner.stop();
    }
  }
}

module.exports = SCPUploader;