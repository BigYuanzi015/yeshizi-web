import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MapItem, MapSeries } from '@/types/content'
import { mapItems, mapSeriesList } from '@/data/maps'

/** 排序方式：默认（数据原始顺序）/ 最新版本 / 按作者 / 按标题 */
export type MapSort = 'default' | 'latest' | 'author' | 'title'

/** 系列筛选值，'all' 表示不限制系列 */
export type MapSeriesFilter = MapSeries | 'all'

/** 地图汇总页的全部筛选状态（与 URL query 一一对应） */
export interface MapFilterState {
  /** 搜索关键词，匹配标题 / 作者 / 简介 / 标签 */
  q: string
  series: MapSeriesFilter
  /** 作者名，空字符串表示全部作者 */
  author: string
  sort: MapSort
  /** 仅看可下载作品 */
  dl: boolean
}

export interface MapSeriesOption {
  id: MapSeriesFilter
  name: string
  count: number
}

export interface MapAuthorOption {
  name: string
  count: number
}

export interface MapArchiveStats {
  total: number
  downloadable: number
  authors: number
  series: number
}

const SORT_VALUES: readonly MapSort[] = ['default', 'latest', 'author', 'title']

const DEFAULT_STATE: MapFilterState = {
  q: '',
  series: 'all',
  author: '',
  sort: 'default',
  dl: false,
}

/** route.query 的取值可能是 string / null / array，统一取第一个字符串 */
function firstString(value: unknown): string {
  if (Array.isArray(value)) {
    const found = value.find((entry): entry is string => typeof entry === 'string')
    return found ?? ''
  }
  return typeof value === 'string' ? value : ''
}

/** '1.12.2' -> [1, 12, 2]；'1.8+' -> [1, 8]；'' -> [] */
function versionNumbers(version: string): number[] {
  const matched = version.match(/\d+/g)
  return matched ? matched.map((part) => Number(part)) : []
}

/** 版本号降序比较，空版本排在最后 */
function compareVersionDesc(a: MapItem, b: MapItem): number {
  const left = versionNumbers(a.version)
  const right = versionNumbers(b.version)
  if (left.length === 0 && right.length === 0) return 0
  if (left.length === 0) return 1
  if (right.length === 0) return -1

  const length = Math.max(left.length, right.length)
  for (let index = 0; index < length; index += 1) {
    const diff = (right[index] ?? 0) - (left[index] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}

function compareItems(sort: MapSort): (a: MapItem, b: MapItem) => number {
  if (sort === 'latest') {
    return (a, b) => compareVersionDesc(a, b) || a.title.localeCompare(b.title, 'zh-CN')
  }
  if (sort === 'author') {
    return (a, b) =>
      a.author.localeCompare(b.author, 'zh-CN') || a.title.localeCompare(b.title, 'zh-CN')
  }
  if (sort === 'title') {
    return (a, b) => a.title.localeCompare(b.title, 'zh-CN')
  }
  return () => 0
}

function matchesKeyword(item: MapItem, keyword: string): boolean {
  if (!keyword) return true
  const haystack = [item.title, item.author, item.intro, item.seriesName, ...item.tags]
    .join('\n')
    .toLowerCase()
  return haystack.includes(keyword)
}

function sameState(left: MapFilterState, right: MapFilterState): boolean {
  return (
    left.q.trim() === right.q.trim() &&
    left.series === right.series &&
    left.author === right.author &&
    left.sort === right.sort &&
    left.dl === right.dl
  )
}

/** 把筛选状态压缩成 URL query，默认值不写入地址栏 */
function buildQuery(state: MapFilterState): Record<string, string> {
  const query: Record<string, string> = {}
  const keyword = state.q.trim()
  if (keyword) query.q = keyword
  if (state.series !== 'all') query.series = state.series
  if (state.author) query.author = state.author
  if (state.sort !== 'default') query.sort = state.sort
  if (state.dl) query.dl = '1'
  return query
}

/** 用于比较两个 query 是否等价（忽略顺序与空值） */
function querySignature(query: Record<string, unknown>): string {
  return Object.entries(query)
    .map(([key, value]) => [key, firstString(value)] as const)
    .filter(([, value]) => value !== '')
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

/**
 * 地图汇总页的搜索 / 系列 / 作者 / 排序 / 可下载筛选。
 * 状态与 URL query 双向同步（router.replace），进入页面时自动从 query 恢复。
 */
export function useMapFilters() {
  const route = useRoute()
  const router = useRouter()

  const stats = computed<MapArchiveStats>(() => ({
    total: mapItems.length,
    downloadable: mapItems.filter((item) => Boolean(item.download)).length,
    authors: new Set(mapItems.map((item) => item.author.trim()).filter(Boolean)).size,
    series: new Set(mapItems.map((item) => item.series)).size,
  }))

  const seriesOptions = computed<MapSeriesOption[]>(() => {
    const counts = new Map<MapSeries, number>()
    const names = new Map<MapSeries, string>()
    for (const item of mapItems) {
      counts.set(item.series, (counts.get(item.series) ?? 0) + 1)
      if (!names.has(item.series)) names.set(item.series, item.seriesName)
    }

    const options: MapSeriesOption[] = mapSeriesList.map((series) => ({
      id: series.id,
      name: series.name,
      count: counts.get(series.id) ?? 0,
    }))

    // 数据里出现但 mapSeriesList 未收录的系列也补进筛选项，避免作品「消失」
    const known = new Set(options.map((option) => option.id))
    for (const [id, count] of counts) {
      if (!known.has(id)) options.push({ id, name: names.get(id) ?? id, count })
    }
    return options
  })

  const authors = computed<MapAuthorOption[]>(() => {
    const counts = new Map<string, number>()
    for (const item of mapItems) {
      const name = item.author.trim()
      if (!name) continue
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
  })

  const authorNames = computed(() => new Set(authors.value.map((author) => author.name)))
  const seriesIds = computed(() => new Set(seriesOptions.value.map((option) => option.id)))

  function readState(query: Record<string, unknown>): MapFilterState {
    const series = firstString(query.series)
    const author = firstString(query.author)
    const sort = firstString(query.sort)
    return {
      q: firstString(query.q),
      series: seriesIds.value.has(series as MapSeriesFilter)
        ? (series as MapSeriesFilter)
        : 'all',
      author: authorNames.value.has(author) ? author : '',
      sort: SORT_VALUES.includes(sort as MapSort) ? (sort as MapSort) : 'default',
      dl: firstString(query.dl) === '1',
    }
  }

  const filters = reactive<MapFilterState>(readState(route.query))

  const filtered = computed<MapItem[]>(() => {
    const keyword = filters.q.trim().toLowerCase()
    const items = mapItems.filter((item) => {
      if (filters.series !== 'all' && item.series !== filters.series) return false
      if (filters.author && item.author.trim() !== filters.author) return false
      if (filters.dl && !item.download) return false
      return matchesKeyword(item, keyword)
    })
    return items.slice().sort(compareItems(filters.sort))
  })

  const hasActiveFilters = computed(() => {
    return (
      filters.q.trim() !== '' ||
      filters.series !== 'all' ||
      filters.author !== '' ||
      filters.sort !== 'default' ||
      filters.dl
    )
  })

  // ---------- 状态 -> URL（输入时轻微防抖，避免每个字符都 push replace） ----------
  let syncTimer = 0

  function scheduleUrlSync(): void {
    window.clearTimeout(syncTimer)
    syncTimer = window.setTimeout(() => {
      const nextQuery = buildQuery(filters)
      if (querySignature(nextQuery) === querySignature(route.query)) return
      void router.replace({ query: nextQuery })
    }, 160)
  }

  watch(filters, scheduleUrlSync, { deep: true })

  // ---------- URL -> 状态（前进 / 后退 / 手动改地址栏） ----------
  watch(
    () => route.query,
    (query) => {
      const next = readState(query)
      if (sameState(filters, next)) return
      // 用户正在输入末尾空格时不要把光标位置改掉
      if (next.q.trim() === filters.q.trim()) next.q = filters.q
      Object.assign(filters, next)
    },
  )

  onBeforeUnmount(() => window.clearTimeout(syncTimer))

  function resetFilters(): void {
    Object.assign(filters, DEFAULT_STATE)
  }

  return {
    filters,
    filtered,
    stats,
    seriesOptions,
    authors,
    hasActiveFilters,
    resetFilters,
  }
}
