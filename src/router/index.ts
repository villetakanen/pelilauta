// import { useAuthz } from '@/lib/authz'
// import { watch } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import StreamTopic from '@/views/StreamTopic.vue'
import Stylebook from '@/views/Stylebook.vue'
import { useSite, usePage } from '@/state/site'
import { subscribeThread } from '@/state/threads/threads'

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
    path: '/stream/view2/:threadid',
    name: 'pelilauta.viewThread',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/ViewThread.vue'),
    props: true
  },
  {
    path: '/editortest',
    component: () => import(/* webpackChunkName: "about" */ '../views/Editortest.vue')
  },
  {
    path: '/admin',
    name: 'global.admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Administration.vue')
  },
  {
    path: '/admin/topics',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Topics.vue')
  },
  {
    path: '/mekanismi',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/WikiIndex.vue'),
    name: 'mekanismi'
  },
  {
    path: '/mekanismi/view/:siteid/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/ViewPage.vue'),
    props: true,
    name: 'mekanismi.view'
  },
  {
    path: '/mekanismi/edit/:siteid/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/EditPage.vue'),
    props: true,
    name: 'mekanismi.edit'
  },
  {
    path: '/mekanismi/siteinfo/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/SiteInfo.vue'),
    props: true,
    name: 'mekanismi.siteinfo'
  },
  {
    path: '/mekanismi/attachments/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/SiteAttachments.vue'),
    props: true,
    name: 'mekanismi.attachments'
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

router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.name && to.name.toString().startsWith('mekanismi')) {
    const id = Array.isArray(to.params.siteid) ? to.params.siteid[0] : to.params.siteid || ''
    console.log('routing to mekanismi', id)
    useSite(id)
    // If we have a page id we need to pull from FB, we pull it to state here
    const pageid = Array.isArray(to.params.pageid) ? to.params.pageid[0] : to.params.pageid || ''
    usePage(pageid)
  }
  // If we have a thread we need to pull from FB, we pull it to state here
  const threadid = Array.isArray(to.params.threadid) ? to.params.threadid[0] : to.params.threadid || ''
  subscribeThread(threadid)
  // next!
  next()
})

export default router
