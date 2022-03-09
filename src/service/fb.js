const {db, fb_updateFarmState} = require('@/db');
const actions_db = db.collection('actions');
// const farm_state_db = db.collection('farm_state');
const donations_db = db.collection('donations');

import Vue from "vue";

Vue.mixin({
  methods: {    
    fb_db() {
        return db;
    },
    // Добавить запись с действием ангела по ферме
    async fb_addActionLog(log) {
        try {  
            let result = await actions_db.add(log);
            if (result) {
                console.log("+ Добавил action log: " + log.tx_id);
                this.$store.dispatch('updateFarmIncomeFromLog', log);
                return true;
            } else {
                console.log("- Не смог добавить action log: " + JSON.stringify(log));
            }
            return true;
        } catch (error) {
            console.log("ОШИБКА: Не смог добавить action log. ОШИБКА: " + error);
            return false;    
        }     
    },

    // сохраним состояние всех ферм в базу данных
    async fb_updateAllFarmsState() {
        // console.log("Обновим состояния ферм в базе")
        for(let i=0; i<this.$store.state.farms.length; i++) {
            const farm = this.$store.state.farms[i];
            // проверяем, управляем ли мы этой фермой. только для таких храним логи (чтобы избежать дубликатов)
            if (farm.wax_login || farm.settings.private_key.trim()!='' || farm.settings.delegated_account.trim()!='') {
                let angel_balance = this.calcAngelBalance(farm);
                let state = {
                    last_update: new Date(),
                    account_name: farm.account_name,
                    mins_to_action: farm.mins_to_action,
                    cpu_used: farm.account.cpu_used_percent,
                    food: (farm.tokens.fwf + farm.balance.food + farm.balance.energy / 5) / 
                            (farm.daily_expense_food / 24 / 60),
                    total_wax: farm.total_wax,
                    total_usd: farm.total_wax*farm.prices.wax,
                    income: farm.income ? farm.income : {},
                    profit_wax: farm.profit_wax,
                    profit_usd: farm.profit_wax * farm.prices.wax,
                    balance_wax: angel_balance.balance_wax,
                    total_income_wax: angel_balance.total_wax,
                    donate: angel_balance.donate,
                    awax_balance: farm.awax_balance,
                }
                await fb_updateFarmState(state);
            }
        }
    },

    // Добавить запись по состоянию фермы
    // async fb_updateFarmState(farmState) {
    //     // console.log("+ update farm state in fb " + farmState.account_name);
    //     try {  
    //         await farm_state_db.doc(farmState.account_name).set(farmState);
    //         // console.log("+ успешно обновил статус фермы " + farmState.account_name);
    //         return true;
    //     } catch (error) {
    //         console.log("ОШИБКА: Не смог добавить state. ОШИБКА: " + error);
    //         return false;    
    //     }     
    // },    

    // Добавить платеж
    async fb_addDonation(account_name, amount) {
        try {  
            let result = await donations_db.add({account_name, amount, date: new Date()});
            if (result) {
                console.log("+ Добавил donation ");
                return true;
            } else {
                console.log("- Не смог добавить donation ");
            }
            return true;
        } catch (error) {
            console.log("ОШИБКА: Не смог добавить donation. ОШИБКА: " + error);
            return false;    
        }     
    },    

  } 
});