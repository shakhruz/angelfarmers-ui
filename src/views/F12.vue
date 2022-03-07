<template>
  <v-container>
    <Prices v-if="$vuetify.breakpoint.mobile"/>
    <v-row dense justify="center" class="mx-n16">
      <v-col cols="auto">
        <Accounts/>
      </v-col>
      <v-col cols="auto">
        <TopFarms />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <AtomicPanelCards v-if="$store.state.showAtomicPanel" />
      </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols="auto">
          <FarmF12Card :farm="$store.state.farms[$store.state.selectedFarmIndex]" :index="$store.state.selectedFarmIndex" />
        </v-col>
        <v-col cols="auto">
          <Transition name="bounce">
            <FarmManagerCard :farm="$store.state.farms[$store.state.selectedFarmIndex]" 
                    :index="$store.state.selectedFarmIndex" 
                    v-if="$store.state.farms[$store.state.selectedFarmIndex] && !$store.state.farms[$store.state.selectedFarmIndex].settings.hide" />
          </Transition>
        </v-col>
        <v-col cols="auto">
          <FarmDetails :farm="$store.state.farms[$store.state.selectedFarmIndex]" :index="$store.state.selectedFarmIndex"/>
        </v-col>
    </v-row>
    <v-row v-for="(ff, index) in $store.state.farms" :key="ff.account_name" justify="center">
      <v-col cols="auto">
          <FarmF12Card :farm="ff" v-if="index!=$store.state.selectedFarmIndex" :index="index" />
      </v-col>
      <v-col cols="auto">
        <Transition name="bounce">
          <FarmManagerCard :farm="ff" 
              v-if="index!=$store.state.selectedFarmIndex && !$store.state.farms[index].settings.hide" 
              :index="index" />
        </Transition>
      </v-col>
      <v-col cols="auto">
          <FarmDetails :farm="ff" v-if="index!=$store.state.selectedFarmIndex" :index="index" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FarmF12Card from "@/components/FarmF12Card.vue";
import FarmDetails from "@/components/FarmDetails.vue";
import FarmManagerCard from "@/components/FarmManagerCard.vue";
import Accounts from "@/components/Accounts.vue";
import TopFarms from "@/components/TopFarms.vue";
import Prices from '@/components/Prices.vue';
import AtomicPanelCards from "@/components/AtomicPanelCards.vue";

export default {
  name: "F12",
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {  
  },
  components: {
    FarmF12Card, Accounts, Prices, FarmDetails, FarmManagerCard, TopFarms, AtomicPanelCards
  },
  computed: {
  }  
};
</script>

<style scoped>
/* BOUNCE ANIMATION*/
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>