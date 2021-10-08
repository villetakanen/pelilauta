<template>
  <div class="loginView">
    <MainHeader>
      <h3>
        <Icon name="pelilauta" />
        {{ $t('action.login') }}
      </h3>
    </MainHeader>
    <div class="bookLayout">
      <Column class="double-cut">
        <EmailLoginForm />
        <SocialAuthCard />
        <section>
          <p class="caption">
            <router-link to="/mekanismi/view/mekanismi/meta-privacy-info">
              {{ $t('login.emailLoginDataInfoLink') }}
            </router-link>
          </p>
        </section>
      </Column>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EmailLoginForm from '@/components/auth/EmailLoginForm.vue'
import SocialAuthCard from '@/components/auth/SocialAuthCard.vue'
import Column from '@/components/layout/Column.vue'
import Icon from '@/components/material/Icon.vue'
import MainHeader from '@/components/layout/MainHeader.vue'

export default defineComponent({
  components: {
    EmailLoginForm,
    SocialAuthCard,
    Column,
    Icon,
    MainHeader
  }
})
</script>
