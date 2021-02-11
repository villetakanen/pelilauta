<template>
  <AdminActions title="Stylebook" />
  <div class="contentGrid">
    <div id="Stylebook">
      <div class="section">
        <div class="colorbox color1" />
        <div class="colorbox color2" />
        <div class="colorbox color3" />
        <div class="colorbox color4" />
        <div class="colorbox color5" />
      </div>
      <h1>Headline 1</h1>
      <h2>Headline 2</h2>
      <h3>Headline 3</h3>
      <h4>Headline 4</h4>
      <p class="materialButton">
        p class="materialButton"
      </p>
      <div class="section">
        <h1>Actions</h1>
        <MaterialButton :async-action="asyncWaitDemo">
          Button: Async
        </MaterialButton>
        <MaterialButton text>
          Button: text
        </MaterialButton>
        <MaterialButton dark>
          Button: dark
        </MaterialButton>
        <MaterialButton
          dark
          text
        >
          Button: dark text
        </MaterialButton>
        <MaterialButton
          icon
          color="tertiary"
        >
          <img
            src="@/assets/icons/share.svg"
            alt="share icon"
          >
        </MaterialButton>
        <MaterialButton
          icon
          color="tertiary"
        >
          <img
            src="@/assets/icons/edit.svg"
            alt="edit icon"
          >
        </MaterialButton>
        <Fab>+</Fab>
        <teleport to="#BottomFabsContainer">
          <Fab>
            <Icon
              name="pelilauta"
              color="dark"
            />
          </Fab>
          <Fab color="secondary">
            <Icon
              name="mekanismi"
              color="dark"
            />
          </Fab>
          <Fab color="tertiary">
            <Icon
              name="d6"
              color="dark"
            />
          </Fab>
        </teleport>

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
      </div>

      <!-- inputs -->
      <div class="section">
        <h1>Inputs</h1>
        <p>These inputs override default browser ones, with material style theming</p>
        <TextField label="<TextField>" />
        <MaterialCard>
          <p>The inputs are expexted to behave well within a Card</p>
          <TextField label="TextField inside a Card" />
        </MaterialCard>
      </div>

      <div class="section">
        <h1>Cards</h1>
        <div style="display:flex">
          <MaterialCard>
            <h1>Headline 1</h1>
            <h2>Headline 2</h2>
            <h3>Headline 3</h3>
            <h4>Headline 4</h4>
          </MaterialCard>
          <MaterialCard>
            <ol>
              <li>
                list item
                <ol>
                  <li>secondary</li>
                </ol>
              </li>
            </ol>
          </MaterialCard>
        </div>
      </div>
      <div class="section">
        <h1>Stateless components</h1>
        <Loader />
        <Loader poster />
      </div>
      <div class="section">
        <h1>Statefull components</h1>
        <Avatar nick="no-image" />
        <MaterialButton :action="sendSnack">
          Push a snack to the stack
        </MaterialButton>
        <MaterialButton :action="sendSnacks">
          Push 3 snacks to the stack
        </MaterialButton>
      </div>
      <div class="section">
        <h1>Inputs</h1>
        <Toggle v-model="toggle" /> <span color="red">{{ toggle }}</span>
        <Toggle label="aaa" />
        <hr>
        <Pill>Chip</Pill>
        <Pill action-icon="add">
          Chip with Add Icon
        </Pill>
        <Pill action-icon="remove">
          Chip with Remove Icon
        </Pill>
        <Pill
          color="secondary"
          action-icon="remove"
        >
          Secondary chip with Remove Icon
        </Pill>
        <hr>
        <TextField />
        <TextField label="label" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Avatar from '@/components/app/Avatar.vue'
import Loader from '@/components/app/Loader.vue'
import TextField from '@/components/material/TextField.vue'
import Pill from '@/components/material/Pill.vue'
import { useSnack } from '@/composables/useSnack'
import Fab from '@/components/material/Fab.vue'
import Icon from '@/components/material/Icon.vue'
import Toggle from '@/components/material/Toggle.vue'
import Action from '@/components/material/Action.vue'
import AdminActions from '@/components/admin/AdminActions.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialButton,
    Loader,
    Avatar,
    MaterialCard,
    TextField,
    Pill,
    Fab,
    Icon,
    Toggle,
    Action,
    AdminActions
  },
  setup () {
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
    return { sendSnack, asyncWaitDemo, toggle, sendSnacks }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.section
  padding-top: 8px
  margin-top: 7px
  border-top: solid 3px #12002337

.colorbox
  height: 72px
  width: 72px
  border-radius: 36px
  margin: 8px
  display: inline-block
.colorbox+.colorbox
  margin-left:-22px
.color1
  background-color: $color-fill-primary-dark
.color2
  background-color: $color-fill-primary
.color3
  background-color: $color-fill-primary-light
.color4
  background-color: $color-fill-secondary
.color5
  background-color: $color-fill-tertiary
</style>
