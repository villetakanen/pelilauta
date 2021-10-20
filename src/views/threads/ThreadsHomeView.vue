<template>
  <div class="ThreadsHomeView">
    <Header>
      <ViewTitle icon="discussion">
        {{ $t('threads.home.title') }}
      </ViewTitle>
    </Header>
    <main class="bookLayout">
      <section class="double-cut">
        -- 5 newest threads --
      </section>
      <section class="double-cut">
        -- 5 most commented threads --
      </section>
      <section class="double-cut">
        -- 5 most liked threads --
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ThreadsHomeView',
  components: {
    Header,
    ViewTitle
  },
  setup () {
  }
})
</script>
