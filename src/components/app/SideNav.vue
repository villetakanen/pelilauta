<template>
  <div
    id="sideNav"
    :class="{ toggled: modelValue }"
  >
    <div class="menuHeader">
      <MaterialButton
        :action="toggleNav"
        icon
        text
        class="back"
      >
        <img src="@/assets/icons/action-back-light.svg">
      </MaterialButton>
      <div class="avatar">
        <img src="@/assets/fox.svg">
      </div>
      <h1>{{ $t('sideNav.title') }}</h1>
    </div>
    <div class="menu-container">
      <ul>
        <li>
          <router-link to="/stream/index">
            <img src="@/assets/icons/action-about.svg">
            {{ $t('sideNav.toIndexRoute') }}
          </router-link>
          <ul>
            <li
              v-for="(topic, index) in topics"
              :key="index"
              class="topicLink"
              @click="toggle"
            >
              <router-link
                :to="`/stream/topic/${topic.slug}`"
              >
                <img
                  v-if="topic.icon === 'discussion'"
                  class="topicIcon"
                  src="@/assets/discussion.svg"
                >
                <img
                  v-if="topic.icon === 'd20'"
                  class="topicIcon"
                  src="@/assets/d20.svg"
                >
                <img
                  v-if="!topic.icon"
                  class="topicIcon"
                  src="@/assets/notopic.svg"
                >
                {{ topic.title }}
              </router-link>
            </li>
          </ul>
        </li>
        <li @click="toggle">
          <router-link to="/about">
            <img src="@/assets/icons/action-about.svg">
            {{ $t('sideNav.toAboutRoute') }}
          </router-link>
        </li>
        <li
          v-if="isAdmin"
          @click="toggle"
        >
          <router-link to="/admin">
            <img src="@/assets/icons/action-admin.svg">
            {{ $t('sideNav.toAdminRoute') }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
// import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useMeta } from '@/lib/meta'
import { useProfile } from '@/state/authz'

export default defineComponent({
  name: 'SideNav',
  components: {
    MaterialButton
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup () {
    const { isAdmin } = useProfile()
    const toggleNav: CallableFunction = inject('toggleNav') as CallableFunction
    const toggle = () => {
      if (window.innerWidth < 768) toggleNav()
    }
    const { topics } = useMeta()
    return { toggle, topics, toggleNav, isAdmin }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#sideNav
  position: fixed
  top: 0
  left: 0
  width: 400px
  height: 100vh
  transition: transform 0.3s ease-in-out
  @include BoxShadow3()
  background-color: $color-base
  .menuHeader
    background: linear-gradient(151deg, $color-primary-dark 0%, $color-primary 23%, $color-primary-light 100%)
    position: relative
    height: 192px
    .avatar
      position: absolute
      top: 16px
      left: 16px
      z-index: 1
      img
        height: 160px
        width: 160px
    .back
      float: right
      margin-top: 8px
      margin-right: 8px
    h1
      @include TypeHeadline5()
      position: absolute
      bottom: 16px
      right: 16px
      color: $color-base
      opacity: 0.8
  .menuHeader:after
    content: ""
    position: absolute
    bottom: 0
    left: 0
    width: 0
    height: 0
    border-bottom: 200px solid $color-secondary-light
    border-right: 120px solid transparent
    opacity: 0.2
  ul
    margin: 0
    padding: 0px
    ul
      margin-left: 8px
      border-left: 4px solid opacify($color-base-darker, 0.5)
      padding-left: 4px
    li
      @include TypeButton()
      margin: 0
      padding: 8px 16px
      list-style-type: none
      a
        text-decoration: none
        color: $color-font-medium
      img
        height: 24px
        width: 24px
        vertical-align: middle
        margin-right: 8px
      &:hover
        background-color: $color-secondary-light

.topicCard
  margin: 16px
  position: relative
  min-height: 24px
  padding-left: 32px
  h1
    @include TypeHeadline6()
  p
    margin: 0
    padding: 0
  .topicIcon
    position: absolute
    top: 0px
    left: 0px
    height: 24px
    width: 24px
    background-color: $color-secondary-light
    border-radius: 50%

.topicCard + .topicCard
  border-top: solid 1px $color-primary-light
  padding-top: 16px
  .topicIcon
    top: 16px

@include media('>=tablet')
  #sideNav
    &.toggled
      transform: translateX(-400px)
    .menuHeader
      margin-top: 56px
    .back
      display: none

@include media('<tablet')
  #sideNav
    width: 100vw
    z-index: 1000
    transform: translateX(-100vw)
    &.toggled
      transform: translateX(0px)

// deprecated from here on

.menu-action
  height: 56px
  padding: 8px 0
  a
    margin: 0
    padding: 0
  img
    height: 40px
    width: 40px
    &:active
     transform: scale(.95)
#sidebar-nav
  position: absolute
  z-index: 3
  top: 0
  left: 0
  height: 100vh
  width: 400px
  transform: translateX(-400px)
  transition: transform 0.3s ease-in-out
  background-color: $color-base
  .menu-header
    background-color: $color-primary-light
    padding: 8px
    .back
      float: right
    .avatar
      border-radius: 48px
      height: 96px
      width: 96px
      background-color: $color-primary-dark
      img
        height: 82px
        width: 82px
        margin: 8px
  .menu-container
    padding: 8px
    ul
      margin: 0
      padding: 0
    li
      @include TypeButton()
      list-style-type: none
      margin: 0
      padding: 0
      height: 48px
      color: $color-font-medium
      &:hover
        background-color: $color-base-darker
      img
        height: 40px
        vertical-align: middle

  &:target
    transform: translateX(0px)
    // box-shadow: (-4px) 0 12px 6px shadow
    + #nav-screen-overlay
      display: block
      pointer-events: auto
      opacity: 0.3

#nav-screen-overlay
  display: block
  position: fixed
  top: 0
  left: 0
  margin: 0
  padding: 0
  z-index: 2
  height: 100vh
  width: 100vw
  background-color: $color-primary-dark
  opacity: 0
  cursor: default
  pointer-events: none
  transition: opacity 0.5s ease-in-out
</style>
