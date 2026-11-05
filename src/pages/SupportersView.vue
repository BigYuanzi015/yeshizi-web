<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SupportLeaderboard from '@/components/supporters/SupportLeaderboard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { supporters, supportersTotal } from '@/data/supporters'
import { siteInfo } from '@/data/site'
import { timelineStages } from '@/data/timeline'
import { useCountUp } from '@/composables/useCountUp'
import type { TimelineEvent } from '@/types/content'

/* ---------------- 大数字滚动 ---------------- */
const { values } = useCountUp(() => [supportersTotal, supporters.length], { duration: 1200 })

const totalText = computed(() => (values.value[0] ?? 0).toFixed(2))
const countText = computed(() => String(Math.round(values.value[1] ?? 0)))

const topSupporter = computed(() => {
  const sorted = [...supporters].sort((a, b) => b.amount - a.amount)
  return sorted[0]
})

/* ---------------- 说明区：只引用 timeline 里已存在的事实 ---------------- */
const SUPPORT_KEYWORDS = ['佣金', '商务', '资金', '合作']

const supportEvents = computed<TimelineEvent[]>(() => {
  const events = timelineStages.flatMap((stage) => stage.events)
  const picked: TimelineEvent[] = []
  const push = (event: TimelineEvent): void => {
    if (!picked.includes(event)) picked.push(event)
  }

  // 资金 / 佣金 / 商务合作相关的记录优先
  for (const event of events) {
    const text = `${event.title}${event.desc}`
    if (SUPPORT_KEYWORDS.some((keyword) => text.includes(keyword))) push(event)
  }

  // 再补充一条最能体现「地图制作投入」的里程碑（如两大代表作系列）
  const production = events
    .filter((event) => event.highlight && event.desc.includes('制作') && !picked.includes(event))
    .sort(
      (a, b) =>
        Number(b.title.includes('系列') || b.title.includes('作品')) -
        Number(a.title.includes('系列') || a.title.includes('作品')),
    )
  production.slice(0, 1).forEach(push)

  return picked.slice(0, 3)
})

/** 旧站里部分事件没有标注日期（数据中记为「—」），此时不渲染日期 */
function hasDate(date: string): boolean {
  return Boolean(date) && date !== '—' && date !== '-'
}

const timelineFuture = timelineStages.find((stage) => stage.id === 'future')?.summary
</script>

<template>
  <div class="supporters">
    <!-- ============ HERO ============ -->
    <header class="page-hero">
      <div class="container">
        <nav class="page-hero__crumb" aria-label="面包屑">
          <RouterLink to="/">首页</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">投喂榜</span>
        </nav>

        <p class="eyebrow reveal">Supporters</p>
        <h1 class="page-hero__title reveal" style="--reveal-delay: 70ms">
          投喂<span class="text-gradient">榜</span>
        </h1>
        <p class="page-hero__lead reveal" style="--reveal-delay: 140ms">
          感谢大家为工作室投喂。每一份支持，都变成了地图里多出的一块方块。
        </p>

        <div class="support-hero__summary card reveal">
          <div class="support-hero__stat">
            <p class="support-hero__label">累计投喂</p>
            <p class="support-hero__value mono">
              <span class="support-hero__unit">￥</span>{{ totalText }}
            </p>
            <p class="support-hero__hint">来自 2021 版旧站备份记录</p>
          </div>
          <span class="support-hero__sep" aria-hidden="true"></span>
          <div class="support-hero__stat">
            <p class="support-hero__label">投喂人数</p>
            <p class="support-hero__value mono">
              {{ countText }}<span class="support-hero__unit support-hero__unit--suffix">位</span>
            </p>
            <p class="support-hero__hint">每一位都被认真记住</p>
          </div>
          <span class="support-hero__sep" aria-hidden="true"></span>
          <div class="support-hero__stat">
            <p class="support-hero__label">单笔最高</p>
            <p class="support-hero__value mono">
              <span class="support-hero__unit">￥</span>{{ topSupporter?.amount.toFixed(2) ?? '0.00' }}
            </p>
            <p class="support-hero__hint">
              来自 {{ topSupporter?.name ?? '—' }} 的投喂
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- ============ 排行榜 ============ -->
    <section class="section" aria-labelledby="leaderboard-title">
      <div class="container">
        <SectionHeading
          eyebrow="01 — Leaderboard"
          title="投喂排行榜"
          lead="按累计投喂金额从高到低排列，进度条长度与金额成正比。"
        >
          <template #actions>
            <span class="tag tag--gold mono">{{ supporters.length }} 位伙伴</span>
          </template>
        </SectionHeading>

        <SupportLeaderboard :supporters="supporters" />
      </div>
    </section>

    <!-- ============ 关于投喂 ============ -->
    <section class="section" aria-labelledby="about-support-title">
      <div class="container">
        <div class="support-note">
          <div class="support-note__main">
            <p class="eyebrow">02 — Why Support</p>
            <h2 id="about-support-title" class="support-note__title">关于投喂</h2>
            <p class="support-note__lead">
              从 2017 年走到现在，工作室的每一步都不容易。地图里的每一块方块、每一条指令，
              都来自大家一点一点的打磨，也离不开投喂与各种支持的帮助。
            </p>
            <p class="support-note__text">
              下面这些记录，都来自旧站「关于我们」的年表原文，没有做任何扩写。
              如果你也想为工作室出一份力，欢迎来 QQ 群找我们。
            </p>
            <p v-if="timelineFuture" class="support-note__quote">「{{ timelineFuture }}」</p>
            <div class="support-note__actions">
              <a
                class="btn btn--primary"
                :href="siteInfo.joinUrl"
                target="_blank"
                rel="noreferrer"
              >
                加入 QQ 群
              </a>
              <RouterLink to="/about" class="btn btn--ghost">查看完整发展年表</RouterLink>
            </div>
          </div>

          <div class="support-note__facts">
            <h3 class="support-note__facts-title">年表里的支持记录</h3>
            <ul v-if="supportEvents.length" class="fact-list">
              <li
                v-for="(event, index) in supportEvents"
                :key="event.id"
                class="fact-list__item card card--pad reveal"
                :style="{ '--reveal-delay': `${index * 80}ms` }"
              >
                <p v-if="hasDate(event.date)" class="fact-list__date mono">{{ event.date }}</p>
                <h4 class="fact-list__title">{{ event.title }}</h4>
                <p class="fact-list__desc">{{ event.desc }}</p>
              </li>
            </ul>
            <p v-else class="fact-list__empty">
              完整的支持记录请见
              <RouterLink to="/about" class="link-arrow">关于我们 · 发展年表</RouterLink>。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 结尾 CTA ============ -->
    <section class="section section--tight" aria-labelledby="support-cta-title">
      <div class="container">
        <div class="support-cta card reveal">
          <div class="support-cta__glow" aria-hidden="true"></div>
          <div class="support-cta__content">
            <p class="eyebrow">Feed the Studio</p>
            <h2 id="support-cta-title" class="support-cta__title">
              欢迎投喂<span class="text-gradient">，也欢迎加入</span>
            </h2>
            <p class="support-cta__lead">
              想请工作室喝杯奶茶？想一起做下一张地图？来 QQ 群找我们就好。
            </p>
          </div>
          <div class="support-cta__actions">
            <a
              class="btn btn--primary btn--lg"
              :href="siteInfo.joinUrl"
              target="_blank"
              rel="noreferrer"
            >
              加入我们
            </a>
            <RouterLink to="/maps" class="btn btn--ghost btn--lg">去看看地图</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.supporters {
  position: relative;
}

/* ---------------- 首屏大数字 ---------------- */
.support-hero__summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-5);
  align-items: initial;
  margin-top: var(--sp-6);
  padding: clamp(1.1rem, 2.4vw, 1.6rem);
}

.support-hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.support-hero__label {
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.support-hero__value {
  font-size: clamp(1.8rem, 4.6vw, 2.9rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  background: var(--grad-title);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.support-hero__unit {
  font-size: 0.52em;
  font-weight: 600;
  margin-right: 0.12em;
  color: var(--accent-soft);
  -webkit-text-fill-color: var(--accent-soft);
}

.support-hero__unit--suffix {
  margin-right: 0;
  margin-left: 0.25em;
}

.support-hero__hint {
  color: var(--text-dim);
  font-size: var(--fs-micro);
  letter-spacing: 0.04em;
}

.support-hero__sep {
  display: none;
  width: 1px;
  background: var(--line);
}

/* ---------------- 关于投喂 ---------------- */
.support-note {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
  align-items: start;
}

.support-note__main {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.support-note__title {
  font-size: var(--fs-h2);
  letter-spacing: -0.01em;
}

.support-note__lead {
  max-width: 58ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.9;
}

.support-note__text {
  max-width: 58ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.9;
}

.support-note__quote {
  margin-top: var(--sp-2);
  padding-left: var(--sp-4);
  border-left: 2px solid var(--line-bright);
  color: var(--text);
  font-size: var(--fs-sm);
  letter-spacing: 0.04em;
}

.support-note__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-2);
}

.support-note__facts {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.support-note__facts-title {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.fact-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.fact-list__item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-left: 2px solid var(--gold-border);
  border-radius: var(--r-md);
}

.fact-list__date {
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--gold) 78%, var(--text));
}

/* 浅色主题下 --gold 直接铺在浅金底上偏淡，统一压深一档 */
.support-note__facts .tag--gold,
.section-head__actions .tag--gold {
  color: color-mix(in srgb, var(--gold) 78%, var(--text));
}

.fact-list__title {
  font-size: var(--fs-h4);
  line-height: 1.4;
}

.fact-list__desc {
  color: var(--text-dim);
  font-size: var(--fs-xs);
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.fact-list__empty {
  padding: var(--sp-4);
  border: 1px dashed var(--line-strong);
  border-radius: var(--r-md);
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.8;
}

.fact-list__empty .link-arrow {
  display: inline-flex;
}

/* ---------------- 结尾 CTA ---------------- */
.support-cta {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-5);
  align-items: center;
  padding: clamp(1.6rem, 4vw, 2.75rem);
  overflow: hidden;
}

.support-cta__glow {
  position: absolute;
  inset: -25%;
  background:
    radial-gradient(45% 55% at 8% 15%, var(--accent-weak), transparent 70%),
    radial-gradient(45% 55% at 92% 85%, var(--gold-weak), transparent 70%);
  pointer-events: none;
}

.support-cta__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.support-cta__title {
  font-size: var(--fs-h2);
  line-height: 1.35;
}

.support-cta__lead {
  max-width: 52ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.85;
}

.support-cta__actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
}

/* ---------------- 响应式 ---------------- */
@media (min-width: 720px) {
  .support-hero__summary {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
    gap: var(--sp-5);
    align-items: center;
  }

  .support-hero__sep {
    display: block;
    align-self: stretch;
  }

  .support-note {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: var(--sp-6);
  }

  .support-cta {
    grid-template-columns: minmax(0, 1.4fr) auto;
  }

  .support-cta__actions {
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .support-hero__summary {
    gap: var(--sp-4);
  }

  .support-cta__actions .btn--lg,
  .support-note__actions .btn {
    width: 100%;
  }
}
</style>
