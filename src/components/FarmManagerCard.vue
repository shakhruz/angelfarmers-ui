<template>
    <v-card 
        :id="farm.account_name"
        elevation="2" 
        outlined :color="this.$vuetify.theme.dark ? 'grey darken-3' : '#f8f6f2'"
        :min-width="$vuetify.breakpoint.mobile ? '360px' : '360px'"
        :max-width="$vuetify.breakpoint.mobile ? '400px' : '420px'"

        v-if="farm!=null && farm.account!=null">
        <v-card-subtitle class="mt-0 mb-0 pt-1 pb-1">
            <div>
                {{$t("MANAGEMENT SETTINGS")}}
            </div>
            <v-row class="mb-0 pb-0">
                <v-col  class="mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" 
                    v-model="farm.settings.refill_energy" :disabled="!farm.managed"
                    :label="$t('Refill energy when <')"></v-checkbox>
                </v-col>
                <v-col  class="mb-0 pb-0">
                    <v-text-field dense @change="updateFarm()" v-model="farm.settings.min_energy" 
                     :disabled="!farm.managed"
                     :label="$t('Min energy')"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.recover_tools" 
                     :disabled="!farm.managed"
                     :label="$t('Repair when <')"></v-checkbox>
                </v-col>
                <v-col  class="mb-0 pb-0">
                    <v-text-field dense @change="updateFarm()" v-model="farm.settings.min_durability" 
                     :disabled="!farm.managed"
                     :label="$t('Min durability %')"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.deposit_fwf" 
                     :disabled="!farm.managed"
                     :label="$t('Deposit FOOD when <')"></v-checkbox>
                </v-col>
                <v-col  class="mb-0 pb-0">
                    <v-text-field dense @change="updateFarm()" v-model="farm.settings.min_food" 
                     :disabled="!farm.managed"
                     :label="$t('Minimal food')"></v-text-field>                
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.claim_buildings" 
                     :disabled="!farm.managed"
                     :label="$t('Claim buildings')"  class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.manage_tools" 
                     :disabled="!farm.managed"
                     :label="$t('Claim & repair tools')"  class="ma-0 pa-0"></v-checkbox>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.plant_seeds" 
                     :disabled="!farm.managed"
                     :label="$t('Plant seeds')" class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.buy_seeds" 
                     :disabled="!farm.managed"
                     :label="$t('Buy seeds')"  class="ma-0 pa-0"></v-checkbox>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.claim_crops" 
                     :disabled="!farm.managed"
                     :label="$t('Claim crops')" class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.hatch_eggs" 
                     :disabled="!farm.managed"
                     :label="$t('Hatch eggs')" class="ma-0 pa-0"></v-checkbox>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.feed_with_barley" 
                     :disabled="!farm.managed"
                     :label="$t('Feed chicken')"  class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.feed_cow_with_barley" 
                     :disabled="!farm.managed"
                     :label="$t('Feed cow')"  class="ma-0 pa-0"></v-checkbox> 
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.feed_with_milk" 
                     :disabled="!farm.managed"
                     :label="$t('Feed baby calf')"  class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.claim_members" 
                     :disabled="!farm.managed"
                     :label="$t('Claim memberships')"  class="ma-0 pa-0"></v-checkbox>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.wear_buildings" 
                     :disabled="!farm.managed"
                     :label="$t('Wear buildings when possible')" class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.check_cpu_level" 
                     :disabled="!farm.managed"
                     :label="$t('Check CPU Level')" class="ma-0 pa-0"></v-checkbox>
                </v-col>
            </v-row>
            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox dense @change="updateFarm()" v-model="farm.settings.use_stored_mining" 
                     :disabled="!farm.managed"
                     :label="$t('Use stores from members')" class="ma-0 pa-0"></v-checkbox>
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                </v-col>
            </v-row>

            <v-text-field @change="updateFarm()" class="ma-0 pa-0"
                    v-model="farm.settings.send_crops_to" clearable
                     :disabled="!farm.managed"
                     :label="$t('Send all crops to account')">
            </v-text-field>                    
            <v-text-field @change="updateFarm()" class="ma-0 pa-0"
                    v-model="farm.settings.send_food_to" clearable
                     :disabled="!farm.managed"
                     :label="$t('Provide food to accounts')">
            </v-text-field>                    
            <v-text-field @change="updateFarm()" clearable class="ma-0 pa-0"
                    v-model="farm.settings.send_barley_seeds_to" 
                     :disabled="!farm.managed"
                     :label="$t('Provide barley seeds to accounts')">
            </v-text-field>                    

            <v-row class="mb-0 pb-0 mt-0 pt-0">
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <v-text-field dense @change="updateFarm()"
                            v-model="farm.settings.delegated_account" 
                            :label="$t('Delegated account name')" clearable>
                    </v-text-field>                                        
                </v-col>
                <v-col  class="mt-0 pt-0 mb-0 pb-0">
                    <div v-if="!farm.wax_login">
                        <v-text-field dense @change="updateFarm()" v-model="farm.settings.private_key" 
                        :label="$t('Private key')"
                        type='password' clearable>
                        </v-text-field>
                    </div>
                </v-col>
            </v-row>
        </v-card-subtitle>
        <v-card-actions class="mt-0 mb-0 pt-1 pb-1">
            <v-btn small @click="resetSettings()">
                {{$t('Reset to default')}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn small @click="hideSettings()">
                {{$t('Hide')}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
  name: "FarmManagerCard",
  props: ['farm', 'index'],
  data: () => ({
    rules: {
          required: value => !!value || 'Required.',
          positive: value => value > 0 || 'Amount should be positive.',
          min: v => v.length >= 8 || 'Min 8 characters',
    },    
  }),
  methods: {
    // сохраним изменения в настройках фермы
    updateFarm() {
        this.$store.state.farms[this.index].settings = this.farm.settings;
        this.$store.dispatch("saveFarms");
    },
    // сбросим настройки
    resetSettings() {
        const priv = this.farm.settings.private_key;
        this.farm.settings = this.$store.state.default_settings;
        this.farm.settings.private_key = priv;
        this.updateFarm();
    },   
    hideSettings() {
        // console.log("!!! change settings: " + this.$store.state.farms[this.index].settings.hide);
        this.$store.state.farms[this.index].settings.hide = true;
        this.farm.settings.hide = true;
        this.$store.dispatch("saveFarms");
    }
  },
  computed: {
  },
  components: {
  },    
};
</script>

<style scoped lang="scss">
</style>
