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
    const bgColor = isDark.value ? '#0F1419' : '#FDFCF8'
    const textColor = isDark.value ? '#F5F3EE' : '#2C2419'

    uni.setStorageSync('theme', theme)

    // H5 端：使用 JS 设置 CSS 变量
    // #ifdef H5
    if (typeof document !== 'undefined') {
      const lightColors = {
        '--bg-primary': '#FDFCF8',
        '--bg-secondary': '#F5F3EE',
        '--bg-card': '#FFFFFF',
        '--bg-hover': '#F0EDE6',
        '--text-primary': '#2C2419',
        '--text-secondary': '#6B5D4D',
        '--text-tertiary': '#9B8B7A',
        '--text-inverse': '#FFFFFF',
        '--accent-warm': '#E07B54',
        '--accent-coral': '#FF8B6B',
        '--accent-gold': '#D4A574',
        '--accent-olive': '#8B9A6D',
        '--border-light': '#E8E4DC',
        '--border-medium': '#D4CFC4',
      }

      const darkColors = {
        '--bg-primary': '#0F1419',
        '--bg-secondary': '#1A1F26',
        '--bg-card': '#252B33',
        '--bg-hover': '#2D343C',
        '--text-primary': '#F5F3EE',
        '--text-secondary': '#B8B0A3',
        '--text-tertiary': '#7A7266',
        '--text-inverse': '#0F1419',
        '--accent-warm': '#E07B54',
        '--accent-coral': '#FF8B6B',
        '--accent-gold': '#D4A574',
        '--accent-olive': '#8B9A6D',
        '--border-light': '#2D343C',
        '--border-medium': '#3D454F',
      }

      const colors = isDark.value ? darkColors : lightColors

      Object.entries(colors).forEach(([key, value]) => {
        document.body.style.setProperty(key, value)
        document.documentElement.style.setProperty(key, value)
      })

      document.body.style.backgroundColor = bgColor
      document.body.style.color = textColor
      
      const uniPageBody = document.querySelector('uni-page-body') as HTMLElement
      if (uniPageBody) {
        uniPageBody.style.setProperty('background-color', bgColor, 'important')
      }

      const navBar = document.querySelector('.uni-page-head') as HTMLElement
      if (navBar) {
        navBar.style.backgroundColor = bgColor
        navBar.style.color = textColor
      }

      document.documentElement.classList.remove('theme-light', 'theme-dark')
      document.body.classList.remove('theme-light', 'theme-dark')
      document.documentElement.classList.add(`theme-${theme}`)
      document.body.classList.add(`theme-${theme}`)
    }
    // #endif

    // 小程序端：使用官方 API
    // #ifdef MP
    uni.setBackgroundColor({
      backgroundColor: bgColor,
      backgroundColorTop: bgColor,
      backgroundColorBottom: bgColor
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
