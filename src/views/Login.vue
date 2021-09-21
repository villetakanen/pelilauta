<template>
  <div class="loginView singleColumnLayout">
    <EmailLoginForm />
    <SocialAuthCard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EmailLoginForm from '@/components/auth/EmailLoginForm.vue'
import SocialAuthCard from '@/components/auth/SocialAuthCard.vue'

export default defineComponent({
  components: {
    EmailLoginForm,
    SocialAuthCard
  }
})
</script>

<style lang="sass" scoped>
.loginView
  padding-top: 16px
</style>
