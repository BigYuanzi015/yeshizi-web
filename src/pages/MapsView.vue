<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MapCard from '@/components/maps/MapCard.vue'
import MapDetailDrawer from '@/components/maps/MapDetailDrawer.vue'
import MapFilters from '@/components/maps/MapFilters.vue'
import { useMapFilters } from '@/composables/useMapFilters'
import { siteInfo } from '@/data/site'
import type { MapItem } from '@/types/content'
import type { CSSProperties } from 'vue'

const { filters, filtered, stats, seriesOptions, authors, hasActiveFilters, resetFilters } =
  useMapFilters()

const foundedLabel = computed(() => `${siteInfo.foundedAt} - 至今`)

/** 当前打开详情的作品 */
const activeItem = ref<MapItem | null>(null)

function openDetail(item: MapItem): void {
  activeItem.value = item
}

function closeDetail(): void {
  activeItem.value = null
}

const reducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 筛选结果变化时让网格整体淡入 */
const gridFading = ref(false)
let fadeTimer = 0

watch(
  () => filtered.value.map((item) => item.id).join('|'),
  async () => {
    if (reducedMotion) return
    gridFading.value = false
    await nextTick()
    gridFading.value = true
    window.clearTimeout(fadeTimer)
    fadeTimer = window.setTimeout(() => {
      gridFading.value = false
    }, 460)
  },
)

onBeforeUnmount(() => window.clearTimeout(fadeTimer))

/** 卡片错峰入场 */
function revealStyle(index: number): CSSProperties {
  return { '--reveal-delay': `${Math.min(index, 7) * 45}ms` }
}

const archiveEmpty = computed(() => stats.value.total === 0)
</script>

<template>
  <div class="maps-page">
    <header class="page-hero maps-hero">
      <div class="container">
        <nav class="page-hero__crumb" aria-label="面包屑">
          <RouterLink to="/">首页</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">地图汇总</span>
        </nav>

        <p class="eyebrow">Map Archive</p>
        <h1 class="page-hero__title text-gradient">地图汇总</h1>
        <p class="page-hero__lead">
          从 2017 年至今，夜十字工作室出品的 Minecraft 解密、闯关与主城作品都收录在这里。
          按系列、作者或关键词找到你想玩的那一张，点开卡片还能查看详情与下载。
        </p>

        <div class="page-hero__meta">
          <span>{{ foundedLabel }}</span>
          <span class="dot" aria-hidden="true"></span>
          <span>{{ stats.total }} 张地图</span>
        </div>

        <div class="stat-strip maps-hero__stats reveal">
          <div class="stat">
            <span class="stat__value">{{ stats.total }}<small>张</small></span>
            <span class="stat__label">作品总数</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ stats.downloadable }}<small>张</small></span>
            <span class="stat__label">可下载</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ stats.authors }}<small>位</small></span>
            <span class="stat__label">地图作者</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ stats.series }}<small>个</small></span>
            <span class="stat__label">作品系列</span>
          </div>
        </div>
      </div>
    </header>

    <section class="container maps-body" aria-label="地图筛选与列表">
      <MapFilters
        v-model:q="filters.q"
        v-model:series="filters.series"
        v-model:author="filters.author"
        v-model:sort="filters.sort"
        v-model:dl="filters.dl"
        :series-options="seriesOptions"
        :authors="authors"
        :result-count="filtered.length"
        :total-count="stats.total"
        :active="hasActiveFilters"
        @reset="resetFilters"
      />

      <div id="map-results" class="maps-results">
        <div v-if="filtered.length" class="map-grid" :class="{ 'is-fading': gridFading }">
          <div
            v-for="(item, index) in filtered"
            :key="item.id"
            class="map-cell reveal"
            :style="revealStyle(index)"
          >
            <MapCard :item="item" @open="openDetail" />
          </div>
        </div>

        <div v-else class="empty reveal">
          <span class="empty__glyph" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <h2 class="empty__title">
            {{ archiveEmpty ? '地图档案整理中' : '没有找到匹配的地图' }}
          </h2>
          <p class="empty__text">
            {{
              archiveEmpty
                ? '作品数据正在整理，稍后再来看看吧。'
                : '换个关键词，或放宽系列、作者与「仅看可下载」条件再试试。'
            }}
          </p>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="btn btn--primary maps-empty__reset"
            @click="resetFilters"
          >
            重置全部筛选
          </button>
        </div>
      </div>
    </section>

    <MapDetailDrawer :item="activeItem" @close="closeDetail" />
  </div>
</template>

<style scoped>
.maps-page {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: var(--sp-9);
}

/* ---------- 页头 ---------- */
.maps-hero .eyebrow {
  margin-bottom: var(--sp-3);
}

.maps-hero__stats {
  margin-top: clamp(1.75rem, 4vw, 2.75rem);
}

/* ---------- 主体 ---------- */
.maps-body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.maps-results {
  display: flex;
  flex-direction: column;
}

/* ---------- 作品网格 ---------- */
.map-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--sp-4);
}

.map-cell {
  display: grid;
  min-width: 0;
}

.map-grid.is-fading {
  animation: maps-grid-fade var(--dur-2) var(--ease-out) both;
}

@keyframes maps-grid-fade {
  from {
    opacity: 0.35;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.maps-empty__reset {
  margin-top: var(--sp-2);
}

@media (min-width: 640px) {
  .map-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .map-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--sp-5);
  }
}

@media (min-width: 1200px) {
  .map-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* 手机上统计条改为 2x2，避免 4 行过长 */
@media (max-width: 480px) {
  .maps-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .map-grid.is-fading {
    animation: none;
  }
}
</style>
