<template>
    <span>
        <strong>{{ $t(tool.data.name).toUpperCase() }}</strong><br/>
        {{$t("claim in")}} <strong>{{minsFormatted(tool.claim_mins)}}</strong><br/>
        {{$t("cost")}}: {{ formatAssetPrice(tool.cost) }}￦<br/>
        {{$t("durability")}}: {{tool.current_durability}} / {{tool.durability}}<br/>
        {{$t("hourly income")}}: {{ formatAssetPrice(tool.hourly_output_wax) }}￦<br/>
        {{$t("daily expense")}}:<br/>
        <span class="quote">
            {{ formatAssetPrice(tool.daily_expense_food) }}
            <img class="token" src="/fw/FWF2.png"/>
            ({{ formatAssetPrice(tool.daily_expense_food * farm.prices.fwf) }}￦)
            <br/>
        </span>
        <span class="quote">
            {{ formatAssetPrice(tool.daily_expense_gold) }}
            <img class="token" src="/fw/FWG2.png"/>
            ({{ formatAssetPrice(tool.daily_expense_gold * farm.prices.fwg) }}￦)
            <br/>
        </span>
        {{$t("daily reward")}}: 
        <span class="quote" v-if="tool.data.hourly_reward_food>0">
            {{ formatAssetPrice(tool.data.hourly_reward_food * 24) }}
            <img class="token" src="/fw/FWF2.png"/>
            <br/>
        </span>
        <span class="quote" v-if="tool.data.hourly_reward_wood>0">
            {{ formatAssetPrice(tool.data.hourly_reward_wood * 24) }}
            <img class="token" src="/fw/FWW2.png"/>
            <br/>
        </span>               
        <span class="quote" v-if="tool.data.hourly_reward_gold>0">
            {{ formatAssetPrice(tool.data.hourly_reward_gold * 24) }}
            <img class="token" src="/fw/FWG2.png"/>
            <br/>
        </span>
        {{$t("daily income")}}: {{formatAssetPrice(tool.hourly_output_wax * 24)}}￦<br/>
        {{$t("daily profit")}}: {{ formatAssetPrice(tool.daily_profit_wax) }}￦<br/>
        <br/>
        ROI: {{ formatAssetPrice(tool.cost / tool.daily_profit_wax )  }} {{$t("days")}}
    </span>
</template>

<script>
export default {
  name: "FarmToolInfo",
  props: ["farm", "tool"],
}
</script>