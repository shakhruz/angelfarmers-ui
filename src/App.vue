<template>
  <v-app :dark="setTheme" class="app">
    <span :class="this.$vuetify.theme.dark ? 'bg_night' : 'bg'"></span>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
           <v-img
            src="/fw/home-about-1.jpeg"
            aspect-ratio="1"
            class="primary"
          />
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="item in $store.state.menu_items"
          :key="item.title"
          link
          :to = "item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>    
      <v-select class="mx-2 my-2" dense v-model="selectedEndpoint" :items="endpoints" @change="selectNewEndpoint()" />
      <v-btn icon @click = 'selectRandomEndpoint()' hint="random endpoint">
        <v-icon>mdi-shuffle-variant</v-icon>
      </v-btn>                            
      <v-card-text>
        {{$t("Telegram Bot")}}
        <a href="https://t.me/angelfarmers_bot" target="_blank">@AngelFarmers_bot</a>
        v1.0.0
        <v-btn icon href="https://github.com/shakhruz/angelfarmers-ui" target="_blank">
          <v-icon>mdi-github</v-icon>
        </v-btn>

      </v-card-text>
    </v-navigation-drawer>
    <v-app-bar app color="teal darken-2" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
            <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                    <span v-if="$store.state.total_status">
                      <v-icon color="light-green lighten-4">
                        mdi-check-circle
                      </v-icon>
                    </span>
                    <span v-if="!$store.state.total_status">
                      <v-icon color="red accent-1">
                        mdi-alert-circle
                      </v-icon>
                    </span>
                </span>
            </template>
            <span>
              {{ next_action_mins }}<br/>
              {{$store.state.next_action_account}}<br/>
              {{$store.state.next_action}}
            </span>
          </v-tooltip> 
          &nbsp;
          <Prices v-if="!$vuetify.breakpoint.mobile" />
          <span v-if="$vuetify.breakpoint.mobile && $store.state.userAccount">
            {{ $store.state.userAccount }}
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon href="https://github.com/shakhruz/angelfarmers-ui" target="_blank">
          <v-icon>mdi-github</v-icon>
        </v-btn>
        <v-btn icon :href="$t('https://t.me/angelfarmers')" target="_blank">
          <v-icon>mdi-send-circle</v-icon>
        </v-btn>
        <v-btn icon href="https://discord.gg/6ZZ6KFUz" target="_blank">
          <v-icon>mdi-discord</v-icon>
        </v-btn>
        <!-- <TopMenu />         -->
        <v-spacer></v-spacer>
        <span v-if="$store.state.config">
          <span v-if="!$vuetify.breakpoint.mobile">{{$t('Fee')}}:</span>
          <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
            <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-chip class="ma-2" label text-color="white"  :class="getWithdrawFeeColor($store.state.config.fee)">
                    <b>{{ $store.state.config.fee }}</b>%
                  </v-chip>
                </span>
            </template>
            <span>
              {{ minsPassedFormat($store.state.config.last_fee_updated) }}&nbsp;
              {{$t('Minutes passed since started')}}
            </span>
          </v-tooltip> 
        </span>
        <Login/>
        <LanguageSelector />
        <v-btn @click="toggleTheme" icon v-if="!$store.state.goDark"><v-icon >mdi-weather-night</v-icon></v-btn>
        <v-btn @click="toggleTheme" icon v-else><v-icon >mdi-white-balance-sunny</v-icon></v-btn>
        <v-progress-linear
        :active="$store.state.top_loading"
        :indeterminate="$store.state.top_loading"
        absolute
        bottom
        color="amber"
      ></v-progress-linear>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
    <!-- <v-footer padless>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>AngelFarmers.com</strong>
      </v-col>
    </v-footer>     -->
  </v-app>
</template>

<script>
import Login from "@/components/Login.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import TopMenu from "@/components/TopMenu.vue";
import Prices from "@/components/Prices.vue";
import { waitFor } from "@dfuse/client"

export default {
  name: 'App',
  data: () => ({
    version: 'v1.0.0',
    drawer: false,
    goDark: false,
    menu_items: [],
    right: null,
    updatingPrices: true,
    updatingInfo: true,
    updatingAtomic: false,
    endpoints: [],
    selectedEndpoint: '',
  }),
  created() {
    this.$store.dispatch("loadUserMenuItems");
    this.selectedEndpoint = this.getEndpoint();
    this.endpoints = this.getEndpoints();
    console.log("!!! selected endpoint: " + this.selectedEndpoint);
  },
  async mounted() {
    await this.$store.dispatch("loadSettings");
    await this.$store.dispatch("loadPrices");
    await this.$store.dispatch("loadFarms");
    await this.$store.dispatch("loadAtomicAssets");
    this.$vuetify.theme.dark = this.$store.state.goDark;
    this.startPricesUpdater();
    this.startFarmUpdater();  
    this.startAtomicUpdater();
    // Admin menu items
    setTimeout(()=>{
      this.$store.dispatch("loadUserMenuItems");
    }, 1000)
  },
  components: {
    Login, Prices, LanguageSelector, TopMenu
  },  
  computed: {
      setTheme() {
          if (this.$store.state.goDark == true) {
              return (this.$vuetify.theme.dark = true);
          } else {
              return (this.$vuetify.theme.dark = false);
          }
      },
      next_action_mins() {
        const mins = (this.$store.state.next_action_date - new Date()) / 1000 / 60;
        return this.minutesToAction(mins);
      },
  },  
  methods: {   
    selectNewEndpoint() {
      // console.log("!!! new selected endpoint: " + this.selectedEndpoint);
      this.selectEndpoint(this.selectedEndpoint);
    },
    selectRandomEndpoint() {
      this.selectedEndpoint = this.randomEndpoint();
      // console.log("!!! new random endpoint: " + this.selectedEndpoint);
    },
    toggleTheme() {
      this.$store.state.goDark = !this.$store.state.goDark;
      this.$vuetify.theme.dark = this.$store.state.goDark;
      this.$store.dispatch("updateTheme", this.$store.state.goDark);
    },
    // Обновляем курсы валют каждые 5 секунд и пересчитываем балансы ферм
    async startPricesUpdater() {
      console.log('startPricesUpdater');
      while(this.updatingPrices) {
        if (!this.$store.state.updatingPrices) {
          this.$store.dispatch("updatePrices");
          await waitFor(10000);
        }
        else {
          // ставим на паузу до следующей проверки
          await waitFor(10000);
        }
      }
    },
    // Обновляем состояние ферм каждые 60 секунд и обслуживаем главную если есть действия
    async startFarmUpdater() {
      console.log('startFarmUpdater');
      await this.$store.dispatch("startGameUpdateTimer");

      this.updatingInfo = true;
      while(this.updatingInfo) {
        if (!this.$store.state.updatingInfo) {
          await this.$store.dispatch("updateInfo");
          this.checkActions();
          // обновим данные фермы в базе
          console.log("...updateAllFarmsState...");
          this.fb_updateAllFarmsState();
          await waitFor(60000);
        }
        else {
          this.checkActions();
          await waitFor(60000);
        }
      }
    },   
    // проверим нужно ли обслуживание для ферм и проводим его
    async checkActions() {
      this.$store.state.farms.forEach(async farm => {
        // console.log("checkActions for " + farm.account_name);
        await this.farmActions(farm);
        // проверяем действия для поддержания вторичных ферм
        await this.masterFarmActions(farm);
      })
    },
    // Обновляем курсы валют каждые 5 секунд и пересчитываем балансы ферм
    async startAtomicUpdater() {
      console.log('startAtomicUpdater');
      this.updatingAtomic = true;
      while(this.updatingAtomic) {
        if (!this.$store.state.updatingAtomic) {
          this.$store.dispatch("updateAtomicAssets");
          await waitFor(70000);
        }
        else {
          // ставим на паузу до следующей проверки
          await waitFor(70000);
        }
      }
    },  
    getWithdrawFeeColor(fee) {
      switch(fee) {
        case 5: return "green lighten-2";
        case 6: return "green darken-2";
        case 7: return "red lighten-2";
        case 8: return "red darken-2";
      }
    }       
  }
};
</script>
<style scoped>
.app {
  background: linear-gradient(blue, pink);
}

.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url( '/bg.jpg') no-repeat center center;
    background-size: cover;
    background-color: rgb(36, 32, 32);
    transform: scale(1.1);
}

.bg_night {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url( '/bg_night.jpg') no-repeat center center;
    background-size: cover;
    background-color: rgb(36, 32, 32);
    transform: scale(1.1);
}


</style>