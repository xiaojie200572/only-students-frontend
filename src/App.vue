<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { useThemeStore } from "./stores/theme";

const themeStore = useThemeStore();
onLaunch(() => {
  themeStore.initTheme();
});
</script>
<style>
/* 引入主题样式 */
@import '@/styles/theme.css';
</style>