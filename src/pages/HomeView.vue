<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import MapCard from '@/components/maps/MapCard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { siteInfo, studioStats } from '@/data/site'
import { mapItems, mapSeriesList } from '@/data/maps'
import { newsItems } from '@/data/news'
import { timelineStages } from '@/data/timeline'
import { supporters, supportersTotal } from '@/data/supporters'
import type { MapItem } from '@/types/content'

const router = useRouter()

/* ---------------- 数据派生 ---------------- */
const featuredMaps = computed<MapItem[]>(() => {
  const featured = mapItems.filter((item) => item.featured)
  const rest = mapItems.filter((item) => !item.featured)
  return [...featured, ...rest].slice(0, 6)
})

const topSupporters = computed(() =>
  [...supporters].sort((a, b) => b.amount - a.amount).slice(0, 3),
)

const supportTotal = computed(() => supportersTotal)

const stageCards = computed(() =>
  timelineStages.map((stage) => {
    const events = stage.events
    return {
      id: stage.id,
      stage: stage.stage,
      period: stage.period,
      summary: stage.summary,
      count: events.length,
      firstDate: events[0]?.date ?? '',
      lastDate: events[events.length - 1]?.date ?? '',
    }
  }),
)

const tickerItems = computed(() => {
  const authors = Array.from(new Set(mapItems.map((item) => item.author)))
  return [
    'NOCTU CRUCIS STUDIO',
    ...mapSeriesList.map((series) => series.name),
    ...authors.slice(0, 6),
    '2017 / 07 / 23',
    '我们很小 但我们很努力',
  ]
})

/* ---------------- 数字滚动 ---------------- */
const statValues = ref<number[]>(studioStats.map(() => 0))
const reducedMotion = ref(false)
let statFrame = 0

function animateStats(): void {
  const duration = 1300
  const startAt = performance.now()
  const target = studioStats.map((stat) => stat.value)

  const tick = (now: number): void => {
    const progress = Math.min(1, (now - startAt) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    statValues.value = target.map((value) => Math.round(value * eased))
    if (progress < 1) statFrame = requestAnimationFrame(tick)
  }

  statFrame = requestAnimationFrame(tick)
}

/* ---------------- Hero 视差 ---------------- */
const heroScroll = ref(0)
let frame = 0

function onScroll(): void {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    heroScroll.value = Math.min(window.scrollY, 900)
  })
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion.value) {
    statValues.value = studioStats.map((stat) => stat.value)
  } else {
    animateStats()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (frame) cancelAnimationFrame(frame)
  if (statFrame) cancelAnimationFrame(statFrame)
})

function openMap(item: MapItem): void {
  router.push({ path: '/maps', query: { id: item.id } })
}
</script>

<template>
  <div class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div
        class="hero__bg"
        :style="reducedMotion ? undefined : { transform: `translate3d(0, ${heroScroll * 0.16}px, 0)` }"
      >
        <img src="/img/hero.jpg" alt="夜十字工作室成员在 Minecraft 中的合影" />
      </div>
      <div class="hero__veil" aria-hidden="true"></div>
      <div class="hero__scan" aria-hidden="true"></div>

      <div class="container hero__inner">
        <div class="hero__content">
          <p class="eyebrow reveal">Minecraft Game Studio · Est. 2017</p>
          <h1 class="hero__title reveal" style="--reveal-delay: 80ms">
            <span class="hero__title-cn">夜十字工作室</span>
            <span class="hero__title-en">NOCTU CRUCIS STUDIO</span>
          </h1>
          <p class="hero__lead reveal" style="--reveal-delay: 160ms">
            {{ siteInfo.description }}
          </p>
          <div class="hero__actions reveal" style="--reveal-delay: 240ms">
            <RouterLink to="/maps" class="btn btn--primary btn--lg">
              浏览全部地图
              <span class="hero__arrow" aria-hidden="true">→</span>
            </RouterLink>
            <a
              class="btn btn--ghost btn--lg"
              :href="siteInfo.joinUrl"
              target="_blank"
              rel="noreferrer"
            >
              加入我们
            </a>
          </div>
          <dl class="hero__meta reveal" style="--reveal-delay: 320ms">
            <div>
              <dt>成立</dt>
              <dd class="mono">{{ siteInfo.foundedAt }}</dd>
            </div>
            <span class="hero__meta-line" aria-hidden="true"></span>
            <div>
              <dt>地图作品</dt>
              <dd class="mono">{{ mapItems.length }}+</dd>
            </div>
            <span class="hero__meta-line" aria-hidden="true"></span>
            <div>
              <dt>累计投喂</dt>
              <dd class="mono">￥{{ supportTotal.toFixed(2) }}</dd>
            </div>
          </dl>
        </div>

        <div class="hero__art" aria-hidden="true">
          <div class="hero__ring hero__ring--a"></div>
          <div class="hero__ring hero__ring--b"></div>
          <img class="hero__mark only-dark" src="/img/brand-mark.png" alt="" />
          <img class="hero__mark only-light" src="/img/brand-mark-ink.png" alt="" />
          <span class="hero__badge hero__badge--top mono">MC · DECRYPTION MAPS</span>
          <span class="hero__badge hero__badge--bottom mono">{{ mapItems.length }} MAPS / 2017 → NOW</span>
        </div>
      </div>

      <div class="hero__scroll" aria-hidden="true">
        <span>SCROLL</span>
        <span class="hero__scroll-line"></span>
      </div>
    </section>

    <!-- ============ TICKER ============ -->
    <div class="ticker" aria-hidden="true">
      <div class="ticker__track">
        <template v-for="copy in 2" :key="copy">
          <span v-for="(item, index) in tickerItems" :key="`${copy}-${index}`" class="ticker__item">
            <span class="ticker__dot"></span>{{ item }}
          </span>
        </template>
      </div>
    </div>

    <!-- ============ STATS ============ -->
    <section class="section section--tight">
      <div class="container">
        <div class="stat-strip reveal">
          <div v-for="(stat, index) in studioStats" :key="stat.label" class="stat">
            <span class="stat__value">
              {{ Math.round(statValues[index] ?? 0)
              }}<small v-if="stat.suffix">{{ stat.suffix }}</small>
            </span>
            <span class="stat__label">{{ stat.label }}</span>
            <span class="stat__hint">{{ stat.hint }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ NEWS ============ -->
    <section id="news" class="section">
      <div class="container">
        <SectionHeading
          eyebrow="01 — News"
          title="新闻资讯"
          lead="工作室的每一个节点都值得被记住。"
        >
          <template #actions>
            <a :href="siteInfo.bilibili" target="_blank" rel="noreferrer" class="link-arrow">
              关注 B 站动态
            </a>
          </template>
        </SectionHeading>

        <div class="news-grid">
          <article
            v-for="(news, index) in newsItems"
            :key="news.id"
            class="news-card reveal"
            :class="`news-card--${news.tone}`"
            :style="{ '--reveal-delay': `${index * 90}ms` }"
          >
            <div class="news-card__media" :class="{ 'news-card__media--light': news.tone !== 'site' }">
              <img :src="news.image" :alt="news.imageAlt" loading="lazy" decoding="async" />
              <span class="news-card__date mono">{{ news.date }}</span>
            </div>
            <div class="news-card__body">
              <span class="tag tag--accent">工作室动态</span>
              <h3 class="news-card__title">{{ news.title }}</h3>
              <p class="news-card__text">{{ news.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ WORKS ============ -->
    <section id="works" class="section">
      <div class="container">
        <SectionHeading
          eyebrow="02 — Selected Works"
          title="精选作品"
          lead="从《哲学的大冒险》到《禁令》系列，每一张地图都是一段被做进方块里的记忆。"
        >
          <template #actions>
            <RouterLink to="/maps" class="link-arrow">查看全部 {{ mapItems.length }} 张地图</RouterLink>
          </template>
        </SectionHeading>

        <div class="works-grid">
          <MapCard
            v-for="(item, index) in featuredMaps"
            :key="item.id"
            :item="item"
            :eager="index < 2"
            class="reveal"
            :style="{ '--reveal-delay': `${index * 60}ms` }"
            @open="openMap"
          />
        </div>
      </div>
    </section>

    <!-- ============ TIMELINE ============ -->
    <section id="history" class="section">
      <div class="container">
        <SectionHeading
          eyebrow="03 — History"
          title="我们走过的路"
          lead="2017 年 7 月 23 日，四个人的一句「要不做个工作室吧」，一直走到今天。"
        >
          <template #actions>
            <RouterLink to="/about" class="link-arrow">完整发展年表</RouterLink>
          </template>
        </SectionHeading>

        <div class="stage-grid">
          <RouterLink
            v-for="(stage, index) in stageCards"
            :key="stage.id"
            to="/about"
            class="stage-card card card--hover reveal"
            :style="{ '--reveal-delay': `${index * 90}ms` }"
          >
            <span class="stage-card__index mono">0{{ index + 1 }}</span>
            <h3 class="stage-card__title">{{ stage.stage }}</h3>
            <p class="stage-card__period mono">{{ stage.period }}</p>
            <p class="stage-card__summary">{{ stage.summary }}</p>
            <div class="stage-card__foot">
              <span class="stage-card__count mono">{{ stage.count }} 个节点</span>
              <span class="stage-card__arrow" aria-hidden="true">→</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ============ SUPPORTERS ============ -->
    <section id="support" class="section">
      <div class="container support">
        <div class="support__intro">
          <p class="eyebrow">04 — Supporters</p>
          <h2 class="section-head__title">工作室投喂榜</h2>
          <p class="section-head__lead">
            感谢大家为工作室投喂。每一份支持，都变成了地图里多出的一块方块。
          </p>
          <div class="support__total">
            <span class="support__total-value mono">￥{{ supportTotal.toFixed(2) }}</span>
            <span class="support__total-label">累计投喂 · {{ supporters.length }} 位小伙伴</span>
          </div>
          <RouterLink to="/supporters" class="link-arrow">查看完整投喂榜</RouterLink>
        </div>

        <ol class="support__list">
          <li
            v-for="(item, index) in topSupporters"
            :key="item.name"
            class="support__row reveal"
            :style="{ '--reveal-delay': `${index * 80}ms` }"
          >
            <span class="support__rank mono" :class="`is-${index + 1}`">{{ index + 1 }}</span>
            <span class="support__name">{{ item.name }}</span>
            <span class="support__bar" aria-hidden="true">
              <span
                class="support__bar-fill"
                :style="{ width: `${(item.amount / topSupporters[0].amount) * 100}%` }"
              ></span>
            </span>
            <span class="support__amount mono">￥{{ item.amount.toFixed(2) }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- ============ JOIN ============ -->
    <section class="section">
      <div class="container">
        <div class="join card reveal">
          <div class="join__glow" aria-hidden="true"></div>
          <div class="join__content">
            <p class="eyebrow">Join Us</p>
            <h2 class="join__title">
              未来我们在路上<span class="text-gradient">……而这里需要你！</span>
            </h2>
            <p class="join__lead">
              不管你是会做地图、会红石指令，还是只会喊「这也太坑了吧」，只要喜欢 Minecraft，
              夜十字工作室都欢迎你。
            </p>
            <div class="join__actions">
              <a
                class="btn btn--primary btn--lg"
                :href="siteInfo.joinUrl"
                target="_blank"
                rel="noreferrer"
              >
                加入 QQ 群
              </a>
              <RouterLink to="/about" class="btn btn--ghost btn--lg">了解工作室</RouterLink>
            </div>
          </div>

          <div class="join__side">
            <div class="join__qr">
              <img :src="siteInfo.wechatQr" alt="夜十字工作室微信公众号二维码" loading="lazy" />
              <p>微信公众号</p>
              <span class="mono">SCAN ME</span>
            </div>
            <a :href="siteInfo.bilibili" target="_blank" rel="noreferrer" class="join__bili">
              <span class="join__bili-icon" aria-hidden="true">▶</span>
              <span>B 站空间</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
}

/* ================= HERO ================= */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: min(100svh, 880px);
  padding-top: calc(var(--header-h) + 3rem);
  padding-bottom: clamp(3rem, 8vw, 6rem);
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: -8% 0 -8%;
  z-index: 0;
  will-change: transform;
}

.hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
  filter: var(--hero-image-filter);
}

.hero__veil {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--hero-veil);
}

.hero__scan {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.5;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--scan-line) 0px,
    var(--scan-line) 1px,
    transparent 1px,
    transparent 4px
  );
  mask-image: linear-gradient(to bottom, transparent, #000 30%, transparent 90%);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 30%, transparent 90%);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.8fr);
  gap: var(--sp-6);
  align-items: center;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  max-width: 660px;
}

.hero__title {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-block: 0.25rem;
}

.hero__title-cn {
  font-size: clamp(2.7rem, 6vw, 4.9rem);
  font-weight: 800;
  letter-spacing: 0.01em;
  background: var(--grad-title);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: var(--hero-title-shadow);
}

.hero__title-en {
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.5vw, 0.95rem);
  font-weight: 500;
  letter-spacing: 0.42em;
  color: var(--accent-soft);
  opacity: 0.85;
}

.hero__lead {
  max-width: 54ch;
  color: var(--text-dim);
  font-size: clamp(0.95rem, 1.15vw, 1.05rem);
  line-height: 1.9;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-2);
}

.hero__arrow {
  transition: transform var(--dur-2) var(--ease-out);
}

.hero__actions .btn:hover .hero__arrow {
  transform: translateX(4px);
}

.hero__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-4);
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--line);
}

.hero__meta div {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero__meta dt {
  font-size: var(--fs-micro);
  letter-spacing: 0.12em;
  color: var(--text-mute);
}

.hero__meta dd {
  font-size: var(--fs-sm);
  color: var(--text);
  letter-spacing: 0.04em;
}

.hero__meta-line {
  width: 1px;
  height: 26px;
  background: var(--line-strong);
}

/* 右侧装饰 */
.hero__art {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  max-width: 460px;
  justify-self: end;
  width: 100%;
}

.hero__mark {
  position: relative;
  z-index: 2;
  width: 62%;
  filter: drop-shadow(0 24px 60px var(--accent-glow));
  animation: float 7s var(--ease-in-out) infinite alternate;
}

.hero__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--accent-border-soft);
}

.hero__ring--a {
  inset: 4%;
  background: radial-gradient(circle, var(--accent-glow), transparent 62%);
}

.hero__ring--b {
  inset: -8%;
  border-style: dashed;
  border-color: var(--accent-weak-2);
  animation: spin 90s linear infinite;
}

.hero__badge {
  position: absolute;
  z-index: 3;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--accent-border-soft);
  border-radius: var(--r-pill);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(8px);
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  color: var(--accent-soft);
  white-space: nowrap;
}

.hero__badge--top {
  top: 12%;
  right: 2%;
}

.hero__badge--bottom {
  bottom: 12%;
  left: -2%;
  color: var(--text-dim);
}

.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 1.6rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transform: translateX(-50%);
  color: var(--text-mute);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
}

.hero__scroll-line {
  width: 1px;
  height: 42px;
  overflow: hidden;
  background: linear-gradient(to bottom, var(--accent-border), transparent);
  animation: scroll-hint 2.4s var(--ease-in-out) infinite;
}

/* ================= TICKER ================= */
.ticker {
  position: relative;
  overflow: hidden;
  border-block: 1px solid var(--line);
  background: var(--surface);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.ticker__track {
  display: flex;
  width: max-content;
  padding-block: 0.85rem;
  animation: ticker 46s linear infinite;
}

.ticker__track:hover {
  animation-play-state: paused;
}

.ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  padding-inline: 1.4rem;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.14em;
  color: var(--text-dim);
  white-space: nowrap;
}

.ticker__dot {
  width: 5px;
  height: 5px;
  border-radius: 1px;
  transform: rotate(45deg);
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-border);
}

/* ================= STATS ================= */
.stat__hint {
  font-size: var(--fs-micro);
  color: var(--text-mute);
  opacity: 0.8;
}

/* ================= NEWS ================= */
.news-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-5);
}

.news-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--grad-surface);
  transition:
    border-color var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.news-card:hover {
  transform: translateY(-3px);
  border-color: var(--card-hover-border);
}

.news-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-deep);
}

.news-card__media--light {
  display: grid;
  place-items: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--logo-tile-bg);
}

.news-card__media--light img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.news-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease-out);
}

.news-card:hover .news-card__media img {
  transform: scale(1.03);
}

.news-card__date {
  position: absolute;
  left: 0.9rem;
  bottom: 0.9rem;
  padding: 0.28rem 0.7rem;
  border-radius: var(--r-pill);
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(8px);
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  color: var(--text);
}

.news-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: clamp(1.1rem, 2vw, 1.5rem);
}

.news-card__body .tag {
  width: fit-content;
}

.news-card__title {
  font-size: var(--fs-h3);
}

.news-card__text {
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.85;
}

/* ================= WORKS ================= */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--sp-5);
}

/* ================= STAGES ================= */
.stage-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
}

.stage-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: clamp(1.4rem, 2.6vw, 2rem);
  overflow: hidden;
}

.stage-card::after {
  content: '';
  position: absolute;
  right: -30%;
  top: -40%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-glow), transparent 65%);
  opacity: 0;
  transition: opacity var(--dur-3) var(--ease-out);
}

.stage-card:hover::after {
  opacity: 1;
}

.stage-card__index {
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  color: var(--accent-soft);
}

.stage-card__title {
  font-size: var(--fs-h2);
  letter-spacing: 0.02em;
}

.stage-card__period {
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  color: var(--text-mute);
}

.stage-card__summary {
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.8;
}

.stage-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--sp-4);
  border-top: 1px solid var(--line);
  font-size: var(--fs-micro);
  color: var(--text-mute);
}

.stage-card__arrow {
  color: var(--accent-soft);
  transition: transform var(--dur-2) var(--ease-out);
}

.stage-card:hover .stage-card__arrow {
  transform: translateX(4px);
}

/* ================= SUPPORTERS ================= */
.support {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
  align-items: start;
}

.support__intro {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.support__total {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-block: var(--sp-3);
}

.support__total-value {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  background: var(--grad-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.support__total-label {
  font-size: var(--fs-xs);
  color: var(--text-mute);
}

.support__list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.support__row {
  display: grid;
  grid-template-columns: 30px minmax(64px, 0.9fr) minmax(60px, 2.2fr) 74px;
  align-items: center;
  gap: clamp(0.6rem, 2vw, 1.2rem);
  padding: 0.75rem 0.95rem;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--glass-bg-weak);
}

.support__rank {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid var(--line-strong);
  font-size: var(--fs-xs);
  color: var(--text-dim);
}

.support__rank.is-1 {
  border-color: var(--gold-border);
  color: var(--gold);
  background: var(--gold-weak);
}

.support__rank.is-2 {
  border-color: var(--line-strong);
  color: var(--silver);
  background: var(--glass-bg);
}

.support__rank.is-3 {
  border-color: var(--gold-border);
  color: var(--bronze);
  background: var(--glass-bg-weak);
}

.support__name {
  font-size: var(--fs-sm);
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.support__bar {
  position: relative;
  height: 6px;
  border-radius: var(--r-pill);
  background: var(--bar-track);
  overflow: hidden;
}

.support__bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--grad-accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

.support__amount {
  font-size: var(--fs-sm);
  text-align: right;
  color: var(--accent-soft);
}

/* ================= JOIN ================= */
.join {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
  padding: clamp(1.75rem, 4vw, 3rem);
  overflow: hidden;
}

.join__glow {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(50% 60% at 12% 10%, var(--accent-glow), transparent 70%),
    radial-gradient(45% 55% at 88% 90%, var(--accent-weak-2), transparent 70%);
  pointer-events: none;
}

.join__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.join__title {
  font-size: var(--fs-h2);
  line-height: 1.35;
}

.join__lead {
  max-width: 54ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.85;
}

.join__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}

.join__side {
  position: relative;
  z-index: 1;
  display: flex;
  gap: var(--sp-4);
  align-items: flex-start;
  flex-wrap: wrap;
}

.join__qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.85rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: var(--glass-bg);
}

.join__qr img {
  width: 118px;
  border-radius: var(--r-xs);
}

.join__qr p {
  font-size: var(--fs-micro);
  color: var(--text-dim);
}

.join__qr span {
  font-size: 0.58rem;
  letter-spacing: 0.24em;
  color: var(--text-mute);
}

.join__bili {
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

.join__bili:hover {
  color: var(--text);
  border-color: var(--line-bright);
}

.join__bili-icon {
  color: var(--accent-soft);
  font-size: 0.7rem;
}

/* ================= 关键帧 ================= */
@keyframes float {
  from {
    transform: translateY(-6px) rotate(-0.6deg);
  }
  to {
    transform: translateY(8px) rotate(0.6deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ticker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes scroll-hint {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* ================= 响应式 ================= */
@media (max-width: 1080px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__art {
    display: none;
  }

  .hero__content {
    max-width: 100%;
  }
}

@media (min-width: 760px) {
  .stage-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .news-grid {
    grid-template-columns: 1.15fr 0.85fr;
    align-items: stretch;
  }

  .support {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: var(--sp-7);
  }

  .join {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.7fr);
    align-items: center;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: auto;
    padding-top: calc(var(--header-h) + 4rem);
  }

  .hero__meta {
    gap: var(--sp-3);
  }

  .hero__meta-line {
    display: none;
  }

  .support__row {
    grid-template-columns: 26px minmax(52px, 1fr) 64px;
  }

  .support__bar {
    display: none;
  }

  .hero__scroll {
    display: none;
  }
}
</style>
