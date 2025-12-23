import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ToolPage from '../pages/ToolPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tool/:id',
    name: 'ToolPage',
    component: ToolPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router