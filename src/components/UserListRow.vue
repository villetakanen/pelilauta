<template>
  <td :class="rowClasses">
    <img
      v-if="photo"
      :src="photo"
      class="avatar"
      alt="Author's Avatar image"
    >
  </td>
  <td
    style="padding: 0 8px"
    :class="rowClasses"
  >
    {{ nick }}
  </td>
  <td
    style="padding: 0 8px"
    :class="rowClasses"
  >
    {{ lastLogin }}
  </td>
  <td :class="rowClasses">
    <MaterialButton
      v-if="!isMe && !isAdmin && !isFrozen"
      text
      :action="elevate"
    >
      Make admin
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && isAdmin"
      text
      class="alert"
      :action="revoke"
    >
      Revoke Admin
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && !isAdmin && !isFrozen"
      text
      :action="freeze"
    >
      Freeze
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && isFrozen"
      text
      :action="defrost"
      class="warn"
    >
      Defrost
    </MaterialButton>
  </td>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useMeta } from '@/state/meta'
import { doc, getDoc, getFirestore, updateDoc, query, getDocs, orderBy, collection, limit, where } from '@firebase/firestore'
import { useAuth } from '@/state/authz'
import { toDisplayString } from '@/utils/firebaseTools'

export default defineComponent({
  name: 'EditPost',
  components: {
    MaterialButton
  },
  props: {
    nick: {
      type: String,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { frozen, admins } = useMeta()
    const { user } = useAuth()
    const isMe = computed(() => (props.uid === user.value.uid))
    const isFrozen = computed(() => (frozen.value.includes(props.uid)))
    const isAdmin = computed(() => (admins.value.includes(props.uid)))

    const db = getFirestore()
    const metaRef = doc(db, 'meta', 'pelilauta')

    const revoke = () => {
      getDoc(metaRef).then((meta) => {
        if (meta.exists()) {
          let admins: string[] = meta.data()?.admins
          if (admins) {
            admins = admins.filter((admin) => (admin !== props.uid))
          }
          if (admins.length > 0) updateDoc(metaRef, { admins: admins })
        }
      })
    }
    const elevate = () => {
      getDoc(metaRef).then((meta) => {
        if (meta.exists()) {
          const admins: string[] = meta.data()?.admins
          if (admins) {
            admins.push(props.uid)
          }
          if (admins.length > 0) updateDoc(metaRef, { admins: admins })
        }
      })
    }

    const defrost = () => {
      getDoc(metaRef).then((meta) => {
        if (meta.exists()) {
          let frozen: string[] = meta.data()?.frozen
          if (frozen) {
            frozen = frozen.filter((f) => (f !== props.uid))
          }
          updateDoc(metaRef, { frozen: frozen })
        }
      })
    }

    const freeze = () => {
      if (isAdmin.value) throw new Error('Freezing an Admin user does not do anything, aborting.')
      getDoc(metaRef).then((meta) => {
        if (meta.exists()) {
          let frozen: string[] = meta.data()?.frozen
          if (!frozen) frozen = new Array<string>()
          if (frozen) {
            frozen.push(props.uid)
          }
          updateDoc(metaRef, { frozen: frozen })
        }
      })
    }

    const lastLogin = ref('')

    onMounted(() => {
      getDocs(
        query(collection(db, 'inbound'), orderBy('timestamp', 'desc'), limit(1), where('uid', '==', props.uid))
      ).then((snapshot) => {
        if (snapshot.size > 0) {
          lastLogin.value = toDisplayString(snapshot.docs[0].data()?.timestamp)
        }
      })
    })

    const rowClasses = computed(() => ({
      admin: isAdmin.value,
      frozen: isFrozen.value
    }))

    return { isMe, isAdmin, revoke, elevate, freeze, defrost, isFrozen, rowClasses, lastLogin }
  }
})
</script>

<style lang="sass" scoped>
.userlist
  table
    width: 100%
    border-collapse: collapse
    margin-bottom: 16px
  td
    border-bottom: solid 1px #ddd
.avatar
  height: 22px
  width: 22px
  border-radius: 11px
  margin: 0px 8px
  margin-top: 4px
.admin
  color: var(--chroma-primary-a)
.frozen
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
  color: #666
.myself
  color: var(--chroma-primary-d)
.material-button.alert
  color: rgb(255, 110, 69)
.material-button.warn
  color: rgb(240, 170, 23)
</style>
