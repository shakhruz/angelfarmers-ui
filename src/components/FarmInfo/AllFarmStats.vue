<template>
<div>
    <v-card-text class="mt-0 pt-1 pb-1 mb-0">
        <v-row no-gutters dense>
            <v-col>
                {{$t("TOTAL COST")}}({{$store.state.farms.length}}): 
            </v-col>
            <v-col align="end" class="pr-2">
                <strong>{{ formatAsset($store.state.total_cost_wax) }}￦</strong>
            </v-col>
            <v-col align="end" class="pr-2">
                ${{ formatAsset($store.state.total_cost_wax * $store.state.prices.wax) }}
            </v-col>
        </v-row>
        <v-row no-gutters dense>
            <v-col>
                {{$t("DAILY PROFIT")}}: 
            </v-col>
            <v-col align="end" class="pr-2">
                <strong>{{ formatAsset($store.state.total_income_wax) }}￦</strong>
            </v-col>
            <v-col align="end" class="pr-2">
                ${{ formatAsset($store.state.total_income_wax * $store.state.prices.wax) }}
            </v-col>
        </v-row>
        <v-row no-gutters dense>
            <v-col>
                {{$t("ROI")}}: 
            </v-col>
            <v-col align="end" class="pr-2">
                <strong>{{ formatAsset($store.state.total_income_wax/$store.state.total_cost_wax*100) }}%</strong>
            </v-col>
            <v-col align="end" class="pr-2">
                <strong>{{ formatAsset($store.state.total_cost_wax / $store.state.total_income_wax) }} {{$t('days')}}</strong>
            </v-col>
        </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="mt-0 pt-1 pb-1 mb-0">
        {{$t("ON BALANCE")}}:<br/>
        <v-row no-gutters dense>
            <v-col>
            </v-col>
            <v-col>
                <strong>{{$t("Tokens")}}:</strong>
            </v-col>
            <v-col>
                <strong>{{$t("InGame")}}:</strong>
            </v-col>
            <v-col>
                <strong>{{$t("Daily")}}:</strong>
            </v-col>
            <v-col>
                <strong>{{$t("Result")}}:</strong>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                <img class="token" src="/fw/FWF2.png"/>
            </v-col>
            <v-col>
                {{ formatAssetPrice($store.state.total_tokens.fwf) }}
            </v-col>
            <v-col>
                <v-chip label small >
                    {{ formatAssetPrice($store.state.total_resources.food) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor($store.state.daily_output.food)" outlined>
                    <strong>
                        {{ formatAssetPrice($store.state.daily_output.food) }}
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor($store.state.daily_profits.food)" outlined>
                    <strong>
                        {{ formatAssetPrice($store.state.daily_profits.food) }}
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                <img class="token" src="/fw/FWW2.png"/>
            </v-col>
            <v-col>
                {{ formatAssetPrice($store.state.total_tokens.fww) }}
            </v-col>
            <v-col>
                <v-chip label small >
                    {{ formatAssetPrice($store.state.total_resources.wood) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor($store.state.daily_output.wood)" outlined>
                    <strong>
                        {{ formatAssetPrice($store.state.daily_output.wood) }}                        
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor($store.state.daily_profits.wood)" outlined>
                    <strong>
                        {{ formatAssetPrice($store.state.daily_profits.wood) }}                        
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                <img class="token" src="/fw/FWG2.png"/>
            </v-col>
            <v-col>
                {{ formatAssetPrice($store.state.total_tokens.fwg) }}
            </v-col>
            <v-col>
                <v-chip label small>
                    {{ formatAssetPrice($store.state.total_resources.gold) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor($store.state.daily_output.gold)" outlined>
                    <strong>
                        {{ formatAssetPrice($store.state.daily_output.gold) }}                        
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor($store.state.daily_profits.gold)" outlined>
                    <strong>
                        {{ formatAssetPrice($store.state.daily_profits.gold) }}                        
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                {{$t('TOTAL')}}
            </v-col>
            <v-col>
                {{ formatAssetPrice($store.state.total_tokens.fwg * $store.state.prices.fwg + 
                                    $store.state.total_tokens.fwf * $store.state.prices.fwf + 
                                    $store.state.total_tokens.fww * $store.state.prices.fww) }}￦
            </v-col>
            <v-col>
                {{ formatAssetPrice($store.state.total_resources.gold * $store.state.prices.fwg + 
                                    $store.state.total_resources.food * $store.state.prices.fwf +
                                    $store.state.total_resources.wood * $store.state.prices.fww)}}￦
            </v-col>
            <v-col>
            </v-col>
            <v-col>
            </v-col>
        </v-row>
    </v-card-text>      
    <v-divider></v-divider>
    <v-card-text class="mt-0 pt-1 pb-1 mb-0">
        {{$t("DAILY OUTPUT")}}:<br/>
        <span v-if="$store.state.daily_profits">
            <v-row no-gutters dense>
                <v-col>
                    <img class="token" src="/fw/FWF2.png"/>&nbsp;
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>
                        {{ formatAssetPrice($store.state.daily_profits.food) }}
                    </strong>
                </v-col>
                <v-col align="end" class="pr-2">
                    {{ formatAssetPrice($store.state.daily_profits.food*$store.state.prices.fwf) }}￦                    
                </v-col>
                <v-col align="end" class="pr-2">
                    ${{ formatAssetPrice($store.state.daily_profits.food*$store.state.prices.fwf*$store.state.prices.wax) }}
                </v-col>
            </v-row>
            <v-row no-gutters dense>
                <v-col>
                    <img class="token" src="/fw/FWW2.png"/>&nbsp;
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>{{ formatAssetPrice($store.state.daily_profits.wood) }}</strong>
                </v-col>
                <v-col align="end" class="pr-2">
                    {{ formatAssetPrice($store.state.daily_profits.wood*$store.state.prices.fww) }}￦<br/>
                </v-col>
                <v-col align="end" class="pr-2">
                    ${{ formatAssetPrice($store.state.daily_profits.wood*$store.state.prices.fww*$store.state.prices.wax) }}<br/>
                </v-col>
            </v-row>            
            <v-row no-gutters dense>
                <v-col>
                    <img class="token" src="/fw/FWG2.png"/>&nbsp;
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>{{ formatAssetPrice($store.state.daily_profits.gold) }}</strong>
                </v-col>
                <v-col align="end" class="pr-2">
                    {{ formatAssetPrice($store.state.daily_profits.gold*$store.state.prices.fwg) }}￦
                </v-col>
                <v-col align="end" class="pr-2">
                    ${{ formatAssetPrice($store.state.daily_profits.gold*$store.state.prices.fwg*$store.state.prices.wax) }}
                </v-col>
            </v-row>
            <v-row no-gutters dense>
                <v-col>
                    {{$t(('TOTAL'))}}
                </v-col>
                <v-col align="end" class="pr-2">
                    
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>
                        {{ formatAssetPrice($store.state.daily_profits.gold*$store.state.prices.fwg + 
                                        $store.state.daily_profits.wood*$store.state.prices.fww +
                                        $store.state.daily_profits.food*$store.state.prices.fwf
                                        ) }}￦
                    </strong>
                </v-col>
                <v-col align="end" class="pr-2">
                    <strong>

                        ${{ formatAssetPrice(($store.state.daily_profits.gold*$store.state.prices.fwg + 
                                        $store.state.daily_profits.wood*$store.state.prices.fww +
                                        $store.state.daily_profits.food*$store.state.prices.fwf) *
                                        $store.state.prices.wax
                                        ) }}
                    </strong>
                </v-col>
            </v-row>
        </span>
    </v-card-text>
</div> 
</template>

<script>
export default {
  name: "AllFarmStats",
  async mounted() {
  },
  methods: {
      profitColor(profit) {
          if (profit==0) return '';
          return profit > 0 ? 'green' : 'red';
      },
  }    
}
</script>

<style scoped>
</style>