<template>
  <Column class="colorTheme">
    <h1>Colour</h1>
    <h2>Themes</h2>
    <p>Primary colors <span class="code">var(--chroma-primary-?)</span></p>
    <div class="scale primary">
      <div
        class="chosen a"
        @click="chosenColorVar = '--chroma-primary-a'"
      >
        A
      </div>
      <div
        class="b"
        @click="chosenColorVar = '--chroma-primary-b'"
      >
        B
      </div>
      <div
        class="c"
        @click="chosenColorVar = '--chroma-primary-c'"
      >
        C
      </div>
      <div
        class="chosen d"
        @click="chosenColorVar = '--chroma-primary-d'"
      >
        D
      </div>
      <div class="e">
        E
      </div>
      <div class="f">
        F
      </div>
      <div class="g">
        G
      </div>
      <div class="h">
        H
      </div>
      <div
        class="chosen i"
        @click="chosenColorVar = '--chroma-primary-i'"
      >
        I
      </div>
    </div>
    <p>Secondary colors <span class="code">var(--chroma-secondary-?)</span></p>
    <div class="scale secondary">
      <div
        class="chosen a"
        @click="chosenColorVar = '--chroma-secondary-a'"
      >
        A
      </div>
      <div class="b">
        B
      </div>
      <div class="c">
        C
      </div>
      <div
        class="chosen d"
        @click="chosenColorVar = '--chroma-secondary-d'"
      >
        D
      </div>
      <div class="e">
        E
      </div>
      <div class="f">
        F
      </div>
      <div
        class="chosen g"
        @click="chosenColorVar = '--chroma-secondary-g'"
      >
        G
      </div>
      <div
        class="chosen h"
        @click="chosenColorVar = '--chroma-secondary-h'"
      >
        H
      </div>
      <div
        class="chosen i"
        @click="chosenColorVar = '--chroma-secondary-i'"
      >
        I
      </div>
    </div>
    <p>Alert <span class="code">1: var(--chroma-alert), 2: var(--chroma-alert-field-tint)</span></p>
    <div class="scale alert">
      <div
        class="chosen base"
        @click="chosenColorVar = '--chroma-alert'"
      >
        1
      </div>
      <div
        class="chosen tint"
        @click="chosenColorVar = '--chroma-alert-field-tint'"
      >
        2
      </div>
    </div>
    <h2 style="margin-top:16px">
      In Action
    </h2>
    <div class="demoarea">
      <div class="one">
        <h4 :style="`color: var(${chosenColorVar})`">
          Title
        </h4>
        <p :style="`color: var(${chosenColorVar})`">
          color: var({{ chosenColorVar }})<br>
          background-color: white
        </p>
      </div>
      <div
        class="two"
        :style="`background-color: var(${chosenColorVar})`"
      >
        <h4>Title</h4>
        <p>
          color: #002337<br>
          background-color: var({{ chosenColorVar }})
        </p>
      </div>
      <div
        class="three"
        :style="`background-color: var(${chosenColorVar})`"
      >
        <h4>Title</h4>
        <p>
          color: white<br>
          background-color: var({{ chosenColorVar }})
        </p>
      </div>
      <div class="four">
        <h4 :style="`color: var(${chosenColorVar})`">
          Title
        </h4>
        <p :style="`color: var(${chosenColorVar})`">
          color: var({{ chosenColorVar }})<br>
          background-color: #002337
        </p>
      </div>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column },
  setup () {
    const chosenColorVar = ref('--chroma-secondary-d')
    return { chosenColorVar }
  }
})
</script>

<style lang="sass" scoped>
.demoarea
  display: flex
  flex-wrap: wrap
  div
    width: 50%
    box-sizing: border-box
    padding: 8px
    &.one
      background-color: white
    &.three
      h4, p
       color: white
    &.four
      background-color: #002337
.scale
  display: flex
  gap: 4px
  div
    height: 44px
    width: 44px
    text-align: center
    line-height: 28px
    box-sizing: border-box
    border: solid 8px white
    &.chosen
      border: none
      line-height: 44px

.alert
  .base
    background-color: var(--chroma-alert)
  .tint
    background-color: var(--chroma-alert-field-tint)

.primary
  .a
    background-color: var(--chroma-primary-a)
    color: white
  .b
    background-color: var(--chroma-primary-b)
    color: white
  .c
    background-color: var(--chroma-primary-c)
    color: white
  .d
    background-color: var(--chroma-primary-d)
    color: white
  .e
    background-color: var(--chroma-primary-e)
    color: white
  .f
    background-color: var(--chroma-primary-f)
    color: white
  .g
    background-color: var(--chroma-primary-g)
    color: white
  .h
    background-color: var(--chroma-primary-h)
    color: #002337
  .i
    background-color: var(--chroma-primary-i)
    color: #002337

.secondary
  .a
    background-color: var(--chroma-secondary-a)
    color: white
  .b
    background-color: var(--chroma-secondary-b)
    color: white
  .c
    background-color: var(--chroma-secondary-c)
    color: white
  .d
    background-color: var(--chroma-secondary-d)
    color: white
  .e
    background-color: var(--chroma-secondary-e)
    color: white
  .f
    background-color: var(--chroma-secondary-f)
    color: white
  .g
    border: solid 1px var(--chroma-secondary-g) !important
  .h
    background-color: var(--chroma-secondary-h)
    color: #002337
  .i
    background-color: var(--chroma-secondary-i)
    color: #002337
</style>
