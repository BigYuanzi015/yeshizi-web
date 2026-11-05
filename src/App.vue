<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useSeo } from '@/composables/useSeo'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SiteBackdrop from '@/components/layout/SiteBackdrop.vue'
import { RouterView } from 'vue-router'

useReveal()
useSeo()
const { progress } = useScrollProgress()
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <SiteBackdrop />
  <div class="progress" aria-hidden="true">
    <span class="progress__bar" :style="{ transform: `scaleX(${progress})` }"></span>
  </div>
  <AppHeader />
  <main id="main" class="app-main">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
</template>

<style scoped>
.app-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.progress {
  position: fixed;
  inset: 0 0 auto;
  z-index: calc(var(--z-header) + 1);
  height: 2px;
  pointer-events: none;
}

.progress__bar {
  display: block;
  height: 100%;
  transform-origin: 0 50%;
  background: var(--grad-accent);
  box-shadow: 0 0 12px var(--accent-glow);
  transition: transform 120ms linear;
}

.skip-link {
  position: fixed;
  top: 10px;
  left: 50%;
  z-index: calc(var(--z-header) + 2);
  padding: 0.6rem 1.1rem;
  border-radius: var(--r-pill);
  background: var(--accent);
  color: var(--text-on-accent);
  font-size: var(--fs-xs);
  font-weight: 700;
  transform: translate(-50%, -160%);
  transition: transform var(--dur-2) var(--ease-out);
}

.skip-link:focus-visible {
  transform: translate(-50%, 0);
}
</style>
