<template>
  <div class="ma-3">
    <v-card elevation="2" 
            :min-width="$vuetify.breakpoint.mobile ? '380px' : '420px'"
            :max-width="$vuetify.breakpoint.mobile ? '380px' : '450px'"
            class="justify-center" raised rounded="lg"
            :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'teal darken-1 white--text'">

      <v-card-title>
          {{$t("Alcor Market")}}
          <v-spacer></v-spacer>
          <span v-if="!is_checking" class="mx-2">
                <v-btn icon @click = 'startWatching()'>
                    <v-icon>mdi-play</v-icon>
                </v-btn>
            </span>
            <span v-if="is_checking" class="mx-2">
                <v-btn icon @click = 'stopWatching()' class='white--text'>
                    <v-icon>mdi-pause</v-icon>
                </v-btn>
            </span>    
            <span style="width:100px">
              <v-select v-model="show_book_orders" :items="book_sizes" dense hide-details solo width="20px">
              </v-select>
            </span>
      </v-card-title>   
 
      <v-tabs>
          <v-tab @click="filter='fww'">FWW</v-tab>
          <v-tab @click="filter='fwg'">FWG</v-tab>
          <v-tab @click="filter='fwf'">FWF</v-tab>
      </v-tabs>
      <v-card-text>
        <div v-if="filter=='fww'" class="white--text">
          <strong>{{ formatLargeAsset(orderbooks.fww.sell_total_wax) }} WAX</strong>  
          ({{ formatLargeAsset(orderbooks.fww.sell_total) }} FWW)
          ${{ formatLargeAsset(orderbooks.fww.sell_total_wax * $store.state.prices.wax) }}
          <v-data-table
            :headers="headers_fww_asks"
            :items="orderbook_fww_asks"
            dense disable-pagination hide-default-footer
            class="elevation-1">

            <template v-slot:item.price="{ item }">
              {{ formatLongAsset(item.unit_price/100000000, 6) }}
            </template>    
            <template v-slot:item.account="{ item }">
                <a :href="`https://wax.bloks.io/account/${item.account}`" target="blank">{{ item.account }}</a>
            </template>    
            <template v-slot:item.bid="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.bid) }}
              </v-layout>
            </template>    
            <template v-slot:item.ask="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.ask) }}
              </v-layout>
            </template>    
          </v-data-table>
          <strong>{{ formatLargeAsset(orderbooks.fww.buy_total_wax) }}</strong> WAX
          ({{ formatLargeAsset(orderbooks.fww.buy_total) }} FWW) 
          ${{ formatLargeAsset(orderbooks.fww.buy_total_wax*$store.state.prices.wax) }}
          {{$t('spread')}}: <strong><small>{{ formatAsset(orderbooks.fww.spread_ratio) }}%</small></strong>
          <!-- {{ formatLongAsset(orderbooks.fww.spread) }} spread  -->
          <!-- {{ formatAsset(orderbooks.fww.buy_total_wax / orderbooks.fww.buy_total) }} WAX -->
          <v-data-table
            :headers="headers_fww_bids"
            :items="orderbook_fww_bids"
            dense disable-pagination hide-default-footer
            class="elevation-1">

            <template v-slot:item.price="{ item }">
              {{ formatLongAsset(item.unit_price/100000000, 6) }}
            </template>    
            <template v-slot:item.account="{ item }">
              <span :class="account_style(item.account)">
                <a :href="`https://wax.bloks.io/account/${item.account}`" target="blank">{{ item.account }}</a>
              </span>
            </template>    
            <template v-slot:item.bid="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.bid) }}
              </v-layout>
            </template>    
            <template v-slot:item.ask="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.ask) }}
              </v-layout>
            </template>    
          </v-data-table>          
        </div>

        <div v-if="filter=='fwg'" class="white--text">
          <strong>{{ formatLargeAsset(orderbooks.fwg.sell_total_wax) }} WAX</strong> 
          ({{ formatLargeAsset(orderbooks.fwg.sell_total) }} FWG)
          ${{ formatLargeAsset(orderbooks.fwg.sell_total_wax * $store.state.prices.wax) }}
          <v-data-table
            :headers="headers_fwg_asks"
            :items="orderbook_fwg_asks"
            dense disable-pagination hide-default-footer
            class="elevation-1">

            <template v-slot:item.price="{ item }">
              {{ formatLongAsset(item.unit_price/100000000, 6) }}
            </template>    
            <template v-slot:item.account="{ item }">
                <a :href="`https://wax.bloks.io/account/${item.account}`" target="blank">{{ item.account }}</a>
            </template>    
            <template v-slot:item.bid="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.bid) }}
              </v-layout>
            </template>    
            <template v-slot:item.ask="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.ask) }}
              </v-layout>
            </template>    
          </v-data-table>

          <strong>{{ formatLargeAsset(orderbooks.fwg.buy_total_wax) }}</strong> WAX
          ({{ formatLargeAsset(orderbooks.fwg.buy_total) }} FWG) 
          ${{ formatLargeAsset(orderbooks.fwg.buy_total_wax*$store.state.prices.wax) }}
          {{$t('spread')}}: <strong><small>{{ formatAsset(orderbooks.fwg.spread_ratio) }}%</small></strong>
          
          <!-- {{ formatLongAsset(orderbooks.fwg.spread) }} spread 
          {{ formatAsset(orderbooks.fwg.spread_ratio) }}%
          {{ formatAsset(orderbooks.fwg.buy_total_wax / orderbooks.fwg.buy_total) }} WAX -->
          <v-data-table
            :headers="headers_fwg_bids"
            :items="orderbook_fwg_bids"
            dense disable-pagination hide-default-footer
            class="elevation-1">

            <template v-slot:item.price="{ item }">
              {{ formatLongAsset(item.unit_price/100000000, 6) }}
            </template>    
            <template v-slot:item.account="{ item }">
              <span :class="account_style(item.account)">
                <a :href="`https://wax.bloks.io/account/${item.account}`" target="blank">{{ item.account }}</a>
              </span>
            </template>    
            <template v-slot:item.bid="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.bid) }}
              </v-layout>
            </template>    
            <template v-slot:item.ask="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.ask) }}
              </v-layout>
            </template>    
          </v-data-table>    
        </div>  

        <div v-if="filter=='fwf'" class="white--text">
          <strong>{{ formatLargeAsset(orderbooks.fwf.sell_total_wax) }} WAX</strong> 
          ({{ formatLargeAsset(orderbooks.fwf.sell_total) }} FWG)
          ${{ formatLargeAsset(orderbooks.fwf.sell_total_wax * $store.state.prices.wax) }}
          <v-data-table
            :headers="headers_fwf_asks"
            :items="orderbook_fwf_asks"
            dense disable-pagination hide-default-footer
            class="elevation-1">

            <template v-slot:item.price="{ item }">
              {{ formatLongAsset(item.unit_price/100000000, 6) }}
            </template>    
            <template v-slot:item.account="{ item }">
                <a :href="`https://wax.bloks.io/account/${item.account}`" target="blank">{{ item.account }}</a>
            </template>    
            <template v-slot:item.bid="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.bid) }}
              </v-layout>
            </template>    
            <template v-slot:item.ask="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.ask) }}
              </v-layout>
            </template>    
          </v-data-table>

          <strong>{{ formatLargeAsset(orderbooks.fwf.buy_total_wax) }}</strong> WAX
          ({{ formatLargeAsset(orderbooks.fwf.buy_total) }} FWG) 
          ${{ formatLargeAsset(orderbooks.fwf.buy_total_wax*$store.state.prices.wax) }}
          {{$t('spread')}}: <strong><small>{{ formatAsset(orderbooks.fwf.spread_ratio) }}%</small></strong>
          
          <!-- {{ formatLongAsset(orderbooks.fwf.spread) }} spread 
          {{ formatAsset(orderbooks.fwf.spread_ratio) }}% -->
          <!-- {{ formatAsset(orderbooks.fwf.buy_total_wax / orderbooks.fwf.buy_total) }} WAX -->
          <v-data-table
            :headers="headers_fwf_bids"
            :items="orderbook_fwf_bids"
            dense disable-pagination hide-default-footer
            class="elevation-1">

            <template v-slot:item.price="{ item }">
              {{ formatLongAsset(item.unit_price/100000000, 6) }}
            </template>    
            <template v-slot:item.account="{ item }">
              <span :class="account_style(item.account)">
                <a :href="`https://wax.bloks.io/account/${item.account}`" target="blank">{{ item.account }}</a>
              </span>
            </template>    
            <template v-slot:item.bid="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.bid) }}
              </v-layout>
            </template>    
            <template v-slot:item.ask="{ item }">
              <v-layout justify-end>
                {{ formatAsset(item.ask) }}
              </v-layout>
            </template>    
          </v-data-table>    
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined text class="white--text" @click = 'closeAlcor()'>
              {{$t("Close")}}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

const { JsonRpc } = require('eosjs');
let rpc = new JsonRpc("https://wax.pink.gg");

const fww_market_id = 104;
const fwf_market_id = 105;
const fwg_market_id = 106;

export default {
  name: "AlcorOrderbookCard",
  data() {
    return {
      headers_fww_asks: [
          { text: this.$t('Price'), value: 'price', width: '50px' },
          { text: this.$t('Seller'), value: 'account', width: '50px' },
          { text: this.$t('FWW'), value: 'bid' },
          { text: this.$t('WAX'), value: 'ask' },
        ],
      headers_fww_bids: [
          { text: this.$t('Price'), value: 'price', width: '50px' },
          { text: this.$t('Buyer'), value: 'account', width: '50px' },
          { text: this.$t('WAX'), value: 'bid' },
          { text: this.$t('FWW'), value: 'ask' },
        ],
      headers_fwg_asks: [
          { text: this.$t('Price'), value: 'price', width: '50px' },
          { text: this.$t('Seller'), value: 'account', width: '50px' },
          { text: this.$t('FWG'), value: 'bid' },
          { text: this.$t('WAX'), value: 'ask' },
        ],
      headers_fwg_bids: [
          { text: this.$t('Price'), value: 'price', width: '50px' },
          { text: this.$t('Buyer'), value: 'account', width: '50px' },
          { text: this.$t('WAX'), value: 'bid' },
          { text: this.$t('FWG'), value: 'ask' },
        ],
      headers_fwf_asks: [
          { text: this.$t('Price'), value: 'price', width: '50px' },
          { text: this.$t('Seller'), value: 'account', width: '50px' },
          { text: this.$t('FWF'), value: 'bid' },
          { text: this.$t('WAX'), value: 'ask' },
        ],
      headers_fwf_bids: [
          { text: this.$t('Price'), value: 'price', width: '50px' },
          { text: this.$t('Buyer'), value: 'account', width: '50px' },
          { text: this.$t('WAX'), value: 'bid' },
          { text: this.$t('FWF'), value: 'ask' },
        ],
      currentTime: 0,
      timer: null,
      blockchainTimer: null,
      is_checking: false,
      watching: false,
      last_block_num: 0,
      filter: 'fww',
      orderbooks: {
        fww: {
          bids: [],
          asks: [],
          buy_total: 0,
          sell_total: 0,
          buy_total_wax: 0,
          sell_total_wax:0
        },
        fwf: {
          bids: [],
          asks: [],
          buy_total: 0,
          sell_total: 0,
          buy_total_wax: 0,
          sell_total_wax:0
        },
        fwg: {
          bids: [],
          asks: [],
          buy_total: 0,
          sell_total: 0,
          buy_total_wax: 0,
          sell_total_wax:0
        }                
      },
      orders: [],
      show_book_orders: 5,
      reload_time: 1,
      deals: [],
      book_sizes: [
        {text: "5", value: 5},
        {text: "10", value: 10},
        {text: "25", value: 25},
        {text: "50", value: 50},
        {text: "100", value: 100},
        // {text: "250", value: 200},
        // {text: "500", value: 500},
        // {text: "1000", value: 1000}
      ],
      fww_deals: [],
      fwg_deals: [],
      fwf_deals: [],
    };
  },
  components: {
  },
  mounted() {
    this.updateOrderbook().then(()=>{
      this.startWatching();
    });
  },
  methods: {  
    account_style(account_name) {
      return account_name == this.$store.state.userAccount ? "red--text" : "";
    },    
    async updateOrderbook() {
      const fww = await this.getMarket(fww_market_id);
      if (fww.bids.length>0) this.orderbooks.fww = fww;
      const fwf = await this.getMarket(fwf_market_id);
      if (fwf.bids.length>0) this.orderbooks.fwf = fwf;
      const fwg = await this.getMarket(fwg_market_id);
      if (fwf.bids.length>0) this.orderbooks.fwg = fwg;
    },
    async getMarket(market_id) {
      // console.log("get market: " + market_id);

      let orderbook = {
          bids: [],
          asks: [],
          buy_total: 0,
          sell_total: 0,
          buy_total_wax: 0,
          sell_total_wax:0
      };
      const bids = await this.get_buyorders(market_id);
      if (bids && bids["rows"] && bids["rows"][0]) {
        // console.log("bids: " + JSON.stringify(bids));
        orderbook.bids = bids["rows"];
        orderbook.buy_total_wax = 0;
        orderbook.buy_total = 0;
        if (orderbook && orderbook.bids) {
          for(var c=0; c < orderbook.bids.length; c++) {
            const order = orderbook.bids[c];
            const bid_asset = this.parseAsset(order.bid);
            const ask_asset = this.parseAsset(order.ask);
            if (order.unit_price / 100000000 > 0.0001) {
              if (ask_asset && ask_asset.number>0) orderbook.buy_total += ask_asset.number;
              if (bid_asset && bid_asset.number>0) orderbook.buy_total_wax += bid_asset.number;
            }
            orderbook.bids[c]["bid"] = bid_asset.number;
            orderbook.bids[c]["ask"] = ask_asset.number;
          }
        }
      }

      const asks = await this.get_sellorders(market_id);
      if (asks && asks["rows"] && asks["rows"][0]) {
        orderbook.asks = asks["rows"];
        orderbook.sell_total_wax = 0;
        orderbook.sell_total = 0;
        if (orderbook && orderbook.asks) {
          for(var c=0; c< orderbook.asks.length; c++) {
            const order = orderbook.asks[c];
            const bid_asset = this.parseAsset(order.bid);
            const ask_asset = this.parseAsset(order.ask);
            orderbook.sell_total_wax += ask_asset.number;
            orderbook.sell_total += bid_asset.number;
            orderbook.asks[c]["ask"] = ask_asset.number;
            orderbook.asks[c]["bid"] = bid_asset.number;
          }
        }
        if (orderbook.asks[0] && orderbook.bids[0]) {
          orderbook.spread = (orderbook.asks[0].unit_price - orderbook.bids[0].unit_price) / 100000000
          orderbook.spread_ratio = (orderbook.spread / (orderbook.bids[0].unit_price / 100000000)) * 100
        }
      }

      // console.log("orderbook: " + JSON.stringify(orderbook));

      return orderbook;
    },
    async startWatching() {
      this.currentTime = 0;
      this.is_checking = true;
      // this.watchBlockchain();

      this.timer = setInterval(async () => {
        if (this.currentTime === 0 ) {
          this.currentTime = this.reload_time;
          await this.update_data();
        } else this.currentTime--;
      }, 1000)
    },
    async update_data() {
      await this.updateOrderbook();
      this.currentTime = this.reload_time;
    },
    async stopWatching() {
      console.log("stop timer");
      this.currentTime = 0;
      this.is_checking = false;
      clearInterval(this.timer);
      this.watching = false;
      clearInterval(this.blockchainTimer);
    },
    closeAlcor() {
      this.stopWatching();
      this.$store.state.showAlcorOrderbook=false;
    }
  },
  computed: {
    orderbook_fww_asks() {
      return this.orderbooks.fww.asks.slice(0,this.show_book_orders).reverse();
    },
    orderbook_fww_bids() {
      return this.orderbooks.fww.bids.slice(0,this.show_book_orders);
    },
    orderbook_fwf_asks() {
      return this.orderbooks.fwf.asks.slice(0,this.show_book_orders).reverse();
    },
    orderbook_fwf_bids() {
      return this.orderbooks.fwf.bids.slice(0,this.show_book_orders);
    },
    orderbook_fwg_asks() {
      return this.orderbooks.fwg.asks.slice(0,this.show_book_orders).reverse();
    },
    orderbook_fwg_bids() {
      return this.orderbooks.fwg.bids.slice(0,this.show_book_orders);
    },
  }
};
</script>

<style>
</style>
