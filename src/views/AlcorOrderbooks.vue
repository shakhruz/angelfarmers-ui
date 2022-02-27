<template>
  <v-container>
    <span v-if="!is_checking">
        <v-btn icon @click = 'startWatching()'>
            <v-icon>mdi-play</v-icon>
        </v-btn>
    </span>
    <span v-if="is_checking">
        <v-btn icon @click = 'stopWatching()'>
            <v-icon>mdi-stop</v-icon>
        </v-btn>
    </span>    
    <select v-model="show_book_orders">
      <option v-for="item in book_sizes" v-bind:value="item.value">
        {{ item.text }}
      </option>
    </select>

    <div id="orderbooks">
      <div id="fww_orderbook">
        <strong>FWW</strong>
        <div class="orderbook">
          <strong>{{ formatLargeAsset(orderbooks.fww.sell_total_wax) }} WAX</strong>  
          ({{ formatLargeAsset(orderbooks.fww.sell_total) }} FWW)
          <div class="header">
            <span class="price">цена</span>
            <span class="account">продавец</span>
            <span class="bid">FWW</span>
            <span class="ask">WAX</span>
          </div>
          <div v-for="order in orderbooks.fww.asks.slice(0,show_book_orders).reverse()" :key="order.id"> 
            <span class="price">{{ formatLongAsset(order.unit_price/100000000, 6) }}</span>
            <span :class="account_style(order.account)">
              <a :href="`https://wax.bloks.io/account/${order.account}`" target="blank">{{ order.account }}</a>
            </span>
            <span class="bid">{{ formatAsset(order.bid) }}</span>
            <span class="ask">{{ formatAsset(order.ask) }}</span>
          </div>
          <hr/>
          <strong>{{ formatLargeAsset(orderbooks.fww.buy_total_wax) }}</strong> WAX
          ({{ formatLargeAsset(orderbooks.fww.buy_total) }} FWW) {{ formatLongAsset(orderbooks.fww.spread) }} spread 
          {{ formatAsset(orderbooks.fww.spread_ratio) }}%
          {{ formatAsset(orderbooks.fww.buy_total_wax / orderbooks.fww.buy_total) }} WAX
          <hr/>
          <div class="header">
            <span class="price">цена</span>
            <span class="account">покупатель</span>
            <span class="bid">WAX</span>
            <span class="ask">FWW</span>
          </div>
          <div v-for="order in orderbooks.fww.bids.slice(0,show_book_orders)" :key="order.id"> 
            <span class="price">{{ formatLongAsset(order.unit_price/100000000, 6) }}</span>
            <span :class="account_style(order.account)">
              <a :href="`https://wax.bloks.io/account/${order.account}`" target="blank">{{ order.account }}</a>
            </span>
            <span class="bid">{{ formatAsset(order.bid) }}</span>
            <span class="ask">{{ formatAsset(order.ask) }}</span>
          </div>
        </div>
      </div>
      <div id="fwg_orderbook">
        <strong>FWG</strong>
        <div class="orderbook">
          <strong>{{ formatLargeAsset(orderbooks.fwg.sell_total_wax) }} WAX</strong> 
          ({{ formatLargeAsset(orderbooks.fwg.sell_total) }} FWG)
          <div class="header">
            <span class="price">цена</span>
            <span class="account">продавец</span>
            <span class="bid">FWG</span>
            <span class="ask">WAX</span>
          </div>
          <div v-for="order in orderbooks.fwg.asks.slice(0,show_book_orders).reverse()" :key="order.id"> 
            <span class="price">{{ formatLongAsset(order.unit_price/100000000, 6) }}</span>
            <span :class="account_style(order.account)"><a :href="`https://wax.bloks.io/account/${order.account}`" target="blank">{{ order.account }}</a></span>
            <span class="bid">{{ formatAsset(order.bid) }}</span>
            <span class="ask">{{ formatAsset(order.ask) }}</span>
          </div>
          <hr/>
          <strong>{{ formatLargeAsset(orderbooks.fwg.buy_total_wax) }}</strong> WAX
          ({{ formatLargeAsset(orderbooks.fwg.buy_total) }} FWG) {{ formatLongAsset(orderbooks.fwg.spread) }} spread 
          {{ formatAsset(orderbooks.fwg.spread_ratio) }}%
          {{ formatAsset(orderbooks.fwg.buy_total_wax / orderbooks.fwg.buy_total) }} WAX
          <hr/>
          <div class="header">
            <span class="price">цена</span>
            <span class="account">покупатель</span>
            <span class="bid">WAX</span>
            <span class="ask">FWG</span>
          </div>
          <div v-for="order in orderbooks.fwg.bids.slice(0,show_book_orders)" :key="order.id"> 
            <span class="price">{{ formatLongAsset(order.unit_price/100000000, 6) }}</span>
            <span :class="account_style(order.account)"><a :href="`https://wax.bloks.io/account/${order.account}`" target="blank">{{ order.account }}</a></span>
            <span class="bid">{{ formatAsset(order.bid) }}</span>
            <span class="ask">{{ formatAsset(order.ask) }}</span>
          </div>
        </div>
      </div>  
      <div id="fwf_orderbook">
        <strong>FWF</strong>
        <div class="orderbook">
          <strong>{{ formatLargeAsset(orderbooks.fwf.sell_total_wax) }} WAX</strong>
          ({{ formatLargeAsset(orderbooks.fwf.sell_total) }} FWF)
          <div class="header">
            <span class="price">цена</span>
            <span class="account">продавец</span>
            <span class="bid">FWF</span>
            <span class="ask">WAX</span>
          </div>
          <div v-for="order in orderbooks.fwf.asks.slice(0,show_book_orders).reverse()" :key="order.id"> 
            <span class="price">{{ formatLongAsset(order.unit_price/100000000, 6) }}</span>
            <span :class="account_style(order.account)"><a :href="`https://wax.bloks.io/account/${order.account}`" target="blank">{{ order.account }}</a></span>
            <span class="bid">{{ formatAsset(order.bid) }}</span>
            <span class="ask">{{ formatAsset(order.ask) }}</span>
          </div>
          <hr/>
          <strong>{{ formatLargeAsset(orderbooks.fwf.buy_total_wax) }}</strong> WAX
          ({{ formatLargeAsset(orderbooks.fwf.buy_total) }} FWF) {{ formatLongAsset(orderbooks.fwf.spread) }} spread 
          {{ formatAsset(orderbooks.fwf.spread_ratio) }}%
          {{ formatAsset(orderbooks.fwf.buy_total_wax / orderbooks.fwf.buy_total) }} WAX
          <hr/>
          <div class="header">
            <span class="price">цена</span>
            <span class="account">покупатель</span>
            <span class="bid">WAX</span>
            <span class="ask">FWF</span>
          </div>
          <div v-for="order in orderbooks.fwf.bids.slice(0,show_book_orders)" :key="order.id"> 
            <span class="price">{{ formatLongAsset(order.unit_price/100000000, 6) }}</span>
            <span :class="account_style(order.account)"><a :href="`https://wax.bloks.io/account/${order.account}`" target="blank">{{ order.account }}</a></span>
            <span class="bid">{{ formatAsset(order.bid) }}</span>
            <span class="ask">{{ formatAsset(order.ask) }}</span>
          </div>
        </div>
      </div>            
    </div>
    <hr/>
    <div id="done_deals">
      <div id="fww_done_deals">
        <strong>FWW</strong>
        <div class="orderbook">
          <div v-for="deal in fww_deals" :key="deal.id"> 
            <span class="price" :class="deal.type">{{ formatLongAsset(deal.price, 8) }}</span>
            <span :class="account_style(deal.account)">
              <a :href="`https://wax.bloks.io/account/${deal.account}`" target="blank">
                {{ deal.account }}
              </a>
            </span>
            <span class="bid">{{ formatLongAsset(deal.amount, 3) }}</span>
            <span :class="account_style(deal.asker)">
              <a :href="`https://wax.bloks.io/account/${deal.asker}`" target="blank">
                {{ deal.asker }}
              </a>
            </span>
          </div>
        </div>
      </div>
      <div id="fwg_done_deals">
        <strong>FWG</strong>
        <div class="orderbook">
          <div v-for="deal in fwg_deals" :key="deal.id"> 
            <span class="price" :class="deal.type">{{ formatLongAsset(deal.price, 8) }}</span>
            <span :class="account_style(deal.account)">
              <a :href="`https://wax.bloks.io/account/${deal.account}`" target="blank">
                {{ deal.account }}
              </a>
            </span>
            <span class="bid">{{ formatLongAsset(deal.amount, 3) }}</span>
            <span :class="account_style(deal.asker)">
              <a :href="`https://wax.bloks.io/account/${deal.asker}`" target="blank">
                {{ deal.asker }}
              </a>
            </span>
          </div>
        </div>
      </div>
      <div id="fwf_done_deals">
        <strong>FWF</strong>
        <div class="orderbook">
          <div v-for="deal in fwf_deals" :key="deal.id"> 
            <span class="price" :class="deal.type">{{ formatLongAsset(deal.price, 8) }}</span>
            <span :class="account_style(deal.account)">
              <a :href="`https://wax.bloks.io/account/${deal.account}`" target="blank">
                {{ deal.account }}
              </a>
            </span>
            <span class="bid">{{ formatLongAsset(deal.amount,3) }}</span>
            <span :class="account_style(deal.asker)">
              <a :href="`https://wax.bloks.io/account/${deal.asker}`" target="blank">
                {{ deal.asker }}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>

const { JsonRpc } = require('eosjs');
let rpc = new JsonRpc("https://wax.pink.gg");
// let rpc = new JsonRpc("https://api.wax.greeneosio.com");
// let rpc = new JsonRpc("https://wax.cryptolions.io");

const fww_market_id = 104;
const fwf_market_id = 105;
const fwg_market_id = 106;

export default {
  name: "AlcorOrderbooks",
  data() {
    return {
      currentTime: 0,
      timer: null,
      blockchainTimer: null,
      is_checking: false,
      watching: false,
      last_block_num: 0,
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
      show_book_orders: 25,
      reload_time: 1,
      deals: [],
      book_sizes: [
        {text: "10", value: 10},
        {text: "25", value: 25},
        {text: "50", value: 50},
        {text: "100", value: 100},
        {text: "250", value: 200},
        {text: "500", value: 500},
        {text: "1000", value: 1000}
      ],
      fww_deals: [],
      fwg_deals: [],
      fwf_deals: [],
    };
  },
  components: {
  },
  watch: {
  },  
  async mounted() {
    await this.updateOrderbook();
    this.startWatching();
  },
  methods: {  
    account_style(account_name) {
      return account_name == this.$store.state.userAccount ? "account_bold" : "account";
    },    
    async updateOrderbook() {
      this.orderbooks.fww = await this.getMarket(fww_market_id);
      this.orderbooks.fwf = await this.getMarket(fwf_market_id);
      this.orderbooks.fwg = await this.getMarket(fwg_market_id);
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
      orderbook.bids = (await this.get_buyorders(market_id))["rows"];
      orderbook.buy_total_wax = 0;
      orderbook.buy_total = 0;
      if (orderbook && orderbook.bids) {
        for(var c=0; c < orderbook.bids.length; c++) {
          const order = orderbook.bids[c];
          const bid_asset = this.parseAsset(order.bid);
          const ask_asset = this.parseAsset(order.ask);
          if (order.unit_price / 100000000 > 0.01) {
            orderbook.buy_total += ask_asset.number;
            orderbook.buy_total_wax += bid_asset.number;
          }
          orderbook.bids[c]["bid"] = bid_asset.number;
          orderbook.bids[c]["ask"] = ask_asset.number;
        }
      }

      orderbook.asks = (await this.get_sellorders(market_id))["rows"];
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
      orderbook.spread = (orderbook.asks[0].unit_price - orderbook.bids[0].unit_price) / 100000000
      orderbook.spread_ratio = (orderbook.spread / (orderbook.bids[0].unit_price / 100000000)) * 100

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

    // смотрим за каждым блоком и находим там сделки на биржи Алкор
    async watchBlockchain() {
      console.log('start watching blockchain for alcor sales');
      let block_num = 0;
      this.watching = true;
      this.blockchainTimer = setInterval(async ()=>{
          try {
              // Получим номер свежего блока из блокчейна
              const info = await rpc.get_info();
              if (info) {
                  block_num = info["head_block_num"];
                  // Если этот блок мы еще не разбирали
                  if (block_num > this.last_block_num) {
                      this.last_block_num = block_num;
                      const block_info = await rpc.get_block(block_num);
                      const trx = block_info["transactions"];
                      // Еслть ли в нем транзакции?
                      if (trx) {
                          trx.forEach(tr => {
                              // перебираем каждую транзакцию, ищем действия
                              if (tr["trx"]["transaction"] && tr["trx"]["transaction"]["actions"]) {
                                  const actions = tr["trx"]["transaction"]["actions"];
                                  if (actions) {
                                      actions.forEach(async action => {
                                          // перебираем действия, находим объявления о продаже на атомике
                                          // console.log("action: " + action.account + " " + action.name );
                                          if (action.account == "alcordexmain"  
                                              // && (action.name == "buymatch" || action.name == "sellmatch")
                                              ) {
                                              console.log("action: " + action.account + " " + action.name );
                                              // this.processDeal(action);
                                          }
                                      })
                                  }
                              }
                          });
                      }
                  } else {
                      // console.log("рано, подождем: " + block_num);
                  }
              }                    
          } catch (error) {
              console.log('ошибка:' + error.message);                    
          }
      }, 500)
    },
    // обработать полученную транзакцию со сделкой
    async processDeal(action) {
      console.log("deal: " + JSON.stringify(action));
      let bid = this.parseAsset(action["record"]["bid"]);
      let bidder = action["record"]["bidder"];
      let ask = this.parseAsset(action["record"]["ask"]);
      let asker = action["record"]["asker"];
      let market_id = action["record"]["market"]["id"];
      let price = parseInt(action["record"]["unit_price"]) / 100000000;
      let time = action["record"]["timestamp"];
      let id = 0;
      let type, amount, account;
      if (bid.asset_id == "WAX") {
        // buymatch
        type = 'buy';
        amount = bid.number;
        account = bidder;
      } else {
        type = 'sell';
        amount = ask.number;
        account = bidder;
      }
      let done_deal = {
        price: price,
        amount: amount,
        type: type,
        account: account,
        time: time,
        id: id,
        asker: asker
      }
      switch(market_id) {
        // fww
        case fww_market_id:
          if (this.fww_deals.length>0) id = this.fww_deals[0].id + 1;
          done_deal.id = id;
          this.fww_deals.splice(0,0,done_deal);
          this.fww_deals = this.fww_deals.slice(0,this.show_book_orders);
          break;
        // fwf
        case fwf_market_id:
          if (this.fwf_deals.length>0) id = this.fwf_deals[0].id + 1;
          done_deal.id = id;
          this.fwf_deals.splice(0,0,done_deal);
          this.fwf_deals = this.fwf_deals.slice(0,this.show_book_orders);
          break;
        case fwg_market_id:
          if (this.fwg_deals.length>0) id = this.fwg_deals[0].id + 1;
          done_deal.id = id;
          this.fwg_deals.splice(0,0,done_deal);
          this.fwg_deals = this.fwg_deals.slice(0,this.show_book_orders);
          break;
      }
    }
  }
};
</script>

<style>
#sale_history {
  text-align: left;
}

#orderbooks {
  text-align: left;
  font-size: 11px;
}

.price {
  width: 100px;
  font-weight: bold;
  padding-right: 10px;
}

.account {
  width: 50px;
  padding-right: 10px;
  display: inline-block;
}

.bid {
  width: 120px;
  padding-right: 10px;
  display: inline-block;
  text-align: right;
}

.ask {
  width: 120px;
  padding-right: 10px;
  display: inline-block;
  text-align: right;
}

.header {
  font-weight: bold;
}

#fww_orderbook {
  float:left;
}

#fwg_orderbook {
  float:left;
}

.orderbook {
  margin-right: 20px;
  text-align: left;
}

#sell_token_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

.account_bold {
  font-weight: bold;
  color: red;
}

#deals {
  margin-top: 20px;
  font-size: 11px;
}

#done_deals {
  text-align: left;
  font-size: 11px;
  min-height: 100px;
}

#fww_done_deals {
  float:left;
  width: 400px;
}

#fwg_done_deals {
  float:left;
  width: 400px;
}

.buy {
  color: green;
}

.sell {
  color: red;
}

</style>
