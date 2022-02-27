<template>
    <v-dialog v-model="dialog" max-width="800px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
                MANAGE TOKENS
            </v-btn>
        </template>
        <v-card width="780px" min-height="420px" class="pa-3">
            <v-card-title class="text-center justify-center py6">
                <h1 class="text-h5">MANAGE TOKENS</h1>
            </v-card-title>
            <v-row no-gutters> 
                <v-col cols="12" md="4" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">Send Tokens</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validSendTo">
                                        <small>Send from {{$store.state.userAccount}} to </small>
                                        <v-select v-model="sendTo" 
                                            label="Send to" 
                                            :items="farms_list" 
                                            :rules="[rules.required]"
                                            required></v-select>
                                        <v-text-field 
                                            :suffix="tokenSend" 
                                            v-model="amountToSend" 
                                            label="Amount" required
                                            :rules="[rules.required, rules.positive]"
                                            :error="sendError"
                                        ></v-text-field>
                                        <v-select v-model="tokenSend" :items="tokensList" required></v-select>
                                        <v-text-field  v-model="sendMemo" label="Memo"></v-text-field>                                        
                                        <v-btn :disabled="!validSendTo" color="success" class="mr-4" @click="sendTokens()">
                                            Send
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
                            <span class="text-h5">Deposit</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validDeposit">
                                        <small>Deposit into game</small>
                                        <v-text-field 
                                            :suffix="tokenDeposit" 
                                            v-model="amountToDeposit" 
                                            label="Amount" 
                                            :rules="[rules.required, rules.positive]"
                                            :error="depositError"
                                            required></v-text-field>
                                        <v-select v-model="tokenDeposit" :items="tokensList" required></v-select>
                                        <v-btn :disabled="!validDeposit" color="success" class="mr-4" @click="depositTokens()">
                                            Deposit
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
                            <span class="text-h5">Withdraw</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validWithdraw">
                                        <small>Withdraw tokens from game</small>
                                        <v-text-field 
                                            :suffix="tokenWithdraw" 
                                            v-model="amountToWithdraw" 
                                            label="Amount" 
                                            :rules="[rules.required, rules.positive]"
                                            :error="withdrawError"
                                            required></v-text-field>
                                        <v-select v-model="tokenWithdraw" :items="resources" required></v-select>
                                        <v-btn :disabled="!validWithdraw" color="success" class="mr-4" @click="withdrawTokens()">
                                            Withdraw
                                        </v-btn>
                                    </v-form>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-card class="ma-4">
                <v-row>
                    <v-col>
                        <v-card-text v-if="farm && farm.tokens">
                            Tokens:
                            <TokenChip :value="farm.tokens.fwg" name="FWG" />
                            <TokenChip :value="farm.tokens.fww" name="FWW" />
                            <TokenChip :value="farm.tokens.fwf" name="FWF" />            
                            In Game:
                            <TokenChip :value="farm.balance.gold" name="FWG2" />
                            <TokenChip :value="farm.balance.wood" name="FWW2" />
                            <TokenChip :value="farm.balance.food" name="FWF2" />            
                        </v-card-text>
                    </v-col>
                </v-row>
            </v-card>
        </v-card>                
    </v-dialog>             
</template>

<script>
import TokenChip from "@/components/TokenChip.vue";

export default {
  name: "ManageTokensDialog",
  props: ["farm"],  
  data: () => ({
    dialog: false,            
    farms_list: [],
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
  }),  
  async mounted() {
      this.farms_list = [];
      this.$store.state.farms.forEach(f => {
          this.farms_list.push(f.account_name);
      })
      this.sendTo = this.$store.state.farms.length > 0 ? this.$store.state.farms[0] : '';      
  },
  methods: {
    hideDialog() {
        this.dialog = false;
    },
    async sendTokens() {
        console.log("send tokens " + this.tokenSend + " to " + this.sendTo + " amount: " + this.amountToSend);
        const res = await this.$dialog.confirm({
            text: `Send ${this.amountToSend} ${this.tokenSend} from ${this.$store.state.userAccount} to ${this.sendTo} ?`,
            title: 'Confirmation',
            actions: {
                false: 'No',
                true: 'Yes'
            },
        });
        if (res) {
            console.log("sending...");
            const res = await this.fw_send_tokens(this.$store.state.userAccount, this.amountToSend, this.tokenSend, this.sendTo, this.sendMemo);
            if (res.status) {
                this.$toast.success("Successfully transferred tokens");
            } else {
                this.$toast.error(res.result);
            }
        } 
        this.hideDialog();
    },
    async depositTokens() {
        console.log("deposit tokens " + this.tokenDeposit + " amount: " + this.amountToDeposit);
        const res = await this.$dialog.confirm({
            text: `Deposit ${this.amountToDeposit} ${this.tokenDeposit} into the game?`,
            title: 'Confirmation',
            actions: {
                false: 'No',
                true: 'Yes'
            },            
        })
        if (res) {
            const res = await this.fw_deposit_tokens(this.$store.state.userAccount, this.amountToDeposit, this.tokenDeposit);
            if (res.status) {
                this.$toast.success("Successfully deposited tokens");
            } else {
                this.$toast.error(res.result);
            }
        } 
        this.hideDialog();
    },
    async withdrawTokens() {
        console.log("withdraw tokens " + this.tokenWithdraw + " amount: " + this.amountToWithdraw);
        const res = await this.$dialog.confirm({
            text: `Please confirm withdrawing ${this.amountToWithdraw} ${this.tokenWithdraw} from the game`,
            title: 'Confirmation',
            actions: {
                false: 'No',
                true: 'Yes'
            },            
        })
        if (res) {
            const res = await this.fw_withdraw_tokens(this.$store.state.userAccount, this.amountToWithdraw, 
                                                      this.tokenWithdraw, this.$store.state.config.fee);
            if (res.status) {
                this.$toast.success("Successfully withdrawn tokens");
            } else {
                this.$toast.error(res.result);
            }
        } 
        this.hideDialog();        
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
    }    
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
    }        
  },
  components: {
      TokenChip
  }
};
</script>

<style scoped lang="scss"></style>