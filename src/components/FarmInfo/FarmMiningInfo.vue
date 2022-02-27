<template>
    <div v-if="farm.tools && farm.tools.list && farm.tools.list.length > 0" class="mb-0 mt-0 pt-0 pb-0">
        <v-card-title class="my-0 py-1 mx-1 px-1">
            <v-chip label small>
                <strong>{{$t("MINING")}}:</strong>
            </v-chip>
            
            <v-chip label small outlined v-if="farm.tools.daily_profit_food!=0">
                <span :class="getResourceNumberColor(farm.tools.daily_profit_food)">
                    {{ formatAssetPrice(farm.tools.daily_profit_food) }}
                </span>
                <img class="token" src="/fw/FWF2.png"/>
            </v-chip>
            <v-chip label small outlined v-if="farm.tools.hourly_output_wood>0">            
                <span :class="getResourceNumberColor(farm.tools.hourly_output_wood)"> 
                    {{ formatAssetPrice(farm.tools.hourly_output_wood * 24) }}
                </span>
                <img class="token" src="/fw/FWW2.png"/>
            </v-chip>
            <v-chip label small outlined v-if="farm.tools.daily_profit_gold!=0">            
                <span :class="getResourceNumberColor(farm.tools.daily_profit_gold)">
                    {{ formatAssetPrice(farm.tools.daily_profit_gold) }}
                </span>
                <img class="token" src="/fw/FWG2.png"/>
            </v-chip>
            <v-chip label small :color="farm.tools.daily_profit_wax>0? 'green--text' : 'red--text'" outlined>
                {{formatAsset(farm.tools.daily_profit_wax)}}￦
            </v-chip>
            <v-chip label small :color="farm.tools.daily_profit_wax>0? 'green--text' : 'red--text'" outlined>
                ${{formatAsset(farm.tools.daily_profit_wax*farm.prices.wax)}}
            </v-chip>

        </v-card-title>
        <div class="my-0 py-1 mx-0 px-1">
            <div class="my-0 py-0 px-0 mx-1">
                <span v-for="tool in farm.tools.list.filter(t=>isFoodTool(t))" :key="tool.id">
                    <v-chip label small outlined :class="'ma-0 ' + toolColor(tool)">
                        <span :class="toolNameColor(tool)">
                            {{$t(tool.name).toUpperCase()}}&nbsp;&nbsp;
                        </span>
                        <small>
                            <strong :class="getMinsColor(tool.claim_mins)">
                                {{minsFormatted(tool.claim_mins)}}
                            </strong>
                        </small>&nbsp;&nbsp;
                        <small>{{tool.current_durability}}/{{tool.durability}}</small>&nbsp;&nbsp;
                        <span v-if="tool.daily_profit>=1 || tool.daily_profit<=-1">
                            <small>{{formatAsset(Math.round(tool.daily_profit),0)}}￦</small>
                        </span>
                    </v-chip>
                </span>
            </div>
            <div class="my-0 py-0 px-1 mx-0">
                <span v-for="tool in farm.tools.list.filter(t=>isWoodTool(t))" :key="tool.id">
                    <v-chip label small outlined :class="'ma-0 mt-1 ' + toolColor(tool)">
                        <span :class="toolNameColor(tool)">
                            {{$t(tool.name).toUpperCase()}}&nbsp;&nbsp;
                        </span>
                        <small>
                            <strong :class="getMinsColor(tool.claim_mins)">
                                {{minsFormatted(tool.claim_mins)}}
                            </strong>
                        </small>&nbsp;&nbsp;
                        <small>{{tool.current_durability}}/{{tool.durability}}</small>&nbsp;&nbsp;
                        <span v-if="tool.daily_profit>=1 || tool.daily_profit<=-1">
                            <small>{{formatAsset(Math.round(tool.daily_profit),0)}}￦</small>
                        </span>
                    </v-chip>
                </span>
            </div>
            <div class="my-0 py-0 px-1 mx-0">
                <span v-for="tool in farm.tools.list.filter(t=>isGoldTool(t))" :key="tool.id">
                    <v-chip label small outlined :class="'ma-0 mt-1 ' + toolColor(tool)">
                        <span :class="toolNameColor(tool)">
                            {{$t(tool.name).toUpperCase()}}&nbsp;&nbsp;
                        </span>
                        <small>
                            <strong :class="getMinsColor(tool.claim_mins)">
                                {{minsFormatted(tool.claim_mins)}}
                            </strong>
                        </small>&nbsp;&nbsp;
                        <small>{{tool.current_durability}}/{{tool.durability}}</small>&nbsp;&nbsp;
                        <span v-if="tool.daily_profit>=1 || tool.daily_profit<=-1">
                            <small>{{formatAsset(Math.round(tool.daily_profit),0)}}￦</small>
                        </span>
                    </v-chip>
                </span>
            </div>
        </div>  
        <div class="my-0 py-0 px-2 pb-1 mx-0">
            <span v-for="mbs in farm.mbs.list" :key="mbs.id">
                <v-chip label outlined small :class="'ma-0 mt-1 ' + mbsColor(mbs)">
                    <span class="teal--text">
                        {{$t('short-' + mbs.name).toUpperCase()}}&nbsp;&nbsp;
                    </span>
                    <small>
                        <strong :class="getMinsColor(mbs.claim_mins)">
                            {{minsFormatted(mbs.claim_mins)}}
                        </strong>
                    </small>
                </v-chip>
            </span>
        </div>  
        <v-divider class="mx-1"></v-divider>    
    </div>
</template>

<script>
export default {
    name: "FarmMiningInfo",
    props: ["farm"],
    mounted() {
    },
    methods: {
        toolNameColor(tool) {
            if (tool.template_id == "378691" || tool.template_id == "260763" || tool.template_id == "203881" || 
                    tool.template_id == "203883" || tool.template_id == "203886") return '#D7CCC8--text'; // wood tools
            // food
            if (tool.template_id == "203887" || tool.template_id == "203888" || tool.template_id == "203889") return 'light-blue--text';
            // gold
            if (tool.template_id == "203887" || tool.template_id == "203888" || tool.template_id == "203889") return 'light-blue--text';
            if (tool.template_id == "203891") return 'amber--text';
            return '';
        },
        isGoldTool(tool) {
            return tool.type == "Gold";
        },
        isWoodTool(tool) {
            return tool.type == "Wood";
        },
        isFoodTool(tool) {
            return tool.type == "Food";
        }
    }    
}
</script>