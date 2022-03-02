<template>
  <div class="ma-1">
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="all_farms">
                <v-card-title>
                    {{$t("All Farms")}}:
                    <v-spacer></v-spacer>
                    <v-btn icon @click = 'updateAllFarmsList()'>
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>                      
                </v-card-title>        
                <v-card-subtitle>
                    <strong>{{all_farms.length}}</strong> |
                    {{$t("TOTAL BALANCE")}}: {{ formatAsset(total_balance_wax) }}￦ &nbsp;
                    <strong>(${{ formatAsset(total_balance_usd) }})</strong> &nbsp;
                    <!-- (<strong>${{ formatAsset(-total_balance_wax * $store.state.prices.wax) }}</strong>) &nbsp;|&nbsp; -->
                    {{$t("TOTAL DAILY PROFIT")}}: {{ formatAsset(total_profit_wax )}}￦ 
                    ($<strong>{{ formatAsset(total_profit_usd)}}</strong>)
                </v-card-subtitle>
                <v-data-table
                    :headers="headersAllFarms"
                    :items="farmsWithIndex"
                    item-key="account_name" 
                    class="elevation-1" dense :items-per-page="50"
                >
                    <template v-slot:item.num="{ item }">
                        <strong>
                            {{item.index}}
                        </strong>
                    </template>
                    <template v-slot:item.account_name="{ item }">
                        <strong>
                            <a @click.prevent="addFarm(item.account_name)">
                                {{item.account_name}}
                            </a>
                        </strong>
                    </template>
                    <template v-slot:item.food="{ item }">
                        <span v-if="item.food">
                            {{ minsFormatted(item.food) }}
                        </span>
                    </template>                     
                    <template v-slot:item.mins_to_action="{ item }">
                        <strong>
                            <span v-if="item.mins_to_action >= 0">
                                {{ minutesToAction(item.mins_to_action) }} 
                            </span> 
                            <span v-else-if="item.mins_to_action < 0" class="error--text">
                                {{ minutesToAction(item.mins_to_action) }} 
                            </span> 
                        </strong>                          
                    </template>
                    <template v-slot:item.cpu_used="{ item }">
                        <CPUInfo :cpu_used="item.cpu_used"/>
                    </template>
                    <template v-slot:item.profit_wax="{ item }">
                        <span v-if="item.profit_wax>0">
                            {{ formatAsset(item.profit_wax) }}￦
                        </span>
                    </template>
                    <template v-slot:item.profit_usd="{ item }">
                        <span v-if="item.profit_usd>0">
                            ${{ formatAsset(item.profit_usd) }}
                        </span>
                    </template>
                    <template v-slot:item.total_wax="{ item }">
                        {{ formatAsset(item.total_wax) }}
                    </template>                    
                    <template v-slot:item.total_usd="{ item }">
                        ${{ formatAsset(item.total_usd) }}
                    </template>                    
                    <template v-slot:item.income="{ item }">
                        <div v-if="item.income" class="pa-1">
                            <FarmIncome :income="item.income"/>
                        </div>                    
                    </template>   
                    <template v-slot:item.balance_awax="{ item }">
                        <span v-if="item.awax_balance">
                            {{ formatAsset(item.awax_balance) }}￦
                        </span>                    
                    </template>   

                    <template v-slot:item.last_update="{ item }">
                        <span v-if="item.last_update" :class="(Date.now() / 1000 - item.last_update.seconds)/60>1 ? 'red--text' : ''">                            
                            {{ minsFormatted((Date.now() / 1000 - item.last_update.seconds)/60) }}
                        </span>
                    </template>                     

                    <template  v-slot:footer.prepend>
                        {{$t("TOTAL BALANCE")}}: {{ formatAsset(total_balance_wax) }}￦ &nbsp;
                        <strong>(${{ formatAsset(total_balance_usd) }})</strong> &nbsp;
                        <!-- (<strong>${{ formatAsset(-total_balance_wax * $store.state.prices.wax) }}</strong>) &nbsp;|&nbsp; -->
                        {{$t("TOTAL DAILY PROFIT")}}: {{ formatAsset(total_profit_wax )}}￦ 
                        ($<strong>{{ formatAsset(total_profit_usd)}}</strong>)&nbsp;|&nbsp;
                        <!-- <FarmIncome :income="total_income"/> -->
                        <v-btn icon @click = 'updateAllFarmsList()'>
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
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";
import FarmIncome from "@/components/FarmInfo/FarmIncome.vue";

const {db, calcFarmIncome} = require('@/db');

export default {
    name: "FarmsList",
    data() {
        return {
            all_farms: [],
            total_balance_wax: 0,
            total_balance_usd: 0,
            total_profit_wax: 0,
            total_profit_usd: 0,
            total_income: {wood:0, food:0, gold:0, barley:0, eggs:0, milk:0, corn:0},
            headersAllFarms: [
                { text: '', value: 'num', width: "10px" },
                { text: this.$t('Account'), value: 'account_name', width: "150px" },
                { text: this.$t('Value USD'), value: 'total_usd', align: 'end', width: "100px" },
                { text: this.$t('Value ￦'), value: 'total_wax', align: 'end', width: "100px" },
                { text: this.$t('Profit'), value: 'profit_wax', align: 'end', width: "100px" },
                { text: this.$t('Profit USD'), value: 'profit_usd', align: 'end', width: "100px"},
                // { text: this.$t('Food'), value: 'food', align: 'end', width: "120px" },
                // { text: this.$t('Income'), value: 'income' },
                // { text: this.$t('Angel Balance'), value: 'balance_awax' },
                { text: this.$t('CPU'), value: 'cpu_used', width: "80px" },
                { text: this.$t('Next action'), value: 'mins_to_action', align: 'end', width: "140px" },
                { text: this.$t('Last Update'), value: 'last_update' },
            ],                                    
        }
    },
    components: {
        CPUInfo, FarmIncome
    },
    methods: {  
        // Получить списоу всех ферм и их состояний, просчитать общий итог
        updateAllFarmsList() {
            let farms = [];
            this.total_income = {wood:0, food:0, gold:0, barley:0, eggs:0, milk:0, corn:0};
            this.total_profit_wax = 0;
            this.total_profit_usd = 0;
            this.total_balance_wax = 0;
            let num = 1;
            try {
                db.collection('farm_state').get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let item = doc.data();
                        item.num=num++;
                        farms.push(item);

                        this.total_balance_wax += item.total_wax;
                        this.total_balance_usd += item.total_usd;
                        this.total_profit_wax += item.profit_wax;
                        this.total_profit_usd += item.profit_usd;

                        if (item.income) {
                            if (item.income.wood) this.total_income.wood += item.income.wood;
                            if (item.income.food) this.total_income.food += item.income.food;
                            if (item.income.gold) this.total_income.gold += item.income.gold;
                            if (item.income.barley) this.total_income.barley += item.income.barley;
                            if (item.income.corn) this.total_income.corn += item.income.corn;
                            if (item.income.eggs) this.total_income.eggs += item.income.eggs;
                            if (item.income.milk) this.total_income.milk += item.income.milk;
                        } 
                    })
                    this.all_farms = farms.sort((a,b)=> b.profit_usd - a.profit_usd);
                });
            } catch (error) {
                console.log("ОШИБКА при получении списка всех ферм :" + error);
            }  
        },
        async addFarm(account_name) {
            const res = await this.$dialog.confirm({
                text: this.$t("Add") + " " + account_name + this.$t(" farm to your list?"),
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },
            });
            if (res) {
                this.$store.dispatch("addFarm", account_name);            
            }
        }
    },
    mounted() {
        this.updateAllFarmsList();
    },
    computed: {
        farmsWithIndex: function () {
            return this.all_farms.map(
                (items, index) => ({...items,index: index + 1}))
        }
    },
};
</script>

<style></style>
