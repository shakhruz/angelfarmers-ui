<template>
  <div>
    <v-tabs>
      <v-tab @click="withdraw_mode=true;deposit_mode=false">{{$t('WITHDRAW')}}</v-tab>
      <v-tab @click="withdraw_mode=false;deposit_mode=true">{{$t('DEPOSIT')}}</v-tab>
    </v-tabs>
    <v-card class="d-flex justify-start pa-1 ma-1" width="100%" 
          v-if="withdraw_mode" :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
      <v-container>
        <div>
          <v-chip label :class="getWithdrawFeeColor($store.state.config.fee)">
            {{$t('Fee')}}: {{ $store.state.config.fee }}%
          </v-chip>
          {{$t('Fee will be updated every hour')}}
          <br/>
          <small class="ml-2">
            {{ minsPassedFormat($store.state.config.last_fee_updated) }} {{$t('Minutes passed since started')}}
          </small>
        </div>
        <div class="text-h6 mt-2">
          <v-spacer></v-spacer>{{$t('Withdraw from')}}
          <strong>{{farm.account_name}}</strong>
        </div>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2" align-self="center">
            <span class="text-subtitle-1 text-center">{{$t('Balances')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="gold_qty=farm.balance.gold.toFixed(2)">
              {{formatAsset(farm.balance.gold)}}
              <img class="token" src="/fw/FWG2.png"/>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="wood_qty=farm.balance.wood.toFixed(2)">
              {{formatAsset(farm.balance.wood)}}
              <img class="token" src="/fw/FWW2.png"/>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="food_qty=farm.balance.food.toFixed(2)">
              {{formatAsset(farm.balance.food)}}
              <img class="token" src="/fw/FWF2.png"/>
            </v-chip>
          </v-col>
        </v-row>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2 text-left">
              <span class="text-subtitle-1">{{$t('Withdrawal Amount')}}</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="gold_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="gold_qty=gold_qty*2>farm.balance.gold?farm.balance.gold.toFixed(2) : gold_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="gold_qty=(gold_qty/2).toFixed(2)">
                </v-text-field>
              </div>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="wood_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="wood_qty=wood_qty*2>farm.balance.wood?farm.balance.wood.toFixed(2) : wood_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="wood_qty=(wood_qty/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="food_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="food_qty=food_qty*2>farm.balance.food?farm.balance.food.toFixed(2) : food_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="food_qty=(food_qty/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
        </v-row>
        <v-row no-gutters dense>
          <v-col class="mx-2"  align-self="center">
              <span class="text-subtitle-1">{{$t('Total tokens')}}</span>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(gold_t_qty) }}
              </div>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(wood_t_qty) }}
              </div>            
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(food_t_qty) }}
              </div>            
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="withdrawTokens()" color="primary">{{$t('WITHDRAW')}}</v-btn>
        </v-card-actions>        
      </v-container>
    </v-card>
    <v-card class="d-flex justify-start pa-1 ma-1" width="100%" v-if="deposit_mode" 
            :color="this.$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
      <v-container>
        <div class="text-h6 mt-2">
          <v-spacer></v-spacer>{{$t('Deposit to')}}
          <strong>{{farm.account_name}}</strong>
        </div>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2" align-self="center">
            <span class="text-subtitle-1 text-center">{{$t('Token Balances')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="fwg_qty=farm.tokens.fwg.toFixed(2)">
              {{formatAsset(farm.tokens.fwg)}}
              <img class="token" src="/fw/FWG.png"/>&nbsp;
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="fww_qty=farm.tokens.fww.toFixed(2)">
              {{formatAsset(farm.tokens.fww)}}
              <img class="token" src="/fw/FWW.png"/>&nbsp;
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="fwf_qty=farm.tokens.fwf.toFixed(2)">
              {{formatAsset(farm.tokens.fwf)}}
              <img class="token" src="/fw/FWF.png"/>&nbsp;
            </v-chip>
          </v-col>
        </v-row>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2 text-left">
              <span class="text-subtitle-1">{{$t('Deposit Amount')}}</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="fwg_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="fwg_qty=fwg_qty*2>farm.tokens.fwg?farm.tokens.fwg.toFixed(2) : fwg_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="fwg_qty=(fwg_qty/2).toFixed(2)">
                </v-text-field>
              </div>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="fww_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="fww_qty=fww_qty*2>farm.tokens.fww?farm.tokens.fww.toFixed(2) : fww_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="fww_qty=(fww_qty/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="fwf_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="fwf_qty=fwf_qty*2>farm.tokens.fwf?farm.tokens.fwf.toFixed(2) : fwf_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="fwf_qty=(fwf_qty/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
        </v-row>
        <v-row no-gutters dense>
          <v-col class="mx-2"  align-self="center">
              <span class="text-subtitle-1">{{$t('Total tokens')}}</span>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(fwg_qty) }}
              </div>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(fww_qty) }}
              </div>            
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(fwf_qty) }}
              </div>            
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="depositTokens()" color="primary">{{$t('DEPOSIT')}}</v-btn>
        </v-card-actions>        
      </v-container>
    </v-card>    
  </div>
</template>

<script>
export default {
  name: "FarmDepositDialog",
  props: ["farm"],
  data() {
    return {  
      gold_qty: 0,
      wood_qty: 0,
      food_qty: 0,
      gold_t_qty: 0,
      wood_t_qty: 0,
      food_t_qty: 0,
      withdraw_mode: true,
      deposit_mode: false,
      fwg_qty: 0,
      fww_qty: 0,
      fwf_qty: 0,
    };
  },
  components: {
  },
  mounted() {
  },
  methods: { 
    getWithdrawFeeColor(fee) {
      switch(fee) {
        case 5: return "green lighten-2 white--text";
        case 6: return "green darken-2 white--text";
        case 7: return "red lighten-2 white--text";
        case 8: return "red darken-2 white--text";
      }
    },
    async withdrawTokens() {
      if (this.gold_qty==0 && this.wood_qty==0 && this.food_qty==0) return;

      let amounts = []
      if (this.gold_qty>0) amounts.push(this.formatAsset(this.gold_qty,2) + " GOLD");
      if (this.wood_qty>0) amounts.push(this.formatAsset(this.wood_qty,2) + " WOOD");
      if (this.food_qty>0) amounts.push(this.formatAsset(this.food_qty,2) + " FOOD");
      let amount = amounts.join(', ');

      const res = await this.$dialog.confirm({
        text: this.$t("Please confirm withdrawing") + " " + amount + " " +
        this.$t("from the game"),
        title: this.$t('Confirmation'),
        actions: {
          false: this.$t('No'),
          true: this.$t('Yes')
        },            
      })
      if (res) {
          this.$emit("closeDialog");
          const res = await this.fw_withdraw_all_tokens(this.farm.account_name, this.gold_qty, this.wood_qty, this.food_qty, 
                this.$store.state.config.fee, this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully withdrawn") + " " + amount + " " +
                                  this.$t("from") + " " + this.farm.account_name);
              this.$store.dispatch('updateFarm', this.farm.account_name);
          } else {
              this.$toast.error(res.result);
          }
      } 
    },  
    async depositTokens() {
      if (this.fwg_qty==0 && this.fww_qty==0 && this.fwf_qty==0) return;

      let amounts = []
      if (this.fwg_qty>0) amounts.push(this.formatAsset(this.fwg_qty,2) + " FWG");
      if (this.fww_qty>0) amounts.push(this.formatAsset(this.fww_qty,2) + " FWW");
      if (this.fwf_qty>0) amounts.push(this.formatAsset(this.fwf_qty,2) + " FWF");
      let amount = amounts.join(', ');

      const res = await this.$dialog.confirm({
        text: this.$t("Please confirm depositing") + " " + amount + " " +
        this.$t("into the game"),
        title: this.$t('Confirmation'),
        actions: {
          false: this.$t('No'),
          true: this.$t('Yes')
        },            
      })
      if (res) {
          this.$emit("closeDialog");
          const res = await this.fw_deposit_all_tokens(this.farm.account_name, this.fwg_qty, this.fww_qty, this.fwf_qty, 
                 this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully deposited") + " " + amount + " " +
                                  this.$t("to") + " " + this.farm.account_name);
              this.$store.dispatch('updateFarm', this.farm.account_name);
          } else {
              this.$toast.error(res.result);
          }
      } 
    },              
  },
  watch: {
    gold_qty(val, oldval) {
      this.gold_qty = this.gold_qty > this.farm.balance.gold ? this.farm.balance.gold : this.gold_qty;
      if (this.gold_qty<0) this.gold_qty = 0;

      this.gold_t_qty = (100 - this.$store.state.config.fee) / 100 * this.gold_qty;
    },
    wood_qty(val, oldval) {
      this.wood_qty = this.wood_qty > this.farm.balance.wood ? this.farm.balance.wood : this.wood_qty;
      if (this.wood_qty<0) this.wood_qty = 0;
      this.wood_t_qty = (100 - this.$store.state.config.fee) / 100 * this.wood_qty;
    },
    food_qty(val, oldval) {
      this.food_qty = this.food_qty > this.farm.balance.food ? this.farm.balance.food : this.food_qty;
      if (this.food_qty<0) this.food_qty = 0;
      this.food_t_qty = (100 - this.$store.state.config.fee) / 100 * this.food_qty;
    },

    fwg_qty(val, oldval) {
      this.fwg_qty = this.fwg_qty > this.farm.tokens.fwg ? this.farm.tokens.fwg  : this.fwg_qty;
      if (this.fwg_qty<0) this.fwg_qty = 0;
    },
    fww_qty(val, oldval) {
      this.fww_qty = this.fww_qty > this.farm.tokens.fww ? this.farm.tokens.fww : this.fww_qty;
      if (this.fww_qty<0) this.fww_qty = 0;
    },
    fwf_qty(val, oldval) {
      this.fwf_qty = this.fwf_qty > this.farm.tokens.fwf ? this.farm.tokens.fwf : this.fwf_qty;
      if (this.fwf_qty<0) this.fwf_qty = 0;
    },
  },
};
</script>

<style></style>
