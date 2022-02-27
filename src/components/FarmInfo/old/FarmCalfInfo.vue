<template>
    <span>
        <strong>{{ $t(animal.name).toUpperCase() }}</strong><br/>
        {{$t("claim in")}} <strong>{{minsFormatted(animal.feed_mins)}}</strong><br/>
        {{$t("claims")}}: {{animal.times_claimed}}/{{animal.max_claim}}<br/>
        <br/>
        {{$t("cost")}}: {{ formatAssetPrice(animal.cost) }}￦<br/>
    </span>
</template>

<script>
export default {
  name: "FarmCalfInfo",
  props: ["farm", "animal"],
  async mounted() {
  },
  methods: {
  }    
}
</script>