<template>
  <v-container>
    <v-row dense justify="center" class="mx-n16">
      <!-- <v-col cols="auto">
        <AWAX />
      </v-col> -->
      <v-col cols="auto">
        <AvatarMinter />
      </v-col>      
      <v-col cols="auto" v-for="avatar in $store.state.avatars" :key="avatar.name">
        <AvatarCard :avatar="avatar" />
      </v-col>      
    </v-row>
  </v-container>
</template>

<script>
import AWAX from "@/components/AWAX.vue";
import AvatarMinter from "@/components/AvatarMinter.vue";
import AvatarCard from "@/components/AvatarCard.vue";

export default {
  name: "Avatars",
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {  
  },
  components: {
    AWAX, AvatarMinter, AvatarCard
  },
  computed: {
  }  
};
</script>

<style scoped></style>