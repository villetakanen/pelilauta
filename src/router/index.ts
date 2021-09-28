import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StreamTopic from '@/views/StreamTopic.vue'
import Stylebook from '@/views/Stylebook.vue'
import { useSite, usePage } from '@/state/site'
import { useAuth } from '@/state/authz'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search/results',
    name: 'Search',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SearchResults.vue')
  },
  {
    path: '/login',
    name: 'login',
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
    path: '/profile/media',
    name: 'profile.media',
    component: () => import(/* webpackChunkName: "global" */ '../views/profile/ProfileMediaView.vue')
  },
  {
    path: '/profile/inbox',
    name: 'profile.inbox',
    component: () => import(/* webpackChunkName: "global" */ '../views/profile/ProfileInboxView.vue')
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
    path: '/u/:uid/characters',
    name: 'profile.characters',
    props: true,
    component: () => import(/* webpackChunkName: "profile" */ '../views/profile/CharacterListingView.vue')
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
    path: '/thread/:threadid/view',
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/ViewThread.vue'),
    props: true,
    name: 'threads.view',
    children: [
      {
        path: 'from/:since',
        component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/ViewThread.vue'),
        props: true,
        name: 'threads.view.from'
      }
    ]
  },
  {
    path: '/thread/:threadid/edit',
    name: 'threads.edit',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/EditThreadView.vue'),
    props: true
  },
  {
    path: '/stream/add/thread',
    name: 'threads.create',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/EditThreadView.vue'),
    props: false
  },
  {
    path: '/stream/topic/:topic/post',
    name: 'stream.topic.post',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "threads" */ '../views/pelilauta/EditThreadView.vue'),
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
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/wiki/WikiIndex.vue'),
    name: 'mekanismi'
  },
  {
    path: '/wiki/changes',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/wiki/RecentChanges.vue'),
    name: 'wiki.changes'
  },
  {
    path: '/site/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/ViewPage.vue'),
    props: (route) => ({ siteid: route.params.siteid, pageid: route.params.siteid }),
    name: 'mekanismi.site'
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
    path: '/site/:siteid/page/new',
    component: () => import(/* webpackChunkName: "sites" */ '../views/site/AddPageView.vue'),
    props: true,
    name: 'site.page.new'
  },
  {
    path: '/site/:siteid/thread/new',
    component: () => import(/* webpackChunkName: "sites" */ '../views/pelilauta/EditThreadView.vue'),
    props: true,
    name: 'site.page.new'
  },
  {
    path: '/site/:siteid/page/edit/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/wiki/EditPage.vue'),
    props: true,
    name: 'mekanismi.edit'
  },
  {
    path: '/site/:siteid/page/:pageid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/ViewPage.vue'),
    props: true,
    name: 'site.page'
  },
  {
    path: '/site/meta/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/SiteMetaView.vue'),
    props: true,
    name: 'mekanismi.siteinfo'
  },
  {
    path: '/site/settings/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/SiteSettingsView.vue'),
    props: true,
    name: 'mekanismi.sitesettings'
  },
  {
    path: '/site/attachments/:siteid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/SiteAssetsView.vue'),
    props: true,
    name: 'mekanismi.attachments'
  },
  {
    path: '/site/:siteid/character/:characterid',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/CharacterSheetView.vue'),
    props: true,
    name: 'site.character.view'
  },
  {
    path: '/mekanismi/create',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/mekanismi/CreateSite.vue'),
    props: true,
    name: 'mekanismi.create.site'
  },
  {
    path: '/mekanismi/sites/profile',
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/profile/SiteListingView.vue'),
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
  },
  // Site: create-an-entity routes
  {
    name: 'site.add.page',
    path: '/site/:siteid/add/page',
    props: true,
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/site/AddPageView.vue')
  },
  {
    name: 'site.add.thread',
    path: '/site/:siteid/add/thread',
    props: true,
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/pelilauta/EditThreadView.vue')
  },
  // Site: Page (c)RUD routes
  {
    name: 'site.page.edit',
    path: '/site/:siteid/page/:pageid/edit',
    props: true,
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/wiki/EditPage.vue')
  },
  // Character related routes
  {
    name: 'character.view',
    path: '/character/:id',
    props: true,
    component: () => import(/* webpackChunkName: "mekanismi" */ '../views/characters/CharacterView.vue')
  },
  {
    name: 'site.keeper.view',
    path: '/site/:siteid/keeper',
    props: true,
    component: () => import(/* webpackChunkName: "site" */ '../views/site/Keeper.vue')
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

router.beforeEach((to, from, next) => {
  if (to.name && to.name.toString().startsWith('mekanismi')) {
    const id = Array.isArray(to.params.siteid) ? to.params.siteid[0] : to.params.siteid || ''
    useSite(id)
    // If we have a page id we need to pull from FB, we pull it to state here
    const pageid = Array.isArray(to.params.pageid) ? to.params.pageid[0] : to.params.pageid || ''
    usePage(pageid)
  }

  // Logged in only routes!
  const { showMemberTools } = useAuth()
  if (AUTH_ROUTES.includes(to.name?.toString() || '') && !showMemberTools.value) {
    next({ name: 'Login' })
  }
  // next!
  next()
})

export default router
