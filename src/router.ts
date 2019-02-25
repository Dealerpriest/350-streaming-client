import Vue from 'vue';
import Router from 'vue-router';
import VideoView from './views/VideoView.vue';
import Home from './views/Home.vue';
import LoginView from './views/LoginView.vue';
import Store from './store';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/',
      name: 'videoView',
      component: VideoView,
      beforeEnter: (to, from, next) => {
        // eslint-disable-next-line
        if (sessionStorage.authenticated) {
          Store.commit('setAuthenticated', true);
        }
        if (Store.state.authenticated) {
          next();
        } else {
          next('login');
        }
      },
    },
    {
      path: '/login',
      name: ' login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        // eslint-disable-next-line
        if (!Store.state.authenticated) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
