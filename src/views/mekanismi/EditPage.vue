<template>
  <div>
    <transition name="fade">
      <div
        v-if="site.name && page.name"
        class="mekanismiGrid"
      >
        <MaterialCard class="mainCard">
          <PageToolbar />
          <QuillEditor
            v-model="pageContent"
            :toolbar="true"
          />
          <div class="toolbar cardActions">
            <div class="spacer" />
            <MaterialButton
              :to="`/mekanismi/view/${site.id}/${page.id}`"
              :text="true"
            >
              {{ $t('action.cancel') }}
            </MaterialButton>
            <MaterialButton :action="savePage">
              {{ $t('action.save') }}
            </MaterialButton>
          </div>
        </MaterialCard>
        <PageMeta class="sideCard" />
      </div>
    </transition>
    <teleport to="#AppBarSubmenu">
      <MekanismiBar />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch } from 'vue'
import { usePages, useSite, fetchPage, updatePage } from '@/state/site'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'
import QuillEditor from '@/components/quill/QuillEditor.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRoute, useRouter } from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useAuthState } from '@/state/authz'
import { extractLinks, extractTags } from '@/utils/contentFormat'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageMeta from '@/components/wikipage/PageMeta.vue'
import MekanismiBar from '@/components/app/MekanismiBar.vue'

export default defineComponent({
  name: 'EditPage',
  components: {
    PageToolbar,
    QuillEditor,
    MaterialButton,
    MaterialCard,
    PageMeta,
    MekanismiBar
  },
  setup () {
    const { site } = useSite()
    const { page, pages } = usePages()
    const { uid } = useAuthState()
    const router = useRouter()

    const pageContent = ref('')

    const route = useRoute()

    provide('site', site)
    provide('page', page)
    provide('pages', pages)

    watch(() => route.params, (r) => {
      const id = Array.isArray(r.siteid) ? r.siteid[0] : r.siteid || ''
      // subscribeTo(id)

      const pid = Array.isArray(r.pageid) ? r.pageid[0] : r.pageid || ''
      fetchPage(pid || id)
    }, { immediate: true })

    watch(page, (val) => {
      pageContent.value = val.htmlContent
    }, { immediate: true })

    async function savePage () {
      const db = firebase.firestore()
      const { formattedContent: pc } = extractLinks(pageContent.value)
      const { formattedContent, tags } = extractTags(pc)
      return updatePage({
        id: page.value.id,
        siteid: page.value.siteid,
        author: uid.value,
        htmlContent: formattedContent
      }).then(() => {
        router.push(`/mekanismi/view/${page.value.siteid}/${page.value.id}`)
        tags.forEach((tag) => {
          const tagRef = db.collection('tags').doc(tag)
          const taggedRef = tagRef.collection('tagged').doc(page.value.id)
          taggedRef.set({
            type: 'wikipage',
            title: page.value.name
          })
        })
      })
    }

    return { page, site, pageContent, savePage }
  }
})
</script>

<style lang="sass">
.mekanismiGrid
  .toolbar
    margin-bottom: 8px
  #editor
    max-width: 700px
</style>
