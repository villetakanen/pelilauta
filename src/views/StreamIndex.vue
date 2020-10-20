<template>
  <div>
    <MaterialCard
      v-for="(topic, index) in topics"
      :key="index"
      class="topic-card"
    >
      <img
        v-if="topic.icon === 'discussion'"
        class="topic-icon"
        src="@/assets/discussion.svg"
      >
      <img
        v-if="topic.icon === 'd20'"
        class="topic-icon"
        src="@/assets/d20.svg"
      >
      <img
        v-if="!topic.icon"
        class="topic-icon"
        src="@/assets/notopic.svg"
      >
      <h1>
        <router-link :to="`/stream/topic/${topic.slug}`">
          {{ topic.title }}
        </router-link>
      </h1>
      <p v-if="topic.description">
        {{ topic.description }}
      </p>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialCard
  },
  setup () {
    const { topics } = useMeta()
    onMounted(() => {
      document.title = 'Pelilauta - Index'
    })
    return { topics }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.topic-card
  position: relative
  min-height: 72px
  .topic-icon
    position: absolute
    top: 8px
    right: 8px
    height: 48px
    width: 48px
    background-color: $color-secondary-light
    border-radius: 50%
</style>
