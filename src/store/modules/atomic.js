import * as data from './data';

export async function updateAssetPrices(atomic_assets, prices) {
    // console.log("update atomic asset prices");
    if (prices.fwf==0 || prices.fwg ==0 || prices.fww==0) return atomic_assets;
    const started = new Date();
    let assets = atomic_assets;
    if (assets.length >0) {
        // обновим информацию
        for(var c=0; c<assets.length; c++) {
            let newAsset = await getAtomicAssetDetails(assets[c], prices);
            if (newAsset) assets[c] = newAsset; // Object.assign({}, newAsset);
            // console.log("asset: " + JSON.stringify(assets[c]));
        }    
    } else {
        // сформируем список активов и цен
        for(var c=0; c<data.assets_info.length; c++) {
            let details = await getAtomicAssetDetails(data.assets_info[c], prices);
            if (details) {
                details["num"] = c + 1;
                assets.push(details);    
            }
        }
    }
    console.log("completed loading atomic assets: " + (new Date() - started)/1000 + "sec");
    return assets;
}

export async function getAtomicAssetDetails(details, prices) {
    // console.log("prices: " + JSON.stringify(prices));
    // let details = Object.assign({}, asset);
    let price_info = {
        price: 0, average_price: 0, supply: 0, sales: 0, mint: 0, count: 0
    }
    try {
        let new_price_info = await getAssetPrice(details["schema_name"], details["template_id"])        
        if (new_price_info) price_info = new_price_info;
    } catch (error) {
        console.log("ОШИБКА получения цена на атомик актив: " + error.message);
    }
    if (price_info.price>0) {
        details["price"] = price_info.price;
        details["average_price"] = price_info.average_price;
        details["supply"] = price_info.supply;
        details["sales"] = price_info.sales;
        details["mint"] = price_info.mint;
        details["count"] = price_info.count;
    
        // найдем информацию по активу
        let asset_info = data.assets_info.filter( (f)=>f.template_id == details["template_id"] );
        // console.log("asset_info: " + JSON.stringify(asset_info) + " asset: " + JSON.stringify(details) + " prices: " + JSON.stringify(prices));
        if (asset_info && asset_info[0]) {
            asset_info = asset_info[0];
    
            // посчитаем стоимость актива по себестоимости
            let cost = 0;
            if (asset_info["cost"]["gold"] && prices && prices.fwg>0) cost += asset_info["cost"]["gold"] * prices.fwg;
            if (asset_info["cost"]["wood"] && prices && prices.fww>0) cost += asset_info["cost"]["wood"] * prices.fww;
            if (asset_info["cost"]["food"] && prices && prices.fwf>0) cost += asset_info["cost"]["food"] * prices.fwf;
            if (asset_info["cost"]["fc"] && prices && prices.fc && prices.fc>0) cost += asset_info["cost"]["fc"] * prices.fc;
    
            details["cost"] = cost;
            details.name = asset_info.name;
            details.energy = asset_info.energy;
            details.repair = asset_info.repair;
            details["cost_info"] = asset_info["cost"];
    
            // цена продажи на атомике
            details["sale_price"] = cost / 91 * 100;
            details["profit"] = ((price_info.price - 0.01) - details["sale_price"]) / cost * 100;
            const diff = cost - price_info.price;
            if (diff>0) {
                details["purchase_profit"] = diff / cost * 100;
            } else {
                details["purchase_profit"] = "";
            }
            details["deviation"] = (price_info.price - price_info.average_price ) / price_info.average_price * 100;
            return details;
        }
    }
    return false;
    // console.log("details: " + JSON.stringify(details,null,2));
}

export async function getAssetPrice(schema_name, template_id) {
    // console.log("get asset price from atomic for " + schema_name + " " + template_id);

    var url = "https://wax.api.atomicassets.io/atomicmarket/v1/sales?symbol=WAX&collection_name=farmersworld"
    url += "&schema_name=" + schema_name;
    url += "&template_id=" + template_id;
    url += "&is_transferable=true";
    url += "&is_burnable=true";
    url += "&burned=false";
    url += "&max_assets=1";
    url += "&min_assets=1";
    url += "&state=1";
    url += "&limit=100&order=asc&sort=price";

    var price = 0;
    var average_price = 0;
    var supply = 0;
    var sales = 0;
    var mint = 0;
    var count = 0;
    
    try {
        var response = await fetch(url);
        var json = await response.json();            
        // console.log("price: " + JSON.stringify(json));

        if (json && json["data"] && json["data"][0] && json["data"][0]["price"] && json["data"][0]["price"]["amount"]) {
            price = parseInt(json["data"][0]["price"]["amount"])/100000000;
            supply = parseInt(json["data"][0]["assets"][0]["template"]["issued_supply"]);
            average_price = parseInt(json["data"][0]["assets"][0]["prices"][0]["suggested_average"])/100000000;
            sales  = parseInt(json["data"][0]["assets"][0]["prices"][0]["sales"]);
            mint = parseInt(json["data"][0]["assets"][0]["template_mint"]);
            count = json["data"].length;
        }
    } catch (error) {
        console.log("ошибка запроса цены актива: " + error.message);
    }

    return {price, supply, average_price, sales, mint, count};
}

export async function getAveragePrice(schema_name, template_id) {
    // console.log("get asset price from atomic for " + schema_name + " " + template_id);

    var url = "https://wax.api.atomicassets.io/atomicmarket/v1/prices/templates?symbol=WAX&collection_name=farmersworld"
    url += "&schema_name=" + schema_name;
    url += "&template_id=" + template_id;
    url += "&page=1&limit=1&order=desc";
    var response = await fetch(url);

    var json = await response.json();
    // console.log("price: " + JSON.stringify(json));

    var suggested_average = 0;

    if (json && json["data"] && json["data"][0]) {
        suggested_average = parseInt(json["data"][0]["suggested_median"])/100000000;
    }

    return suggested_average;
}

export async function getAssetsOnSale(owner, state = 2) {
    // console.log("get asset price from atomic for " + owner + "state: " + state);

    var url = "https://wax.api.atomicassets.io/atomicmarket/v1/sales?"
    url += "&seller=" + owner;
    url += "&state=" + state; // listed only
    url += "&page=1&limit=100&order=desc&sort=created"
    var response = await fetch(url);

    var json = await response.json();
    // console.log("assets on sale: " + JSON.stringify(json));

    return json["data"];
}

export async function countAssetsOnSale(schema_name, template_id) {
    // console.log("get asset price from atomic for " + owner + "state: " + state);

    var url = "https://wax.api.atomicassets.io/atomicmarket/v1/sales?"
    url += "&state=1" ; // listed only
    url += "&schema_name=" + schema_name;
    url += "&template_id=" + template_id;
    url += "&page=1&limit=1000&order=desc&sort=created"
    var response = await fetch(url);

    var json = await response.json();
    // console.log("assets on sale: " + JSON.stringify(json));
    var count = 0;
    if (json["data"]) count = json["data"].length

    return count;
}

export function atomicUrl(template_id) {
    const asset_info = this.getAssetInfo(template_id);
    var url = 'https://wax.atomichub.io/market?collection_name=farmersworld';
    url += "&schema_name=" + asset_info["schema_name"];
    url += "&template_id=" + template_id;
    url += "&order=asc&sort=price&symbol=WAX";
    return url;
}  
  