<template>
    <span v-if="farm.assets && farm.assets.unique && farm.assets.unique.length > 0">
        <v-divider class="mx-1"></v-divider>
        <div class="mb-1 mt-0 pt-0 pb-0 mx-2">
            <v-card-subtitle class="pa-0 mt-2 mb-1 mx-2">
                <v-chip label small>
                    <strong>{{$t("CHEST")}} :</strong>
                </v-chip>
                <v-chip label small outlined v-if="farm.assets.total_wax>0">      
                    <strong>
                        <span :class="getResourceNumberColor(farm.assets.total_wax)"> 
                            {{ formatAssetPrice(farm.assets.total_wax) }}￦
                        </span>
                    </strong>
                </v-chip>
                <v-chip label small outlined v-if="farm.assets.total_wax>0">            
                    <span :class="getResourceNumberColor(farm.assets.total_wax)"> 
                        ${{ formatAssetPrice(farm.assets.total_wax*farm.prices.wax) }}
                    </span>
                </v-chip>
            </v-card-subtitle>
            <span v-for="asset in farm.assets.unique" :key="asset.id" class="mx-2">
                <ChestItem :farm="farm" :asset="asset"/>
            </span>
        </div>
    </span>
</template>

<script>
import ChestItem from "@/components/FarmInfo/ChestItem.vue";

export default {
  name: "FarmChest",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  },
  components: {
      ChestItem
  }
}
</script>

<style scoped>
.chest_item img {
    width: 30px;
}
</style>