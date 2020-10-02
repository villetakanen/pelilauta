import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useFirebase } from './lib/firebase'

useFirebase()

const app = createApp(App)
app.use(router)

app.directive('ripple', {
  beforeMount (el) {
    el.onmousedown = function (e: MouseEvent) {
      let offset = [0, 0] // x = 0, y = 1
      // If position is relative, we can use local co-ordinates
      // If it is fixed, we need to pull calculate them from window scroll and
      // el.getBoundingClientRect
      const parentPosition = window.getComputedStyle(el, null).getPropertyValue('position')
      if (parentPosition === 'relative') {
        offset = [
          el.offsetLeft, // x
          el.offsetTop // y
        ]
      } else {
        offset = [
          el.getBoundingClientRect().x + window.scrollX, // x
          el.getBoundingClientRect().y + window.scrollY // y
        ]
      }
      const x = e.pageX - offset[0] // x
      const y = e.pageY - offset[1] // y
      const w = this.offsetWidth

      // console.log(offset, window.scrollY, el.offsetTop, el.offsetLeft, el.getBoundingClientRect())

      const ripple = document.createElement('span')

      ripple.className = 'materialRippleEffect'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.style.setProperty('--scale', w)

      el.appendChild(ripple)

      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple)
      }, 800)
    }
  }
})

app.mount('#app')
