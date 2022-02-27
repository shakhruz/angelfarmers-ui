<template>
    <v-card class="d-flex justify-start pa-1 ma-1" :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4" class="pa-1 ma-1">
              <img :src="`/fw/assets/${asset.template_id}.png`" class="card">
          </v-col>
          <v-col cols="12" sm="6" md="6" class="pa=1 ma-1 justify-start">
              <div class="text-subtitle-1 font-weight-bold">
                {{ $t(asset.name).toUpperCase() }} x {{ asset.counter }}
              </div>
              <div class="ma-1">
                  {{$t("cost")}}: <strong>{{formatAssetPrice(asset.cost)}}￦</strong><br/>
                  {{$t("price")}}: <strong>{{formatAssetPrice(asset.price)}}￦</strong><br/>
                  {{$t("total cost")}}: {{formatAssetPrice(asset.cost)}}x{{asset.counter}} =
                  <strong>{{formatAssetPrice(asset.cost * asset.counter)}}￦</strong><br/>
                  {{$t("total price")}}: {{formatAssetPrice(asset.price)}}x{{asset.counter}} =
                  <strong>{{formatAssetPrice(asset.price * asset.counter)}}￦</strong><br/>
                  <br/>
                  <a :href="atomicUrl(asset.template_id)" target='_blank'>
                    {{$t('BUY ON ATOMIC')}}
                    <v-icon small>mdi-open-in-new</v-icon>
                  </a>
                  <br/>
                  <a :href="atomicAssetUrl(asset.asset_id)" target='_blank'>
                    {{$t('VIEW ON ATOMIC')}}
                    <v-icon small>mdi-open-in-new</v-icon>                    
                  </a>
                  <br/>
              </div>
              <div style="width:150px" class="mt-2" v-if="farm.managed">
                <v-text-field v-model="qty" type="this.qtyber" :label="$t('Quantity')" 
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="increment(asset)" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="decrement(asset)">
                </v-text-field>
              </div>
              <span v-if="farm.managed">
                <v-btn small @click="qty=asset.counter" class="mx-2" outlined>{{$t('ALL')}}</v-btn>
                <v-btn small @click="qty=qty*2 > asset.counter ? asset.counter : qty*2" class="mx-2"  outlined>x2</v-btn>
                <v-btn small @click="qty=Math.round(qty/2)" class="mx-2"  outlined>1/2</v-btn>
              </span>
          </v-col>
        </v-row>
        <v-card-actions v-if="farm.managed">
          <v-spacer></v-spacer>
          <v-btn @click="fw_wear(asset)" color="primary" v-if="canWear(asset)">{{$t('WEAR')}}</v-btn>
          <v-btn @click="fw_exchange(asset)" color="primary"
                :disabled = "!canExchange(asset)">{{$t('EXCHANGE')}}
          </v-btn>
          <v-btn @click="fw_transfer(asset)" color="primary">{{$t('TRANSFER')}}</v-btn>
          <v-btn @click="fw_sell(asset)" color="primary">{{$t('SELL')}}</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
</template>

<script>

export default {
  name: "ChestItemDialog",
  props: ['farm','asset'],  
  data() {
    return {
      farms_list: [],
      farm_account: null,
      qty: 1,
    };
  },
  components: {
  },
  mounted() {
  },
  methods: { 
    // Обмен на золото
    async fw_exchange(item) {
      console.log("Exchange: " + item.name + " " + this.qty + " pcs.");
      const res = await this.$dialog.confirm({
          text: this.$t("Exchange") + " " + this.qty + " " + this.$t(item.name) + " " + this.$t("exchange_for") + " GOLD" + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
          console.log("exchange...");
          this.$emit("closeDialog");
          const res = await this.atomic_exchange_asset(this.farm.account_name, item.template_id, this.qty, this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully exchanged") +  " " + this.qty +  " " + this.$t(item.name) + " " + this.$t("to") + " GOLD");
              this.$store.dispatch('updateFarm', this.farm.account_name);
              // setTimeout(this.updateAssetsList(),3000);
          } else {
              this.$toast.error(res.result);
          }
      } 
    }, 
    // Отправить на другой аккаунт
    async fw_transfer(item) {
      console.log("Transfer: " + item.name + " " + this.qty + " pcs.");
      let farm_to = await this.$dialog.prompt({
          text: this.$t("farm account"),
          title: this.$t('Farm account name to transfer'),
      })
      if (farm_to) {
        console.log("farms: " + farm_to);
        const res = await this.$dialog.confirm({
            text: this.$t("Transfer") + " " + this.qty + " " + this.$t(item.name) + " " + this.$t("to") + " " + farm_to + " ?",
            title: this.$t('Confirmation'),
            actions: {
                false: this.$t('No'),
                true: this.$t('Yes')
            },
        });
        if (res) {
            console.log("transfer...");
            this.$emit("closeDialog");
            const result = await this.atomic_transfer_asset(this.farm.account_name, item.template_id, this.qty, farm_to, this.farm.settings.private_key, this.farm.settings.delegated_account);
            if (result.status) {
                this.$toast.success(this.$t("Successfully transferred") + "  " + this.qty + " " + this.$t(item.name) + " " + 
                                    this.$t("to") + " " + farm_to);
                this.$store.dispatch('updateFarm', this.farm.account_name);
                // setTimeout(this.updateAssetsList(),3000);
            } else {
                this.$toast.error(result.result);
            }
        } 
      }
    },      
    // Поставить на продажу
    async fw_sell(item) {
      console.log("Sell: " + item.name + " " + this.qty + " pcs.");
      let lprice = item.price;
      lprice = await this.$dialog.prompt({
          text: this.$t("sell price") + " (" + lprice + ")",
          title: this.$t('Please enter price in WAX for') + ' ' + this.$t(item.name),
      })
      if (lprice) {
        const res = await this.$dialog.confirm({
            text: this.$t("Sell") + " " + this.qty + " " + this.$t(item.name) + " " + "on Atomic for" + lprice + " WAX?",
            title: this.$t('Confirmation'),
            actions: {
                false: this.$t('No'),
                true: this.$t('Yes')
            },
        });
        if (res) {
            console.log("selling...");
            this.$emit("closeDialog");
            const res = await this.atomic_sell_nft_atomic(this.farm.account_name, item.template_id, lprice, this.qty, this.farm.settings.private_key, this.farm.settings.delegated_account);
            if (res.status) {
                this.$toast.success(this.$t('Successfully put on sale') + " " + this.qty + " " + this.$t(item.name) + " " + ". price:" + lprice);
                this.$store.dispatch('updateFarm', this.farm.account_name);
                // setTimeout(this.updateAssetsList(),3000);
            } else {
                this.$toast.error(res.result);
            }
        } 
      }
    },        
    async fw_wear(item) {
      if (this.canWear(item)) {
        console.log("Wear: " + item.name);
        const res = await this.$dialog.confirm({
            text: this.$t("Wear") + " " + this.$t(item.name) + " ?",
            title: this.$t('Confirmation'),
            actions: {
                false: this.$t('No'),
                true: this.$t('Yes')
            },
        });
        if (res) {
            console.log("wear...");
            this.$emit("closeDialog");
            const res = await this.fw_asset_wear(item.asset_id, this.farm.account_name, this.farm.settings.private_key, this.farm.settings.delegated_account);
            if (res.status) {
                this.$toast.success(this.$t("Successfully staked") +  " " + this.$t(item.name));
                this.$store.dispatch('updateFarm', this.farm.account_name);
                // setTimeout(this.updateAssetsList(),3000);
            } else {
                this.$toast.error(res.result);
            }
        } 
      }
    }, 
    increment (item) {
      // console.log("inc " + JSON.stringify(item));
      this.qty += 1;
      if (this.qty  > item.counter ) this.qty = item.counter;
    },
    decrement (item) {
      // console.log("dec " + JSON.stringify(item));
      this.qty -= 1;
      if (this.qty < 1 ) this.qty = 1;
    },
    canExchange(item) {
      if (item.template_id=="318606" || item.template_id=="318607" || item.template_id=="298593" || item.template_id=="298612") return true;
      return false;
    },
    // Можно надеть карточку и ввести в игру
    canWear(item) {
      // tools
      // if (item.template_id=="378691" || item.template_id=="260763" || item.template_id=="203881" || item.template_id=="203883"
      //     || item.template_id=="203886" || item.template_id=="203887" || item.template_id=="203888" || item.template_id=="203889"
      //     || item.template_id=="203891") return true;

      // building
      // if (item.template_id=="298592" || item.template_id=="298591" || item.template_id=="298590") return true;

      // если это семена или зерновые или молоко или фармер коин, возвращаем false
      if (item.template_id=="318606" || item.template_id=="318607" || item.template_id=="298595" || item.template_id=="298596"
          || item.template_id=="298593" || item.template_id=="260676") return false;

      return true;
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
