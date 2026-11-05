<script setup lang="ts">
import { computed } from 'vue'
import type { Member, MemberGroup } from '@/types/content'

const props = defineProps<{
  /** 成员列表，来自 src/data/members.ts */
  members: Member[]
}>()

interface GroupConfig {
  id: MemberGroup
  label: string
  labelEn: string
  desc: string
}

const GROUP_CONFIG: GroupConfig[] = [
  {
    id: 'leadership',
    label: '室长',
    labelEn: 'Leadership',
    desc: '从 Joker 到鸽圆再到冷焱，带领工作室一路向前的人。',
  },
  {
    id: 'elders',
    label: '元老会',
    labelEn: 'Elders',
    desc: '工作室的重要决定，由元老会一起商议决定。',
  },
  {
    id: 'authors',
    label: '地图作者',
    labelEn: 'Authors',
    desc: '把想法一块一块建进地图里的人。',
  },
]

const groups = computed(() =>
  GROUP_CONFIG.map((group) => ({
    ...group,
    members: props.members.filter((member) => member.group === group.id),
  })).filter((group) => group.members.length > 0),
)

/** 头像只使用名字首字符，不伪造任何成员照片 */
function initial(name: string): string {
  const chars = Array.from(name.trim())
  return chars[0]?.toUpperCase() ?? '·'
}

function roleTone(member: Member): string {
  if (member.group === 'leadership') return 'tag--accent'
  if (member.group === 'authors') return 'tag--gold'
  return ''
}
</script>

<template>
  <div class="member-wall">
    <div v-if="!members.length" class="empty">
      <span class="empty__glyph" aria-hidden="true">✦</span>
      <p class="empty__title">成员资料整理中</p>
      <p class="empty__text">旧站的成员介绍正在转录，稍后就能看到大家的名字。</p>
    </div>

    <section
      v-for="group in groups"
      :key="group.id"
      class="member-group"
      :aria-labelledby="`member-group-${group.id}`"
    >
      <header class="member-group__head">
        <div class="member-group__title-wrap">
          <p class="member-group__eyebrow mono">{{ group.labelEn }}</p>
          <h3 :id="`member-group-${group.id}`" class="member-group__title">
            {{ group.label }}
            <span class="member-group__count mono">{{ group.members.length }} 位</span>
          </h3>
        </div>
        <p class="member-group__desc">{{ group.desc }}</p>
      </header>

      <ul class="member-grid">
        <li
          v-for="(member, index) in group.members"
          :key="member.id"
          class="member card card--hover reveal"
          :class="`member--${member.group}`"
          :style="{ '--reveal-delay': `${Math.min(index, 8) * 60}ms` }"
        >
          <span class="member__avatar" aria-hidden="true">{{ initial(member.name) }}</span>
          <div class="member__body">
            <h4 class="member__name">
              {{ member.name }}
              <span class="member__alias mono">{{ member.alias }}</span>
            </h4>
            <p class="member__role">
              <span class="tag" :class="roleTone(member)">{{ member.role }}</span>
            </p>
            <p v-if="member.highlight" class="member__highlight">{{ member.highlight }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.member-wall {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3.25rem);
}

.member-group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.member-group__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-2) var(--sp-5);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--line);
}

.member-group__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.member-group__eyebrow {
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.member-group__title {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: var(--fs-h3);
}

.member-group__count {
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  color: var(--accent-soft);
}

.member-group__desc {
  max-width: 42ch;
  color: var(--text-dim);
  font-size: var(--fs-xs);
  line-height: 1.8;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: var(--sp-3);
}

.member {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem;
}

.member--leadership {
  border-color: var(--accent-border-soft);
}

.member__avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background:
    radial-gradient(circle at 30% 20%, var(--accent-weak), transparent 70%),
    var(--stat-bg);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 1.15rem;
  font-weight: 700;
}

.member--leadership .member__avatar {
  border-color: var(--accent-border);
  color: var(--accent-soft);
}

.member--authors .member__avatar {
  border-color: var(--gold-border);
  background:
    radial-gradient(circle at 30% 20%, var(--gold-weak), transparent 70%),
    var(--stat-bg);
  color: var(--gold);
}

.member__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.member__name {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  font-size: var(--fs-h4);
  line-height: 1.35;
}

.member__alias {
  font-size: var(--fs-micro);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-dim);
  overflow-wrap: anywhere;
}

.member__role .tag {
  white-space: normal;
}

/* 浅色主题下 --gold 落在 --gold-weak 底上对比度偏低，轻微压深保证可读 */
.member__role .tag--gold {
  color: color-mix(in srgb, var(--gold) 78%, var(--text));
}

.member__highlight {
  color: var(--text-dim);
  font-size: var(--fs-xs);
  line-height: 1.7;
  overflow-wrap: anywhere;
}
</style>
