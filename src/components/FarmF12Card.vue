<template>
    <v-card 
        :id="farm.account_name"
        elevation="2" raised rounded="lg"
        outlined :color="$vuetify.theme.dark ? 'grey darken-3' : 'rgb(215 248 255)'"
        :min-width="$vuetify.breakpoint.mobile ? '390px' : '430px'"
        :max-width="$vuetify.breakpoint.mobile ? '400px' : '530px'"
        v-if="farm!=null && farm.account!=null">
        <v-card-title class="mt-0 pt-0 mb-n3 pt-0">
            <div class="mt-n10">
                <v-chip label @click="$clipboard(farm.account_name);" :color="farmBackgroundColor(farm) + ' white--text' "
                    close @click:close="deleteFarmDialog(farm.account_name)">
                    <span class="text-h6">
                        {{ farm.account_name }}
                    </span>
                </v-chip>
            </div>
            <div class="ml-6 mb-0 pt-0">
                <small>{{$t("Balance")}}</small><br/>
                <v-chip label large class="amber darken-4 white--text pa-2 text-center">
                    <span>
                        {{ formatAsset(farm.account.wax_balance) }}￦<br/>
                        <!-- <small>{{formatAsset( farm.awax_balance )}}₳</small> -->
                    </span>
                </v-chip>
            </div>
            <div class="ml-3 mb-0 pt-0">
                <span v-if="farm.managed">
                    <FarmCPUButton :farm="farm"  /><br/>
                    <BuyAwaxButton :farm="farm" />
                </span>
                <span v-else>
                    <v-chip small label class="amber darken-4 white--text">
                        {{ formatAsset(farm.account.wax_staked) }}￦
                    </v-chip>
                </span>
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle class="mt-1 mb-0 pt-0 pb-1">
            <div>
                <span>
                    {{$t('CPU')}}: 
                    <v-chip label x-small :color="getCPUColor(farm.account.cpu_used_percent) + ' white--text'">
                        <strong>{{ formatAsset(farm.account.cpu_used_percent, 0) }}%</strong>
                    </v-chip>
                </span>
                &nbsp;
                <v-progress-linear class="mt-1" :color="getCPUColor(farm.account.cpu_used_percent)" rounded 
                    :value="farm.account.cpu_used_percent">
                </v-progress-linear>
                <div v-if="farm.daily_expense_food>0" class="mt-2 mb-1">
                    {{$t("Energy")}}:
                    <v-chip label small :color="getEnergyColor(farm)">
                        <strong>
                            {{ farm.balance.energy }} / {{ farm.balance.max_energy }}
                        </strong>
                    </v-chip>
                    {{$t("Energy enough")}}:
                    <v-chip label small :color="getEnergyMinsColor(farm)">
                        <strong>
                        {{ minsFormatted((farm.tokens.fwf + farm.balance.food + farm.balance.energy / 5) / 
                                    (farm.daily_expense_food / 24 / 60)) }}
                        </strong>
                    </v-chip>
                    <v-progress-linear class="mt-1" :color="getEnergyColor(farm)" rounded 
                        :value="farm.balance.energy / farm.balance.max_energy * 100">
                    </v-progress-linear>
                    <div v-if="farm.tools.daily_expense_gold>0" class="mt-2">
                        {{$t("Gold enough")}}:
                        <v-chip label small :color="getGoldMinsColor(farm)">
                            <strong>
                            {{ minsFormatted((farm.balance.gold) / 
                                        (farm.tools.daily_expense_gold / 24 / 60)) }}
                            </strong>
                        </v-chip>
                        <v-progress-linear class="mt-1" :color="getGoldMinsColor(farm)" rounded 
                            :value="farm.balance.gold / farm.tools.daily_expense_gold * 100">
                        </v-progress-linear>
                    </div>
                </div>  
            </div>
        </v-card-subtitle>
        <v-divider class="mx-1"></v-divider> 
        <v-card-actions class="mb-0 pt-0 pb-1 mt-0">
            <span v-if="farm.managed">
                <v-btn icon v-if="farm.settings.pause_all_actions" @click = '$store.commit("pauseFarm", {account_name: farm.account_name, paused: false})'>
                    <v-icon>mdi-play</v-icon>
                </v-btn>        
                <v-btn icon v-else @click = '$store.commit("pauseFarm", {account_name: farm.account_name, paused: true})'>
                    <v-icon>mdi-pause</v-icon>
                </v-btn>        
            </span>
            <v-btn icon @click = '$store.dispatch("updateFarm", farm.account_name);checkFarmActions(farm.account_name)'>
                <v-icon>mdi-cached</v-icon>
            </v-btn>                            
            <FarmMarketButton :farm="farm" v-if="farm.managed"/>
            <FarmCraftButton :farm="farm" v-if="farm.managed"/>
            <FarmDepositButton :farm="farm" v-if="farm.managed"/>
            <FarmTokensButton :farm="farm" v-if="farm.managed"/>
            <v-spacer></v-spacer>
            <v-btn small @click = 'showSettingsCard()' v-if="farm.settings.hide">
                {{$t('settings')}}
            </v-btn>                            
            <v-btn small @click = 'showSettingsCard()' v-if="!farm.settings.hide" outlined>
                {{$t('settings')}}
            </v-btn>                            
        </v-card-actions>           
        <v-divider class="mx-1"></v-divider>    
        <v-card-subtitle class="mb-0 pt-0 pb-1 mt-0">
            <div>
                <div class="mt-1">
                    <div>
                        {{$t('Next')}}:
                        <v-chip label small>
                            <strong>
                                <span v-if="minsToAction >= 0" class="green--text">
                                    {{ minutesToAction(minsToAction) }} 
                                </span> 
                                <span v-else-if="minsToAction < 0" class="red--text">
                                    <strong>
                                        {{ minutesToAction(minsToAction) }} 
                                    </strong>
                                </span> 
                            </strong>
                        </v-chip>
                        <span v-if="minsToAction >= 0" class="green--text">
                            {{ farm.next_action }}
                        </span>
                        <span v-else-if="minsToAction < 0" class="red--text">
                            {{ farm.next_action }}
                        </span>
                    </div>
                </div>
            </div>
        </v-card-subtitle>
        <v-divider class="mx-1"></v-divider>    
        <FarmStats :farm="farm"/>
        <v-divider class="mx-1"></v-divider> 
        <v-card-subtitle class="mb-0 pb-0 mt-0 pt-1">
            <v-row no-gutters dense>
                <v-col>
                    {{$t('Gear value')}}: 
                </v-col>
                <v-col align="end" class="pr-2">
                    {{ formatAsset(farm.total_wax)}}￦
                </v-col>
                <v-col align="end" class="pr-2">
                    ${{ formatAsset(farm.total_wax*farm.prices.wax)}}                    
                </v-col>
            </v-row>
            <v-row v-if="farm.profit_wax>0" no-gutters dense>
                <v-col>
                    <strong>{{$t("Daily Profit")}}: </strong>
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>{{ formatAssetPrice(farm.profit_wax)  }}￦</strong> 
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>${{ formatAssetPrice(farm.profit_wax * farm.prices.wax)  }}</strong>
                </v-col>
            </v-row>
            <v-row v-if="farm.profit_wax>0" class="mb-2" no-gutters dense>
                <v-col>
                    {{$t("ROI")}}: 
                </v-col>
                <v-col align="end" class="pr-2">
                    {{ formatAssetPrice(farm.profit_wax / farm.total_wax * 100)  }}%
                </v-col>
                <v-col align="end" class="pr-2">
                    {{ formatAssetPrice(farm.total_wax / farm.profit_wax)  }} {{$t('days')}}
                </v-col>
            </v-row>
        </v-card-subtitle>   
        <FarmChest :farm="farm" />             
        <v-divider></v-divider>
        <v-card-subtitle class="mt-0 pt-1 mb-0 pb-1">
            <span>
                {{$t('AF Balance')}}:
                <span :class="angelBalance.donate>0? 'red--text' : 'green--text'">
                    {{formatAsset( -angelBalance.donate )}}₳
                </span>                
                &nbsp;&nbsp;
                {{$t('Available')}}:
                <span class="green--text">
                    {{formatAsset( farm.awax_balance )}}₳
                </span>          
                &nbsp;
                <SmallBuyAwaxButton :farm="farm" v-if="farm.managed"/>      
            </span>
            <div v-if="farm.income" class="py-0">
                {{$t('Collected income')}}:
                ~{{formatAsset( angelBalance.total_wax )}}￦
                &nbsp;&nbsp;
                (5%: {{formatAsset( angelBalance.balance_wax )}}￦)
                <!-- {{$t('Donated')}}: {{farm.donations}}￦ -->
                <div class="mx-n1 px-0">
                    <FarmIncome :income="farm.income"/>
                </div>
            </div>                    
        </v-card-subtitle>
    </v-card>
</template>

<script>
import FarmStats from "@/components/FarmInfo/FarmStats.vue";
import FarmChest from "@/components/FarmInfo/FarmChest.vue";
import FarmMarketButton from "@/components/Buttons/FarmMarketButton.vue";
import FarmCraftButton from "@/components/Buttons/FarmCraftButton.vue";
import FarmDepositButton from "@/components/Buttons/FarmDepositButton.vue";
import FarmTokensButton from "@/components/Buttons/FarmTokensButton.vue";
import FarmCPUButton from "@/components/Buttons/FarmCPUButton.vue";
import BuyAwaxButton from "@/components/Buttons/BuyAwaxButton.vue";
import SmallBuyAwaxButton from "@/components/Buttons/SmallBuyAwaxButton.vue";
import FarmIncome from "@/components/FarmInfo/FarmIncome.vue";

export default {
  name: "FarmF12Card",
  props: ['farm', 'index'],
  data: () => ({
    show: true,
    showDetails: true,
    showSettings: true,
  }),
  mounted() {
  },
  methods: {
      toolProgress(tool) {
          let hour = 60;
          if (tool["template_id"] == "378691") hour = 120;
          let progress = (100 - tool.claim_mins/hour*100);
          if (progress>100) progress = 100;
          if (progress<0) progress = 0;
          return progress;
      },
      toolTitle(tool) {
          return tool.name;
      },
      assetTitle(asset) {
          return asset.name;
      },
      animalTitle(animal) {
          return animal.name;
      },
      mbsTitle(member) {
          return member.name;
      },
      buildingTitle(building) {
          return building.name;
      },
      // прогресс постройки в %
      buildingProgress(building) {
          return (building.times_claimed / building.max_claims * 100);
      },
      getEnergyMinsColor(f) {
          if (f.tokens && f.balance && f.daily_expense_food) {
              let energy_mins = (f.tokens.fwf + f.balance.food + f.balance.energy / 5) / (f.daily_expense_food / 24 / 60);
              return energy_mins > 60*12 ? 'green white--text' : 'red white--text';
          } 
          return '';
      },
      getEnergyColor(f) {
          if (f.balance) {
              return f.balance.energy / f.balance.max_energy > 0.5 ? 'green white--text' : 'red white--text';
          } 
          return '';
      },
      getGoldMinsColor(f) {
          if (f.balance) {
              return f.balance.gold / f.tools.daily_expense_gold > 0.5 ? 'green white--text' : 'red white--text';
          } 
          return '';
      },
      showSettingsCard() {
        // console.log("!!! show settings: " + this.$store.state.farms[this.index].settings.hide);
        this.$store.state.farms[this.index].settings.hide = !this.$store.state.farms[this.index].settings.hide;
        this.$store.dispatch("saveFarms");
      }

  },
  computed: {
      minsToAction: function() {
            const nowTime = new Date();
            if (this.farm.next_action_date==null) return null;
            return Math.round((this.farm.next_action_date - nowTime)/1000/60);
      },
      angelBalance: function () {
          return this.calcAngelBalance(this.farm);
      }
  },
  components: {
    FarmStats, FarmChest, FarmMarketButton, FarmCraftButton, FarmDepositButton, FarmTokensButton, 
    FarmCPUButton, FarmIncome, BuyAwaxButton, SmallBuyAwaxButton
  },    
};
</script>

<style scoped lang="scss">
</style>
