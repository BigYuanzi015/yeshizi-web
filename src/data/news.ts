import type { NewsItem } from '@/types/content'

export const newsItems: NewsItem[] = [
  {
    id: 'rename',
    title: 'Noctu Crucis Studio！！！',
    date: '2021/4/15',
    isoDate: '2021-04-15',
    text: '我们改名字啦！由最开始的 YeShiZi Studio 正式更名为 Noctu Crucis Studio！感谢我们可爱的老室长 Joker，也感谢工作室的各位的努力！！！',
    image: '/img/logo.jpg',
    imageAlt: '现用 logo',
    tone: 'logo',
  },
  {
    id: 'founded',
    title: '夜十字工作室成立！',
    date: '2017/7/23',
    isoDate: '2017-07-23',
    text: '我们出生啦！初始成员虽然只有 4 人，但我们年轻，我们还在成长！',
    image: '/img/logo_2.jpg',
    imageAlt: '最初的工作室 logo',
    tone: 'milestone',
  },
]
