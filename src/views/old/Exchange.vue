<template>
  <div class="home">
    <img id="logo" src="angel_logo.png">
    <p style="text-align:left">
      <span id="login"></span>
      <span v-if="is_checking"> - {{ currentTime }}</span>
      &nbsp;|&nbsp;
      <span>
        <a href="" @click.prevent="update_data(ownerAccount)">
          ПРОВЕРИТЬ
        </a>
      </span>
      &nbsp;|&nbsp;
      <span v-if="!is_checking">
        <a href="" @click.prevent="startTimer(); currentTime = reload_time;">
          СТАРТ
        </a>
      </span>
      <span v-if="is_checking">
        <a href="" @click.prevent="stopTimer()">
          СТОП
        </a>
      </span>
      &nbsp;|&nbsp;
      <a href="" @click.prevent="goToHome()">
        МАЙНЕР
      </a>
      &nbsp;|&nbsp;
      <a href="" @click.prevent="goToTrader()">
        ТРЕЙДЕР
      </a>
      &nbsp;|&nbsp;
      <span>
        <select v-model="show_book_orders">
          <option v-for="item in book_sizes" v-bind:value="item.value">
            {{ item.text }}
          </option>
        </select>
      </span>
    </p>
    <hr/>
    <div id="loading" style="text-align:left" v-if="logged_in && game.last_updated==null">
      загрузка...
    </div>
    <div style="text-align:left" v-if="logged_in && game.last_updated!=null">
      <div>
        <span>CPU: {{ formatAssetPrice(game.cpu_used_percent) }}% | </span>
        <span>
          <strong>{{ formatLongAsset(game.wax_balance.number) }} wax</strong>
        </span> | 
        <span>
          Токены:
          <span><b>{{ formatLongAsset(game.fww_balance) }}</b> FWW | </span>
          <span><b>{{ formatLongAsset(game.fwg_balance) }}</b> FWG | </span>
          <span><b>{{ formatLongAsset(game.fwf_balance) }}</b> FWF</span>        
        </span>
      </div>
    </div>
    <hr/>
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
    <hr/>    
    <div id="sell_token_ui">
      <div class="param">
        <div class="label">Сделка:</div>    
        <select v-model="deal_token">
          <option v-for="item in tokens" v-bind:value="item.value">
            {{ item.text }}
          </option>
        </select>
      </div>
      <div class="param">
        <div class="label">кол-во: {{ deal_token }}</div>
        <input type="text" v-model="deal_amount" />
      </div>
      <div class="param">
        <div class="label">цена покупки +%: </div>
        <input type="text" v-model="buy_percent" />
      </div>
      <div class="param">
        <div class="label">продать +%: </div>
        <input type="text" v-model="target_profit_ratio" />
      </div>
      <div class="label">
        <div>Сумма: {{ formatLongAsset(buy_for_wax) }} WAX</div>
        <div>Цена покупки: {{ formatLongAsset(buy_price) }}</div>
        <div>Цена продажи: {{ formatLongAsset(target_price) }}</div>
      </div>
      <button id="sell_tokens" @click="startDeal(traderAccount(), deal_token, deal_amount, buy_percent, target_profit_ratio)">
        СТАРТ
      </button>
    </div>
    <div id="deals">
      <div class="label">
        <strong>Сделки:  </strong>
        <a href="" @click.prevent="clear_deals()">очистить</a>
      </div>
      <div>
        <div class="table_num">
          &nbsp;
        </div>
        <div class="table_data1">
          цена покупки
        </div>
        <div class="table_data1">
          цена продажи
        </div>
        <div class="table_data1">
          покупка
        </div>
        <div class="table_data1">
          сумма
        </div>
        <div class="table_data1">
          продажа
        </div>
        <div class="table_data1">
          цель +%
        </div>
        <div class="table_data1">
          куплено
        </div>
        <div class="table_data1">
          прибыль
        </div>
        <div class="table_data1">
          прибыль %
        </div>
        <div class="table_data1">
          статус
        </div>
        <div class="table_data1">
          &nbsp;
        </div>        
        <div class="table_data2">
          время
        </div>
      </div>
      <div>
        <div v-for="(deal, index) in deals" :key="deal.id">
          <div class="table_num">
            {{ index + 1 }}.
          </div>
          <div class="table_data1">
            {{ formatLongAsset(deal.buy_price) }}
          </div>
          <div class="table_data1">
            {{ deal.sell_unit_price ? formatLongAsset(deal.sell_unit_price) : formatLongAsset(deal.target_price) }} 
          </div>
          <div class="table_data1">
            {{ formatAsset(deal.amount) }} {{ deal.token }}
          </div>
          <div class="table_data1">
            {{ formatLongAsset(deal.buy_sum) }} WAX
          </div>
          <div class="table_data1">
            {{ formatLongAsset(deal.target_sum) }} WAX
          </div>
          <div class="table_data1">
            {{ formatAsset(deal.target_profit_ratio) }}%
          </div>
          <div class="table_data1">
            {{ formatLongAsset(deal.purchased_quantity) }} {{ deal.token }}
          </div>
          <div class="table_data1">
            {{ formatLongAsset(deal.profit) }}
          </div>
          <div class="table_data1">
            {{ formatLongAsset(deal.profit_percent) }}
          </div>
          <div class="table_data1">
            {{ deal.status }}
          </div>
          <div class="table_data1">
            <span v-if="isActiveDeal(deal)">
              <a href="" @click.prevent="cancel_deal(deal.id)">отменить</a>
            </span>
          </div>
          <div class="table_data2">
            {{ dealTime(deal) }}
          </div>
        </div>
      </div>
    </div>
    <Login title="WAX Login" />
    <pre><code id="response" class="hljs"></code></pre>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

const fww_market_id = 104;
const fwf_market_id = 105;
const fwg_market_id = 106;

export default {
  name: "Exchange",
  data() {
    return {
      currentTime: 0,
      timer: null,
      ownerAccount: "",
      game: this.game_state(),
      is_checking: false,
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
      deal_token: "FWW",
      tokens: [
        {value: 'FWW', text: 'FWW'},
        {value: 'FWG', text: 'FWG'},
        {value: 'FWF', text: 'FWF'}
      ],
      deal_amount: 10,
      amount_to_sell: 10,
      sell_token: "FWG",
      amount_to_buy: 10,
      buy_token: "FWF",
      sell_for_wax: "",
      buy_for_wax: "",
      buy_price: "",
      sell_token_price: "",
      game: this.game_state(),   
      history: [],
      target_profit_ratio: 1,
      buy_percent: 0,
      target_price: 0,
      fww_deals: [],
      fwg_deals: [],
      fwf_deals: [],
    };
  },
  components: {
    Login,
  },
  watch: {
    deal_token: async function(val) {
      this.calcBuyPrice(val, this.deal_amount, this.buy_percent, this.target_profit_ratio);
    },
    deal_amount: async function(val) {
      this.calcBuyPrice(this.deal_token, val, this.buy_percent, this.target_profit_ratio);
    },
    buy_percent: async function(val) {
      this.calcBuyPrice(this.deal_token, this.deal_amount, val, this.target_profit_ratio);
    },
    target_profit_ratio: async function(val) {
      this.calcBuyPrice(this.deal_token, this.deal_amount, this.buy_percent, val);
    },
    deals: function(val) {
      this.updateLocalStorage();
    }
   },  
  async mounted() {
    await this.autoLogin();
    await this.updateOrderbook();

    if (localStorage.deals) {
      try {
        this.deals = JSON.parse(localStorage.getItem("deals"));      
      } catch (error) {
        this.deals = [];
      }
    }

    this.startTimer();

    // проверяем транзакции из блокчейна
    this.watch_account_txs(this.traderAccount(), async (m)=>{
      // console.log("new trx from blockchain: " + JSON.stringify(m));

      if (m && m["data"] && m["data"]["searchTransactionsForward"] && 
          m["data"]["searchTransactionsForward"]["trace"] && 
          m["data"]["searchTransactionsForward"]["trace"]["matchingActions"]) {
        let actions = m["data"]["searchTransactionsForward"]["trace"]["matchingActions"]
        for(let aa = 0; aa < actions.length; aa++) {
          let action = actions[aa]["json"];
          // console.log("action: " + JSON.stringify(action));

          let to = action["to"]
          let from = action["from"]
          let quantity = this.parseAsset(action["quantity"]);
          let memo = action["memo"];

          if (from == 'alcordexmain' && to == this.traderAccount() && memo.startsWith("order match")) {
            console.log("пришли деньги с алькора: " + JSON.stringify(action));
            for(let dd = 0; dd < this.deals.length; dd ++) {
              if ( this.deals[dd].status == "покупаю" && quantity.asset_id == this.deals[dd].token ) {
                // пришли заказанные токены
                this.deals[dd].purchased_quantity = quantity.number;
                console.log("пришли заказанные токены: " + quantity.number + " всего получено: " + this.deals[dd].purchased_quantity + 
                            " ожидаю всего: " + this.deals[dd].expected_amount);

                if (this.deals[dd].purchased_quantity >= this.deals[dd].expected_amount) {
                  // все закуплено
                  this.deals[dd].status = "купил";
                  // sell this order
                  await this.followWithSellOrder(dd);
                } else {
                  console.log("закрыл сделку частично, ждем остальное...");
                }
                this.updateLocalStorage();
              } else {
                if ( this.deals[dd].status == "продаю" && quantity.asset_id == "WAX") {
                  // пришли заказанные токены
                  console.log("продали токены, получили ваксы: " + quantity.number);
                  this.deals[dd].status = "продал";
                  this.deals[dd].result_quantity += quantity.number;
                  if (this.deals[dd].result_quantity >= this.deals[dd].expected_wax) {
                    // пришли все ваксы
                    console.log("пришли все ваксы, закрываю сделку...");
                    this.deals[dd].profit = quantity.number - this.deals[dd].buy_sum;
                    this.deals[dd].profit_percent = (this.deals[dd].profit / this.deals[dd].buy_sum) * 100;
                    this.deals[dd].completed_time = new Date();
                    this.updateLocalStorage();
                  } else {
                    console.log("частично закрыл сделку. получено: " + this.deals[dd].result_quantity + 
                                " ожидаю: " + this.deals[dd].expected_wax );
                  }
                }
              }
            }
          }          
        }
      }
      // this.history.push(m);
    })

    // this.watch_alcor_trx((action) => {
    //   // console.log("deal: " + JSON.stringify(action));
    //   let bid = this.parseAsset(action["record"]["bid"]);
    //   let bidder = action["record"]["bidder"];
    //   let ask = this.parseAsset(action["record"]["ask"]);
    //   let asker = action["record"]["asker"];
    //   let market_id = action["record"]["market"]["id"];
    //   let price = parseInt(action["record"]["unit_price"]) / 100000000;
    //   let time = action["record"]["timestamp"];
    //   let id = 0;
    //   let type, amount, account;
    //   if (bid.asset_id == "WAX") {
    //     // buymatch
    //     type = 'buy';
    //     amount = bid.number;
    //     account = bidder;
    //   } else {
    //     type = 'sell';
    //     amount = ask.number;
    //     account = bidder;
    //   }
    //   let done_deal = {
    //     price: price,
    //     amount: amount,
    //     type: type,
    //     account: account,
    //     time: time,
    //     id: id,
    //     asker: asker
    //   }
    //   switch(market_id) {
    //     // fww
    //     case fww_market_id:
    //       if (this.fww_deals.length>0) id = this.fww_deals[0].id + 1;
    //       done_deal.id = id;
    //       this.fww_deals.splice(0,0,done_deal);
    //       this.fww_deals = this.fww_deals.slice(0,this.show_book_orders);
    //       break;
    //     // fwf
    //     case fwf_market_id:
    //       if (this.fwf_deals.length>0) id = this.fwf_deals[0].id + 1;
    //       done_deal.id = id;
    //       this.fwf_deals.splice(0,0,done_deal);
    //       this.fwf_deals = this.fwf_deals.slice(0,this.show_book_orders);
    //       break;
    //     case fwg_market_id:
    //       if (this.fwg_deals.length>0) id = this.fwg_deals[0].id + 1;
    //       done_deal.id = id;
    //       this.fwg_deals.splice(0,0,done_deal);
    //       this.fwg_deals = this.fwg_deals.slice(0,this.show_book_orders);
    //       break;
    //   }

    // })  

    // this.watch_table_rows('alcordexmain', 'buyorder', '3pezg.wam', (m)=>{
    //   console.log(m);
    // })

  },
  methods: {  
    async followWithSellOrder(dd) {
      const deal1 = await this.sendTokenSellOrder(this.traderAccount(), this.deals[dd].token, this.deals[dd].purchased_quantity, 
                                                  this.deals[dd].target_sum);
      if (!((typeof deal1) == "string" && deal1.startsWith("billed CPU time"))) {
        console.log("успешно разместил заявку на продажу");
        console.log("dea1: " + JSON.stringify(deal1));

        if (deal1["processed"] && deal1["processed"]["action_traces"] && deal1["processed"]["action_traces"][0]["inline_traces"]) {
          let traces = deal1["processed"]["action_traces"][0]["inline_traces"];
          // найдем данные заявки в чеке
          for(let tr=0; tr < traces.length; tr++) {
            const action = traces[tr];
            if (action["act"]["name"]=="sellreceipt" && (action["act"]["account"] == "alcordexmain")) {
              const data = action["act"]["data"];
              this.deals[dd].sell_order_id = data["sell_order"]["id"]
              this.deals[dd].sell_unit_price = data["sell_order"]["unit_price"] / 100000000;
              this.deals[dd].expected_wax = this.deals[dd].purchased_quantity * this.deals[dd].sell_unit_price * 0.975;
              this.deals[dd].status = "продаю";
            }
          }
        }                  
      } else {
        console.log("не получилось разместить заявку на продажу: " + deal1);
        // повторить заявку через 5 секунд, ждем CPU
        setTimeout(() => {
           this.followWithSellOrder(dd);                  
        }, 5000)
      }
    },
    isActiveDeal(deal) {
       if (deal.status=="отмена" || deal.status=="продал") return false;
       return true;
    },
    dealTime(deal) {
      if (deal.status == "отмена") return this.formatDate(new Date(deal.startTime));
      if (deal.status == "продал") return this.timePassedFormat(deal.startTime, deal.completed_time);
      return this.timePassedFormat(deal.startTime, new Date());
    },
    async cancel_deal(deal_id) {
      if (deal_id < this.deals.length) {
        if (this.deals[deal_id].status == "покупаю") {
          console.log("отменить сделку id:" + this.deals[deal_id].order_id);
          await this.calcel_buy_alcor(this.traderAccount(), this.deals[deal_id].market_id, this.deals[deal_id].order_id );
        } else {
          if (this.deals[deal_id].status == "продаю") {
            console.log("отменить сделку id:" + this.deals[deal_id].sell_order_id);
            await this.calcel_buy_alcor(this.traderAccount(), this.deals[deal_id].market_id, this.deals[deal_id].sell_order_id );
          }
        }
        this.deals[deal_id].status = "отмена";
        this.updateLocalStorage();
      }
    },
    clear_deals() {
      this.deals = [];
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      localStorage.setItem("deals", JSON.stringify(this.deals));
    },
    account_style(account_name) {
      return account_name == this.traderAccount() ? "account_bold" : "account";
    },
    async startDeal(owner, token, amount, buy_percent, target_profit_ratio) {
      console.log("start deal: " + token + " " + amount);
      const deal1 = await this.sendTokenBuyOrder(owner, amount, token, buy_percent, target_profit_ratio);
      let market_id = 0;
      let order_id = 0;
      let buy_unit_price = 0;
      if (deal1) {
        if (deal1["processed"] && deal1["processed"]["action_traces"] && deal1["processed"]["action_traces"][0]["inline_traces"]) {
          let traces = deal1["processed"]["action_traces"][0]["inline_traces"];
          // найдем данные заявки в чеке
          for(let tr=0; tr < traces.length; tr++) {
            const action = traces[tr];
            if (action["act"]["name"]=="buyreceipt" && (action["act"]["account"] == "alcordexmain")) {
              const data = action["act"]["data"];
              market_id = data["market_id"]
              order_id = data["buy_order"]["id"]
              buy_unit_price = data["buy_order"]["unit_price"]
              let deal_id = 0;
              if (this.deals.length > 0) deal_id = this.deals[this.deals.length - 1].id + 1;
              let deal = {
                id: deal_id,
                token: token,
                amount: amount,
                expected_amount: amount * 0.975,
                buy_percent: buy_percent,
                buy_price: this.buy_price,
                startTime: new Date(),
                buy_result: deal1,
                buy_sum: this.buy_for_wax,
                target_sum: this.buy_for_wax * (target_profit_ratio / 100 + 1),
                target_price: this.buy_price * (target_profit_ratio / 100 + 1),
                target_profit_ratio: target_profit_ratio,
                purchased_quantity: "",
                status: 'покупаю', 
                profit: 0,
                profit_percent: 0,
                completed_time: null,
                market_id: market_id,
                order_id: order_id,
                buy_unit_price: buy_unit_price,
                result_quantity: 0
              };
              this.deals.push(deal);
              this.updateLocalStorage();
              console.log("new deal saved, expected amount of tokens: " + deal.expected_amount + " " + token);            }
          }
        }
      } else {
        console.log("не получилось запустить сделку");
      }
    },
    async sendTokenSellOrder(owner, token, amount, sell_sum_wax) {
      let memo = this.formatSellAssetPrice(sell_sum_wax) + "@eosio.token";
      return await this.send_tokens(owner, amount, token, 'alcordexmain', memo)
    },
    async sendTokenBuyOrder(owner, amount, token, buy_percent, target_profit_ratio) {
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
      this.calcBuyPrice(token, amount, buy_percent, target_profit_ratio);
      let memo = this.formatLongAsset(amount) + " " + token + "@farmerstoken";
      return await this.send_wax(owner, this.buy_for_wax, 'alcordexmain', memo)
    },
    calcBuyPrice(token, amount, buy_percent, target_profit_ratio) {
        let price = 0;
        
        switch(token) {
          case "FWF":
            if (this.orderbooks && this.orderbooks.fwf && this.orderbooks.fwf.bids && this.orderbooks.fwf.bids[0]) {
              price = this.orderbooks.fwf.bids[0].unit_price/100000000 * (1 + buy_percent / 100)
            }
            break;
          case "FWG":
            if (this.orderbooks && this.orderbooks.fwg && this.orderbooks.fwg.bids && this.orderbooks.fwg.bids[0]) {
              price = this.orderbooks.fwg.bids[0].unit_price/100000000 * (1 + buy_percent / 100)
            }
            break;
          case "FWW":
            if (this.orderbooks && this.orderbooks.fww && this.orderbooks.fww.bids && this.orderbooks.fww.bids[0]) {
              price = this.orderbooks.fww.bids[0].unit_price/100000000  * (1 + buy_percent / 100)
            }
            break;
        }
        this.buy_for_wax = amount * price;
        this.buy_price = price;
        this.target_price = price * (1 + target_profit_ratio / 100)
        // console.log("price: " + price + " wax: " + amount);    
        return this.buy_price
    },         
    goToHome(){
        this.$router.push('/'); 
    },
    goToTrader(){
        this.$router.push('/trader'); 
    },
    traderAccount() {
      return this.getUserAccount();
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
    async startTimer() {
      console.log("start Timer for every minute");
      this.currentTime = 0;
      this.is_checking = true;

      this.timer = setInterval(async () => {
        this.game = this.game_state();

        if (this.currentTime === 0 ) {
          this.currentTime = this.reload_time;
          await this.update_data();
        } else this.currentTime--;
      }, 1000)
    },
    async update_data() {
      await this.updateOrderbook();
      this.game = await this.updateAccountState(this.traderAccount());
      this.calcBuyPrice(this.deal_token, this.deal_amount, this.buy_percent, this.target_profit_ratio);
      this.currentTime = this.reload_time;
    },
    async stopTimer() {
      console.log("stop timer");
      this.currentTime = 0;
      clearTimeout(this.timer);
      this.is_checking = false;
    },
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
