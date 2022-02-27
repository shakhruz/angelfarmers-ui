<template>
    <v-dialog v-model="dialog" max-width="1200px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon >mdi-cog</v-icon>
            </v-btn>            
        </template>
        <v-card class="pa-3">
            <v-card-title class="text-center justify-center py6">
                <h1 class="text-h5">Settings for {{fm.account_name}}</h1>
            </v-card-title>
            <small></small>
            <v-divider></v-divider>
            <v-row>
                <v-col>
                    <!-- <v-checkbox @change="updateFarm()" v-model="fm.settings.pause_all_actions" :label="`Pause all actions`" ></v-checkbox> -->
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.refill_energy" :label="`Refill energy from Food in the game when there is less than ${fm.settings.min_energy}`"></v-checkbox>
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.min_energy" 
                            label="Min energy">
                    </v-text-field>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.recover_tools" :label="`Repair tool when it's less than ${fm.settings.min_durability}% of max durability`"></v-checkbox>
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.min_durability" 
                            label="Min durability %">
                    </v-text-field>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.deposit_fwf" :label="`Deposit FWF token when there is less than ${fm.settings.min_food} FOOD`"></v-checkbox>
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.min_food" 
                            label="Minimal amount of food to keep in the farm. Will deposit FWF tokens if less than min">
                    </v-text-field>                
                </v-col>
                <v-col>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.claim_buildings" :label="`Claim buildings for construction`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.manage_tools" :label="`Manage tools (claim and repair)`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.plant_seeds" :label="`Plant seeds`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.buy_seeds" :label="`Buy seeds`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.claim_crops" :label="`Claim crops`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.hatch_eggs" :label="`Hatch eggs`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.feed_with_barley" :label="`Feed chicken with barley`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.feed_cow_with_barley" :label="`Feed cow with barley`"></v-checkbox> 
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.feed_with_milk" :label="`Feed baby calf with milk`"></v-checkbox>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.claim_members" :label="`Claim memberships`"></v-checkbox>
                    <div v-if="!fm.wax_login">
                        <v-text-field @change="updateFarm()" v-model="fm.settings.private_key" label="Private key"
                        type='password'>
                        </v-text-field>
                    </div>
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.delegated_account" 
                            label="Delegated account name:">
                    </v-text-field>                                        
                </v-col>
                <v-col>
                    <v-checkbox @change="updateFarm()" v-model="fm.settings.wear_buildings" label="Wear buildings"></v-checkbox>
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.send_crops_to" 
                            label="Send crops (barley, corn, eggs, milk) to account:">
                    </v-text-field>                    
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.send_food_to" 
                            label="Provide food to accounts:">
                    </v-text-field>                    
                    <v-text-field @change="updateFarm()"
                            v-model="fm.settings.send_barley_seeds_to" 
                            label="Provide barley seeds to accounts:">
                    </v-text-field>                    
                </v-col>                
            </v-row>
            <v-card-actions>
              <v-btn @click="resetSettings()">
                Reset to default
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="hideDialog()">
                Done
              </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>             
</template>

<script>

const defaultSettings = {
    pause_all_actions : false,
    refill_energy : true,
    min_energy : 250,
    recover_tools : true,
    min_durability : 50,
    min_food : 100,
    deposit_fwf : true,
    max_fwf_to_deposit : 400,
    deposit_fwg : true,
    max_fwg_to_deposit : 100,
    claim_buildings : true,
    manage_tools : true,
    plant_seeds : true,
    buy_seeds: false,
    claim_crops : true,
    hatch_eggs : true,
    feed_with_barley : true,
    claim_members : true,
    private_key: ''
};

export default {
  name: "FarmSettingsDialog",
  props: ['farm', 'deletable'],  
  data: () => ({
    dialog: false,   
    private_key: '',  
    show: false,   
    fm: {account_name: '', settings: defaultSettings},     
    index: 0,
    rules: {
          required: value => !!value || 'Required.',
          positive: value => value > 0 || 'Amount should be positive.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },    
    }),  
    mounted() {
        this.fm = this.farm;
        for(let i=0; i<this.$store.state.farms.length; i++) {
            if (this.$store.state.farms[i].account_name == this.farm.account_name) {
                this.index = i;
                break;
            }
        }
  },
  methods: {
    hideDialog() {
        this.dialog = false;
    },
    // сохраним изменения в настройках фермы
    updateFarm() {
        // if (this.deletable) this.$store.state.farms[this.index].settings = this.fm.settings;
        // else this.$store.state.mainFarm.settings = this.fm.settings;
        this.$store.state.farms[this.index].settings = this.fm.settings;
        this.$store.dispatch("saveFarms");
    },
    // сбросим настройки
    resetSettings() {
        const priv = this.fm.settings.private_key;
        this.fm.settings = defaultSettings;
        this.fm.settings.private_key = priv;
        this.updateFarm();
    },   
  },
  watch: {
  },
  computed: {
  },
  components: {
  }
};
</script>

<style scoped lang="scss"></style>