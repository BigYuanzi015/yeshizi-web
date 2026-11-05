import { computed, readonly, ref } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ncs:theme'
const DARK_BROWSER_COLOR = '#05080f'
const LIGHT_BROWSER_COLOR = '#f2f6fc'

const theme = ref<Theme>(resolveInitial())
let initialized = false

function systemPrefersLight(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  )
}

function readSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function resolveInitial(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light') {
    return 'light'
  }
  return readSavedTheme() ?? (systemPrefersLight() ? 'light' : 'dark')
}

function applyTheme(next: Theme, options: { persist: boolean; animate: boolean }): void {
  const root = document.documentElement

  if (options.animate) {
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 420)
  }

  root.dataset.theme = next
  root.style.colorScheme = next

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', next === 'light' ? LIGHT_BROWSER_COLOR : DARK_BROWSER_COLOR)
  }

  if (options.persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* 无痕模式等场景忽略 */
    }
  }
}

/** 白天 / 黑夜主题：默认跟随系统，用户手动切换后记忆到 localStorage */
export function useTheme() {
  if (!initialized) {
    initialized = true
    applyTheme(theme.value, { persist: false, animate: false })

    // 未手动选择过时，跟随系统外观变化
    if (typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-color-scheme: light)')
      const onChange = (event: MediaQueryListEvent): void => {
        if (readSavedTheme()) return
        theme.value = event.matches ? 'light' : 'dark'
        applyTheme(theme.value, { persist: false, animate: true })
      }
      media.addEventListener('change', onChange)
    }
  }

  function setTheme(next: Theme, animate = true): void {
    theme.value = next
    applyTheme(next, { persist: true, animate })
  }

  function toggle(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: readonly(theme),
    isLight: computed(() => theme.value === 'light'),
    setTheme,
    toggle,
  }
}
