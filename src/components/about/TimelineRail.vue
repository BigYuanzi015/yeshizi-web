<script setup lang="ts">
import type { TimelineStage } from '@/types/content'

defineProps<{
  /** 年表阶段，来自 src/data/timeline.ts */
  stages: TimelineStage[]
}>()

function pad(index: number): string {
  return String(index + 1).padStart(2, '0')
}

function eventDelay(index: number): string {
  return `${Math.min(index, 8) * 60}ms`
}

/** 旧站里部分事件没有标注日期（数据中记为「—」），此时不渲染日期占位 */
function hasDate(date: string): boolean {
  return Boolean(date) && date !== '—' && date !== '-'
}
</script>

<template>
  <div class="timeline-stages">
    <section
      v-for="(stage, stageIndex) in stages"
      :key="stage.id"
      class="stage"
      :class="`stage--${stage.id}`"
      :aria-labelledby="`timeline-stage-${stage.id}`"
    >
      <header class="stage-head reveal">
        <span class="stage-head__num mono" aria-hidden="true">{{ pad(stageIndex) }}</span>
        <div class="stage-head__body">
          <div class="stage-head__line">
            <h3 :id="`timeline-stage-${stage.id}`" class="stage-head__title">{{ stage.stage }}</h3>
            <span class="stage-head__period mono">{{ stage.period }}</span>
            <span class="stage-head__count mono">{{ stage.events.length }} 个节点</span>
          </div>
          <p class="stage-head__summary">{{ stage.summary }}</p>
        </div>
      </header>

      <ol v-if="stage.events.length" class="rail">
        <li
          v-for="(event, eventIndex) in stage.events"
          :key="event.id"
          class="rail__item reveal"
          :class="{
            'rail__item--right': eventIndex % 2 === 1,
            'rail__item--highlight': event.highlight,
          }"
          :style="{ '--reveal-delay': eventDelay(eventIndex) }"
        >
          <span class="rail__node" aria-hidden="true"></span>
          <article class="rail__card card card--pad card--hover">
            <div v-if="hasDate(event.date) || event.highlight" class="rail__meta">
              <span v-if="hasDate(event.date)" class="rail__date mono">{{ event.date }}</span>
              <span v-if="event.highlight" class="tag tag--gold">里程碑</span>
            </div>
            <h4 class="rail__title">{{ event.title }}</h4>
            <p class="rail__desc">{{ event.desc }}</p>
          </article>
        </li>
      </ol>

      <p v-else class="rail-empty">这一阶段的记录还在整理中。</p>
    </section>
  </div>
</template>

<style scoped>
/* ================= 阶段 ================= */
.timeline-stages {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.stage {
  --stage-tint: var(--accent);
}

.stage--grow {
  --stage-tint: var(--accent-2);
}

.stage--future {
  --stage-tint: var(--gold);
}

.stage-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--sp-4);
  margin-bottom: clamp(1.5rem, 3vw, 2.25rem);
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--line);
}

.stage-head__num {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  color: var(--stage-tint);
  background: var(--stat-bg);
}

.stage-head__body {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.stage-head__line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem var(--sp-4);
}

.stage-head__title {
  font-size: var(--fs-h3);
  letter-spacing: 0.02em;
}

.stage-head__period {
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  color: var(--stage-tint);
}

.stage-head__count {
  margin-left: auto;
  font-size: var(--fs-micro);
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.stage-head__summary {
  max-width: 58ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.8;
}

/* ================= 时间轴（移动端单列） ================= */
.rail {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.rail::before {
  content: '';
  position: absolute;
  top: 0.4rem;
  bottom: 0.4rem;
  left: 13px;
  width: 1px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--stage-tint) 40%, transparent),
    var(--line-strong) 12%,
    var(--line-strong) 88%,
    transparent
  );
}

.rail__item {
  position: relative;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  column-gap: var(--sp-4);
  align-items: start;
}

.rail__node {
  position: relative;
  z-index: 1;
  grid-column: 1;
  justify-self: center;
  align-self: start;
  width: 11px;
  height: 11px;
  margin-top: 1.35rem;
  border: 1px solid var(--line-bright);
  border-radius: 50%;
  background: var(--bg);
  box-shadow: 0 0 0 3px var(--bg);
}

.rail__item--highlight .rail__node {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border-color: var(--stage-tint);
  background: var(--stage-tint);
  transform: rotate(45deg);
  box-shadow: 0 0 0 4px var(--bg);
}

.rail__card {
  grid-column: 2;
  min-width: 0;
}

.rail__item--highlight .rail__card {
  border-color: var(--gold-border);
}

.rail__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.75rem;
  margin-bottom: 0.5rem;
}

.rail__date {
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  color: var(--accent-soft);
}

/* 金色文字在浅色主题的浅金底上对比度偏低，用主题文字色轻微压深（仍是 --gold 派生色） */
.rail__item--highlight .rail__date,
.rail__item--highlight .tag--gold {
  color: color-mix(in srgb, var(--gold) 78%, var(--text));
}

.rail__title {
  font-size: var(--fs-h4);
  line-height: 1.4;
  margin-bottom: 0.35rem;
}

.rail__desc {
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.85;
  overflow-wrap: anywhere;
}

.rail-empty {
  padding: var(--sp-5);
  border: 1px dashed var(--line-strong);
  border-radius: var(--r-md);
  color: var(--text-dim);
  font-size: var(--fs-sm);
}

/* ================= 桌面端居中竖轴 + 左右交错 ================= */
@media (min-width: 900px) {
  .rail {
    gap: var(--sp-5);
  }

  .rail::before {
    left: 50%;
    transform: translateX(-50%);
  }

  .rail__item {
    grid-template-columns: minmax(0, 1fr) 48px minmax(0, 1fr);
    column-gap: 0;
  }

  .rail__node {
    grid-column: 2;
    margin-top: 1.6rem;
  }

  .rail__card {
    grid-column: 1;
    margin-right: var(--sp-4);
  }

  .rail__item--right .rail__card {
    grid-column: 3;
    margin-right: 0;
    margin-left: var(--sp-4);
  }
}

@media (max-width: 480px) {
  .stage-head {
    grid-template-columns: 1fr;
    gap: var(--sp-3);
  }

  .stage-head__num {
    width: 38px;
    height: 38px;
  }

  .stage-head__count {
    margin-left: 0;
  }
}
</style>
