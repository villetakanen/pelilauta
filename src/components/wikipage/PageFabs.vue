<template>
  <teleport to="body">
    <div class="pageFabs">
      <Fab>
        <Icon
          name="add"
          :text="$t('actions.add')"
        />
      </Fab>
      <Fab>
        <Icon
          name="edit"
          :text="$t('actions.create')"
          color="secondary"
        />
      </Fab>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Fab from '../material/Fab.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'PageFabs',
  components: {
    Fab,
    Icon
  },
  setup () {}
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

@include media('>tablet')
  .pageFabs
    position: fixed
    position: fixed
    bottom: 16px
    right: 16px
    z-index: 20000
    display: block
    button+button
      margin-left: 16px

@include media('<=tablet')
  .pageFabs
    position: fixed
    bottom: 16px
    right: 16px
    z-index: 20000
    display: block
    button+button
      margin-left: 16px

</style>
