//use vue 4 router
import { createRouter, createWebHashHistory } from 'vue-router'


import CustomerManagement from '../views/CustomerManagement.vue';
import HopeManagement from '../views/HopeManagement.vue';
import IncomingOrderManagement from '../views/IncomingOrderManagement.vue';
import AgencyManagement from '../views/AgencyManagement.vue';
import SettingsManagement from '../views/SettingsManagement.vue';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: CustomerManagement, 
      props: true
    },
    { 
      path: '/customers', 
      name: 'CustomerManagement',
      component: CustomerManagement, 
      props: true
    },
    { 
      path: '/hope', 
      name: 'HopeManagement',
      component: HopeManagement, 
      props: true
    },
    { 
      path: '/orders', 
      name: 'IncomingOrderManagement',
      component: IncomingOrderManagement, 
      props: true
    },
    { 
      path: '/agencies', 
      name: 'AgencyManagement',
      component: AgencyManagement, 
      props: true
    },
    { 
      path: '/settings', 
      name: 'SettingsManagement',
      component: SettingsManagement, 
      props: true
    },
]
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  export default router;