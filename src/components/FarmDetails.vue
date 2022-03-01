<template>
    <v-card 
        :id="farm.account_name"
        elevation="2" 
        outlined :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'rgb(255 238 205)'"
        :min-width="$vuetify.breakpoint.mobile ? '360px' : '360px'"
        :max-width="$vuetify.breakpoint.mobile ? '400px' : '530px'"
        v-if="farm!=null && farm.account!=null">
        <v-card-subtitle class="mb-0 pb-0 mt-0 pt-1">
          {{$t("FARM RESOURCES")}}
        </v-card-subtitle>
        <FarmMiningInfo :farm="farm" />
        <FarmCowshedInfo :farm="farm"/>
        <FarmCalfInfo :farm="farm"/>
        <FarmChickenInfo :farm="farm"/>
        <FarmEggsInfo :farm="farm"/>
        <FarmCropsInfo :farm="farm" />     
    </v-card>
</template>

<script>
import FarmCropsInfo from "@/components/FarmInfo/FarmCropsInfo.vue";
import FarmMiningInfo from "@/components/FarmInfo/FarmMiningInfo.vue";
import FarmCowshedInfo from "@/components/FarmInfo/FarmCowshedInfo.vue";
import FarmCalfInfo from "@/components/FarmInfo/FarmCalfInfo.vue";
import FarmChickenInfo from "@/components/FarmInfo/FarmChickenInfo.vue";
import FarmEggsInfo from "@/components/FarmInfo/FarmEggsInfo.vue";

export default {
  name: "FarmDetails",
  props: ['farm'],
  data: () => ({
  }),
  async mounted() {
  },
  methods: {
  },
  computed: {
  },
  components: {
    FarmCropsInfo, FarmMiningInfo, FarmCowshedInfo, FarmChickenInfo, FarmCalfInfo, FarmEggsInfo
  },    
};
</script>

<style scoped lang="scss">
</style>
