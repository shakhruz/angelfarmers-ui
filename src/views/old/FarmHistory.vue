<template>
  <div class="ma-3">
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="$store.state.farms">
                <v-card-title>
                    Farms:
                </v-card-title>        
                <v-data-table
                    v-model="selected"
                    :headers="headersAllFarms"
                    :items="$store.state.farms"
                    :single-select="false" item-key="account_name" show-select
                    class="elevation-1" dense :items-per-page="50"
                >
                    <template v-slot:item.account_name="{ item }">
                        <strong>
                            <a :href="`https://wax.bloks.io/account/${item.account_name}`" target='_blank'>
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
                    <template v-slot:item.total_wax="{ item }">
                        {{ formatAsset(item.total_wax) }}
                    </template>                    
                    <template v-slot:item.total_usd="{ item }">
                        ${{ formatAsset(item.total_wax * item.prices.wax)}}
                    </template>                    
                    <template v-slot:item.send_crops_to="{ item }">
                        {{ item.settings.send_crops_to}}
                    </template>                    
                    <template v-slot:item.send_food_to="{ item }">
                        <span v-if="item.settings.send_food_to">
                            {{ item.settings.send_food_to.slice(0,50)}}
                            <span v-if="item.settings.send_food_to.length>50">...</span>
                        </span>                    
                    </template>                    
                    <template v-slot:item.settings="{ item }">
                        <FarmSettingsDialog :farm="item" />
                        <v-btn v-if="!item.wax_login" icon small @click="deleteFarmDialog(item.account_name)">
                            <v-icon >mdi-delete</v-icon>
                        </v-btn> 
                    </template>   
                </v-data-table>
            </v-card>
        </v-col>        
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="$store.state.logs">
                <v-card-title>
                    Automated Actions:
                </v-card-title>        
                <v-data-table
                    :headers="headersActions"
                    :items="farm_actions"
                    sort-by="time" :sort-desc="[true]"
                    class="elevation-1" dense
                >
                    <template v-slot:item.time="{ item }">
                        <!-- {{ formatFullDate(item.time) }} -->
                        {{ TimestampToDate(item.time) }}
                    </template>   
                    <template v-slot:item.output="{ item }">
                        <span v-if="item.output">
                            <span v-if="item.output.wood">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.wood) }} WOOD                                    
                                </v-chip>
                            </span>
                            <span v-if="item.output.gold">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.gold) }} GOLD
                                </v-chip>
                            </span>
                            <span v-if="item.output.food">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.food) }} FOOD
                                </v-chip>
                            </span>
                            <span v-if="item.output.barley">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.barley) }} Barley
                                </v-chip>
                            </span>
                            <span v-if="item.output.corn">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.corn) }} Corn
                                </v-chip>
                            </span>
                            <span v-if="item.output.milk">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.milk) }} Milk
                                </v-chip>
                            </span>
                            <span v-if="item.output.eggs">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.eggs) }} Eggs
                                </v-chip>
                            </span>
                            <span v-if="item.output.fc">
                                <v-chip small color="green lighten-1">
                                    {{ formatAsset(item.output.fc) }} Farmer Coin
                                </v-chip>
                            </span>
                        </span>
                        <span v-if="item.expenses">
                            <span v-if="item.expenses.energy">
                                <v-chip small color="red lighten-4">
                                    {{ formatAsset(item.expenses.energy) }} Energy
                                </v-chip>                                
                            </span>
                            <span v-if="item.expenses.food">
                                <v-chip small color="red lighten-4">
                                    {{ formatAsset(item.expenses.food) }} Food
                                </v-chip>                                
                            </span>                            
                            <span v-if="item.expenses.repair">
                                <v-chip small color="red lighten-4">
                                    {{ formatAsset(item.expenses.repair) }} Durability
                                </v-chip>
                            </span>
                            <span v-if="item.expenses.barley">
                                <v-chip small color="red lighten-4">
                                    {{ formatAsset(item.expenses.barley) }} Barley
                                </v-chip>
                            </span>
                            <span v-if="item.expenses.corn">
                                <v-chip small color="red lighten-4">
                                    {{ formatAsset(item.expenses.corn) }} Corn
                                </v-chip>
                            </span>
                        </span>
                    </template>                                                    
                    <template v-slot:item.tx_id="{ item }">
                        <span v-if="item.tx_id">
                            <a :href="`https://wax.eosx.io/tx/${item.tx_id}`" target='_blank'>
                                ...{{item.tx_id.slice(-4)}}
                            </a>
                        </span>
                    </template>
                    <template v-slot:item.asset_name="{ item }">
                        <span v-if="item.asset_id">
                            <a :href="`https://wax.atomichub.io/explorer/asset/${item.asset_id}`" target='_blank'>
                                {{item.asset_name}}&nbsp;(...{{item.asset_id.slice(-4)}})
                            </a>
                        </span>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="$store.state.errors">
                <v-card-title>Errors:</v-card-title>
                <v-data-table
                    :headers="headersErrors"
                    :items="$store.state.errors"
                    sort-by="time" :sort-desc="[true]"
                    dense class="elevation-1"
                >
                    <template v-slot:item.asset_name="{ item }">
                        <span v-if="item.asset_name">
                            <a :href="`https://wax.atomichub.io/explorer/asset/${item.asset_id}`" target='_blank'>
                                {{item.asset_name}}(...{{item.asset_id.slice(-4)}})
                            </a>
                        </span>
                    </template>
                    <template v-slot:item.time="{ item }">
                        {{ formatFullDate(new Date(item.time)) }}
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

const {db, Timestamp } = require('@/db');

export default {
    name: "FarmHistory",
    data() {
        return {
            actions: [],
            farm_actions: [],
            account_name: 'ehcza.wam',
            singleSelect: false,
            selected: [],            
            headersAllFarms: [
                { text: 'Account', value: 'account_name', width: "150px" },
                { text: 'Next action', value: 'next_action_date', align: 'end', width: "140px" },
                { text: 'CPU', value: 'next_crop_time', width: "80px" },
                { text: 'Food', value: 'daily_expense_food', align: 'end', width: "140px" },
                { text: 'Profit', value: 'profit_wax', align: 'end', width: "140px" },
                { text: 'Value ￦', value: 'total_wax', align: 'end', width: "140px" },
                { text: 'Value USD', value: 'total_usd', align: 'end', width: "140px" },
                { text: 'Main farm', value: 'send_crops_to' },
                { text: 'Send food', value: 'send_food_to', width: "200px" },
                { text: '', value: 'settings', width: "100px" },
            ],                                    
            headersActions: [
                { text: 'Account', value: 'owner' },
                { text: 'Time',value: 'time', },
                { text: 'Asset', value: 'asset_name' },
                { text: 'Message', value: 'message' },
                { text: 'Result', value: 'output' },
                { text: 'CPU', value: 'cpu' },
                { text: 'Tx',value: 'tx_id'},
            ],
            headersErrors: [
                { text: 'Account', value: 'name' },
                { text: 'Time',value: 'time'},
                { text: 'Asset',value: 'asset_name'},
                { text: 'Memo', value: 'memo' },
                { text: 'Message', value: 'message' },
            ], 
        }
    },
    components: {
        FarmSettingsDialog, CPUInfo, FarmNameIcons
    },
    created() {
        db.collection('actions').where('owner','==', this.account_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                let item = doc.data();
                item.id = doc.id;
                this.farm_actions.push(item);
            })
        });
    },
    mounted() {
    },
    firestore: {
        actions: db.collection("actions").where('owner', '==', 'ehcza.wam'),
    },
    methods: {  
        TimestampToDate(dateTime) {
            return this.formatFullDate(new Date(dateTime.seconds*1000));
        },       
        formatOutput(output) {
            if (output) return output.map(i=>JSON.stringify(i)).join();
            return '';
        },
        formatExpense(expenses) {
            return expenses.map(i=>JSON.stringify(i)).join();
        },
    },
    computed: {
  },    
};
</script>

<style></style>
