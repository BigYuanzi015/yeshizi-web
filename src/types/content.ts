/**
 * 内容数据契约：所有页面组件只依赖这些类型，数据文件（src/data/*）负责填充。
 * 这些内容全部来自 yeshizistudio.top 旧站备份，未做虚构扩写。
 */

/** 作品系列 */
export type MapSeries = 'philosophy' | 'prohibition' | 'other'

export interface MapItem {
  /** 稳定唯一键，如 'zhexue-1' */
  id: string
  /** 展示标题（去掉版本前缀后的正式名称） */
  title: string
  /** Minecraft 版本，如 '1.11.2'、'1.13'，未知则空字符串 */
  version: string
  /** 作者 */
  author: string
  /** 一句话简介 */
  intro: string
  /** 封面图，public 下的绝对路径，如 '/img/big_1.png' */
  image: string
  /** 下载地址（public/maplist 下的 zip），无资源则为 null */
  download: string | null
  /** 所属系列 */
  series: MapSeries
  /** 系列中文名，如 '哲学大冒险'、'禁令系列'、'其他作品' */
  seriesName: string
  /** 标签，如 ['解密', '单人', '坑爹'] */
  tags: string[]
  /** 是否首页精选 */
  featured?: boolean
}

export type NewsTone = 'logo' | 'milestone' | 'site'

export interface NewsItem {
  id: string
  title: string
  /** 展示日期，如 '2021/4/15' */
  date: string
  /** 可排序的 ISO 日期，如 '2021-04-15' */
  isoDate: string
  text: string
  image: string
  imageAlt: string
  tone: NewsTone
}

export type TimelineStageId = 'begin' | 'grow' | 'future'

export interface TimelineEvent {
  id: string
  /** 如 '2017/7/23' 或 '现在' */
  date: string
  /** 事件短标题，如 '工作室成立' */
  title: string
  desc: string
  /** 年表侧栏强调项 */
  highlight?: boolean
}

export interface TimelineStage {
  id: TimelineStageId
  /** '开始' / '发展' / '未来' */
  stage: string
  /** '2017 - 2018' */
  period: string
  summary: string
  events: TimelineEvent[]
}

export interface Supporter {
  /** 投喂者昵称 */
  name: string
  /** 金额（元） */
  amount: number
  /** 备注，可选 */
  note?: string
}

export type MemberGroup = 'leadership' | 'elders' | 'authors'

export interface Member {
  id: string
  /** 中文名/常用名，如 '冷焱' */
  name: string
  /** 游戏内 ID / 英文名，如 'leng__yan' */
  alias: string
  /** 身份，如 '现任室长'、'元老会成员'、'地图作者' */
  role: string
  group: MemberGroup
  /** 补充说明，如一技之长 */
  highlight?: string
}

export interface SiteInfo {
  /** '夜十字工作室' */
  name: string
  /** 'Noctu Crucis Studio' */
  nameEn: string
  /** 缩写 */
  shortName: string
  /** '欢迎您的加入！' */
  slogan: string
  /** '一个普普通通的MC工作室，一群人为了爱好而凑在一起的工作室，我们很小，但我们很努力！' */
  description: string
  /** '2017/7/23' */
  foundedAt: string
  /** QQ 群加入链接 */
  joinUrl: string
  /** B 站空间 */
  bilibili: string
  /** 微信公众号二维码图片路径 */
  wechatQr: string
  /** ICP 备案号 */
  icp: string
  /** 备案链接 */
  icpUrl: string
  /** 站内最后更新说明，如 '2021/8/18' */
  updatedAt: string
}

export interface StudioStat {
  label: string
  value: number
  suffix?: string
  /** 展示辅助说明 */
  hint: string
}
