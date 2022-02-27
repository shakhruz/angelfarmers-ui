import Vue from "vue";

Vue.mixin({
  methods: { 
    // Добыча с помощью инструмента
    async fw_claim(asset_id, account_name, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'claim',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_id: asset_id,
                    owner: account_name
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("crop claim error :" + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },
    // Поливка поля
    async fw_crop_claim(crop_id, account_name, pkey=null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'cropclaim',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    crop_id: crop_id,
                    owner: account_name
                },
            };

            console.log("action: " + JSON.stringify(action) + " " + delegate);
            const result = await this.wax_transact(action, pkey, delegate);
            if (result) return {status: true, result};
            else return {status: false, result}
            // console.log(JSON.stringify(result, null, 2));
        } catch(e) {
            // console.log("crop claim error :" + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },
    // Получить бонус за Мембер карту
    async fw_membership_claim(member_id, account_name, pkey=null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'mbsclaim',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_id: member_id,
                    owner: account_name
                },
            };
            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось забрать бонус за membership! Произошла ошибка: " + e.message );
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    }, 
    
    // Снять карточку Мембер из игры
    async fw_membership_unstake(member_id, account_name, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'mbsunstake',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_id: member_id,
                    asset_owner: account_name
                },
            };
            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось снять membership! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },  

    // Восстановление энергии
    async fw_recover_energy(energy_to_recover, account_name, pkey = null, delegate = null) {
        if (energy_to_recover>0) {
            try {
                const action = {
                    account: 'farmersworld',
                    name: 'recover',
                    authorization: this.session_auth(account_name, delegate),
                    data: {
                        energy_recovered: energy_to_recover,
                        owner: account_name
                    },
                };
    
                const result = await this.wax_transact(action, pkey, delegate);
                // console.log(JSON.stringify(result, null, 2));
                if (result) return {status: true, result};
                else return {status: false, result}    
            } catch(e) {
                console.log("НЕ получилось восстановить энергию! Произошла ошибка: " + e.message);
                this.changeEndpoint();
                return {result: e.message, status: false};
            }    
        } 
    }, 

    // Починка инструмента
    async fw_repair(asset_id, account_name, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'repair',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_id: asset_id,
                    asset_owner: account_name
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось починить инструмент! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    }, 

    // Постройка здания
    async fw_claim_building(asset_id, account_name, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'bldclaim',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_id: asset_id,
                    owner: account_name
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось построить! Произошла ошибка%: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },     
    // Покормим живтное NFT едой
    async fw_feed_animal(asset_id, food_id, account_name, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'atomicassets',
                name: 'transfer',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_ids: [food_id],
                    from: account_name,
                    memo: "feed_animal:" + asset_id,
                    to: "farmersworld"
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось покормить животное! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },   
    // Прогреем яйца
    async fw_hatch_egg(asset_id, account_name, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'anmclaim',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    animal_id: asset_id,
                    owner: account_name
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось покормить яйцо! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },   
    // Поставить карту в игру
    async fw_asset_wear(asset_id, account_name, pkey=null, delegate = null) {
        try {
            const action = {
                account: 'atomicassets',
                name: 'transfer',
                authorization: this.session_auth(account_name, pkey, delegate),
                data: {
                    asset_ids: [asset_id],
                    from: account_name,
                    memo: "stake",
                    to: "farmersworld"
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось подключить membership! Произошла ошибка: "  + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },   
    
    // Засеять поле семенами
    async fw_plant_seeds(account_name, asset_id, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'atomicassets',
                name: 'transfer',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    asset_ids: [asset_id],
                    from: account_name,
                    memo: "stake",
                    to: "farmersworld"
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось посадить семена! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },  

    // Купить семена в игре  
    async fw_buy_seeds(account_name, quantity, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'mktbuy',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    owner: account_name,
                    quantity: quantity,
                    template_id: "298595",
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось купить семена! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    }, 

    // Купить NFT в игре на маркете
    async fw_market_buy(account_name, template_id, quantity, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'mktbuy',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    'owner': account_name,
                    quantity: quantity,
                    template_id: template_id,
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось купить " + template_id + "! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },

    // Скрафтить NFT в игре
    async fw_mint_asset(account_name, template_id, pkey=null, delegate = null) {
        const item = this.assets_info().filter((f)=>f.template_id == template_id);
        if (item && item[0]) {
            const name = item[0].name;
            try {
                const action = {
                    account: 'farmersworld',
                    name: 'mintasset',
                    authorization: this.session_auth(account_name, delegate),
                    data: {
                        'owner': account_name,
                        'memo': name,
                    },
                };
    
                const result = await this.wax_transact(action, pkey, delegate);
                // console.log(JSON.stringify(result, null, 2));
                if (result) return {status: true, result};
                else return {status: false, result}    
            } catch(e) {
                // console.log("НЕ получилось скрафтить " + name + "! Произошла ошибка: " + e.message);
                this.changeEndpoint();
                return {status: false, result: e.message};
            }
        }

    }, 

    // Скрафтить здание в игре
    async fw_mint_building(account_name, template_id, pkey=null, delegate = null) {
        try {
            const action = {
                account: 'farmersworld',
                name: 'mintbld',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    new_owner: account_name,
                    template_id: template_id,
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось скрафтить " + template_id + "! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }

    },  
    
    // Скрафтить инструмент
    async fw_craft_asset(account_name, template_id, amount_to_craft, pkey = null, delegate = null) {
        const asset = this.assets_info().filter((f) => f.template_id == template_id)
        if (asset && asset[0]) {
            if (asset[0].building) {
                const res =  await this.fw_mint_building(account_name, template_id, pkey, delegate);
                return res;
            } else {
                if (asset[0].wood>0) {
                    // craft
                    const res  =  await this.fw_mint_asset(account_name, template_id, pkey, delegate);
                    return res;
                } else {
                    // market buy
                    const res =  await this.fw_market_buy(account_name, template_id, amount_to_craft, pkey, delegate);
                    return res;
                }    
            }
        } else console.log("asset info not found: " + template_id);
        return {status: false, result: ''};
    },

    // Добавить монеты в игру со счета
    async fw_deposit_tokens(account_name, quantity, tokenName, pkey =null, delegate = null) {
        const amount = this.formatLongAsset(quantity) + " " + tokenName;

        try {
            const action = {
                account: 'farmerstoken',
                name: 'transfers',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    memo: 'deposit',
                    quantities: [amount],
                    to: "farmersworld",
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось ввести токены в игру! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result:e.message, status:false};
        }
    },  

    // Добавить монеты в игру со счета
    async fw_deposit_all_tokens(account_name, gold, wood, food, pkey =null, delegate = null) {
        // const amount = this.formatLongAsset(quantity) + " " + tokenName;
        let amount = [];
        if (gold>0) amount.push(this.formatAsset(gold,4) + " FWG");
        if (wood>0) amount.push(this.formatAsset(wood,4) + " FWW");
        if (food>0) amount.push(this.formatAsset(food,4) + " FWF");

        try {
            const action = {
                account: 'farmerstoken',
                name: 'transfers',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    memo: 'deposit',
                    quantities: amount,
                    to: "farmersworld",
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось ввести токены в игру! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result:e.message, status:false};
        }
    },  

    // Перевод игровых монет со счета на счет
    async fw_transfer_all_tokens(account_name, to, gold, wood, food, memo = '', pkey =null, delegate = null) {
        // const amount = this.formatLongAsset(quantity) + " " + tokenName;
        let amount = [];
        if (gold>0) amount.push(this.formatAsset(gold,4) + " FWG");
        if (wood>0) amount.push(this.formatAsset(wood,4) + " FWW");
        if (food>0) amount.push(this.formatAsset(food,4) + " FWF");

        try {
            const action = {
                account: 'farmerstoken',
                name: 'transfers',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    memo: memo,
                    quantities: amount,
                    to: to,
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось перевести токены! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result:e.message, status:false};
        }
    },      

    // Вывести токены из игры
    async fw_withdraw_tokens(account_name, quantity, tokenName, fee, pkey=null, delegate = null) {
        const amount = this.formatLongAsset(quantity) + " " + tokenName;

        try {
            const action = {
                account: 'farmersworld',
                name: 'withdraw',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    fee: fee,
                    owner: account_name,
                    quantities: [amount]
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось вывести токены из игры! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result: e.message, status: false};
        }
    }, 

    // Вывести токены из игры
    async fw_withdraw_all_tokens(account_name, gold, wood, food, fee, pkey=null, delegate = null) {
        let amount = [];
        if (gold>0) amount.push(this.formatAsset(gold,4) + " GOLD");
        if (wood>0) amount.push(this.formatAsset(wood,4) + " WOOD");
        if (food>0) amount.push(this.formatAsset(food,4) + " FOOD");

        try {
            const action = {
                account: 'farmersworld',
                name: 'withdraw',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    fee: fee,
                    owner: account_name,
                    quantities: amount
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            console.log("НЕ получилось вывести токены из игры! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result: e.message, status: false};
        }
    },     

    // Перевести токены игры на другой счет
    async fw_send_tokens(account_name, quantity, tokenName, send_to, memo, pkey=null, delegate = null) {
        if (!send_to.trim()) {
            console.log("Не указан получатель!");
            return;
        }
        const amount = this.formatLongAsset(quantity) + " " + tokenName;

        try {
            const action = {
                account: 'farmerstoken',
                name: 'transfer',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    quantity: amount,
                    to: send_to,
                    memo: memo
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // this.mylog("Успешно перевел " + this.formatLongAsset(quantity) + " " + tokenName + " на " + send_to);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось перевести токены! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result: e.message, status: false};
        }
    },    
    
    // стейка на CPU
    async fw_stake_cpu(account_name, to, quantity, transfer, pkey=null, delegate = null) {
        if (!to.trim()) {
            console.log("Не указан получатель!");
            return;
        }
        const amount = Number(quantity).toFixed(8) + " WAX";

        try {
            const action = {
                account: 'eosio',
                name: 'delegatebw',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    receiver: to,
                    stake_cpu_quantity: amount,
                    stake_net_quantity: "0.00000000 WAX",                    
                    transfer: transfer
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            this.changeEndpoint();
            return {result: e.message, status: false};
        }
    },      

    // Отправить WAX токены
    async send_wax(account_name, quantity, send_to, memo, pkey=null, delegate = null) {
        if (!send_to.trim()) {
            console.log("Не указан получатель!");
            return;
        }
        const amount = this.formatSellAssetPrice(quantity);

        try {
            const action = {
                account: 'eosio.token',
                name: 'transfer',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    quantity: amount,
                    to: send_to,
                    memo: memo
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // this.mylog("Успешно перевел " + amount + " на " + send_to);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось перевести wax! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {result: e.message, status: false};
        }
    }, 

    // Отправить WAX токены
    async fw_send_awax(account_name, quantity, send_to, memo, pkey=null, delegate = null) {
        if (!send_to.trim()) {
            console.log("Не указан получатель!");
            return;
        }
        const amount = Number(quantity).toFixed(4) + " AWAX";

        try {
            const action = {
                account: 'awaxdaotoken',
                name: 'transfer',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    from: account_name,
                    quantity: amount,
                    to: send_to,
                    memo: memo
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            this.changeEndpoint();
            return {result: e.message, status: false};
        }
    },     

    // Отменить заявку на Алькоре
    async cancel_buy_alcor(account_name, market_id, order_id, pkey = null, delegate = null) {
        try {
            const action = {
                account: 'alcordexmain',
                name: 'cancelbuy',
                authorization: this.session_auth(account_name, delegate),
                data: {
                    executor: account_name,
                    market_id: market_id,
                    order_id: order_id
                },
            };

            const result = await this.wax_transact(action, pkey, delegate);
            // this.mylog("Успешно отменил сделку на алкор " + order_id);
            // console.log(JSON.stringify(result, null, 2));
            if (result) return {status: true, result};
            else return {status: false, result}
        } catch(e) {
            // console.log("НЕ получилось перевести wax! Произошла ошибка: " + e.message);
            this.changeEndpoint();
            return {status: false, result: e.message};
        }
    },                
    // fw_get_breedings(owner) {
    //     return this.wax_rpc().get_table_rows({
    //         json: true,               
    //         code: 'farmersworld',     
    //         scope: 'farmersworld',    
    //         table: 'breedings',    
    //         index_position: 2,
    //         key_type: "name",
    //         lower_bound: owner,  
    //         upper_bound: owner, 
    //         limit: 100,                
    //         reverse: false,           
    //         show_payer: false         
    //     });    
    // },    
  },
});

