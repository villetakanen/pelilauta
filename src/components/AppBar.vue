<template>
  <div
    id="AppBar"
    :class="appBarClasses"
  >
    <div
      id="AppBarToolbar"
      class="toolbar"
    >
      <SideNav v-if="false" />
      <MaterialAction
        to="/"
      />
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
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'
import ProfileAction from './ProfileAction.vue'
import MaterialAction from '@/components/material/MaterialAction.vue'
import SideNav from '@/components/app/SideNav.vue'
export default defineComponent({
  components: {
    ProfileAction,
    MaterialAction,
    SideNav
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
    return { appBarClasses, showAdminTools }
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
