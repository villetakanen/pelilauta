<template>
  <div
    class="viewTitle"
    :class="{ withIcon: icon && icon.length > 0 }"
  >
    <Icon
      v-if="icon"
      :name="icon"
    />
    <h2 v-if="parent">
      <router-link
        v-if="parentRoute"
        :to="parentRoute"
      >
        {{ parent }}
      </router-link>
      <template v-else>
        {{ parent }}
      </template>
    </h2>
    <h1><slot /></h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    parent: {
      type: String,
      required: false,
      default: ''
    },
    parentRoute: {
      type: String,
      required: false,
      default: ''
    }
  }
})
</script>
