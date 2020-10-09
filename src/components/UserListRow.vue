<template>
  <td :class="rowClasses">
    <img
      v-if="photo"
      :src="photo"
      class="avatar"
    >
  </td>
  <td
    style="padding: 0 8px"
    :class="rowClasses"
  >
    {{ nick }}
  </td>
  <td :class="rowClasses">
    <MaterialButton
      v-if="!isMe && !isAdmin(uid) && !isFrozen(uid)"
      text
      :action="elevate"
    >
      Make admin
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && isAdmin(uid)"
      text
      class="alert"
      :action="revoke"
    >
      Revoke Admin
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && !isAdmin(uid) && !isFrozen(uid)"
      text
      :action="freeze"
    >
      Freeze
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && !isAdmin(uid) && isFrozen(uid)"
      text
      :action="defrost"
      class="warn"
    >
      Defrost
    </MaterialButton>
  </td>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useMeta } from '@/lib/meta'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthz } from '@/lib/authz'

interface UserListEntity {
  uid: string;
  nick: string;
  isMe: boolean;
  photoURL: string;
}

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
    const { isAdmin, isFrozen } = useMeta()
    const { uid: activeUid } = useAuthz()
    const isMe = computed(() => (props.uid === activeUid.value))

    const revoke = () => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.get().then((meta) => {
        if (meta.exists) {
          let admins: string[] = meta.data()?.admins
          if (admins) {
            admins = admins.filter((admin) => (admin !== props.uid))
          }
          if (admins.length > 0) metaRef.update({ admins: admins })
        }
      })
    }
    const elevate = () => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.get().then((meta) => {
        if (meta.exists) {
          const admins: string[] = meta.data()?.admins
          if (admins) {
            admins.push(props.uid)
          }
          if (admins.length > 0) metaRef.update({ admins: admins })
        }
      })
    }

    const defrost = () => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.get().then((meta) => {
        if (meta.exists) {
          let frozen: string[] = meta.data()?.frozen
          if (frozen) {
            frozen = frozen.filter((frozen) => (frozen !== props.uid))
          }
          metaRef.update({ frozen: frozen })
        }
      })
    }

    const freeze = () => {
      if (isAdmin(props.uid)) throw new Error('can not freeze an admin')
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.get().then((meta) => {
        if (meta.exists) {
          let frozen: string[] = meta.data()?.frozen
          if (!frozen) frozen = new Array<string>()
          if (frozen) {
            frozen.push(props.uid)
          }
          metaRef.update({ frozen: frozen })
        }
      })
    }

    const rowClasses = computed(() => {
      const classes = new Array<string>()
      if (isAdmin(props.uid)) classes.push('admin')
      else if (isFrozen(props.uid)) classes.push('frozen')
      return classes
    })

    return { isMe, isAdmin, revoke, elevate, freeze, defrost, isFrozen, rowClasses }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

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
  background-color: $color-secondary-light
  color: $color-primary-dark
.frozen
  background-color: lighten($color-primary-light, 32%)
  color: #666
.myself
  color: $color-primary
.material-button.alert
  color: rgb(255, 110, 69)
.material-button.warn
  color: rgb(240, 170, 23)
</style>
