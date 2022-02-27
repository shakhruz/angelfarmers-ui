<template>
    <span>
        <strong>{{ $t(animal.name).toUpperCase() }}</strong><br/>
        {{$t("daily food")}}: 
        <span class="quote">
            {{ animal.daily_expense_barley }}
            <img class="token" src="/fw/barley_small.png"/>
        </span>
        <br/>
        {{$t("claim in")}} <strong>{{minsFormatted(animal.feed_mins)}}</strong><br/>
        {{$t("claims")}}: {{animal.times_claimed}}/{{animal.max_claim}}<br/>
        {{$t("time left")}}: {{ formatAssetPrice(animal.hours_to_crop,2) }}{{$t("hrs")}} ({{ formatAssetPrice(animal.hours_to_crop/24,2) }} {{$t("days")}})
        <br/>
        <br/>
        {{$t("cost")}}: {{ formatAssetPrice(animal.cost) }}￦<br/>
        {{$t("output")}}: 
        <span class="quote">
            {{animal.output_gold}}
            <img class="token" src="/fw/FWG2.png"/> 
            ({{formatAssetPrice(animal.output_gold * farm.prices.fwg)}}￦)<br/>
        </span>
        {{$t("total days to crop")}}: {{animal.days_to_crop}} {{$t("days")}}<br/>
        {{$t("daily output")}}: 
            {{animal.output_gold / animal.days_to_crop}}
            <img class="token" src="/fw/FWG2.png"/> 
            ({{formatAssetPrice(animal.output_gold * farm.prices.fwg / animal.days_to_crop)}}￦)<br/>
        {{$t("total expense")}}: 
        <span class="quote">
            {{ formatAssetPrice(animal.total_expense_gold,0) }}
            <img class="token" src="/fw/FWG2.png"/>
            ({{ formatAssetPrice(animal.total_expense_wax) }}￦)<br/>
        </span>
        {{$t("profit")}}: 
        <span class="quote">
            {{formatAssetPrice(animal.profit)}}￦<br/>
        </span>
        <br/>
        ROI: {{ formatAssetPrice((animal.cost / (animal.profit / animal.days_to_crop),2)) }} {{$t("days")}}
    </span>
</template>

<script>
export default {
  name: "FarmAnimalInfo",
  props: ["farm", "animal"],
  async mounted() {
  },
  methods: {
  }    
}
</script>