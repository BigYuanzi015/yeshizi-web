<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { siteInfo, studioStats } from '@/data/site'
import { mapItems } from '@/data/maps'
import { supporters } from '@/data/supporters'

interface Session {
  name: string
  at: string
}

const SESSION_KEY = 'ncs:session'

const route = useRoute()
const mode = computed(() => (route.meta.authMode === 'register' ? 'register' : 'login'))

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirm: '',
  remember: false,
})

const errors = reactive<Record<string, string>>({})
const showPassword = ref(false)
const submitting = ref(false)
const feedback = ref('')
const failed = ref(false)
const session = ref<Session | null>(readSession())

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function clearErrors(): void {
  for (const key of Object.keys(errors)) delete errors[key]
}

watch(mode, () => {
  clearErrors()
  feedback.value = ''
  failed.value = false
})

function validate(): boolean {
  clearErrors()

  if (form.username.trim().length < 2) {
    errors.username = '用户名至少需要 2 个字符'
  }

  if (mode.value === 'register') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = '请输入有效的邮箱地址'
    }
    if (form.password.length < 6) {
      errors.password = '密码至少需要 6 位'
    }
    if (form.confirm !== form.password) {
      errors.confirm = '两次输入的密码不一致'
    }
  } else if (form.password.length < 1) {
    errors.password = '请输入密码'
  }

  return Object.keys(errors).length === 0
}

function submit(): void {
  if (submitting.value) return
  feedback.value = ''
  failed.value = false

  if (!validate()) return

  submitting.value = true
  window.setTimeout(() => {
    submitting.value = false

    if (mode.value === 'register') {
      feedback.value = '注册成功！演示模式不会连接服务器，账号信息仅保存在本机浏览器。'
      form.password = ''
      form.confirm = ''
      return
    }

    const user: Session = {
      name: form.username.trim(),
      at: new Date().toISOString(),
    }
    session.value = user
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } catch {
      failed.value = true
      feedback.value = '当前浏览器无法写入本地存储，登录状态不会被保存。'
      return
    }
    feedback.value = `欢迎回来，${user.name}！`
  }, 650)
}

function logout(): void {
  session.value = null
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  feedback.value = '已退出演示登录状态。'
}

const statsPreview = computed(() => [
  { label: '地图作品', value: `${mapItems.length}+` },
  { label: '投喂伙伴', value: `${supporters.length}` },
  { label: '成立年份', value: `${studioStats[0]?.value ?? 2017}` },
])
</script>

<template>
  <div class="page auth">
    <div class="container auth__grid">
      <aside class="auth__aside">
        <span class="eyebrow">Member Area</span>
        <h1 class="auth__heading">
          欢迎来到<br />
          <span class="text-gradient">夜十字工作室</span>
        </h1>
        <p class="auth__lead">
          这里是工作室的成员入口。账号系统目前以演示形式运行，未来会用于地图更新推送与成员协作。
        </p>

        <ul class="auth__perks">
          <li>
            <span class="auth__perk-index mono">01</span>
            <span>第一时间获取新地图与更新公告</span>
          </li>
          <li>
            <span class="auth__perk-index mono">02</span>
            <span>参与工作室地图测试与反馈</span>
          </li>
          <li>
            <span class="auth__perk-index mono">03</span>
            <span>与 {{ supporters.length }} 位投喂伙伴一起支持工作室</span>
          </li>
        </ul>

        <dl class="auth__stats">
          <div v-for="item in statsPreview" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd class="mono">{{ item.value }}</dd>
          </div>
        </dl>

        <span class="auth__mark-wrap" aria-hidden="true">
          <img class="auth__mark only-dark" src="/img/brand-mark.png" alt="" />
          <img class="auth__mark only-light" src="/img/brand-mark-ink.png" alt="" />
        </span>
      </aside>

      <section class="auth__panel card">
        <div class="auth__tabs" role="tablist" aria-label="登录或注册">
          <RouterLink
            to="/login"
            class="auth__tab"
            :class="{ 'is-active': mode === 'login' }"
            role="tab"
            :aria-selected="mode === 'login'"
          >
            登录
          </RouterLink>
          <RouterLink
            to="/register"
            class="auth__tab"
            :class="{ 'is-active': mode === 'register' }"
            role="tab"
            :aria-selected="mode === 'register'"
          >
            注册
          </RouterLink>
        </div>

        <h2 class="auth__title">
          {{ mode === 'login' ? '登录工作室账号' : '创建你的账号' }}
        </h2>
        <p class="auth__sub">
          {{
            mode === 'login'
              ? '输入用户名与密码，回到你的方块世界。'
              : '填写以下信息，加入夜十字工作室的社区。'
          }}
        </p>

        <div v-if="session" class="auth__session">
          <span class="auth__session-icon" aria-hidden="true">✓</span>
          <div>
            <p class="auth__session-title">已登录为 {{ session.name }}</p>
            <p class="auth__session-note mono">
              本地演示会话 · {{ new Date(session.at).toLocaleString('zh-CN') }}
            </p>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" @click="logout">退出</button>
        </div>

        <form v-else class="auth__form" novalidate @submit.prevent="submit">
          <div class="field">
            <label class="field__label" for="auth-username">
              <span>{{ mode === 'login' ? '用户名 / 邮箱' : '用户名' }}</span>
            </label>
            <input
              id="auth-username"
              v-model="form.username"
              class="input"
              type="text"
              autocomplete="username"
              placeholder="请输入用户名"
              :aria-invalid="Boolean(errors.username)"
              :aria-describedby="errors.username ? 'err-username' : undefined"
              @input="delete errors.username"
            />
            <p v-if="errors.username" id="err-username" class="field__error">
              {{ errors.username }}
            </p>
          </div>

          <div v-if="mode === 'register'" class="field">
            <label class="field__label" for="auth-email"><span>注册邮箱</span></label>
            <input
              id="auth-email"
              v-model="form.email"
              class="input"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :aria-invalid="Boolean(errors.email)"
              :aria-describedby="errors.email ? 'err-email' : undefined"
              @input="delete errors.email"
            />
            <p v-if="errors.email" id="err-email" class="field__error">{{ errors.email }}</p>
          </div>

          <div class="field">
            <label class="field__label" for="auth-password"><span>密码</span></label>
            <div class="auth__password">
              <input
                id="auth-password"
                v-model="form.password"
                class="input"
                :type="showPassword ? 'text' : 'password'"
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                :placeholder="mode === 'login' ? '请输入密码' : '至少 6 位字符'"
                :aria-invalid="Boolean(errors.password)"
                :aria-describedby="errors.password ? 'err-password' : undefined"
                @input="delete errors.password"
              />
              <button
                type="button"
                class="auth__eye"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '隐藏' : '显示' }}
              </button>
            </div>
            <p v-if="errors.password" id="err-password" class="field__error">
              {{ errors.password }}
            </p>
          </div>

          <div v-if="mode === 'register'" class="field">
            <label class="field__label" for="auth-confirm"><span>确认密码</span></label>
            <input
              id="auth-confirm"
              v-model="form.confirm"
              class="input"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="请再次输入密码"
              :aria-invalid="Boolean(errors.confirm)"
              :aria-describedby="errors.confirm ? 'err-confirm' : undefined"
              @input="delete errors.confirm"
            />
            <p v-if="errors.confirm" id="err-confirm" class="field__error">{{ errors.confirm }}</p>
          </div>

          <div class="auth__row">
            <label v-if="mode === 'login'" class="auth__checkbox">
              <input v-model="form.remember" type="checkbox" />
              <span>记住我</span>
            </label>
            <span v-else class="auth__hint">注册即表示同意工作室的社区约定</span>
            <button
              v-if="mode === 'login'"
              type="button"
              class="auth__forgot"
              @click="feedback = '找回密码功能将在账号系统正式上线后开放。'"
            >
              忘记密码？
            </button>
          </div>

          <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="submitting">
            {{ submitting ? '处理中…' : mode === 'login' ? '登录' : '注册' }}
          </button>

          <p class="auth__switch">
            <template v-if="mode === 'login'">
              还没有账号？
              <RouterLink to="/register">立即注册</RouterLink>
            </template>
            <template v-else>
              已有账号？
              <RouterLink to="/login">返回登录</RouterLink>
            </template>
          </p>
        </form>

        <p v-if="feedback" class="auth__feedback" :class="{ 'is-error': failed }" role="status">
          {{ feedback }}
        </p>

        <p class="form-alert auth__demo">
          <span aria-hidden="true">ⓘ</span>
          <span>
            当前为<strong>演示模式</strong>：账号与登录状态仅保存在本机浏览器，不会上传到任何服务器。
            工作室账号系统尚未正式开放。
          </span>
        </p>

        <div class="auth__foot">
          <RouterLink to="/" class="link-arrow">返回首页</RouterLink>
          <a :href="siteInfo.joinUrl" target="_blank" rel="noreferrer" class="link-arrow">
            加入 QQ 群
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  align-items: center;
}

.auth__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  width: 100%;
}

.auth__aside {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  max-width: 560px;
}

.auth__heading {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  margin-block: 0.35rem;
}

.auth__lead {
  max-width: 46ch;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  line-height: 1.9;
}

.auth__perks {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: var(--sp-4);
}

.auth__perks li {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  color: var(--text-dim);
  font-size: var(--fs-sm);
}

.auth__perk-index {
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  color: var(--accent-soft);
}

.auth__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--line);
}

.auth__stats dt {
  font-size: var(--fs-micro);
  letter-spacing: 0.12em;
  color: var(--text-mute);
}

.auth__stats dd {
  margin-top: 0.2rem;
  font-size: 1.15rem;
  color: var(--text);
}

.auth__mark-wrap {
  position: absolute;
  right: -6%;
  bottom: -22%;
  width: 260px;
  pointer-events: none;
}

.auth__mark {
  width: 100%;
  opacity: 0.1;
}

.auth__panel {
  width: 100%;
  max-width: 520px;
  margin-inline: auto;
  padding: clamp(1.4rem, 3vw, 2.2rem);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.auth__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
  padding: 0.3rem;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--glass-bg-weak);
}

.auth__tab {
  padding: 0.55rem 1rem;
  border-radius: var(--r-pill);
  text-align: center;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-mute);
  transition:
    color var(--dur-1) var(--ease-out),
    background-color var(--dur-2) var(--ease-out);
}

.auth__tab:hover {
  color: var(--text);
}

.auth__tab.is-active {
  color: var(--text);
  background: var(--grad-accent-soft);
  box-shadow: inset 0 0 0 1px var(--accent-border-soft);
}

.auth__title {
  font-size: var(--fs-h3);
}

.auth__sub {
  margin-top: -0.5rem;
  color: var(--text-mute);
  font-size: var(--fs-xs);
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.auth__password {
  position: relative;
}

.auth__password .input {
  padding-right: 4.2rem;
}

.auth__eye {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  padding: 0.4rem 0.6rem;
  border-radius: var(--r-sm);
  font-size: var(--fs-micro);
  color: var(--text-mute);
  transition: color var(--dur-1) var(--ease-out);
}

.auth__eye:hover {
  color: var(--accent-soft);
}

.auth__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.auth__checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dim);
  font-size: var(--fs-xs);
  cursor: pointer;
}

.auth__checkbox input {
  width: 15px;
  height: 15px;
  accent-color: var(--accent);
}

.auth__hint {
  font-size: var(--fs-micro);
  color: var(--text-mute);
}

.auth__forgot {
  font-size: var(--fs-xs);
  color: var(--accent-soft);
}

.auth__forgot:hover {
  text-decoration: underline;
}

.auth__switch {
  text-align: center;
  font-size: var(--fs-xs);
  color: var(--text-mute);
}

.auth__switch a {
  color: var(--accent-soft);
  font-weight: 600;
}

.auth__switch a:hover {
  text-decoration: underline;
}

.auth__feedback {
  padding: 0.75rem 1rem;
  border: 1px solid var(--success-border);
  border-radius: var(--r-md);
  background: var(--success-weak);
  color: var(--success);
  font-size: var(--fs-xs);
  line-height: 1.7;
}

.auth__feedback.is-error {
  border-color: var(--danger-border);
  background: var(--danger-weak);
  color: var(--danger);
}

.auth__demo {
  margin-top: 0.25rem;
}

.auth__session {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem;
  border: 1px solid var(--success-border);
  border-radius: var(--r-md);
  background: var(--success-weak);
}

.auth__session-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  border: 1px solid var(--success-border);
  color: var(--success);
}

.auth__session-title {
  font-size: var(--fs-sm);
}

.auth__session-note {
  margin-top: 0.2rem;
  font-size: var(--fs-micro);
  color: var(--text-mute);
}

.auth__session .btn {
  margin-left: auto;
}

.auth__foot {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-4);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--line);
  flex-wrap: wrap;
}

.auth__foot .link-arrow {
  font-size: var(--fs-xs);
}

@media (min-width: 1000px) {
  .auth__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  }

  .auth__panel {
    margin-inline: 0 auto;
  }
}

@media (max-width: 999px) {
  .auth__mark-wrap {
    display: none;
  }

  .auth__aside {
    max-width: none;
  }
}
</style>
