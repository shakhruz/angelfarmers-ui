<template>
  <div class="ma-3">
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card v-if="farm_actions">
                <v-btn @click="$router.push(`/`);" class="ma-4" >
                    {{$t('Back to Farms')}}
                </v-btn>
                <v-card-title>
                    {{ id }}. {{$t("Total income")}}:&nbsp;
                    <FarmIncome :income="income"/>
                </v-card-title>        
                <v-data-table
                    :headers="headersActions"
                    :items="farm_actions"
                    sort-by="time" :sort-desc="[true]"
                    class="elevation-1" dense :items-per-page="100"
                >
                    <template v-slot:item.time="{ item }">
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
                            <!-- <a :href="`https://wax.eosx.io/tx/${item.tx_id}`" target='_blank'> -->
                            <a :href="`https://wax.bloks.io/tx/${item.tx_id}`" target='_blank'>
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
  </div>
</template>

<script>
import FarmIncome from "@/components/FarmInfo/FarmIncome.vue";
const {db, Timestamp } = require('@/db');

export default {
    name: "FarmActions",
    props: ["id"],
    data() {
        return {
            farm_actions: [],
            headersActions: [
                { text: this.$t('Account'), value: 'owner' },
                { text: this.$t('Time'),value: 'time', },
                { text: this.$t('Asset'), value: 'asset_name' },
                { text: this.$t('Action'), value: 'message' },
                { text: this.$t('Result'), value: 'output' },
                { text: 'CPU', value: 'cpu' },
                { text: 'Tx',value: 'tx_id'},
            ],
            income: {
                wood : 0,
                food : 0,
                gold : 0,
                barley: 0,
                corn: 0,
                eggs: 0, 
                milk: 0
            }
        }
    },
    components: {
        FarmIncome
    },
    created() {
        console.log("account name: " + this.account_name);

        // соберем список действий и просчитаем общий приход
        this.income = {wood: 0, food: 0, gold: 0, barley: 0, corn: 0, eggs: 0, milk: 0};
        
        db.collection('actions').where('owner','==', this.id).get().then(snapshot => {
            snapshot.forEach(doc => {
                let item = doc.data();
                item.id = doc.id;
                this.farm_actions.push(item);
                if (item.output) {
                    if (item.output.wood) this.income.wood += item.output.wood;
                    if (item.output.food) this.income.food += item.output.food;
                    if (item.output.gold) this.income.gold += item.output.gold;
                    if (item.output.barley) this.income.barley += item.output.barley;
                    if (item.output.corn) this.income.corn += item.output.corn;
                    if (item.output.eggs) this.income.eggs += item.output.eggs;
                    if (item.output.milk) this.income.milk += item.output.milk;
                } 
            })
        });
        // обновим данные фермы
        this.$store.commit('updateFarmIncome', {account_name: this.account_name, income: this.income});
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
