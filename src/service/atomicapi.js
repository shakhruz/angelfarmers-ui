import Vue from "vue";

import {ExplorerApi, RpcApi} from "atomicassets"
const api = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});

import * as data from '@/store/modules/data';
const { JsonRpc } = require('eosjs');

let endpoint_num = Math.floor(Math.random()*data.endpoints.length);
let endpoint = data.endpoints[endpoint_num];
let rpc = new JsonRpc(endpoint);
console.log("⚡️ atomic api rpc endpoint: " + endpoint);

// function changeEndpoint() {
//     endpoint_num = ++endpoint_num >= ends.length ? 0 : endpoint_num;
//     endpoint = data.endpoints[endpoint_num];
//     rpc = new JsonRpc(endpoint);        
//     console.log("⚡️ new atomic api rpc endpoint: " + endpoint);
// }

Vue.mixin({
    methods: {     
        ipfs_image(id) {
            return `https://ipfs.atomichub.io/ipfs/${id}`;
        },
        getAssetInfo(template_id) {
            let asset = data.assets_info.filter(a=>a.template_id == template_id);
            return asset && asset[0] ? asset[0] : null;
        },
        async getAssetsOnSale(owner, state = 2) {
            // console.log("get asset price from atomic for " + owner + "state: " + state);
            // https://aa.wax.blacklusion.io
            var url = "https://wax.api.atomicassets.io/atomicmarket/v1/sales?"
            url += "&seller=" + owner;
            url += "&state=" + state; // listed only
            url += "&page=1&limit=100&order=desc&sort=created"
            var response = await fetch(url);
        
            var json = await response.json();
            // console.log("assets on sale: " + JSON.stringify(json));
    
            return json["data"];
        },
        async countAssetsOnSale(schema_name, template_id) {
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
        },
        atomicUrl(template_id) {
            const asset_info = this.getAssetInfo(template_id);
            var url = 'https://wax.atomichub.io/market?collection_name=farmersworld';
            url += "&schema_name=" + asset_info["schema_name"];
            url += "&template_id=" + template_id;
            url += "&order=asc&sort=price&symbol=WAX";
            return url;
        },
        atomicAssetUrl(asset_id) {
            var url = 'https://wax.atomichub.io/explorer/asset/' + asset_id;
            return url;
        },
        atomicSaleUrl(sale_id) {
            return 'https://wax.atomichub.io/market/sale/' + sale_id;
        },
        fw_get_atomic_asset_by_id(atomic_asset_id) {
            return this.wax_rpc().get_table_rows({
                json: true,               
                code: 'atomicassets',     
                scope: owner,    
                table: 'assets',      
                limit: 1000,                
                reverse: false,           
                show_payer: false         
            });
        },
        // Обменять НФТ в игре на золото
        async atomic_exchange_asset(account_name, template_id, amount_to_exchange, pkey=null, delegate = null) {
            // найдем ферму для начала
            for(let f=0; f < this.$store.state.farms.length; f++) {
                const farm = this.$store.state.farms[f];
                if (farm.account_name==account_name) {
                    // найдем нужное количество искомого актива
                    let found = 0;
                    let ids = [];
                    for(let c=0; c < farm.assets.list.length && found<amount_to_exchange; c++) {
                        const asset = farm.assets.list[c];            
        
                        if (asset["collection_name"] == "farmersworld" && asset["template_id"]==template_id) {
                            ids.push(asset["asset_id"]);
                            found++;
                        }
                    }
                    if (found>0) {
                        // есть что отправлять
                        try {
                            const action = {
                                account: 'atomicassets',
                                name: 'transfer',
                                authorization: this.session_auth(account_name, delegate),
                                data: {
                                    asset_ids: ids,
                                    from: account_name,
                                    memo: 'burn',
                                    to: "farmersworld",
                                },
                            };
                
                            const result = await this.wax_transact(action, pkey, delegate);
                            if (result) return {status: true, result};
                            else return {status: false, result}
                        } catch(e) {
                            return {result: e.message, status: false};
                        }
                    }
                }
            }
        }, 
        
        // Transfer NFT to another account
        async atomic_transfer_asset(account_name, template_id, amount, send_to, pkey=null, delegate = null) {
            // найдем ферму для начала
            for(let f=0; f < this.$store.state.farms.length; f++) {
                const farm = this.$store.state.farms[f];
                if (farm.account_name==account_name) {
                    // найдем нужное количество искомого актива
                    let found = 0;
                    let ids = [];
                    for(let c=0; c < farm.assets.list.length && found<amount; c++) {
                        const asset = farm.assets.list[c];            
        
                        if (asset["collection_name"] == "farmersworld" && asset["template_id"]==template_id) {
                            ids.push(asset["asset_id"]);
                            found++;
                        }
                    }
                    if (found>0) {
                        // есть что отправлять
                        try {
                            const action = {
                                account: 'atomicassets',
                                name: 'transfer',
                                authorization: this.session_auth(account_name, delegate),
                                data: {
                                    asset_ids: ids,
                                    from: account_name,
                                    memo: '',
                                    to: send_to,
                                },
                            };
                
                            const result = await this.wax_transact(action, pkey, delegate);
                            if (result) return {status: true, result};
                            else return {status: false, result}
                        } catch(e) {
                            return {result: e.message, status: false};
                        }
                    }
                }
            }
        },  

        // Transfer NFT to another account
        async atomic_send_assets(account_name, ids, send_to, pkey=null, delegate = null) {
            // найдем ферму для начала
            if (ids.length>0) {
                // есть что отправлять
                try {
                    const action = {
                        account: 'atomicassets',
                        name: 'transfer',
                        authorization: this.session_auth(account_name, delegate),
                        data: {
                            asset_ids: ids,
                            from: account_name,
                            memo: '',
                            to: send_to,
                        },
                    };
        
                    const result = await this.wax_transact(action, pkey, delegate);
                    if (result) return {status: true, result};
                    else return {status: false, result}
                } catch(e) {
                    return {result: e.message, status: false};
                }
            }
        },  

        // Поставить NFT на продажу на Атомик
        async atomic_sell_nft_atomic(account_name, template_id, price, amount, pkey=null, delegate = null) {
            const lprice = Number(price).toFixed(8) + " WAX";
            let sold = 0;
            let status = false;
            let fresult = null;

            // найдем ферму для начала
            for(let f=0; f < this.$store.state.farms.length && sold==0; f++) {
                const farm = this.$store.state.farms[f];
                if (farm.account_name==account_name) {
                    // пройдемся по всем активам
                    for(let c=0; c < farm.assets.list.length && sold<amount; c++) {
                        const asset = farm.assets.list[c];            
        
                        if (asset["collection_name"] == "farmersworld" && asset["template_id"]==template_id) {
                            // есть что отправлять
                            try {
                                const action = {
                                    account: 'atomicmarket',
                                    name: 'announcesale',
                                    authorization: this.session_auth(account_name, delegate),
                                    data: {
                                        asset_ids: [asset["asset_id"]],
                                        listing_price: lprice,
                                        maker_marketplace:'',
                                        seller: account_name,
                                        settlement_symbol: '8,WAX',
                                    },
                                };

                                const result = await this.wax_transact(action, pkey, delegate);
                                if (result) {
                                    // console.log(JSON.stringify(result, null, 2));
        
                                    const action2 = {
                                        account: 'atomicassets',
                                        name: 'createoffer',
                                        authorization: this.session_auth(account_name, delegate),
                                        data: {
                                            memo: 'sale',
                                            recipient: 'atomicmarket',
                                            recipient_asset_ids:'',                            
                                            sender: account_name,
                                            sender_asset_ids: [asset["asset_id"]]
                                        },
                                    };
        
                                    const result2 = await this.wax_transact(action2, pkey, delegate);
                                    if (result2) {
                                        sold++;
                                        status = true;
                                        fresult = result2;
                                    }
                                } 
                            } catch(e) {
                                // return {result: e.message, status: false};
                                console.log("не смог поставить на продажу: " + e.message);
                                fresult = e.message;
                            }
                        }

                    }
                    return {status: status, result:fresult};
                }
            }
            return {status: false, result:''};
        },       

        // Отменить заявку на продажу на Атомике
        async atomic_cancel_atomic_sale(sale_id) {
            try {
                const action = {
                    account: 'atomicmarket',
                    name: 'cancelsale',
                    authorization: this.session_auth(),
                    data: {
                        sale_id: sale_id
                    },
                };

                const result = await this.wax_transact(action);
                // this.mylog("Успешно отменил заявку на продажу...");
                // console.log(JSON.stringify(result, null, 2));
                return true;
            } catch(e) {
                console.log("НЕ получилось отменить заявку на продажу! Произошла ошибка: " + e.message);
                return e.message;
            }
        },  

        // Найти актив в сундуке
        async findBarleyAsset(owner, barley_used = []) {
            const result2 = await this.atomic_get_assets_by_owner(owner);

            var food_id = "";

            if (result2 && result2["rows"] && result2["rows"][0]) {
                const foods = result2["rows"];
                foods.forEach((asset) => {
                    if (!barley_used.includes(asset["asset_id"]) && 
                        asset["schema_name"] == "foods" && asset["collection_name"] == "farmersworld") {
                        food_id = asset["asset_id"];            
                    }
                })
            }
            return food_id;
        },

        // Найти актив в сундуке
        async findMilkAsset(owner, milk_used = []) {
            const result2 = await this.atomic_get_assets_by_owner(owner);

            var food_id = "";

            if (result2 && result2["rows"] && result2["rows"][0]) {
                const foods = result2["rows"];
                foods.forEach((asset) => {
                    if (!milk_used.includes(asset["asset_id"]) && 
                        asset["template_id"] == "298593" &&
                        asset["schema_name"] == "foods" && asset["collection_name"] == "farmersworld") {
                        food_id = asset["asset_id"];            
                    }
                })
            }
            return food_id;
        },        

        // Получить информацию об активе по ID
        async getAtomicAssetInfoById(asset_id, owner) {
            try {
                const info = await rpc.get_table_rows({
                    json: true,               
                    code: 'atomicassets',     
                    scope: owner,    
                    table: 'assets',      
                    index_position: 0,
                    key_type: "uint64",
                    lower_bound: asset_id,  
                    upper_bound: asset_id,                 
                    limit: 1,                
                    reverse: false,           
                    show_payer: false         
                });                    
                return info;
            } catch (error) {
                console.log("Не удалось получить информацию по активу. Ошибка: " + error.message);
                return false;
            }
        },

        // Найти все активы по хозяину
        atomic_get_assets_by_owner(owner) {
            return rpc.get_table_rows({
                json: true,               
                code: 'atomicassets',     
                scope: owner,    
                table: 'assets',      
                limit: 1000,                
                reverse: false,           
                show_payer: false         
            });
        },    
        getAssetExpenses(asset_name) {
            let asset = this.$store.state.atomic_assets.filter(a => a.name == asset_name);
            let expenses = {};
            if (asset && asset[0]) {
                if (asset[0].energy) expenses.energy = asset[0].energy;
                if (asset[0].repair) expenses.repair = asset[0].repair;
            }
            return expenses;
        }     
    }
});
    
  
  