<template>
    <v-dialog v-model="dialog" max-width="1200px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" text>
                Donate
            </v-btn>            
        </template>
        <v-card class="pa-3">
            <v-card-title class="text-center justify-center py6">
                <h1 class="text-h5">Send donation to AngelFarmers</h1>
            </v-card-title>
            <small></small>
            <v-divider></v-divider>
            <v-row>
                <v-col>
                    <v-text-field 
                        suffix="￦" 
                        v-model="amount" 
                        label="Donate in WAX" 
                        :rules="[rules.required, rules.positive]"
                        :error="buyError"
                        ></v-text-field>

                </v-col>           
            </v-row>
            <v-card-actions>
              <v-btn color="cancel" @click="hideDialog()">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="hideDialog()">
                Donate
              </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>             
</template>

<script>

export default {
    name: "DonateDialog",
    props: ["dialog", "farm"],
    data: () => ({
        // dialog: false,
        amount: 0,
        buyError: false,
    }),
    mounted() {
    },
    methods: {
        showDialog() {
            this.dialog = true;
        },
        hideDialog() {
            this.dialog = false;
        },
    },
    watch: {
        amount(val, oldval) {
            if (this.farm) {
                const max = this.farm.account.wax_balance;
                this.buyError = !(val <= max);
            }
        },             
    },    
};
</script>

<style scoped lang="scss"></style>