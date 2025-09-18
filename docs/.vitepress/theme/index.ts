import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

/**
 * 自定义主题配置
 * 扩展默认主题并添加品牌化样式
 */
export default {
  extends: DefaultTheme,
  
  /**
   * 布局组件配置
   */
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可以在这里添加自定义插槽内容
    })
  },
  
  /**
   * 增强应用配置
   * @param app Vue应用实例
   * @param router 路由实例
   * @param siteData 站点数据
   */
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    // app.component('CustomComponent', CustomComponent)
    
    // 添加全局属性
    app.config.globalProperties.$siteName = 'SCP Upload CLI'
    
    // 路由守卫
    router.onBeforeRouteChange = (to) => {
      // 页面访问统计等逻辑
      if (typeof window !== 'undefined') {
        // Google Analytics 或其他统计代码
        console.log('Navigating to:', to)
      }
    }
  }
} satisfies Theme