export const tools_info = [
    {'name': "Ancient Stone Axe", 'template_id': "378691", 'type': "Wood", 'reward': 0.35, 'hourly_reward_wood':0.35, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 2, 'durability': 0.5, 'gold': 20, 'wood': 110, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 0.1},
    {'name': "Stone Axe", 'template_id': "260763", 'type': "Wood", 'reward': 1.7, 'hourly_reward_wood':1.7, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 5, 'durability': 3, 'gold': 135, 'wood': 800, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 0.6},
    {'name': "Axe", 'template_id': "203881", 'type': "Wood", 'reward': 5, 'hourly_reward_wood':5, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 10, 'durability': 5, 'gold': 400, 'wood': 2400, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 1},
    {'name': "Saw", 'template_id': "203883", 'type': "Wood", 'reward': 17, 'hourly_reward_wood':17, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 30, 'durability': 15, 'gold': 1200, 'wood': 7200, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 3},
    {'name': "Chainsaw", 'template_id': "203886", 'type': "Wood", 'reward': 54, 'hourly_reward_wood':54, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 60, 'durability': 45, 'gold': 3600, 'wood': 21600, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 9},

    {'name': "Fishing Rod", 'template_id': "203887", 'type': "Food", 'reward': 5, 'hourly_reward_wood':0, 'hourly_reward_gold':0, 'hourly_reward_food':5, 'energy': 0, 'durability': 5, 'gold': 200, 'wood': 1200, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 1},
    {'name': "Fishing Net", 'template_id': "203888", 'type': "Food", 'reward': 20, 'hourly_reward_wood':0, 'hourly_reward_gold':0, 'hourly_reward_food':20, 'energy': 0, 'durability': 20, 'gold': 800, 'wood': 4800, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 4},
    {'name': "Boat", 'template_id': "203889", 'type': "Food", 'reward': 80, 'hourly_reward_wood':0, 'hourly_reward_gold':0, 'hourly_reward_food':80, 'energy': 0, 'durability': 32, 'gold': 3200, 'wood': 19200, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 6.4},

    {'name': "Mining Excavator", 'template_id': "203891", 'type': "Gold", 'reward': 50, 'hourly_reward_wood':0, 'hourly_reward_gold':50, 'hourly_reward_food':0, 'energy': 66.5, 'durability': 2.5, 'gold': 4000, 'wood': 24000, 'counter': 0, 'schema_name': 'tools', 'hourly_durability_cost': 1},
];

export const assets_info = [
    {'name': "Barley", 'template_id': "318606", 'gold': 40, 'wood': 0, 'schema_name': 'foods', cost: {gold: 41, wood:0, food: 0, fc: 0}, exchange: true},
    {'name': "Corn", 'template_id': "318607", 'gold': 60, 'wood': 0, 'schema_name': 'foods', cost: {gold: 61, wood:0, food: 0, fc: 0}, exchange: true},

    {'name': "Barley Seed", 'template_id': "298595", 'gold': 40, 'wood': 0, 'schema_name': 'plants', cost: {gold: 51, wood:0, food: 0, fc: 0}, exchange: false},
    {'name': "Corn Seed", 'template_id': "298596", 'gold': 60, 'wood': 0, 'schema_name': 'plants', cost: {gold: 76, wood:0, food: 0, fc: 0}, exchange: false},

    {'name': 'Milk', 'template_id': "298593", 'gold': 140, 'wood': 0, 'schema_name': 'foods', cost: {gold: 141, wood:0, food: 0, fc: 0}, exchange: true},

    {'name': "Ancient Stone Axe", 'template_id': "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools', cost: {gold: 41, wood:110, food: 0, fc: 0}, energy: 4, repair: 1, exchange: false },
    {'name': "Stone Axe", 'template_id': "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools', cost: {gold: 135, wood:800, food: 0, fc: 0}, energy: 5, repair: 3, exchange: false },
    {'name': "Axe", 'template_id': "203881", 'gold': 400, 'wood': 2400, 'schema_name': 'tools', cost: {gold: 400, wood:2400, food: 0, fc: 0}, energy: 10, repair: 5, exchange: false},
    {'name': "Saw", 'template_id': "203883", 'gold': 1200, 'wood': 7200, 'schema_name': 'tools', cost: {gold: 1200, wood:7200, food: 0, fc: 0}, energy: 30, repair: 15, exchange: false},
    {'name': "Chainsaw", 'template_id': "203886", 'gold': 3600, 'wood': 21600, 'schema_name': 'tools', cost: {gold: 3600, wood:21600, food: 0, fc: 0}, energy: 60, repair: 45, exchange: false},

    {'name': "Fishing Rod", 'template_id': "203887", 'gold': 200, 'wood': 1200, 'schema_name': 'tools', cost: {gold: 200, wood:1200, food: 0, fc: 0}, energy: 0, repair: 5, exchange: false},
    {'name': "Fishing Net", 'template_id': "203888", 'gold': 800, 'wood': 4800, 'schema_name': 'tools', cost: {gold: 800, wood:4800, food: 0, fc: 0}, energy: 0, repair: 20, exchange: false},
    {'name': "Boat", 'template_id': "203889", 'gold': 3200, 'wood': 19200, 'schema_name': 'tools', cost: {gold: 3200, wood:19200, food: 0, fc: 0}, energy: 0, repair: 32, exchange: false},

    {'name': "Mining Excavator", 'template_id': "203891", 'gold': 4000, 'wood': 24000, 'schema_name': 'tools', cost: {gold: 4000, wood:24000, food: 0, fc: 0}, energy: 133, repair: 5, exchange: false},

    {'name': 'Farm Plot', 'template_id': "298592", 'gold': 120, 'wood': 200, 'schema_name': 'farmbuilding', 'building': true, 'cost': {'gold': 120, 'wood': 200, 'food': 0, 'fc': 0}, 'claim': {'energy': 200}, exchange: false},
    {'name': 'Coop', 'template_id': "298591", 'gold': 240, 'wood': 400, 'schema_name': 'farmbuilding', 'building': true, cost: {gold: 240, wood:400, food: 0, fc: 0}, 'claim': {'energy': 250}, exchange: false},
    {'name': 'Cowshed', 'template_id': "298590", 'gold': 360, 'wood': 600, 'schema_name': 'farmbuilding', 'building': true, cost: {gold: 360, wood:600, food: 0, fc: 0}, 'claim': {'energy': 300}, exchange: false},

    {'name': 'Chicken Egg', 'template_id': "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals', cost: {gold: 281, wood:0, food: 0, fc: 0}, exchange: true},
    {'name': 'Chick', 'template_id': "298613", 'gold': 0, 'wood': 0, 'max_claim': 16, 'daily_claim_limit': 4, 'schema_name':'farmanimals', cost: {gold: 281, wood:0, food: 9, fc: 0}, exchange: false},
    {'name': 'Chicken', 'template_id': "298614", 'gold': 0, 'wood': 0, 'max_claim': 28, 'daily_claim_limit': 4, 'schema_name':'farmanimals', cost: {gold: 937, wood:0, food: 9, fc: 0}, exchange: false},

    {'name': 'Baby Calf', 'template_id': "298597", 'gold': 0, 'wood': 0, 'max_claim': 6, 'daily_claim_limit': 2, 'schema_name':'farmanimals', cost: {gold: 1001, wood:0, food: 0, fc: 0}, exchange: false},
    {'name': 'Female Calf', 'template_id': "298599", 'gold': 0, 'wood': 0, 'max_claim': 16, 'daily_claim_limit': 4, 'schema_name':'farmanimals', cost: {gold: 1847, wood:0, food: 0, fc: 0}, exchange: false},
    {'name': 'Male Calf', 'template_id': "298600", 'gold': 0, 'wood': 0, 'max_claim': 16, 'daily_claim_limit': 4, 'schema_name':'farmanimals', cost: {gold: 1847, wood:0, food: 0, fc: 0}, exchange: false},
    {'name': 'Dairy Cow', 'template_id': "298607", 'gold': 0, 'wood': 0, 'max_claim': 6, 'daily_claim_limit': 6, 'schema_name':'farmanimals', cost: {gold: 2503, wood:0, food: 0, fc: 0}, exchange: false},
    {'name': 'Bull', 'template_id': "298611", 'gold': 0, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals', cost: {gold: 2503, wood:0, food: 0, fc: 0}, exchange: false},
    
    {'name': 'Farmers Coin', 'template_id': "260676", 'gold': 0, 'wood': 0, 'schema_name':'farmercoins', cost: {gold: 0, wood:0, food: 0, fc: 1}, exchange: false},

    {'name': 'Food Membership Bronze', 'template_id': "260636", 'gold': 400, 'wood': 0, 'schema_name':'memberships', cost: {gold: 400, wood:0, food: 0, fc: 60}, exchange: false, type: "Food"},
    {'name': 'Food Membership Silver', 'template_id': "260638", 'gold': 800, 'wood': 0, 'schema_name':'memberships', cost: {gold: 800, wood:0, food: 0, fc: 120}, exchange: false, type: "Food"},
    {'name': 'Food Membership Gold', 'template_id': "260639", 'gold': 1600, 'wood': 0, 'schema_name':'memberships', cost: {gold: 1600, wood:0, food: 0, fc: 240}, exchange: false, type: "Food"},

    {'name': 'Wood Membership Bronze', 'template_id': "260628", 'gold': 400, 'wood': 0, 'schema_name':'memberships', cost: {gold: 400, wood:0, food: 0, fc: 60}, exchange: false, type: "Wood"},
    {'name': 'Wood Membership Silver', 'template_id': "260629", 'gold': 800, 'wood': 0, 'schema_name':'memberships', cost: {gold: 800, wood:0, food: 0, fc: 120}, exchange: false, type: "Wood"},
    {'name': 'Wood Membership Gold', 'template_id': "260631", 'gold': 1600, 'wood': 0, 'schema_name':'memberships', cost: {gold: 1600, wood:0, food: 0, fc: 240}, exchange: false, type: "Wood"},

    {'name': 'Gold Membership Bronze', 'template_id': "260642", 'gold': 400, 'wood': 0, 'schema_name':'memberships', cost: {gold: 400, wood:0, food: 0, fc: 60}, exchange: false, type: "Gold"},
    {'name': 'Gold Membership Silver', 'template_id': "260644", 'gold': 800, 'wood': 0, 'schema_name':'memberships', cost: {gold: 800, wood:0, food: 0, fc: 120}, exchange: false, type: "Gold"},
    {'name': 'Gold Membership Gold', 'template_id': "260647", 'gold': 1600, 'wood': 0, 'schema_name':'memberships', cost: {gold: 1600, wood:0, food: 0, fc: 240}, exchange: false, type: "Gold"},

];

export const market_assets = [
    {text: "Barley", value: "318606", 'gold': 55, 'wood': 0, 'schema_name': 'foods', num: 1},
    {text: "Corn", value: "318607", 'gold': 82, 'wood': 0, 'schema_name': 'foods', num: 1},
    {text: "Barley Seed", value: "298595", 'gold': 50, 'wood': 0, 'schema_name': 'plants', num: 1},
    {text: "Corn Seed", value: "298596", 'gold': 75, 'wood': 0, 'schema_name': 'plants', num: 1},

    {text: 'Egg', value: "298612", 'gold': 300, 'wood': 0, 'schema_name':'farmanimals', num: 1},
    {text: 'Baby Calf', value: "298597", 'gold': 1000, 'wood': 0, 'schema_name':'farmanimals', num: 1},
];

export const craft_assets = [
    {text: "Ancient Stone Axe", value: "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools', 'reward': 0.35, 'hourly_reward_wood':0.35, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 2, 'durability': 0.5},
    {text: "Stone Axe", value: "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools', 'reward': 1.7, 'hourly_reward_wood':1.7, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 5},    
    {text: "Axe", value: "203881", 'gold': 400, 'wood': 2400, 'schema_name': 'tools','reward': 5, 'hourly_reward_wood':5, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 10, 'durability': 5},
    {text: "Saw", value: "203883", 'gold': 1200, 'wood': 7200, 'schema_name': 'tools', 'reward': 17, 'hourly_reward_wood':17, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 30, 'durability': 15},
    {text: "Chainsaw", value: "203886", 'gold': 3600, 'wood': 21600, 'schema_name': 'tools', 'reward': 54, 'hourly_reward_wood':54, 'hourly_reward_gold':0, 'hourly_reward_food':0, 'energy': 60, 'durability': 45},

    {text: "Fishing Rod", value: "203887", 'gold': 200, 'wood': 1200, 'schema_name': 'tools', 'reward': 5, 'hourly_reward_wood':0, 'hourly_reward_gold':0, 'hourly_reward_food':5, 'energy': 0, 'durability': 5},
    {text: "Fishing Net", value: "203888", 'gold': 800, 'wood': 4800, 'schema_name': 'tools', 'reward': 20, 'hourly_reward_wood':0, 'hourly_reward_gold':0, 'hourly_reward_food':20, 'energy': 0, 'durability': 20},
    {text: "Boat", value: "203889", 'gold': 3200, 'wood': 19200, 'schema_name': 'tools', 'reward': 80, 'hourly_reward_wood':0, 'hourly_reward_gold':0, 'hourly_reward_food':80, 'energy': 0, 'durability': 32},    
    {text: "Mining Excavator", value: "203891", 'gold': 4000, 'wood': 24000, 'schema_name': 'tools', 'reward': 50, 'hourly_reward_wood':0, 'hourly_reward_gold':50, 'hourly_reward_food':0, 'energy': 66.5, 'durability': 2.5},

    {text: 'Farm Plot', value: "298592", 'gold': 120, 'wood': 200, 'schema_name': 'farmbuilding'},
    {text: 'Coop', value: "298591", 'gold': 240, 'wood': 400, 'schema_name': 'farmbuilding'},
    {text: 'Cowshed', value: "298590", 'gold': 360, 'wood': 600, 'schema_name': 'farmbuilding'},
];
    
export const items_to_sell = [
    {text: "Barley", value: "318606", 'gold': 40, 'wood': 0, 'schema_name': 'foods'},
    {text: "Corn", value: "318607", 'gold': 60, 'wood': 0, 'schema_name': 'foods'},
    {text: "Barley Seed", value: "298595", 'gold': 40, 'wood': 0, 'schema_name': 'plants'},
    {text: "Corn Seed", value: "298596", 'gold': 60, 'wood': 0, 'schema_name': 'plants'},
    {text: 'Milk', value: "298593", 'gold': 140, 'wood': 0, 'schema_name': 'foods'},
    {text: "Ancient Stone Axe", value: "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools'},
    {text: "Stone Axe", value: "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools'},    
    {text: 'Chicken Egg', value: "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'},
    {text: 'Farmers Coin', value: "260676", 'gold': 0, 'wood': 0, 'schema_name':'farmercoins'}
];

export const items_to_exchange = [
    {text: "Barley", value: "318606", 'gold': 40, 'wood': 0, 'schema_name': 'foods'},
    {text: "Corn", value: "318607", 'gold': 60, 'wood': 0, 'schema_name': 'foods'},
    {text: 'Milk', value: "298593", 'gold': 140, 'wood': 0, 'schema_name': 'foods'},
    {text: 'Chicken Egg', value: "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'}
];

export function getToolsInfo(template_id) {
    let info = tools_info.filter(t=>t.template_id == template_id);
    if (!info) info = {name: template_id};
    else info = info[0]
    return info;
}

export function getAssetInfo(template_id) {
    let info = assets_info.filter(a=>a.template_id == template_id);
    if (info) info = info[0]
    else info = {name: template_id, gold: 0, wood: 0};
    
    return info;
}

export const endpoints = [
    "https://chain.wax.io",
    "https://wax.eosusa.news",
    "https://api.wax.greeneosio.com",
    "https://wax.eu.eosamsterdam.net",
    "https://api.wax.bountyblok.io",
    "https://wax.greymass.com", 
    "https://api.wax.alohaeos.com", 
    "https://wax.pink.gg", 
    "https://api.waxsweden.org", 
    "https://wax.eosphere.io", 
    "https://wax.dapplica.io", 
    "https://wax.cryptolions.io"];
