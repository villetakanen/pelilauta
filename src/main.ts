import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useFirebase } from './lib/firebase'

useFirebase()

createApp(App).use(router).mount('#app')
