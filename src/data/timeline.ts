import type { TimelineStage } from '@/types/content'

/** 完整发展年表，忠实转录自旧站 index.html「关于我们」。 */
export const timelineStages: TimelineStage[] = [
  {
    id: 'begin',
    stage: '开始',
    period: '2017',
    summary:
      '2017 年 7 月 23 日，由室长 Joker 提出，四位元老共同创立夜十字工作室，第一部解密地图《失落的地城》定下了解密地图制作的路线。',
    events: [
      {
        id: 'founded',
        date: '2017/7/23',
        title: '夜十字工作室正式成立',
        desc: '由室长 Joker 提出，带领元老会成员：鸽圆 [CaiXiao_J]、烦鸟 [FN12]、有毒の贰比 [ArtyomX]，正式成立夜十字工作室 Noctu_Crucis_Studio，并展开地图制作工程。',
        highlight: true,
      },
      {
        id: 'first-map',
        date: '2017/7/23',
        title: '首部解密地图《失落的地城》',
        desc: '工作室推出第一部解密类地图《失落的地城》，从此定下了解密地图制作的路线。',
      },
    ],
  },
  {
    id: 'grow',
    stage: '发展',
    period: '2017 - 2021',
    summary:
      '新成员陆续加入、室长两度交接，两大代表作与商务合作让工作室走得更远；2021 年 4 月起，工作室完成整顿与品牌化。',
    events: [
      {
        id: 'lengyan-join',
        date: '2017/8/18',
        title: '冷焱加入工作室',
        desc: '冷焱加入工作室，并保持活跃，后经元老会一经商议，加入元老会。',
      },
      {
        id: 'xiaoye-join',
        date: '2018/8/10',
        title: '小叶加入工作室',
        desc: '小叶加入工作室，后因多种良性原因，加入元老会。至此，工作室一直投入解密地图制作的工作之中。',
      },
      {
        id: 'leader-joker-to-geyuan',
        date: '—',
        title: '室长交接：Joker → 鸽圆',
        desc: '后因室长 Joker 个人原因，将室长转让给鸽圆，由鸽圆带领工作室继续前进。',
      },
      {
        id: 'leader-geyuan-to-lengyan',
        date: '—',
        title: '室长交接：鸽圆 → 冷焱',
        desc: '但后来又因为种种原因，室长转让给冷焱。',
      },
      {
        id: 'two-series',
        date: '—',
        title: '两大代表作系列成型',
        desc: '《哲学大冒险》：由作者有毒の贰比带领，一直以高质量的关卡制作等精心准备的单人向闯关地图，自发布以来备受好评。《禁令系列》/《禁令大冒险》：由作者冷焱带领，在第二部《禁令大冒险》前的所有地图制作都不太走心，后来开始转型为双人向闯关地图，并逐渐提高地图质量。',
        highlight: true,
      },
      {
        id: 'other-works',
        date: '—',
        title: '中间也诞生了优秀作品',
        desc: '如《BUG人生》（浅羽皓关）、《苍月岘城》（小莫）。',
      },
      {
        id: 'business',
        date: '—',
        title: '与两位主播达成商务合作',
        desc: '后来与两位主播达成了商务合作，使工作室有了资金来源，并制定了资金分配的规则，让参与制作的小伙伴们都会有佣金可取。',
      },
      {
        id: '2021-rectify',
        date: '2021/4/14',
        title: '工作室整顿与优化',
        desc: '由冷焱提出，元老会通过，开始对工作室进行了整顿和优化。',
      },
      {
        id: 'logo-rename',
        date: '2021/4/15',
        title: '确定新 LOGO 与英文名',
        desc: '夜十字工作室定制了专属 LOGO，并确定了最终的英文名：Noctu Crucis Studio。',
        highlight: true,
      },
      {
        id: 'website',
        date: '2021/4/19',
        title: '官方网站开始搭建',
        desc: '夜十字工作室官方网站正式开始搭建，正从简陋一步步走向精美。',
      },
      {
        id: 'mcbbs',
        date: '2021/5/28',
        title: '成立 MCBBS 创作者小组',
        desc: '夜十字工作室成立 MCBBS 创作者小组。',
      },
      {
        id: 'accounts',
        date: '2021/5/30',
        title: '账号矩阵搭建',
        desc: '冷焱创建了夜十字工作室微信公众号、QQ 号、B 站账号。',
      },
      {
        id: 'server',
        date: '2021/8/18',
        title: '工作室专用服务器上线',
        desc: '冷焱搭建了工作室专用永久的服务器，用于工作室的各种活动。',
        highlight: true,
      },
    ],
  },
  {
    id: 'future',
    stage: '未来',
    period: '现在',
    summary: '未来我们在路上……而这里需要你！',
    events: [
      {
        id: 'on-the-road',
        date: '现在',
        title: '未来我们在路上',
        desc: '未来我们在路上... 而这里需要你！欢迎加入夜十字工作室，一起把喜欢的事情继续做下去。',
        highlight: true,
      },
    ],
  },
]
