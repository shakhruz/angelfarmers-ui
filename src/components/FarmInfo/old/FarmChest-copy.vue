<template>
    <span v-if="farm.assets && farm.assets.unique && farm.assets.unique.length > 0">
        <v-divider class="mx-1"></v-divider>
        <div class="ml-2">
            <v-card-subtitle class="ma-0 pa-0">
                {{$t("CHEST")}}  
                <span class="caption">
                    (total: {{formatAssetPrice(farm.assets.total_wax)}}￦)
                </span>
            </v-card-subtitle>
            <span v-for="asset in farm.assets.unique" :key="asset.id" class="gamecard_info">
                <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                        <span
                            v-bind="attrs"
                            v-on="on"
                            >
                            <a :href="atomicUrl(asset.template_id)" target='_blank'>
                                <img :src="`/fw/assets/${asset.template_id}.png`" class="gamecard">
                            </a>
                        </span>
                    </template>
                    <span>
                        <strong>{{ $t(asset.name).toUpperCase() }}</strong><br/>
                        {{$t("cost")}}: <strong>{{formatAssetPrice(asset.cost)}}￦</strong><br/>
                        {{$t("price")}}: <strong>{{formatAssetPrice(asset.price)}}￦</strong><br/>
                        {{$t("total cost")}}: {{formatAssetPrice(asset.cost)}}x{{asset.counter}} =
                        <strong>{{formatAssetPrice(asset.cost * asset.counter)}}￦</strong><br/>
                        {{$t("total price")}}: {{formatAssetPrice(asset.price)}}x{{asset.counter}} =
                        <strong>{{formatAssetPrice(asset.price * asset.counter)}}￦</strong><br/>
                    </span>
                    <!-- <a :href="atomicUrl(asset.template_id)" target='_blank'>OPEN ATOMIC</a> -->
                </v-tooltip> 
                <span class="chest_counter">{{ asset.counter }}</span>
            </span>
        </div>
    </span>
</template>

<script>
export default {
  name: "FarmChest",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  }    
}
</script>