<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TimelineRail from '@/components/about/TimelineRail.vue'
import MemberWall from '@/components/about/MemberWall.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { members } from '@/data/members'
import { mapItems } from '@/data/maps'
import { siteInfo, studioStats } from '@/data/site'
import { supporters, supportersTotal } from '@/data/supporters'
import { timelineStages } from '@/data/timeline'
import { useCountUp } from '@/composables/useCountUp'
import type { TimelineEvent } from '@/types/content'

interface StatCell {
  label: string
  value: number
  prefix?: string
  suffix?: string
  /** 展示的小数位，默认 0 */
  decimals?: number
  hint: string
}

/* ---------------- 数据条：优先 studioStats，其余实时计算 ---------------- */
const foundedStat = studioStats.find((item) => item.label === '成立年份')
const mapStat = studioStats.find((item) => item.label === '地图作品')
const authorStat = studioStats.find((item) => item.label === '地图作者')
const feedStat = studioStats.find((item) => item.label === '投喂伙伴')

const authorCount = computed(() => new Set(mapItems.map((item) => item.author)).size)
const councilCount = computed(
  () =>
    members.filter((member) => member.group === 'leadership' || member.group === 'elders').length,
)

const statCells = computed<StatCell[]>(() => [
  {
    label: foundedStat?.label ?? '成立年份',
    value: foundedStat?.value ?? 2017,
    hint: foundedStat?.hint ?? `成立于 ${siteInfo.foundedAt}`,
  },
  {
    label: mapStat?.label ?? '地图作品',
    value: mapItems.length,
    suffix: '张',
    hint: mapStat?.hint ?? '解谜 / 闯关 / 主城',
  },
  {
    label: authorStat?.label ?? '地图作者',
    value: authorCount.value || (authorStat?.value ?? 0),
    suffix: '人',
    hint: authorStat?.hint ?? '参与过地图创作的成员',
  },
  {
    label: '元老会',
    value: councilCount.value,
    suffix: '人',
    hint: '历任室长与元老会成员',
  },
  {
    label: feedStat?.label ?? '投喂伙伴',
    value: supporters.length,
    suffix: '位',
    hint: feedStat?.hint ?? '感谢每一份支持',
  },
  {
    label: '累计投喂',
    value: supportersTotal,
    prefix: '￥',
    decimals: 2,
    hint: '来自投喂榜实时统计',
  },
])

const { values: statValues } = useCountUp(() => statCells.value.map((cell) => cell.value))

function statText(index: number, cell: StatCell): string {
  const current = statValues.value[index] ?? 0
  const digits = cell.decimals ?? 0
  return digits > 0 ? current.toFixed(digits) : String(Math.round(current))
}

/* ---------------- 起源：直接引用 timeline 里的创立记录 ---------------- */
const foundingStage = timelineStages.find((stage) => stage.id === 'begin')
const foundingEvent: TimelineEvent | undefined =
  foundingStage?.events.find((event) => event.date === siteInfo.foundedAt) ??
  foundingStage?.events[0]

const originDate = foundingEvent?.date ?? siteInfo.foundedAt
const originText =
  foundingEvent?.desc ?? '2017 年 7 月 23 日，夜十字工作室正式成立，从此开始做自己的地图。'

const originFacts = [
  { label: '创立日期', value: originDate },
  { label: '创立成员', value: '室长 Joker · 元老会 鸽圆 / 烦鸟 / 有毒の贰比' },
  { label: '首部作品', value: '《失落的地城》' },
  { label: '制作路线', value: '解密类地图' },
]

/* ---------------- 成员 / 年表派生 ---------------- */
const currentLead = members.find((member) => member.role.includes('现任室长'))
const timelineCount = timelineStages.reduce((sum, stage) => sum + stage.events.length, 0)
</script>

<template>
  <div class="about">
    <!-- ============ HERO ============ -->
    <header class="page-hero">
      <div class="container">
        <nav class="page-hero__crumb" aria-label="面包屑">
          <RouterLink to="/">首页</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">关于我们</span>
        </nav>

        <p class="eyebrow reveal">About Us</p>
        <h1 class="page-hero__title reveal" style="--reveal-delay: 70ms">
          关于<span class="text-gradient">我们</span>
        </h1>
        <p class="page-hero__lead reveal" style="--reveal-delay: 140ms">{{ siteInfo.description }}</p>

        <div class="page-hero__meta reveal" style="--reveal-delay: 210ms">
          <span class="mono">成立 {{ siteInfo.foundedAt }}</span>
          <span class="dot" aria-hidden="true"></span>
          <span class="mono">资料更新 {{ siteInfo.updatedAt }}</span>
          <span class="dot" aria-hidden="true"></span>
          <span class="mono">{{ siteInfo.nameEn }}</span>
        </div>

        <nav class="about__jumps reveal" style="--reveal-delay: 280ms" aria-label="关于我们页面导航">
          <a class="chip" href="#origin">起源</a>
          <a class="chip" href="#timeline">发展年表</a>
          <a class="chip" href="#members">成员墙</a>
          <a class="chip" href="#join">加入我们</a>
        </nav>
      </div>
    </header>

    <!-- ============ 数据条 ============ -->
    <section class="section section--tight" aria-labelledby="about-stats-title">
      <div class="container">
        <h2 id="about-stats-title" class="sr-only">工作室数据</h2>
        <div class="stat-strip reveal">
          <div v-for="(cell, index) in statCells" :key="cell.label" class="stat">
            <span class="stat__value">
              <span v-if="cell.prefix" class="stat__prefix">{{ cell.prefix }}</span
              >{{ statText(index, cell)
              }}<small v-if="cell.suffix">{{ cell.suffix }}</small>
            </span>
            <span class="stat__label">{{ cell.label }}</span>
            <span class="stat__hint">{{ cell.hint }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 起源 ============ -->
    <section id="origin" class="section about-origin" aria-labelledby="origin-title">
      <div class="container">
        <div class="origin">
          <figure class="origin__figure reveal">
            <div class="origin__frame">
              <img
                src="/img/hero.jpg"
                alt="夜十字工作室成员在 Minecraft 中的合影"
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption class="origin__caption mono">工作室合影 · Minecraft 中的我们</figcaption>
          </figure>

          <div class="origin__content">
            <SectionHeading
              eyebrow="01 — Origin"
              title="起源"
              lead="一群人为了同一个爱好凑在一起，故事就从这里开始。"
            />

            <p class="origin__date mono">{{ originDate }} · NOCTU CRUCIS STUDIO</p>
            <blockquote class="origin__quote">
              {{ originText }}
            </blockquote>

            <dl class="origin__facts">
              <div v-for="fact in originFacts" :key="fact.label" class="origin__fact">
                <dt class="origin__fact-label">{{ fact.label }}</dt>
                <dd class="origin__fact-value">{{ fact.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 发展年表 ============ -->
    <section id="timeline" class="section about-timeline" aria-labelledby="timeline-title">
      <div class="container">
        <SectionHeading
          eyebrow="02 — Timeline"
          title="发展年表"
          lead="从 2017 年的四人小队到今天的夜十字工作室，每一个节点都来自旧站记录。"
        >
          <template #actions>
            <span class="tag mono">{{ timelineCount }} 个节点</span>
          </template>
        </SectionHeading>

        <TimelineRail :stages="timelineStages" />
      </div>
    </section>

    <!-- ============ 成员墙 ============ -->
    <section id="members" class="section about-members" aria-labelledby="members-title">
      <div class="container">
        <SectionHeading
          eyebrow="03 — Members"
          title="成员墙"
          lead="室长、元老会与地图作者——工作室的每一块「方块」，都是他们放下的。"
        >
          <template #actions>
            <span class="tag mono">{{ members.length }} 位成员</span>
          </template>
        </SectionHeading>

        <figure v-if="currentLead" class="lead-card card reveal">
          <div class="lead-card__media">
            <img
              src="/img/profile-lengyan.png"
              :alt="`旧站「夜十字工作室室长 ${currentLead.name}」简介卡`"
              width="1080"
              height="1080"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption class="lead-card__body">
            <div class="lead-card__tags">
              <span class="tag tag--accent">现任室长</span>
              <span class="tag">旧站资料</span>
            </div>
            <h3 class="lead-card__name">
              {{ currentLead.name }}
              <span class="lead-card__alias mono">{{ currentLead.alias }}</span>
            </h3>
            <p class="lead-card__role">{{ currentLead.role }}</p>
            <p v-if="currentLead.highlight" class="lead-card__highlight">
              {{ currentLead.highlight }}
            </p>
            <p class="lead-card__note">
              配图为 2021 版旧站「夜十字工作室室长」简介卡，仅作旧站资料展示。
            </p>
          </figcaption>
        </figure>

        <MemberWall :members="members" />
      </div>
    </section>

    <!-- ============ 加入我们 ============ -->
    <section id="join" class="section" aria-labelledby="about-join-title">
      <div class="container">
        <div class="about-join card reveal">
          <div class="about-join__glow" aria-hidden="true"></div>
          <div class="about-join__content">
            <p class="eyebrow">Join Us</p>
            <h2 id="about-join-title" class="about-join__title">
              未来我们在路上<span class="text-gradient">……而这里需要你！</span>
            </h2>
            <p class="about-join__lead">
              不管你是会做地图、会红石指令，还是只想找一群人一起玩 Minecraft，
              只要愿意一起把地图做得更好，夜十字工作室都欢迎你。
            </p>
            <div class="about-join__actions">
              <a
                class="btn btn--primary btn--lg"
                :href="siteInfo.joinUrl"
                target="_blank"
                rel="noreferrer"
              >
                加入 QQ 群
              </a>
              <RouterLink to="/supporters" class="btn btn--ghost btn--lg">看看投喂榜</RouterLink>
            </div>
          </div>

          <div class="about-join__side">
            <figure class="about-join__qr">
              <img
                :src="siteInfo.wechatQr"
                alt="夜十字工作室微信公众号二维码"
                width="258"
                height="258"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span class="about-join__qr-title">微信公众号</span>
                <span class="about-join__qr-tip mono">SCAN ME</span>
              </figcaption>
            </figure>
            <a
              class="about-join__bili"
              :href="siteInfo.bilibili"
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">▶</span>
              关注 B 站空间
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about {
  position: relative;
}

/* ---------------- 首屏 ---------------- */
.about__jumps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: var(--sp-5);
}

.about__jumps .chip {
  color: var(--text-dim);
}

.about__jumps .chip:hover,
.about__jumps .chip:focus-visible {
  color: var(--text);
}

/* ---------------- 数据条 ---------------- */
.stat__prefix {
  margin-right: 0.06em;
  font-size: 0.72em;
  color: var(--accent-soft);
}

.stat__label {
  color: var(--text-dim);
}

.stat__hint {
  font-size: var(--fs-micro);
  color: var(--text-dim);
  line-height: 1.5;
}

/* ---------------- 起源 ---------------- */
.origin {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
  align-items: start;
}

.origin__figure {
  margin: 0;
  min-width: 0;
}

.origin__frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-lg);
  background: var(--panel-bg);
  box-shadow: var(--shadow-lg);
}

.origin__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition: transform 0.8s var(--ease-out);
}

.origin__figure:hover .origin__frame img {
  transform: scale(1.04);
}

.origin__caption {
  margin-top: var(--sp-3);
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.origin__content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  min-width: 0;
}

.origin__date {
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  color: var(--accent-soft);
}

.origin__quote {
  margin: 0;
  padding-left: var(--sp-4);
  border-left: 2px solid var(--line-bright);
  color: var(--text);
  font-size: var(--fs-sm);
  line-height: 1.95;
  overflow-wrap: anywhere;
}

.origin__facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  gap: 1px;
  margin-top: var(--sp-2);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--line);
}

.origin__fact {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.85rem 1rem;
  background: var(--stat-bg);
}

.origin__fact-label {
  font-size: var(--fs-micro);
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.origin__fact-value {
  margin: 0;
  color: var(--text);
  font-size: var(--fs-xs);
  line-height: 1.6;
  overflow-wrap: anywhere;
}

/* ---------------- 成员墙 ---------------- */
.lead-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  padding: clamp(0.9rem, 2vw, 1.15rem);
  align-items: center;
}

.lead-card__media {
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: var(--stat-bg);
  aspect-ratio: 16 / 9;
}

.lead-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.lead-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.lead-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.lead-card__name {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  font-size: var(--fs-h2);
  letter-spacing: 0.01em;
}

.lead-card__alias {
  font-size: var(--fs-xs);
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--text-dim);
}

.lead-card__role {
  color: var(--accent-soft);
  font-size: var(--fs-sm);
  letter-spacing: 0.04em;
}

.lead-card__highlight {
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.75;
}

.lead-card__note {
  margin-top: 0.35rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--line);
  color: var(--text-dim);
  font-size: var(--fs-micro);
  line-height: 1.7;
}

/* ---------------- 加入我们 ---------------- */
.about-join {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
  padding: clamp(1.75rem, 4vw, 3rem);
  overflow: hidden;
}

.about-join__glow {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(50% 60% at 12% 10%, var(--accent-weak), transparent 70%),
    radial-gradient(45% 55% at 88% 90%, var(--accent-weak-2), transparent 70%);
  pointer-events: none;
}

.about-join__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.about-join__title {
  font-size: var(--fs-h2);
  line-height: 1.4;
}

.about-join__lead {
  max-width: 56ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.85;
}

.about-join__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-2);
}

.about-join__side {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--sp-4);
}

.about-join__qr {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: var(--qr-bg);
}

.about-join__qr img {
  width: 118px;
  border-radius: var(--r-xs);
}

.about-join__qr figcaption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.about-join__qr-title {
  color: var(--text-dim);
  font-size: var(--fs-micro);
}

.about-join__qr-tip {
  font-size: 0.58rem;
  letter-spacing: 0.24em;
  color: var(--text-mute);
}

.about-join__bili {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 1rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  color: var(--text-dim);
  font-size: var(--fs-xs);
  transition:
    color var(--dur-1) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.about-join__bili:hover,
.about-join__bili:focus-visible {
  color: var(--text);
  border-color: var(--line-bright);
}

/* ---------------- 响应式 ---------------- */
@media (max-width: 900px) {
  .stat-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .stat-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 760px) {
  .lead-card {
    grid-template-columns: minmax(0, 210px) minmax(0, 1fr);
    gap: var(--sp-5);
  }

  .lead-card__media {
    aspect-ratio: 1;
  }
}

@media (min-width: 900px) {
  .origin {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: var(--sp-7);
    align-items: center;
  }
}

@media (min-width: 960px) {
  .about-join {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.75fr);
    align-items: center;
  }

  .about-join__side {
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .about-join__actions .btn--lg {
    width: 100%;
  }
}
</style>
