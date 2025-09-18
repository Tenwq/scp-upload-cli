import { defineConfig } from 'vitepress'

/**
 * VitePress 配置文件
 * 定义站点的基础配置、主题设置、导航结构等
 */
export default defineConfig({
  // 站点基础配置
  title: 'SCP Upload CLI',
  description: '一个便捷、安全的SCP文件上传命令行工具',
  base: '/scp-upload-cli/',
  
  // 语言配置
  lang: 'zh-CN',
  
  // 网站头部配置
  head: [
    // Favicon
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/scp-upload-cli/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/scp-upload-cli/apple-touch-icon.png' }],
    
    // SEO Meta Tags
    ['meta', { name: 'description', content: 'SCP Upload CLI - 专业的文件上传命令行工具，支持SCP协议，提供安全、高效的文件传输解决方案' }],
    ['meta', { name: 'keywords', content: 'SCP, 文件上传, 命令行工具, CLI, 文件传输, SSH, 服务器管理, DevOps' }],
    ['meta', { name: 'author', content: 'SCP Upload CLI Team' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://tenwq.github.io/scp-upload-cli/' }],
    ['meta', { property: 'og:title', content: 'SCP Upload CLI - 专业文件上传工具' }],
    ['meta', { property: 'og:description', content: '专业的文件上传命令行工具，支持SCP协议，提供安全、高效的文件传输解决方案' }],
    ['meta', { property: 'og:image', content: 'https://tenwq.github.io/scp-upload-cli/og-image.png' }],
    ['meta', { property: 'og:site_name', content: 'SCP Upload CLI' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:url', content: 'https://tenwq.github.io/scp-upload-cli/' }],
    ['meta', { name: 'twitter:title', content: 'SCP Upload CLI - 专业文件上传工具' }],
    ['meta', { name: 'twitter:description', content: '专业的文件上传命令行工具，支持SCP协议，提供安全、高效的文件传输解决方案' }],
    ['meta', { name: 'twitter:image', content: 'https://tenwq.github.io/scp-upload-cli/og-image.png' }],
    
    // Additional SEO
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
    ['link', { rel: 'canonical', href: 'https://tenwq.github.io/scp-upload-cli/' }],
    
    // Performance and Security
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    
    // Structured Data
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'SCP Upload CLI',
      'description': '专业的文件上传命令行工具，支持SCP协议',
      'url': 'https://tenwq.github.io/scp-upload-cli/',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': ['Windows', 'macOS', 'Linux'],
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'author': {
        '@type': 'Organization',
        'name': 'SCP Upload CLI Team'
      }
    })]
  ],

  // 主题配置
  themeConfig: {
    // 站点标题和Logo
    logo: '/logo.svg',
    siteTitle: 'SCP Upload CLI',
    
    // 导航菜单
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '指南', 
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '功能特性', link: '/guide/features' },
          { text: '配置指南', link: '/guide/configuration' },
          { text: '常见问题', link: '/guide/faq' }
        ]
      },
      { text: '联系我们', link: '/contact' },
      {
        text: '资源',
        items: [
          { text: 'GitHub', link: 'https://github.com/Tenwq/scp-upload-cli' },
          { text: '更新日志', link: 'https://github.com/Tenwq/scp-upload-cli/releases' },
          { text: 'API 文档', link: 'https://github.com/Tenwq/scp-upload-cli/wiki/API' },
          { text: '贡献指南', link: 'https://github.com/Tenwq/scp-upload-cli/blob/main/CONTRIBUTING.md' }
        ]
      }
    ],

    // 侧边栏配置
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          collapsed: false,
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '功能特性', link: '/guide/features' }
          ]
        },
        {
          text: '配置与使用',
          collapsed: false,
          items: [
            { text: '配置指南', link: '/guide/configuration' },
            { text: '高级用法', link: '/guide/advanced' },
            { text: '最佳实践', link: '/guide/best-practices' }
          ]
        },
        {
          text: '帮助与支持',
          collapsed: false,
          items: [
            { text: '常见问题', link: '/guide/faq' },
            { text: '故障排除', link: '/guide/troubleshooting' },
            { text: '联系我们', link: '/contact' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Tenwq/scp-upload-cli' }
    ],

    // 页脚配置
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024 Tenwq'
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/Tenwq/scp-upload-cli/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 文档页脚导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 返回顶部
    returnToTopLabel: '回到顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式切换标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // Markdown 配置
  markdown: {
    // 代码块行号
    lineNumbers: true,
    
    // 代码块主题
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },

    // 数学公式支持
    math: true,

    // 容器配置
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },

    config: (md) => {
      // 可以在这里添加 markdown-it 插件
    }
  },

  // 清理 URL
  cleanUrls: true,

  // 最后更新时间
  lastUpdated: true,

  // 忽略死链检查
  ignoreDeadLinks: false
})