<template>
  <AdminActions title="Stylebook" />
  <div
    id="Stylebook"
    :class="layout"
  >
    <StylebookIntro v-model="layout" />
    <ColumnsAndSections />
    <ColorTheme />
    <TextStyles />
    <Iconography />
    <FormControls />
    <InteractiveElemets />
    <Card>
      Rises
      <div
        class="colorbox rise1 light"
      >
        1
      </div>
      <div
        class="colorbox rise2 light"
      >
        2
      </div>
      <div
        class="colorbox rise3 light"
      >
        3
      </div>
      <div
        class="colorbox rise4 light"
      >
        4
      </div>
    </Card>
    <Card>
      <h2>
        Actions
      </h2>
      <Action
        to="stylebook"
        prepend="d6"
      >
        And some text
      </Action>
      <Action to="stylebook">
        The second
      </Action>
      <Action
        append="avatar"
        to="stylebook"
      >
        And Third
      </Action>
      <Action
        prepend="dd-logo"
        to="stylebook"
      />
      <h2>Fabs</h2>
      <div style="display: flex; flex-wrap: wrap; flex-direction: row-reverse">
        <Fab
          text="Fab"
          icon="forum"
        />
        <Fab
          text="Secondary"
          secondary
          icon="send"
        />
        <Fab
          text="Tertiary"
          tertiary
          icon="up"
        />
      </div>
      <div style="display: flex; flex-wrap: wrap; flex-direction: row-reverse; padding-top:8px">
        <Fab
          text="Dark"
          dark
          icon="avatar"
        />
      </div>
    </Card>

    <teleport to="#BottomFabsContainer">
      <Fab
        text="Pelilauta"
        dark
        icon="pelilauta"
      />
      <Fab
        secondary
        icon="d6"
      />
      <Fab
        icon="edit"
      />
    </teleport>

    <!-- inputs -->
    <div class="section">
      <h1>Inputs</h1>
      <p>These inputs override default browser ones, with material style theming</p>
      <TextField
        label="<TextField error>"
        error
      />
      <div class="toolbar">
        <p>And they work in a toolbar</p>
        <TextField label="TextField inside a toolbar" />
      </div>
      <Card>
        <p>And are expected to behave well within a Card</p>
        <TextField label="TextField inside a Card" />
      </Card>
      <h2>Toggle buttons</h2>
      <Toggle v-model="toggle" /> <span color="red">{{ toggle }}</span>
      <Toggle label="aaa" />
      <h2>Select</h2>
      <MaterialSelect
        label="example label"
        :opts="[{ key: 'a', value: 'b'}]"
      />
      <MaterialSelect
        v-model="selected"
        label="error example"
        error
        :opts="[{ key: 'a', value: 'this value is erroneous'}]"
      />

      <h2>Chips</h2>
      <Chip label="A Chip!" />
      <Chip
        icon="dd-logo"
        label="With an icon!"
      />
      <Chip
        icon="quick-logo"
        label="Secondary colors"
        secondary
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TextField from '@/components/material/TextField.vue'
import { useSnack } from '@/composables/useSnack'
import Fab from '@/components/material/Fab.vue'
import Toggle from '@/components/material/Toggle.vue'
import Action from '@/components/material/Action.vue'
import AdminActions from '@/components/admin/AdminActions.vue'
import Card from '@/components/layout/Card.vue'
import MaterialSelect from '@/components/material/MaterialSelect.vue'
import Chip from '@/components/material/Chip.vue'
import TextStyles from '@/components/stylebook/TextStyles.vue'
import StylebookIntro from '@/components/stylebook/StylebookIntro.vue'
import FormControls from '@/components/stylebook/FormControls.vue'
import Iconography from '@/components/stylebook/Iconography.vue'
import ColorTheme from '@/components/stylebook/ColorTheme.vue'
import InteractiveElemets from '@/components/stylebook/InteractiveElemets.vue'
import ColumnsAndSections from '@/components/stylebook/ColumnsAndSections.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    TextField,
    Fab,
    Toggle,
    Action,
    AdminActions,
    Card,
    MaterialSelect,
    Chip,
    TextStyles,
    StylebookIntro,
    FormControls,
    Iconography,
    ColorTheme,
    InteractiveElemets,
    ColumnsAndSections
  },
  setup () {
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
    return { sendSnack, asyncWaitDemo, toggle, sendSnacks, selected, layout }
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
