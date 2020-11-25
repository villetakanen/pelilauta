<template>
  <div>
    <ViewHeader>
      {{ $t('mekanismi.title') + ' ' + routeSiteid + '/' + routePageid }}
    </ViewHeader>
    <div class="contentGrid">
      <div
        v-if="memberActions"
        class="toolbar"
      >
        <div class="spacer" />
        <MaterialButton :action="savePage">
          {{ $t('action.save') }}
        </MaterialButton>
      </div>
      <QuillEditor
        v-model="pageContent"
        :toolbar="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import QuillEditor from '@/components/quill/QuillEditor.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRoute, useRouter } from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useAuthState } from '@/state/authz'
import { useMembers } from '@/state/site'

export default defineComponent({
  name: 'EditPage',
  components: {
    ViewHeader,
    QuillEditor,
    MaterialButton
  },
  setup () {
    const pageContent = ref('')
    const { members } = useMembers()
    const { uid } = useAuthState()
    const memberActions = computed(() => (members.value.includes(uid.value)))

    const route = useRoute()
    const routePageid = computed(() => {
      return Array.isArray(route.params.pageid) ? route.params.pageid[0] : route.params.pageid
    })
    const routeSiteid = computed(() => {
      return Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid
    })

    let unsubscribe = () => {
    }

    function fetchPage () {
      unsubscribe()
      const db = firebase.firestore()
      const pageRef = db.collection('sites').doc(routeSiteid.value).collection('pages').doc(routePageid.value)
      unsubscribe = pageRef.onSnapshot((snap) => {
        if (snap.exists) {
          pageContent.value = snap.data()?.htmlContent
        }
      })
    }
    const router = useRouter()

    async function savePage () {
      const db = firebase.firestore()
      const pageRef = db.collection('sites').doc(routeSiteid.value).collection('pages').doc(routePageid.value)
      return pageRef.update({ htmlContent: pageContent.value }).then(() => {
        router.push(`/mekanismi/view/${routeSiteid.value}/${routePageid.value}`)
      })
    }

    onMounted(() => {
      fetchPage()
    })

    onUnmounted(() => {
      unsubscribe()
    })

    return { pageContent, routePageid, routeSiteid, memberActions, savePage }
  }
})
</script>

<style lang="sass" scoped>
.toolbar
  margin-bottom: 8px
</style>
