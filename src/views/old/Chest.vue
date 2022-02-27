<template>
  <div>
    <v-card class="ma-1 pa-1" v-if="farm && farm.account_name">
        <v-row>
            <v-col>
                <v-card-title class="text-center justify-center py6">
                    <h1 class="text-h5">
                      <v-icon>mdi-treasure-chest</v-icon>
                      {{$t('CHEST')}}
                      <v-icon>mdi-treasure-chest</v-icon>
                    </h1>
                </v-card-title>

                <v-card-title>
                    <v-select v-model="farm_account" 
                        :label="$t('Select farm')" width="100px" @change="changeFarm(farm_account)"
                        :items="farms_list" >
                    </v-select>
                </v-card-title>
                <v-card-subtitle>
                    {{$t('Total value')}}: 
                    <strong>
                      {{formatAsset(farm.assets.total_wax)}}￦
                    </strong>
                    (${{formatAsset(farm.assets.total_wax*farm.prices.wax)}})
                    &nbsp;|&nbsp; {{$t('In Game')}}:
                    <TokenChip :value="farm.balance.gold" name="FWG2" />
                    <TokenChip :value="farm.balance.wood" name="FWW2" />
                    &nbsp;&nbsp;|&nbsp;   
                    CPU: <CPUInfo :cpu_used="farm.account.cpu_used_percent"/>         
                    <v-btn icon @click = '$store.dispatch("updateFarm", farm.account_name)'>
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>                      
                </v-card-subtitle>
            </v-col>
        </v-row>
    </v-card> 
    <v-row>
      <v-col cols="12" md="6">
        <!-- <TransferAccountDialog :dialog="showDialog" /> -->
        <div class="pa-1 ma-1" v-if="farm && farm.prices">
          <div v-for="item in unique">
            <v-card class="d-flex justify-start pa-1 ma-1" width="500px">
                <div class="justify-center">
                  <img :src="`/fw/assets/${item.template_id}.png`" class="card">
                </div>
                <div class="pa-2">
                  <div width="400px">
                    <strong>
                      {{ $t(item.name).toUpperCase() }} x {{ item.counter }}
                    </strong>
                    <span style="width:100px">
                      <v-text-field v-model="item.num" type="number" label="Quantity" 
                            append-outer-icon="mdi-plus" 
                            @click:append-outer="increment(item)" 
                            prepend-icon="mdi-minus" 
                            @click:prepend="decrement(item)">
                      </v-text-field>
                    </span>
                    <v-card-actions>
                        <v-btn @click="fw_exchange(item)" color="success" text
                        :disabled = "!canExchange(item)">{{$t('EXCHANGE')}}</v-btn>
                        <v-btn @click="fw_transfer(item)" color="success" text>{{$t('TRANSFER')}}</v-btn>
                        <v-btn @click="fw_sell(item)" color="success" text>{{$t('SELL')}}</v-btn>
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

export default {
  name: "Chest",
  data() {
    return {
      farm: null,      
      assets: [],
      unique: [],
      farms_list: [],
      farm_account: null,
    };
  },
  components: {
    TokenChip, CPUInfo
  },
  mounted() {
      setTimeout( () => {
        if (this.$store.state.logged_in) {
          this.farm = this.$store.state.farms[0];
          this.farm_account = this.farm.account_name;
      
          // соберем список ферм которыми можно управлять
          this.farms_list = [];
          this.$store.state.farms.forEach(f => {
            if (f.wax_login || f.settings.delegated_account.trim()!='' || f.settings.private_key.trim()!='') {
              this.farms_list.push(f.account_name);
            }
          })
          this.updateAssetsList();
        } else {
          console.log("not logged in...");
        }
      }, 1000)
  },
  methods: { 
    updateAssetsList() {
      // соберем список активов в сундуке
      if (this.farm && this.farm.assets) {
        this.unique = [];
        this.farm.assets.unique.forEach(a=>{
          let asset = {num: 1, name: a.name, template_id: a.template_id, counter: a.counter, price: a.price};
          this.unique.push(asset);
        })
      }
    },

    // поменять ферму
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
      this.updateAssetsList();
    },
    // Обмен на золото
    async fw_exchange(item) {
      console.log("Exchange: " + item.name + " " + item.num + " pcs.");
      const res = await this.$dialog.confirm({
          text: this.$t("Exchange") + " " + item.num + " " + this.$t(item.name) + " " + "for GOLD" + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
          console.log("exchange...");
          const res = await this.atomic_exchange_asset(this.farm.account_name, item.template_id, item.num, this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully exchanged") +  " " + item.num +  " " + this.$t(item.name) + "to GOLD");
              this.$store.dispatch('updateFarm', this.$store.state.userAccount);
              setTimeout(this.updateAssetsList(),3000);
          } else {
              this.$toast.error(res.result);
          }
      } 
    }, 
    // Отправить на другой аккаунт
    async fw_transfer(item) {
      console.log("Transfer: " + item.name + " " + item.num + " pcs.");
      let farm_to = await this.$dialog.prompt({
          text: this.$t("farm account"),
          title: this.$t('Farm account name to transfer'),
      })
      if (farm_to) {
        console.log("farms: " + farm_to);
        const res = await this.$dialog.confirm({
            text: this.$t("Transfer") + " " + item.num + " " + this.$t(item.name) + this.$t("to") + " " + farm_to + " ?",
            title: this.$t('Confirmation'),
            actions: {
                false: this.$t('No'),
                true: this.$t('Yes')
            },
        });
        if (res) {
            console.log("transfer...");
            const result = await this.atomic_transfer_asset(this.farm.account_name, item.template_id, item.num, farm_to, this.farm.settings.private_key, this.farm.settings.delegated_account);
            if (result.status) {
                this.$toast.success(this.$t("Successfully transferred") + "  " + item.num + " " + this.$t(item.name) + " " + 
                                    this.$t("to") + " " + farm_to);
                this.$store.dispatch('updateFarm', this.farm.account_name);
                setTimeout(this.updateAssetsList(),3000);
            } else {
                this.$toast.error(result.result);
            }
        } 
      }
    },      
    // Поставить на продажу
    async fw_sell(item) {
      console.log("Sell: " + item.name + " " + item.num + " pcs.");
      let lprice = item.price;
      lprice = await this.$dialog.prompt({
          text: this.$t("sell price") + " (" + lprice + ")",
          title: this.$t('Please enter price in WAX for') + ' ' + this.$t(item.name),
      })
      if (lprice) {
        const res = await this.$dialog.confirm({
            text: this.$t("Sell") + " " + item.num + " " + this.$t(item.name) + " " + "on Atomic for" + lprice + " WAX?",
            title: this.$t('Confirmation'),
            actions: {
                false: this.$t('No'),
                true: this.$t('Yes')
            },
        });
        if (res) {
            console.log("selling...");
            const res = await this.atomic_sell_nft_atomic(this.farm.account_name, item.template_id, lprice, item.num, this.farm.settings.private_key, this.farm.settings.delegated_account);
            if (res.status) {
                this.$toast.success(this.$t('Successfully put on sale') + " " + item.num + " " + this.$t(item.name) + " " + ". price:" + lprice);
                this.$store.dispatch('updateFarm', this.farm.account_name);
                setTimeout(this.updateAssetsList(),3000);
            } else {
                this.$toast.error(res.result);
            }
        } 
      }
    },        
    increment (item) {
      // console.log("inc " + JSON.stringify(item));
      item.num += 1;
      if (item.num  > item.counter ) item.num = item.counter;
    },
    decrement (item) {
      // console.log("dec " + JSON.stringify(item));
      item.num -= 1;
      if (item.num < 1 ) item.num = 1;
    },
    canExchange(item) {
      if (item.template_id=="318606" || item.template_id=="318607" || item.template_id=="298593" || item.template_id=="298612") return true;
      return false;
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
