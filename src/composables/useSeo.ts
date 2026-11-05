import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const SITE_NAME = '夜十字工作室 · Noctu Crucis Studio'
const DEFAULT_DESC =
  '一个普普通通的 Minecraft 工作室，一群人为了爱好而凑在一起。我们很小，但我们很努力！'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** 随路由更新 title / description / og 信息 */
export function useSeo(): void {
  const route = useRoute()

  watchEffect(() => {
    const title = (route.meta.title as string | undefined) ?? SITE_NAME
    const desc = (route.meta.description as string | undefined) ?? DEFAULT_DESC

    document.title = title === SITE_NAME ? title : `${title} - ${SITE_NAME}`

    setMeta('meta[name="description"]', 'name', 'description', desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta(
      'meta[property="og:url"]',
      'property',
      'og:url',
      `${window.location.origin}${route.fullPath}`,
    )
  })
}
