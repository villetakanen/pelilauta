<template>
  <div class="loginView singleColumnLayout">
    <EmailLoginForm />
    <SocialAuthCard />
    <p class="caption">
      <router-link to="/mekanismi/view/mekanismi/meta-privacy-info">
        {{ $t('login.emailLoginDataInfoLink') }}
      </router-link>
    </p>
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
@import @/styles/material-typography.sass

.loginView
  padding-top: 16px
  .caption
    @include TypeCaption()
    margin-top: 8px
    border-top: solid 1px var(--color-b-f)
    padding: 0 8px
    padding-top: 7px
    margin-bottom: 16px !important
    a
      text-decoration: none
</style>
