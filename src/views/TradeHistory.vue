<template>
  <div id="sales_history">
    <div class="label">
      <strong>История продаж:</strong>
    </div>
    <div id="sale_history">
      <div v-for="(sale, index) in sell_history" :key="sale.sale_id">
        <div class="table_num">
          {{ index + 1 }}.
        </div>
        <div class="table_name">
          {{ sale["assets"][0]["name"] }} 
        </div>
        <div class="table_data1">
          <strong>
            {{ formatPriceAtomic(sale["price"]["amount"]) }}
          </strong>
        </div>
        <div class="table_data2">
          {{ formatFullDate(new Date(parseInt(sale["created_at_time"])))}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TradeHistory",
  data() {
    return {
      sell_history: [], 
    };
  },
  async mounted() {
    this.sell_history = await this.getAssetsOnSale(this.$store.state.userAccount, 3);
  },
};
</script>


<style>
#sale_history {
  text-align: left;
  float:clear;
  padding: 10px;
}

#sales_history {
  float:clear;
  margin:20px;
  padding: 10px;
}

.separator {
  float:clear;
  margin-top:20px;
}

.param {
  margin: 5px;
  margin-top:10px;
}

.red_label {
  color: red;
}

.table_name {
  min-width: 200px;
  float:left;
}

.table_data1 { 
  padding-left: 10px;
  min-width: 80px;
  float:left;
  text-align: right;
}

.table_data2 { 
  padding-left: 20px;
  text-align: right;
}

.table_num { 
  min-width: 25px;
  float:left;
}

.num_positive {
  background-color: rgb(193, 230, 193);
}

.num_negative {
  background-color: rgb(250, 182, 182);
}

</style>
