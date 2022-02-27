<template>
  <div class="ma-3">
    <v-row> 
        <v-col cols="12" md="12" xs="12">
            <v-card>
                <v-btn @click="$router.push(`/`);" class="ma-4">
                {{$t('Back to Farms')}}
                </v-btn>
                <v-card-subtitle>
                    {{$t('Total AWAX available on presale')}}:
                    <strong>{{total_awax}}₳</strong>
                    <br/>
                    {{$t('Total WAX collected on presale')}}:
                    <strong>{{total_wax_collected}}￦</strong>
                </v-card-subtitle>
                <v-card-title>
                    {{ id }}.
                </v-card-title>        
                <v-card-subtitle>
                    {{$t('Total donations')}}: {{formatAsset(total_wax)}}￦
                </v-card-subtitle>
                <v-data-table
                    :headers="headersActions"
                    :items="farm_donations"
                    sort-by="time" :sort-desc="[true]"
                    class="elevation-1" dense :items-per-page="100"
                >
                    <template v-slot:item.date="{ item }">
                        {{ TimestampToDate(item.date) }}
                    </template>                                             
                    <template v-slot:item.amount="{ item }">
                        {{ formatAsset(item.amount) }}￦
                    </template>                                             
                </v-data-table>
            </v-card>

            <v-card class="pa-3 mt-2" width="300px">
                <span v-if="farm && farm.account">
                    {{$t('Balance')}}: {{farm.account.wax_balance}}￦
                </span>
                <v-form>
                    <v-text-field 
                        suffix="￦" 
                        v-model="amount" 
                        :label="$t('Amount')" 
                        :rules="[rules.required, rules.positive]"
                        :error="buyError"
                        ></v-text-field>
                    <v-btn color="primary" @click="donate()">
                        {{$t('Donate')}}
                    </v-btn>
                </v-form>
            </v-card>
        </v-col>
    </v-row>
  </div>
</template>

<script>
const {db, Timestamp } = require('@/db');

export default {
    name: "Donations",
    props: ["id"],
    data() {
        return {
            farm_donations: [],
            total_wax: 0,
            farm: null,
            amount: 0,
            buyError: false,
            headersActions: [
                { text: '', value: 'num' },
                { text: this.$t('Account'), value: 'account_name' },
                { text: this.$t('Time'),value: 'date', },
                { text: this.$t('Amount'),value: 'amount', },
            ],
            rules: {
                required: value => !!value || 'Required.',
                positive: value => value > 0 || 'Amount should be positive.',
                min: v => v.length >= 8 || 'Min 8 characters',
            }, 
            total_awax: 0,
            total_wax_collected: 0,
        }
    },
    components: {        
    },
    created() {
        console.log("account name: " + this.id);
        this.getDonations();
    },
    async mounted() {
        let found = false;
        for(let i=0; i<this.$store.state.farms.length && !found; i++) {
            if (this.$store.state.farms[i].account_name == this.id) {
                found = true;
                this.farm = this.$store.state.farms[i];
            }
        }

        this.total_awax = await this.getTotalAWAXOnPresale();
        this.total_wax_collected = await this.getTotalWAXCollected();
    },
    methods: {  
        getDonations() {
            let donations = []
            this.total_wax = 0;
            let num = 1;

            // соберем список донатов
            db.collection('donations').where('account_name','==', this.id).get().then(snapshot => {
                snapshot.forEach(doc => {
                    let item = doc.data();
                    item.id = num++;
                    donations.push(item);
                    this.total_wax += item.amount;
                })
            });
            this.farm_donations = donations;
        },
        TimestampToDate(dateTime) {
            return this.formatFullDate(new Date(dateTime.seconds*1000));
        },    
        async donate() {
            console.log("donate " + this.amount);
            let to_send = Number(this.amount);
            const res = await this.$dialog.confirm({
                text: this.$t("Donate") + " " + to_send + " ￦ " + this.$t("to") + " AngelFarmers ?",
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },
            });
            if (res) {
                console.log("donating...");
                const res = await this.send_wax(this.farm.account_name, to_send, 'awaxpresales', '', this.farm.settings.private_key, this.farm.settings.delegated_account);
                if (res.status) {
                    this.$toast.success(this.$t("Successfully transferred donation"));
                    await this.fb_addDonation(this.farm.account_name, to_send);
                    this.$store.dispatch('updateFarmIncome', this.farm.account_name);
                    this.getDonations();
                } else {
                    this.$toast.error(res.result);
                }
            } 
        }   
    },
    watch: {
        amount(val, oldval) {
            if (this.farm) {
                const max = this.farm.account.wax_balance;
                this.buyError = !(val <= max);
            }
        },             
    },    
    computed: {
  },    
};
</script>

<style></style>
