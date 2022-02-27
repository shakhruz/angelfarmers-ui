<template>
  <div>
    <v-row>
      <v-col v-for="item in market_assets" cols="auto" :key="item.id">
          <v-card class="d-flex justify-start pa-1 ma-1" width="240px" 
              :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
              <div class="justify-center">
                <img :src="`/fw/assets/${item.value}.png`" class="card">
              </div>
              <div class="pa-2">
                <div>
                  <strong>
                    {{ $t(item.text).toUpperCase() }}
                  </strong>
                  <div>
                      <strong>
                        {{$t("Market cost")}}:
                      </strong>
                      {{ item.gold }}
                      <img class="token" src="/fw/FWG2.png"/>
                      <br/>
                      ({{ formatAsset(farm.prices.fwg*item.gold) }}￦)
                      <span v-if="item.gold > farm.balance.gold" class="error--text">
                        {{ formatAsset(item.gold - farm.balance.gold) }}
                      </span>
                  </div>
                  <div style="width:100px" class="mt-0 pt-0">
                    <v-text-field v-model="item.num" type="number"
                          append-outer-icon="mdi-plus" 
                          @click:append-outer="increment(item)" 
                          prepend-icon="mdi-minus" 
                          @click:prepend="decrement(item)">
                    </v-text-field>
                    <v-btn @click="fw_buy(item.value, item.text, item, item.num)" color="primary" text
                          :disabled="!(farm.balance.gold>=item.gold && farm.balance.wood>=item.wood)">
                      {{$t("BUY")}}
                    </v-btn>
                    <div v-if="item.num>1">
                      <small>
                        {{$t("Total")}}: {{ formatAsset(item.num * item.gold) }}
                        <img class="token" src="/fw/FWG2.png"/>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
          </v-card>
      </v-col>
    </v-row>   
  </div>
</template>

<script>
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";
import * as data from '@/store/modules/data';

export default {
  name: "FarmMarketDialog",
  props: ["farm"],
  data() {
    return {  
      craft_items: [],
      market_assets: [],
    };
  },
  components: {
    CPUInfo
  },
  mounted() {
      this.craft_items = data.craft_assets;
      this.market_assets = data.market_assets;
  },
  methods: { 
    // Market buy
    async fw_buy(template_id, name, item) {
      console.log("Market buy: " + name + " " + item.num + " pcs");
      const res = await this.$dialog.confirm({
          text: this.$t("Market buy") +  " " + item.num + " " + this.$t(name) + " " + ", " + this.$t("pay") + " "  + (item.gold * item.num) + " " + 
                this.$t("GOLD") + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
          console.log("crafting...");
          this.$emit("closeDialog");
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
  width: 100px;
}

</style>
