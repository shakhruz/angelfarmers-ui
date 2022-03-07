import Vue from "vue";

Vue.mixin({
  methods: {        
    mylog(message) {
        message = this.formatDate(new Date()) + " " + message;
        // document.getElementById('response').append(message + "\n");
        console.log(message);
        this.$toast(message);
    },
    clearlog() {
        document.getElementById('response').innerHTML = "";
    },
    log_action(message, transaction, asset_name='', asset_id='', opts = {}) {
        // Вытащим данные из транзакции
        let log = null;
        let memo = '';
        let owner = '';

        let tx_id = transaction.transaction_id;
        let processed = transaction.processed;
        if (!processed || !processed.block_num) {
            console.log("транзакция не была выполнена: " + JSON.stringify(transaction, null,2));
            return;
        }
        let block_num = processed.block_num;
        let time = new Date();
        let cpu = processed.receipt.cpu_usage_us;
        if (processed.receipt.status != "executed") {
            console.log("транзакция не была выполнена: " + JSON.stringify(transaction, null,2));
            return;
        }
        let action_traces = processed.action_traces;
        action_traces.forEach(action => {
            let contract = action.receiver;
            let action_name = action.act.name ? action.act.name : '' ; 
            let account = action.act.account ? action.act.account: '';
            if (contract == "farmersworld") {
                owner = action.act.data.owner ? action.act.data.owner : '';
    
                // claim tool
                if (action_name == "claim") {
                    let asset_id = action.act.data.asset_id ? action.act.data.asset_id : '';
                    
                    // проверим сколько получили в результате бонусов и наград
                    let bonus = null;
                    let reward = null;
                    let traces = action.inline_traces;
                    let gold = 0;
                    let food = 0;
                    let wood = 0;
                    traces.forEach(trace => {
                        // console.log("looking for rewards and bonuses in: " + JSON.stringify(trace));
                        if (trace.act.account=="farmersworld") {
                            if (trace.act.name == "logbonus" && trace.act.data.bonus_rewards) {
                                bonus = trace.act.data.bonus_rewards.map(b=>this.parseAsset(b));
                                if (bonus) {
                                    bonus.forEach(r => {
                                        switch(r.asset_id) {
                                            case "GOLD": gold += r.number; break;
                                            case "WOOD": wood += r.number; break;
                                            case "FOOD": food += r.number; break;
                                        }
                                        console.log("got bonus: "+JSON.stringify(r));
                                    })                    
                                }
                            } 
                            if (trace.act.name == "logclaim" && trace.act.data.rewards) {
                                reward = trace.act.data.rewards.map(r=>this.parseAsset(r));
                                if (reward) {
                                    reward.forEach(r => {
                                        switch(r.asset_id) {
                                            case "GOLD": gold += r.number; break;
                                            case "WOOD": wood += r.number; break;
                                            case "FOOD": food += r.number; break;
                                        }
                                        console.log("got reward: "+JSON.stringify(r));
                                    })
                                }
                            }
                        }
                    })
                    let expenses = this.getAssetExpenses(asset_name);
                    log = {
                        tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        asset_id,
                        asset_name,
                        account,
                        output: {gold, wood, food},
                        expenses,
                        memo,
                        message,
                        // transaction
                    }
                }
                // repair tool
                if (action_name=="repair") {
                    let asset_id = action.act.data.asset_id;
                    owner = action.act.data.asset_owner;

                    log = {
                        tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        asset_id,
                        asset_name,
                        account,
                        memo,
                        message,
                        // transaction
                    }                
                }    
                // recover energy
                if (action_name=="recover") {
                    let energy_recovered = action.act.data.energy_recovered;
                    memo = `Energy recovered: ${energy_recovered}, ${energy_recovered/5} FOOD used`;
                    log = {
                        tx_id: tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        account,
                        expenses: {food: energy_recovered / 5},
                        memo,
                        message,
                        // transaction
                    }                  
                }
                // crop claim
                if (action_name=="cropclaim") {
                    let energy = 0;
                    let crop_id = action.act.data.crop_id ? action.act.data.crop_id : '';
                    let produce = calcCropsProduct(action);
                    if (produce.barley>0 || produce.corn>0) {
                        memo = `Produced: `;
                        if (produce.barley>0) {memo += ` Barley: ${produce.barley}`;}
                        if (produce.corn>0) {memo += ` Corn: ${produce.corn}`;}
                    }
                    switch(asset_name) {
                        case "Barley Seed": energy = 30; break;
                        case "Corn Seed": energy = 45; break;
                    }
                    log = {
                        tx_id: tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        asset_name,
                        asset_id,
                        owner,
                        crop_id,
                        account,
                        output: {barley: produce.barley, corn: produce.corn},
                        expenses: {energy},
                        memo,
                        message,
                        // transaction
                    }                  
                }
                // mbs claim
                if (action_name=="mbsclaim") {
                    let asset_id = action.act.data.asset_id ? action.act.data.asset_id : '';
                    let coins = calcMintedCoins(action);
                    memo = `Membership reward: ${coins} FARMER COINS`;
                    log = {
                        tx_id: tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        asset_id,
                        asset_name,
                        account,
                        output: {fc: coins},
                        memo,
                        message,
                        // transaction
                    }                  
                }
                // building claim
                if (action_name=="bldclaim") {
                    let asset_id = action.act.data.asset_id ? action.act.data.asset_id : '';
                    let energy = opts && opts.expenses && opts.expenses.energy ? opts.expenses.energy : '';
                    log = {
                        tx_id: tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        asset_id,
                        asset_name,
                        account,
                        expenses: {energy},
                        memo,
                        message,
                        // transaction
                    }                  
                }                
                // market buy (barley seeds / barley ...)
                if (action_name=="mktbuy") {
                    owner = action.act.data.owner ? action.act.data.owner : '';
                    let quantity = action.act.data.quantity ? action.act.data.quantity : '';
                    let template_id = action.act.data.template_id ? action.act.data.template_id : '';
                    memo = `Purchased: ${quantity} ${template_id}`;
                    log = {
                        tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        asset_id,
                        asset_name,
                        account,
                        memo,
                        message,
                        // transaction
                    }                  
                }                
            } 
            if (contract=="farmerstoken") {                
                let account = action.act.account;
                let amemo = action.act.data.memo ? action.act.data.memo : '';
                // deposit tokens
                if (action_name == "transfers" && amemo == "deposit") {
                    let quantities = action.act.data.quantities;
                    owner = action.act.data.from ? action.act.data.from : '';
                    memo = "Deposit " + quantities.join();
                    log = {
                        tx_id: tx_id,
                        block_num,
                        time,
                        cpu,
                        action_name,
                        owner,
                        account,
                        memo,
                        message,
                        // transaction
                    }                    
                }
            }
            if (contract=="atomicassets") {
                // кормление животного
                if (action_name=="transfer") {
                    let amemo = action.act.data.memo ? action.act.data.memo : '';
                    if (amemo.startsWith("feed_animal")) {
                        owner = action.act.data.from ? action.act.data.from : '';
                        let asset_id = action.act.data.asset_ids ? action.act.data.asset_ids : '';
                        const animal_id = amemo.slice(12);
                        let produce = calcAnimalProduce(action);
                        // memo = `Animal ${animal_id} consumed ${asset_id} `;
                        if (produce.eggs>0 || produce.milk>0) memo += "Rewarded with ";
                        if (produce.eggs>0) memo += ` ${produce.eggs} eggs `;
                        if (produce.milk>0) memo += ` ${produce.milk} milk `;
                        log = {
                            tx_id: tx_id,
                            block_num,
                            time,
                            cpu,
                            action_name,
                            owner,
                            animal_id,
                            asset_id,
                            asset_name,
                            account,
                            output: {eggs: produce.eggs, milk: produce.milk},
                            expenses: {barley: 1},
                            memo,
                            message,
                            // transaction
                        }                           
                    }
                }
            }
        })

        this.$toast.success(owner + ". " + message + ". " + memo);

        // сохраним в логах

        if (log==null) {
            console.log("НЕ СМОГ разобрать транзакцию: " + JSON.stringify(transaction));
            log = {
                tx_id,
                block_num,
                time,
                cpu,
                message,
                asset_name,
                asset_id,
                // transaction,
            }

        }
        console.log("new log: " + JSON.stringify(log,null,2));
        // this.$store.dispatch("saveLog", log);
        // сохраним лог в базу данных
        this.fb_addActionLog(log);
        // пересчитаем доход фермы
        if (owner) {
            // this.$store.dispatch('updateFarmIncome', owner);
            this.$store.dispatch('updateFarm', owner);
        }
    },
    log_error(memo, message, account_name, asset_name='', asset_id='') {
        console.log("error message: " + JSON.stringify(memo) + " " + JSON.stringify(message));
        // const error_log = {
        //     name: account_name,
        //     memo: memo,
        //     asset_name, 
        //     asset_id,
        //     message: message,
        //     time: new Date(),
        // };
        this.$toast.error(account_name + ". " + memo + ". " + (message ? message : ''));
        // console.log("new error log: " + JSON.stringify(error_log));
    },
  },  
});

// посчитаем количесто полученных farmercoins в транзакции
function calcMintedCoins(action) {
    let traces = action.inline_traces;
    let num = 0;
    if (traces && traces!=null && traces.length>0) {
        traces.forEach(trace => {
            // farmer coin
            if (trace && trace.act && trace.act.data && trace.act.name == "mintasset" && traces.act.data.template_id == "260676") num++;
        })
    }
    return num;
}

// найдем транзакцию получения яйц и молока у животных
function calcAnimalProduce(action) {
    let traces = action.inline_traces;
    let eggs = 0;
    let milk = 0;
    if (traces && traces!=null && traces.length>0) {
        traces.forEach(trace => {
            if (trace && trace.act && trace.act.data) {
                // egg
                if (trace.act.name == "logclaimrs" && trace.act.data.reward_card == "298612") eggs+=trace.act.data.quantity;
                // milk
                if (trace.act.name == "logclaimrs" && trace.act.data.reward_card == "298593") milk+=trace.act.data.quantity;
            }
        })
    }
    return {eggs: eggs, milk: milk};
}

// Посчитаем количество барли и кукурузы если урожай состоялся
function calcCropsProduct(action) {
    let traces = action.inline_traces;
    let barley = 0;
    let corn = 0;
    if (traces && traces!=null && traces.length>0) {
        traces.forEach(trace => {
            if (trace && trace.act && trace.act.data) {
                if (trace.act.name == "logclaimrs" && trace.act.data.reward_card == "318606" && trace.act.data.quantity) barley+=trace.act.data.quantity;
                if (trace.act.name == "logclaimrs" && trace.act.data.reward_card == "318607" && trace.act.data.quantity) corn+=trace.act.data.quantity;
            }
        })
    }
    // console.log("! нашел результат урожая: " + barley + " corn: " + corn);
    return {barley: barley, corn: corn};    
}