/// <reference types='@dcloudio/types' />
import 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    options?: Record<string, any>
  }
}

declare module '@dcloudio/uni-app' {
  interface PageInstance {
    options?: Record<string, any>
  }
}
