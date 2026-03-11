import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useUserStore } from "./stores/user";
import { useThemeStore } from "./stores/theme";
import "./styles/theme.css";

export function createApp() {
  //asd
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);

  // 初始化用户和主题
  const initApp = () => {
    const userStore = useUserStore();
    const themeStore = useThemeStore();

    userStore.initUser();
    themeStore.initTheme();
  };

  // 延迟初始化，确保pinia已就绪
  setTimeout(initApp, 0);

  return {
    app,
  };
}
