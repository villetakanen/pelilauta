<template>
  <AdminActions title="Stylebook" />
  <div>
    <div
      id="Stylebook"
      class="dashBoardLayout"
    >
      <Card>
        <h1>Chroma</h1>
        Primary
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-a)"
        >
          A
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-b)"
        >
          B
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-c)"
        >
          C
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-d)"
        >
          D
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-e)"
        >
          E
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-f)"
        >
          F
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-primary-g)"
        >
          G
        </div>
        <div
          class="colorbox light"
          style="background-color:var(--chroma-primary-h)"
        >
          H
        </div>
        <div
          class="colorbox light"
          style="background-color:var(--chroma-primary-i)"
        >
          I
        </div>
        <br>
        Secondary
        <div
          class="colorbox"
          style="background-color:var(--chroma-secondary-a)"
        >
          A
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-secondary-b)"
        >
          B
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-secondary-c)"
        >
          C
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-secondary-d)"
        >
          D
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-secondary-e)"
        >
          E
        </div>
        <div
          class="colorbox"
          style="background-color:var(--chroma-secondary-f)"
        >
          F
        </div>
        <div
          class="colorbox light"
          style="background-color:var(--chroma-secondary-g)"
        >
          G
        </div>
        <div
          class="colorbox light"
          style="background-color:var(--chroma-secondary-h)"
        >
          H
        </div>
        <div
          class="colorbox light"
          style="background-color:var(--chroma-secondary-i)"
        >
          I
        </div>
        <br>
        Alert
        <div
          class="colorbox"
          style="background-color:var(--chroma-alert)"
        >
          !
        </div>
        <br>
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
        <h1>Headline 1</h1>
        <p>And some text</p>
        <h2>Headline 2</h2>
        <p>And some text</p>
        <h3>Headline 3</h3>
        <p>And some text</p>
        <h4>Headline 4</h4>
        <p>And some text</p>
      </Card>
      <Card>
        <h1>Buttons</h1>
        <MaterialButton :async-action="asyncWaitDemo">
          Button
        </MaterialButton>
        <MaterialButton text>
          Text button
        </MaterialButton>
        <div style="background-color:var(--chroma-secondary-a);display: inline-block; margin: 0 4px; padding: 4px">
          <MaterialButton dark>
            Button on dark
          </MaterialButton>
          <MaterialButton
            dark
            text
          >
            Text button on dark
          </MaterialButton>
        </div>
        <br>
        Icon buttons
        <MaterialButton icon>
          <Icon name="send" />
        </MaterialButton>
        <div style="background-color:var(--chroma-secondary-a);display: inline-block; margin: 0 4px; padding: 4px">
          <MaterialButton dark>
            <Icon
              color="dark"
              name="send"
            />
          </MaterialButton>
        </div>
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

      <Card>
        <h1 class="title">
          Icons
        </h1>
        <Icon
          name="about"
          headline
        />
        <Icon
          name="add"
          headline
        />
        <Icon
          name="addAnImage"
          headline
        />
        <Icon
          name="addDiscussion"
          headline
        />
        <Icon
          name="admin"
          headline
        />
        <Icon
          name="attachments"
          headline
        />
        <Icon
          name="avatar"
          headline
        />
        <Icon
          name="books"
          headline
        />
        <Icon
          name="d6"
          headline
        />
        <Icon
          name="d12"
          headline
        />
        <Icon
          name="d20"
          headline
        />
        <Icon
          name="discussion"
          headline
        />
        <Icon
          name="dd-logo"
          headline
        />
        <Icon
          name="delete"
          headline
        />
        <Icon
          name="edit"
          headline
        />
        <Icon
          name="equalizer"
          headline
        />
        <Icon
          name="filter"
          headline
        />
        <Icon
          name="forum"
          headline
        />
        <Icon
          name="hidden"
          headline
        />
        <Icon
          name="homebrew-logo"
          headline
        />
        <Icon
          name="idea"
          headline
        />
        <Icon
          name="images"
          headline
        />
        <Icon
          name="lightbulb"
          headline
        />
        <Icon
          name="mekanismi"
          headline
        />
        <Icon
          name="monsters"
          headline
        />
        <Icon
          name="pages"
          headline
        />
        <Icon
          name="pathfinder-logo"
          headline
        />
        <Icon
          name="players"
          headline
        />
        <Icon
          name="remove"
          headline
        />
        <Icon
          name="report"
          headline
        />
        <Icon
          name="stats"
          headline
        />
        <Icon
          name="search"
          headline
        />
        <Icon
          name="send"
          headline
        />
        <Icon
          name="settings"
          headline
        />
        <Icon
          name="share"
          headline
        />
        <Icon
          name="quick-logo"
          headline
        />
        <Icon
          name="up"
          headline
        />
        <Icon
          name="youtube"
          headline
        />
      </Card>

      <div>
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
      </div>

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

      <!-- icons -->
      <div class="section">
        <Icon name="equalizer" />
        <Icon name="players" />
        <Icon name="filter" />
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
import { useSnack } from '@/composables/useSnack'
import Fab from '@/components/material/Fab.vue'
import Icon from '@/components/material/Icon.vue'
import Toggle from '@/components/material/Toggle.vue'
import Action from '@/components/material/Action.vue'
import AdminActions from '@/components/admin/AdminActions.vue'
import Card from '@/components/layout/Card.vue'
import MaterialSelect from '@/components/material/MaterialSelect.vue'
import Chip from '@/components/material/Chip.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialButton,
    Loader,
    Avatar,
    MaterialCard,
    TextField,
    Fab,
    Icon,
    Toggle,
    Action,
    AdminActions,
    Card,
    MaterialSelect,
    Chip
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
    const selected = ref('a')
    return { sendSnack, asyncWaitDemo, toggle, sendSnacks, selected }
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
</style>
