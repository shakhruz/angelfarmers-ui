<template>
  <v-container>
    <v-row dense justify="start">
      <v-col cols="auto">
        <FarmsList/>
      </v-col>
    </v-row>
    <v-row dense justify="start">
      <v-col cols="auto" v-for="ff in $store.state.farms" :key="ff.account_name">
        <FarmCard v-bind:farm="ff" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FarmCard from "@/components/FarmCard.vue";
import FarmsSummary from "@/components/FarmInfo/FarmsSummary.vue";
import FarmsList from "@/components/FarmsList.vue";

export default {
  name: "Home",
  data() {
    return {
      newFarm: '',
      showAll: true,
    };
  },
  mounted() {
  },
  methods: {  
    // Добавим новую ферму/фермы
    addFarm() {
      console.log("add new farm: " + this.newFarm);
      const farms = this.newFarm.trim().split(',');
      farms.forEach(ff => {
        // проверим нет ли еще этой фермы в списке       
        this.$store.dispatch("addFarm", ff.trim());
      })      
      this.newFarm = '';
    },
  },
  components: {
    FarmCard, FarmsSummary, FarmsList,
  },
  computed: {
  }  
};
</script>