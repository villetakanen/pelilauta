<template>
  <MaterialCard class="addPageCard">
    <h1>{{ $t('mekanismi.addPageCard.title') }}</h1>
    <TextField
      v-model="newPageTitle"
      :label="$t('mekanismi.addPageCard.newPageTitle')"
    />
    <p class="caption">
      {{ newPageUrl }}
    </p>
    <div class="cardToolbar toolbar">
      <div class="spacer" />
      <MaterialButton
        :text="true"
        :action="close"
      >
        {{ $t('action.cancel') }}
      </MaterialButton>
      <MaterialButton
        :disabled="!newPageTitle"
        :action="createPage"
      >
        {{ $t('action.create') }}
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import TextField from '../material/TextField.vue'
import MaterialButton from '../material/MaterialButton.vue'
import { Site, addPage } from '@/state/site'
import { useAuthState } from '@/state/authz'
import { toMekanismiURI } from '@/utils/contentFormat'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AddPageCard',
  components: {
    MaterialCard,
    TextField,
    MaterialButton
  },
  setup () {
    const newPageTitle = ref('')
    const newPageUrl = computed(() => (window.location.host + '/' + site.value.id + '/' + toMekanismiURI(newPageTitle.value)))
    const site = inject('site') as ComputedRef<Site>
    const close = inject('close') as CallableFunction
    const { uid } = useAuthState()
    const router = useRouter()

    function createPage () {
      addPage(uid.value, site.value.id, newPageTitle.value).then(() => {
        router.push('/mekanismi/edit/' + site.value.id + '/' + toMekanismiURI(newPageTitle.value)).then(() => {
          close()
        })
      })
    }

    return { newPageTitle, newPageUrl, close, createPage }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.addPageCard
  min-width: 50%
</style>
