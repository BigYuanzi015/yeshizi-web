# 夜十字工作室 · Noctu Crucis Studio 官网（2026 重构版）

基于旧站 `yeshizistudio.top` 备份内容重做的现代化官方网站：Vue 3 + TypeScript + Vite + vue-router，纯手写 CSS 设计系统，无 UI 框架。

> 一个普普通通的 MC 工作室，一群人为了爱好而凑在一起。我们很小，但我们很努力！

## 页面

| 路由 | 页面 | 内容 |
| --- | --- | --- |
| `/` | 首页 | 视觉主视觉、数据总览、新闻资讯、精选作品、发展历程、投喂榜预览、加入 CTA |
| `/maps` | 地图汇总 | 30 张地图，搜索 / 系列筛选 / 作者筛选 / 排序 / 仅看可下载 / 详情抽屉 |
| `/about` | 关于我们 | 工作室起源、完整发展年表（开始 / 发展 / 未来）、成员墙、加入方式 |
| `/supporters` | 投喂榜 | 10 位投喂者排行、累计金额、投喂说明 |
| `/login`、`/register` | 登录 / 注册 | 演示模式账号页（仅本地 `localStorage`，不连接服务器） |
| `*` | 404 | 失配兜底 |

## 技术要点

- **Vue 3.5 `<script setup>` + TypeScript**，`vue-router` 4 history 路由 + 按页懒加载。
- **设计系统**：`src/styles/tokens.css`（色板 / 间距 / 圆角 / 动效 / 字体）、`base.css`（重置与基线）、`utilities.css`（共享组件类）；页面仅使用令牌，不硬编码颜色。
- **白天 / 黑夜双主题**：全部颜色收敛为语义令牌，`<html data-theme="dark|light">` 一键切换；顶栏太阳/月亮按钮切换主题（移动端抽屉内也有入口），选择记忆在 `localStorage`，未手动选择时跟随系统外观；`index.html` 内联脚本在首屏绘制前应用主题，避免闪烁；切换时全站颜色平滑过渡（尊重 `prefers-reduced-motion`）。
- **深色玻璃拟态 + 夜色品牌视觉**：固定背景网格、呼吸光晕、噪点、扫描线，滚动进度条、随滚动视差、数字滚动、IntersectionObserver 逐段入场动效。
- **可访问性**：语义化标签、跳转链接、`focus-visible` 焦点环、抽屉/移动端导航的焦点与 ESC 处理、`prefers-reduced-motion` 降级。
- **响应式**：1440 / 1024 / 768 / 375 均验证；地图网格 4→3→2→1 列自适应。
- **内容数据化**：全部内容集中在 `src/data/`，页面纯数据驱动；类型契约在 `src/types/content.ts`。
- **品牌资源**：脚本 `scripts/build-assets.py` 从旧站 logo / 合影生成透明线稿标志、Hero 大图、OG 分享图。

## 内容来源与还原度

全部文案、地图、日期、投喂金额、成员与链接均来自旧站备份（`index.html`、`NCSMapList.html`、`list.html` 等），未虚构条目：

- 30 张地图，23 张可在站内直接下载（`public/maplist/*.zip`），7 张原站已无资源（封面使用旧站 LOGO 占位）。
- 图片全部来自旧站 `images/`，另生成了透明标志 `brand-mark.png` / `brand-cross.png`、`hero.jpg`、`og-cover.jpg`。
- 账号页在旧站只是前端表单，本版明确标注为「演示模式」，不发送任何请求。

## 开发

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run typecheck  # vue-tsc 类型检查
npm run build      # 类型检查 + 生产构建（输出 dist/）
npm run preview    # 预览生产构建 http://127.0.0.1:4173
```

## 部署

`npm run build` 后将 `dist/` 部署到任意静态服务器即可。history 路由需要把未知路径回退到 `index.html`：

- Nginx：`try_files $uri $uri/ /index.html;`
- Apache：`FallbackResource /index.html`
- Vercel / Netlify / Cloudflare Pages：默认 SPA 回退即可。

## 目录结构

```
src/
  components/
    layout/    AppHeader / AppFooter / SiteBackdrop
    maps/      MapCard（首页与地图页共用）、MapFilters、MapDetailDrawer
    about/     TimelineRail、MemberWall
    supporters/SupportLeaderboard
    ui/        SectionHeading
  composables/ useReveal / useSeo / useScrollProgress / useMapFilters / useCountUp
  data/        地图、新闻、年表、投喂榜、成员、站点信息
  pages/       Home / Maps / About / Supporters / Auth / NotFound
  router/      路由与滚动行为
  styles/      tokens / base / utilities
  types/       内容数据契约
public/
  img/         旧站图片与生成资源
  maplist/     地图压缩包
```
