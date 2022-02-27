<template>
  <div class="ma-3">
    <v-data-table
      :headers="headers"
      :items="deals"
      :sort-desc="[false, true]"
      dense disable-pagination hide-default-footer fixed-header
      class="elevation-1"
    >
      <template v-slot:item.template_id="{ item }">
          <!-- <img :src="`/fw/assets/${item.template_id}.png`" class="gamecard"> -->
      </template> 
      <template v-slot:item.name="{ item }">
          <a :href="atomicUrl(item.template_id)" target='_blank'> 
              <strong>{{ $t(item.name).toUpperCase() }} </strong>
          </a>
      </template>    
      <template v-slot:item.cost="{ item }">
          {{ formatAssetPrice(item.cost) }}
      </template>    
      <template v-slot:item.listing_price="{ item }">
          <strong>{{ formatAssetPrice(item.listing_price) }}</strong>
      </template>    
      <template v-slot:item.profit="{ item }">
        <div :class="item.profit>=0 ? 'green--text' : 'red--text'">            
            {{ item.profit ? formatAssetPrice(item.profit) : '' }}
        </div>
      </template>        
      <template v-slot:item.profit_ratio="{ item }">
        <div :class="item.profit_ratio>=0 ? 'green--text' : 'red--text'">            
            {{ formatAssetPrice(item.profit_ratio,0) }}%
        </div>
      </template>        
      <template v-slot:item.average_price="{ item }">
          {{ formatAssetPrice(item.average_price) }}
      </template>    
      <template v-slot:item.deviation="{ item }">
        <div :class="item.deviation>=0 ? 'green--text' : 'red--text'">            
            {{ formatAssetPrice(item.deviation) }}%
        </div>
      </template>      
      <template v-slot:item.seller="{ item }">
          <a :href="`https://wax.bloks.io/account/${item.seller}`" target='_blank'> {{ item.seller }} </a>
      </template>         
    </v-data-table>
    <small>
        <span v-if="!watching">
            <v-btn icon @click = 'startWatching()'>
                <v-icon>mdi-play</v-icon>
            </v-btn>
        </span>
        <span v-if="watching">
            <v-btn icon @click = 'stopWatching()'>
                <v-icon>mdi-stop</v-icon>
            </v-btn>
        </span>    
        block: {{ last_block_num }}
    </small>
  </div>
</template>

<script>

import * as data from '@/store/modules/data';

const ends = data.endpoints;

let endpoint_num = 0;
let endpoint = ends[endpoint_num];
const { JsonRpc } = require('eosjs');
let rpc = new JsonRpc(ends[endpoint_num]);

function changeEndpoint() {
    endpoint_num = ++endpoint_num >= ends.length ? 0 : endpoint_num;
    endpoint = ends[endpoint];
    console.log("new endpoint: " + endpoint);
    rpc = new JsonRpc(endpoint);
}

export default {
    name: "AtomicBuyer",
    data() {
        return {
            deals: [],
            headers: [
                { text: '',value: 'template_id', width: '10px'},
                { text: this.$t('Asset name'),value: 'name', width: '250px'},
                { text: this.$t('Seller'), value: 'seller', width: '10px' },
                { text: this.$t('Listing Price'), value: 'listing_price', width: '10px' },
                { text: this.$t('Craft cost'), value: 'cost', width: '10px'},
                { text: this.$t('Lowest Price'), value: 'lowest_price', width: '10px' },
                { text: this.$t('Average Price ￦'), value: 'average_price', width: '10px' },
                { text: this.$t('Profit ￦'), value: 'profit', width: '10px' },
                { text: this.$t('Profit %'), value: 'profit_ratio', width: '10px' },
                { text: this.$t('% from average'), value: 'deviation' },
            ],
            timer: null,
            watching: false,
            last_block_num : 0,
        }
    },
    components: {
    },
    mounted() {
        this.startWatching();
    },
    deactivated() {
        console.log("stop watching blockchain for atomic sales");
        this.stopWatching();
    },
    methods: {
        async startWatching(message_func) { 
            console.log('start watching blockchain for atomic sales');
            let block_num = 0;
            this.watching = true;
            this.timer = setInterval(async ()=>{
                try {
                    // Получим номер свежего блока из блокчейна
                    const info = await rpc.get_info();
                    if (info) {
                        block_num = info["head_block_num"];
                        // Если этот блок мы еще не разбирали
                        if (block_num>this.last_block_num) {
                            this.last_block_num = block_num;
                            let block_info;
                            do {
                                try {
                                    block_info = await rpc.get_block(block_num);                                    
                                } catch (error) {
                                    changeEndpoint();   
                                }
                            } while (!block_info);
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
                                                if (action.account == "atomicmarket" && action.name == "announcesale") {
                                                    const transaction_id = tr["trx"]["id"];
                                                    this.processNewSale(action, transaction_id);
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
        // Обработать объявление о продаже на атомике
        async processNewSale(action, tx_id) {
            // console.log("new sale: " + JSON.stringify(action));
            let listing_price = this.parseAsset(action["data"]["listing_price"]);
            let assets = action["data"]["asset_ids"];
            let symbol = action["data"]["settlement_symbol"];
            let seller = action["data"]["seller"];
            let marketplace = action["data"]["maker_marketplace"];
    
            if (assets.length==1 && symbol=="8,WAX") {
                // выясним что за токен
                const asset_info = await this.getAtomicAssetInfoById(assets[0], seller);
                if (asset_info && asset_info.rows && asset_info.rows[0].collection_name == "farmersworld") {
                    const template_id = asset_info.rows[0].template_id
                    // найдем информацю по нашим ценам
                    let details = this.$store.state.atomic_assets.filter(a => a.template_id == template_id);
                    if (details && details[0]) {
                        details = details[0]
                        if (details.cost>0) {
                            // console.log(details.name + ". cost: " + details.cost + " listing price: " + listing_price.number + " diff: " +
                            // (listing_price.number - details.cost) / details.cost * 100 + "%");
                            // добавляем как потенциальную сделку
                            let deal = {
                                template_id: details["template_id"],
                                schema_name: details["schema_name"],
                                name: details.name,
                                listing_price: listing_price.number,
                                cost: details.cost,
                                average_price: details.average_price,
                                supply: details.supply,
                                sales: details.sales,
                                count: details.count,
                                profit: listing_price.number - details.cost,
                                profit_ratio: (listing_price.number - details.cost) / details.cost * 100,
                                deviation: (listing_price.number - details.average_price) / details.average_price * 100,
                                seller: seller,
                                lowest_price: details["price"]
                            }
                            // console.log("deal: " + JSON.stringify(deal));
                            this.deals.push(deal);
                        }
                    }
                }
            }             
        },
        stopWatching() {
            clearInterval(this.timer);
            this.watching = false;
        }          
    }
};
</script>

<style>
.gamecard {
    height: 60px;
    margin: 5px;
    transition: all .2s ease-in-out;        
}

.gamecard:hover{
    transform: scale(1.1);
}
</style>
