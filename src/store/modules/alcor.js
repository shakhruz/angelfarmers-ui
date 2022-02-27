import axios from 'axios';

const fwg_id = "106"
const fwf_id = "105"
const fww_id = "104"

var ccxt = require ('ccxt');
// let huobipro  = new ccxt.huobipro ()
let huobipro  = new ccxt.binance ()

const alcor_api_url = "https://wax.alcor.exchange/api/markets/"
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export async function getAlcorPrice(market_id) {  
    try {
        const res = await axios.get(alcor_api_url + market_id)
        // console.log("!! price: " + JSON.stringify(res.data));
        return res.data;
    } catch (error) {
        console.log("ОШИБКА получения цены FWW: " + error.message)
        return false;        
    }
}

export async function getFWWprice() {  
    return getAlcorPrice(fww_id);        
}

export async function getFWFprice() {  
    return getAlcorPrice(fwf_id);        
}

export async function getFWGprice() {  
    return getAlcorPrice(fwg_id);        
}

export async function getWAXprice() {  
    try {
        const price_res = await huobipro.fetchTicker ('WAXP/USDT');
        const price = price_res["last"];
        return price;            
    } catch (error) {
        console.log("ОШИБКА получения цены WAX: " + error.message);
        return false;
    }
}
