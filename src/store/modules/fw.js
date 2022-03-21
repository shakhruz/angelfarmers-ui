import * as alcor from './alcor';
import * as data from './data';
import i18n from '@/i18n';
const { JsonRpc } = require('eosjs');

let endpoint_num = 0;
let endpoint = data.endpoints[endpoint_num];
if (localStorage.endpoint) {
    endpoint = localStorage.endpoint;
}

let rpc = new JsonRpc(endpoint);

function changeEndpoint(endpoint) {
    // endpoint_num = ++endpoint_num >= ends.length ? 0 : endpoint_num;
    // endpoint = ends[endpoint_num];
    // console.log("new endpoint: " + endpoint);
    // rpc = new JsonRpc(endpoint);
}

// Получим все данные по игре для аккаунта
export async function getGame(game, prices, atomic_assets, default_settings) {
    // let game = Object.assign({},oldGame);
    if (!game.settings) game.settings = Object.assign({}, default_settings);
    // console.log("getGame " + game.account_name);

    // Обновим курсы токенов
    game.prices = prices;

    // Обновим инфомацию о состоянии аккаунта - CPU, wax баланс
    let acc_info = await getAccountInfo(game.account_name);
    if (acc_info) game.account = acc_info;

    let awax_balance = await getAWAXBalance(game.account_name);
    game.awax_balance = awax_balance;
    
    // Баланс ресурсов в игре
    let balance_info = await getFWGameBalance(game.account_name);
    if (balance_info) game.balance = balance_info;
    if (game.balance) {
        game.balance.wood_wax = game.balance.wood * game.prices.fww;
        game.balance.gold_wax = game.balance.gold * game.prices.fwg;
        game.balance.food_wax = game.balance.food * game.prices.fwf;
        game.balance.total_wax = game.balance.wood_wax + game.balance.food_wax + game.balance.gold_wax;    
    }

    // Баланс токенов на счету игрока
    let tokens_info = await getFWTokens(game.account_name, atomic_assets);
    if (tokens_info) game.tokens = tokens_info;
    if (game.tokens) {
        game.tokens.fww_wax = game.tokens.fww * game.prices.fww;
        game.tokens.fwg_wax = game.tokens.fwg * game.prices.fwg;
        game.tokens.fwf_wax = game.tokens.fwf * game.prices.fwf;
        game.tokens.total_wax = game.tokens.fww_wax + game.tokens.fwg_wax + game.tokens.fwf_wax;    
    }

    // Сбросим дату следующего действия
    if (!game.next_claim_date) game.next_claim_date = null;
    game.ok = true;
    game.next_action_date = null;
    game.next_action = null;
    game.next_action_account = '';

    // Получим список мемберов
    let mbs_info = await getFWMbs(game.account_name);
    if (mbs_info) game.mbs = mbs_info; 
    if (game.mbs) game = calcFWMbs(game);
    
    // Получим список инструментов и просчитаем их расход и доход
    let tools_info = await getFWTools(game.account_name);
    if (tools_info) game.tools = tools_info;
    if (game.tools) game = calcFWTools(game);

    // Получим список зданий и просчитаем их себестоимость
    let buildings_info = await getFWBuildings(game.account_name);
    if (buildings_info) game.buildings = buildings_info;
    if (game.buildings) game = calcFWBuildings(game);

    // Получим список посеянных семян на плантациях
    let crops_info = await getFWCrops(game.account_name);
    if (crops_info) game.crops = crops_info; 
    if (game.crops) game = calcFWCrops(game);

    // Получим список животных на ферме
    let animals_info = await getFWAnimals(game.account_name);
    if (animals_info) game.animals = animals_info; 
    if (game.animals) game = calcFWAnimals(game, atomic_assets);

    // Получим список активов
    let assets_info = await getFWAssets(game.account_name);
    if (assets_info) game.assets = assets_info;
    if (game.assets) game = calcFWAssets(game, atomic_assets);

    game = calcTotals(game);                             
    return game;
} 

// Пересчитаем данные в игре с новыми курсами
export async function updateGame(game, prices, atomic_assets) {    
    // console.log("updateGame " + game.account_name);

    // Обновим курсы токенов
    game.prices = prices;

    if (!game.account) game.account = {wax_balance: 0}

    if (game.balance) {
        game.balance.wood_wax = game.balance.wood * game.prices.fww;
        game.balance.gold_wax = game.balance.gold * game.prices.fwg;
        game.balance.food_wax = game.balance.food * game.prices.fwf;
        game.balance.total_wax = game.balance.wood_wax + game.balance.food_wax + game.balance.gold_wax;    
    }

    if (game.tokens) {
        game.tokens.fww_wax = game.tokens.fww * game.prices.fww;
        game.tokens.fwg_wax = game.tokens.fwg * game.prices.fwg;
        game.tokens.fwf_wax = game.tokens.fwf * game.prices.fwf;
        game.tokens.total_wax = game.tokens.fww_wax + game.tokens.fwg_wax + game.tokens.fwf_wax;    
    }

    // Сбросим дату следующего действия
    if (!game.next_claim_date) game.next_claim_date = null;
    game.ok = true;
    game.next_action = null;
    game.next_action_date = null;    

    if (game.mbs) game = calcFWMbs(game);
    else game.mbs = {list:[], total_wax: 0}

    if (game.tools) game = calcFWTools(game);
    else game.tools = {list: [], total_wax: 0}

    if (game.buildings) game = calcFWBuildings(game);
    else game.buildings = {list: [], cost: 0}

    if (game.crops) game = calcFWCrops(game);
    else game.crops = {list: [], total_wax: 0}

    if (game.animals) game = calcFWAnimals(game, atomic_assets);
    else game.animals = {list:[], total_wax: 0}

    if (game.assets) game = calcFWAssets(game, atomic_assets);
    else game.assets = {list: [], total_wax:0}

    game = calcTotals(game);

    return game;
}

function calcTotals(game) {
    // Просчитаем общую стоимость всей фермы
    if (game.account) {
        game.total_wax = game.account.wax_balance;
        game.total_wax += game.account.wax_staked;
    } else game.total_wax = 0;
    if (game.balance) game.total_wax += game.balance.total_wax;
    if (game.tokens) game.total_wax += game.tokens.total_wax;
    if (game.tools) game.total_wax += game.tools.cost;
    if (game.assets) game.total_wax += game.assets.total_wax;
    if (game.buildings) game.total_wax += game.buildings.cost;
    if (game.animals) game.total_wax += game.animals.cost;

    // Просчитаем общий выход от фермы
    game.daily_output_gold = game.tools.hourly_output_gold * 24 +
                             game.crops.daily_output_gold + 
                             game.animals.daily_output_gold;
    game.daily_output_wood = game.tools.hourly_output_wood * 24;
    game.daily_output_food = game.tools.hourly_output_food * 24;
    
    // Просчитаем общий расход по ресурсам фермы
    game.daily_expense_gold = game.tools.daily_expense_gold + 
                              game.animals.daily_expense_gold;

    game.daily_expense_food = game.tools.daily_expense_food + 
                              game.crops.daily_expense_food + 
                              game.mbs.daily_expense_food;

    // чистая прибыль
    game.daily_profit_gold = game.daily_output_gold - game.daily_expense_gold;
    game.daily_profit_wood = game.daily_output_wood;
    game.daily_profit_food = game.daily_output_food - game.daily_expense_food;
                           
    // чистая прибыль в ваксах
    game.profit_wax = game.daily_profit_gold * game.prices.fwg + 
                      game.daily_profit_wood * game.prices.fww + 
                      game.daily_profit_food * game.prices.fwf;

                             
    game.last_updated = new Date();            
    game.managed = game.wax_login || (game.settings.private_key && game.settings.private_key.trim()!='') || (game.settings.delegated_account && game.settings.delegated_account.trim()!='');
    game.mins_to_action = game.next_action_date != null ? Math.round((game.next_action_date - new Date())/1000/60) : null;

    return game;
}

// Получим все курсы токенов
export async function getTokenPrices() {
    let prices = {};
    let fww = await alcor.getFWWprice();
    prices.fww = fww.last_price;
    prices.fww_change24 = fww.change24;
    prices.fww_volume24 = fww.volume24;

    let fwg = await alcor.getFWGprice();
    prices.fwg = fwg.last_price;
    prices.fwg_change24 = fwg.change24;
    prices.fwg_volume24 = fwg.volume24;

    let fwf = await alcor.getFWFprice();
    prices.fwf = fwf.last_price;
    prices.fwf_change24 = fwf.change24;
    prices.fwf_volume24 = fwf.volume24;

    prices.wax = await alcor.getWAXprice();
    return prices;
}

// Получим баланс аккаунта на WAX
export async function getAccountInfo(account_name) {
    // console.log("getAccountInfo " + account_name);
    let account = {};
    try {
        const result = await rpc.get_account(account_name);

        // console.log("!!! account: " + JSON.stringify(result));

        account.cpu_used = result["cpu_limit"]["used"];
        account.cpu_max = result["cpu_limit"]["max"];
        account.cpu_available = result["cpu_limit"]["available"];
        account.cpu_used_percent = account.cpu_used / account.cpu_max * 100;
        account.wax_balance = parseAsset(result["core_liquid_balance"]).number;
        if (result["total_resources"]) {
            account.wax_staked = parseAsset(result["total_resources"]["cpu_weight"]).number;
        } else {
            account.wax_staked = 0;
        }
        if (result["self_delegated_bandwidth"]) {
            account.wax_self_staked = parseAsset(result["self_delegated_bandwidth"]["cpu_weight"]).number;
        } else {
            account.wax_self_staked = 0;
        }
    } catch(e) {
        console.log("ОШИБКА при получении баланса аккаунта: " + e.message);
        changeEndpoint();
        return false;
    }

    return account;
}

// Получим баланс аккаунта на WAX
export async function getAWAXBalance(account_name) {
    let awax_balance = 0;
    try {
        const awax_info = await rpc.get_table_rows({
            json: true,               
            code: 'awaxdaotoken',     
            scope: account_name,    
            table: 'accounts',        
        }); 

        if (awax_info["rows"] && awax_info["rows"][0] && awax_info["rows"][0]["balance"]) {
            const res = parseAsset(awax_info["rows"][0]["balance"]);
            if (res && res.asset_id && res.asset_id == "AWAX") {
                awax_balance = res.number;
            }
        }

        // console.log("AWAX balance: " + awax_balance + " " + JSON.stringify(awax_info));

    } catch(e) {
        console.log("ОШИБКА при получении AWAX баланса аккаунта: " + e.message);
        changeEndpoint();
        return false;
    }

    return awax_balance;
}

// Получим баланс ресурсов в игре - Gold, Food, Wood, Energy
export async function getFWGameBalance(account) {
    // console.log("getFWGameBalance " + account);
    let fw_balance = {};
    try {

        const fw_account_info = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'accounts',        
            lower_bound: account,
            limit: 1,                
            reverse: false,           
            show_payer: false         
        }); 

        fw_balance.wood = 0;
        fw_balance.gold = 0;
        fw_balance.food = 0;

        fw_account_info["rows"][0]["balances"].forEach(item => {
            const res = parseAsset(item);

            if (res.asset_id === "WOOD") {
                fw_balance.wood = res.number;
            }
            if (res.asset_id === "GOLD") {
                fw_balance.gold = res.number;
            }
            if (res.asset_id === "FOOD") {
                fw_balance.food = res.number;
            }
        });

        fw_balance.energy = fw_account_info["rows"][0]["energy"];
        fw_balance.max_energy = fw_account_info["rows"][0]["max_energy"];
        return fw_balance;
    } catch(e) {
        console.log("ОШИБКА получения баланса игры: " + e.message);
        changeEndpoint();
        return false;
    }
}

// Получим баланс токенов игрока на счету
export async function getFWTokens(account) {
    // console.log("getFWTokens " + account);
    let tokens = {};
    try {
        const fw_tokens = await rpc.get_table_rows({
            json: true,               
            code: 'farmerstoken',     
            scope: account,    
            table: 'accounts',        
            reverse: false,           
            show_payer: false         
        });    

        tokens.fww = 0;
        tokens.fwg = 0;
        tokens.fwf = 0;

        fw_tokens["rows"].forEach(item => {
            const res = parseAsset(item["balance"]);

            if (res.asset_id === "FWW") {
                tokens.fww = res.number;
            }
            if (res.asset_id === "FWG") {
                tokens.fwg = res.number;
            }
            if (res.asset_id === "FWF") {
                tokens.fwf = res.number;
            }
        });
        return tokens;
    } catch (error) {
        console.log("ОШИБКА получения баланса токенов: " + error.message);
        changeEndpoint();
        return false;
    }
}

// Получим конфигурацию игры - процент вывода и время когда он изменился
export async function getFWConfig() {
    let game_config = {};
    try {
        const config = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'config',      
            limit: 1,                
            reverse: false,           
            show_payer: false         
        });
        if (config && config["rows"] && config["rows"][0]) {
            game_config.fee = config["rows"][0]["fee"];
            game_config.last_fee_updated = config["rows"][0]["last_fee_updated"];
        }                
        return game_config;
    } catch (error) {
        console.log("ОШИБКА получения конфигурации игры: " + error.message);
        changeEndpoint();
        return false;        
    }
}

// Получим список инструментов
export async function getFWTools(account) {
    let tools = {};
    try {
        const fw_tools = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'tools',    
            index_position: 2,
            key_type: "name",
            lower_bound: account,  
            upper_bound: account, 
            limit: 100,                
            reverse: false,           
            show_payer: false         
        });   

        tools.list = fw_tools["rows"];  
        return tools;    
    } catch (e) {
        console.log("ОШИБКА при получении списка инструментов: " + e.message);
        changeEndpoint();
        return false;
    }
}

// Просчитаем выход от инструментов и стоимость обслуживания
export function calcFWTools(game, t) {
    game.tools.cost = 0; // стоимость всех инструментов в ваксах
    
    // выход из фермы в ресурсах
    game.tools.hourly_output_wood = 0;
    game.tools.hourly_output_food = 0;
    game.tools.hourly_output_gold = 0;
    game.tools.hourly_output_wax = 0;

    // расходы на содержание всех инструментов в день
    game.tools.daily_expense_wax = 0;
    game.tools.daily_income_wax = 0;
    game.tools.daily_profit_wax = 0;
    game.tools.daily_expense_food = 0;
    game.tools.daily_expense_gold = 0;
    game.tools.daily_profit_food = 0;
    game.tools.daily_profit_gold = 0;

    // ближайшее следующее действие
    game.tools.next_action_date = null;

    // расход на энергию всех инструментов
    game.tools.daily_energy_expense = 0;

    // расход на золото всех инструментов
    game.tools.daily_gold_expense = 0;

    // собираем статистику по инструментам
    let tool_counter = 0;
    game.tools.list.forEach(async (tool) => {
        game.tools.list[tool_counter].id = tool_counter + 1;
        
        const tool_info = data.getToolsInfo(tool["template_id"]);
        game.tools.list[tool_counter].data = tool_info;
        game.tools.list[tool_counter].name = tool_info.name;

        // себестомиость инструментао по расходам на крафт
        const tool_cost = tool_info.gold * game.prices.fwg + tool_info.wood * game.prices.fww;
        game.tools.list[tool_counter].cost = tool_cost;
                
        // добавляем награду в ресурсах и ваксах
        game.tools.list[tool_counter].hourly_output_wax =  tool_info.hourly_reward_wood * game.prices.fww  + 
                                                    tool_info.hourly_reward_gold * game.prices.fwg  + 
                                                    tool_info.hourly_reward_food * game.prices.fwf;

        // добавляем расход в ваксах в час
        game.tools.list[tool_counter].hourly_expense_wax = tool_info.energy / 5 * game.prices.fwf + 
            tool_info.hourly_durability_cost * game.prices.fwg;
        game.tools.list[tool_counter].daily_profit = 24 * (game.tools.list[tool_counter].hourly_output_wax - game.tools.list[tool_counter].hourly_expense_wax)

        // добавим к счетчику по всем инструментам
        game.tools.hourly_output_gold += tool_info.hourly_reward_gold;
        game.tools.hourly_output_food += tool_info.hourly_reward_food;
        game.tools.hourly_output_wood += tool_info.hourly_reward_wood;
        game.tools.hourly_output_wax += game.tools.list[tool_counter].hourly_output_wax;       
        game.tools.cost += tool_cost;

        // Дата следующего сбора ресурсов
        let next_date = new Date(parseInt(tool["next_availability"]) * 1000);
        const now = new Date();
        
        // Количество минут до следующего сбора
        let claim_mins;
        if (game.settings.use_stored_mining) {
            let stored = 0;
            if (tool_info.type=="Wood") stored = game.mbs.wood_storage;
            if (tool_info.type=="Food") stored = game.mbs.food_storage;
            if (tool_info.type=="Good") stored = game.mbs.gold_storage;
            next_date = new Date(parseInt(tool["next_availability"]) * 1000 + stored * 60 * 60 * 1000);
        }
        claim_mins = Math.round((next_date - now)/1000/60);
        game.tools.list[tool_counter].claim_mins = claim_mins;
        game.tools.list[tool_counter].next_date = next_date;

        // Это ближайшее действие?
        if (game.tools.next_action_date==null || (game.tools.next_action_date!=null && next_date < game.tools.next_action_date)) {
            game.tools.next_action_date = next_date;
            game.tools.next_action = i18n.t("Claim with ") + i18n.t(tool_info["name"]);
        }

        if (game.next_action_date==null || (game.next_action_date!=null && next_date < game.next_action_date)) {
            game.next_action_date = next_date;
            game.next_action = i18n.t("Claim with ") + i18n.t(tool_info["name"]);
        }

        if (isNaN(game.next_claim_date) || game.next_claim_date==null || (game.next_claim_date!=null && next_date < game.next_claim_date)) {
            game.next_claim_date = next_date;
        }

        if (next_date<now) game.ok = false;

        // Общая статистика по всем инструментам

        // расход на энергию в сутки для всех инструментов
        game.tools.list[tool_counter].daily_expense_food = tool_info.energy / 5 * 24;
        game.tools.daily_expense_food += game.tools.list[tool_counter].daily_expense_food;

        // расход на золото в сутки для всех инструментов
        game.tools.list[tool_counter].daily_expense_gold = tool_info.durability * 0.2 * 24;
        game.tools.daily_expense_gold += game.tools.list[tool_counter].daily_expense_gold;
        
        // расходы на энергию (еду) и золото для починки
        const expense_wax = game.tools.list[tool_counter].daily_expense_gold * game.prices.fwg + 
                            game.tools.list[tool_counter].daily_expense_food * game.prices.fwf;
        game.tools.daily_expense_wax += expense_wax;
        
        // доход брутто в ваксах
        const income_wax = game.tools.list[tool_counter].hourly_output_wax * 24;
        game.tools.daily_income_wax += income_wax;
        
        // чистая прибыль в ваксах
        game.tools.list[tool_counter].daily_profit_wax = income_wax - expense_wax;
        game.tools.daily_profit_wax +=  income_wax - expense_wax;

        tool_counter ++;
    });

    game.tools.daily_profit_food += game.tools.hourly_output_food*24 - game.tools.daily_expense_food;
    game.tools.daily_profit_gold += game.tools.hourly_output_gold*24 - game.tools.daily_expense_gold;

    return game;
}

// Получим список зданий
export async function getFWBuildings(account) {
    try {
        let buildings = {};
        const list = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'buildings',    
            index_position: 2,
            key_type: "name",
            lower_bound: account,  
            upper_bound: account, 
            limit: 100,                
            reverse: false,           
            show_payer: false         
        }); 

        buildings.list = list["rows"];
        return buildings;
    } catch (e) {
        console.log("ОШИБКА получения списка зданий: " + e.message);
        changeEndpoint();
        return false;
    }
}

// Расчитаем стоимость зданий и время следующего действия (стройки)
export function calcFWBuildings(game) {
    game.buildings.cost = 0;
    game.buildings.next_action_date = null;
    let bld_counter = 0;
    
    // проверяем здания
    game.buildings.list.forEach(async (building) => {            
        var av_date = new Date(parseInt(building["next_availability"]) * 1000);
        const nowTime = new Date();
        var bld_cost = 0;

        switch(building["name"]) {
            case "Farm Plot":
                bld_cost = 120 * game.prices.fwg + 200 * game.prices.fww;
                break;
            case "Coop":
                bld_cost = 240 * game.prices.fwg + 400 * game.prices.fww;
                break;
            case "Cowshed":
                bld_cost = 360 * game.prices.fwg + 600 * game.prices.fww;
                break;

        }
        game.buildings.cost += bld_cost;
        game.buildings.list[bld_counter]["bld_cost"] = bld_cost;
        game.buildings.list[bld_counter]["id"] = bld_counter + 1;
        
        // расчитам параметры стройки
        let max = 8;
        if (building.template_id == "298590") max = 12;
        game.buildings.list[bld_counter]["max_claims"] = max;
                    
        const bld_info = data.getAssetInfo(building.template_id);
        game.buildings.list[bld_counter].construction_cost = bld_info["claim"]["energy"] * max;
        // если здание еще строится
        if (building["is_ready"]==0) {
            game.buildings.list[bld_counter]["claim_mins"] = Math.round((av_date - new Date())/1000/60);      
  
            if (game.buildings.next_action_date==null || ((game.buildings.next_action_date!=null && av_date<game.buildings.next_action_date))) {
                game.buildings.next_action_date = av_date;
            }

            if (game.next_action_date==null || ((game.next_action_date!=null && av_date<game.next_action_date))) {
                game.next_action_date = av_date;
                game.next_action = i18n.t("Build ") + i18n.t(building["name"]);
            }

            if (isNaN(game.next_claim_date) || game.next_claim_date==null || (game.next_claim_date!=null && av_date < game.next_claim_date)) {
                game.next_claim_date = av_date;
            }    

            if (av_date<new Date()) game.ok = false;
        }

        bld_counter ++;
    });
    return game;
}

// Получим список полей с семенами
export async function getFWCrops(account) {
    try {
        let crops = {};
        const fw_crops = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'crops',    
            index_position: 2,
            key_type: "name",
            lower_bound: account,  
            upper_bound: account, 
            limit: 100,                
            reverse: false,           
            show_payer: false         
        });

        crops.list = fw_crops["rows"];
        return crops;
    } catch (e) {
        console.log("ОШИБКА при получении списка полей: " + e.message); 
        changeEndpoint();
        return false;
    }
}

// Просчитаем расходы и выхлоп от плантации
export function calcFWCrops(game) {
    game.crops.balance = 0;
    game.crops.total_food_for_crops = 0;
    game.crops.hourly_feed = 0;
    game.next_crop_time = 0;
    game.crops.daily_output_gold = 0;
    game.crops.seed_cost_gold = 0;

    
    let crop_multiply = 7.5;
    let crop_counter = 0;

    game.crops.daily_expense_food = 0;

    // проверяем урожаи
    game.crops.list.forEach(async (crop) => {
        let crop_reward = 0;
        let feed_cost = 0;
        let seed_cost_gold = 0;

        let asset_info = (data.assets_info.filter( (f)=>f.template_id == crop["template_id"] ))[0];
        // console.log("crop_template: " + crop["template_id"] + " asset: " + JSON.stringify(asset_info));
        const cost = asset_info["wood"] * game.prices.fww + asset_info["gold"] * game.prices.fwg;
        game.crops.list[crop_counter].cost = cost;

        switch(crop["name"]) {
            case "Barley Seed":
                crop_reward = 40;
                feed_cost = 6;
                seed_cost_gold = 55;
                break;
            case "Corn Seed":
                crop_reward = 60;
                feed_cost = 9;
                seed_cost_gold = 82;
                break;
        }
        game.crops.list[crop_counter].crop_reward = crop_reward;
        game.crops.list[crop_counter].feed_cost = feed_cost;
        game.crops.list[crop_counter].seed_cost_gold = seed_cost_gold;
        game.crops.seed_cost_gold += seed_cost_gold;

        const crop_result = crop_reward * crop_multiply;
        game.crops.list[crop_counter].crop_result = crop_result;
        game.crops.balance += crop_result;

        const food_to_crop = (42 - crop["times_claimed"]) * feed_cost;
        game.crops.list[crop_counter].food_to_crop = food_to_crop;
        game.crops.list[crop_counter].id = crop_counter + 1;
        
        game.crops.total_food_for_crops += food_to_crop;        
        game.crops.hourly_feed += feed_cost / 4;
        const total_feed_cost_wax = feed_cost * 42 * game.prices.fwf;
        game.crops.list[crop_counter].total_feed_cost_wax = total_feed_cost_wax;
        game.crops.list[crop_counter].daily_cost = (((cost + total_feed_cost_wax) / 42) / 4) * 24;
        
        const crop_date = new Date(parseInt(crop["next_availability"]) * 1000);
        game.crops.list[crop_counter].crop_date = crop_date;
        if (isNaN(game.next_claim_date) || game.next_claim_date==null || (game.next_claim_date!=null && crop_date < game.next_claim_date)) {
            game.next_claim_date = crop_date;
        }

        const crop_mins = Math.round((crop_date - new Date())/1000/60);
        const time_to_crop = (41 - crop["times_claimed"]) * 240 + crop_mins;
        game.crops.list[crop_counter].crop_mins = crop_mins;
        game.crops.list[crop_counter].time_to_crop = time_to_crop;

        game.crops.list[crop_counter].total_hours_to_crop = 42 * 4;
        let days_to_crop = (42 * 4 / 24);
        game.crops.list[crop_counter].daily_profit = (crop_result * game.prices.fwg) / days_to_crop;
        game.crops.list[crop_counter].daily_output_gold = crop_result / days_to_crop;
        game.crops.daily_output_gold += game.crops.list[crop_counter].daily_output_gold;
        
        if (game.next_crop_time == 0 || time_to_crop < game.next_crop_time) {
            game.next_crop_time = time_to_crop;
        }

        if (game.next_action_date==null || ((game.next_action_date!=null && crop_date<game.next_action_date))) {
            game.next_action_date = crop_date;
            game.next_action = i18n.t("Claim ") + i18n.t(game.crops.list[crop_counter].name);
        }

        if (crop_date<new Date()) game.ok = false;

        crop_counter++;
    }); 
    game.crops.daily_expense_food += game.crops.hourly_feed * 24;
    game.crops.crop_balance_wax = game.crops.balance * game.prices.fwg;
    game.crops.total_food_for_crops_wax = game.crops.total_food_for_crops * game.prices.fwf;
    game.crops.food_needed = game.crops.total_food_for_crops - game.balance.food - game.balance.energy / 5;

    game.crops.daily_profit_wax = game.crops.daily_output_gold*game.prices.fwg - game.crops.daily_expense_food*game.prices.fwf;

    return game;
}

// Получим список животных
export async function getFWAnimals(account) {
    let animals = {};
    try {
        const result = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'animals',    
            index_position: 2,
            key_type: "name",
            lower_bound: account,  
            upper_bound: account, 
            limit: 100,                
            reverse: false,           
            show_payer: false         
        });   

        animals.list = result["rows"];
        return animals;
    } catch (e) {
        console.log("ОШИБКА получения списка животных: " + e.message);   
        changeEndpoint();
        return false;
    }
}

// Просчитаем выхлоп и расходы по животным
export function calcFWAnimals(game, atomic_assets) {
    let daily_expense_barley = 0;
    let daily_output_gold = 0;
    let total_animals_cost = 0;
    let chicken = [];
    let total_chicken_output_gold = 0;
    let total_chicken_expense_barley = 0;
    let total_chicken_expense_gold = 0;
    let total_chicken_output_eggs = 0;
    let eta_chicken = 0;

    if (game.animals && game.animals.list) {
        for(var c=0; c<game.animals.list.length; c++) {
            const animal = game.animals.list[c];

            // найдем цену на атомике
            let asset_price = 0;
            if (atomic_assets && atomic_assets.length>0) {
                const asset_info = atomic_assets.filter(f=>f.template_id == animal.template_id);
                if (asset_info && asset_info[0]) {
                    asset_price = asset_info[0].price;
                    // console.log("get asset price: " + asset_price + " template_id:" + animal.template_id + " " + JSON.stringify(asset_info) );
                }
            }

            game.animals.list[c]["id"] = c+1;
            var claim_date = new Date(parseInt(animal["next_availability"]) * 1000);
            const nowTime = new Date();    
    
            const asset_info = data.getAssetInfo(animal["template_id"]);
            switch(asset_info["template_id"]) {
                // chicken
                case "298614":
                    daily_expense_barley += 4;
                    game.animals.list[c].daily_expense_barley = 4;
                    game.animals.list[c].output_eggs = 5.5;
                    game.animals.list[c].output_gold = 5.5 * 280;
                    game.animals.list[c].days_to_crop = 7;  
                    game.animals.list[c].cost = asset_price ? asset_price : 300 * game.prices.fwg;
                    break;
                // dairy cow 
                case "298607":
                    daily_expense_barley += 6;
                    game.animals.list[c].daily_expense_barley = 6;
                    game.animals.list[c].output_gold = 3 * 140;
                    game.animals.list[c].days_to_crop = 1;        
                    game.animals.list[c].cost = asset_price ? asset_price : 1000 * game.prices.fwg;
                    break;
                default: 
                    daily_expense_barley += 0;
                    game.animals.list[c].daily_expense_barley = 0;
                    game.animals.list[c].output_gold = 0;
                    game.animals.list[c].days_to_crop = 1;        
                    game.animals.list[c].cost = asset_price ? asset_price : 0;
            }

            game.animals.list[c].daily_output_gold = game.animals.list[c].output_gold / game.animals.list[c].days_to_crop;
            daily_output_gold += game.animals.list[c].daily_output_gold;

            game.animals.list[c].max_claim = asset_info["max_claim"];
            const feed_mins = Math.round((claim_date - nowTime)/1000/60);
            game.animals.list[c]["feed_mins"] = feed_mins;
            game.animals.list[c]["claim_date"] = claim_date;
            game.animals.list[c].hours_to_crop = (1 - game.animals.list[c].times_claimed / game.animals.list[c].max_claim) * 
                                                  game.animals.list[c].days_to_crop * 24;
            game.animals.list[c].total_expense_gold = game.animals.list[c].max_claim * 55;                     
            game.animals.list[c].expense_barley = (game.animals.list[c].max_claim - game.animals.list[c].times_claimed);                     
            game.animals.list[c].expense_gold = game.animals.list[c].expense_barley * 55;                     
            game.animals.list[c].total_expense_wax = game.animals.list[c].total_expense_gold * game.prices.fwg;
            game.animals.list[c].profit = game.animals.list[c].output_gold * game.prices.fwg - game.animals.list[c].total_expense_wax;
    
            if (claim_date < nowTime) {
                // время кормить, проверим лимит
                if (animal["day_claims_at"].length < asset_info["daily_claim_limit"]) {
                    // кормили меньше лимита, можно покормить сейчас
                } else {
                    // уже кормили по лимиту, ищем самое давнее кормление
                    var longest_feed_pause = 0;
                    animal["day_claims_at"].forEach(day => {
                        const day_claimed = new Date(parseInt(day) * 1000);
                        const feed_pause = (nowTime - day_claimed)/1000/60;
                        // this.mylog("кормили " + this.formatDate( day_claimed ) + " " + this.minsFormatted(feed_pause)  + " назад");
                        if (feed_pause > longest_feed_pause) longest_feed_pause = feed_pause;
                    })                        
                    const next_feed_time_mins = 24*60 - longest_feed_pause;
                    game.animals.list[c]["feed_mins"] = next_feed_time_mins;
                    // this.mylog("следующее кормление возможно через: " + this.minsFormatted(next_feed_time_mins));
                    claim_date = new Date(nowTime.getTime() + next_feed_time_mins*60*1000);
                    // this.mylog("следующее кормление: " + this.formatDate(claim_date));
                    game.animals.list[c]["claim_date"] = claim_date;
                }
            } 

            total_animals_cost += game.animals.list[c].cost;

            if (asset_info["template_id"] == "298614") {
                // chicken
                chicken.push(game.animals.list[c]);
                total_chicken_expense_barley += game.animals.list[c].expense_barley
                total_chicken_expense_gold += game.animals.list[c].expense_gold
                total_chicken_output_gold += game.animals.list[c].output_gold  
                total_chicken_output_eggs += game.animals.list[c].output_eggs
                if ((eta_chicken == 0) || (eta_chicken > game.animals.list[c].hours_to_crop)) 
                    eta_chicken = game.animals.list[c].hours_to_crop;
            }
    
            if (isNaN(game.next_claim_date) || game.next_claim_date==null || (game.next_claim_date!=null && claim_date < game.next_claim_date)) {
                game.next_claim_date = claim_date;
            }    

            if (game.next_action_date==null || ((game.next_action_date!=null && claim_date<game.next_action_date))) {
                game.next_action_date = claim_date;
                game.next_action = i18n.t("Feed ") + i18n.t(animal.name);
            }
    
            if (claim_date<new Date()) game.ok = false;
    
        }        
    }
    game.animals.daily_expense_barley = daily_expense_barley;
    game.animals.daily_expense_gold = daily_expense_barley * 55;
    game.animals.daily_output_gold = daily_output_gold;
    game.animals.cost = total_animals_cost;

    game.animals.total_chicken_expense_barley = total_chicken_expense_barley;
    game.animals.total_chicken_expense_gold = total_chicken_expense_gold;
    game.animals.total_chicken_output_gold = total_chicken_output_gold;
    game.animals.total_chicken_output_eggs = total_chicken_output_eggs;
    game.animals.eta_chicken = eta_chicken;

    return game;
}

// Получим список мемберов
export async function getFWMbs(account) {
    let members = {};
    try {
        const result = await rpc.get_table_rows({
            json: true,               
            code: 'farmersworld',     
            scope: 'farmersworld',    
            table: 'mbs',    
            index_position: 2,
            key_type: "name",
            lower_bound: account,  
            upper_bound: account, 
            limit: 100,                
            reverse: false,           
            show_payer: false         
        }); 

        members.list = result["rows"];
        return members;
    } catch (error) {
        console.log("ОШИБКА при получении списка мемберов: " + error.message);
        changeEndpoint();
        return false;
    }
}

// Просчитаем список мемберов
export function calcFWMbs(game) {
    game.mbs.daily_expense_food = 0;
    game.mbs.food_storage = 0;
    game.mbs.wood_storage = 0;
    game.mbs.gold_storage = 0;

    if (game.mbs && game.mbs.list) {
        for(var c=0; c<game.mbs.list.length; c++) {
            game.mbs.list[c]["id"] = "m" + (c + 1).toString();
            const asset_info = data.getAssetInfo(game.mbs.list[c]["template_id"]);
            if (asset_info) {
                game.mbs.list[c]["name"] = asset_info.name;
    
                var claim_date = new Date(parseInt(game.mbs.list[c]["next_availability"]) * 1000);
                var unstaking_time = new Date(parseInt(game.mbs.list[c]["unstaking_time"]) * 1000);
                const nowTime = new Date();
        
                game.mbs.list[c].claim_mins = Math.round((claim_date - nowTime)/1000/60);
                game.mbs.list[c].unstaking_mins = Math.round((unstaking_time - nowTime)/1000/60);
                game.mbs.list[c].daily_expense_food = 100/5;

                switch(asset_info.type) {
                    case "Wood": 
                        // bronze
                        if (asset_info.template_id == "260628") game.mbs.wood_storage += 1;
                        // silver
                        if (asset_info.template_id == "260629") game.mbs.wood_storage += 2;
                        // gold
                        if (asset_info.template_id == "260631") game.mbs.wood_storage += 4;                        
                        break;
                    case "Food":
                        // bronze
                        if (asset_info.template_id == "260636") game.mbs.food_storage += 1;
                        // silver
                        if (asset_info.template_id == "260638") game.mbs.food_storage += 2;
                        // gold
                        if (asset_info.template_id == "260639") game.mbs.food_storage += 4;                        
                        break;
                    case "Gold":
                        // bronze
                        if (asset_info.template_id == "260642") game.mbs.gold_storage += 1;
                        // silver
                        if (asset_info.template_id == "260644") game.mbs.gold_storage += 2;
                        // gold
                        if (asset_info.template_id == "260647") game.mbs.gold_storage += 4;                        
                        break;
                }
        
                if (isNaN(game.next_claim_date) || !game.next_claim_date || game.next_claim_date==null || (game.next_claim_date!=null && claim_date < game.next_claim_date)) {
                    game.next_claim_date = claim_date;
                }    

                if (game.next_action_date==null || ((game.next_action_date!=null && claim_date<game.next_action_date))) {
                    game.next_action_date = claim_date;
                    game.next_action = i18n.t("Claim membership") + i18n.t(asset_info.name);
                }
        
                if (claim_date<new Date()) game.ok = false;    
    
                game.mbs.daily_expense_food += game.mbs.list[c].daily_expense_food;    
            } else {
                console.log("Не смог найти актив: " + game.mbs.list[c]["template_id"]);
            }
        }    
    }
    return game;
}

// Получим список активов в сундуке
export async function getFWAssets(account) {    
    let assets = {};
    try {
        const result = await rpc.get_table_rows({
            json: true,               
            code: 'atomicassets',     
            scope: account,    
            table: 'assets',      
            limit: 1000,                
            reverse: false,           
            show_payer: false         
        });

        var list = [];
        result["rows"].forEach(asset => {
            if (asset["collection_name"]=="farmersworld") {
                list.push(asset);
            }
        })

        assets.list = list;
        return assets;
    } catch (error) {
        console.log("ОШИБКА при получении списка активов: " + error.message);
        changeEndpoint();
        return false;
    }
}

// Сожмем список всех активов в спсок уникальных
export function calcFWAssets(game, atomic_assets) {
    let assets_cost = 0;
    let unique_assets = [];
    let c = 0;

    game.assets.list.forEach(asset => {
        const asset_info = data.getAssetInfo(asset["template_id"]);
        
        // рассчитаем себестоимость
        let cost = 0;
        if (asset_info["cost"]["gold"] && game.prices) cost += asset_info["cost"]["gold"] * game.prices.fwg;
        if (asset_info["cost"]["wood"] && game.prices) cost += asset_info["cost"]["wood"] * game.prices.fww;
        if (asset_info["cost"]["food"] && game.prices) cost += asset_info["cost"]["food"] * game.prices.fwf;
        if (asset_info["cost"]["fc"] && game.prices && game.prices.fc) cost += asset_info["cost"]["fc"] * game.prices.fc;        

        // const asset_cost = asset_info.gold * game.prices.fwg + asset_info.wood * game.prices.fww;

        // найдем цену на атомике
        let asset_price = 0;
        if (atomic_assets && atomic_assets.length>0) {
            const asset_info = atomic_assets.filter(f=>f.template_id == asset.template_id);
            if (asset_info && asset_info[0]) {
                asset_price = asset_info[0].price;
            }
        }
        
        assets_cost += cost;

        // ищем актив среди уникальных
        var found = false;
        for(var i=0; i<unique_assets.length; i++) {
            if (unique_assets[i]["template_id"]==asset["template_id"]) {
                unique_assets[i]["counter"]++;
                found = true;
                break;
            }
        }
        if (!found) {
            asset["counter"] = 1;
            asset["id"] = c+1;
            asset["name"] = asset_info.name;
            asset["cost"] = cost;
            asset["price"] = asset_price;
            c++
            unique_assets.push(asset);
        }
    })
    
    game.assets.unique = unique_assets;
    game.assets.total_wax = assets_cost;
    return game;
}

// Получим список активов на продажу
// export async function updateAssetsOnSale(account, state = 2) {    
//     try {
//         const assets_on_sale = await this.getAssetsOnSale(account, state);
//         return assets_on_sale; 
//     } catch (error) {
//         console.log("ОШИБКА при получении списка активов на продажу: " + error.message);
//         return false;
//     }
// }    

export async function get_buyorders(market_id) {
    try {
        const result = await rpc.get_table_rows({
            json: true,               
            code: 'alcordexmain',     
            scope: market_id,    
            table: 'buyorder',      
            limit: 1000,                
            key_type: 'i128',           
            index_position: 2         
        });          
        return result;
    } catch (error) {
        console.log("ОШИБКА чтения get_buyorders: " + error.message);
        changeEndpoint();
        return false;
    }
}

export async function get_sellorders(market_id) {
    try {
        const result = await rpc.get_table_rows({
            json: true,               
            code: 'alcordexmain',     
            scope: market_id,    
            table: 'sellorder',      
            limit: 1000,                
            key_type: 'i128',           
            index_position: 2         
        });
        return result;      
    } catch (error) {
        console.log("ОШИБКА чтения get_sellorders: " + error.message);
        changeEndpoint();
        return false;
    }
}

import {AtomicMarketApi} from "atomicmarket"
const atomic_api = new AtomicMarketApi("https://wax.api.atomicassets.io", "atomicmarket", {fetch});

export async function get_assets_on_sale(account_name) {
    console.log("get_assets_on_sale for " + account_name);
    try {
        // get by sale_id
        // const result = await rpc.get_table_rows({
        //     json: true,               
        //     code: 'atomicmarket',     
        //     scope: 'atomicmarket',    
        //     // scope: account_name,
        //     table: 'sales',      
        //     limit: 100,                
        //     index_position: 1,
        //     // key_type: "sales_s",
        //     key_type: "i64",
        //     // key_type: 'i128',
        //     lower_bound: 7,  
        //     upper_bound: 7,             
        //     reverse: false,           
        //     show_payer: false             
        // });

        // const result = await rpc.get_table_rows({
        //     json: true,               
        //     code: 'atomicassets',     
        //     scope: 'atomicassets',    
        //     table: 'offers',      
        //     limit: 100,                
        //     index_position: 1,
        //     // key_type: "sales_s",
        //     key_type: "i64",
        //     // key_type: 'i128',
        //     lower_bound: 7,  
        //     upper_bound: 7,             
        //     reverse: false,           
        //     show_payer: false             
        // });        

        // 1099634934667

        let sale = await atomic_api.getSales({seller: 'ehcza.wam', state: '0: WAITING'});
        console.log("!!! sale: " + JSON.stringify(sale));

        const result = await rpc.get_table_rows({
            json: true,               
            code: 'atomicmarket',     
            scope: 'atomicmarket',    
            table: 'sales',      
            limit: 1,                
            index_position: 0,
            key_type: "name",
            lower_bound: account_name,  
            upper_bound: account_name,             
            reverse: false,           
            show_payer: false             
        });        

        return result;      
    } catch (error) {
        console.log("ОШИБКА чтения get_assets_on_sale: " + error.message);
        changeEndpoint();
        return false;
    }
}

export function parseAsset(asset_string) {
    try {
        const items = asset_string.split(' ');
        const num = parseFloat(items[0]);
        const asset_id = items[1];
        return {number: num, asset_id: asset_id};            
    } catch (error) {
        return {number: 0, asset_id: ''};
    }
}