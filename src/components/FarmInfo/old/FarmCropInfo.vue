<template>
    <span>
        <strong>{{ $t(crop.name).toUpperCase() }}</strong><br/>
        {{$t("food needed")}}: 
        <span class="quote">
            <img class="token" src="/fw/FWF2.png"/>
            {{ formatAssetPrice(crop.food_to_crop,0) }}
            ({{formatAssetPrice(crop.food_to_crop * farm.prices.fwf)}}￦)
        </span>
        <br/><br/>
        {{$t("claims")}}: {{crop.times_claimed}}/42<br/>
        {{$t("claim in")}} <strong>{{minsFormatted(crop.crop_mins)}}</strong><br/>
        {{$t("crop in")}} <strong>{{minsFormatted(crop.time_to_crop)}}</strong><br/><br/>
        {{$t("output")}}: 
        <span class="quote">
            ~{{crop.crop_result}}
            <img class="token" src="/fw/FWG2.png"/> 
            (~{{formatAssetPrice(crop.crop_result * farm.prices.fwg)}}￦)<br/>
        </span>
        {{$t("food total")}}: 
        <span class="quote">
            <img class="token" src="/fw/FWF2.png"/>
            {{ formatAssetPrice(crop.feed_cost * 42,0) }}
            ({{formatAssetPrice(crop.total_feed_cost_wax)}}￦)<br/>
        </span>                    
        {{$t("seed cost")}}: 
        <span class="quote">
            {{formatAssetPrice(crop.cost )}}￦<br/>
        </span>
        {{$t("total cost")}}: 
        <span class="quote">
            {{formatAssetPrice(crop.cost + crop.total_feed_cost_wax)}}￦<br/>
        </span>
        {{$t("daily cost")}}: 
        <span class="quote">
            {{formatAssetPrice(crop.daily_cost)}}￦<br/>
        </span>
        {{$t("profit")}}: 
        <span class="quote">
            {{formatAssetPrice(crop.crop_result * farm.prices.fwg - crop.total_feed_cost_wax)}}￦<br/>
        </span>
        {{$t("total hours to crop")}}: 
        <span class="quote">
            {{formatAssetPrice(crop.total_hours_to_crop,0)}} {{$t("hours")}}
        </span>
        <br/>
        {{$t("total days to crop")}}: 
        <span class="quote">
            {{formatAssetPrice(crop.total_hours_to_crop / 24,0)}} {{$t("days")}}
        </span>
        <br/>
        {{$t("daily profit")}}: 
        <span class="quote">
            ~{{formatAssetPrice(crop.crop_result * farm.prices.fwg/(crop.total_hours_to_crop/24))}}￦ / {{$t("day")}}
        </span>
        <br/><br/>
        ROI: {{ formatAssetPrice((crop.crop_result * farm.prices.fwg) / crop.daily_cost,2)  }} {{$t("days")}}
    </span>    
</template>

<script>
export default {
  name: "FarmCropInfo",
  props: ["farm", "crop"],
}
</script>