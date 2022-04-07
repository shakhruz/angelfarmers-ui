<template>
    <v-card-text class="mb-0 pt-1 pb-1 mt-0">
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
                {{ formatAssetPrice(farm.tokens.fwf) }}
            </v-col>
            <v-col>
                <v-chip label small >
                    {{ formatAssetPrice(farm.balance.food) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_output_food)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_output_food) }}
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_profit_food)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_profit_food) }}
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                <img class="token" src="/fw/FWW2.png"/>
            </v-col>
            <v-col>
                {{ formatAssetPrice(farm.tokens.fww) }}
            </v-col>
            <v-col>
                <v-chip label small >
                    {{ formatAssetPrice(farm.balance.wood) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_output_wood)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_output_wood) }}                        
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_profit_wood)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_profit_wood) }}                        
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                <img class="token" src="/fw/FWG2.png"/>
            </v-col>
            <v-col>
                {{ formatAssetPrice(farm.tokens.fwg) }}
            </v-col>
            <v-col>
                <v-chip label small :class="farmGoldBalanceColor(farm)">
                    {{ formatAssetPrice(farm.balance.gold) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_output_gold)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_output_gold) }}                        
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_profit_gold)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_profit_gold) }}                        
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>            
                {{$t("TOTAL")}}
            </v-col>
            <v-col>
                {{ formatAssetPrice(farm.tokens.fwg*farm.prices.fwg + farm.tokens.fww*farm.prices.fww + farm.tokens.fwf*farm.prices.fwf) }}￦
            </v-col>
            <v-col>
                <v-chip label small >
                    {{ formatAssetPrice(farm.balance.gold*farm.prices.fwg + farm.balance.wood*farm.prices.fww+farm.balance.food*farm.prices.fwf) }}￦
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_output_gold)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_output_gold*farm.prices.fwg+farm.daily_output_food*farm.prices.fwf+farm.daily_output_wood*farm.prices.fww) }}￦
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small :class="profitColor(farm.daily_profit_gold)" outlined>
                    <strong>
                        {{ formatAssetPrice(farm.daily_profit_gold*farm.prices.fwg+farm.daily_profit_food*farm.prices.fwf+farm.daily_profit_wood*farm.prices.fww) }}￦
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
        <v-row no-gutters class="mt-1" dense>
            <v-col>       
                &nbsp;     
            </v-col>
            <v-col>
                ${{ formatAssetPrice((farm.tokens.fwg*farm.prices.fwg + farm.tokens.fww*farm.prices.fww + farm.tokens.fwf*farm.prices.fwf)*farm.prices.wax) }}
            </v-col>
            <v-col>
                <v-chip label small >
                    ${{ formatAssetPrice((farm.balance.gold*farm.prices.fwg + farm.balance.wood*farm.prices.fww+farm.balance.food*farm.prices.fwf)*farm.prices.wax) }}
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small outlined>
                    <strong>
                        ${{ formatAssetPrice((farm.daily_output_gold*farm.prices.fwg+farm.daily_output_food*farm.prices.fwf+farm.daily_output_wood*farm.prices.fww)*farm.prices.wax) }}
                    </strong>
                </v-chip>
            </v-col>
            <v-col>
                <v-chip label small outlined>
                    <strong>
                        ${{ formatAssetPrice((farm.daily_profit_gold*farm.prices.fwg+farm.daily_profit_food*farm.prices.fwf+farm.daily_profit_wood*farm.prices.fww)*farm.prices.wax) }}
                    </strong>
                </v-chip>
            </v-col>
        </v-row>
    </v-card-text>  
</template>

<script>
export default {
  name: "FarmStats",
  props: ["farm"],
  mounted() {
  },
  methods: {
      profitColor(profit) {
          if (profit==0) return '';
          return profit > 0 ? 'green' : 'red';
      },
      farmGoldBalanceColor(farm) {
          if (farm.daily_expense_gold>0) {
              return farm.balance.gold > farm.tools.daily_expense_gold / 2 ? 'green' : 'red';
          }
          return '';
      }
  }    
}
</script>

<style scoped>
</style>