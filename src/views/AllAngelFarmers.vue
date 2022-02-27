<template>
  <div class="ma-1">
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="all_farms">
                <v-card-title>
                    {{$t("All Angel Farmers")}}:
                    <v-spacer></v-spacer>
                    <v-btn icon @click = 'updateAllFarmsList()'>
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>                      
                </v-card-title>        
                <v-data-table
                    :headers="headersAllFarms"
                    :items="all_farms"
                    item-key="account_name"
                    class="elevation-1" dense :items-per-page="50"
                >

                    <template v-slot:item.balance="{ item }">
                        <span v-if="item.balance">
                            {{ formatAsset(item.balance) }}₳
                        </span>                    
                    </template>   


                </v-data-table>
            </v-card>
        </v-col>        
    </v-row>
  </div>
</template>

<script>

export default {
    name: "AllAngelFarmers",
    data() {
        return {
            all_farms: [],
            headersAllFarms: [
                { text: '', value: 'num', width: "10px" },
                { text: this.$t('Account'), value: 'account_name', width: "150px" },
                { text: this.$t('AWAX Balance'), value: 'awax_balance', align: 'end', width: "100px" },
            ],                                    
        }
    },
    components: {
    },
    methods: {  
        // Получить списоу всех ферм и их состояний, просчитать общий итог
        updateAllFarmersList() {
            this.all_farms = [];
            try {
                this.wax_rpc().get_table_by_scope({
                    json: true,               
                    code: 'awaxdaotoken',     
                    table: 'accounts',        
                    // scope: 'awaxdaotoken',    
                }).then( awax_info => {
                    awax_info["rows"].forEach(row => {
                        this.getAWAXBalance(row.scope).then(balance => {
                            if (balance>0 && row.scope != "awaxpresales" && row.scope != "angeldaoteam") 
                                this.all_farms.push({account_name: row.scope, awax_balance: balance});
                        });
                    })
        
                    console.log("all awax holders:  " + JSON.stringify(awax_info));
                    console.log("holders:  " + JSON.stringify(holders));
                }); 
    
    
            } catch(e) {
                console.log("ОШИБКА при получении AWAX баланса аккаунта: " + e.message);
            }        
        }
    },
    mounted() {
        this.updateAllFarmersList();
    },
    computed: {
    },    
};
</script>

<style></style>
