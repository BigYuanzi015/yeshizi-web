<script setup lang="ts">
import { computed } from 'vue'
import type { MapItem } from '@/types/content'

const props = withDefaults(
  defineProps<{
    item: MapItem
    /** 首页首屏卡片可关闭懒加载 */
    eager?: boolean
  }>(),
  { eager: false },
)

const emit = defineEmits<{ open: [item: MapItem] }>()

/** 旧站已失效资源的占位封面不用图片，改用随主题自适应的品牌占位块 */
const hasCover = computed(() => !props.item.image.includes('cover-placeholder'))

const seriesTone = computed(() => {
  if (props.item.series === 'philosophy') return 'tag--accent'
  if (props.item.series === 'prohibition') return 'tag--gold'
  return ''
})

function activate(): void {
  emit('open', props.item)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    activate()
  }
}
</script>

<template>
  <article
    class="map-card"
    tabindex="0"
    role="button"
    :aria-label="`查看作品：${item.title}`"
    @click="activate"
    @keydown="onKeydown"
  >
    <div class="map-card__media">
      <img
        v-if="hasCover"
        :src="item.image"
        :alt="item.title"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
      />
      <span v-else class="map-card__fallback" aria-hidden="true">
        <img class="map-card__fallback-mark only-dark" src="/img/brand-mark.png" alt="" />
        <img class="map-card__fallback-mark only-light" src="/img/brand-mark-ink.png" alt="" />
        <span class="map-card__fallback-title">封面暂缺</span>
        <span class="map-card__fallback-sub mono">COVER MISSING</span>
      </span>
      <span class="map-card__shade" aria-hidden="true"></span>
      <span class="map-card__series tag" :class="seriesTone">{{ item.seriesName }}</span>
      <span v-if="item.version" class="map-card__version mono">{{ item.version }}</span>
      <span class="map-card__peek" aria-hidden="true">查看详情</span>
    </div>

    <div class="map-card__body">
      <h3 class="map-card__title">{{ item.title }}</h3>
      <p class="map-card__intro">{{ item.intro }}</p>
      <div class="map-card__foot">
        <span class="map-card__author">作者 · {{ item.author }}</span>
        <a
          v-if="item.download"
          class="map-card__dl"
          :href="item.download"
          download
          @click.stop
        >
          下载
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
        <span v-else class="map-card__dl map-card__dl--muted">暂无资源</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.map-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--grad-surface);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition:
    transform var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out);
}

.map-card:hover,
.map-card:focus-visible {
  transform: translateY(-5px);
  border-color: var(--card-hover-border);
  box-shadow: var(--shadow-glow);
}

.map-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-deep);
}

.map-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition:
    transform 0.7s var(--ease-out),
    filter var(--dur-3) var(--ease-out);
}

.map-card:hover .map-card__media img {
  transform: scale(1.06);
  filter: brightness(0.82) saturate(1.05);
}

/* 失效资源封面：随主题自适应的品牌占位块 */
.map-card__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: linear-gradient(160deg, var(--bg-elev), var(--bg-deep));
}

.map-card__fallback::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.8;
}

.map-card__fallback-mark {
  position: relative;
  width: 30%;
  max-width: 92px;
  opacity: 0.55;
  transition: transform 0.7s var(--ease-out);
}

.map-card:hover .map-card__fallback-mark {
  transform: scale(1.06);
}

.map-card__fallback-title {
  position: relative;
  margin-top: 0.45rem;
  font-size: var(--fs-micro);
  letter-spacing: 0.18em;
  color: var(--text-dim);
}

.map-card__fallback-sub {
  position: relative;
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  color: var(--text-mute);
}

.map-card__shade {
  position: absolute;
  inset: 0;
  background: var(--cover-shade);
  pointer-events: none;
}

.map-card__series {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  backdrop-filter: blur(6px);
  color: var(--text);
  border-color: var(--glass-border);
  background: var(--glass-bg-strong);
}

.map-card__series.tag--accent {
  color: var(--text);
  border-color: var(--accent-border);
  background: var(--glass-bg-strong);
}

.map-card__series.tag--gold {
  color: var(--text);
  border-color: var(--gold-border);
  background: var(--glass-bg-strong);
}

.map-card__version {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  padding: 0.2rem 0.55rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(6px);
  font-size: var(--fs-micro);
  color: var(--text-dim);
  letter-spacing: 0.04em;
}

.map-card__peek {
  position: absolute;
  left: 50%;
  bottom: 0.9rem;
  transform: translate(-50%, 8px);
  padding: 0.38rem 0.9rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--accent-border);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(8px);
  font-size: var(--fs-micro);
  letter-spacing: 0.1em;
  color: var(--text);
  opacity: 0;
  transition:
    opacity var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
  pointer-events: none;
}

.map-card:hover .map-card__peek,
.map-card:focus-visible .map-card__peek {
  opacity: 1;
  transform: translate(-50%, 0);
}

.map-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1rem 1.05rem 1.05rem;
}

.map-card__title {
  font-size: 1.02rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.map-card__intro {
  color: var(--text-mute);
  font-size: var(--fs-xs);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.9em;
}

.map-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.15rem;
  padding-top: 0.7rem;
  border-top: 1px solid var(--line);
}

.map-card__author {
  font-size: var(--fs-micro);
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-card__dl {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.6rem;
  border: 1px solid var(--accent-border);
  border-radius: var(--r-pill);
  color: var(--accent-soft);
  font-size: var(--fs-micro);
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color var(--dur-1) var(--ease-out),
    color var(--dur-1) var(--ease-out);
}

.map-card__dl:hover {
  background: var(--accent-weak);
  color: var(--text);
}

.map-card__dl--muted {
  color: var(--text-mute);
  border-color: var(--line);
}
</style>
