<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    lead?: string
    row?: boolean
  }>(),
  { eyebrow: '', lead: '', row: false },
)
</script>

<template>
  <div class="section-head" :class="{ 'section-head--row': row }">
    <div class="section-head__body">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2 class="section-head__title">{{ title }}</h2>
      <p v-if="lead" class="section-head__lead">{{ lead }}</p>
    </div>
    <div v-if="$slots.actions" class="section-head__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.section-head__body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

@media (max-width: 720px) {
  .section-head {
    margin-bottom: var(--sp-6);
  }
}
</style>
