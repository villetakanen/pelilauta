<template>
  <AdminActions title="Stylebook" />
  <main
    id="Stylebook"
    :class="layout"
  >
    <StylebookIntro
      v-if="!focus"
      v-model="layout"
    />
    <ColorTheme v-if="!focus" />
    <TextStyles v-if="!focus" />
    <Iconography v-if="!focus" />
    <ColumnsAndSections v-if="!focus" />
    <FormControls v-if="!focus" />
    <Components
      v-if="!focus || focus === 'Components'"
      v-model="focus"
    />
    <InteractiveElemets
      v-if="!focus || focus === 'InteractiveElemets'"
      v-model="focus"
    />
    <StatefullComponents v-if="!focus" />
    <ListComponents
      v-if="!focus || focus === 'ListComponents'"
      v-model="focus"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useSnack } from '@/composables/useSnack'
import AdminActions from '@/components/admin/AdminActions.vue'
import TextStyles from '@/components/stylebook/TextStyles.vue'
import StylebookIntro from '@/components/stylebook/StylebookIntro.vue'
import FormControls from '@/components/stylebook/FormControls.vue'
import Iconography from '@/components/stylebook/Iconography.vue'
import ColorTheme from '@/components/stylebook/ColorTheme.vue'
import InteractiveElemets from '@/components/stylebook/InteractiveElemets.vue'
import ColumnsAndSections from '@/components/stylebook/ColumnsAndSections.vue'
import StatefullComponents from '@/components/stylebook/StatefullComponents.vue'
import Components from '@/components/stylebook/Components.vue'
import ListComponents from '@/components/stylebook/ListComponents.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    AdminActions,
    TextStyles,
    StylebookIntro,
    FormControls,
    Iconography,
    ColorTheme,
    InteractiveElemets,
    ColumnsAndSections,
    StatefullComponents,
    Components,
    ListComponents
  },
  setup () {
    const focus = ref('')
    const layout = ref('dashBoardLayout')

    function sendSnack () {
      const { pushSnack } = useSnack()
      pushSnack({ topic: 'Example snack message', message: 'at ' + new Date().toString(), action: () => { window.alert('hey!') }, actionMessage: 'alert?' })
    }
    function sendSnacks () {
      const { pushSnack } = useSnack()
      pushSnack({ topic: 'a snack pushed' })
      pushSnack({ topic: 'a second snack pushed' })
      pushSnack({ topic: 'and finally, a third snack pushed' })
    }
    async function asyncWaitDemo () {
      return new Promise((resolve) => { setTimeout(() => resolve('done'), 3000) })
    }
    const toggle = ref(true)
    const selected = ref('a')
    return { sendSnack, asyncWaitDemo, toggle, sendSnacks, selected, layout, focus }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/box-shadow.sass

.section
  padding-top: 8px
  margin-top: 7px
  border-top: solid 1px var(--chroma-primary-d)

.colorbox
  height: 48px
  width: 48px
  border-radius: 24px
  margin: 8px
  display: inline-block
  text-align: center
  line-height: 48px
  color: var(--chroma-clear)
  &.light
    color: var(--chroma-secondary-a)
.colorbox+.colorbox
  margin-left:-16px
.rise1
  background-color: var(--chroma-clear)
  @include Rise1()
.rise2
  background-color: var(--chroma-clear)
  @include Rise2()
.rise3
  background-color: var(--chroma-clear)
  @include Rise3()
.rise4
  background-color: var(--chroma-clear)
  @include Rise4()
.z-1
  background-color: #004d62
  opacity: 0.11
.z-2
  background-color: #004d62
  opacity: 0.22
.z-3
  background-color: #004d62
  opacity: 0.33
.z-4
  background-color: #004d62
  opacity: 0.44
</style>
