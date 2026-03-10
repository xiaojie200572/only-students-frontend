import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const isDark = ref(false)

  // 初始化时读取本地存储
  const initTheme = () => {
    // 延迟执行确保 DOM 准备好
    setTimeout(() => {
      console.log('DEBUG: Theme store initialized at', new Date().toLocaleTimeString())
      const savedTheme = uni.getStorageSync('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        try {
          isDark.value = uni.getSystemInfoSync().theme === 'dark'
        } catch (e) {
          isDark.value = false
        }
      }
      applyTheme()
    }, 100)
  }

  // 应用主题
  const applyTheme = () => {
    const theme = isDark.value ? 'dark' : 'light'

    uni.setStorageSync('theme', theme)

    // H5: 修改 CSS 类
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      const body = document.body

      // 清除所有主题类
      html?.classList.remove('theme-light', 'theme-dark')
      body?.classList.remove('theme-light', 'theme-dark')

      // 给 html 和 body 都添加主题类
      html?.classList.add(`theme-${theme}`)
      body?.classList.add(`theme-${theme}`)

      // 找到 uni-app 的 page 元素并添加类
      const pages = document.querySelectorAll('page')
      pages.forEach(p => {
        p.classList.remove('theme-light', 'theme-dark')
        p.classList.add(`theme-${theme}`)
      })
    }

    // 小程序: 调用 API
    // #ifdef MP
    uni.setBackgroundColor({
      backgroundColor: isDark ? '#0F1419' : '#FDFCF8',
      backgroundColorTop: isDark ? '#0F1419' : '#FDFCF8',
      backgroundColorBottom: isDark ? '#0F1419' : '#FDFCF8'
    })
    // #endif

    console.log('Theme applied:', theme, 'isDark:', isDark.value)
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  // 设置为白天模式
  const setLight = () => {
    isDark.value = false
    applyTheme()
  }

  // 设置为夜间模式
  const setDark = () => {
    isDark.value = true
    applyTheme()
  }

  // 当前主题文本
  const themeText = computed(() => isDark.value ? '夜间' : '白天')

  return {
    isDark,
    themeText,
    initTheme,
    toggleTheme,
    setLight,
    setDark
  }
})
