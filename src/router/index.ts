// import { useAuthz } from '@/lib/authz'
// import { watch } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import StreamTopic from '@/views/StreamTopic.vue'
import Stylebook from '@/views/Stylebook.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/search/results',
    name: 'Search',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SearchDemo.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/styleguide',
    name: 'Stylebook',
    component: Stylebook,
    props: true
  },
  {
    path: '/stream/topic/:topic',
    name: 'StreamTopic',
    component: StreamTopic,
    props: true
  },
  {
    path: '/stream/index',
    name: 'StreamIndex',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/StreamIndex.vue'),
    props: true
  },
  {
    path: '/stream/view/:threadid',
    name: 'StreamView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewPost.vue'),
    props: true
  },
  {
    path: '/editortest',
    component: () => import(/* webpackChunkName: "about" */ '../views/Editortest.vue')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Administration.vue')
  },
  {
    path: '/admin/topics',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Topics.vue')
  },
  {
    path: '/mekanismi',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/WikiIndex.vue')
  },
  {
    path: '/mekanismi/view/:siteid/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/ViewPage.vue'),
    props: true
  },
  {
    path: '/mekanismi/edit/:siteid/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/EditPage.vue'),
    props: true
  },
  {
    path: '/mekanismi/siteinfo/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/SiteInfo.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior () {
    // always scroll to top
    return { top: 0 }
  }
})

/* const { missingProfile } = useAuthz()

router.beforeEach((to, from, next) => {
  if (missingProfile.value && to.name !== 'Register') next({ name: 'Register' })
  else next()
})

watch(missingProfile, (missing) => { if (missing) router.push('/register') }) */

export default router
