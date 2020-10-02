import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useFirebase } from './lib/firebase'

useFirebase()

const app = createApp(App)
app.use(router)

app.directive('ripple', {
  beforeMount (el, binding, vnode) {
    // console.log(el, binding, vnode)
    el.onmousedown = function (e: MouseEvent) {
      const x = e.pageX - el.getBoundingClientRect().x // el.offsetLeft
      const y = e.pageY - el.getBoundingClientRect().y // el.offsetTop
      const w = this.offsetWidth

      // console.log(el.offsetTop, el.offsetLeft, el.getBoundingClientRect())

      const ripple = document.createElement('span')

      ripple.className = 'materialRippleEffect'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.style.setProperty('--scale', w)

      el.appendChild(ripple)

      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple)
      }, 500)
    }
  }
})

app.mount('#app')
