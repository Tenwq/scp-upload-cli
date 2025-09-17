const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

/**
 * 配置管理器类
 * 负责保存、加载和管理服务器配置信息
 */
class ConfigManager {
  constructor() {
    this.configDir = path.join(os.homedir(), '.scp-upload-cli');
    this.configFile = path.join(this.configDir, 'servers.json');
    this.ensureConfigDir();
  }

  /**
   * 确保配置目录存在
   */
  async ensureConfigDir() {
    try {
      await fs.ensureDir(this.configDir);
    } catch (error) {
      console.error(chalk.red('创建配置目录失败:'), error.message);
    }
  }

  /**
   * 保存服务器配置
   * @param {string} name - 配置名称
   * @param {Object} config - 服务器配置
   * @param {string} config.host - 服务器IP地址
   * @param {string} config.username - 用户名
   * @param {number} config.port - SSH端口
   * @param {string} config.defaultRemotePath - 默认远程路径
   * @param {string} config.privateKeyPath - 私钥路径（可选）
   * @returns {Promise<boolean>} 保存是否成功
   */
  async saveServerConfig(name, config) {
    try {
      const configs = await this.loadAllConfigs();
      
      // 移除敏感信息（密码不保存到文件）
      const safeConfig = {
        host: config.host,
        username: config.username,
        port: config.port || 22,
        defaultRemotePath: config.defaultRemotePath || '/tmp',
        privateKeyPath: config.privateKeyPath || '',
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };

      configs[name] = safeConfig;
      await fs.writeJson(this.configFile, configs, { spaces: 2 });
      
      console.log(chalk.green(`✅ 服务器配置 "${name}" 已保存`));
      return true;
    } catch (error) {
      console.error(chalk.red('保存配置失败:'), error.message);
      return false;
    }
  }

  /**
   * 加载所有服务器配置
   * @returns {Promise<Object>} 所有配置对象
   */
  async loadAllConfigs() {
    try {
      if (await fs.pathExists(this.configFile)) {
        return await fs.readJson(this.configFile);
      }
      return {};
    } catch (error) {
      console.error(chalk.red('加载配置失败:'), error.message);
      return {};
    }
  }

  /**
   * 获取指定名称的服务器配置
   * @param {string} name - 配置名称
   * @returns {Promise<Object|null>} 服务器配置或null
   */
  async getServerConfig(name) {
    try {
      const configs = await this.loadAllConfigs();
      const config = configs[name];
      
      if (config) {
        // 更新最后使用时间
        config.lastUsed = new Date().toISOString();
        configs[name] = config;
        await fs.writeJson(this.configFile, configs, { spaces: 2 });
        return config;
      }
      
      return null;
    } catch (error) {
      console.error(chalk.red('获取配置失败:'), error.message);
      return null;
    }
  }

  /**
   * 获取所有配置名称列表
   * @returns {Promise<Array>} 配置名称数组
   */
  async getConfigNames() {
    try {
      const configs = await this.loadAllConfigs();
      return Object.keys(configs).sort();
    } catch (error) {
      console.error(chalk.red('获取配置列表失败:'), error.message);
      return [];
    }
  }

  /**
   * 删除指定的服务器配置
   * @param {string} name - 配置名称
   * @returns {Promise<boolean>} 删除是否成功
   */
  async deleteServerConfig(name) {
    try {
      const configs = await this.loadAllConfigs();
      
      if (configs[name]) {
        delete configs[name];
        await fs.writeJson(this.configFile, configs, { spaces: 2 });
        console.log(chalk.green(`✅ 服务器配置 "${name}" 已删除`));
        return true;
      } else {
        console.log(chalk.yellow(`⚠️  配置 "${name}" 不存在`));
        return false;
      }
    } catch (error) {
      console.error(chalk.red('删除配置失败:'), error.message);
      return false;
    }
  }

  /**
   * 列出所有保存的服务器配置
   * @returns {Promise<void>}
   */
  async listServerConfigs() {
    try {
      const configs = await this.loadAllConfigs();
      const names = Object.keys(configs);
      
      if (names.length === 0) {
        console.log(chalk.yellow('📝 暂无保存的服务器配置'));
        return;
      }

      console.log(chalk.blue('\n📋 已保存的服务器配置:'));
      console.log(chalk.gray('─'.repeat(60)));
      
      names.forEach((name, index) => {
        const config = configs[name];
        const lastUsed = new Date(config.lastUsed).toLocaleString();
        
        console.log(chalk.white(`${index + 1}. ${chalk.bold(name)}`));
        console.log(chalk.gray(`   服务器: ${config.username}@${config.host}:${config.port}`));
        console.log(chalk.gray(`   默认路径: ${config.defaultRemotePath}`));
        console.log(chalk.gray(`   最后使用: ${lastUsed}`));
        
        if (index < names.length - 1) {
          console.log('');
        }
      });
      
      console.log(chalk.gray('─'.repeat(60)));
    } catch (error) {
      console.error(chalk.red('列出配置失败:'), error.message);
    }
  }

  /**
   * 获取最近使用的配置
   * @param {number} limit - 返回数量限制，默认5个
   * @returns {Promise<Array>} 最近使用的配置数组
   */
  async getRecentConfigs(limit = 5) {
    try {
      const configs = await this.loadAllConfigs();
      const configArray = Object.entries(configs).map(([name, config]) => ({
        name,
        ...config
      }));

      // 按最后使用时间排序
      configArray.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));
      
      return configArray.slice(0, limit);
    } catch (error) {
      console.error(chalk.red('获取最近配置失败:'), error.message);
      return [];
    }
  }

  /**
   * 验证配置的完整性
   * @param {Object} config - 配置对象
   * @returns {Object} 验证结果
   */
  validateConfig(config) {
    const errors = [];
    const warnings = [];

    // 必需字段检查
    if (!config.host) {
      errors.push('缺少服务器地址');
    }
    if (!config.username) {
      errors.push('缺少用户名');
    }

    // 端口检查
    if (config.port && (config.port < 1 || config.port > 65535)) {
      errors.push('端口号无效（应在1-65535之间）');
    }

    // 私钥文件检查
    if (config.privateKeyPath && !fs.existsSync(config.privateKeyPath)) {
      warnings.push(`私钥文件不存在: ${config.privateKeyPath}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 导出配置到文件
   * @param {string} exportPath - 导出文件路径
   * @returns {Promise<boolean>} 导出是否成功
   */
  async exportConfigs(exportPath) {
    try {
      const configs = await this.loadAllConfigs();
      await fs.writeJson(exportPath, configs, { spaces: 2 });
      console.log(chalk.green(`✅ 配置已导出到: ${exportPath}`));
      return true;
    } catch (error) {
      console.error(chalk.red('导出配置失败:'), error.message);
      return false;
    }
  }

  /**
   * 从文件导入配置
   * @param {string} importPath - 导入文件路径
   * @returns {Promise<boolean>} 导入是否成功
   */
  async importConfigs(importPath) {
    try {
      if (!await fs.pathExists(importPath)) {
        console.error(chalk.red('导入文件不存在:'), importPath);
        return false;
      }

      const importedConfigs = await fs.readJson(importPath);
      const currentConfigs = await this.loadAllConfigs();
      
      // 合并配置
      const mergedConfigs = { ...currentConfigs, ...importedConfigs };
      await fs.writeJson(this.configFile, mergedConfigs, { spaces: 2 });
      
      const importedCount = Object.keys(importedConfigs).length;
      console.log(chalk.green(`✅ 成功导入 ${importedCount} 个配置`));
      return true;
    } catch (error) {
      console.error(chalk.red('导入配置失败:'), error.message);
      return false;
    }
  }
}

module.exports = ConfigManager;