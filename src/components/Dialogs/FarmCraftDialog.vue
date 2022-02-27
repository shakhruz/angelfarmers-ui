<template>
  <div>
    <v-row>
      <v-col v-for="item in craft_items" cols="auto" :key="item.id">
          <v-card class="d-flex justify-start pa-1 ma-1" width="330px" 
                  :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
              <div class="pa-1" style="width:100%">
                <div>
                  <img :src="`/fw/assets/${item.value}.png`" class="card">
                  <strong>
                    {{ $t(item.text).toUpperCase() }}
                  </strong>
                  <div class="pa-0 ma-1">
                      <strong>
                        {{$t("Craft cost")}}:<br/>
                      </strong>
                      {{ formatAsset(farm.prices.fwg*item.gold + farm.prices.fww*item.wood) }}￦
                      <br/>
                      <div>
                        {{ item.gold }}&nbsp;
                        <img class="token" src="/fw/FWG2.png"/>&nbsp;
                        ({{ formatAsset(farm.prices.fwg*item.gold) }}￦)
                      </div>
                      <div v-if="item.gold > farm.balance.gold" class="error--text">
                        {{ formatAsset(item.gold - farm.balance.gold) }}
                        <img class="token" src="/fw/FWG2.png"/>
                        ( {{formatAsset((item.gold - farm.balance.gold)*farm.prices.fwg)}}￦ )
                      </div>
                      <div>
                        {{ item.wood }}&nbsp;
                        <img class="token" src="/fw/FWW2.png"/>&nbsp;
                        ({{ formatAsset(farm.prices.fww*item.wood) }}￦)
                      </div>
                      <div v-if="item.wood > farm.balance.wood" class="error--text">
                        {{ formatAsset(item.wood - farm.balance.wood) }}&nbsp;
                        <img class="token" src="/fw/FWW2.png"/>&nbsp;
                        ({{formatAsset((item.wood - farm.balance.wood)*farm.prices.fww)}}￦)
                      </div>                    
                      <div class="mt-3" 
                          v-if="(item.hourly_reward_wood || item.hourly_reward_gold || item.hourly_reward_food) && farm && farm.prices">
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
                        <div>
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
                        </div>
                        <div class="mt-0">
                          {{$t("Monthly")}}:
                          <span v-if="item.hourly_reward_wood">
                            {{ formatAsset(item.hourly_reward_wood*24*30)}} <img class="token" src="/fw/FWW2.png"/>
                            ({{ formatAsset(24*30* item.hourly_reward_wood * farm.prices.fww)}}￦)
                          </span>
                          <span v-if="item.hourly_reward_gold">
                            {{ formatAsset(item.hourly_reward_gold*24*30)}} <img class="token" src="/fw/FWG2.png"/>
                            ({{ formatAsset(24*30*item.hourly_reward_gold * farm.prices.fwg)}}￦)
                          </span>
                          <span v-if="item.hourly_reward_food">
                            {{ formatAsset(item.hourly_reward_food*24*30)}} <img class="token" src="/fw/FWF2.png"/>
                            ({{ formatAsset(24*30*item.hourly_reward_food * farm.prices.fwf)}}￦)
                          </span>
                        </div>
                      </div>
                  </div>
                  <div style="width:100px" class="mt-0 pt-0">
                      <v-btn @click="fw_craft(item.value, item.text, item)" color="primary" text
                        :disabled="!(farm.balance.gold>=item.gold && farm.balance.wood>=item.wood)">
                          {{$t("CRAFT")}}
                      </v-btn>
                  </div>
                </div>
              </div>
          </v-card>
      </v-col>
    </v-row>   
  </div>
</template>

<script>
import * as data from '@/store/modules/data';

export default {
  name: "FarmCraftDialog",
  props: ["farm"],
  data() {
    return {  
      craft_items: [],
      market_assets: [],
      // farms_list: [],
    };
  },
  components: {
  },
  mounted() {
      this.craft_items = data.craft_assets;
      this.market_assets = data.market_assets;
  },
  methods: { 
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
  margin-right: 10px;
  padding-right: 1px;
  margin-top:0 px;
  padding-top:0px;
  width: 100px;
}

</style>
