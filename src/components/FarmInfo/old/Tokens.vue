<template>
    <div>
        <v-card-subtitle class="ma-0 pa-0">
          {{$t("TOKENS")}}
          <small>
              ({{formatAsset(farm.tokens.fwg * farm.prices.fwg + farm.tokens.fwf*farm.prices.fwf + farm.tokens.fww * farm.prices.fww)}}￦)
          </small>
        </v-card-subtitle>
        <v-chip-group column>
            <TokenChip :value="farm.tokens.fwg" name="FWG" />
            <TokenChip :value="farm.tokens.fww" name="FWW" />
            <TokenChip :value="farm.tokens.fwf" name="FWF" />
        </v-chip-group>        
    </div>
</template>

<script>
import TokenChip from "@/components/TokenChip.vue";

export default {
  name: "Tokens",
  props: ['farm'],  
  data: () => ({
  }),  
  async mounted() {
  },
  methods: {
  },
  components: {
    TokenChip
  }
};
</script>

<style scoped lang="scss"></style>