import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/style.scss'
import "@/service/wax";
import "@/service/alcor";
import "@/service/farmer";
import "@/service/utils";
import "@/service/logs";
import "@/service/colors";
import "@/service/formats";
import "@/service/farmerdata";
import "@/service/fwactions";
import "@/service/angelactions";
import "@/service/atomicapi";
import "@/service/dfuseapi";
import "@/service/fb";
import VueTimers from 'vue-timers'
import vuetify from './plugins/vuetify'
import Toast, {POSITION} from "vue-toastification";
import "vue-toastification/dist/index.css";
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import Clipboard from 'v-clipboard'
import VueAnalytics from 'vue-analytics';
// import VueIpfs from './plugins/vue-ipfs'

Vue.use(Clipboard);
Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

import { firestorePlugin } from 'vuefire'
import i18n from './i18n'

Vue.use(firestorePlugin)
// Vue.use(VueIpfs)

Vue.config.productionTip = false
Vue.use(Toast, {
  position: POSITION.BOTTOM_LEFT,
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  timeout: 1000,
  newestOnTop: true 
});
Vue.use(VueAnalytics, {
  id: 'UA-135285458-1',
  router
});

new Vue({
  router,
  store,
  VueTimers,
  vuetify,
  Toast,
  i18n,
  render: h => h(App)
}).$mount('#app')
