<script setup lang="ts">
import { ref } from 'vue'
import type {
  MapAuthorOption,
  MapSeriesFilter,
  MapSeriesOption,
  MapSort,
} from '@/composables/useMapFilters'

withDefaults(
  defineProps<{
    q: string
    series: MapSeriesFilter
    author: string
    sort: MapSort
    dl: boolean
    seriesOptions: MapSeriesOption[]
    authors: MapAuthorOption[]
    resultCount: number
    totalCount: number
    active: boolean
    /** 搜索结果区域的 id，用于搜索框 aria-controls */
    resultsId?: string
  }>(),
  { resultsId: 'map-results' },
)

const emit = defineEmits<{
  'update:q': [value: string]
  'update:series': [value: MapSeriesFilter]
  'update:author': [value: string]
  'update:sort': [value: MapSort]
  'update:dl': [value: boolean]
  reset: []
}>()

const searchRef = ref<HTMLInputElement | null>(null)

function onSearchInput(event: Event): void {
  emit('update:q', (event.target as HTMLInputElement).value)
}

function clearSearch(): void {
  emit('update:q', '')
  searchRef.value?.focus()
}

function selectSeries(value: MapSeriesFilter): void {
  emit('update:series', value)
}

function onAuthorChange(event: Event): void {
  emit('update:author', (event.target as HTMLSelectElement).value)
}

function onSortChange(event: Event): void {
  emit('update:sort', (event.target as HTMLSelectElement).value as MapSort)
}

function onDownloadableChange(event: Event): void {
  emit('update:dl', (event.target as HTMLInputElement).checked)
}

function resetAll(): void {
  emit('reset')
}
</script>

<template>
  <section class="filters card card--pad reveal" aria-label="筛选与搜索">
    <div class="filters__top">
      <div class="filters__search">
        <label class="sr-only" for="map-search">搜索地图作品</label>
        <svg class="filters__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" />
          <path
            d="m16 16 4 4"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
          />
        </svg>
        <input
          id="map-search"
          ref="searchRef"
          class="input filters__input"
          type="search"
          :value="q"
          placeholder="搜索标题、作者、简介或标签…"
          autocomplete="off"
          :aria-controls="resultsId"
          @input="onSearchInput"
        />
        <button
          v-if="q"
          type="button"
          class="filters__clear"
          aria-label="清空搜索关键词"
          @click="clearSearch"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m7 7 10 10M17 7 7 17"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <p class="filters__count mono" role="status">
        <span class="filters__count-value">{{ resultCount }}</span>
        <span class="filters__count-sep" aria-hidden="true">/</span>
        <span>{{ totalCount }} 张</span>
      </p>
    </div>

    <div class="filters__group">
      <span id="map-series-label" class="filters__legend">系列</span>
      <div class="filters__chips" role="group" aria-labelledby="map-series-label">
        <button
          type="button"
          class="chip"
          :class="{ 'is-active': series === 'all' }"
          :aria-pressed="series === 'all'"
          @click="selectSeries('all')"
        >
          全部
          <span class="chip__count">{{ totalCount }}</span>
        </button>
        <button
          v-for="option in seriesOptions"
          :key="option.id"
          type="button"
          class="chip"
          :class="{ 'is-active': series === option.id }"
          :aria-pressed="series === option.id"
          @click="selectSeries(option.id)"
        >
          {{ option.name }}
          <span class="chip__count">{{ option.count }}</span>
        </button>
      </div>
    </div>

    <div class="filters__controls">
      <div class="filters__field">
        <label class="field__label" for="map-author">作者</label>
        <select id="map-author" class="select" :value="author" @change="onAuthorChange">
          <option value="">全部作者</option>
          <option v-for="option in authors" :key="option.name" :value="option.name">
            {{ option.name }}（{{ option.count }}）
          </option>
        </select>
      </div>

      <div class="filters__field">
        <label class="field__label" for="map-sort">排序</label>
        <select id="map-sort" class="select" :value="sort" @change="onSortChange">
          <option value="default">默认顺序</option>
          <option value="latest">最新版本</option>
          <option value="author">按作者</option>
          <option value="title">按标题</option>
        </select>
      </div>

      <label class="filters__switch">
        <input
          class="filters__switch-input"
          type="checkbox"
          :checked="dl"
          @change="onDownloadableChange"
        />
        <span class="filters__switch-track" aria-hidden="true">
          <span class="filters__switch-thumb"></span>
        </span>
        <span class="filters__switch-text">仅看可下载</span>
      </label>

      <button
        type="button"
        class="btn btn--ghost btn--sm filters__reset"
        :disabled="!active"
        @click="resetAll"
      >
        重置筛选
      </button>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  border-radius: var(--r-xl);
}

/* ---------- 搜索行 ---------- */
.filters__top {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.filters__search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 260px;
  min-width: 0;
}

.filters__icon {
  position: absolute;
  left: 1rem;
  width: 17px;
  height: 17px;
  color: var(--text-mute);
  pointer-events: none;
}

.filters__input {
  min-height: 46px;
  padding-left: 2.75rem;
  padding-right: 2.9rem;
}

.filters__input::-webkit-search-cancel-button,
.filters__input::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.filters__clear {
  position: absolute;
  right: 0.7rem;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--glass-bg);
  color: var(--text-dim);
  transition:
    color var(--dur-1) var(--ease-out),
    border-color var(--dur-1) var(--ease-out),
    background-color var(--dur-1) var(--ease-out);
}

.filters__clear svg {
  width: 13px;
  height: 13px;
}

.filters__clear:hover {
  color: var(--text);
  border-color: var(--line-strong);
  background: var(--accent-glow);
}

.filters__count {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  font-size: var(--fs-xs);
  color: var(--text-mute);
  white-space: nowrap;
}

.filters__count-value {
  font-size: var(--fs-h4);
  font-weight: 700;
  color: var(--accent-soft);
}

.filters__count-sep {
  color: var(--line-strong);
}

/* ---------- 系列 chips ---------- */
.filters__group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--line);
}

.filters__legend {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

/* ---------- 作者 / 排序 / 开关 ---------- */
.filters__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--sp-3) var(--sp-4);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--line);
}

.filters__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1 1 170px;
  max-width: 240px;
  min-width: 0;
}

.filters__switch {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  padding-right: var(--sp-2);
  cursor: pointer;
  user-select: none;
}

.filters__switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  opacity: 0;
  overflow: hidden;
}

.filters__switch-track {
  position: relative;
  flex: none;
  width: 42px;
  height: 23px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  background: var(--bar-track);
  transition:
    background-color var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.filters__switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--text-mute);
  transition:
    transform var(--dur-2) var(--ease-out),
    background-color var(--dur-2) var(--ease-out);
}

.filters__switch-input:checked + .filters__switch-track {
  border-color: var(--accent-border);
  background: var(--grad-accent-soft);
}

.filters__switch-input:checked + .filters__switch-track .filters__switch-thumb {
  transform: translateX(19px);
  background: var(--accent-soft);
}

.filters__switch-input:focus-visible + .filters__switch-track {
  outline: 2px solid var(--accent-2);
  outline-offset: 3px;
}

.filters__switch-text {
  font-size: var(--fs-xs);
  color: var(--text-dim);
}

.filters__reset {
  margin-left: auto;
}

@media (max-width: 640px) {
  .filters__field {
    max-width: none;
  }

  .filters__reset {
    width: 100%;
    margin-left: 0;
  }

  .filters__count {
    margin-left: auto;
  }
}
</style>
