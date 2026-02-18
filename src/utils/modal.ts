import { ref, createApp, h } from 'vue'
import CustomModal from '@/components/CustomModal.vue'

interface ModalOptions {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  confirmColor?: string
}

export const showCustomModal = (options: ModalOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    const visible = ref(true)
    
    const handleConfirm = () => {
      visible.value = false
      resolve(true)
    }
    
    const handleCancel = () => {
      visible.value = false
      resolve(false)
    }
    
    const handleClose = () => {
      visible.value = false
      resolve(false)
    }
    
    // 创建临时容器
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    // 使用 createApp 创建临时应用实例
    const app = createApp({
      render() {
        return h(CustomModal, {
          visible: visible.value,
          title: options.title,
          content: options.content,
          confirmText: options.confirmText || '确定',
          cancelText: options.cancelText || '取消',
          showCancel: options.showCancel !== false,
          confirmColor: options.confirmColor,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          onClose: handleClose
        })
      }
    })
    
    app.mount(container)
    
    // 监听 visible 变化，当弹窗关闭时清理
    const unwatch = visible.value
    setTimeout(() => {
      if (!visible.value) {
        app.unmount()
        container.remove()
      }
    }, 300)
  })
}

export default showCustomModal
