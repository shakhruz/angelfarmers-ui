<template>
  <div>
    <v-card class="d-flex justify-start pa-1 ma-1" width="100%" 
            :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
      <v-container>
        <div class="text-h6 mt-2 ml-2">
          <v-spacer></v-spacer>{{$t('Buy AWAX')}}
          <strong>{{farm.account_name}}</strong>
        </div>
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2" align-self="center">
            <span class="text-subtitle-1 text-center">{{$t('WAX Balance')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="buy_wax=wax_balance.toFixed(2);" class="amber darken-4 white--text">
              <strong>{{formatAsset(wax_balance)}}￦</strong>
            </v-chip>
          </v-col>
        </v-row>    
        <v-row class="mt-2" dense no-gutters>
          <v-col class="mx-2 text-left">
              <span class="text-subtitle-1">{{$t('Amount')}}</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px">
                <v-text-field v-model="buy_wax" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="buy_wax=buy_wax*2>wax_balance?wax_balance.toFixed(2) : buy_wax*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="buy_wax=(buy_wax/2).toFixed(2)">
                </v-text-field>
              </div>
          </v-col>
        </v-row>  
        <v-row class="my-0" dense no-gutters>
          <v-col class="mx-2 text-left">
              <span class="text-subtitle-1">{{$t('Will receive')}}</span>
          </v-col>
          <v-col class="my-0" align-self="center">
              <div style="width:160px" class="text-center">
                <strong>{{formatAsset(buy_wax)}}₳</strong>
              </div>
          </v-col>
        </v-row>  
        <v-card-actions>
          <v-btn large @click="buyAwax()" color="primary">{{$t('BUY')}}</v-btn>
        </v-card-actions>     
        <v-divider></v-divider>
        <div class="text-h6 mt-2 ml-2">
          <v-spacer></v-spacer>{{$t('Transfer')}} AWAX {{$t('from')}}
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
            <span class="text-subtitle-1 text-center">{{$t('AWAX Balance')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="send_awax=awax_balance.toFixed(2);" class="amber darken-4 white--text">
              <strong>{{formatAsset(awax_balance)}}₳</strong>
            </v-chip>
          </v-col>
        </v-row>    
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2 text-left">
              <span class="text-subtitle-1">{{$t('Amount')}}</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="send_awax" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="send_awax=send_awax*2>awax_balance?awax_balance.toFixed(2) : send_awax*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="send_awax=(send_awax/2).toFixed(2)">
                </v-text-field>
              </div>
          </v-col>
        </v-row>  
        <v-card-actions>
          <v-btn large @click="transferAwax()" color="primary">{{$t('TRANSFER')}}</v-btn>
        </v-card-actions>        
      </v-container>
    </v-card>      
  </div>
</template>

<script>
export default {
  name: "BuyAwaxDialog",
  props: ["farm"],
  data() {
    return {  
      send_awax: 0,
      buy_wax: 0,
      all_farms_list: [],
      to_farm_account: '',
      transfer: false,
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
    async buyAwax() {  
      let to_send = Number(this.buy_wax);
      if (to_send==0) return;
      const res = await this.$dialog.confirm({
        text: this.$t("Buy")  + " " + to_send + " AWAX ?",
        title: this.$t('Confirmation'),
        actions: {
            false: this.$t('No'),
            true: this.$t('Yes')
        },
      });
      if (res) {
        this.$emit("closeDialog");
        const res = await this.send_wax(this.farm.account_name, to_send, 'awaxpresales', '', this.farm.settings.private_key, this.farm.settings.delegated_account);
        if (res.status) {
            this.$toast.success(this.$t("Successfully transferred donation"));
            await this.fb_addDonation(this.farm.account_name, to_send);
            this.$store.dispatch('updateFarmIncome', this.farm.account_name);
            this.$store.dispatch('updateFarm', this.farm.account_name);
        } else {
            this.$toast.error(res.result);
        }
      } 
    },
    async transferAwax() {
      let to_send = Number(this.send_awax);
      if (to_send==0) return;
      const res = await this.$dialog.confirm({
          text: this.$t("Transfer") + " " + to_send + " AWAX " +  this.$t("to") + " " + this.to_farm_account + " ?",
          title: this.$t('Confirmation'),
          actions: {
              false: this.$t('No'),
              true: this.$t('Yes')
          },
      });
      if (res) {
        this.$emit("closeDialog");
        const res = await this.fw_send_awax(this.farm.account_name, to_send, this.to_farm_account, '', this.farm.settings.private_key, this.farm.settings.delegated_account);
        if (res.status) {
            this.$toast.success(this.$t("Successfully transferred ") + to_send + " AWAX " + this.$t('to') + " " + this.to_farm_account );
            this.$store.dispatch('updateFarmIncome', this.farm.account_name);
            this.$store.dispatch('updateFarmIncome', this.farm.to_farm_account);
            this.$store.dispatch('updateFarm', this.farm.account_name);
            this.$store.dispatch('updateFarm', this.farm.to_farm_account);
        } else {
            this.$toast.error(res.result);
        }
      } 
    }       
  },  
  watch: {
    stake_wax: function(val) {
      if (this.stake_wax>this.wax_balance) this.stake_wax = this.wax_balance.toFixed(2);
      if (this.stake_wax<0) this.stake_wax=0;
    },
  },
  computed: {
    wax_balance: function() {
      return Math.floor(this.farm.account.wax_balance*100)/100;
    },
    awax_balance: function() {
      return Math.floor(this.farm.awax_balance*100)/100;
    }
  }
};
</script>

<style></style>
