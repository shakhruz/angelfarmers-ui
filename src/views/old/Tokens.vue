<template>
    <div>
        <v-card class="ma-4" v-if="farm && farm.account_name">
            <v-row>
                <v-col>
                    <v-card-title class="text-center justify-center py6">
                        <h1 class="text-h5">
                            <v-icon>mdi-circle-multiple-outline</v-icon>
                            {{$t("MANAGE TOKENS")}}
                            <v-icon>mdi-circle-multiple-outline</v-icon>
                        </h1>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-title>
                        <!-- {{farm.account_name}} -->
                        <v-select v-model="farm_account" 
                            :label="$t('Select farm')" width="100px" @change="changeFarm(farm_account)"
                            :items="active_farms_list" >
                        </v-select>
                    </v-card-title>
                    <v-card-text v-if="farm && farm.tokens">
                        {{$t("Balance")}}: 
                        <strong>
                            {{ formatAsset(farm.account.wax_balance) }}
                        </strong>
                        ￦ |
                        {{$t("Tokens")}}:
                        <TokenChip :value="farm.tokens.fwg" name="FWG" />
                        <TokenChip :value="farm.tokens.fww" name="FWW" />
                        <TokenChip :value="farm.tokens.fwf" name="FWF" />            
                        &nbsp;|&nbsp;
                        {{$t("In Game")}}:
                        <TokenChip :value="farm.balance.gold" name="FWG2" />
                        <TokenChip :value="farm.balance.wood" name="FWW2" />
                        <TokenChip :value="farm.balance.food" name="FWF2" />
                        &nbsp;&nbsp;|&nbsp;   
                        CPU: <CPUInfo :cpu_used="farm.account.cpu_used_percent"/>         
                        <v-btn icon @click = '$store.dispatch("updateFarm", farm.account_name)'>
                            <v-icon>mdi-cached</v-icon>
                        </v-btn>                         
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
        <v-card class="pa-3">
            <v-row no-gutters> 
                <v-col cols="12" md="4" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">
                                <v-icon>mdi-send</v-icon>
                                {{$t("Send Tokens")}}
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validSendTo">
                                        <small>
                                            {{$t("Send from")}}&nbsp;
                                            {{$store.state.userAccount}} {{$t("to")}} </small>
                                        <v-select v-model="sendTo" 
                                            :label="$t('Send to')" 
                                            :items="farms_list" 
                                            :rules="[rules.required]"
                                            required></v-select>
                                        <v-text-field 
                                            :suffix="tokenSend" 
                                            v-model="amountToSend" 
                                            :label="$t('Amount')" required
                                            :rules="[rules.required, rules.positive]"
                                            :error="sendError"
                                        ></v-text-field>
                                        <v-select v-model="tokenSend" :items="tokensList" required></v-select>
                                        <v-text-field  v-model="sendMemo" label="Memo"></v-text-field>                                        
                                        <v-btn :disabled="!validSendTo" color="success" class="mr-4" @click="sendTokens()">
                                            {{$t("Send")}}
                                        </v-btn>
                                    </v-form>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">
                                <v-icon>mdi-inbox-arrow-down</v-icon>
                                {{$t("Deposit")}}
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validDeposit">
                                        <!-- <small>
                                            {{$t("Deposit into game")}}
                                        </small> -->
                                        <v-text-field 
                                            :suffix="tokenDeposit" 
                                            v-model="amountToDeposit" 
                                            :label="$t('Amount')" 
                                            :rules="[rules.required, rules.positive]"
                                            :error="depositError"
                                            required></v-text-field>
                                        <v-select v-model="tokenDeposit" :items="tokensList" required></v-select>
                                        <v-btn :disabled="!validDeposit" color="success" class="mr-4" @click="depositTokens()">
                                            {{$t("Deposit")}}
                                        </v-btn>
                                    </v-form>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">
                                <v-icon>mdi-inbox-arrow-up</v-icon>
                                {{$t("Withdraw")}}
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validWithdraw">
                                        <!-- <small>
                                            Withdraw tokens from game
                                        </small> -->
                                        <v-text-field 
                                            :suffix="tokenWithdraw" 
                                            v-model="amountToWithdraw" 
                                            :label="$t('Amount')"  
                                            :rules="[rules.required, rules.positive]"
                                            :error="withdrawError"
                                            required></v-text-field>
                                        <v-select v-model="tokenWithdraw" :items="resources" required></v-select>
                                        <v-btn :disabled="!validWithdraw" color="success" class="mr-4" @click="withdrawTokens()">
                                            {{$t("Withdraw")}}
                                        </v-btn>
                                    </v-form>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">
                                <v-icon>mdi-swap-horizontal</v-icon>
                                {{$t("Buy Tokens")}}
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validBuy">
                                        <!-- <small>
                                            {{$t("Buy game tokens wih WAX")}}
                                        </small> -->
                                        <v-text-field 
                                            suffix="￦" 
                                            v-model="amountToBuy" 
                                            :label="$t('Pay in WAX')" 
                                            :rules="[rules.required, rules.positive]"
                                            :error="buyError"
                                            required></v-text-field>
                                        <v-select v-model="tokenToBuy" :items="tokensList" required></v-select>
                                        <div><small>
                                            {{$t("You will get")}}&nbsp;
                                            ~{{ getInTokens }} {{tokenToBuy}}</small></div>
                                        <v-btn :disabled="!validBuy" color="success" class="mr-4" @click="buyTokens()">
                                            {{$t("BUY")}}
                                        </v-btn>
                                    </v-form>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">
                                <v-icon>mdi-swap-horizontal</v-icon>
                                {{$t("Sell Tokens")}}
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validSell">
                                        <!-- <small>Sell tokens for WAX</small> -->
                                        <v-text-field 
                                            :suffix="tokenToSell" 
                                            v-model="amountToSell" 
                                            :label="$t('Amount')"  
                                            :rules="[rules.required, rules.positive]"
                                            :error="sellError"
                                            required></v-text-field>
                                        <v-select v-model="tokenToSell" :items="tokensList" required></v-select>
                                        <div><small>
                                            {{$t("You will get")}}&nbsp;
                                            ~{{ getInWaxTokens }} WAX</small></div>
                                        <v-btn :disabled="!validSell" color="success" class="mr-4" @click="sellTokens()">
                                            {{$t("SELL")}}
                                        </v-btn>
                                    </v-form>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>                
    </div>
</template>

<script>
import TokenChip from "@/components/TokenChip.vue";
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";

export default {
    name: "Tokens",
    data: () => ({
        farm: null,
        farms_list: [],
        active_farms_list: [],
        farm_account: null,
        validSendTo: false,
        validDeposit: false,
        validWithdraw: false,
        amountToSend: 0,
        sendTo: '',
        tokenSend: 'FWF',
        sendMemo: '',
        tokenWithdraw: 'GOLD',
        tokenDeposit: 'FWF',
        amountToDeposit: 0,
        amountToWithdraw: 0,
        sendError: false,
        depositError: false,
        withdrawError: false,
        tokensList: [
            {value: 'FWW', text: 'FWW'},
            {value: 'FWG', text: 'FWG'},
            {value: 'FWF', text: 'FWF'}
        ], 
        resources: [
            {value: 'WOOD', text: 'WOOD'},
            {value: 'GOLD', text: 'GOLD'},
            {value: 'FOOD', text: 'FOOD'}
        ],
        rules: {
            required: value => !!value || 'Required.',
            positive: value => value > 0 || 'Amount should be positive.',
            min: v => v.length >= 8 || 'Min 8 characters',
        }, 
        validBuy: true,
        validSell: false,
        amountToBuy: 0,
        tokenToBuy: 'FWF',
        tokenToSell: 'FWF',
        amountToSell: 0,
        buyError: false,
        sellError: false,
    }),  
    mounted() {
        // пауза в 1 секунду для логина
        setTimeout( () => {
            this.farm = this.$store.state.farms[0];
            this.farm_account = this.farm.account_name;
            this.farms_list = [];
            this.$store.state.farms.forEach(f => {
                this.farms_list.push(f.account_name);
            })
            this.sendTo = this.$store.state.farms.length > 0 ? this.$store.state.farms[0] : '';      

            // соберем список ферм которыми можно управлять
            this.active_farms_list = [];
            this.$store.state.farms.forEach(f => {
                if (f.wax_login || f.settings.delegated_account.trim()!='' || f.settings.private_key.trim()!='') {
                    this.active_farms_list.push(f.account_name);
                }
            })
        }, 1000);
    },
    methods: {
        changeFarm(farm_name) {
            console.log("farm account: " + farm_name);

            // найдем и обновим ферму
            let found = false;
            for(let i=0;i<this.$store.state.farms.length && !found;i++) {
                if (this.$store.state.farms[i].account_name == farm_name) {
                this.farm = this.$store.state.farms[i];
                found = true;
                }
            }
        },    

        async sendTokens() {
            console.log("send tokens " + this.tokenSend + " to " + this.sendTo + " amount: " + this.amountToSend);
            const res = await this.$dialog.confirm({
                text: `${this.$t('Send')} ${this.amountToSend} ${this.tokenSend} ${this.$t('from')} ${this.farm.account_name} ${this.$t('to')} ${this.sendTo} ?`,
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },
            });
            if (res) {
                console.log("sending...");
                const res = await this.fw_send_tokens(this.farm.account_name, this.amountToSend, this.tokenSend, this.sendTo, this.sendMemo, this.farm.settings.private_key, this.farm.settings.delegated_account);
                if (res.status) {
                    this.$toast.success(this.$t("Successfully transferred") + " " + 
                                this.amountToSend + " " + this.tokenSend + " " + this.$t("from") + " " + this.farm.account_name + 
                                " " + this.$t("to") + " " + this.sendTo);
                    this.$store.dispatch('updateFarm', this.farm.account_name);
                } else {
                    this.$toast.error(res.result);
                }
            } 
        },
        async depositTokens() {
            console.log("deposit tokens " + this.tokenDeposit + " amount: " + this.amountToDeposit);
            const res = await this.$dialog.confirm({
                text: `${this.$t('Deposit')} ${this.amountToDeposit} ${this.tokenDeposit} ${this.$t('into the game')}?`,
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },            
            })
            if (res) {
                const res = await this.fw_deposit_tokens(this.farm.account_name, this.amountToDeposit, this.tokenDeposit, this.farm.settings.private_key, this.farm.settings.delegated_account);
                if (res.status) {
                    this.$toast.success(this.$t("Successfully deposited") + " " + this.amountToDeposit + " " + this.tokenDeposit + 
                                        this.$t("to") + " " + this.farm.account_name);
                    this.$store.dispatch('updateFarm', this.farm.account_name);
                } else {
                    this.$toast.error(res.result);
                }
            } 
        },
        async withdrawTokens() {
            console.log("withdraw tokens " + this.tokenWithdraw + " amount: " + this.amountToWithdraw);
            const res = await this.$dialog.confirm({
                text: this.$t("Please confirm withdrawing") + " " + this.amountToWithdraw +  " " + this.tokenWithdraw + " " +
                    this.$t("from the game"),
                title: 'Confirmation',
                actions: {
                    false: 'No',
                    true: 'Yes'
                },            
            })
            if (res) {
                const res = await this.fw_withdraw_tokens(this.farm.account_name, this.amountToWithdraw, 
                                                        this.tokenWithdraw, this.$store.state.config.fee, this.farm.settings.private_key, this.farm.settings.delegated_account);
                if (res.status) {
                    this.$toast.success(this.$t("Successfully withdrawn") + " " + this.amountToWithdraw + " " + this.tokenWithdraw + " " +
                                        this.$t("from") + " " + this.farm.account_name);
                    this.$store.dispatch('updateFarm', this.farm.account_name);
                } else {
                    this.$toast.error(res.result);
                }
            } 
        },
        currentSendTokenBalance() {
            let max = 0;
            if (this.farm && this.farm.tokens) {
                switch(this.tokenSend) {
                case "FWF":
                    max = this.farm.tokens.fwf;
                    break;
                case "FWW":
                    max = this.farm.tokens.fww;
                    break;
                case "FWG":
                    max = this.farm.tokens.fwg;
                    break;
                }
            }
            return max;
        },
        currentDepositTokenBalance() {
            let max = 0;
            if (this.farm && this.farm.tokens) {
                switch(this.tokenDeposit) {
                case "FWF":
                    max = this.farm.tokens.fwf;
                    break;
                case "FWW":
                    max = this.farm.tokens.fww;
                    break;
                case "FWG":
                    max = this.farm.tokens.fwg;
                    break;
                }
            }
            return max;
        },    
        currentResourceBalance() {
            let max = 0;
            if (this.farm && this.farm.balance) {
                switch(this.tokenWithdraw) {
                case "GOLD":
                    max = this.farm.balance.gold;
                    break;
                case "WOOD":
                    max = this.farm.balance.wood;
                    break;
                case "FOOD":
                    max = this.farm.balance.food;
                    break;
                }
            }
            return max;
        },
        async buyTokens() {
            console.log("buy tokens " + this.tokenToBuy + " to " + this.sendTo + " amount: " + this.amountToSend);
            const res = await this.$dialog.confirm({
                text: this.$t("Buy") + " " + this.tokenToBuy + this.$t("for") + " " + this.amountToBuy + "￦ ?",
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },
            });
            if (res) {
                let memo = "0.0000 " + this.tokenToBuy + "@farmerstoken";
                const res = await this.send_wax(this.farm.account_name, this.amountToBuy, 'alcordexmain', memo, this.farm.settings.private_key, this.farm.settings.delegated_account)
                if (res.status) {
                    this.$toast.success(this.$t("Successfully placed order on Alcor Exchange"));
                    this.$store.dispatch('updateFarm', this.farm.account_name);
                } else {
                    this.$toast.error(res.result);
                }
            } 
        },
        async sellTokens() {
            console.log("sell tokens " + this.tokenToSell + " amount: " + this.amountToSell);
            const res = await this.$dialog.confirm({
                text: this.$t("Sell") + this.amountToSell + " " + this.tokenToSell + " ?",
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },            
            })
            if (res) {
                let memo = "0.00000000 WAX@eosio.token";
                const res = await this.fw_send_tokens(this.farm.account_name, this.amountToSell, this.tokenToSell, 'alcordexmain', memo, this.farm.settings.private_key, this.farm.settings.delegated_account)
                if (res.status) {
                    this.$toast.success(this.$t("Successfully placed order on Alcor Exchange"));
                    this.$store.dispatch('updateFarm', this.farm.account_name);
                } else {
                    this.$toast.error(res.result);
                }
            } 
        },
        currentSellTokenBalance() {
            let max = 0;
            if (this.farm && this.farm.tokens) {
                switch(this.tokenToSell) {
                case "FWF":
                    max = this.farm.tokens.fwf;
                    break;
                case "FWW":
                    max = this.farm.tokens.fww;
                    break;
                case "FWG":
                    max = this.farm.tokens.fwg;
                    break;
                }
            }
            return max;
        },       
    },
    watch: {
        amountToSend(val, oldval) {
            const max = this.currentSendTokenBalance()
            this.sendError = !(val <= max);
        },
        amountToDeposit(val, oldval) {
            const max = this.currentDepositTokenBalance()
            this.depositError = !(val <= max);
        },
        amountToWithdraw(val, oldval) {
            const max = this.currentResourceBalance()
            this.withdrawError = !(val <= max);
        },
        amountToSell(val, oldval) {
            const max = this.currentSellTokenBalance()
            this.sellError = !(val <= max);
        },    
        amountToBuy(val, oldval) {
            if (this.farm) {
                const max = this.farm.account.wax_balance;
                this.buyError = !(val <= max);
            }
        },             
    },
    computed: {
        getInTokens() {
            let amount = 0;
            if (this.$store.state.prices) {
                switch(this.tokenToBuy) {
                    case "FWF":
                        amount = this.amountToBuy / this.$store.state.prices.fwf;
                        break;
                    case "FWW":
                        amount = this.amountToBuy / this.$store.state.prices.fww;
                        break;
                    case "FWG":
                        amount = this.amountToBuy / this.$store.state.prices.fwg;
                        break;
        
                }
            }
            return this.formatAssetPrice(amount);
        },
        getInWaxTokens() {
            let amount = 0;
            if (this.$store.state.prices) {
                switch(this.tokenToBuy) {
                    case "FWF":
                        amount = this.amountToSell * this.$store.state.prices.fwf;
                        break;
                    case "FWW":
                        amount = this.amountToSell * this.$store.state.prices.fww;
                        break;
                    case "FWG":
                        amount = this.amountToSell * this.$store.state.prices.fwg;
                        break;
        
                }
            }
            return this.formatAssetPrice(amount);      
        },  
    },
    components: {
        TokenChip, CPUInfo
    }
};
</script>

<style scoped lang="scss"></style>