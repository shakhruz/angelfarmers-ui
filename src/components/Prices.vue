<template>
  <span v-if="$store.state.prices!=null">
    <v-chip class="ma-2" label text-color="#818182" color="white" href="https://www.huobi.com/en-us/exchange/waxp_usdt/" target="_blank">
      <strong>1￦={{ formatAssetPrice($store.state.prices.wax,3) }}$</strong>
    </v-chip>
    <v-chip class="ma-2" label text-color="#818182" color="white" href="https://wax.alcor.exchange/trade/FWF-farmerstoken_wax-eosio.token"  target="_blank">
      <span>
        <img class="token" src="/fw/FWF.png"/>
        {{ formatAssetPrice($store.state.prices.fwf,4) }}
        (${{ formatAssetPrice($store.state.prices.fwf * $store.state.prices.wax,4) }})
        <span :class="$store.state.prices.fwf_change24>0 ? 'green--text' : 'red--text'">
          <small>{{ formatAsset($store.state.prices.fwf_change24) }}%</small>
        </span>
      </span>
    </v-chip>
    <v-chip class="ma-2" label text-color="#818182" color="white" href="https://wax.alcor.exchange/trade/FWW-farmerstoken_wax-eosio.token" target="_blank">
      <span>
        <img class="token" src="/fw/FWW.png"/>
        {{ formatAssetPrice($store.state.prices.fww,4) }}
        (${{ formatAssetPrice($store.state.prices.fww * $store.state.prices.wax,4) }})
        <span :class="$store.state.prices.fww_change24>0 ? 'green--text' : 'red--text'">
          <small>{{ formatAsset($store.state.prices.fww_change24) }}%</small>
        </span>
      </span>
    </v-chip>
    <v-chip class="ma-2" label text-color="#818182" color="white" href="https://wax.alcor.exchange/trade/FWG-farmerstoken_wax-eosio.token" target="_blank">
      <span>
        <img class="token" src="/fw/FWG.png"/>
        {{ formatAssetPrice($store.state.prices.fwg,4) }}
        (${{ formatAssetPrice($store.state.prices.fwg * $store.state.prices.wax,4) }})
        <span :class="$store.state.prices.fwg_change24>0 ? 'green--text' : 'red--text'">
          <small>{{ formatAsset($store.state.prices.fwg_change24) }}%</small>
        </span>
      </span>
    </v-chip>
  </span>
</template>

<script>
export default {
  name: "Prices",
  mounted() {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss"></style>
