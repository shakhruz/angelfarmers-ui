<template>
  <div>
    <v-tabs>
      <v-tab @click="transfer_mode=false;exchange_mode=true">{{$t('EXCHANGE')}}</v-tab>
      <v-tab @click="transfer_mode=true;exchange_mode=false">{{$t('TRANSFER')}}</v-tab>
    </v-tabs>
    <v-card class="d-flex justify-start pa-1 ma-1" width="100%" v-if="exchange_mode"
            :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'" >
      <v-container>
        <div class="text-h6 mt-2 ml-2">
          <v-spacer></v-spacer>{{$t('Exchange tokens on')}}
          <strong>{{farm.account_name}}</strong>
        </div>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2" align-self="center">
            <span class="text-subtitle-1 text-center">{{$t('WAX Balance')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="wax_fwg=wax_balance.toFixed(2);wax_fww=0;wax_fwf=0;" class="amber darken-4 white--text">
              <strong>{{formatAsset(wax_balance)}}￦</strong>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="wax_fww=wax_balance.toFixed(2);wax_fwg=0;wax_fwf=0" class="amber darken-4 white--text">
              <strong>{{formatAsset(wax_balance)}}￦</strong>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="wax_fwf=wax_balance.toFixed(2);wax_fwg=0;wax_fww=0" class="amber darken-4 white--text">
              <strong>{{formatAsset(wax_balance)}}￦</strong>
            </v-chip>
          </v-col>
        </v-row>    
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2 text-left">
              <span class="text-subtitle-1">{{$t('Buy Amount')}}&nbsp;￦</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="wax_fwg" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="wax_fwg=wax_fwg*2>wax_balance?wax_balance.toFixed(2) : wax_fwg*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="wax_fwg=(wax_fwg/2).toFixed(2)">
                </v-text-field>
              </div>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="wax_fww" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="wax_fww=wax_fww*2>wax_balance?wax_balance.toFixed(2) : wax_fww*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="wax_fww=(wax_fww/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="wax_fwf" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="wax_fwf=fwf_qty*2>wax_balance?wax_balance.toFixed(2) : wax_fwf*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="wax_fwf=(wax_fwf/2).toFixed(2)">
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
                {{ formatAsset(wax_fwg/farm.prices.fwg) }}&nbsp;
                <img class="token" src="/fw/FWG.png"/>
              </div>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(wax_fww/farm.prices.fww) }}&nbsp;
                <img class="token" src="/fw/FWW.png"/>
              </div>            
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(wax_fwf/farm.prices.fwf) }}&nbsp;
                <img class="token" src="/fw/FWF.png"/>
              </div>            
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="buyTokens()" color="primary">{{$t('BUY')}}</v-btn>
        </v-card-actions>        

        <v-divider></v-divider>

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
              <span class="text-subtitle-1">{{$t('Sell Amount')}}</span>
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
              <span class="text-subtitle-1">{{$t('Total tokens')}}&nbsp;￦</span>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(fwg_qty*farm.prices.fwg) }}￦
              </div>
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(fww_qty*farm.prices.fww) }}￦
              </div>            
          </v-col>
          <v-col class="mx-2 text-center">
              <div style="width:130px" v-if="farm.managed">
                {{ formatAsset(fwf_qty*farm.prices.fwf) }}￦
              </div>            
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="sellTokens()" color="primary">{{$t('SELL')}}</v-btn>
        </v-card-actions>        
      </v-container>
    </v-card>      
    <v-card class="d-flex justify-start pa-1 ma-1" width="100%" v-if="transfer_mode" 
            :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
      <v-container>
        <div class="text-h6 mt-2 ml-2">
          <v-spacer></v-spacer>{{$t('Transfer from')}}
          <strong>{{farm.account_name}}</strong>
          {{$t('to')}}
          <div style="width:200px">
            <v-select v-model="to_farm_account" dense hide-details solo
                :label="$t('Select farm')" width="100px"
                :items="all_farms_list" >
            </v-select>
          </div>
        </div>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2" align-self="center">
            <span class="text-subtitle-1 text-center">{{$t('Balances')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="fwg_t_qty=farm.tokens.fwg.toFixed(2)">
              {{formatAsset(farm.tokens.fwg)}}
              <img class="token" src="/fw/FWG2.png"/>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="fww_t_qty=farm.tokens.fww.toFixed(2)">
              {{formatAsset(farm.tokens.fww)}}
              <img class="token" src="/fw/FWW2.png"/>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="fwf_t_qty=farm.tokens.fwf.toFixed(2)">
              {{formatAsset(farm.tokens.fwf)}}
              <img class="token" src="/fw/FWF2.png"/>
            </v-chip>
          </v-col>
        </v-row>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2 text-left">
              <span class="text-subtitle-1">{{$t('Transfer Amount')}}</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="fwg_t_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="fwg_t_qty=fwg_t_qty*2>farm.tokens.fwg?farm.tokens.fwg.toFixed(2) : fwg_t_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="fwg_t_qty=(fwg_t_qty/2).toFixed(2)">
                </v-text-field>
              </div>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="fww_t_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="fww_t_qty=fww_t_qty*2>farm.tokens.fww?farm.tokens.fww.toFixed(2) : fww_t_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="fww_t_qty=(fww_t_qty/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="fwf_t_qty" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="fwf_t_qty=fwf_t_qty*2>farm.tokens.fwf?farm.tokens.fwf.toFixed(2) : fwf_t_qty*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="fwf_t_qty=(fwf_t_qty/2).toFixed(2)">
                </v-text-field>
              </div>            
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="transferTokens()" color="primary">{{$t('TRANSFER')}}</v-btn>
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
      fwg_t_qty: 0,
      fww_t_qty: 0,
      fwf_t_qty: 0,
      wax_fwg:0,
      wax_fww:0,
      wax_fwf:0,
      gold_qty: 0,
      wood_qty: 0,
      food_qty: 0,
      gold_t_qty: 0,
      wood_t_qty: 0,
      food_t_qty: 0,
      transfer_mode: false,
      exchange_mode: true,
      fwg_qty: 0,
      fww_qty: 0,
      fwf_qty: 0,
      all_farms_list: [],
      to_farm_account: ''
    };
  },
  components: {
  },
  mounted() {
    // соберем список ферм которыми можно управлять
    this.all_farms_list = [];
    this.$store.state.farms.forEach(f => {
        if (f.account_name!=this.farm.account_name) this.all_farms_list.push(f.account_name);
    })
    this.to_farm_account = this.all_farms_list[0];
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
    async transferTokens() {
      if (this.fwg_t_qty==0 && this.fww_t_qty==0 && this.fwf_t_qty==0) return;

      let amounts = []
      if (this.fwg_t_qty>0) amounts.push(this.formatAsset(this.fwg_t_qty,2) + " GOLD");
      if (this.fww_t_qty>0) amounts.push(this.formatAsset(this.fww_t_qty,2) + " WOOD");
      if (this.fwf_t_qty>0) amounts.push(this.formatAsset(this.fwf_t_qty,2) + " FOOD");
      let amount = amounts.join(', ');

      const res = await this.$dialog.confirm({
        text: this.$t("Please confirm transferring") + " " + this.$t('from') + " " + this.farm.account_name + " " + 
                amount + " " + this.$t("to") + " " + this.to_farm_account,
        title: this.$t('Confirmation'),
        actions: {
          false: this.$t('No'),
          true: this.$t('Yes')
        },            
      })
      if (res) {
          this.$emit("closeDialog");
          const res = await this.fw_transfer_all_tokens(this.farm.account_name, this.to_farm_account, 
                                                        this.fwg_t_qty, this.fww_t_qty, this.fwf_t_qty, '',
                                  this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully transferred") + " " + amount + " " +
                                  this.$t("from") + " " + this.farm.account_name + this.$t('to') + " " + this.to_farm_account);
              this.$store.dispatch('updateFarm', this.farm.account_name);
              this.$store.dispatch('updateFarm', this.to_farm_account);
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
    // BUY TOKENS WITH WAX
    async buyTokens() {
      let tokenToBuy = '';
      let amount = '';
      if (this.wax_fwg>0) {
        amount = this.formatAsset(this.wax_fwg,2);
        tokenToBuy = "FWG";
      } else {
        if (this.wax_fww>0) {
          amount = this.formatAsset(this.wax_fww,2);
          tokenToBuy = "FWW";
        } else {
          if (this.wax_fwf>0) {
            amount = this.formatAsset(this.wax_fwf,2);
            tokenToBuy = "FWF";
          }
        }
      }

      const res = await this.$dialog.confirm({
          text: this.$t("Buy") + " " + tokenToBuy + " " + this.$t("for") + " " + amount + "￦ ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
          this.$emit("closeDialog");
          let memo = "0.0000 " + tokenToBuy + "@farmerstoken";
          const res = await this.send_wax(this.farm.account_name, amount, 'alcordexmain', memo, this.farm.settings.private_key, this.farm.settings.delegated_account)
          if (res.status) {
              this.$toast.success(this.$t("Successfully placed order on Alcor Exchange"));
              this.$store.dispatch('updateFarm', this.farm.account_name);
          } else {
              this.$toast.error(res.result);
          }
      } 
    },
    // SELL TOKENS TO WAX
    async sellTokens() {
      // console.log("sell tokens " + this.tokenToSell + " amount: " + this.amountToSell);
      
      if (this.fwg_qty==0 && this.fww_qty==0 && this.fwf_qty==0) return;

      let tokenToSell = '';
      let amount = '';
      if (this.fwg_qty>0) {
        amount = this.formatAsset(this.fwg_qty,2);
        tokenToSell = "FWG";
      } else {
        if (this.fww_qty>0) {
          amount = this.formatAsset(this.fww_qty,2);
          tokenToSell = "FWW";
        } else {
          if (this.fwf_qty>0) {
            amount = this.formatAsset(this.fwf_qty,2);
            tokenToSell = "FWF";
          }
        }
      }

      const res = await this.$dialog.confirm({
          text: this.$t("Sell") + " "  + amount + " " + tokenToSell + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },            
      })
      if (res) {
          this.$emit("closeDialog");
          let memo = "0.00000000 WAX@eosio.token";
          const res = await this.fw_send_tokens(this.farm.account_name, amount, tokenToSell, 'alcordexmain',
              memo, this.farm.settings.private_key, this.farm.settings.delegated_account)
          if (res.status) {
              this.$toast.success(this.$t("Successfully placed order on Alcor Exchange"));
              this.$store.dispatch('updateFarm', this.farm.account_name);
          } else {
              this.$toast.error(res.result);
          }
      } 
    },                  
  },  
  watch: {
    wax_fwg: function(val) {
      if (val>0) {
        this.wax_fww = 0;
        this.wax_fwf = 0;
      } else {
        this.wax_fwg = 0;
      }
    },
    wax_fww: function(val) {
      if (val>0) {
        this.wax_fwg = 0;
        this.wax_fwf = 0;
      } else this.wax_fww = 0;
    },
    wax_fwf: function(val) {
      if (val>0) {
        this.wax_fwg = 0;
        this.wax_fww = 0;
      } else this.wax_fwf=0;
    },
    fwg_qty: function(val) {
      if (this.fwg_qty>this.farm.tokens.fwg) this.fwg_qty = this.farm.tokens.fwg.toFixed(2);
      if (this.fwg_qty<0) this.fwg_qty=0;
      if (this.fwg_qty>0) {this.fww_qty=0;this.fwf_qty=0;}
    },
    fww_qty: function(val) {
      if (this.fww_qty>this.farm.tokens.fww) this.fww_qty = this.farm.tokens.fww.toFixed(2);
      if (this.fww_qty<0) this.fww_qty=0;
      if (this.fww_qty>0) {this.fwg_qty=0;this.fwf_qty=0;}
    },
    fwf_qty: function(val) {
      if (this.fwf_qty>this.farm.tokens.fwf) this.fwf_qty = this.farm.tokens.fwf.toFixed(2);
      if (this.fwf_qty<0) this.fwf_qty=0;
      if (this.fwf_qty>0) {this.fwg_qty=0;this.fww_qty=0;}
    },
    fwg_t_qty: function(val) {
      if (this.fwg_t_qty>this.farm.tokens.fwg) this.fwg_t_qty = this.farm.tokens.fwg.toFixed(2);
      if (this.fwg_t_qty<0) this.fwg_t_qty=0;
    },
    fww_t_qty: function(val) {
      if (this.fww_t_qty>this.farm.tokens.fww) this.fww_t_qty = this.farm.tokens.fww.toFixed(2);
      if (this.fww_t_qty<0) this.fww_t_qty=0;
    },
    fwf_t_qty: function(val) {
      if (this.fwf_t_qty>this.farm.tokens.fwf) this.fwf_t_qty = this.farm.tokens.fwf.toFixed(2);
      if (this.fwf_t_qty<0) this.fwf_t_qty=0;
    },
  },
  computed: {
    wax_balance: function() {
      return Math.floor(this.farm.account.wax_balance*100)/100;
    }
  }
};
</script>

<style></style>
