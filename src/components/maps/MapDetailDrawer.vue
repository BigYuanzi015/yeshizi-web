<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { MapItem } from '@/types/content'

const props = defineProps<{
  /** 当前查看的作品，null 表示抽屉关闭 */
  item: MapItem | null
}>()

const emit = defineEmits<{ close: [] }>()

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const titleId = 'map-detail-title'
const introId = 'map-detail-intro'

const panelRef = ref<HTMLElement | null>(null)
const closeRef = ref<HTMLButtonElement | null>(null)

/** 打开前的焦点元素，关闭后归还 */
let triggerElement: HTMLElement | null = null
/** 本次是否由抽屉锁定了 body 滚动 */
let lockedByDrawer = false

const seriesTone = computed(() => {
  if (!props.item) return ''
  if (props.item.series === 'philosophy') return 'tag--accent'
  if (props.item.series === 'prohibition') return 'tag--gold'
  return ''
})

function lockBody(): void {
  if (document.body.classList.contains('is-locked')) {
    lockedByDrawer = false
    return
  }
  document.body.classList.add('is-locked')
  lockedByDrawer = true
}

function unlockBody(): void {
  if (lockedByDrawer) document.body.classList.remove('is-locked')
  lockedByDrawer = false
}

function close(): void {
  emit('close')
}

function restoreFocus(): void {
  const target = triggerElement
  triggerElement = null
  if (target && document.contains(target)) target.focus()
}

/** Tab 焦圈限定在抽屉内 */
function onPanelKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Tab') return
  const panel = panelRef.value
  if (!panel) return

  const focusables = Array.from(
    panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.getClientRects().length > 0)

  if (focusables.length === 0) {
    event.preventDefault()
    panel.focus()
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onWindowKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.item) {
    event.stopPropagation()
    close()
  }
}

watch(
  () => props.item,
  async (item) => {
    if (item) {
      const active = document.activeElement
      triggerElement = active instanceof HTMLElement && active !== document.body ? active : null
      lockBody()
      await nextTick()
      closeRef.value?.focus()
    } else {
      unlockBody()
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', onWindowKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onWindowKeydown)
  unlockBody()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer" @after-leave="restoreFocus">
      <div v-if="item" class="drawer">
        <div class="drawer__scrim" @click="close"></div>

        <div
          ref="panelRef"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="item.intro ? introId : undefined"
          tabindex="-1"
          @keydown="onPanelKeydown"
        >
          <span class="drawer__grab" aria-hidden="true"></span>

          <button
            ref="closeRef"
            type="button"
            class="drawer__close"
            aria-label="关闭作品详情"
            @click="close"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <div class="drawer__scroll">
            <div class="drawer__media">
              <img :src="item.image" :alt="item.title" decoding="async" />
            </div>

            <div class="drawer__body">
              <div class="drawer__tagrow">
                <span class="tag" :class="seriesTone">{{ item.seriesName }}</span>
                <span v-if="item.version" class="tag mono">MC {{ item.version }}</span>
                <span v-else class="tag">版本未标注</span>
              </div>

              <h2 :id="titleId" class="drawer__title">{{ item.title }}</h2>

              <p class="drawer__author">
                作者 · <strong>{{ item.author || '佚名' }}</strong>
              </p>

              <p v-if="item.intro" :id="introId" class="drawer__intro">{{ item.intro }}</p>

              <ul v-if="item.tags.length" class="drawer__tags" aria-label="作品标签">
                <li v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</li>
              </ul>
            </div>
          </div>

          <div class="drawer__foot">
            <a
              v-if="item.download"
              class="btn btn--primary btn--block"
              :href="item.download"
              download
            >
              下载地图包
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <button v-else type="button" class="btn btn--ghost btn--block" disabled>
              暂无资源
            </button>
            <p class="drawer__hint">
              {{
                item.download
                  ? '点击按钮即可开始下载，资源来自旧站备份。'
                  : '该作品暂未收录可下载资源，欢迎关注后续更新。'
              }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.drawer__scrim {
  position: absolute;
  inset: 0;
  background: var(--scrim);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.drawer__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(92vw, 540px);
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(120% 60% at 100% 0%, var(--accent-weak), transparent 62%),
    var(--panel-bg);
  border-left: 1px solid var(--line);
  box-shadow: var(--shadow-lg);
}

.drawer__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.drawer__media {
  position: relative;
  height: clamp(200px, 30vh, 300px);
  overflow: hidden;
  background: var(--surface-solid);
}

.drawer__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--panel-bg), transparent 58%);
  pointer-events: none;
}

.drawer__close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-dim);
  transition:
    color var(--dur-1) var(--ease-out),
    border-color var(--dur-1) var(--ease-out),
    background-color var(--dur-1) var(--ease-out);
}

.drawer__close svg {
  width: 17px;
  height: 17px;
}

.drawer__close:hover {
  color: var(--text);
  border-color: var(--line-bright);
  background: var(--accent-glow);
}

.drawer__body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-5) clamp(1.25rem, 3vw, 1.75rem) var(--sp-6);
}

.drawer__tagrow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.drawer__title {
  font-size: var(--fs-h2);
  line-height: 1.24;
}

.drawer__author {
  color: var(--text-dim);
  font-size: var(--fs-sm);
}

.drawer__author strong {
  color: var(--text);
  font-weight: 600;
}

.drawer__intro {
  padding: var(--sp-3) var(--sp-4);
  border-left: 2px solid var(--line-bright);
  border-radius: 0 var(--r-sm) var(--r-sm) 0;
  background: var(--glass-bg-weak);
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.85;
}

.drawer__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.drawer__foot {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: var(--sp-4) clamp(1.25rem, 3vw, 1.75rem);
  border-top: 1px solid var(--line);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.drawer__hint {
  font-size: var(--fs-micro);
  line-height: 1.6;
  color: var(--text-mute);
  text-align: center;
}

.drawer__grab {
  display: none;
}

/* ---------- 入场 / 退场 ---------- */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--dur-2) var(--ease-out);
}

.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel {
  transition: transform var(--dur-3) var(--ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer__panel,
.drawer-leave-to .drawer__panel {
  transform: translateX(100%);
}

/* ---------- 移动端：底部上滑面板 ---------- */
@media (max-width: 640px) {
  .drawer {
    align-items: flex-end;
  }

  .drawer__panel {
    width: 100%;
    height: 90svh;
    border-left: 0;
    border-top: 1px solid var(--line);
    border-radius: var(--r-xl) var(--r-xl) 0 0;
  }

  .drawer__grab {
    position: absolute;
    top: 0.55rem;
    left: 50%;
    z-index: 2;
    display: block;
    width: 44px;
    height: 4px;
    transform: translateX(-50%);
    border-radius: var(--r-pill);
    background: var(--line-strong);
  }

  .drawer__close {
    top: 0.85rem;
    right: 0.85rem;
  }

  .drawer-enter-from .drawer__panel,
  .drawer-leave-to .drawer__panel {
    transform: translateY(100%);
  }
}
</style>
