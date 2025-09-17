const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * 验证器类
 * 提供各种安全性验证和输入验证功能
 */
class Validator {
  
  /**
   * 验证IP地址格式
   * @param {string} ip - IP地址
   * @returns {boolean} 是否为有效IP地址
   */
  static isValidIP(ip) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * 验证域名格式
   * @param {string} hostname - 主机名或域名
   * @returns {boolean} 是否为有效域名
   */
  static isValidHostname(hostname) {
    const hostnameRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return hostnameRegex.test(hostname) && hostname.length <= 253;
  }

  /**
   * 验证主机地址（IP或域名）
   * @param {string} host - 主机地址
   * @returns {Object} 验证结果
   */
  static validateHost(host) {
    if (!host || typeof host !== 'string') {
      return {
        isValid: false,
        error: '主机地址不能为空'
      };
    }

    const trimmedHost = host.trim();
    
    if (trimmedHost.length === 0) {
      return {
        isValid: false,
        error: '主机地址不能为空'
      };
    }

    // 检查是否为localhost
    if (trimmedHost === 'localhost' || trimmedHost === '127.0.0.1') {
      return {
        isValid: true,
        warning: '正在连接到本地主机'
      };
    }

    // 验证IP地址或域名
    if (!this.isValidIP(trimmedHost) && !this.isValidHostname(trimmedHost)) {
      return {
        isValid: false,
        error: '无效的IP地址或域名格式'
      };
    }

    return { isValid: true };
  }

  /**
   * 验证端口号
   * @param {number|string} port - 端口号
   * @returns {Object} 验证结果
   */
  static validatePort(port) {
    const portNum = parseInt(port);
    
    if (isNaN(portNum)) {
      return {
        isValid: false,
        error: '端口号必须是数字'
      };
    }

    if (portNum < 1 || portNum > 65535) {
      return {
        isValid: false,
        error: '端口号必须在1-65535之间'
      };
    }

    // 检查常见的危险端口
    const dangerousPorts = [23, 25, 53, 110, 143, 993, 995];
    if (dangerousPorts.includes(portNum)) {
      return {
        isValid: true,
        warning: `端口 ${portNum} 通常用于其他服务，请确认这是SSH端口`
      };
    }

    return { isValid: true };
  }

  /**
   * 验证用户名
   * @param {string} username - 用户名
   * @returns {Object} 验证结果
   */
  static validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return {
        isValid: false,
        error: '用户名不能为空'
      };
    }

    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length === 0) {
      return {
        isValid: false,
        error: '用户名不能为空'
      };
    }

    // 检查用户名长度
    if (trimmedUsername.length > 32) {
      return {
        isValid: false,
        error: '用户名长度不能超过32个字符'
      };
    }

    // 检查用户名格式（Linux用户名规则）
    const usernameRegex = /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return {
        isValid: true,
        warning: '用户名格式可能不符合Linux标准，但将尝试连接'
      };
    }

    // 检查危险的用户名
    const dangerousUsers = ['root'];
    if (dangerousUsers.includes(trimmedUsername)) {
      return {
        isValid: true,
        warning: '正在使用管理员账户，请确保操作安全'
      };
    }

    return { isValid: true };
  }

  /**
   * 验证文件路径
   * @param {string} filePath - 文件路径
   * @param {boolean} checkExists - 是否检查文件存在
   * @returns {Promise<Object>} 验证结果
   */
  static async validateFilePath(filePath, checkExists = true) {
    if (!filePath || typeof filePath !== 'string') {
      return {
        isValid: false,
        error: '文件路径不能为空'
      };
    }

    const trimmedPath = filePath.trim();
    
    if (trimmedPath.length === 0) {
      return {
        isValid: false,
        error: '文件路径不能为空'
      };
    }

    // 检查路径长度
    if (trimmedPath.length > 4096) {
      return {
        isValid: false,
        error: '文件路径过长'
      };
    }

    // 检查危险字符
    const dangerousChars = ['<', '>', '|', '"', '*', '?'];
    for (const char of dangerousChars) {
      if (trimmedPath.includes(char)) {
        return {
          isValid: false,
          error: `文件路径包含非法字符: ${char}`
        };
      }
    }

    if (checkExists) {
      try {
        const resolvedPath = path.resolve(trimmedPath);
        
        if (!await fs.pathExists(resolvedPath)) {
          return {
            isValid: false,
            error: '文件不存在'
          };
        }

        const stats = await fs.stat(resolvedPath);
        
        if (!stats.isFile()) {
          return {
            isValid: false,
            error: '路径不是文件'
          };
        }

        // 检查文件大小
        const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
        if (stats.size > maxSize) {
          return {
            isValid: true,
            warning: '文件较大，传输可能需要较长时间'
          };
        }

        // 检查文件权限
        try {
          await fs.access(resolvedPath, fs.constants.R_OK);
        } catch (error) {
          return {
            isValid: false,
            error: '没有读取文件的权限'
          };
        }

      } catch (error) {
        return {
          isValid: false,
          error: `文件访问错误: ${error.message}`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * 验证远程路径
   * @param {string} remotePath - 远程路径
   * @returns {Object} 验证结果
   */
  static validateRemotePath(remotePath) {
    if (!remotePath || typeof remotePath !== 'string') {
      return {
        isValid: false,
        error: '远程路径不能为空'
      };
    }

    const trimmedPath = remotePath.trim();
    
    if (trimmedPath.length === 0) {
      return {
        isValid: false,
        error: '远程路径不能为空'
      };
    }

    // 检查路径长度
    if (trimmedPath.length > 4096) {
      return {
        isValid: false,
        error: '远程路径过长'
      };
    }

    // 检查是否为绝对路径
    if (!trimmedPath.startsWith('/')) {
      return {
        isValid: true,
        warning: '建议使用绝对路径'
      };
    }

    // 检查危险路径
    const dangerousPaths = ['/etc/passwd', '/etc/shadow', '/boot', '/sys', '/proc'];
    for (const dangerousPath of dangerousPaths) {
      if (trimmedPath.startsWith(dangerousPath)) {
        return {
          isValid: true,
          warning: `正在访问系统敏感目录: ${dangerousPath}`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * 验证私钥文件
   * @param {string} keyPath - 私钥文件路径
   * @returns {Promise<Object>} 验证结果
   */
  static async validatePrivateKey(keyPath) {
    if (!keyPath || typeof keyPath !== 'string') {
      return {
        isValid: false,
        error: '私钥路径不能为空'
      };
    }

    const trimmedPath = keyPath.trim();
    
    if (trimmedPath.length === 0) {
      return {
        isValid: false,
        error: '私钥路径不能为空'
      };
    }

    try {
      const resolvedPath = path.resolve(trimmedPath);
      
      if (!await fs.pathExists(resolvedPath)) {
        return {
          isValid: false,
          error: '私钥文件不存在'
        };
      }

      const stats = await fs.stat(resolvedPath);
      
      if (!stats.isFile()) {
        return {
          isValid: false,
          error: '私钥路径不是文件'
        };
      }

      // 检查文件权限（私钥文件应该只有所有者可读）
      const mode = stats.mode & parseInt('777', 8);
      if (mode & parseInt('077', 8)) {
        return {
          isValid: true,
          warning: '私钥文件权限过于宽松，建议设置为600'
        };
      }

      // 检查文件内容是否像私钥
      try {
        const content = await fs.readFile(resolvedPath, 'utf8');
        const privateKeyHeaders = [
          '-----BEGIN RSA PRIVATE KEY-----',
          '-----BEGIN DSA PRIVATE KEY-----',
          '-----BEGIN EC PRIVATE KEY-----',
          '-----BEGIN OPENSSH PRIVATE KEY-----',
          '-----BEGIN PRIVATE KEY-----'
        ];

        const hasValidHeader = privateKeyHeaders.some(header => 
          content.includes(header)
        );

        if (!hasValidHeader) {
          return {
            isValid: true,
            warning: '文件可能不是有效的私钥格式'
          };
        }

      } catch (error) {
        return {
          isValid: false,
          error: '无法读取私钥文件'
        };
      }

    } catch (error) {
      return {
        isValid: false,
        error: `私钥文件访问错误: ${error.message}`
      };
    }

    return { isValid: true };
  }

  /**
   * 验证完整的上传配置
   * @param {Object} config - 上传配置
   * @returns {Promise<Object>} 验证结果
   */
  static async validateUploadConfig(config) {
    const errors = [];
    const warnings = [];

    // 验证主机地址
    const hostResult = this.validateHost(config.host);
    if (!hostResult.isValid) {
      errors.push(hostResult.error);
    } else if (hostResult.warning) {
      warnings.push(hostResult.warning);
    }

    // 验证端口
    const portResult = this.validatePort(config.port || 22);
    if (!portResult.isValid) {
      errors.push(portResult.error);
    } else if (portResult.warning) {
      warnings.push(portResult.warning);
    }

    // 验证用户名
    const usernameResult = this.validateUsername(config.username);
    if (!usernameResult.isValid) {
      errors.push(usernameResult.error);
    } else if (usernameResult.warning) {
      warnings.push(usernameResult.warning);
    }

    // 验证本地文件路径
    if (config.localPath) {
      const localPathResult = await this.validateFilePath(config.localPath, true);
      if (!localPathResult.isValid) {
        errors.push(localPathResult.error);
      } else if (localPathResult.warning) {
        warnings.push(localPathResult.warning);
      }
    }

    // 验证远程路径
    if (config.remotePath) {
      const remotePathResult = this.validateRemotePath(config.remotePath);
      if (!remotePathResult.isValid) {
        errors.push(remotePathResult.error);
      } else if (remotePathResult.warning) {
        warnings.push(remotePathResult.warning);
      }
    }

    // 验证私钥文件
    if (config.privateKeyPath) {
      const keyResult = await this.validatePrivateKey(config.privateKeyPath);
      if (!keyResult.isValid) {
        errors.push(keyResult.error);
      } else if (keyResult.warning) {
        warnings.push(keyResult.warning);
      }
    }

    // 验证认证方式
    if (!config.password && !config.privateKeyPath) {
      // 检查默认SSH密钥
      const defaultKeyPath = path.join(require('os').homedir(), '.ssh', 'id_rsa');
      if (!await fs.pathExists(defaultKeyPath)) {
        errors.push('未提供密码或私钥，且未找到默认SSH密钥');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 显示验证结果
   * @param {Object} result - 验证结果
   * @param {string} context - 验证上下文
   */
  static displayValidationResult(result, context = '') {
    if (result.errors && result.errors.length > 0) {
      console.log(chalk.red(`\n❌ ${context}验证失败:`));
      result.errors.forEach(error => {
        console.log(chalk.red(`   • ${error}`));
      });
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(chalk.yellow(`\n⚠️  ${context}警告:`));
      result.warnings.forEach(warning => {
        console.log(chalk.yellow(`   • ${warning}`));
      });
    }

    if (result.isValid && (!result.warnings || result.warnings.length === 0)) {
      console.log(chalk.green(`\n✅ ${context}验证通过`));
    }
  }
}

module.exports = Validator;