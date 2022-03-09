import Vue from "vue";

Vue.mixin({
  methods: {
    // проверим нужно ли обслуживание для ферм и проводим его
    async checkFarmActions(account_name) {
        if (this.$store.state.pause_all) {
            // console.log("Все остановлено, не буду проверять фермы в checkFarms....");
            return;
        }
        let farm = null;
        for(let i=0;i<this.$store.state.farms.length;i++) {
          if (this.$store.state.farms[i].account_name == account_name) {
            farm = this.$store.state.farms[i]; break;
          }
        }      
        if (farm) {
          await this.farmActions(farm);
          await this.masterFarmActions(farm);
        }      
    },       
    // ПРОВОДИМ ОБСЛУЖИВАНИЕ ФЕРМЫ      
    async farmActions(game) {
        // console.log("farmActions " + game.account_name);
        if (this.$store.state.pause_all) {
            // console.log("Все остановлено, не буду проверять фермы в farmActions....");
            return;
        }

        let updateFarm = false;

        if (!game.account_name || game.account_name == null) return;
        if (!(game.wax_login || (game.settings.private_key && game.settings.private_key.trim()!='') || (game.settings.delegated_account && game.settings.delegated_account.trim()!=''))) {
            // console.log("нет ключа от этой фермы");
            return;
        }
        if (game.settings.pause_all_actions) {
            // console.log('all actions are paused on ' + game.account_name);
            return;
        }
        // если есть приватный ключ, используем его. если есть вакс логин, то сбрасываем ключ
        let pkey = game.settings.private_key && game.settings.private_key!='' ? game.settings.private_key : null;
        pkey = game.wax_login ? null : pkey;
        
        // аккаунт делегат
        let delegate = game.settings.delegated_account;
        // если мы залогинены другим аккаунтом или есть приватный ключ, не используем делегат
        if (this.$store.state.userAccount != delegate || pkey!=null) delegate = null;

        if (delegate==null && pkey==null && game.wax_login && !this.$store.state.logged_in) {
            console.log("Не готов к обслуживанию фермы, еще не залогинился...")
            return;
        }

        if (pkey==null && delegate!=null && !this.$store.state.logged_in) {
            console.log("Не готов к обслуживанию фермы, управляющий еще не залогинился...")
            return;
        }

        // проверим не перегрелся ли CPU 
        if (game.account.cpu_used_percent>=100) {
            console.log(game.account_name + " CPU 100% перегрето. подождем");
            return;
        }
        
        // Восстановление энергии
        if (game.settings.refill_energy) {
            if (game.balance.energy < game.settings.min_energy) {
                var energy_to_recover = game.balance.max_energy - game.balance.energy;
                if (game.balance.food * 5 < energy_to_recover) {
                    energy_to_recover = Math.floor(game.balance.food * 5);
                    if (energy_to_recover > 0) {
                        // console.log("Not enough energy, will try to restore..." + energy_to_recover);
                        const res = await this.fw_recover_energy(energy_to_recover, game.account_name, pkey, delegate);  
                        if (res.status===true) {
                            this.log_action(this.$t("Refilled energy") + " " + energy_to_recover, res.result);
                            updateFarm = true;
                        } else {
                            this.log_error(this.$t("Failed to refill") + " " + energy_to_recover, res.result, game.account_name);
                        }
                    } else {
                        // this.log_warning("Not enough food to restore energy. Need more food...", game.account_name);
                    }
                } else {
                    if (energy_to_recover > 0) {
                        const res = await this.fw_recover_energy(energy_to_recover, game.account_name, pkey, delegate);
                        if (res.status===true) {
                            this.log_action(this.$t("Refilled energy") + " " + energy_to_recover, res.result);
                            updateFarm = true;
                        } else {
                            this.log_error(this.$t("Failed to refill") + " " + energy_to_recover, res.result, game.account_name);
                        }
                    }
                }
            }    
        }

        // Инструменты
        if (game.settings.manage_tools) {
            var tool_counter = 0;
            game.tools.list.forEach(async (tool) => {
                tool_counter++;
                // Проверим нужно ли починить инструмент
                if ((tool["current_durability"] / tool["durability"]) * 100 <= game.settings.min_durability ) {
                    // console.log("Found a tool that needs to be repaired...");
                    const res = await this.fw_repair(tool["asset_id"], game.account_name, pkey, delegate);
                    if (res.status===true) {
                        this.log_action(this.$t("Repaired") + " " +  this.$t(tool["name"]), res.result, this.$t(tool["name"]), tool["asset_id"]);
                        updateFarm = true;
                    } else {
                        this.log_error(this.$t("Failed to repair") + " " + this.$t(tool["name"]), res.result, game.account_name, this.$t(tool["name"]), tool["asset_id"]);
                    }
                }
                    
                // Если инструмент готов к работе, заберем результат
                var crop_date = new Date(parseInt(tool["next_availability"]) * 1000);
                if (crop_date < new Date()) {
                    const res = await this.fw_claim(tool["asset_id"], game.account_name, pkey, delegate);
                    if (res.status===true) {
                        this.log_action(this.$t("Claimed") + " " + this.$t(tool["name"]), res.result, this.$t(tool["name"]), tool["asset_id"]);
                        updateFarm = true;
                    } else {
                        this.log_error(this.$t("Failed to claim") + " " + this.$t(tool["name"]), res.result, game.account_name, this.$t(tool["name"]), tool["asset_id"]);
                    }
                }
            });    
        }
               
        // проверяем здания
        var bld_counter = 0;
        game.buildings.list.forEach(async (building) => {            
            var av_date = new Date(parseInt(building["next_availability"]) * 1000);
            const nowTime = new Date();
            bld_counter ++;
            const bld_info = this.getAssetInfo(building["template_id"]);
            const energy_cons = bld_info.claim && bld_info.claim.energy ? bld_info.claim.energy : 0;

            // проверяем, нужно ли строить здание
            if (game.settings.claim_buildings) {
                if (av_date > 0) {
                    if (av_date < nowTime) {
                        // console.log("Time for a building construction for " + building["name"] +  " " + building["times_claimed"] + "/8" );                    
                        const res = await this.fw_claim_building(building["asset_id"], game.account_name, pkey, delegate); 
                        if (res.status===true) {
                            this.log_action(this.$t("Claimed") + " " + this.$t(building["name"]) + ". " + building["times_claimed"] + "/" + 
                                            building["max_claims"], res.result, this.$t(building["name"]), building["asset_id"], 
                                            {expenses: {energy: energy_cons}});
                            updateFarm = true;
                        } else {
                            this.log_error(this.$t("Failed to claim") + " " + this.$t(building["name"]), res.result, game.account_name, this.$t(building["name"]), building["asset_id"]);
                        }
                    }    
                }
            }
            // проверяем на возможность посадить новые поля
            if (game.settings.plant_seeds) {
                // проверяем если это плантация и есть ли там свободные поля
                if (building["template_id"] == "298592" && building["slots_used"]<8) {
                    let to_plant = 8 - building["slots_used"];
                    // console.log("Found " + to_plant + " empty fields to grow. Will look for seeds to plant...");
    
                    for(var n = 0; n < game.assets.list.length; n++) {
                        const asset = game.assets.list[n];
                        // console.log("asset - " + JSON.stringify(asset));
                        if (to_plant>0) {
                            if (asset["schema_name"] == "plants" && asset["template_id"]=="298595") {
                                // console.log("Found Barley Seed. Will be plant them...");
                                const res = await this.fw_plant_seeds(game.account_name, asset["asset_id"], pkey, delegate);
                                if (res.status===true) {
                                    this.log_action(game.account_name + " " + this.$t("Planted seeds"), res.result, this.$t(building["name"]), building["asset_id"]);
                                    updateFarm = true;
                                    to_plant--;
                                } else {
                                    this.log_error(game.account_name + " " + this.$t("Failed to plant seeds") +  res.result, game.account_name, this.$t(building["name"]), building["asset_id"]);
                                }    
                            }    
                        }
                    }
                    if (to_plant>0 && game.settings.buy_seeds) {
                        // console.log("Need Barley Seed to plant...");

                        if (game.balance.gold > to_plant*50) {
                            // console.log("We have gold to buy Barley seeds. Will try...");
                            // попробуем закупить семена в игре
                            const res = await this.fw_buy_seeds(game.account_name, to_plant, pkey, delegate);
                            if (res.status===true) {
                                this.log_action(this.$t(game.account_name + " " + "Purchased barley seeds to plant"), res.result);
                                updateFarm = true;
                            } else {
                                this.log_error(game.account_name + " " + this.$t("Failed to purchase barley seeds to plant"), res.result, game.account_name);
                            }    
                        } else {
                            // не хватает золота, предупредим хозяина
                            // this.log_warning("Need more " + this.formatAsset(to_plant*50 - game.balance.gold) + " gold to buy seeds", game.account_name);
                        }
                    }
                }
                // проверяем курятник на свободные места для яиц
                if (building["template_id"] == "298591" && building["slots_used"]<3) {
                    var to_plant = 3 - building["slots_used"];
                    // предупредим хозяина что есть места в курятнике
                    // this.log_warning("There are " + to_plant + " vacant spots in Coop for eggs. ", game.animal_counter);
                }                    
            }
        });

        // ПЛАНТАЦИЯ         
        if (game.settings.claim_crops) {
            let crop_counter = 0;
            game.crops.list.forEach(async (crop) => {
                crop_counter++;
                // console.log("проверяем урожаи " +  crop["asset_id"]);                
                var crop_date = new Date(parseInt(crop["next_availability"]) * 1000);
                if (crop_date < new Date()) {
                    if (game.balance.energy>=30) {
                        // console.log(crop_counter + ". " + crop["name"] +  " готов к поливу. Поливаем...." + delegate);
                        const res = await this.fw_crop_claim(crop["asset_id"], game.account_name, pkey, delegate);
                        if (res.status===true) {
                            this.log_action(this.$t(crop["name"]) + " " + this.$t("claimed") + " " + crop["times_claimed"] + "/42" , res.result, this.$t(crop["name"]), crop["asset_id"]);
                            updateFarm = true;
                        } else {
                            this.log_error(this.$t("Failed to claim crop"), res.result, game.account_name, this.$t(crop["name"]), crop["asset_id"]);
                        }
                    } else {
                        console.log("Not enough energy to claim crop for " + game.account_name);
                    }
                }
            }); 
        }   
        
        // Проверим запас еды и пополним если нужно
        if (game.balance.food < game.settings.min_food && game.settings.deposit_fwf) {
            // console.log("Еды осталось меньше 100, попробую пополнить из кошелька...");
            if (game.tokens.fwf > 0) {
                const load = game.tokens.fwf > game.daily_expense_food/2 ? game.daily_expense_food/2 : game.tokens.fwf;
                if (load>game.tokens.fwf) load = game.tokens.fwf;
                const res = await this.fw_deposit_tokens(game.account_name, load, "FWF", pkey, delegate);
                if (res.status===true) {
                    this.log_action(this.$t("Deposited") + " " + load + " FWF ", res.result);
                    updateFarm = true;
                } else {
                    this.log_error(this.$t("Failed to deposit FWF tokens into game"), res.result, game.account_name);
                }
            } else {
                // this.log_warning("There are no FWF tokens and food in the game... Please refill", game.account_name);
            }
        }
                        
        // ЖИВОТНЫЕ
        let animal_counter = 0;
        let used_barley = [];
        for(var ac = 0; ac < game.animals.list.length; ac ++) {
            const animal = game.animals.list[ac];
            var claim_date = animal["claim_date"];
            const nowTime = new Date();
            animal_counter++;

            if (claim_date < nowTime) {
                // console.log(animal_counter + ". " + animal["name"] + " время кормить! уже кормили " + 
                //         animal["times_claimed"] + " раз");
                
                // chicken egg
                if (animal["template_id"]=="298612") {
                    // console.log("Chicken Egg потребяет только энергию...")
                    if (game.settings.hatch_eggs) {
                        const res = await this.fw_hatch_egg(animal["asset_id"],  game.account_name, pkey, delegate);
                        if (res.status===true) {
                            this.log_action(this.$t("Claimed Egg"), res.result, this.$t(animal["name"]), animal["asset_id"]);
                            updateFarm = true;
                        } else {
                            this.log_error(this.$t("Failed to claim an egg"), res.result, game.account_name, this.$t(animal["name"]), animal["asset_id"] );
                        }    
                    }
                } else {
                    // если это курица или корова chicken / daily cow / female calf, male calf
                    if ((animal["template_id"] == "298614" && game.settings.feed_with_barley ) || 
                         ((animal["template_id"] == "298607" || animal["template_id"] == "298599" ||
                        animal["template_id"] == "298600") && game.settings.feed_cow_with_barley)) {
                        const barley_id = await this.findBarleyAsset(game.account_name, used_barley);
                        if (barley_id=="") {
                            // console.log("Не нашел Barley для кормления животного...");
                            // this.log_warning("There is no barley to feed animals. Buy some barley please... ", game.account_name);
                        } else {
                            // console.log("Будем кормить " + animal["name"] + " " + animal["asset_id"] + " мешком корма " + barley_id);
                            const res = await this.fw_feed_animal(animal["asset_id"], barley_id, game.account_name, pkey, delegate);            
                            if (res.status===true) {
                                used_barley.push(barley_id);
                                this.log_action(this.$t("Fed") + " " + this.$t(animal["name"]) + " " + this.$t("with Barley") + " " +
                                                animal["times_claimed"] + "/" + animal["max_claim"], res.result, this.$t(animal["name"]), animal["asset_id"]);
                                updateFarm = true;
                                break;
                            } else {
                                this.log_error(this.$t("Failed to feed") + " " + this.$t(animal["name"]), res.result, game.account_name, 
                                                this.$t(animal["name"]), animal["asset_id"]);
                            }
                        }        
                    } else {
                        // baby calf
                        if (animal["template_id"] == "298597" ) {
                            if (game.settings.feed_with_milk) {
                                const milk = await this.findMilkAsset(game.account_name);
                                if (milk=="") {
                                    // console.log("There is no milk to feed baby calf. Buy some milk please... ", game.account_name);
                                    // this.log_warning("There is no barley to feed animals. Buy some barley please... ", game.account_name);
                                } else {
                                    // console.log("Будем кормить " + animal["name"] + " " + animal["asset_id"] + " мешком корма " + animal_food);
                                    const res = await this.fw_feed_animal(animal["asset_id"], milk, game.account_name, pkey, delegate);            
                                    if (res.status===true) {
                                        this.log_action(this.$t("Fed") + " " + this.$t(animal["name"]) + " " + this.$t("with Barley") + " " + 
                                                        animal["times_claimed"] + "/6", res.result, this.$t(animal["name"]), animal["asset_id"]);
                                        updateFarm = true;
                                        break;
                                    } else {
                                        this.log_error(this.$t("Failed to feed") + " " + this.$t(animal["name"]), res.result, game.account_name, 
                                                        this.$t(animal["name"]), animal["asset_id"]);
                                    }
                                }        
                            }
    
                        }
                    }                       
                }
            }
        };             

        // МЕМБЕРЫ      
        if (game.settings.claim_members) {
            game.mbs.list.forEach(async (mbs) => {            
                var claim_time = new Date(parseInt(mbs["next_availability"]) * 1000);
                if (claim_time < new Date()) {
                    // console.log("Время забирать membership бонус " + mbs["type"] + mbs["asset_id"]);                    
                    const res = await this.fw_membership_claim(mbs["asset_id"], game.account_name, pkey, delegate);
                    if (res.status===true) {
                        this.log_action(this.$t("Claimed membership bonus"), res.result, this.$t(mbs["name"]), mbs["asset_id"]);
                        updateFarm = true;
                    } else {
                        this.log_error(this.$t("Failed to claim membership bonus"), res.result, this.$t(mbs["name"]), mbs["asset_id"]);
                    }
                }    
            });                
        }  

        // ЗДАНИЯ ДЛЯ УСТАНОВКИ
        if (game.settings.wear_buildings) {
            // console.log("wear building..." + game.account_name);
            // проверим есть ли ферма
            let farm = false, coop = false, cowshed = false;
            let find_asset = null;
            game.buildings.list.forEach(building => {
                switch(building.template_id) {
                    case "298592": farm = true; find_asset = "298592"; break; // farm plot
                    case "298591": coop = true; find_asset = "298591"; break; // coop
                    case "298590": cowshed = true; find_asset = "298590"; break; // cowshed
                }
            })
            if (!farm || !coop || !cowshed) {
                // console.log("Есть недостающее здание");
                // поищем здание в сундуке
                for(let i=0; i<game.assets.list.length; i++) {
                    let asset = game.assets.list[i];
                    // console.log("есть ..." + JSON.stringify(asset));
                    if ((asset["template_id"] == "298592" && !farm) ||
                        (asset["template_id"] == "298591" && !coop) ||
                        (asset["template_id"] == "298590" && !cowshed)) {
                        // нашли здание, попробуем поставить на службу
                        // console.log("нашел недостающее здание " + asset["name"]);
                        const res = await this.fw_asset_wear(asset["asset_id"], game.account_name, pkey, delegate);
                        if (res.status===true) {
                            this.log_action(this.$t("Staked building") + " " + this.$t(asset["name"]), res.result, this.$t(asset["name"]), asset["asset_id"]);
                            updateFarm = true;
                        } else {
                            this.log_error(this.$t("Failed to stake building") + " " + this.$t(asset["name"]), res.result, this.$t(asset["name"]), asset["asset_id"]);
                        }                        
                    }
                 }
            }
        }
        if (updateFarm) {
            this.$store.dispatch("updateFarm", game.account_name);
        }
    },
    // Проверяем действия для вторичных и мастер ферм
    async masterFarmActions(game) {
        // console.log("masterFarmActions " + game.account_name);
        if (this.$store.state.pause_all) {
            // console.log("Все остановлено, не буду проверять фермы в masterFarmActions....");
            return;
        }

        if (!game.account_name || game.account_name == null) return;
        if (!(game.wax_login || (game.settings.private_key && game.settings.private_key.trim()!='') || (game.settings.delegated_account && game.settings.delegated_account.trim()!=''))) {
            // console.log("нет ключа от этой фермы");
            return;
        }
        if (game.settings.pause_all_actions) {
            // console.log('all actions are paused on ' + game.account_name);
            return;
        }
        // если есть приватный ключ, используем его. если есть вакс логин, то сбрасываем ключ
        let pkey = game.settings.private_key && game.settings.private_key!='' ? game.settings.private_key : null;
        pkey = game.wax_login ? null : pkey;
        
        // аккаунт делегат
        let delegate = game.settings.delegated_account;
        // если мы залогинены другим аккаунтом или есть приватный ключ, не используем делегат
        if (this.$store.state.userAccount != delegate || pkey!=null) delegate = null;

        // ОТПРАВИТЬ УРОЖАЙ НА ГЛАВНЫЙ АККАУНТ
        if (game.settings.send_crops_to && game.settings.send_crops_to.trim()!='') {
            // console.log("проверяем есть ли урожай для отправки...");
            // const crops_list = ["318606", "318607", "298593", "298612"];
            let ids = [];
            for(let i=0; i< game.assets.list.length; i++) {
                let asset = game.assets.list[i];
                if ( asset["template_id"] == "318606" || asset["template_id"] == "318607" || asset["template_id"] == "298593" 
                        || asset["template_id"] == "298612" ) {
                    ids.push(asset["asset_id"]);
                    // console.log(asset["asset_id"]);
                }
            }
            if (ids.length>0) {
                // нашли что отправить
                // console.log("Нашел что отправить: " + ids);
                const result = await this.atomic_send_assets(game.account_name, ids, game.settings.send_crops_to, pkey, delegate);
                if (result.status===true) {
                    this.log_action(this.$t("Sent crops from") + " " + game.account_name + " " + this.$t("to") + " " + game.settings.send_crops_to, '', '');
                } else {
                    this.log_error(this.$t("Failed to send crops"), result.result, '', '');
                }                        
            } else {
                // console.log("урожай не обнаружен, нечего отправлять....");
            }
        }        
        
        // ОТПРАВИТЬ ЕДУ НА ПЛАНТАЦИИ ПО ПОТРЕБНОСТЯМ
        if (game.settings.send_food_to && game.settings.send_food_to.trim()!='' && game.tokens.fwf>0) {
            // console.log("это мастер ферма, пройдемся по плантациям, проверим еду...");
            let ffarms = game.settings.send_food_to.split(',');
            // console.log("плантации: " + JSON.stringify(ffarms));
            if (ffarms && ffarms.length>0) {
                for(let ff=0;ff<this.$store.state.farms.length;ff++) {
                    let farm = this.$store.state.farms[ff];
                    // console.log("проверим хватает ли еды на ферме " + farm.account_name);
                    if (ffarms.indexOf(farm.account_name)>=0) {
                        if (farm.daily_expense_food>0) {
                            let food_available = farm.balance.food + farm.tokens.fwf;
                            let food_needed = farm.daily_expense_food/2 - food_available;
                            // console.log(`ферма ${farm.account_name} - нужно на 12 часов: ${farm.daily_expense_food/2}, есть:  ${food_available},  нужно: ${food_needed}`);
                            if (food_needed>0) {
                                // если еды не хватает на все, отправим сколько есть...
                                if (food_needed > game.tokens.fwf && game.tokens.fwf > 0) food_needed = game.tokens.fwf;
                                if (food_needed>0 && game.tokens.fwf>0) {
                                    // console.log("отправляем " + food_needed + " FWF на плантацию " + farm.account_name);
                                    const result = await this.fw_send_tokens(game.account_name, food_needed, "FWF", farm.account_name, 'loan', pkey, delegate);
                                    if (result.status===true) {
                                        this.log_action(this.$t("Sent") + " " + food_needed + " FWF " + this.$t("from") + " " +
                                        game.account_name + " " + this.$t("to") + " " + farm.account_name, '', '');
                                    } else {
                                        this.log_error(this.$t("Failed to send") + " " + food_needed + " FWF " + this.$t("from") + " " + 
                                                        game.account_name + " " + this.$t("to") + " " + farm.account_name, result.result, '', '');
                                    }                        
                                    // console.log("не хватает " + food_needed + " еды для отправки на " + farm.account_name);
                                } else {
                                    console.log("у нас было нечего отправлять....")
                                }                                    
                            }
                        }
                    }
                }
            }                
        }        
        
        // ОТПРАВИТЬ СЕМЕНА НА ПЛАНТАЦИИ ПО ПОТРЕБНОСТЯМ
        if (game.settings.send_barley_seeds_to && game.settings.send_barley_seeds_to.trim()!='') {
            // console.log("проверяем нужно ли отправить семена...");
            let sfarms = game.settings.send_barley_seeds_to.split(',');
            if (sfarms && sfarms.length>0) {
                // console.log("пройдемся по фермам, посмотрим хватает ли им семян: " + sfarms.join());
                for(let ff=0;ff<this.$store.state.farms.length;ff++) {
                    let farm = this.$store.state.farms[ff];
                    if (sfarms.indexOf(farm.account_name)>=0) {
                        // эта ферма на обеспечении семенами
                        // console.log("checking " + farm.account_name + " if seeds are needed");
                        farm.buildings.list.forEach(async building => {
                            if (building["template_id"] == "298592" && building["slots_used"]<8) {
                                let barley_in_chest = this.calcAssetsInChest(farm, "298595");
                                // console.log("нашел свободное место для посадки, отправлю семена барли на " + farm.account_name);
                                let to_send = 8 - building["slots_used"] - barley_in_chest;
                                if (to_send>0) {
                                    let ids = [];
                                    for(let i=0; i< game.assets.list.length && to_send>0; i++) {
                                        let asset = game.assets.list[i];
                                        if (asset["template_id"]=="298595") {
                                            ids.push(asset["asset_id"])
                                            to_send--;
                                        }
                                    }
                                    // console.log("нашел семена: " + JSON.stringify(ids));
                                    if (ids.length>0) {
                                        // нашли семена на отправку
                                        const result = await this.atomic_transfer_asset(game.account_name, "298595", ids.length, farm.account_name, pkey, delegate);
                                        if (result.status==true) {
                                            this.log_action(this.$t("Sent") +  " " + ids.length + " " + this.$t("barley seeds from") +  " " + 
                                                            game.account_name + this.$t("to") +  " " + farm.account_name, '', '');
                                        } else {
                                            this.log_error(this.$t("Failed to send barley seeds"), result.result, '', '');
                                        }                        
                                    } else {
                                        console.log("Не хватает семян барли для отправки на плантацию");
                                    }
                                }
                            }
                        })                        
                    }
                }

            }
        }        
    }      
  },
});