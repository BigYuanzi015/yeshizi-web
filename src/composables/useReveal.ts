import { onBeforeUnmount, onMounted } from 'vue'

/**
 * 全站滚动入场动效：给任意元素加 class="reveal" 即可，
 * 元素进入视口后自动追加 .is-visible；动态渲染（路由懒加载、筛选、分页）的元素也会被自动接管。
 * 可用 style="--reveal-delay: 90ms" 做错峰。
 */
const REVEAL_SELECTOR = '.reveal:not(.is-visible)'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null
let scanQueued = false

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(REDUCE_QUERY).matches
}

function show(el: Element): void {
  el.classList.add('is-visible')
  io?.unobserve(el)
}

function scan(): void {
  const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)

  if (prefersReducedMotion()) {
    elements.forEach(show)
    return
  }

  if (!io) return
  elements.forEach((el) => io!.observe(el))
}

function scheduleScan(): void {
  if (scanQueued) return
  scanQueued = true
  requestAnimationFrame(() => {
    scanQueued = false
    scan()
  })
}

export function useReveal(): void {
  onMounted(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) show(entry.target)
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      )
    }

    scan()

    // 异步路由组件 / 筛选结果等在挂载后新增的 .reveal 元素同样需要接管。
    mo = new MutationObserver(scheduleScan)
    mo.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    mo?.disconnect()
    io?.disconnect()
    mo = null
    io = null
  })
}
