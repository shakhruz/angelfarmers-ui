<template>
  <div class="home">
    <div id="market" style="text-align:left">Маркет:
        <div>
          <div class="table_num">&nbsp; </div>
          <div class="table_name">&nbsp;</div>
          <div class="table_data1">  craft  </div>
          <div class="table_data1">  +9%  </div>
          <div class="table_data1">  Atomic  </div>
          <div class="table_data1"> profit %</div>
          <div class="table_data1"> покупка %</div>
          <div class="table_data1"> avg </div>
          <div class="table_data1"> % от avg </div>
          <div class="table_data1"> выпущено </div>
          <div class="table_data1"> продано </div>
          <div class="table_data1"> продается </div>
          <div class="table_data2"> </div>
        </div>
        <br/>
        <div v-for="asset in all_assets" :key="asset.name">
          <div>
            <div class="table_num"> {{ asset.num }}. </div>
            <div class="table_name">
              <strong>
                <a :href="atomicUrl(asset['template_id'])" target='_blank'> {{ asset.name }} </a>
              </strong>
            </div>
            <div class="table_data1">{{ formatAssetPrice(calcAssetCost(asset)) }}</div>
            <div class="table_data1">{{ formatAssetPrice(calcAssetPrice(asset)) }}</div>
            <div class="table_data1">{{ formatAssetPrice(asset.price) }} </div>
            <div class="table_data1">
              <span :class="percentStyle(calcAssetProfit(asset))">
                {{ formatAssetPrice(calcAssetProfit(asset)) }}
              </span>
            </div>
            <div class="table_data1">
              <span v-if="calcPurchaseProfit(asset)>0" :class="percentStyle(calcPurchaseProfit(asset))">
                {{ formatAssetPrice(calcPurchaseProfit(asset)) }}
              </span>
              <span v-else>&nbsp;
              </span>
            </div>
            <div class="table_data1">
              <span>
                {{ formatAssetPrice(asset["average_price"]) }}
              </span>
            </div>
            <div class="table_data1">
              <span :class="percentStyle(calcAssetDeviation(asset))">
                {{ formatAssetPrice(calcAssetDeviation(asset)) }}
              </span>
            </div>
            <div class="table_data1">
              <span>
                {{ asset["supply"] }}
              </span>
            </div>
            <div class="table_data1">
              <span>
                {{ asset["sales"] }}
              </span>
            </div>
            <div class="table_data1">
              <span>
                {{ asset["count"] }}
              </span>
            </div>
            <div class="table_data2">&nbsp;
            </div>
          </div>
        </div>
    </div>
    <div style="text-align:left">
      <div v-if="$store.state.mainFarm && $store.state.mainFarm.assets.unique && $store.state.mainFarm.assets.unique.length > 0">
        <strong>Сундук:</strong>
        <ul id="chest_list">
          <li v-for="atomic in $store.state.mainFarm.assets.unique" :key="atomic.id">
            {{ atomic.id }}. {{ atomic["name"] }} x {{ atomic["counter"] }}шт. по {{ formatAsset(atomic["cost"])}} wax =
            {{ formatAsset(atomic["counter"] * atomic["cost"] ) }}wax
          </li>
        </ul>
      </div>
      <div v-if="assets_on_sale && assets_on_sale.length > 0">
        <strong>На продажу:</strong>
        <ul id="assets_on_sale">
          <li v-for="(sale, index) in assets_on_sale" :key="sale.sale_id">
            {{ index + 1 }}. {{ sale["assets"][0]["name"] }} {{ formatPriceAtomic(sale["price"]["amount"]) }} wax 
            <a href="" @click.prevent="cancel_atomic_sale(sale.sale_id);update_data()">
              отменить
            </a>
          </li>
        </ul>
      </div>
    </div>
    <hr>
    <div class="separator"></div>
    <div id="trading_ui">

      <div id="sendtoken_ui">
        <div class="param">
          <div class="label">Перевод:</div>    
          <select v-model="send_token">
            <option v-for="item in tokens" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">сумма: </div>
          <input type="text" v-model="amount_to_send" />
        </div>
        <div class="param">
          <div class="label">отправить на: </div>
          <input type="text" v-model="send_token_to" />
        </div>
        <div class="param">
          <div class="label">memo: </div>
          <input type="text" v-model="send_to_memo" />
        </div>
        <button id="send_token_button" @click="send_tokens(traderAccount(), amount_to_send, send_token, send_token_to, send_to_memo);update_data()">
          Перевести {{ amount_to_send }} {{ send_token }} на {{ send_token_to }}
        </button>
      </div>     

      <div id="sell_ui">
        <div class="param">
          <div class="label">Продать:</div>    
          <select v-model="sell_item">
            <option v-for="item in sell_items" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во:</div>
          <input type="text" v-model="amount_to_sell" />
        </div>
        <div class="param">
          <div class="label">Цена:</div>    
          <input v-model="sell_price" type="text" />
        </div>
        <button id="sell_on_atomic" @click="sell_nft_atomic(traderAccount(), sell_item, sell_price, amount_to_sell);update_data()">
          Продать {{ amount_to_sell }} {{ sell_items.filter((f)=>f.value == sell_item)[0].text }} на Атомик за {{ sell_price }}
        </button>
      </div>

      <div id="exchange_ui">
        <div class="param">
          <div class="label">Обменять:</div>    
          <select v-model="exchange_item">
            <option v-for="item in exchange_items" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>  
        <div class="param">
          <div class="label">кол-во:</div>
          <input type="text" v-model="amount_to_exchange" />
        </div>
        <button id="exchange_barley_asset" @click="exchange_asset(traderAccount(), exchange_item, amount_to_exchange);update_data()">
          Обменять {{amount_to_exchange}} {{ exchange_items.filter((f)=>f.value == exchange_item)[0].text }} на 
          ~{{ amount_to_exchange * (exchange_items.filter((f)=>f.value == exchange_item)[0].gold) }} Gold
        </button>
      </div>

      <div id="send_ui">
        <div class="param">
          <div class="label">Отправить:</div>    
          <select v-model="send_item">
            <option v-for="item in sell_items" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во: </div>
          <input type="text" v-model="amount_to_send" />
        </div>
        <div class="param">
          <div class="label">отправить на: </div>
          <input type="text" v-model="send_to" />
        </div>
        <button id="send_one_barley_to" @click="send_asset(traderAccount(), send_item, send_to, amount_to_send);update_data()">
          Отправить {{amount_to_send}} {{ sell_items.filter((f)=>f.value == send_item)[0].text }} на {{ send_to }}
        </button>
      </div>

      <div id="craft_ui">
        <div class="param">
          <div class="label">Скрафтить/Купить:</div>    
          <select v-model="craft_item">
            <option v-for="item1 in craft_items" v-bind:value="item1.value">
              {{ item1.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во: </div>
          <input type="text" v-model="amount_to_craft" />
        </div>
        <button id="craft_asset" @click="craft_asset(traderAccount(), craft_item, amount_to_craft);update_data()">
          Получить {{ amount_to_craft }} {{ asset_name(craft_item) }} 
          за {{ craft_price }}
        </button>
        <div class="red_label">
          {{ craft_message }}
        </div>
      </div>

      <div id="deposit_ui">
        <div class="param">
          <div class="label">Ввод:</div>    
          <select v-model="deposit_token">
            <option v-for="item in tokens" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во: </div>
          <input type="text" v-model="amount_to_deposit" />
        </div>
        <button id="craft_asset" @click="deposit_tokens(traderAccount(), amount_to_deposit, deposit_token);update_data()">
          Ввести {{ amount_to_deposit }} {{ deposit_token }} 
        </button>
      </div>

      <!-- <div id="widthdraw_ui">
        <div class="param">
          <div class="label">Вывод:</div>    
          <select v-model="withdraw_token">
            <option v-for="item in resources" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во: </div>
          <input type="text" v-model="amount_to_withdraw" />
        </div>
        <button id="craft_asset" @click="withdraw_tokens(traderAccount(), amount_to_withdraw, withdraw_token, $store.state.config.fee);update_data()">
          Вывести {{ amount_to_withdraw }} {{ withdraw_token }} (Fee: {{ amount_to_withdraw * $store.state.mainFarm.config.fee/100 }}, получите:
          {{ formatAsset(amount_to_withdraw * (1 - $store.state.config.fee/100))  }})
        </button>
      </div> -->
      <div id="sell_token_ui">
        <div class="param">
          <div class="label">Продать токены:</div>    
          <select v-model="sell_token">
            <option v-for="item in tokens" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во: </div>
          <input type="text" v-model="amount_to_sell" />
        </div>
        <button id="sell_tokens" @click="sendTokenSellOrder(traderAccount(), amount_to_sell, sell_token);update_data()">
          Продать {{ amount_to_sell }} {{ sell_token }} за {{ formatLongAsset(sell_for_wax) }} WAX
        </button>
        <div class="label">
          (курс: {{ formatLongAsset(sell_token_price) }} WAX)
        </div>
      </div>
      <div id="buy_token_ui">
        <div class="param">
          <div class="label">Купить токены:</div>    
          <select v-model="buy_token">
            <option v-for="item in tokens" v-bind:value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="param">
          <div class="label">кол-во: </div>
          <input type="text" v-model="amount_to_buy" />
        </div>
        <button id="sell_tokens" @click="sendTokenBuyOrder(traderAccount(), amount_to_buy, buy_token);update_data()">
          Купить {{ amount_to_buy }} {{ buy_token }} за {{ formatLongAsset(buy_for_wax) }} WAX
        </button>
        <div class="label">
          (курс: {{ formatLongAsset(buy_price) }} WAX)
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

const fww_market_id = 104;
const fwf_market_id = 105;
const fwg_market_id = 106;

export default {
  name: "Trader",
  data() {
    return {
      currentTime: 0,
      timer: null,
      ownerAccount: "",
      send_to:"",
      amount:1,
      all_assets: this.all_atomic_assets(),
      sell_price: 0,
      is_checking: false,
      sell_items: this.items_to_sell(),   
      sell_item: "318606",  // barley by default
      exchange_items: this.items_to_exchange(),   
      exchange_item: "318606",  // barley by default
      send_item: "318606",  // barley by default
      assets_on_sale: [],
      amount_to_sell: 1,
      amount_to_exchange: 1,
      amount_to_send: 1,
      craft_item: "378691",
      craft_items: this.craft_assets(),
      craft_message: "",
      craft_price: "",
      amount_to_craft: 1,
      deposit_token: "FWW",
      tokens: [
        {value: 'FWW', text: 'FWW'},
        {value: 'FWG', text: 'FWG'},
        {value: 'FWF', text: 'FWF'}
      ],
      resources: [
        {value: 'WOOD', text: 'WOOD'},
        {value: 'GOLD', text: 'GOLD'},
        {value: 'FOOD', text: 'FOOD'}
      ],      
      amount_to_deposit: 10,
      amount_to_withdraw: 10,
      withdraw_token: "GOLD",
      send_token: "FWW",
      amount_to_send: 1,
      send_token_to: "",
      send_to_memo: "",
      amount_to_sell: 1,
      sell_token: "FWG",
      amount_to_buy: 10,
      buy_token: "FWF",
      sell_for_wax: "",
      buy_for_wax: "",
      buy_price: "",
      sell_token_price: "",
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
    };
  },
  components: {
  },
  watch: {
    sell_item: async function(val) {
      await this.updateSellPrices();
    },
    craft_item: async function(val) {
      this.craft_price = this.calcCraftPrice(val, this.amount_to_craft);
      this.craft_message = this.calcCraftMessage(val, this.amount_to_craft);
    },
    amount_to_craft: async function(val) {
      this.craft_price = this.calcCraftPrice(this.craft_item, val);
      this.craft_message = this.calcCraftMessage(this.craft_item, val);
    },
    sell_token: async function(val) {
      console.log("sell token: " + val);
      this.calcSellPrice(val, this.amount_to_sell)
    },
    buy_token: async function(val) {
      console.log("buy token: " + val);
      this.calcBuyPrice(val, this.amount_to_buy)
    },
    amount_to_sell: async function(val) {
      console.log("amount_to_sell: " + val);
      this.calcSellPrice(this.sell_token, val);
    },
    amount_to_buy: async function(val) {
      console.log("amount_to_buy: " + val);
      this.calcBuyPrice(this.buy_token, val);
    }
  },
  async mounted() {
    this.craft_message = this.calcCraftMessage(this.craft_item);
    this.craft_price = this.calcCraftPrice(this.craft_item);

    this.all_assets = await this.updateAssetPrices();
    await this.updateSellPrices();

    this.assets_on_sale = await this.getAssetsOnSale(this.accountName, 1);

    await this.updateOrderbook();

    this.startTimer();
  },
  methods: {  
    async sendTokenSellOrder(owner, token) {
      switch(token) {
        case 'FWW':
          this.orderbooks.fww = await this.getMarket(fww_market_id);
          break;
        case 'FWG':
          this.orderbooks.fwg = await this.getMarket(fwg_market_id);      
          break;
        case 'FWF':
          this.orderbooks.fwf = await this.getMarket(fwf_market_id);
          break;
      }
      this.calcSellPrice(this.sell_token, this.amount_to_sell);
      let memo = this.formatSellAssetPrice(this.sell_for_wax) + "@eosio.token";
      this.send_tokens(owner, this.amount_to_sell, this.sell_token, 'alcordexmain', memo)
    },
    async sendTokenBuyOrder(owner, amount, token) {
      switch(token) {
        case 'FWW':
          this.orderbooks.fww = await this.getMarket(fww_market_id);
          break;
        case 'FWG':
          this.orderbooks.fwg = await this.getMarket(fwg_market_id);      
          break;
        case 'FWF':
          this.orderbooks.fwf = await this.getMarket(fwf_market_id);
          break;
      }
      this.calcBuyPrice(this.buy_token, this.amount_to_buy);
      let memo = this.formatLongAsset(this.amount_to_buy) + " " + token + "@farmerstoken";
      this.send_wax(owner, this.buy_for_wax, 'alcordexmain', memo)
    },
    calcBuyPrice(token, amount) {
        let price = 0;
        
        switch(token) {
          case "FWF":
            if (this.orderbooks && this.orderbooks.fwf && this.orderbooks.fwf.bids && this.orderbooks.fwf.bids[0]) {
              price = this.orderbooks.fwf.bids[0].unit_price/100000000 + 0.001
            }
            break;
          case "FWG":
            if (this.orderbooks && this.orderbooks.fwg && this.orderbooks.fwg.bids && this.orderbooks.fwg.bids[0]) {
              price = this.orderbooks.fwg.bids[0].unit_price/100000000 + 0.001
            }
            break;
          case "FWW":
            if (this.orderbooks && this.orderbooks.fww && this.orderbooks.fww.bids && this.orderbooks.fww.bids[0]) {
              price = this.orderbooks.fww.bids[0].unit_price/100000000 + 0.001
            }
            break;
        }
        this.buy_for_wax = amount * price;
        this.buy_price = price;
        console.log("price: " + price + " wax: " + amount);    
    }, 
    calcSellPrice(token, amount) {
        let price = 0;
        
        switch(token) {
          case "FWF":
            if (this.orderbooks && this.orderbooks.fwf && this.orderbooks.fwf.asks && this.orderbooks.fwf.asks[0]) {
              price = this.orderbooks.fwf.asks[0].unit_price/100000000
            }
            break;
          case "FWG":
            if (this.orderbooks && this.orderbooks.fwg && this.orderbooks.fwg.asks && this.orderbooks.fwg.asks[0]) {
              price = this.orderbooks.fwg.asks[0].unit_price/100000000
            }
            break;
          case "FWW":
            if (this.orderbooks && this.orderbooks.fww && this.orderbooks.fww.asks && this.orderbooks.fww.asks[0]) {
              price = this.orderbooks.fww.asks[0].unit_price/100000000
            }
            break;
        }
        this.sell_for_wax = amount * price;
        this.sell_token_price = price;
        console.log("price: " + price + " wax: " + amount);    
    },        
    asset_name(template_id) {
      let asset = this.assets_info().filter( (f)=>f.template_id == template_id );
      if (asset && asset[0]) return asset[0].name;
      return "";
    },
    calcCraftPrice(template_id) {
      let item = this.craft_assets().filter( (f)=>f.value == template_id );
      let price = "";
      if (item && item[0]) {
        if (item[0].gold>0) price += (item[0].gold * this.amount_to_craft) + " gold";
        if (item[0].wood>0) price += " + "+ (item[0].wood * this.amount_to_craft) + " wood";
      }
      return price;
    },
    calcCraftMessage(template_id) {
      let item = this.craft_assets().filter( (f)=>f.value == template_id );
      let craft_message = "";
      if (this.$store.state.mainFarm && this.$store.state.mainFarm.balance) {
        if (item && item[0]) {
          if (item[0].gold > this.$store.state.mainFarm.balance.gold || item[0].wood > this.$store.state.mainFarm.balance.wood ) {
            craft_message = "Не хватает ";
            if (item[0].gold > this.$store.state.mainFarm.balance.gold) craft_message += this.formatAsset(item[0].gold * this.amount_to_craft - this.$store.state.mainFarm.balance.gold) + " gold";
            if (item[0].wood > this.$store.state.mainFarm.balance.wood) craft_message += " + " + this.formatAsset(item[0].wood * this.amount_to_craft - this.$store.state.mainFarm.balance.wood) + " wood";
          } else {
            craft_message = "";
          }
        }
      }
      return craft_message;
    },    
    traderAccount() {
      return this.getUserAccount();
    },
    async startTimer() {
      console.log("start Timer for every minute");
      this.currentTime = 0;
      this.is_checking = true;

      this.timer = setInterval(async () => {
        this.all_assets = this.all_atomic_assets();

        if (this.currentTime === 0 ) {
          this.currentTime = 25;
          this.all_assets = await this.updateAssetPrices();

          this.assets_on_sale = await this.getAssetsOnSale(this.traderAccount(), 1);

          this.updateSellPrices();
          this.updateOrderbook();
        } else this.currentTime--;
      }, 1000)
    },
    async update_data() {
        this.all_assets = await this.updateAssetPrices();

        this.assets_on_sale = await this.getAssetsOnSale(this.traderAccount(), 1);
        this.sell_history = await this.getAssetsOnSale(this.traderAccount(), 3);

        this.updateSellPrices();
    },
    async stopTimer() {
      console.log("stop timer");
      this.currentTime = 0;
      clearTimeout(this.timer);
      this.is_checking = false;
    },
    async updateSellPrices() {
      const item = this.all_assets.find((f)=>f.template_id==this.sell_item)
      // console.log("update sell price for: " + JSON.stringify(item));
      if (item) {
        this.sell_price = Number(item['price'] - 0.01).toFixed(2);
      } else {
        this.sell_price = "";
      }
    },
    calcAssetCost(asset) {
      let cost = 0;
      if (this.$store.state.prices) {
       cost = asset["wood"] * this.$store.state.prices.fww + asset["gold"] * this.$store.state.prices.fwg;
      }
      return cost;
    },
    calcAssetPrice(asset) {
      const cost = asset["wood"] * this.$store.state.prices.fww + asset["gold"] * this.$store.state.prices.fwg;
      const sale_price = cost / 91 * 100;
      return sale_price;
    },
    calcAssetProfit(asset) {
      const cost = asset["wood"] * this.$store.state.prices.fww + asset["gold"] * this.$store.state.prices.fwg;
      if (cost<=0) {
        return 0;
      } else {
        const sale_price = cost / 91 * 100;
        return ((asset.price - 0.01) - sale_price) / cost * 100;
      }
    },
    calcAssetDeviation(asset) {
      return ( asset.price - asset.average_price ) / asset.average_price * 100;
    },
    percentStyle(value) {
      if (!value) return '';
      if (value>0) return 'num_positive';
      if (value<0) return 'num_negative';
    },
    calcPurchaseProfit(asset) {
      const cost = asset["wood"] * this.$store.state.prices.fww + asset["gold"] * this.$store.state.prices.fwg;
      const diff = cost - asset.price;
      if (diff>0) {
        return diff / cost * 100;
      }
      return 0;
    },
    async updateOrderbook() {
      this.orderbooks.fww = await this.getMarket(fww_market_id);
      this.orderbooks.fwf = await this.getMarket(fwf_market_id);
      this.orderbooks.fwg = await this.getMarket(fwg_market_id);
    },
    async getMarket(market_id) {
      console.log("get market: " + market_id);

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
      for(var c=0; c < orderbook.bids.length; c++) {
        const order = orderbook.bids[c];
        const bid_asset = this.parseAsset(order.bid);
        const ask_asset = this.parseAsset(order.ask);
        orderbook.buy_total += ask_asset.number;
        orderbook.buy_total_wax += bid_asset.number;
        orderbook.bids[c]["bid"] = bid_asset.number;
        orderbook.bids[c]["ask"] = ask_asset.number;
      }

      orderbook.asks = (await this.get_sellorders(market_id))["rows"];
      orderbook.sell_total_wax = 0;
      orderbook.sell_total = 0;
      for(var c=0; c< orderbook.asks.length; c++) {
        const order = orderbook.asks[c];
        const bid_asset = this.parseAsset(order.bid);
        const ask_asset = this.parseAsset(order.ask);
        orderbook.sell_total_wax += ask_asset.number;
        orderbook.sell_total += bid_asset.number;
        orderbook.asks[c]["ask"] = ask_asset.number;
        orderbook.asks[c]["bid"] = bid_asset.number;
      }

      // console.log("orderbook: " + JSON.stringify(orderbook));

      return orderbook;
    }        
  }
};
</script>


<style>

#market {
  font-size: 12px;
}

.table_name {
  min-width: 150px;
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

#trading_ui {
  text-align: left;
  height: 600px;
  border: 0px;
}

#sell_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#exchange_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#send_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#craft_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
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

#deposit_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#widthdraw_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#sendtoken_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#sell_token_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
}

#buy_token_ui {
  float:left;
  margin: 10px;
  padding: 10px;
  border: 1px;
  border-style: solid;
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
