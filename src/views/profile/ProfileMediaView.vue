<template>
  <div class="profileMediaView">
    <Header>
      <ViewTitle
        icon="attachments"
        :parent="profile.nick"
        parent-route="/profile"
      >
        {{ $t('profile.media.title') }}
      </ViewTitle>
    </Header>
    <Button @click="addMediaDialog = true">
      -- add new media --
    </Button>
    <ProfileAssetList />
    <UploadAssetDialog v-model="addMediaDialog" />
  </div>
</template>

<script lang="ts">
import UploadAssetDialog from '@/components/assets/UploadAssetDialog.vue'
import Button from '@/components/form/Button.vue'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import ProfileAssetList from '@/components/profile/assets/ProfileAssetList.vue'
import { useProfile } from '@/state/authz'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileMediaView',
  components: { ProfileAssetList, Header, ViewTitle, Button, UploadAssetDialog },
  setup () {
    const { profile } = useProfile()
    const addMediaDialog = ref(false)
    return { profile, addMediaDialog }
  }
})
</script>
