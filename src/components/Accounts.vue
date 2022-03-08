<template>
    <v-card elevation="2" 
        :min-width="$vuetify.breakpoint.mobile ? '380px' : '380px'"
        :max-width="$vuetify.breakpoint.mobile ? '400px' : '550px'"
    class="justify-center" raised rounded="lg"
    :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'teal darken-1 white--text'">
        <div class="text-h5 text-center align-center pa-1 mx-auto mb-1 pb-1">
            {{$t("Checking Accounts")}}
        </div>
        <v-card-subtitle class="align-center text-center mt-0 mb-0 pt-0 pb-0  white--text">
            {{$t("Enter all your wax ids")}}
            <br/>
            {{$t("(Ex: xxxx1.wam, xxxx2.wam, xxxx3.wam...)")}}
        </v-card-subtitle>
        <div class="ma-4 mt-1 mb-0 pb-0 pt-0" >
            <v-text-field class="white--text" v-model="newFarm" dense clearable v-on:keyup.enter="addFarm()">
                <v-btn @click = 'addFarm()' text slot="append" color="white" :disabled="$store.state.top_loading">
                    {{$t('ADD')}}
                </v-btn>
            </v-text-field>                    
        </div>
        <div class="ma-1 mt-0 pt-0 pb-0 mb-0">
            <span v-for="farm in $store.state.farms" class="pa-1">
                <v-chip :class="farmBackgroundColor(farm) + ' ma-1'" @click="$store.dispatch('selectFarm', farm.account_name)" 
                close @click:close="deleteFarmDialog(farm.account_name)" label>
                    {{farm.account_name}}
                    <CPUInfo :cpu_used="farm.account.cpu_used_percent" v-if="farm.account"/>
                </v-chip>
            </span>
        </div>
        <v-divider></v-divider>
        <div v-if="$store.state.farms.length==0">
            <v-card-title>
                <div class="text--center center--text">
                    {{$t('Welcome to F12+ by AngelFarmers')}}
                </div>
            </v-card-title>
            <v-card-subtitle>
                {{$t("suite of tools to help FarmersWorld.io game players")}}
                <div class="mt-2">
                    {{$t("F12+ is free and opensource. You can checkout source code")}}
                    <a href="https://github.com/shakhruz/angelfarmers-ui" class="amber--text" target="_blank">
                        {{$t("on github")}}
                    </a>.
                </div>
                <div class="mt-2">
                    {{$t("AngelFarmers is a guild of blockchain games players.")}}
                </div>
                <div class="mt-2">
                    {{$t("Join us on")}}
                    <a :href="$t('https://t.me/angelfarmers')" class="amber--text" target="_blank">Telegram</a> {{$t("and")}} 
                    <a href="https://discord.gg/6ZZ6KFUz" class="amber--text" target="_blank">Discord</a>
                </div>
                <div class="mt-2">
                    <strong>{{$t("F12+ features")}}:</strong>
                    <div>{{$t("1. Calculate current value of your farm assets")}}</div>
                    <div>{{$t("2. Estimate earnings and ROI")}}</div>
                    <div>{{$t("3. Automated claiming, repairing, recovering energy, feeding animals and more")}}</div>
                    <div>{{$t("4. Farm management - withdraw, deposit, exchange, transfer, craft, game market, CPU and more")}}</div>
                    <div>{{$t("5. Multiple farms in one window. Calculate total value and estimate earnings on all your farms")}}</div>
                    <div>{{$t("6. Analyze and trade on Atomic market")}}</div>
                    <div>{{$t("7. Analyze orderbooks and trade on Alcor")}}</div>                    
                </div>
                <div class="mt-2">
                    {{$t("F12+ is free, but to fund development and server please donate your WAX by purchasing AWAX tokens.")}}
                </div>
                <div class="mt-2">    
                    {{$t("AWAX is a dividends and governance token. AWAX holders will benefits from our farming and trading operations")}}.
                    <br/>
                    <a href="https://awax.cc" class="amber--text" target="_blank">{{$t("Learn more about AWAX")}}</a>
                </div>


            </v-card-subtitle>

        </div>
        <div v-if="$store.state.farms.length>0">
            <v-card-actions class="mt-0 mb-0 pt-1 pb-1 mx-1">
                <v-btn @click = 'pauseAllFarms(false)' v-if="$store.state.pause_all" color="success" >
                    <v-icon>mdi-play</v-icon>{{$t("Auto")}}
                </v-btn>                      
                <v-btn @click = 'pauseAllFarms(true)' v-else>
                    <v-icon>mdi-pause</v-icon>{{$t("Manual")}}
                </v-btn>      
                <v-btn @click = "clearAllFarms()" icon class="white--text">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn @click = "$store.state.showAtomicPanel=true" icon class="white--text">
                    <v-icon>mdi-atom</v-icon>
                </v-btn>
                <v-btn @click = "$store.state.showAlcorOrderbook=true" icon class="white--text">
                    <v-icon>mdi-circle-multiple</v-icon>
                </v-btn>
                <v-spacer></v-spacer>               
                <v-btn v-if="$store.state.is_checking" icon @click = '$store.dispatch("updateInfo");' class="white--text">
                    <v-icon>mdi-cached</v-icon>
                </v-btn>                
            </v-card-actions>
            <v-divider></v-divider>
            <AllFarmStats />
        </div>
    </v-card>
</template>

<script>
import AllFarmStats from "@/components/FarmInfo/AllFarmStats.vue";
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";

export default {
    name: "Accounts",
    data() {
        return {
            newFarm: '',
        }
    },
    components: {
        AllFarmStats, CPUInfo
    },
    methods: {  
        pauseAllFarms(paused) {
            this.$store.state.pause_all = paused;
            localStorage.pause_all_farms = paused;
        },
        async clearAllFarms() {
            const res = await this.$dialog.confirm({
                text: `${this.$t('Delete all farms')}  ?`,
                title: this.$t('Confirmation'),
                actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },
            });
            if (res) {
                this.$store.dispatch('clearAllFarms')
            }
        },
        async addFarm() {
            if (this.newFarm.trim() != '') {
                const farms = this.newFarm.trim().split(',');
                farms.forEach(ff => {
                    this.$store.dispatch("addFarm", ff.trim());
                })      
                this.newFarm = '';
            }
        },
        validateField () {
            this.$refs.form.validate()
        },        
    },
    mounted() {
    },
};
</script>

<style></style>
