import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Cookies from "js-cookie"

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    meta: {
      title: 'Login',
      requiresAuth: false,
    }
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/Register.vue"),
    meta: {
      title: 'Register',
      requiresAuth: false,
    }
  },
  {
    path: "/",
    name: "searches",
    component: () =>
      import(/* webpackChunkName: "searches" */ "@/views/Searches.vue"),
    meta: {
      title: 'Searches',
      requiresAuth: true,
    }
  },
  {
    path: "/add-search",
    name: "addSearch",
    component: () =>
      import(/* webpackChunkName: "add-search" */ "@/views/AddSearch.vue"),
    meta: {
      title: "New Search",
      requiresAuth: true,
    }
  },
  {
    path: "/edit-search",
    name: "editSearch",
    props: true,
    component: () =>
      import(/* webpackChunkName: "edit-search" */ "@/views/EditSearch.vue"),
    meta: {
      title: 'Edit Search',
      requiresAuth: true,
    }
  },
  {
    path: "/search-results",
    name: "searchResults",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "search-results" */ "@/views/SearchResults.vue"),
    meta: {
      title: 'Search Results',
      requiresAuth: true,
    }
  },
  {
    path: "/search-history",
    name: "searchHistory",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "search-history" */ "@/views/SearchHistory.vue"),
    meta: {
      title: 'Search History',
      requiresAuth: true,
    }
  },
  {
    path: "/newsletters",
    name: "newsletters",
    component: () =>
      import(/* webpackChunkName: "newsletters" */ "@/views/Newsletters.vue"),
    meta: {
      title: 'Newsletters',
      requiresAuth: true,
    }
  },
  {
    path: "/add-newsletter",
    name: "addNewsletter",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "add-newsletter" */ "@/views/AddNewsletter.vue"),
    meta: {
      title: 'Add Newsletter',
      requiresAuth: true,
    }
  },
  {
    path: "/edit-newsletter",
    name: "editNewsletter",
    component: () =>
      import(
        /* webpackChunkName: "edit-newsletter" */ "@/views/EditNewsletter.vue"),
    meta: {
      title: 'Edit Newsletter',
      requiresAuth: true,
    }
  },
  {
    path: "/unsubscribe",
    name: "unsubscribe",
    component: () =>
      import(
        /* webpackChunkName: "unsubscribe" */ "@/views/Unsubscribe.vue"
      ),
    meta: {
      title: 'Unsubscribe',
      requiresAuth: false,
      hideHeader: true,
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
    meta: {
      title: '404',
      requiresAuth: false,
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// GLOBAL ROUTER GUARD FOR AUTH
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const loggedIn = Cookies.get("loggedIn")
    if (!loggedIn) {
      store.commit("removeLoggedIn");
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.hideHeader)) {
    store.commit("removeShowHeader");
    next()
  } else {
    store.commit("setShowHeader")
    next()
  }
})

//  DISPLAY PAGE TITLE BASED ON ROUTE META
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }
  next()
})

export default router;
