<template>
  <div>
    <v-card class="d-flex justify-start pa-1 ma-1" width="100%" :color="$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'">
      <v-container>
        <div class="text-h6 mt-2 ml-2">
          <v-spacer></v-spacer>{{$t('Stake CPU')}}
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
            <span class="text-subtitle-1 text-center">{{$t('WAX Balance')}}</span>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
            <v-chip label @click="stake_wax=wax_balance.toFixed(2);" class="amber darken-4 white--text">
              <strong>{{formatAsset(wax_balance)}}￦</strong>
            </v-chip>
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
          </v-col>
          <v-col class="mx-2 text-center" align-self="center">
          </v-col>
        </v-row>    
        <v-row class="mt-2" dense no-gutters>
          <v-col class="ma-2 text-left">
              <span class="text-subtitle-1">{{$t('Stake amount')}}</span>
          </v-col>
          <v-col class="mx-2" align-self="center">
              <div style="width:160px" v-if="farm.managed">
                <v-text-field v-model="stake_wax" clearable dense solo
                      append-outer-icon="mdi-plus" 
                      @click:append-outer="stake_wax=stake_wax*2>wax_balance?wax_balance.toFixed(2) : stake_wax*2" 
                      prepend-icon="mdi-minus" 
                      @click:prepend="stake_wax=(stake_wax/2).toFixed(2)">
                </v-text-field>
              </div>
              <div>
                  <v-checkbox dense v-model="transfer" 
                    :label="$t('Transfer WAX')" class="ma-0 pa-0">
                  </v-checkbox>
              </div>
          </v-col>
          <v-col class="mx-2" align-self="center">
          </v-col>
          <v-col class="mx-2" align-self="center">
          </v-col>
        </v-row>  
        <v-card-actions>
          <v-btn large @click="stake()" color="primary">{{$t('STAKE')}}</v-btn>
        </v-card-actions>        
      </v-container>
    </v-card>      
  </div>
</template>

<script>
export default {
  name: "CPUStakeDialog",
  props: ["farm"],
  data() {
    return {  
      stake_wax: 0,
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
        this.all_farms_list.push(f.account_name);
    })
    this.to_farm_account = this.all_farms_list[0];
  },
  methods: { 
    async stake() {
      if (this.stake_wax==0) return;

      const res = await this.$dialog.confirm({
        text: this.$t("Stake ") + " " + this.stake_wax + " WAX " + this.$t("to") + " " + this.to_farm_account,
        title: this.$t('Confirmation'),
        actions: {
          false: this.$t('No'),
          true: this.$t('Yes')
        },            
      })
      if (res) {
          this.$emit("closeDialog");
          const res = await this.fw_stake_cpu(this.farm.account_name, this.to_farm_account, 
                                              this.stake_wax, this.transfer, this.farm.settings.private_key, this.farm.settings.delegated_account);
          if (res.status) {
              this.$toast.success(this.$t("Successfully staked") + " " + this.stake_wax + " WAX " +
                                  this.$t('to') + " " + this.to_farm_account);
              this.$store.dispatch('updateFarm', this.farm.account_name);
              this.$store.dispatch('updateFarm', this.to_farm_account);
          } else {
              this.$toast.error(res.result);
          }
      } 
    },              
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
    }
  }
};
</script>

<style></style>
