import type { SiteInfo, StudioStat } from '@/types/content'

/** 注意：内容由 data 任务负责完整转录；此处为开发期占位，保持类型完整。 */
export const siteInfo: SiteInfo = {
  name: '夜十字工作室',
  nameEn: 'Noctu Crucis Studio',
  shortName: 'NCS',
  slogan: '欢迎您的加入！',
  description:
    '一个普普通通的MC工作室，一群人为了爱好而凑在一起的工作室，我们很小，但我们很努力！',
  foundedAt: '2017/7/23',
  joinUrl:
    'https://qm.qq.com/cgi-bin/qm/qr?k=NCVQw6xayoDTORK4cxwOjNyufmyRU_f2&jump_from=webapi',
  bilibili: 'https://space.bilibili.com/631147200/',
  wechatQr: '/img/wx.jpg',
  icp: '黑ICP备2021002268号-1',
  icpUrl: 'https://beian.miit.gov.cn/',
  updatedAt: '2021/8/18',
}

export const studioStats: StudioStat[] = [
  { label: '成立年份', value: 2017, hint: '2017/7/23 至今' },
  { label: '地图作品', value: 30, suffix: '+', hint: '解谜 / 闯关 / 主城' },
  { label: '地图作者', value: 8, hint: '元老会与外部合作作者' },
  { label: '投喂伙伴', value: 10, hint: '感谢每一份支持' },
]
