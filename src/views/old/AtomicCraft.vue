<template>
  <div>
    <v-card class="ma-1 pa-1" v-if="farm && farm.account_name">
        <v-row>
            <v-col>
                <v-card-title class="text-center justify-center py6">
                    <h1 class="text-h5">
                      <v-icon>mdi-hammer</v-icon>
                      {{$t("CRAFT & MARKET")}}
                      <v-icon>mdi-hammer</v-icon>
                    </h1>
                </v-card-title>

                <v-card-title>
                    <!-- {{farm.account_name}} -->
                    <v-select v-model="farm_account" 
                        label="Select farm" width="100px" @change="changeFarm(farm_account)"
                        :items="farms_list" >
                    </v-select>
                </v-card-title>
                <v-card-text v-if="farm && farm.tokens">
                    {{$t("In Game")}}:
                    <TokenChip :value="farm.balance.gold" name="FWG2" />
                    <TokenChip :value="farm.balance.wood" name="FWW2" />
                    &nbsp;&nbsp;|&nbsp;   
                    CPU: <CPUInfo :cpu_used="farm.account.cpu_used_percent"/>         
                    <v-btn icon @click = '$store.dispatch("updateFarm", farm.account_name)'>
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>                       
                </v-card-text>
            </v-col>
        </v-row>
    </v-card> 
    <v-row>
      <v-col cols="12" md="6">
        <div class="pa-1 ma-1" v-if="farm && farm.prices">
          <div v-for="item in craft_items">
            <v-card class="d-flex justify-start pa-1 ma-1" width="500px">
                <div class="justify-center">
                  <img :src="`/fw/assets/${item.value}.png`" class="card">
                </div>
                <div class="pa-2">
                  <div width="400px" class="">
                    <strong>
                      {{ $t(item.text).toUpperCase() }}
                    </strong>
                    <div>
                        <strong>
                          {{$t("Craft cost")}}:
                        </strong>
                          {{ formatAsset(farm.prices.fwg*item.gold + farm.prices.fww*item.wood) }}￦
                        <br/>
                        {{ item.gold }}
                        <img class="token" src="/fw/FWG2.png"/>
                        ({{ formatAsset(farm.prices.fwg*item.gold) }}￦)
                        <span v-if="item.gold > farm.balance.gold" class="error--text">
                          {{ formatAsset(item.gold - farm.balance.gold) }}
                          <img class="token" src="/fw/FWG2.png"/>
                          / {{formatAsset((item.gold - farm.balance.gold)*farm.prices.fwg)}}￦
                        </span>
                        <br/>
                        
                        {{ item.wood }}
                        <img class="token" src="/fw/FWW2.png"/>
                        ({{ formatAsset(farm.prices.fww*item.wood) }}￦)
                        <span v-if="item.wood > farm.balance.wood" class="error--text">
                          {{ formatAsset(item.wood - farm.balance.wood) }}
                          <img class="token" src="/fw/FWW2.png"/>
                          / {{formatAsset((item.wood - farm.balance.wood)*farm.prices.fww)}}￦
                        </span>                    
                        <br/>
                      <span v-if="(item.hourly_reward_wood || item.hourly_reward_gold || item.hourly_reward_food) && farm && farm.prices">
                        <strong>
                          {{$t("Reward")}}:
                        </strong><br/> 
                        {{$t("Hourly")}}:
                        <span v-if="item.hourly_reward_wood">
                          {{ formatAsset(item.hourly_reward_wood)}} <img class="token" src="/fw/FWW2.png"/>
                          ({{ formatAsset(item.hourly_reward_wood * farm.prices.fww)}}￦)
                        </span>
                        <span v-if="item.hourly_reward_gold">
                          {{ formatAsset(item.hourly_reward_gold)}} <img class="token" src="/fw/FWG2.png"/>
                          ({{ formatAsset(item.hourly_reward_gold * farm.prices.fwg)}}￦)
                        </span>
                        <span v-if="item.hourly_reward_food">
                          {{ formatAsset(item.hourly_reward_food)}} <img class="token" src="/fw/FWF2.png"/>
                          ({{ formatAsset(item.hourly_reward_food * farm.prices.fwf)}}￦)
                        </span>
                        <br/>
                        {{$t("Daily")}}:
                        <span v-if="item.hourly_reward_wood">
                          {{ formatAsset(item.hourly_reward_wood*24)}} <img class="token" src="/fw/FWW2.png"/>
                          ({{ formatAsset(24* item.hourly_reward_wood * farm.prices.fww)}}￦)
                        </span>
                        <span v-if="item.hourly_reward_gold">
                          {{ formatAsset(item.hourly_reward_gold*24)}} <img class="token" src="/fw/FWG2.png"/>
                          ({{ formatAsset(24*item.hourly_reward_gold * farm.prices.fwg)}}￦)
                        </span>
                        <span v-if="item.hourly_reward_food">
                          {{ formatAsset(item.hourly_reward_food*24)}} <img class="token" src="/fw/FWF2.png"/>
                          ({{ formatAsset(24*item.hourly_reward_food * farm.prices.fwf)}}￦)
                        </span>
                      </span>
                    </div>
                    <v-card-actions>
                        <v-btn @click="fw_craft(item.value, item.text, item)" color="success" text
                        :disabled="!(farm.balance.gold>=item.gold && farm.balance.wood>=item.wood)">
                          {{$t("CRAFT")}}
                        </v-btn>
                    </v-card-actions>
                  </div>
                </div>
            </v-card>
          </div>
        </div>        
      </v-col>
      <v-col cols="12" md="6">
        <div class="pa-1 ma-1" v-if="farm && farm.prices">
          <div v-for="item in market_assets">
            <v-card class="d-flex justify-start pa-1 ma-1" width="500px">
                <div class="justify-center">
                  <img :src="`/fw/assets/${item.value}.png`" class="card">
                </div>
                <div class="pa-2">
                  <div width="400px" class="">
                    <strong>
                      {{ $t(item.text).toUpperCase() }}
                    </strong>
                    <div>
                        <strong>
                          {{$t("Market cost")}}:
                        </strong>
                        {{ item.gold }}
                        <img class="token" src="/fw/FWG2.png"/>
                        ({{ formatAsset(farm.prices.fwg*item.gold) }}￦)
                        <span v-if="item.gold > farm.balance.gold" class="error--text">
                          {{ formatAsset(item.gold - farm.balance.gold) }}
                        </span>
                        <br/>                        
                    </div>
                    <span style="width:100px">
                      <v-text-field v-model="item.num" type="number" :label="$t('Quantity')" width="50px" 
                            append-outer-icon="mdi-plus" 
                            @click:append-outer="increment(item)" 
                            prepend-icon="mdi-minus" 
                            @click:prepend="decrement(item)">
                      </v-text-field>
                    </span>
                    <v-card-actions>
                        <div v-if="item.num>1">
                          {{$t("Total")}}: {{ formatAsset(item.num * item.gold) }}
                          <img class="token" src="/fw/FWG2.png"/>
                        </div>
                        <v-btn @click="fw_buy(item.value, item.text, item, item.num)" color="success" text
                        :disabled="!(farm.balance.gold>=item.gold && farm.balance.wood>=item.wood)">
                          {{$t("BUY")}}
                        </v-btn>
                    </v-card-actions>
                  </div>
                </div>
            </v-card>
          </div>
        </div>          
      </v-col>
    </v-row>   
  </div>
</template>

<script>
import TokenChip from "@/components/TokenChip.vue";
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";
import * as data from '@/store/modules/data';

export default {
  name: "AtomicCraft",
  props: ["id"],
  data() {
    return {
      farm: null,      
      craft_items: [],
      market_assets: [],
      farms_list: [],
      farm_account: null,
    };
  },
  components: {
    TokenChip, CPUInfo
  },
  mounted() {
    // пауза в 1 секунду для логина
    setTimeout( () => {
      let found = false;
      let index = 0;
      // console.log("!!! id: " + this.id);
      if (this.id!='') {
        // найдем ферму по имени
        for(let c=0; c<this.$store.state.farms.length && !found;c++) {
          if (this.$store.state.farms[c].account_name==this.id) {
            found = true;
            index = c;
            // console.log("!!! нашел ферму " + index)
          }
        }
      }
      this.farm = this.$store.state.farms[index];
      this.craft_items = data.craft_assets;
      this.market_assets = data.market_assets;

      this.farm_account = this.farm.account_name;

      // соберем список ферм которыми можно управлять
      this.farms_list = [];
      this.$store.state.farms.forEach(f => {
        if (f.wax_login || f.settings.delegated_account.trim()!='' || f.settings.private_key.trim()!='') {
          this.farms_list.push(f.account_name);
        }
      })
    }, 1000);
  },
  methods: { 
    changeFarm(farm_name) {
      console.log("farm account: " + farm_name);

      // найдем и обновим ферму
      let found = false;
      for(let i=0;i<this.$store.state.farms.length && !found;i++) {
        if (this.$store.state.farms[i].account_name == farm_name) {
          this.farm = this.$store.state.farms[i];
          found = true;
        }
      }
    },    
    // Крафт нового актива 
    async fw_craft(template_id, name, item) {
      console.log("Craft: " + name + " pcs.");
      const res = await this.$dialog.confirm({
          text: this.$t("Craft") + " " + this.$t(name) + " " + this.$t("for") + " " + item.wood + " " +
               this.$t("WOOD") + " " + this.$t("and") + " " + item.gold + " " + this.$t("GOLD") + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
          console.log("crafting...");
          const res = await this.fw_craft_asset(this.farm.account_name, template_id, 1, this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully crafted") + " " + this.$t(name));
              this.$store.dispatch('updateFarm', this.farm.account_name);
          } else {
              this.$toast.error(res.result);
          }
      } 
    }, 
    // Market buy
    async fw_buy(template_id, name, item) {
      console.log("Market buy: " + name + " " + item.num + " pcs");
      const res = await this.$dialog.confirm({
          text: this.$t("Market buy") +  " " + item.num + " " + this.$t(name) + " " + ", pay" + " "  + (item.gold * item.num) + " " + 
                this.$t("GOLD") + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
          console.log("crafting...");
          const res = await this.fw_craft_asset(this.farm.account_name, template_id, item.num, this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully purchased") + " " + this.$t(name));
              this.$store.dispatch('updateFarm', this.farm.account_name);
          } else {
              this.$toast.error(res.result);
          }
      } 
    },     
    increment (item) {
      item.num += 1;
      if (item.num * item.gold > this.farm.balance.gold) item.num = item.num - 1;
    },
    decrement (item) {
      item.num -= 1;
      if (item.num < 1 ) item.num = 1;
    }     
  }
};
</script>

<style>
.card {
  float: left;
  text-align: left;
  align: left;
  width: 120px;
}

</style>
