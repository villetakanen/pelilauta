<template>
  <div class="AuthorTag">
    <suspense>
      <template #default>
        <ResolvedAuthorTag :uid="uid" />
      </template>
      <template #fallback>
        <div class="loader">
          <img
            alt="..."
            src="@/assets/animations/puff-dark.svg"
          >
        </div>
      </template>
    </suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ResolvedAuthorTag from './ResolvedAuthorTag.vue'

export default defineComponent({
  name: 'AuthorLink',
  components: { ResolvedAuthorTag },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  setup () {
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.AuthorTag
  display: inline-block
  margin: 0
  padding: 0
  height: 24px

.loader
  @include TypeBody2
  line-height: 20px
  height: 20px
  margin: 0px
  padding: 2px 10px
  border-radius: 12px
  background-color: var(--chroma-secondary-i)
  color: var(--chroma-secondary-d)
  font-weight: bold
  display: inline-block
  overflow: hidden
</style>
