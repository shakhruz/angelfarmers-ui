<template>
  <div class="ma-2 pa-2">
    <v-card class="pa-4">
      <v-card-title>{{$t('Dummy actions for setting up WAX Cloud wallet permissions')}}</v-card-title>
      <!-- <v-card-text>In order to allow AngelFarmers seamlessly manage your account</v-card-text> -->
      <v-btn @click="fw_recover_energy(1, $store.state.userAccount)">Recover energy</v-btn>
      <v-btn @click="fw_claim('1099567885359', $store.state.userAccount)">Claim tool</v-btn>
      <v-btn @click="fw_crop_claim('1099586679612', $store.state.userAccount)">Crop claim</v-btn>
      <v-btn @click="fw_repair('1099586709346', $store.state.userAccount)">Repair tool</v-btn>
      <v-btn @click="fw_membership_claim('1099586303503', $store.state.userAccount)">Claim membership</v-btn>
      <!-- <v-btn @click="fw_membership_wear('1099586303503', $store.state.userAccount)">Membership wear</v-btn> -->
      <v-btn @click="fw_claim_building('1099586303503', $store.state.userAccount)">Claim bulding</v-btn>
      <v-btn @click="fw_feed_animal('1099586303503', $store.state.userAccount)">Feed animal</v-btn>
      <v-btn @click="fw_plant_seeds($store.state.userAccount, '1099586303503')">Plant Seeds</v-btn>
      <v-btn @click="fw_buy_seeds($store.state.userAccount, '1099586303503')">Buy Seeds</v-btn>
      <v-btn @click="fw_send_tokens($store.state.userAccount, 1, 'FWF', $store.state.userAccount)">Transfer tokens</v-btn>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "Setup",
  data() {
    return {
    };
  },
  components: {
  },
  async mounted() {
  },
  methods: {  
  }
};
</script>

<style lang="scss" scoped>

button {
  margin: 10px;
}

</style>
