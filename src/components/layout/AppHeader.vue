<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { siteInfo } from '@/data/site'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { isLight, toggle: toggleTheme } = useTheme()

const scrolled = ref(false)
const open = ref(false)
const burgerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const navItems = [
  { label: '首页', to: '/' },
  { label: '地图汇总', to: '/maps' },
  { label: '关于我们', to: '/about' },
  { label: '投喂榜', to: '/supporters' },
]

let frame = 0

function onScroll(): void {
  scrolled.value = window.scrollY > 12
}

function handleScroll(): void {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    onScroll()
  })
}

function close(): void {
  open.value = false
}

function toggleMenu(): void {
  open.value = !open.value
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) close()
}

watch(open, async (value) => {
  document.body.classList.toggle('is-locked', value)
  if (value) {
    await nextTick()
    panelRef.value?.querySelector<HTMLElement>('a')?.focus()
  } else {
    burgerRef.value?.focus()
  }
})

watch(
  () => route.fullPath,
  () => close(),
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', onKeydown)
  if (frame) cancelAnimationFrame(frame)
  document.body.classList.remove('is-locked')
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="container header__inner">
      <RouterLink to="/" class="brand" aria-label="夜十字工作室首页" @click="close">
        <span class="brand__mark-wrap">
          <img class="brand__mark only-dark" src="/img/brand-cross.png" alt="" />
          <img class="brand__mark only-light" src="/img/brand-cross-ink.png" alt="" />
        </span>
        <span class="brand__text">
          <strong>夜十字工作室</strong>
          <small>NOCTU CRUCIS STUDIO</small>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav__link">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <button
          class="theme-toggle"
          type="button"
          :aria-label="isLight ? '切换到黑夜模式' : '切换到白天模式'"
          :title="isLight ? '切换到黑夜模式' : '切换到白天模式'"
          :data-theme-state="isLight ? 'light' : 'dark'"
          @click="toggleTheme"
        >
          <span class="theme-toggle__icon" aria-hidden="true">
            <svg v-if="isLight" viewBox="0 0 24 24" width="17" height="17" fill="none">
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7" />
              <path
                d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="17" height="17" fill="none">
              <path
                d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>

        <RouterLink to="/login" class="btn btn--ghost btn--sm header__login">登录</RouterLink>
        <a
          class="btn btn--primary btn--sm header__join"
          :href="siteInfo.joinUrl"
          target="_blank"
          rel="noreferrer"
        >
          加入我们
        </a>
        <button
          ref="burgerRef"
          class="burger"
          type="button"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? '关闭导航菜单' : '打开导航菜单'"
          @click="toggleMenu"
        >
          <span :class="{ 'is-open': open }"></span>
          <span :class="{ 'is-open': open }"></span>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="mobile">
      <div v-if="open" class="mobile" id="mobile-nav">
        <div class="mobile__scrim" @click="close"></div>
        <div
          ref="panelRef"
          class="mobile__panel"
          role="dialog"
          aria-modal="true"
          aria-label="站点导航"
        >
          <div class="mobile__head">
            <span class="eyebrow">Navigation</span>
            <button class="mobile__close" type="button" aria-label="关闭导航菜单" @click="close">
              ✕
            </button>
          </div>
          <nav class="mobile__nav">
            <RouterLink
              v-for="(item, index) in navItems"
              :key="item.to"
              :to="item.to"
              class="mobile__link"
              @click="close"
            >
              <span class="mobile__index mono">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="mobile__label">{{ item.label }}</span>
              <span class="mobile__arrow">→</span>
            </RouterLink>
          </nav>
          <div class="mobile__theme">
            <span class="mobile__theme-label">外观</span>
            <button
              class="mobile__theme-btn"
              type="button"
              :aria-label="isLight ? '切换到黑夜模式' : '切换到白天模式'"
              @click="toggleTheme"
            >
              {{ isLight ? '☀ 白天模式' : '☾ 黑夜模式' }}
            </button>
          </div>
          <div class="mobile__foot">
            <a
              class="btn btn--primary btn--block"
              :href="siteInfo.joinUrl"
              target="_blank"
              rel="noreferrer"
              @click="close"
            >
              加入我们
            </a>
            <RouterLink to="/login" class="btn btn--ghost btn--block" @click="close">
              登录 / 注册
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: var(--z-header);
  height: var(--header-h);
  border-bottom: 1px solid transparent;
  transition:
    background-color var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out),
    backdrop-filter var(--dur-2) var(--ease-out);
}

.site-header.is-scrolled {
  background: var(--header-bg);
  border-bottom-color: var(--line);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-5);
  height: 100%;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.brand__mark-wrap {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(150deg, var(--accent-weak), var(--accent-weak-2));
  border: 1px solid var(--accent-border-soft);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
}

.brand__mark {
  width: 24px;
  height: auto;
  filter: drop-shadow(0 0 8px var(--accent-glow));
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand__text strong {
  font-size: 0.98rem;
  letter-spacing: 0.04em;
}

.brand__text small {
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: 0.56rem;
  letter-spacing: 0.2em;
  color: var(--text-mute);
}

.nav {
  display: none;
  align-items: center;
  gap: 0.35rem;
}

.nav__link {
  position: relative;
  padding: 0.5rem 0.9rem;
  border-radius: var(--r-pill);
  color: var(--text-dim);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition:
    color var(--dur-1) var(--ease-out),
    background-color var(--dur-2) var(--ease-out);
}

.nav__link:hover {
  color: var(--text);
  background: var(--glass-bg);
}

.nav__link.router-link-active {
  color: var(--text);
  background: var(--accent-weak);
  box-shadow: inset 0 0 0 1px var(--accent-border-soft);
}

.nav__link.router-link-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: 18px;
  height: 2px;
  transform: translateX(-50%);
  border-radius: 2px;
  background: var(--grad-accent);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.header__login {
  display: none;
}

/* ---------- 主题切换按钮 ---------- */
.theme-toggle {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--glass-bg);
  color: var(--text-dim);
  overflow: hidden;
  transition:
    color var(--dur-1) var(--ease-out),
    border-color var(--dur-2) var(--ease-out),
    background-color var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.theme-toggle:hover {
  color: var(--accent-soft);
  border-color: var(--accent-border);
  background: var(--accent-weak);
  transform: translateY(-1px);
}

.theme-toggle__icon {
  display: grid;
  place-items: center;
  transition: transform var(--dur-3) var(--ease-out);
}

.theme-toggle:hover .theme-toggle__icon {
  transform: rotate(18deg) scale(1.06);
}

.burger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  padding: 0 10px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--glass-bg);
}

.burger span {
  display: block;
  height: 1.5px;
  width: 100%;
  border-radius: 2px;
  background: var(--text-dim);
  transition:
    transform var(--dur-2) var(--ease-out),
    opacity var(--dur-1) var(--ease-out);
}

.burger span:first-child.is-open {
  transform: translateY(3.25px) rotate(45deg);
}

.burger span:last-child.is-open {
  transform: translateY(-3.25px) rotate(-45deg);
}

/* ---------- 移动端抽屉 ---------- */
.mobile {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
}

.mobile__scrim {
  position: absolute;
  inset: 0;
  background: var(--scrim);
  backdrop-filter: blur(4px);
}

.mobile__panel {
  position: absolute;
  inset: 0 0 0 auto;
  width: min(88vw, 400px);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  padding: calc(var(--header-h) + 1rem) var(--gutter) var(--sp-6);
  background:
    radial-gradient(120% 80% at 100% 0%, var(--accent-weak), transparent 60%),
    var(--panel-bg);
  border-left: 1px solid var(--line);
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
}

.mobile__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile__close {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--glass-bg);
  color: var(--text-dim);
  font-size: 0.95rem;
}

.mobile__nav {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.mobile__link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 0.25rem;
  border-bottom: 1px solid var(--line);
  color: var(--text);
  font-size: 1.12rem;
  font-weight: 600;
}

.mobile__link.router-link-active .mobile__label {
  color: var(--accent-soft);
}

.mobile__index {
  font-size: var(--fs-micro);
  color: var(--text-mute);
}

.mobile__label {
  flex: 1;
}

.mobile__arrow {
  color: var(--text-mute);
  transition: transform var(--dur-2) var(--ease-out);
}

.mobile__link:hover .mobile__arrow {
  transform: translateX(4px);
  color: var(--accent-soft);
}

.mobile__theme {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: 0.85rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--glass-bg-weak);
}

.mobile__theme-label {
  font-size: var(--fs-xs);
  color: var(--text-mute);
  letter-spacing: 0.08em;
}

.mobile__theme-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  font-size: var(--fs-xs);
  color: var(--text);
  background: var(--glass-bg);
  transition:
    border-color var(--dur-2) var(--ease-out),
    background-color var(--dur-2) var(--ease-out);
}

.mobile__theme-btn:hover {
  border-color: var(--accent-border);
  background: var(--accent-weak);
}

.mobile__foot {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-enter-active,
.mobile-leave-active {
  transition: opacity var(--dur-2) var(--ease-out);
}

.mobile-enter-active .mobile__panel,
.mobile-leave-active .mobile__panel {
  transition: transform var(--dur-3) var(--ease-out);
}

.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
}

.mobile-enter-from .mobile__panel,
.mobile-leave-to .mobile__panel {
  transform: translateX(100%);
}

@media (min-width: 900px) {
  .nav {
    display: flex;
  }

  .burger {
    display: none;
  }

  .header__login {
    display: inline-flex;
  }

  .brand__text small {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .header__join {
    display: none;
  }
}
</style>
