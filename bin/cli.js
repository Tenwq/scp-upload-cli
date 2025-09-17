#!/usr/bin/env node

const inquirer = require('inquirer');
const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const SCPUploader = require('../lib/scp-uploader');
const ConfigManager = require('../lib/config-manager');

const program = new Command();
const uploader = new SCPUploader();
const configManager = new ConfigManager();

/**
 * 显示欢迎信息
 */
function showWelcome() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                    SCP 文件上传工具                          ║
║                                                              ║
║  🚀 快速、安全地将文件上传到远程服务器                        ║
║  💾 支持配置保存，方便重复使用                                ║
║  📊 实时显示传输进度                                          ║
╚══════════════════════════════════════════════════════════════╝
  `));
}

/**
 * 主菜单选项
 */
async function showMainMenu() {
  const choices = [
    { name: '📤 上传文件', value: 'upload' },
    { name: '⚙️  管理服务器配置', value: 'config' },
    { name: '📋 查看已保存的配置', value: 'list' },
    { name: '❌ 退出', value: 'exit' }
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '请选择操作:',
      choices
    }
  ]);

  return action;
}

/**
 * 配置管理菜单
 */
async function showConfigMenu() {
  const choices = [
    { name: '➕ 添加新配置', value: 'add' },
    { name: '📝 编辑配置', value: 'edit' },
    { name: '🗑️  删除配置', value: 'delete' },
    { name: '📤 导出配置', value: 'export' },
    { name: '📥 导入配置', value: 'import' },
    { name: '🔙 返回主菜单', value: 'back' }
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '配置管理:',
      choices
    }
  ]);

  return action;
}

/**
 * 获取文件上传参数
 */
async function getUploadParams() {
  console.log(chalk.blue('\n📁 文件上传配置'));
  
  // 检查是否有保存的配置
  const configNames = await configManager.getConfigNames();
  const recentConfigs = await configManager.getRecentConfigs(3);
  
  let useExistingConfig = false;
  let selectedConfig = null;

  if (configNames.length > 0) {
    const { useConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useConfig',
        message: '是否使用已保存的服务器配置？',
        default: true
      }
    ]);

    if (useConfig) {
      // 显示最近使用的配置和所有配置
      const choices = [];
      
      if (recentConfigs.length > 0) {
        choices.push(new inquirer.Separator('--- 最近使用 ---'));
        recentConfigs.forEach(config => {
          choices.push({
            name: `${config.name} (${config.username}@${config.host})`,
            value: config.name
          });
        });
      }
      
      if (configNames.length > recentConfigs.length) {
        choices.push(new inquirer.Separator('--- 所有配置 ---'));
        configNames.forEach(name => {
          if (!recentConfigs.find(c => c.name === name)) {
            choices.push({ name, value: name });
          }
        });
      }

      const { configName } = await inquirer.prompt([
        {
          type: 'list',
          name: 'configName',
          message: '选择服务器配置:',
          choices
        }
      ]);

      selectedConfig = await configManager.getServerConfig(configName);
      useExistingConfig = true;
    }
  }

  // 获取本地文件路径
  const { localPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'localPath',
      message: '本地文件路径:',
      validate: async (input) => {
        if (!input.trim()) {
          return '请输入文件路径';
        }
        
        const fullPath = path.resolve(input.trim());
        if (!await fs.pathExists(fullPath)) {
          return '文件不存在，请检查路径';
        }
        
        const stats = await fs.stat(fullPath);
        if (!stats.isFile()) {
          return '请输入文件路径，不是目录';
        }
        
        return true;
      },
      filter: (input) => path.resolve(input.trim())
    }
  ]);

  let serverConfig;
  
  if (useExistingConfig && selectedConfig) {
    // 使用已保存的配置
    serverConfig = selectedConfig;
    
    // 询问是否使用默认远程路径
    const fileName = path.basename(localPath);
    const defaultRemotePath = path.join(selectedConfig.defaultRemotePath, fileName);
    
    const { useDefaultPath } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useDefaultPath',
        message: `使用默认远程路径？ (${defaultRemotePath})`,
        default: true
      }
    ]);

    if (useDefaultPath) {
      serverConfig.remotePath = defaultRemotePath;
    } else {
      const { remotePath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'remotePath',
          message: '远程文件路径:',
          validate: (input) => input.trim() ? true : '请输入远程路径'
        }
      ]);
      serverConfig.remotePath = remotePath.trim();
    }

    // 如果配置中没有私钥且需要密码
    if (!serverConfig.privateKeyPath) {
      const { password } = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: `${serverConfig.username}@${serverConfig.host} 的密码:`,
          mask: '*'
        }
      ]);
      serverConfig.password = password;
    }
    
  } else {
    // 手动输入配置
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'host',
        message: '服务器IP地址:',
        validate: (input) => input.trim() ? true : '请输入服务器地址'
      },
      {
        type: 'input',
        name: 'username',
        message: '用户名:',
        validate: (input) => input.trim() ? true : '请输入用户名'
      },
      {
        type: 'input',
        name: 'port',
        message: 'SSH端口:',
        default: '22',
        validate: (input) => {
          const port = parseInt(input);
          return (port > 0 && port <= 65535) ? true : '请输入有效的端口号 (1-65535)';
        }
      },
      {
        type: 'input',
        name: 'remotePath',
        message: '远程文件路径:',
        validate: (input) => input.trim() ? true : '请输入远程路径'
      },
      {
        type: 'list',
        name: 'authMethod',
        message: '认证方式:',
        choices: [
          { name: '密码认证', value: 'password' },
          { name: '私钥认证', value: 'privateKey' },
          { name: '使用默认SSH密钥', value: 'default' }
        ]
      }
    ]);

    serverConfig = {
      host: answers.host.trim(),
      username: answers.username.trim(),
      port: parseInt(answers.port),
      remotePath: answers.remotePath.trim()
    };

    // 根据认证方式获取相应信息
    if (answers.authMethod === 'password') {
      const { password } = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: '密码:',
          mask: '*'
        }
      ]);
      serverConfig.password = password;
    } else if (answers.authMethod === 'privateKey') {
      const { privateKeyPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'privateKeyPath',
          message: '私钥文件路径:',
          validate: async (input) => {
            if (!input.trim()) {
              return '请输入私钥文件路径';
            }
            const keyPath = path.resolve(input.trim());
            if (!await fs.pathExists(keyPath)) {
              return '私钥文件不存在';
            }
            return true;
          }
        }
      ]);
      serverConfig.privateKeyPath = path.resolve(privateKeyPath.trim());
    }

    // 询问是否保存配置
    const { saveConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveConfig',
        message: '是否保存此服务器配置以便下次使用？',
        default: true
      }
    ]);

    if (saveConfig) {
      const { configName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'configName',
          message: '配置名称:',
          validate: (input) => input.trim() ? true : '请输入配置名称'
        }
      ]);

      await configManager.saveServerConfig(configName.trim(), {
        ...serverConfig,
        defaultRemotePath: path.dirname(serverConfig.remotePath)
      });
    }
  }

  return {
    localPath,
    ...serverConfig
  };
}

/**
 * 执行文件上传
 */
async function performUpload() {
  try {
    const uploadConfig = await getUploadParams();
    
    console.log(chalk.blue('\n🚀 开始上传文件...'));
    
    const success = await uploader.uploadWithRetry(uploadConfig);
    
    if (success) {
      console.log(chalk.green('\n🎉 文件上传完成！'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ 上传失败:'), error.message);
    
    // 询问是否重试
    const { retry } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'retry',
        message: '是否重试？',
        default: false
      }
    ]);

    if (retry) {
      await performUpload();
    }
  }
}

/**
 * 添加新的服务器配置
 */
async function addServerConfig() {
  console.log(chalk.blue('\n➕ 添加服务器配置'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '配置名称:',
      validate: async (input) => {
        if (!input.trim()) {
          return '请输入配置名称';
        }
        
        const existingNames = await configManager.getConfigNames();
        if (existingNames.includes(input.trim())) {
          return '配置名称已存在，请使用其他名称';
        }
        
        return true;
      }
    },
    {
      type: 'input',
      name: 'host',
      message: '服务器IP地址:',
      validate: (input) => input.trim() ? true : '请输入服务器地址'
    },
    {
      type: 'input',
      name: 'username',
      message: '用户名:',
      validate: (input) => input.trim() ? true : '请输入用户名'
    },
    {
      type: 'input',
      name: 'port',
      message: 'SSH端口:',
      default: '22',
      validate: (input) => {
        const port = parseInt(input);
        return (port > 0 && port <= 65535) ? true : '请输入有效的端口号 (1-65535)';
      }
    },
    {
      type: 'input',
      name: 'defaultRemotePath',
      message: '默认远程目录:',
      default: '/tmp',
      validate: (input) => input.trim() ? true : '请输入默认远程目录'
    },
    {
      type: 'input',
      name: 'privateKeyPath',
      message: '私钥文件路径 (可选，留空使用密码认证):',
      validate: async (input) => {
        if (!input.trim()) {
          return true; // 可选字段
        }
        const keyPath = path.resolve(input.trim());
        if (!await fs.pathExists(keyPath)) {
          return '私钥文件不存在';
        }
        return true;
      }
    }
  ]);

  const config = {
    host: answers.host.trim(),
    username: answers.username.trim(),
    port: parseInt(answers.port),
    defaultRemotePath: answers.defaultRemotePath.trim(),
    privateKeyPath: answers.privateKeyPath.trim() || ''
  };

  await configManager.saveServerConfig(answers.name.trim(), config);
}

/**
 * 删除服务器配置
 */
async function deleteServerConfig() {
  const configNames = await configManager.getConfigNames();
  
  if (configNames.length === 0) {
    console.log(chalk.yellow('📝 暂无保存的配置'));
    return;
  }

  const { configName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'configName',
      message: '选择要删除的配置:',
      choices: configNames
    }
  ]);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `确定要删除配置 "${configName}" 吗？`,
      default: false
    }
  ]);

  if (confirm) {
    await configManager.deleteServerConfig(configName);
  }
}

/**
 * 主程序入口
 */
async function main() {
  try {
    showWelcome();
    
    while (true) {
      const action = await showMainMenu();
      
      switch (action) {
        case 'upload':
          await performUpload();
          break;
          
        case 'config':
          const configAction = await showConfigMenu();
          switch (configAction) {
            case 'add':
              await addServerConfig();
              break;
            case 'delete':
              await deleteServerConfig();
              break;
            case 'back':
              break;
          }
          break;
          
        case 'list':
          await configManager.listServerConfigs();
          break;
          
        case 'exit':
          console.log(chalk.cyan('\n👋 感谢使用 SCP 文件上传工具！'));
          process.exit(0);
          break;
      }
      
      // 添加分隔线
      console.log(chalk.gray('\n' + '─'.repeat(60) + '\n'));
    }
    
  } catch (error) {
    console.error(chalk.red('程序运行出错:'), error.message);
    process.exit(1);
  }
}

// 处理程序退出
process.on('SIGINT', () => {
  console.log(chalk.cyan('\n\n👋 感谢使用 SCP 文件上传工具！'));
  uploader.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  uploader.disconnect();
  process.exit(0);
});

// 设置命令行程序信息
program
  .name('scp-upload')
  .description('SCP 文件上传工具 - 快速、安全地将文件上传到远程服务器')
  .version('1.0.0');

// 如果没有参数，显示交互界面
if (process.argv.length <= 2) {
  main();
} else {
  program.parse();
}