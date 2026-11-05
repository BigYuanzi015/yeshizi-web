import { onBeforeUnmount, onMounted, ref } from 'vue'

/** 页面滚动进度（0 - 1），用于顶部进度条 */
export function useScrollProgress() {
  const progress = ref(0)
  const scrolled = ref(false)
  const y = ref(0)

  function update(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
    y.value = window.scrollY
    scrolled.value = window.scrollY > 12
  }

  let frame = 0
  function onScroll(): void {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      update()
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (frame) cancelAnimationFrame(frame)
  })

  return { progress, scrolled, y }
}
