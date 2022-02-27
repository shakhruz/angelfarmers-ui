<template>
    <v-card 
        :id="farm.account_name"
        elevation="2" 
        outlined :color="farmBackgroundColor(farm)"
        min-width="200px"
        max-width="390px"
        v-if="farm!=null && farm.account!=null">
        <v-card-title>
            {{ farm.account_name }}
            <v-btn small icon @click="$clipboard(farm.account_name)">
                <v-icon small>mdi-content-copy</v-icon>
            </v-btn> 
            <FarmNameIcons :farm="farm"/>
            <v-spacer></v-spacer>
            <CPUInfo :cpu_used="farm.account.cpu_used_percent"/>
            <!-- <FarmSettingsDialog :farm="farm" />
            <v-btn small v-if="!farm.wax_login" icon @click="deleteFarmDialog(farm.account_name)">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>  -->
        </v-card-title>
        <v-card-subtitle>
            <div>
                <strong>
                    <span v-if="minsToAction > 0" class="green-timer">
                        {{ minutesToAction(minsToAction) }} 
                    </span> 
                    <span v-else-if="minsToAction < 0" class="orange-timer">
                        {{ minutesToAction(minsToAction) }} 
                    </span> 
                </strong>
                <span v-if="minsToAction!=null">&nbsp;|&nbsp;</span>                
                <span v-if="farm.daily_expense_food>0">
                    {{$t("Energy")}}:
                    <strong>
                    {{ minsFormatted((farm.tokens.fwf + farm.balance.food + farm.balance.energy / 5) / 
                                  (farm.daily_expense_food / 24 / 60)) }}
                    </strong>
                    <br/>
                </span>  
                <br/>              
                <div>
                    {{$t("Balance")}}: <strong>{{ formatAsset(farm.account.wax_balance) }}￦</strong> | 
                    {{$t("CPU")}}: {{ formatAsset(farm.account.wax_staked) }}￦
                    <br/>
                    {{$t("GEAR")}}: {{ formatAsset(farm.total_wax)}}￦ /
                    ${{ formatAsset(farm.total_wax*farm.prices.wax)}}
                </div>
                <span v-if="farm.profit_wax>0">
                    {{$t("Daily Profit")}}: 
                    <span>
                        <strong>{{ formatAssetPrice(farm.profit_wax)  }}￦</strong> 
                    </span>                
                    &nbsp;/ ${{ formatAssetPrice(farm.profit_wax * farm.prices.wax)  }}
                </span>
            </div>
        </v-card-subtitle>
        <v-divider class="mx-1"></v-divider>    
        <v-card-actions>
            <!-- <v-btn color="secondary" text @click="$store.state.showAll = !$store.state.showAll">More Info</v-btn> -->
            <!-- <v-spacer></v-spacer> -->
            <v-btn v-if="!farm.wax_login" icon @click="deleteFarmDialog(farm.account_name)">
                <v-icon >mdi-delete</v-icon>
            </v-btn> 
            <FarmSettingsDialog :farm="farm" />
            <v-btn icon v-if="farm.settings.pause_all_actions" @click = '$store.commit("pauseFarm", {account_name: farm.account_name, paused: false})'>
                <v-icon>mdi-play</v-icon>
            </v-btn>        
            <v-btn icon v-else @click = '$store.commit("pauseFarm", {account_name: farm.account_name, paused: true})'>
                <v-icon>mdi-pause</v-icon>
            </v-btn>        
            <v-btn icon @click = '$store.dispatch("updateFarm", farm.account_name);checkFarmActions(farm.account_name)'>
                <v-icon>mdi-cached</v-icon>
            </v-btn>        
            <!-- <v-btn icon @click="$store.state.showAll = !$store.state.showAll">
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn> -->
        </v-card-actions>        
        <v-divider class="mx-1"></v-divider>    
        <v-expand-transition>
        <div v-show="$store.state.showAll">
        <FarmProfits :farm="farm"/>
        <v-card-text class="text--primary">            
            <v-divider class="mx-1"></v-divider>
            <v-card-subtitle class="ma-0 pa-0">
                {{$t("IN GAME")}}
                <small>
                    ({{formatAsset(farm.balance.gold * farm.prices.fwg + farm.balance.food*farm.prices.fwf + farm.balance.wood * farm.prices.fww)}}￦)
                </small>
            </v-card-subtitle>
            <v-chip-group column>
                <v-chip :color="getGoldColor(farm.balance.gold)" small>
                    <div class="quote">
                        <img class="token" src="/fw/FWG2.png"/>
                        {{ formatAssetPrice(farm.balance.gold) }}
                    </div>                    
                </v-chip>
                <v-chip small>
                    <div class="quote">
                        <img class="token" src="/fw/FWW2.png"/>
                        {{ formatAssetPrice(farm.balance.wood) }}
                    </div>                                        
                </v-chip>
                <v-chip :color="getFoodColor(farm.balance.food)" small>
                    <div class="quote">
                        <img class="token" src="/fw/FWF2.png"/>
                        {{ formatAssetPrice(farm.balance.food) }}
                    </div>                    
                </v-chip>
                <v-chip small :color="getEnergyColor(farm.balance.energy, farm.balance.max_energy)">
                    <v-icon>mdi-lightning-bolt</v-icon>
                    {{ farm.balance.energy }} / {{ farm.balance.max_energy }}
                </v-chip>
            </v-chip-group>
            <v-divider class="mx-1"></v-divider>
            <Tokens v-bind:farm="farm"/>
            <v-chip-group column>
            </v-chip-group>

            <div v-if="farm.assets && farm.assets.unique && farm.assets.unique.length > 0">
                <v-divider class="mx-1"></v-divider>
                <v-card-subtitle class="ma-0 pa-0">
                    {{$t("CHEST")}}  
                    <span class="caption">
                        (total: {{formatAssetPrice(farm.assets.total_wax)}}￦)
                    </span>
                </v-card-subtitle>
                <span v-for="asset in farm.assets.unique" :key="asset.id" class="gamecard_info">
                    <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                            <span
                                v-bind="attrs"
                                v-on="on"
                                >
                                <a :href="atomicUrl(asset.template_id)" target='_blank'>
                                    <img :src="`/fw/assets/${asset.template_id}.png`" class="gamecard">
                                </a>
                            </span>
                        </template>
                        <span>
                            <strong>{{ $t(asset.name).toUpperCase() }}</strong><br/>
                            {{$t("cost")}}: <strong>{{formatAssetPrice(asset.cost)}}￦</strong><br/>
                            {{$t("price")}}: <strong>{{formatAssetPrice(asset.price)}}￦</strong><br/>
                            {{$t("total cost")}}: {{formatAssetPrice(asset.cost)}}x{{asset.counter}} =
                            <strong>{{formatAssetPrice(asset.cost * asset.counter)}}￦</strong><br/>
                            {{$t("total price")}}: {{formatAssetPrice(asset.price)}}x{{asset.counter}} =
                            <strong>{{formatAssetPrice(asset.price * asset.counter)}}￦</strong><br/>
                        </span>
                        <!-- <a :href="atomicUrl(asset.template_id)" target='_blank'>OPEN ATOMIC</a> -->
                    </v-tooltip> 
                    <span class="chest_counter">{{ asset.counter }}</span>
                </span>
            </div>
            
            <div v-if="farm.buildings && farm.buildings.list && farm.buildings.list.length > 0">
                <v-divider class="mx-1"></v-divider>
                <v-card-subtitle class="ma-0 pa-0">
                    {{$t("BUILDINGS & MEMBERS")}}
                </v-card-subtitle>
                <span v-for="building in farm.buildings.list" :key="building.id" class="gamecard_info">
                    <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                            <span
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-badge bordered overlap color="error" icon="mdi-exclamation-thick" offset-y="11px" offset-x="12px" :value="building.is_ready==0 && building.claim_mins<1">
                                    <img :src="`/fw/assets/${building.template_id}.png`" class="building" :title="buildingTitle(building)">
                                </v-badge>
                                <span class="tool_timer" >
                                    {{minsFormatted(building.claim_mins)}}
                                </span>

                                <div class="progressBar2" v-if="building.is_ready==0">
                                    <div class="progressBarFilled2" :style="`width: ${buildingProgress(building)}%`"></div>
                                </div>
                            </span>
                        </template>
                        <span>
                            <strong>{{ $t(building.name).toUpperCase() }}</strong><br/>
                            {{$t("cost")}}: <strong>{{formatAssetPrice(building.bld_cost)}}￦</strong><br/>
                            <span v-if="building.is_ready==0">
                                {{$t("Construction progress")}}: {{building.times_claimed}}/{{building.max_claims}}<br/>
                                {{$t("Time to claim")}}: {{building.claim_mins}} {{$t("mins")}}
                                <br/>
                                {{$t("Total time")}}: {{minsFormatted(building.max_claims * 30)}} {{$t("mins")}}
                            </span>
                            <br/>
                            {{$t("Construction cost")}}: {{building.construction_cost}} Energy<br/> 
                            ({{ formatAsset(building.construction_cost/5) }} FOOD, 
                            {{ formatAsset(building.construction_cost/5*farm.prices.fwf) }}￦)
                            <br/>
                        </span>
                    </v-tooltip> 
                </span>
                <span v-for="member in farm.mbs.list" :key="member.id" class="gamecard_info">
                    <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                            <span
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-badge bordered overlap color="error" icon="mdi-exclamation-thick" offset-y="11px" offset-x="12px" :value="member.claim_mins<1">
                                    <img :src="`/fw/assets/${member.template_id}.png`" class="gamecard" :title="toolTitle(member)">
                                </v-badge>
                                <span class="tool_timer" >
                                    {{minsFormatted(member.claim_mins)}}
                                </span>
                                <div class="progressBar2">
                                    <div class="progressBarFilled2" :style="`width: ${(100 - (member.mins/(60*24))*100)}%`"></div>
                                </div>
                            </span>
                        </template>
                        <span>
                            <strong>{{ $t(member.name).toUpperCase() }}</strong><br/>
                            {{$t("food needed")}}: 
                            <span class="quote">
                                <img class="token" src="/fw/FWF2.png"/>
                                {{ formatAssetPrice(member.daily_expense_food,0) }}
                                ({{formatAssetPrice(member.daily_expense_food * farm.prices.fwf)}}￦)
                            </span>
                            <br/><br/>
                            {{$t("claim in")}} <strong>{{minsFormatted(member.claim_mins)}}</strong><br/>
                            {{$t("output: 2 farmer coins")}}
                        </span>
                    </v-tooltip> 
                </span>
            </div>

            <div v-if="farm.tools && farm.tools.list && farm.tools.list.length > 0">
                <v-divider class="mx-1"></v-divider>
                <v-card-subtitle class="ma-0 pa-0">
                    {{$t("MINING")}}
                    <span class="caption">
                        ({{$t("daily")}}: 
                        <span class="quote" v-if="farm.tools.hourly_output_wood>0">
                            {{ formatAssetPrice(farm.tools.hourly_output_wood * 24) }}<img class="token" src="/fw/FWW2.png"/>
                        </span>                       
                        <span class="quote" v-if="farm.tools.hourly_output_gold>0">
                            {{ formatAssetPrice(farm.tools.hourly_output_gold * 24) }}<img class="token" src="/fw/FWG2.png"/>
                        </span>                       
                        <span class="quote" v-if="farm.tools.hourly_output_food>0">
                            {{ formatAssetPrice(farm.tools.hourly_output_food * 24) }}<img class="token" src="/fw/FWF2.png"/>
                        </span>                       
                        +{{ formatAssetPrice(farm.tools.daily_profit_wax)}}￦) 
                    </span>
                </v-card-subtitle>
                <span v-for="tool in farm.tools.list" :key="tool.id" class="gamecard_info">
                    <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                            <span
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-badge bordered overlap color="error" icon="mdi-exclamation-thick" offset-y="20px" offset-x="22px" 
                                    :value="!(tool.claim_mins > 1 && tool.current_durability > (tool.durability/2))">
                                    <img :src="`/fw/assets/${tool.template_id}.png`" class="gamecard">
                                </v-badge>
                                <span class="tool_timer" >
                                    {{minsFormatted(tool.claim_mins)}}
                                </span>
                                <div class="progressBar2">
                                    <div class="progressBarFilled2" :style="`width: ${toolProgress(tool)}%`"></div>
                                </div>
                            </span>
                        </template>
                        <span>
                            <FarmToolInfo :tool="tool" :farm="farm" />
                        </span>
                    </v-tooltip>                            
                </span>
            </div>

            <div v-if="farm.animals && farm.animals.list && farm.animals.list.length > 0">
                <v-divider class="mx-1"></v-divider>
                <v-card-subtitle class="ma-0 pa-0">
                    {{$t("ANIMALS")}}
                    <span class="caption">
                        ({{$t("daily")}}: 
                        -{{ farm.animals.daily_expense_barley }}<img class="token" src="/fw/barley_small.png"/>
                        {{$t("output")}}:
                        {{ farm.animals.daily_output_gold }}<img class="token" src="/fw/FWG2.png"/>)
                    </span>
                </v-card-subtitle>
                <div class="crops">
                    <span v-for="animal in farm.animals.list" :key="animal.id" class="animal">
                        <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                                <span
                                v-bind="attrs"
                                v-on="on"
                                >
                                    <v-badge bordered overlap color="error" icon="mdi-exclamation-thick" offset-y="20px" offset-x="20px" :value="animal.feed_mins<1">
                                        <img :src="`/fw/assets/${animal.template_id}.png`" class="gamecard_animal" :title="animalTitle(animal)">
                                    </v-badge>
                                    <span class="animal_counter" >
                                        {{ animal.times_claimed }}/{{animal.max_claim}}
                                    </span>
                                    <span class="animal_timer" >
                                        {{minsFormatted(animal.feed_mins)}}
                                    </span>
                                    <div class="progressBar2">
                                        <div class="progressBarFilled2" :style="`width: ${(animal.times_claimed / animal.max_claim*100)}%`"></div>
                                    </div>
                                </span>
                            </template>
                            <span>
                                <FarmCalfInfo :animal="animal" :farm="farm" v-if="animal.template_id=='298597' || animal.template_id=='298599' || animal.template_id=='298600'"/>
                                <FarmAnimalInfo :animal="animal" :farm="farm" v-else/>                                
                            </span>
                        </v-tooltip>
                    </span>
                </div>
            </div>

            <div v-if="farm.crops && farm.crops.list && farm.crops.list.length > 0">
                <v-divider class="mx-1"></v-divider>
                <v-card-subtitle class="ma-0 pa-0">
                    {{$t("CROPS")}}
                    <span class="caption">
                        ({{$t("daily")}}: 
                        -{{ farm.crops.hourly_feed * 24 }}<img class="token" src="/fw/FWF2.png"/>, 
                        ETA: {{ minsFormatted(farm.next_crop_time) }},
                        {{$t("full")}}:{{farm.crops.total_food_for_crops}}<img class="token" src="/fw/FWF2.png"/>)
                    </span>
                </v-card-subtitle>
                <div class="crops">
                    <span v-for="crop in farm.crops.list" :key="crop.id" class="crop">
                        <v-tooltip top color="primary" allow-overflow open-on-click max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                            <span
                            v-bind="attrs"
                            v-on="on"
                            >
                                <v-badge bordered overlap color="error" icon="mdi-exclamation-thick" offset-y="35px" offset-x="25px" :value="crop.crop_mins<1">
                                    <img :src="`/fw/assets_crops/${crop.template_id}.png`" class="gamecard_crops">
                                </v-badge>
                                <span class="crop_counter" >
                                    {{ crop.times_claimed }}/42
                                </span>
                                <span class="crop_timer" >
                                    {{ minsFormatted(crop.crop_mins) }}
                                </span>
                                <div class="progressBar">
                                    <div class="progressBarFilled" :style="`width: ${crop.times_claimed/42*100}%`"></div>
                                </div>
                            </span>
                            </template>
                            <FarmCropInfo :crop="crop" :farm="farm" />
                        </v-tooltip>
                    </span>                    
                </div>
            </div>                        
        </v-card-text>   
        </div></v-expand-transition>
    </v-card>
</template>

<script>
import Tokens from "@/components/FarmInfo/Tokens.vue";
import FarmSettingsDialog from "@/components/Dialogs/FarmSettingsDialog.vue";
import CPUInfo from "@/components/FarmInfo/CPUInfo.vue";
import FarmProfits from "@/components/FarmInfo/FarmProfits.vue";
import FarmNameIcons from "@/components/FarmInfo/FarmNameIcons.vue";
import FarmAnimalInfo from "@/components/FarmInfo/FarmAnimalInfo.vue";
import FarmCalfInfo from "@/components/FarmInfo/FarmCalfInfo.vue";
import FarmToolInfo from "@/components/FarmInfo/FarmToolInfo.vue";
import FarmCropInfo from "@/components/FarmInfo/FarmCropInfo.vue";

export default {
  name: "FarmCard",
  props: ['farm'],
  data: () => ({
    show: true,
  }),
  async mounted() {
  },
  methods: {
      toolProgress(tool) {
          let hour = 60;
          if (tool["template_id"] == "378691") hour = 120;
          let progress = (100 - tool.claim_mins/hour*100);
          if (progress>100) progress = 100;
          if (progress<0) progress = 0;
          return progress;
      },
      toolTitle(tool) {
          return tool.name;
      },
      assetTitle(asset) {
          return asset.name;
      },
      animalTitle(animal) {
          return animal.name;
      },
      mbsTitle(member) {
          return member.name;
      },
      buildingTitle(building) {
          return building.name;
      },
      // прогресс постройки в %
      buildingProgress(building) {
          return (building.times_claimed / building.max_claims * 100);
      },
  },
  computed: {
      minsToAction: function() {
            const nowTime = new Date();
            if (this.farm.next_action_date==null) return null;
            return Math.round((this.farm.next_action_date - nowTime)/1000/60);
      },
  },
  components: {
    Tokens, FarmSettingsDialog, CPUInfo, FarmProfits, FarmNameIcons, FarmAnimalInfo, FarmCalfInfo, FarmToolInfo, FarmCropInfo
  },    
};
</script>

<style scoped lang="scss">
.problem {
    border: red;
    border-style: dashed;
    border-width: 3px;
}

.building {
    height: 60px;
    margin: 5px;
    transition: all .2s ease-in-out;        
}

.building:hover{
    transform: scale(1.1);
}

.gamecard {
    height: 60px;
    margin: 5px;
    transition: all .2s ease-in-out;        
}

.gamecard:hover{
    transform: scale(1.1);
}

.gamecard_animal {
    height: 60px;
    margin: 5px;
    transition: all .2s ease-in-out;        
}

.gamecard_animal:hover{
    transform: scale(1.1);
}

.gamecard_animal_info {
    position: relative;
    border: 1px;
    border-color: black;
}

.gamecard_info {
    position: relative;
    border: 1px;
    border-color: black;
}

.gamecard_crops {
    height: 80px;
    margin: 5px;
    transition: all .2s ease-in-out;    
}

.gamecard_crops:hover{
    transform: scale(1.1);
}

.counter {
    position:absolute;
    left: 22px;
    top: 3px;
    font-weight: bold;
    font-size: 0.7em;
}

.chest_counter {
    position:absolute;
    left: 15%;
    top: -90%;
    color: white;
    font-size: 1.2em;
    -webkit-text-fill-color: white;
    text-shadow: -1px 1px 2px #000,
				  1px 1px 2px #000,
				  1px -1px 0 #000,
				  -1px -1px 0 #000;
}

.crop {
    position: relative;
    border: 1px;
    border-color: black;
}

.animal {
    position: relative;
    border: 1px;
    border-color: black;
}

.crop_timer {
    position:absolute;
    left: 15px;
    top: -15px;
    color:white;
    font-weight: bold;
    font-size: 0.8em;
}

.crop_counter {
    position:absolute;
    left: 15px;
    top: 15px;
    color:grey;
    font-weight: bold;
    font-size: 0.8em;
}

.animal_counter {
    position:absolute;
    left: 8px;
    top: -10px;
    // color:grey;
    color: black;
    font-weight: bold;
    font-size: 0.8em;
    opacity: 0.7;
    -webkit-text-fill-color: white;
    text-shadow: -1px 1px 2px #000,
				  1px 1px 2px #000,
				  1px -1px 0 #000,
				  -1px -1px 0 #000;

}

.animal_timer {
    position:absolute;
    left: 7px;
    // top: -49px;
    top: -50px;
    color: black;
    // background-color: #BDBDBD;
    font-weight: bold;
    z-index: 1;
    opacity: 0.7;
    color: white;
    font-size: 1em;
    -webkit-text-fill-color: white;
    text-shadow: -1px 1px 2px #000,
				  1px 1px 2px #000,
				  1px -1px 0 #000,
				  -1px -1px 0 #000;

}

.tool_timer {
    position:absolute;
    left: 7px;
    top: -50px;
    color: black;
    font-weight: bold;
    z-index: 1;
    opacity: 0.7;
    color: white;
    font-size: 1.0em;
    -webkit-text-fill-color: white;
    text-shadow: -1px 1px 2px #000,
				  1px 1px 2px #000,
				  1px -1px 0 #000,
				  -1px -1px 0 #000;

}

.progressBar {
  position: absolute;
  left: 12px;
  top: 12px;
  background-color: rgb(209, 205, 205);
  height: 4px;
  width: 50px;
}

.progressBarFilled {
  width: 1%;
  height: 30px;
  background-color:#76FF03;
  height: 4px;
}

.progressBar2 {
  position: absolute;
  left: 10px;
  top: 12px;
  background-color: rgb(209, 205, 205);
  height: 4px;
  width: 35px;
}

.progressBarFilled2 {
  width: 1%;
  height: 30px;
  background-color:#76FF03;
  height: 4px;
}

.green-timer {
    color: #388E3C;
}

.red-timer {
    color: #FF3D00;
}



</style>
