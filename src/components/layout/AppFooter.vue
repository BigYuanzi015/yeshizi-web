<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { siteInfo } from '@/data/site'

const qrOpen = ref(false)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <RouterLink to="/" class="footer__logo" aria-label="夜十字工作室首页">
            <img class="only-dark" src="/img/brand-mark.png" alt="" />
            <img class="only-light" src="/img/brand-mark-ink.png" alt="" />
          </RouterLink>
          <p class="footer__name">{{ siteInfo.name }}</p>
          <p class="footer__en mono">{{ siteInfo.nameEn }}</p>
          <p class="footer__desc">{{ siteInfo.description }}</p>
          <p class="footer__founded mono">EST. {{ siteInfo.foundedAt }}</p>
        </div>

        <div class="footer__col">
          <p class="footer__heading">快速导航</p>
          <nav class="footer__links" aria-label="页脚导航">
            <RouterLink to="/">首页</RouterLink>
            <RouterLink to="/maps">地图汇总</RouterLink>
            <RouterLink to="/about">关于我们</RouterLink>
            <RouterLink to="/supporters">投喂榜</RouterLink>
          </nav>
        </div>

        <div class="footer__col">
          <p class="footer__heading">保持联系</p>
          <div class="footer__social">
            <a :href="siteInfo.bilibili" target="_blank" rel="noreferrer" class="social">
              <span class="social__icon" aria-hidden="true">▶</span>
              <span>B 站空间</span>
            </a>
            <a :href="siteInfo.joinUrl" target="_blank" rel="noreferrer" class="social">
              <span class="social__icon" aria-hidden="true">✚</span>
              <span>加入 QQ 群</span>
            </a>
            <div
              class="social social--qr"
              tabindex="0"
              role="button"
              :aria-expanded="qrOpen"
              aria-label="查看微信公众号二维码"
              @mouseenter="qrOpen = true"
              @mouseleave="qrOpen = false"
              @focus="qrOpen = true"
              @blur="qrOpen = false"
              @click="qrOpen = !qrOpen"
            >
              <span class="social__icon" aria-hidden="true">◎</span>
              <span>微信公众号</span>
              <Transition name="qr">
                <span v-if="qrOpen" class="qr-card">
                  <img :src="siteInfo.wechatQr" alt="夜十字工作室微信公众号二维码" />
                  <span class="qr-card__tip">扫码关注工作室公众号</span>
                </span>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">
          © 2017 - {{ year }} {{ siteInfo.name }} · 我们很小，但我们很努力
        </p>
        <div class="footer__legal">
          <a :href="siteInfo.icpUrl" target="_blank" rel="noreferrer">{{ siteInfo.icp }}</a>
          <span class="dot" aria-hidden="true"></span>
          <span class="footer__note">本站重构自 2021 版官网</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding-block: clamp(2.5rem, 5vw, 4rem) var(--sp-6);
  border-top: 1px solid var(--line);
  background: var(--footer-bg);
}

.footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 40ch;
}

.footer__logo {
  width: 148px;
  margin-bottom: 0.5rem;
  opacity: 0.92;
}

.footer__logo img {
  width: 100%;
}

.footer__name {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.footer__en {
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  color: var(--accent-soft);
}

.footer__desc {
  margin-top: 0.5rem;
  color: var(--text-mute);
  font-size: var(--fs-xs);
  line-height: 1.9;
}

.footer__founded {
  margin-top: 0.5rem;
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  color: var(--text-mute);
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.footer__heading {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-size: var(--fs-sm);
  color: var(--text-dim);
}

.footer__links a {
  width: fit-content;
  transition:
    color var(--dur-1) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.footer__links a:hover {
  color: var(--text);
  transform: translateX(3px);
}

.footer__social {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.social {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  color: var(--text-dim);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition:
    color var(--dur-1) var(--ease-out),
    border-color var(--dur-2) var(--ease-out),
    background-color var(--dur-2) var(--ease-out);
}

.social:hover,
.social:focus-visible {
  color: var(--text);
  border-color: var(--line);
  background: var(--glass-bg);
}

.social__icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 1px solid var(--line-strong);
  font-size: 0.7rem;
  color: var(--accent-soft);
}

.qr-card {
  position: absolute;
  left: 0;
  bottom: calc(100% + 10px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.7rem;
  width: 168px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: var(--qr-bg);
  box-shadow: var(--shadow-lg);
}

.qr-card img {
  width: 100%;
  border-radius: var(--r-xs);
}

.qr-card__tip {
  font-size: var(--fs-micro);
  color: var(--text-mute);
  text-align: center;
}

.qr-enter-active,
.qr-leave-active {
  transition:
    opacity var(--dur-1) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.qr-enter-from,
.qr-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: clamp(2rem, 4vw, 3rem);
  padding-top: var(--sp-5);
  border-top: 1px solid var(--line);
  font-size: var(--fs-micro);
  color: var(--text-mute);
}

.footer__legal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.footer__legal a:hover {
  color: var(--text-dim);
}

.footer__legal .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--line-strong);
}

@media (min-width: 720px) {
  .footer__grid {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.7fr) minmax(0, 0.9fr);
    gap: var(--sp-7);
  }
}
</style>
