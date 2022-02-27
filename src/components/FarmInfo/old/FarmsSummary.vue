<template>
    <span>
        <div class="ma-2">
            <!-- <span v-for="farm in $store.state.farms" class="pa-1">
                <v-chip :class="farm.ok ? 'green lighten-2' : 'red lighten-2'" :href="'#'+farm.account_name" label>
                    {{farm.account_name}}
                </v-chip>
            </span> -->
        </div>
            {{$store.state.farms.length}} {{$t("farms")}}.
            <br/>
            {{$t("TOTAL COST")}}: <strong>{{ formatAsset($store.state.total_cost_wax) }}￦</strong>
            / ${{ formatAsset($store.state.total_cost_wax * $store.state.prices.wax) }},
            <br/>
            {{$t("DAILY PROFIT")}}: 
            <strong>{{ formatAsset($store.state.total_income_wax) }}￦</strong>
            /
            ${{ formatAsset($store.state.total_income_wax * $store.state.prices.wax) }}
            <br/>
            {{$t("DAILY OUTPUT")}}:
            <img class="token" src="/fw/FWG2.png"/>
            {{ formatAssetPrice($store.state.daily_profits.gold) }}
            <img class="token" src="/fw/FWW2.png"/>
            {{ formatAssetPrice($store.state.daily_profits.wood) }}
            <img class="token" src="/fw/FWF2.png"/>
            {{ formatAssetPrice($store.state.daily_profits.food) }}
            <v-btn v-if="$store.state.is_checking" icon @click = '$store.dispatch("updateInfo");'>
                <v-icon>mdi-cached</v-icon>
            </v-btn>  
    </span>      
</template>

<script>
export default {
    name: "FarmsSummary",
    mounted() {
    },
    methods: {
    }
};
</script>

<style scoped lang="scss"></style>
