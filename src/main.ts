import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useFirebase } from './lib/firebase'

useFirebase()

const app = createApp(App)
app.use(router).mount('#app')
