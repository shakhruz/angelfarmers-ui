<template>
  <div class="ma-3">  
    <v-data-table
      :headers="headers"
      :items="$store.state.atomic_assets"
      :sort-desc="[false, true]"
      dense disable-pagination hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.num="{ item }">
          {{ item.num }}
          <!-- <img :src="`/fw/assets/${item.template_id}.png`" class="gamecard"> -->
      </template>      
      <template v-slot:item.name="{ item }">
        <strong>
          <a :href="atomicUrl(item.template_id)" target='_blank'> {{ $t(item.name).toUpperCase() }} </a>
        </strong>
      </template>    
      <template v-slot:item.cost="{ item }">
        <v-layout justify-end>
          {{ formatAssetPrice(item.cost) }}
        </v-layout>
      </template>    
      <template v-slot:item.sale_price="{ item }">
        <v-layout justify-end>
          {{ formatAssetPrice(item.sale_price) }}
        </v-layout>
      </template>    
      <template v-slot:item.price="{ item }">
        <v-layout justify-end>
          {{ formatAssetPrice(item.price) }}
        </v-layout>
      </template>    
      <template v-slot:item.price_usd="{ item }">
        <v-layout justify-end>
          ${{ formatAssetPrice(item.price*$store.state.prices.wax) }}
        </v-layout>
      </template>    
      <template v-slot:item.profit="{ item }">
        <div :class="item.profit>=0 ? 'green--text' : 'red--text'">
          <v-layout justify-end>
            {{ formatAssetPrice(item.profit) }}%
          </v-layout>
        </div>
      </template>    
      <template v-slot:item.purchase_profit="{ item }">
        <div :class="item.purchase_profit>=0 ? 'green--text' : 'red--text'" v-if="item.purchase_profit">
          <v-layout justify-end>
            {{ item.purchase_profit ? formatAssetPrice(item.purchase_profit) : '' }}%
          </v-layout>
        </div>
      </template>        
      <template v-slot:item.average_price="{ item }">
        <v-layout justify-end>
          {{ formatAssetPrice(item.average_price) }}
        </v-layout>
      </template>    
      <template v-slot:item.deviation="{ item }">
          <span :class="percentStyle(item.deviation)">
          <v-layout justify-end>
            {{ formatAssetPrice(item.deviation) }}%
          </v-layout>
          </span>
      </template>        
      <template v-slot:item.supply="{ item }">
        <v-layout justify-end>
          {{ item.supply }}
        </v-layout>
      </template>    

    </v-data-table>
        <v-btn icon @click = '$store.dispatch("saveAtomicAssets"); $store.dispatch("updateAtomicAssets")'>
          <v-icon>mdi-cached</v-icon>
    </v-btn>    
  </div>
</template>

<script>

export default {
  name: "AtomicPanel",
  data() {
    return {
      currentTime: 0,
      atomicAssetUpdateTimer: null,
      is_checking: false,
      headers: [
          { text: 'id', value: 'num', width: 10},
          {
            text: this.$t('Asset name'),
            align: 'start',
            sortable: true,
            value: 'name',
            width: "320px"
          },
          { text: this.$t('Craft cost ￦'), value: 'cost', sortable: true, width: '50px' },
          { text: this.$t('Sale Price ￦'), value: 'sale_price', sortable: true, width: '50px' },
          { text: this.$t('Atomic Price ￦'), value: 'price', sortable: true, width: '50px' },
          { text: this.$t('Atomic Price $'), value: 'price_usd', sortable: true, width: '50px' },
          { text: this.$t('Profit %'), value: 'profit', sortable: true, width: '50px' },
          { text: this.$t('Purchase Profit %'), value: 'purchase_profit', sortable: true, width: '50px' },
          { text: this.$t('Average Price ￦'), value: 'average_price', sortable: true, width: '30px' },
          { text: this.$t('Supply'), value: 'supply', sortable: true, width: '10px' },
          // { text: 'Sales', value: 'sales', sortable: true, width: '10px' },
          { text: this.$t('On Sale'), value: 'count', sortable: true },
        ]
    };
  },
  async mounted() {
    this.$store.dispatch('updateAtomicAssets');
    this.startAtomicPanelTimer();
  },
  methods: {  
    async startAtomicPanelTimer() {
      this.currentTime = 0;
      this.is_checking = true;

      this.atomicAssetUpdateTimer = setInterval(async () => {
        this.$store.dispatch('updateAtomicAssets');
      }, 60000)
    },
    async stopTimer() {
      this.currentTime = 0;
      clearTimeout(this.atomicAssetUpdateTimer);
      this.is_checking = false;
    },
  }
};

</script>

<style lang="scss">
.num_positive {
  background-color: rgb(193, 230, 193);
}

.num_negative {
  background-color: rgb(250, 182, 182);
}

.gamecard {
    height: 60px;
    margin: 5px;
    transition: all .2s ease-in-out;        
}

.gamecard:hover{
    transform: scale(1.1);
}

</style>
