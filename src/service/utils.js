import Vue from "vue";

Vue.mixin({
  methods: {   
    sleep(ms) {
        console.log("sleep: "+ ms);
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    randSleepTime() {
        return Math.random()*1000*7+5000;
    },
    parseAsset(asset_string) {
        if (!asset_string || asset_string==null) return {number: 0, asset_id: ''};
        const items = asset_string.split(' ');
        const num = parseFloat(items[0]);
        const asset_id = items[1];
        return {number: num, asset_id: asset_id};
    },    
    // посчитает сколько активов есть в сундуке
    calcAssetsInChest(farm, template_id) {
        let list = farm.assets.list.filter(l=>l.template_id==template_id);
        return list.length;
    },
    async deleteFarmDialog(account_name) {
        const res = await this.$dialog.confirm({
            text: `${this.$t('Delete')} ${account_name} ?`,
            title: this.$t('Confirmation'),
            actions: {
                false: this.$t('No'),
                true: this.$t('Yes')
            },
        });
        if (res) {
            this.$store.dispatch("deleteFarm", account_name);
        }
    },
    // посчитаем сумму дохода в ваксах и вернем 5% от нее в качестве того что нужно оплатить
    calcAngelBalance(farm) {
        // let donations = 0;
        // if (farm.donations) donations = farm.donations ? farm.donations : 0;
        if (farm.income) {
            let total_wax = farm.income.wood * farm.prices.fww + farm.income.food*farm.prices.fwf + farm.income.gold*farm.prices.fwg +
            farm.income.barley*farm.prices.fwg*41 + farm.income.corn*farm.prices.fwg*61 + farm.income.eggs*farm.prices.fwg*281 + 
            farm.income.milk*farm.prices.fwg*141;
            let balance_wax = total_wax*0.03;
            return {donate: balance_wax - farm.awax_balance, total_wax: total_wax, balance_wax: balance_wax };
        } else {
            return {donate: 0, total_wax:0, balance_wax: 0};
        }
    },             
  },  
});