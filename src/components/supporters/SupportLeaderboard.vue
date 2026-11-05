<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Supporter } from '@/types/content'

const props = defineProps<{
  /** 投喂记录，来自 src/data/supporters.ts */
  supporters: Supporter[]
}>()

/** 按金额降序；金额相同按昵称排序，保证顺序稳定 */
const ranked = computed(() =>
  [...props.supporters].sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, 'zh-CN')),
)

const maxAmount = computed(() => ranked.value[0]?.amount ?? 0)

const rootRef = ref<HTMLElement | null>(null)
const entered = ref(false)
let observer: IntersectionObserver | null = null

function barWidth(amount: number): string {
  if (maxAmount.value <= 0) return '0%'
  return `${Math.max(0, Math.min(100, (amount / maxAmount.value) * 100)).toFixed(2)}%`
}

function rowClass(index: number): Record<string, boolean> {
  return {
    'board__row--top': index < 3,
    'board__row--gold': index === 0,
    'board__row--silver': index === 1,
    'board__row--bronze': index === 2,
  }
}

function pad(index: number): string {
  return String(index + 1).padStart(2, '0')
}

function formatAmount(amount: number): string {
  return `￥${amount.toFixed(2)}`
}

onMounted(() => {
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced || typeof IntersectionObserver === 'undefined' || !rootRef.value) {
    entered.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entered.value = true
        observer?.disconnect()
        observer = null
        break
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )
  observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section
    ref="rootRef"
    class="board card"
    :class="{ 'is-entered': entered }"
    aria-label="投喂排行榜列表"
  >
    <div v-if="!ranked.length" class="empty">
      <span class="empty__glyph" aria-hidden="true">✦</span>
      <p class="empty__title">还没有投喂记录</p>
      <p class="empty__text">第一位投喂的小伙伴，会被永远记在这里。</p>
    </div>

    <ol v-else class="board__list">
      <li
        v-for="(item, index) in ranked"
        :key="item.name"
        class="board__row"
        :class="rowClass(index)"
        :style="{ '--row-delay': `${Math.min(index, 9) * 70}ms` }"
      >
        <span class="board__rank-tile" :class="rowClass(index)">
          <span class="board__rank mono" aria-hidden="true">{{ pad(index) }}</span>
          <span class="sr-only">第 {{ index + 1 }} 名</span>
        </span>

        <div class="board__main">
          <div class="board__head">
            <span class="board__name">{{ item.name }}</span>
            <span class="board__amount mono">{{ formatAmount(item.amount) }}</span>
          </div>
          <div class="board__bar" aria-hidden="true">
            <span class="board__fill" :style="{ '--bar-width': barWidth(item.amount) }"></span>
          </div>
        </div>
      </li>
    </ol>

    <p v-if="ranked.length" class="board__foot">
      共 {{ ranked.length }} 位投喂伙伴 · 金额记录来自 2021 版旧站备份
    </p>
  </section>
</template>

<style scoped>
.board {
  padding: clamp(0.85rem, 2vw, 1.25rem);
  overflow: hidden;
}

.board__list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

/* ---------- 行 ---------- */
.board__row {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: var(--sp-3);
  padding: 0.7rem 0.65rem;
  border: 1px solid transparent;
  border-radius: var(--r-md);
  transition:
    background-color var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.board__row:hover {
  background: var(--glass-bg);
  border-color: var(--line);
}

.board__row--gold {
  background: var(--gold-weak);
  border-color: var(--gold-border);
}

.board__row--silver {
  background: color-mix(in srgb, var(--silver) 9%, transparent);
  border-color: color-mix(in srgb, var(--silver) 26%, transparent);
}

.board__row--bronze {
  background: color-mix(in srgb, var(--bronze) 9%, transparent);
  border-color: color-mix(in srgb, var(--bronze) 26%, transparent);
}

/* ---------- 名次徽章 ---------- */
.board__rank-tile {
  display: grid;
  place-items: center;
  justify-self: start;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: var(--tag-bg);
  color: var(--text-dim);
}

.board__rank {
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.board__rank-tile.board__row--gold {
  border-color: var(--gold-border);
  background: var(--gold-weak);
}

.board__rank-tile.board__row--silver {
  border-color: color-mix(in srgb, var(--silver) 32%, transparent);
  background: color-mix(in srgb, var(--silver) 12%, transparent);
}

.board__rank-tile.board__row--bronze {
  border-color: color-mix(in srgb, var(--bronze) 32%, transparent);
  background: color-mix(in srgb, var(--bronze) 12%, transparent);
}

.board__rank-tile.board__row--gold .board__rank {
  color: color-mix(in srgb, var(--gold) 78%, var(--text));
}

.board__rank-tile.board__row--silver .board__rank {
  color: color-mix(in srgb, var(--silver) 80%, var(--text));
}

.board__rank-tile.board__row--bronze .board__rank {
  color: color-mix(in srgb, var(--bronze) 82%, var(--text));
}

/* ---------- 名称 / 金额 ---------- */
.board__main {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
}

.board__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
}

.board__name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.board__row--top .board__name {
  font-size: var(--fs-body);
}

.board__amount {
  flex: none;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  font-variant-numeric: tabular-nums;
}

.board__row--gold .board__amount {
  color: color-mix(in srgb, var(--gold) 78%, var(--text));
}

.board__row--silver .board__amount {
  color: var(--silver);
}

.board__row--bronze .board__amount {
  color: var(--bronze);
}

/* ---------- 进度条 ---------- */
.board__bar {
  position: relative;
  height: 6px;
  border-radius: var(--r-pill);
  background: var(--bar-track);
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
}

.board__fill {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: var(--grad-accent);
  transition: width 1.05s var(--ease-out);
  transition-delay: var(--row-delay, 0ms);
}

.board.is-entered .board__fill {
  width: var(--bar-width, 0%);
}

.board__row--gold .board__fill {
  background: var(--grad-gold);
}

.board__row--silver .board__fill {
  background: linear-gradient(
    120deg,
    var(--silver) 0%,
    color-mix(in srgb, var(--silver) 55%, var(--text)) 100%
  );
}

.board__row--bronze .board__fill {
  background: linear-gradient(
    120deg,
    var(--bronze) 0%,
    color-mix(in srgb, var(--bronze) 55%, var(--text)) 100%
  );
}

/* ---------- 页脚说明 ---------- */
.board__foot {
  margin-top: var(--sp-3);
  padding-top: var(--sp-3);
  border-top: 1px solid var(--line);
  color: var(--text-dim);
  font-size: var(--fs-micro);
  letter-spacing: 0.04em;
  text-align: center;
}

/* ---------- 响应式 ---------- */
@media (max-width: 520px) {
  .board__row {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 0.65rem;
    padding: 0.65rem 0.5rem;
  }

  .board__rank-tile {
    width: 28px;
    height: 28px;
  }

  .board__rank {
    font-size: 0.65rem;
  }

  .board__name {
    font-size: var(--fs-xs);
  }

  .board__amount {
    font-size: var(--fs-xs);
  }
}

@media (prefers-reduced-motion: reduce) {
  .board__fill {
    width: var(--bar-width, 0%);
    transition: none;
  }
}
</style>
