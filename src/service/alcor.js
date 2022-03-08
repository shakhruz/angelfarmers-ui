import Vue from "vue";
import axios from 'axios';

const fwg_id = "106"
const fwf_id = "105"
const fww_id = "104"

var ccxt = require ('ccxt');
let huobipro  = new ccxt.huobipro ()
// let huobipro  = new ccxt.binance ()

const alcor_api_url = "https://wax.alcor.exchange/api/markets/"
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// const ends = ["https://api.wax.alohaeos.com", "https://api.waxsweden.org", "https://wax.pink.gg", "https://wax.eosphere.io", "https://api.wax.greeneosio.com", "https://wax.cryptolions.io"];

// const ends = ["https://wax.pink.gg"];
// const { JsonRpc } = require('eosjs');
// let endpoint = ends[Math.floor(Math.random()*ends.length)];
// let rpc = new JsonRpc(endpoint);

import * as data from '@/store/modules/data';
const { JsonRpc } = require('eosjs');

let endpoint_num = 0;
let endpoint = data.endpoints[endpoint_num];
if (localStorage.endpoint) {
    endpoint = localStorage.endpoint;
}

let rpc = new JsonRpc(endpoint);


function changeEndpoint() {
    // endpoint = ends[Math.floor(Math.random()*ends.length)];
    // console.log("new endpoint: " + endpoint);
    // rpc = new JsonRpc(endpoint);
}

Vue.mixin({
  methods: {
    async get_buyorders(market_id) {
      try {
        const result = await rpc.get_table_rows({
          json: true,               
          code: 'alcordexmain',     
          scope: market_id,    
          table: 'buyorder',      
          limit: 100,                
          key_type: 'i128',           
          index_position: 2         
        });          
        return result;
      } catch (error) {
        console.log("ОШИБКА чтения get_buyorders: " + error.message);
        // changeEndpoint();        
      }
      return false;
    },     
    async get_sellorders(market_id) {
      try {
        const result = rpc.get_table_rows({
          json: true,               
          code: 'alcordexmain',     
          scope: market_id,    
          table: 'sellorder',      
          limit: 100,                
          key_type: 'i128',           
          index_position: 2         
        });
        return result;      
      } catch (error) {
        console.log("ОШИБКА чтения get_sellorders: " + error.message);
        // changeEndpoint();        
      }
      return false;
    },     
  }
});
