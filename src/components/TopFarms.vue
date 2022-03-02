<template>
  <div>
    <v-row> 
        <v-col>
            <v-card v-if="all_farms" elevation="2" 
        :min-width="$vuetify.breakpoint.mobile ? '380px' : '420px'"
        :max-width="$vuetify.breakpoint.mobile ? '380px' : '420px'"
    class="justify-center" raised rounded="lg"
    :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'teal darken-1 white--text'">
                <v-card-title>
                    {{$t("Top Farms")}}
                    <v-spacer></v-spacer>
                    <v-btn icon @click = 'updateAllFarmsList()'>
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>                      
                </v-card-title>        
                <v-card-subtitle class="white--text">
                    {{$t("Total Farms")}}:
                    <strong>{{all_farms.length}}</strong><br/>
                    {{$t("TOTAL BALANCE")}}: {{ formatAsset(total_balance_wax) }}￦
                    <strong>(${{ formatAsset(total_balance_usd) }})</strong><br/>
                    {{$t("TOTAL AWAX BALANCE")}}: <strong>{{ formatAsset(total_awax_balance) }}₳</strong><br/>
                </v-card-subtitle>
                <v-data-table
                    :headers="headersAllFarms"
                    :items="farmsWithIndex"
                    item-key="account_name" 
                    class="elevation-1" dense :items-per-page="10"
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
                    <template v-slot:item.profit_usd="{ item }">
                        <span v-if="item.profit_usd>0">
                            <strong>${{ formatAsset(item.profit_usd) }}</strong>
                        </span>
                    </template>
                    <template v-slot:item.awax_balance="{ item }">
                        <span v-if="item.awax_balance">
                            {{ formatAsset(item.awax_balance) }}₳
                        </span>                    
                    </template>   
                </v-data-table>
            </v-card>
        </v-col>        
    </v-row>
  </div>
</template>

<script>
const {db, calcFarmIncome} = require('@/db');

export default {
    name: "TopFarms",
    data() {
        return {
            all_farms: [],
            total_balance_wax: 0,
            total_balance_usd: 0,
            total_awax_balance: 0,
            headersAllFarms: [
                { text: '', value: 'num', width: "10px" },
                { text: this.$t('Account'), value: 'account_name', width: "100px" },
                { text: this.$t('Daily Profit USD'), value: 'profit_usd', align: 'end', width: "100px"},
                { text: this.$t('AWAX Balance'), value: 'awax_balance', align: 'end', width: "100px"},
            ],                                    
        }
    },
    components: {
    },
    methods: {  
        // Получить списоу всех ферм и их состояний, просчитать общий итог
        updateAllFarmsList() {
            let farms = [];
            this.total_balance_wax = 0;
            this.total_awax_balance = 0;
            try {
                db.collection('farm_state').get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let item = doc.data();
                        farms.push(item);

                        this.total_balance_wax += item.total_wax;
                        this.total_balance_usd += item.total_usd;
                        this.total_awax_balance += item.awax_balance;
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
