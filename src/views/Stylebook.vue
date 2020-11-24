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
        <MaterialButton>Button</MaterialButton>
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
      </div>
      <div class="section">
        <h1>Stateless components</h1>
        <Loader />
      </div>
      <div class="section">
        <h1>Statefull components</h1>
        <Avatar nick="no-image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import Avatar from '@/components/app/Avatar.vue'
import Loader from '@/components/app/Loader.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialButton,
    Loader,
    ViewHeader,
    Avatar
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
  background-color: $color-fill-primary
.color2
  background-color: $color-fill-secondary
.color3
  background-color: white
</style>
