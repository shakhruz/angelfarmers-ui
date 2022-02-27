<template>
  <div class="ma-1">
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="$store.state.farms">
                <v-card-title>
                    {{$t("All Farms")}}:
                    <span v-for="farm in $store.state.farms" class="pa-1">
                        <v-chip :class="farmBackgroundColor(farm)" :href="'#'+farm.account_name" label>
                        {{farm.account_name}}
                        </v-chip>
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click = 'addFarm()'>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn icon @click = '$store.state.pause_all=false' v-if="$store.state.pause_all">
                        <v-icon>mdi-play</v-icon>
                    </v-btn>                      
                    <v-btn icon @click = '$store.state.pause_all=true' v-else>
                        <v-icon>mdi-pause</v-icon>
                    </v-btn>      
                    <v-switch
                        v-model="$store.state.showAll"
                        :label="$t('show details')"
                        class="pa-3"
                    ></v-switch>
                </v-card-title>        
                <v-data-table
                    :headers="headersAllFarms"
                    :items="$store.state.farms"
                    item-key="account_name"
                    class="elevation-1" dense :items-per-page="50"
                >
                    <template v-slot:item.account_name="{ item }">
                        <strong>
                            <a @click.prevent="showLogs(item.account_name)">
                                {{item.account_name}}
                            </a>
                        </strong>
                        <FarmNameIcons :farm="item"/>
                    </template>
                    <template v-slot:item.daily_expense_food="{ item }">
                        <span v-if="item.daily_expense_food>0">
                            {{ minsFormatted((item.tokens.fwf + item.balance.food + item.balance.energy / 5) / 
                                  (item.daily_expense_food / 24 / 60)) }}
                        </span>
                    </template>                     
                    <template v-slot:item.next_action_date="{ item }">
                        <strong>
                            <span v-if="item.mins_to_action >= 0">
                                {{ minutesToAction(item.mins_to_action) }} 
                            </span> 
                            <span v-else-if="item.mins_to_action < 0" class="error--text">
                                {{ minutesToAction(item.mins_to_action) }} 
                            </span> 
                        </strong>                        
                    </template>
                    <template v-slot:item.next_crop_time="{ item }">
                        <CPUInfo :cpu_used="item.account.cpu_used_percent"/>
                    </template>
                    <template v-slot:item.profit_wax="{ item }">
                        <span v-if="item.profit_wax>0">
                            {{ formatAsset(item.profit_wax) }}￦
                        </span>
                    </template>
                    <template v-slot:item.profit_usd="{ item }">
                        <span v-if="item.profit_wax>0">
                            <strong>
                                ${{ formatAsset(item.profit_wax * item.prices.wax) }}
                            </strong>
                        </span>
                    </template>
                    <template v-slot:item.total_wax="{ item }">
                        {{ formatAsset(item.total_wax) }}
                    </template>                    
                    <template v-slot:item.total_usd="{ item }">
                        ${{ formatAsset(item.total_wax * item.prices.wax)}}
                    </template>                    
<!-- 
                    <template v-slot:item.income="{ item }">
                        <div v-if="item.income" class="pa-1">
                            <FarmIncome :income="item.income"/>
                        </div>                    
                    </template>    -->
                    <template v-slot:item.awax_balance="{ item }">
                        <a @click.prevent="showDonations(item.account_name)">
                            {{formatAsset( item.awax_balance )}}₳
                        </a>
                    </template>                       
                    <template v-slot:item.awax_recommended="{ item }">
                        <span v-if="calcAngelBalance(item)!=0">
                            <a @click.prevent="showDonations(item.account_name)">
                                <span v-if="calcAngelBalance(item)>0">
                                    
                                    {{formatAsset( calcAngelBalance(item) )}}￦
                                </span>
                            </a>
                        </span>                    
                    </template>   
                    <!-- <template v-slot:item.settings="{ item }">
                        <FarmSettingsDialog :farm="item" />
                        <v-btn small v-if="!item.wax_login" icon small @click="deleteFarmDialog(item.account_name)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn> 
                    </template>    -->

                    <template  v-slot:footer.prepend>
                        {{$t("TOTAL COST")}}:&nbsp; <strong>{{ formatAsset($store.state.total_cost_wax) }}￦</strong>
                        / ${{ formatAsset($store.state.total_cost_wax * $store.state.prices.wax) }}
                        &nbsp;|&nbsp;{{$t("DAILY PROFIT")}}: &nbsp;
                        <strong>{{ formatAsset($store.state.total_income_wax) }}￦</strong>
                        /
                        ${{ formatAsset($store.state.total_income_wax * $store.state.prices.wax) }}
                        &nbsp;&nbsp;| {{$t("DAILY OUTPUT")}}:&nbsp;
                        <span v-if="$store.state.daily_profits">
                            <img class="token" src="/fw/FWG2.png"/>
                            {{ formatAssetPrice($store.state.daily_profits.gold) }}&nbsp;&nbsp;
                            <img class="token" src="/fw/FWW2.png"/>
                            {{ formatAssetPrice($store.state.daily_profits.wood) }}&nbsp;&nbsp;
                            <img class="token" src="/fw/FWF2.png"/>
                            {{ formatAssetPrice($store.state.daily_profits.food) }}&nbsp;&nbsp;
                        </span>
                        <v-btn v-if="$store.state.is_checking" icon @click = '$store.dispatch("updateInfo");'>
                            <v-icon>mdi-cached</v-icon>
                        </v-btn>                      
                    </template>
                </v-data-table>
            </v-card>
        </v-col>        
    </v-row>
  </div>
</template>

<script>
import FarmSettingsDialog from "@/components/Dialogs/FarmSettingsDialog.vue";
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";
import FarmNameIcons from "@/components/FarmInfo/FarmNameIcons.vue";
import FarmIncome from "@/components/FarmInfo/FarmIncome.vue";
import FarmsSummary from "@/components/FarmInfo/FarmsSummary.vue";

const {db, calcFarmIncome} = require('@/db');

export default {
    name: "FarmsList",
    data() {
        return {
            singleSelect: false,
            headersAllFarms: [
                { text: '', value: 'num', width: "10px" },
                { text: this.$t('Account'), value: 'account_name' },
                { text: this.$t('Next action'), value: 'next_action_date', align: 'end', width: "140px" },
                { text: this.$t('CPU'), value: 'next_crop_time', width: "80px" },
                { text: this.$t('Energy'), value: 'daily_expense_food', align: 'end', width: "120px" },
                { text: this.$t('Profit'), value: 'profit_wax', align: 'end', width: "100px" },
                { text: this.$t('Profit USD'), value: 'profit_usd', align: 'end', width: "100px" },
                { text: this.$t('Value ￦'), value: 'total_wax', align: 'end', width: "100px" },
                { text: this.$t('Value USD'), value: 'total_usd', align: 'end', width: "100px" },
                { text: this.$t('Angel Balance'), value: 'awax_balance' },
                { text: this.$t('Recommended donation'), value: 'awax_recommended', width: "150px" },
                // { text: '', value: 'settings'},
            ],                                    
        }
    },
    components: {
        FarmSettingsDialog, CPUInfo, FarmNameIcons, FarmIncome, FarmsSummary
    },
    methods: {  
        showLogs(account_name) {
            this.$router.push(`/farm/${account_name}/logs`); 
        },
        showDonations(account_name) {
            this.$router.push(`/farm/${account_name}/donations`); 
        },        
        async addFarm() {
            let res = await this.$dialog.prompt({
                text: this.$t("farm account or accounts, separated by ','"),
                title: this.$t('Please input new farm account name'),
            })
            if (res) {
                console.log("farms: " + res);
                const farms = res.trim().split(',');
                farms.forEach(ff => {
                    // проверим нет ли еще этой фермы в списке       
                    this.$store.dispatch("addFarm", ff.trim());
                })      
            }
        },
    },
    mounted() {
    },
};
</script>

<style></style>
