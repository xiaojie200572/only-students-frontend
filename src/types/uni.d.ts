interface UniAppOptions {
  backgroundColor?: string
  backgroundColorTop?: string
  backgroundColorBottom?: string
  success?: (res: any) => void
  fail?: (res: any) => void
  complete?: (res: any) => void
}

interface UniSystemInfo {
  theme?: string
  [key: string]: any
}

interface UniStorageResult {
  errMsg: string
  data: any
}

declare const uni: {
  request(options: any): any
  uploadFile(options: any): any
  showLoading(options: any): void
  hideLoading(): void
  showToast(options: any): void
  getStorageSync(key: string): any
  setStorageSync(key: string, value: any): void
  removeStorageSync(key: string): void
  getSystemInfoSync(): UniSystemInfo
  navigateTo(options: any): any
  switchTab(options: any): any
  navigateBack(options?: any): any
  pageScrollTo(options: any): any
  setBackgroundColor(options: UniAppOptions): any
  reLaunch(options: any): any
  redirectTo(options: any): any
  previewImage(options: any): any
  getLocation(options: any): any
  setNavigationBarTitle(options: any): any
  showModal(options: any): any
  showActionSheet(options: any): any
  downloadFile(options: any): any
  openDocument(options: any): any
  login(options: any): any
  getUserProfile(options: any): any
  [key: string]: any
}
