<template>
  <div>
    <v-row> 
        <v-col>
            <v-card v-if="all_farms" elevation="2" 
                    :min-width="$vuetify.breakpoint.mobile ? '380px' : '420px'"
                    :max-width="$vuetify.breakpoint.mobile ? '380px' : '420px'"
                    class="justify-center" raised rounded="lg"
                    :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'teal darken-1 white--text'">
                <v-card-subtitle class="white--text blue darken-1" href="https://awax.cc" target="_blank">
                    <strong>{{$t("AWAX PRESALE")}}</strong>&nbsp;&nbsp;
                    <small>1 AWAX = 1 WAX</small>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                    
                    <v-btn icon class="white--text" href="https://awax.cc" target="_blank">
                        <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                    <v-progress-linear class="mt-1 white--text" height="20" color="amber darken-3" rounded 
                                        :value="100-awax_left/100000*100">
                        <small>
                            <strong>
                                {{formatAsset(100-awax_left/100000*100)}}%&nbsp;&nbsp;
                                {{formatAsset(awax_left,0)}} ₳&nbsp;{{$t("left")}}
                            </strong>
                        </small>
                    </v-progress-linear>
                </v-card-subtitle>                                           
            </v-card>
        </v-col>        
    </v-row>
  </div>
</template>

<script>
const {db, calcFarmIncome} = require('@/db');

export default {
    name: "AWAX",
    data() {
        return {
            sort_by: "awax",
            awax_left: 0,
            all_farms: [],
            total_balance_wax: 0,
            total_balance_usd: 0,
            total_awax_balance: 0,
            headersAllFarms: [
                { text: '', value: 'num', width: "10px" },
                { text: this.$t('Account'), value: 'account_name', width: "100px" },
                { text: this.$t('AWAX Balance'), value: 'awax_balance', align: 'end', width: "100px"},
                { text: this.$t('Daily Profit USD'), value: 'profit_usd', align: 'end', width: "100px"},
            ],                                    
        }
    },
    components: {
    },
    methods: {  
        // Получить списоу всех ферм и их состояний, просчитать общий итог
        updateAllFarmsList(sort_by) {
            this.sort_by = sort_by;
            let farms = [];
            this.total_balance_wax = 0;
            this.total_balance_usd = 0;
            this.total_awax_balance = 0;
            try {
                db.collection('farm_state').get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let item = doc.data();
                        if (!item.awax_balance) item.awax_balance = 0;
                        farms.push(item);

                        this.total_balance_wax += item.total_wax;
                        this.total_balance_usd += item.total_usd;
                        this.total_awax_balance += item.awax_balance;
                    })
                    if (this.sort_by=="profit") this.all_farms = farms.sort((a,b)=> b.profit_usd - a.profit_usd);
                    else this.all_farms = farms.sort((a,b)=> b.awax_balance - a.awax_balance);
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
        this.getTotalAWAXOnPresale().then(left => this.awax_left = left);
        this.updateAllFarmsList(this.sort_by);
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
