<template>
    <v-dialog v-model="dialog" max-width="800px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
                EXCHANGE TOKENS
            </v-btn>
        </template>
        <v-card width="780px" min-height="420px" class="pa-3">
            <v-card-title class="text-center justify-center py6">
                <h1 class="text-h5">EXCHANGE TOKENS</h1>
            </v-card-title>
            <v-row no-gutters> 
                <v-col cols="12" md="6" xs="12">
                    <v-card class="ma-1">
                        <v-card-title>
                            <span class="text-h5">Buy Tokens</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validBuy">
                                        <small>Buy game tokens wih WAX</small>
                                        <v-text-field 
                                            suffix="￦" 
                                            v-model="amountToBuy" 
                                            label="Pay in WAX" 
                                            :rules="[rules.required, rules.positive]"
                                            :error="buyError"
                                            required></v-text-field>
                                        <v-select v-model="tokenToBuy" :items="tokensList" required></v-select>
                                        <div></di><small>You will get ~{{ getInTokens }} {{tokenToBuy}}</small></div>
                                        <v-btn :disabled="!validBuy" color="success" class="mr-4" @click="buyTokens()">
                                            BUY
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
                            <span class="text-h5">Sell Tokens</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-form v-model="validSell">
                                        <small>Sell tokens for WAX</small>
                                        <v-text-field 
                                            :suffix="tokenToSell" 
                                            v-model="amountToSell" 
                                            label="Amount" 
                                            :rules="[rules.required, rules.positive]"
                                            :error="sellError"
                                            required></v-text-field>
                                        <v-select v-model="tokenToSell" :items="tokensList" required></v-select>
                                        <div><small>You will get ~{{ getInWaxTokens }} WAX</small></div>
                                        <v-btn :disabled="!validSell" color="success" class="mr-4" @click="sellTokens()">
                                            SELL
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
                            {{ formatAssetPrice(farm.account.wax_balance,4)}}￦ 
                            <TokenChip :value="farm.tokens.fwg" name="FWG" />
                            <TokenChip :value="farm.tokens.fww" name="FWW" />
                            <TokenChip :value="farm.tokens.fwf" name="FWF" />            
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
    validBuy: true,
    validSell: false,
    amountToBuy: 0,
    tokenToBuy: 'FWF',
    tokenToSell: 'FWF',
    amountToSell: 0,
    buyError: false,
    sellError: false,
    tokensList: [
        {value: 'FWW', text: 'FWW'},
        {value: 'FWG', text: 'FWG'},
        {value: 'FWF', text: 'FWF'}
    ], 
    rules: {
          required: value => !!value || 'Required.',
          positive: value => value > 0 || 'Amount should be positive.',
          min: v => v.length >= 8 || 'Min 8 characters',
    },    
  }),  
  async mounted() {
  },
  methods: {
    hideDialog() {
        this.dialog = false;
    },
    async buyTokens() {
        console.log("buy tokens " + this.tokenToBuy + " to " + this.sendTo + " amount: " + this.amountToSend);
        const res = await this.$dialog.confirm({
            text: `Buy ${this.tokenToBuy} for ${this.amountToBuy}￦ ?`,
            title: 'Confirmation',
            actions: {
                false: 'No',
                true: 'Yes'
            },
        });
        if (res) {
            let memo = "0.0000 " + this.tokenToBuy + "@farmerstoken";
            const res = await this.send_wax(this.$store.state.userAccount, this.amountToBuy, 'alcordexmain', memo)
            if (res.status) {
                this.$toast.success("Successfully placed order on Alcor Exchange");
            } else {
                this.$toast.error(res.result);
            }
        } 
        this.hideDialog();
    },
    async sellTokens() {
        console.log("sell tokens " + this.tokenToSell + " amount: " + this.amountToSell);
        const res = await this.$dialog.confirm({
            text: `Sell ${this.amountToSell} ${this.tokenToSell} ?`,
            title: 'Confirmation',
            actions: {
                false: 'No',
                true: 'Yes'
            },            
        })
        if (res) {
            let memo = "0.00000000 WAX@eosio.token";
            const res = await this.fw_send_tokens(this.$store.state.userAccount, this.amountToSell, this.tokenToSell, 'alcordexmain', memo)
            if (res.status) {
                this.$toast.success("Successfully placed sell order on Alcor Exchange");
            } else {
                this.$toast.error(res.result);
            }
        } 
        this.hideDialog();
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
    }      
  },
  components: {
      TokenChip
  }
};
</script>

<style scoped lang="scss"></style>