<template>
  <h1>Admin</h1>
  <MaterialCard>
    <p>
      <router-link to="/editortest">
        Editor testing page.
      </router-link>
    </p>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'Admin',
  components: {
    MaterialCard
  }
})
</script>
