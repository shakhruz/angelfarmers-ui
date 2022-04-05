import Vue from "vue";

Vue.mixin({
  methods: {
    tools_info() { return [
        {'name': "Ancient Stone Axe", 'template_id': "378691", 'type': "Wood", 'reward': 0.35, 'energy': 2, 'durability': 0.5, 'gold': 20, 'wood': 110, 'counter': 0, 'schema_name': 'tools'},
        {'name': "Stone Axe", 'template_id': "260763", 'type': "Wood", 'reward': 1.7, 'energy': 5, 'durability': 3, 'gold': 135, 'wood': 800, 'counter': 0, 'schema_name': 'tools'},
        {'name': "Axe", 'template_id': "203881", 'type': "Wood", 'reward': 5, 'energy': 10, 'durability': 5, 'gold': 400, 'wood': 2400, 'counter': 0, 'schema_name': 'tools'},
        {'name': "Saw", 'template_id': "203883", 'type': "Wood", 'reward': 17, 'energy': 30, 'durability': 15, 'gold': 1200, 'wood': 7200, 'counter': 0, 'schema_name': 'tools'},
        {'name': "Chainsaw", 'template_id': "203886", 'type': "Wood", 'reward': 54, 'energy': 60, 'durability': 45, 'gold': 3600, 'wood': 21600, 'counter': 0, 'schema_name': 'tools'},
    
        {'name': "Fishing Rod", 'template_id': "203887", 'type': "Food", 'reward': 5, 'energy': 0, 'durability': 5, 'gold': 200, 'wood': 1200, 'counter': 0, 'schema_name': 'tools'},
        {'name': "Fishing Net", 'template_id': "203888", 'type': "Food", 'reward': 20, 'energy': 0, 'durability': 20, 'gold': 800, 'wood': 4800, 'counter': 0, 'schema_name': 'tools'},
        {'name': "Boat", 'template_id': "203889", 'type': "Food", 'reward': 80, 'energy': 0, 'durability': 32, 'gold': 3200, 'wood': 19200, 'counter': 0, 'schema_name': 'tools'},
    
        {'name': "Mining Excavator", 'template_id': "203891", 'type': "Gold", 'reward': 50, 'energy': 66.5, 'durability': 2.5, 'gold': 4000, 'wood': 24000, 'counter': 0, 'schema_name': 'tools'},
        ]
    },
    assets_info() { return [
        {'name': "Barley", 'template_id': "318606", 'gold': 40, 'wood': 0, 'schema_name': 'foods'},
        {'name': "Corn", 'template_id': "318607", 'gold': 60, 'wood': 0, 'schema_name': 'foods'},
    
        {'name': "Barley Seed", 'template_id': "298595", 'gold': 40, 'wood': 0, 'schema_name': 'plants'},
        {'name': "Corn Seed", 'template_id': "298596", 'gold': 60, 'wood': 0, 'schema_name': 'plants'},
    
        {'name': 'Milk', 'template_id': "298593", 'gold': 140, 'wood': 0, 'schema_name': 'foods'},
    
        {'name': "Ancient Stone Axe", 'template_id': "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools'},
        {'name': "Stone Axe", 'template_id': "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools'},
        {'name': "Axe", 'template_id': "203881", 'gold': 400, 'wood': 2400, 'schema_name': 'tools'},
        {'name': "Saw", 'template_id': "203883", 'gold': 1200, 'wood': 7200, 'schema_name': 'tools'},
        {'name': "Chainsaw", 'template_id': "203886", 'gold': 3600, 'wood': 21600, 'schema_name': 'tools'},
    
        {'name': "Fishing Rod", 'template_id': "203887", 'gold': 200, 'wood': 1200, 'schema_name': 'tools'},
        {'name': "Fishing Net", 'template_id': "203888", 'gold': 800, 'wood': 4800, 'schema_name': 'tools'},
        {'name': "Fishing Boat", 'template_id': "203889", 'gold': 3200, 'wood': 19200, 'schema_name': 'tools'},
    
        {'name': "Mining Excavator", 'template_id': "203891", 'gold': 4000, 'wood': 24000, 'schema_name': 'tools'},
    
        {'name': 'Farm Plot', 'template_id': "298592", 'gold': 120, 'wood': 200, 'schema_name': 'farmbuilding', 'building': true},
        {'name': 'Coop', 'template_id': "298591", 'gold': 240, 'wood': 400, 'schema_name': 'farmbuilding', 'building': true},
        {'name': 'Cowshed', 'template_id': "298590", 'gold': 360, 'wood': 600, 'schema_name': 'farmbuilding', 'building': true},
    
        {'name': 'Chicken Egg', 'template_id': "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'},
        {'name': 'Chick', 'template_id': "298613", 'gold': 0, 'wood': 0, 'max_claim': 16, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},
        {'name': 'Chicken', 'template_id': "298614", 'gold': 0, 'wood': 0, 'max_claim': 28, 'daily_claim_limit': 4, 'schema_name':'farmanimals' },
    
        {'name': 'Baby Calf', 'template_id': "298597", 'gold': 0, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},
        {'name': 'Female Calf', 'template_id': "298599", 'gold': 0, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},
        {'name': 'Male Calf', 'template_id': "298600", 'gold': 0, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},
        {'name': 'Dairy Cow', 'template_id': "298607", 'gold': 0, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},
        {'name': 'Bull', 'template_id': "298611", 'gold': 0, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},
    
        {'name': 'Food Membership Bronze', 'template_id': "260636", 'gold': 400, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Food Membership Silver', 'template_id': "260638", 'gold': 800, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Food Membership Gold', 'template_id': "260639", 'gold': 1600, 'wood': 0, 'schema_name':'memberships'},
    
        {'name': 'Wood Membership Bronze', 'template_id': "260628", 'gold': 400, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Wood Membership Silver', 'template_id': "260629", 'gold': 800, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Wood Membership Gold', 'template_id': "260631", 'gold': 1600, 'wood': 0, 'schema_name':'memberships'},
    
        {'name': 'Gold Membership Bronze', 'template_id': "260642", 'gold': 400, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Gold Membership Silver', 'template_id': "260629", 'gold': 800, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Gold Membership Gold', 'template_id': "260631", 'gold': 1600, 'wood': 0, 'schema_name':'memberships'},
    
        {'name': 'Farmers Coin', 'template_id': "260676", 'gold': 0, 'wood': 0, 'schema_name':'farmercoins'},

        {'name': 'Farm Plot', 'template_id': "298592", 'gold': 120, 'wood': 200, 'schema_name': 'farmbuilding'},
        {'name': 'Coop', 'template_id': "298591", 'gold': 240, 'wood': 400, 'schema_name': 'farmbuilding'},
        {'name': 'Cowshed', 'template_id': "298590", 'gold': 360, 'wood': 600, 'schema_name': 'farmbuilding'},
    
        {'name': 'Chicken Egg', 'template_id': "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'},
        ]
    }, 
    trade_assets() { return [
        {'name': "Barley", 'template_id': "318606", 'gold': 41, 'wood': 0, 'schema_name': 'foods'},
        {'name': "Corn", 'template_id': "318607", 'gold': 61, 'wood': 0, 'schema_name': 'foods'},
        {'name': "Barley Seed", 'template_id': "298595", 'gold': 51, 'wood': 0, 'schema_name': 'plants'},
        {'name': "Corn Seed", 'template_id': "298596", 'gold': 76, 'wood': 0, 'schema_name': 'plants'},
        {'name': 'Milk', 'template_id': "298593", 'gold': 141, 'wood': 0, 'schema_name': 'foods'},

        {'name': 'Egg', 'template_id': "298612", 'gold': 281, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'},
        {'name': 'Baby Calf', 'template_id': "298597", 'gold': 1001, 'wood': 0, 'daily_claim_limit': 4, 'schema_name':'farmanimals'},

        {'name': "Ancient Stone Axe", 'template_id': "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools'},
        {'name': "Stone Axe", 'template_id': "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools'},    
        {'name': "Axe", 'template_id': "203881", 'gold': 400, 'wood': 2400, 'schema_name': 'tools'},
        {'name': "Saw", 'template_id': "203883", 'gold': 1200, 'wood': 7200, 'schema_name': 'tools'},
        {'name': "Chainsaw", 'template_id': "203886", 'gold': 3600, 'wood': 21600, 'schema_name': 'tools'},

        {'name': "Fishing Rod", 'template_id': "203887", 'gold': 200, 'wood': 1200, 'schema_name': 'tools'},
        {'name': "Fishing Net", 'template_id': "203888", 'gold': 800, 'wood': 4800, 'schema_name': 'tools'},
        {'name': "Boat", 'template_id': "203889", 'gold': 3200, 'wood': 19200, 'schema_name': 'tools'},    
        {'name': "Mining Excavator", 'template_id': "203891", 'gold': 4000, 'wood': 24000, 'schema_name': 'tools'},

        {'name': 'Farm Plot', 'template_id': "298592", 'gold': 120, 'wood': 200, 'schema_name': 'farmbuilding'},
        {'name': 'Coop', 'template_id': "298591", 'gold': 240, 'wood': 400, 'schema_name': 'farmbuilding'},
        {'name': 'Cowshed', 'template_id': "298590", 'gold': 360, 'wood': 600, 'schema_name': 'farmbuilding'},
        {'name': 'Farmers Coin', 'template_id': "260676", 'gold': 0, 'wood': 0, 'schema_name':'farmercoins'},

        {'name': 'Wood Membership Bronze', 'template_id': "260628", 'gold': 400, 'wood': 0, 'schema_name':'memberships'},
        {'name': 'Wood Membership Silver', 'template_id': "260629", 'gold': 800, 'wood': 0, 'schema_name':'memberships'},

        ]
    },   
    craft_assets() { return [
        {text: "Barley", value: "318606", 'gold': 55, 'wood': 0, 'schema_name': 'foods'},
        {text: "Corn", value: "318607", 'gold': 82, 'wood': 0, 'schema_name': 'foods'},
        {text: "Barley Seed", value: "298595", 'gold': 50, 'wood': 0, 'schema_name': 'plants'},
        {text: "Corn Seed", value: "298596", 'gold': 75, 'wood': 0, 'schema_name': 'plants'},

        {text: 'Egg', value: "298612", 'gold': 300, 'wood': 0, 'schema_name':'farmanimals'},
        {text: 'Baby Calf', value: "298597", 'gold': 1000, 'wood': 0, 'schema_name':'farmanimals'},

        {text: "Ancient Stone Axe", value: "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools'},
        {text: "Stone Axe", value: "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools'},    
        {text: "Axe", value: "203881", 'gold': 400, 'wood': 2400, 'schema_name': 'tools'},
        {text: "Saw", value: "203883", 'gold': 1200, 'wood': 7200, 'schema_name': 'tools'},
        {text: "Chainsaw", value: "203886", 'gold': 3600, 'wood': 21600, 'schema_name': 'tools'},

        {text: "Fishing Rod", value: "203887", 'gold': 200, 'wood': 1200, 'schema_name': 'tools'},
        {text: "Fishing Net", value: "203888", 'gold': 800, 'wood': 4800, 'schema_name': 'tools'},
        {text: "Boat", value: "203889", 'gold': 3200, 'wood': 19200, 'schema_name': 'tools'},    
        {text: "Mining Excavator", value: "203891", 'gold': 4000, 'wood': 24000, 'schema_name': 'tools'},

        {text: 'Farm Plot', value: "298592", 'gold': 120, 'wood': 200, 'schema_name': 'farmbuilding'},
        {text: 'Coop', value: "298591", 'gold': 240, 'wood': 400, 'schema_name': 'farmbuilding'},
        {text: 'Cowshed', value: "298590", 'gold': 360, 'wood': 600, 'schema_name': 'farmbuilding'},
        {text: 'Farmers Coin', value: "260676", 'gold': 0, 'wood': 0, 'schema_name':'farmercoins'}
        ]
    },    
    items_to_sell() {return [
        {text: "Barley", value: "318606", 'gold': 40, 'wood': 0, 'schema_name': 'foods'},
        {text: "Corn", value: "318607", 'gold': 60, 'wood': 0, 'schema_name': 'foods'},
        {text: "Barley Seed", value: "298595", 'gold': 40, 'wood': 0, 'schema_name': 'plants'},
        {text: "Corn Seed", value: "298596", 'gold': 60, 'wood': 0, 'schema_name': 'plants'},
        {text: 'Milk', value: "298593", 'gold': 140, 'wood': 0, 'schema_name': 'foods'},
        {text: "Ancient Stone Axe", value: "378691", 'gold': 20, 'wood': 110, 'schema_name': 'tools'},
        {text: "Stone Axe", value: "260763", 'gold': 135, 'wood': 800, 'schema_name': 'tools'},    
        {text: 'Chicken Egg', value: "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'},
        {text: 'Farmers Coin', value: "260676", 'gold': 0, 'wood': 0, 'schema_name':'farmercoins'}]
    },
    items_to_exchange() {return [
        {text: "Barley", value: "318606", 'gold': 40, 'wood': 0, 'schema_name': 'foods'},
        {text: "Corn", value: "318607", 'gold': 60, 'wood': 0, 'schema_name': 'foods'},
        {text: 'Milk', value: "298593", 'gold': 140, 'wood': 0, 'schema_name': 'foods'},
        {text: 'Chicken Egg', value: "298612", 'gold': 280, 'wood': 0, 'max_claim': 9, 'daily_claim_limit': 3, 'schema_name':'farmanimals'}
    ]
    },
    getToolsInfo(template_id) {
        var info = {name: template_id};
    
        this.tools_info().forEach(tool_info => {
            if (tool_info.template_id == template_id) {
                info = tool_info;
            }
        })
        return info;
    },
    getAssetInfo(template_id) {
        var info = {name: template_id, gold: 0, wood: 0};
    
        this.assets_info().forEach(asset_info => {
            if (asset_info.template_id == template_id) {
                info = asset_info;
            }
        })
        return info;
    }           
  },
});



