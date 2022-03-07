<template>
    <div v-if="farm.crops && farm.crops.list && farm.crops.list.length > 0">
        <v-card-title class="my-1 py-0 px-1 mx-1">
            <v-chip label small>
                <strong>{{$t("CROPS")}}:</strong>
            </v-chip>
            <v-chip label small :color="'red--text'" outlined>
                {{ farm.crops.daily_expense_food }}
                <img class="token" src="/fw/FWF2.png"/>
            </v-chip>  
            <v-chip label small :color="'green--text'" outlined>
                {{ formatAsset(farm.crops.daily_output_gold) }}
                <img class="token" src="/fw/FWG2.png"/>
            </v-chip>                        
            <v-chip label small 
                :color="farm.crops.daily_profit_wax > 0 ? 'green--text':'red--text' " 
                outlined>
                {{ formatAsset(farm.crops.daily_profit_wax) }}￦
            </v-chip>                        
            <v-chip label small 
                :color="farm.crops.daily_profit_wax > 0 ? 'green--text':'red--text' " 
                outlined>
                ${{ formatAsset(farm.crops.daily_profit_wax*farm.prices.wax) }}
            </v-chip>                        
        </v-card-title>
        <v-card-text class="my-0 py-0 px-1 mx-0">
            <span v-for="crop in farm.crops.list" :key="crop.id" class="ma-1">
                <v-chip label outlined class="mb-1">
                    <span v-if="crop.template_id=='298595'">
                        <img class="token" src="/fw/barley_small.png"/>
                    </span>
                    <span v-else>
                        <img class="token" src="/fw/corn2.png"/>
                    </span>
                    &nbsp;&nbsp;
                    <small>
                        <strong :class="getMinsColor(crop.crop_mins)">
                            {{minsFormatted(crop.crop_mins)}}
                        </strong>
                    </small>&nbsp;&nbsp;
                    <small>
                        {{crop.times_claimed}}/42
                    </small>
                </v-chip>
            </span>
            <span v-for="e in empty" :key="e.id" class="ma-1">
                <v-chip label outlined class="mb-1 red">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </v-chip>
            </span>
            <div class="caption my-1 mx-2">
                {{$t("ETA")}}: {{ minsFormatted(farm.next_crop_time) }}
                <br/>
                {{$t("crop")}}:
                {{formatAsset(farm.crops.balance)}}<img class="token" src="/fw/FWG2.png"/>
                &nbsp;
                ({{formatAsset(farm.crops.crop_balance_wax)}}￦ / 
                ${{formatAsset(farm.crops.crop_balance_wax*farm.prices.wax)}})
                &nbsp;
                {{$t("expense")}}:{{-farm.crops.total_food_for_crops}}<img class="token" src="/fw/FWF2.png"/>
                ({{formatAsset(farm.crops.total_food_for_crops*farm.prices.fwf)}}￦ /
                ${{formatAsset(farm.crops.total_food_for_crops*farm.prices.fwf*farm.prices.wax)}})
                <br/>
                {{$t("seed cost")}}:
                {{-formatAsset(farm.crops.seed_cost_gold,0)}}<img class="token" src="/fw/FWG2.png"/>
                ({{formatAsset(farm.crops.seed_cost_gold*farm.prices.fwg)}}￦ /
                ${{formatAsset(farm.crops.seed_cost_gold*farm.prices.fwg*farm.prices.wax)}})
            </div>
        </v-card-text>  
    </div>
</template>

<script>
export default {
    name: "FarmCropsInfo",
    props: ["farm"],
    data() {
        return {
            empty: [],
        }
    },    
    mounted() {
        this.empty = [];
        for(let i=0;i<(8-this.farm.crops.list.length);i++) {
            this.empty.push({id:i+100});
        }
    },
    methods: {
    }    
}
</script>