// import { useAuthz } from '@/lib/authz'
// import { watch } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import StreamTopic from '@/views/StreamTopic.vue'
import Stylebook from '@/views/Stylebook.vue'
import { useSite, usePage } from '@/state/site'
import { subscribeThread } from '@/state/threads/threads'
import { useAuthState } from '@/state/authz'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    component: () => import(/* webpackChunkName: "global" */ '../views/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "global" */ '../views/profile/ProfileView.vue')
  },
  {
    path: '/u/:uid',
    name: 'profile.public',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "profile" */ '../views/profile/PublicProfileView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "global" */ '../views/Register.vue')
  },
  {
    path: '/stylebook',
    name: 'stylebook',
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
    path: '/stream/view/:threadid',
    name: 'stream.view',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewPost.vue'),
    props: true
  },
  {
    path: '/thread/:threadid/view',
    name: 'threads.view',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/ViewThread.vue'),
    props: true
  },
  {
    path: '/thread/:threadid/edit',
    name: 'threads.edit',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/EditThread.vue'),
    props: true
  },
  {
    path: '/stream/add/thread',
    name: 'threads.create',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/EditThread.vue'),
    props: { threadid: '', mode: 'new', topic: '' }
  },
  {
    path: '/stream/topic/:topic/post',
    name: 'stream.topic.post',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/EditThread.vue'),
    props: (route) => ({ threadid: '', mode: 'new', topic: route.params.topic })
  },
  {
    path: '/editortest',
    name: 'global.admin.editorTest',
    component: () => import(/* webpackChunkName: "about" */ '../views/Editortest.vue')
  },
  {
    path: '/admin',
    name: 'global.admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Administration.vue')
  },
  {
    path: '/admin/topics',
    name: 'global.admin.topics',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Topics.vue')
  },
  {
    path: '/mekanismi',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/WikiIndex.vue'),
    name: 'mekanismi'
  },
  {
    path: '/wiki/changes',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/RecentChanges.vue'),
    name: 'wiki.changes'
  },
  {
    path: '/mekanismi/view/:siteid/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/ViewPage.vue'),
    props: true,
    name: 'mekanismi.view'
  },
  {
    path: '/site/players/:siteid',
    component: () => import(/* webpackChunkName: "sites" */ '../views/site/SitePlayersView.vue'),
    props: true,
    name: 'site.players'
  },
  {
    path: '/mekanismi/edit/:siteid/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/wiki/EditPage.vue'),
    props: true,
    name: 'mekanismi.edit'
  },
  {
    path: '/site/meta/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/SiteMetaView.vue'),
    props: true,
    name: 'mekanismi.siteinfo'
  },
  {
    path: '/site/attachments/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/SiteAssetsView.vue'),
    props: true,
    name: 'mekanismi.attachments'
  },
  {
    path: '/mekanismi/create',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/CreateSite.vue'),
    props: true,
    name: 'mekanismi.create.site'
  },
  {
    path: '/mekanismi/sites/profile',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/ProfileSites.vue'),
    props: true,
    name: 'mekanismi.profile.sites'
  },
  {
    path: '/testing/login',
    component: () => import(/* webpackChunkName: "testing" */ '../views/admin/TestLoginView.vue'),
    props: false,
    name: 'testing.login'
  },
  {
    path: '/:catchAll(.*)',
    component: () => import(/* webpackChunkName: "global" */ '../views/404.vue')
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

const AUTH_ROUTES = ['Profile', 'mekanismi.profile.sites', 'threads.create']
const ADMIN_ROUTES = [
  'global.admin',
  'global.admin.topics',
  'global.admin.editorTest'
]

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

  // Logged in only routes!
  const { isAnonymous, isAdmin, uid } = useAuthState()
  if (AUTH_ROUTES.includes(to.name?.toString() || '') && (isAnonymous.value || !uid.value)) {
    next({ name: 'Login' })
  }
  if (ADMIN_ROUTES.includes(to.name?.toString() || '') && !isAdmin.value) {
    next({ name: 'Login' })
  }
  // next!
  next()
})

export default router
