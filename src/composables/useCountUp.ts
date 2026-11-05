import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export interface CountUpOptions {
  /** 动画时长（ms），默认 1400 */
  duration?: number
}

export interface CountUpResult {
  /** 与 target() 返回数组一一对应的当前数值 */
  values: Ref<number[]>
}

/**
 * 大数字滚动：挂载后从 0 缓动到目标值。
 * - target 为 getter，保证拿到的是响应式派生后的最新值；
 * - 尊重 prefers-reduced-motion：直接展示最终值，不做动画；
 * - 组件卸载时取消动画帧。
 */
export function useCountUp(
  target: () => number[],
  options: CountUpOptions = {},
): CountUpResult {
  const duration = options.duration ?? 1400
  const values = ref<number[]>(target().map(() => 0))
  let frame = 0

  onMounted(() => {
    const targets = target()
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof requestAnimationFrame === 'undefined') {
      values.value = targets
      return
    }

    const startAt = performance.now()
    const tick = (now: number): void => {
      const progress = duration > 0 ? Math.min(1, (now - startAt) / duration) : 1
      // ease-out-cubic，收尾更自然
      const eased = 1 - Math.pow(1 - progress, 3)
      values.value = targets.map((item) => Number((item * eased).toFixed(2)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
  })

  return { values }
}
