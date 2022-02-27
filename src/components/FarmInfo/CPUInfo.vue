<template>
    <small>
        <v-icon v-if="cpu_used>=90" small >mdi-battery-90</v-icon> 
        <v-icon v-else-if="cpu_used>=80" small >mdi-battery-80</v-icon> 
        <v-icon v-else-if="cpu_used>=70" small >mdi-battery-70</v-icon> 
        <v-icon v-else-if="cpu_used>=60" small >mdi-battery-60</v-icon> 
        <v-icon v-else-if="cpu_used>=50" small >mdi-battery-50</v-icon> 
        <v-icon v-else-if="cpu_used>=40" small >mdi-battery-40</v-icon> 
        <v-icon v-else-if="cpu_used>=30" small >mdi-battery-30</v-icon> 
        <v-icon v-else-if="cpu_used>=20" small >mdi-battery-20</v-icon> 
        <v-icon v-else-if="cpu_used>=10" small >mdi-battery-10</v-icon> 
        <v-icon v-else-if="cpu_used>=0" small >mdi-battery</v-icon> 
        <span>
            {{ formatAsset(cpu_used, 0) }}%
        </span>            
    </small>    
</template>

<script>
export default {
  name: "CPUInfo",
  props: ["cpu_used"],
  async mounted() {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss"></style>