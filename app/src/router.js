// src/router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import GameRoom from './client/GameRoom.vue';
import HomePage from './client/HomePage.vue';
import FOF from './client/404.vue';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: FOF,
    },
    {
        path: '/:room/:playerName?',
        name: 'GameRoom',
        component: GameRoom,
        props: true,
    },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;