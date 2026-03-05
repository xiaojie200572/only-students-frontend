<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useThemeStore } from "./stores/theme";

onLaunch(() => {
  // 初始化主题
  const themeStore = useThemeStore();
  themeStore.initTheme();
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* 全局样式已在 theme.css 中定义 */
</style>
