<template>
  <Column class="SiteOwnersTool">
    <h1 class="title">
      {{ $t('site.settings.ownerstool.title') }}
    </h1>
    <p
      class="TypeCaption"
      style="font-style: italic; padding-bottom: 12px"
    >
      {{ $t('site.settings.ownerstool.description') }}
    </p>
    <hr>
    <div
      v-for="owner in site.owners"
      :key="owner"
    >
      <AuthorTag :uid="owner" />
      <Button
        :disabled="!showSiteAdminTools"
        text
        @click="revokeOwner(owner)"
      >
        {{ $t('action.delete') }}
      </Button>
    </div>
    <hr>
    <div class="addOwner">
      <Select
        v-model="newOwnerId"
        name="ownerSelector"
        :disabled="!showSiteAdminTools"
        :opts="available"
        :label="$t('site.settings.ownerstool.addNew')"
      />
      <Button
        :disabled="!showSiteAdminTools"
        secondary
        @click="add()"
      >
        {{ $t('action.add') }}
      </Button>
    </div>
  </Column>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { useSite } from '@/state/site'
import { computed, defineComponent, onMounted, ref } from 'vue'
import AuthorTag from '@/components/author/AuthorTag.vue'
import Button from '@/components/form/Button.vue'
import Select from '@/components/form/Select.vue'
import Column from '@/components/layout/Column.vue'

export default defineComponent({
  components: { Column, AuthorTag, Button, Select },
  setup () {
    const newOwnerId = ref('')
    const { site, showSiteAdminTools, addOwner, revokeOwner } = useSite()
    const { subscribeToAuthors, nonFrozenAuthors } = useAuthors()
    onMounted(() => subscribeToAuthors())
    const available = computed(() => {
      if (!site.value.owners) return new Map()
      return new Map(nonFrozenAuthors.value.filter(author => {
        if (!site.value.owners) return false
        return !site.value.owners.includes(author.uid)
      }).map(author => {
        return [author.uid, author.nick]
      }))
    })

    function add () {
      addOwner(newOwnerId.value)
    }

    return { site, showSiteAdminTools, available, newOwnerId, add, revokeOwner }
  }
})
</script>

<style lang="sass" scoped>
.addOwner
  display: flex
  justify-content: space-between

</style>
