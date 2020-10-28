<template>
  <div
    id="AppBar"
    :class="appBarClasses"
  >
    <div
      id="AppBarToolbar"
      class="toolbar"
    >
      <SideNavAction />
      <!--MaterialAction
        icon="burger"
        :action="toggle"
      /-->
      <h1 class="font-button">
        <router-link to="/">
          Pelilauta
        </router-link>
      </h1>
      <div class="spacer" />
      <MaterialAction
        :text="$t('action.toTopicList')"
        icon="topic"
        to="/stream/index"
      />
      <MaterialAction
        desktop
        to="/about"
        icon="about"
        text="About"
      />
      <MaterialAction
        v-if="showAdminTools"
        text="Admin"
        icon="admin"
        to="/admin"
      />
      <ProfileAction />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, inject } from 'vue'
import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'
import ProfileAction from './ProfileAction.vue'
import MaterialAction from '@/components/material/MaterialAction.vue'
import SideNavAction from '@/components/app/SideNavAction.vue'
export default defineComponent({
  components: {
    ProfileAction,
    MaterialAction,
    SideNavAction
  },
  setup () {
    const appBarClasses = ref({
      elevated: false
    })
    const { uid } = useAuthz()
    const { isAdmin } = useMeta()
    const showAdminTools = computed(() => {
      return isAdmin(uid.value)
    })
    const handleScroll = () => {
      if (window.scrollY > 0) appBarClasses.value.elevated = true
      else appBarClasses.value.elevated = false
    }
    onMounted(() => { window.addEventListener('scroll', handleScroll) })

    const toggle: CallableFunction = inject('toggleNav') as CallableFunction
    return { appBarClasses, showAdminTools, toggle }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBar
  position: fixed
  transition: box-shadow 0.8s
  box-shadow: none
  @include BoxShadow3()
  #AppBarToolbar
  &.elevated
    @include BoxShadow8()
  .font-button
    @include  TypeButton()
    line-height: 56px
    a
      color: white

</style>
