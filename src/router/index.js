import Vue from 'vue'
import VueRouter from 'vue-router'

import F12 from '../views/F12.vue'
import Avatars from '../views/Avatars.vue'
import AllFarms from '../views/AllFarms.vue'
import AllAngelFarmers from '../views/AllAngelFarmers.vue'
import FarmActions from '../views/FarmActions.vue'

import AtomicPanel from '../views/AtomicPanel.vue'
import AtomicBuyer from '../views/AtomicBuyer.vue'
import AtomicSales from '../views/AtomicSales.vue'

import AlcorOrderbooks from '../views/AlcorOrderbooks.vue'
import TradeHistory from '../views/TradeHistory.vue'
import AlcorTrader from '../views/AlcorTrader.vue'

// import Home from '../views/Home.vue'
// import Setup from '../views/Setup.vue'
// import Tokens from '../views/Tokens.vue'
// import AtomicCraft from '../views/AtomicCraft.vue'
// import Chest from '../views/Chest.vue'
// import Donations from '../views/Donations.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/farm/:id/logs',
    name: 'FarmActions',
    component: FarmActions,
    props: true
  },
  {
    path: '/atomic-panel',
    name: 'AtomicPanel',
    component: AtomicPanel
  },
  {
    path: '/atomic-buyer',
    name: 'AtomicBuyer',
    component: AtomicBuyer
  },
  {
    path: '/atomic-sales',
    name: 'AtomicSales',
    component: AtomicSales
  },
  {
    path: '/trade-history',
    name: 'TradeHistory',
    component: TradeHistory
  },
  {
    path: '/alcor-orderbooks',
    name: 'AlcorOrderbooks',
    component: AlcorOrderbooks
  },
  {
    path: '/alcor-trader',
    name: 'AlcorTrader',
    component: AlcorTrader
  }, 
  {
    path: '/all-farms',
    name: 'AllFarms',
    component: AllFarms
  },  
  {
    path: '/all-farmers',
    name: 'AllAngelFarmers',
    component: AllAngelFarmers,
  },
  {
    path: '/',
    name: 'F12',
    component: F12,
  },
  {
    path: '/avatars',
    name: 'Avatars',
    component: Avatars,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
