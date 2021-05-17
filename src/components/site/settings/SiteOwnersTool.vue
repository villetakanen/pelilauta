<template>
  <div class="siteOwnersTool">
    <h1 class="title">
      {{ $t('site.settings.access.ownersToolTitle') }}
    </h1>
    <p class="tooltip">
      {{ $t('site.settings.access.ownersTooltip') }}
    </p>
    <div class="ownerChips">
      <OwnerChip
        v-for="o in site.owners"
        :key="o"
        :uid="o"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { Site } from '@/state/site'
import { Player } from '@/utils/uiInterfaces'
import { computed, ComputedRef, defineComponent, PropType } from 'vue'
import OwnerChip from './OwnerChip.vue'

interface Owner {
  uid: string
  nick: string
}

export default defineComponent({
  components: { OwnerChip },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: false,
      default: 1
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const owners:ComputedRef<Array<Owner>> = computed(() => (
      props.site.owners?.map((uid) => (
        {
          uid: uid,
          nick: authors.value.find((a) => (a.uid === uid))?.nick || 'anonymous'
        }
      )) || new Array<Player>()))
    return { owners }
  }
})
</script>
