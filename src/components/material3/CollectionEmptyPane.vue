<template>
  <section class="CollectionEmptyPane">
    <h1>{{ title }}</h1>
    <div class="iconFrame chroma-box-2">
      <Icon
        class="collectionIcon"
        :name="icon"
        xlarge
      />
    </div>
    <p v-if="message">
      {{ message }}
    </p>
    <Toolbar class="centered">
      <slot />
    </Toolbar>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Icon, Toolbar },
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup () {

  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

section.CollectionEmptyPane
  text-align: center
  padding: 12px
  margin: 0 auto
  h1
    @include TypeHeadline5()
    color: var(--chroma-primary-d)
  div.iconFrame
    height: 128px
    width: 128px
    padding: 12px
    border-radius: 80px
    margin: 0 auto
  .collectionIcon
    opacity: 0.5
</style>
