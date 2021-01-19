<template>
  <ViewHeader>STYLEBOOK</ViewHeader>
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
      </div>
      <div class="section">
        <h1>Statefull components</h1>
        <Avatar nick="no-image" />
        <MaterialButton :action="sendSnack">
          Push a snack to the stack
        </MaterialButton>
      </div>
      <div class="section">
        <h1>Inputs</h1>
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
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import Avatar from '@/components/app/Avatar.vue'
import Loader from '@/components/app/Loader.vue'
import TextField from '@/components/material/TextField.vue'
import Pill from '@/components/material/Pill.vue'
import { useSnack } from '@/composables/useSnack'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialButton,
    Loader,
    ViewHeader,
    Avatar,
    MaterialCard,
    TextField,
    Pill
  },
  setup () {
    function sendSnack () {
      const { pushSnack } = useSnack()
      pushSnack({ topic: 'Example snack message', message: 'at ' + new Date().toString(), action: () => { window.alert('hey!') } })
    }
    async function asyncWaitDemo () {
      return new Promise((resolve) => { setTimeout(() => resolve('done'), 3000) })
    }
    return { sendSnack, asyncWaitDemo }
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
