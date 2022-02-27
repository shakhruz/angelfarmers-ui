<template>
    <v-card-text>
        <strong>{{$t("DAILY STATS")}}:</strong>
        <v-row no-gutters>
            <v-col>
                {{$t("OUTPUT")}}:
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWG2.png"/>
                {{ formatAssetPrice(farm.daily_output_gold) }}
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWW2.png"/>
                {{ formatAssetPrice(farm.daily_output_wood) }}
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWF2.png"/>
                {{ formatAssetPrice(farm.daily_output_food) }}
            </v-col>
        </v-row>
        <v-row no-gutters >
            <v-col>
                {{$t("EXPENSE")}}:
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWG2.png"/>
                {{ formatAssetPrice(farm.daily_expense_gold) }}
            </v-col>
            <v-col>            
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWF2.png"/>
                {{ formatAssetPrice(farm.daily_expense_food) }}
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col>
                {{$t("PROFIT")}}:
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWG2.png"/>
                {{ formatAssetPrice(farm.daily_profit_gold) }}
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWW2.png"/>
                {{ formatAssetPrice(farm.daily_output_wood) }}
            </v-col>
            <v-col>
                <img class="token" src="/fw/FWF2.png"/>
                {{ formatAssetPrice(farm.daily_profit_food) }}
            </v-col>
        </v-row>
        <small>
            <div v-if="farm.settings.send_food_to && farm.settings.send_food_to.trim()!=''">
                <strong>
                    {{$t("Provide food for")}}&nbsp;
                </strong>
                {{ farm.settings.send_food_to}}
            </div>
            <div v-if="farm.settings.send_barley_seeds_to && farm.settings.send_barley_seeds_to.trim()!=''">
                <strong>
                    {{$t("Provide Barley seeds to")}}&nbsp;
                </strong>
                {{ farm.settings.send_barley_seeds_to}}
            </div>
            <div v-if="farm.settings.send_crops_to">
                {{$t("Send crops to")}}&nbsp;
                <strong>
                    {{ farm.settings.send_crops_to}}
                </strong>
            </div>
        </small>
    </v-card-text>  
</template>

<script>
export default {
  name: "FarmProfits",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  }    
}
</script>

<style scoped>
</style>