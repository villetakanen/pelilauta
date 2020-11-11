<template>
  <div id="Stylebook">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Loader from '@/components/app/Loader.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialButton,
    Loader
  }
})
</script>

<style lang="sass" scoped>
.section
  padding-top: 8px
  margin-top: 7px
  border-top: solid 3px #12002337
</style>
