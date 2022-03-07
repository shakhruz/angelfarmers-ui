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
        <div class="ma-4 mt-1 mb-0 pb-0 pt-0">
            <v-text-field v-model="newFarm" dense clearable v-on:keyup.enter="addFarm()">
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
        <v-card-actions class="mt-0 mb-0 pt-1 pb-1 mx-1">
            <v-btn @click = 'pauseAllFarms(false)' v-if="$store.state.pause_all" color="success">
                <v-icon>mdi-play</v-icon>{{$t("Auto")}}
            </v-btn>                      
            <v-btn @click = 'pauseAllFarms(true)' v-else>
                <v-icon>mdi-pause</v-icon>{{$t("Manual")}}
            </v-btn>      
            <v-btn @click = "clearAllFarms()" icon>
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-spacer></v-spacer>               
            <v-btn v-if="$store.state.is_checking" icon @click = '$store.dispatch("updateInfo");'>
                <v-icon>mdi-cached</v-icon>
            </v-btn>                
        </v-card-actions>
        <v-divider></v-divider>
        <AllFarmStats />
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
