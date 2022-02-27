<template>
  <div class="home">
    <div v-if="assets_on_sale && assets_on_sale.length > 0">
      <strong>
        {{$t("My Items on Sale")}}
      </strong>
      <ul id="assets_on_sale">
        <li v-for="(sale, index) in assets_on_sale" :key="sale.sale_id">
          {{ index + 1 }}. {{ sale["assets"][0]["name"] }} {{ formatPriceAtomic(sale["price"]["amount"]) }} wax 
          <a href="" @click.prevent="cancel_atomic_sale(sale.sale_id);update_data()">
            {{$t("cancel")}}
          </a>
        </li>
      </ul>
    </div>
    <div v-else>
      {{$t("nothing on sale")}}
    </div>
  </div>
</template>

<script>

export default {
  name: "AtomicSales",
  data() {
    return {
      assets_on_sale: [],   
      farm: null,
      farm_account: null,
    };
  },
  mounted() {
      setTimeout( () => {
        if (this.$store.state.logged_in) {
          this.farm = this.$store.state.farms[0];
          this.farm_account = this.farm.account_name;

          this.getAssetsOnSale(this.farm_account, 1).then((result)=> {
            this.assets_on_sale = result;
            console.log("assets on sale: " + JSON.stringify(this.assets_on_sale, null, 2));
          });
        }
      },1000);
  },
  methods: {  
    async startTimer() {
      this.currentTime = 0;
      this.is_checking = true;

      this.timer = setInterval(async () => {
        if (this.currentTime === 0 ) {
          this.currentTime = 25;
          this.assets_on_sale = await this.getAssetsOnSale(this.$store.state.userAccount, 1);
        } else this.currentTime--;
      }, 1000)
    },
    async update_data() {
        this.assets_on_sale = await this.getAssetsOnSale(this.$store.state.userAccount, 1);
    },
    async stopTimer() {
      this.currentTime = 0;
      clearTimeout(this.timer);
      this.is_checking = false;
    },
  }
};
</script>

<style>
</style>
