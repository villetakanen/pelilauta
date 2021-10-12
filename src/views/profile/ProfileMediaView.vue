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
    <div class="singleColumnLayout">
      <ProfileAssetList />
    </div>
  </div>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import ProfileAssetList from '@/components/profile/assets/ProfileAssetList.vue'
import { useProfile } from '@/state/authz'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileMediaView',
  components: { ProfileAssetList, Header, ViewTitle },
  setup () {
    const { profile } = useProfile()
    return { profile }
  }
})
</script>
