<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="page container not-found">
    <p class="eyebrow">404 / Not Found</p>
    <h1 class="not-found__title">
      这条矿道<span class="text-gradient">塌了</span>
    </h1>
    <p class="not-found__lead">
      你要找的页面不存在，可能被 TNT 炸掉了，也可能只是链接抄错了一个字母。
    </p>
    <div class="not-found__actions">
      <RouterLink to="/" class="btn btn--primary">返回首页</RouterLink>
      <RouterLink to="/maps" class="btn btn--ghost">去逛地图汇总</RouterLink>
    </div>
    <p class="not-found__code mono">HTTP 404 · NOCTU CRUCIS STUDIO</p>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--sp-4);
  min-height: 68svh;
  padding-bottom: var(--sp-9);
}

.not-found__title {
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  letter-spacing: -0.03em;
}

.not-found__lead {
  max-width: 46ch;
  color: var(--text-dim);
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}

.not-found__code {
  margin-top: var(--sp-6);
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  color: var(--text-mute);
}
</style>
