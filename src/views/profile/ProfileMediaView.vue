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
      <SpacerDiv />
      <UploadAssetButton />
    </Header>
    <ProfileAssetList />
  </div>
</template>

<script lang="ts">
import UploadAssetButton from '@/components/assets/UploadAssetButton.vue'
import Header from '@/components/layout/Header.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import ProfileAssetList from '@/components/profile/assets/ProfileAssetList.vue'
import { useProfile } from '@/state/authz'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileMediaView',
  components: { ProfileAssetList, Header, ViewTitle, UploadAssetButton, SpacerDiv },
  setup () {
    const { profile } = useProfile()
    const addMediaDialog = ref(false)
    return { profile, addMediaDialog }
  }
})
</script>
