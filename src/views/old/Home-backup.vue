<template>
  <div id="home">
    <!-- <v-card elevation="2">
      <div id="loading" style="text-align:left" v-if="logged_in && game.last_updated==null">
        загрузка...
      </div>
      <div style="text-align:left" v-if="logged_in && game.last_updated!=null">
        <div>
          <span>WAXP: ${{ formatLongAsset(game.wax_price) }} </span>
          <span>FWW: {{ formatLongAsset(game.fww_price) }} </span>
          <span>FWG: {{ formatLongAsset(game.fwg_price) }} </span>
          <span>FWF: {{ formatLongAsset(game.fwf_price) }} </span>
        </div>
        <div>
          Токены:
          <span><b>{{ formatAssetPrice(game.fww_balance) }}</b> FWW | </span>
          <span><b>{{ formatAssetPrice(game.fwg_balance) }}</b> FWG | </span>
          <span><b>{{ formatAssetPrice(game.fwf_balance) }}</b> FWF</span>        
        </div>
        <div>
          В игре:
          <span><b>{{ formatAssetPrice(game.wood) }}</b> wood | </span>
          <span><b>{{ formatAssetPrice(game.gold) }}</b> gold | </span>
          <span><b>{{ formatAssetPrice(game.food) }}</b> food</span>        
        </div>
        <div>
          <div>
            <span>Энергия:  </span>
            <b>{{ game.energy }} / {{ game.max_energy }} </b> |  
            Вывод: <span><b>{{ game.fee }}</b>% </span>
            <span>({{ minsPassedFormat(game.last_fee_updated) }})</span>
          </div>
        </div>
      </div>
    </v-card> -->
    <!-- <v-card>
      <div v-if="game.tools.length > 0">
        <strong>Инструменты:</strong>
        <ul id="tools_list">
          <li v-for="tool in game.tools" :key="tool.id">
            <span>{{ tool.id }}. </span>
            <span>{{ tool["name"] }} - {{ tool["current_durability"] }}/{{ tool["durability"] }} </span>
            <strong>({{ minsFormatted(tool["claim_mins"]) }})</strong>
          </li>
        </ul>
        <div>
          <div>
              Расход:  
              <b>{{ formatAsset(game.tools_energy / 5 * 24) }}</b>  food/день 
              <b>{{ formatAsset(game.tools_durability * 0.2 * 24) }}</b> gold/день
          </div>
          <div v-if="game.tools_output_wood > 0">
            Добыча дерева:
            <b>{{ formatAsset(game.tools_output_wood * 24) }}</b> wood/день
          </div> 
          <div v-if="game.tools_output_food > 0">
            Добыча еды:
            <b>{{ formatAsset(game.tools_output_food * 24) }}</b> food/день
          </div>
          <div v-if="game.tools_output_gold > 0">
            Добыча золота:
            <b>{{ formatAsset(game.tools_output_gold * 24) }}</b> gold/день
         </div>
         <div>
            Прибыль в месяц: 
            <strong>{{ formatAsset(game.total_tool_income * 30) }} wax</strong>
            (${{ formatAsset(game.total_tool_income * game.wax_price * 30) }}/мес)
          </div>
        </div>
      </div>
    </v-card> -->
    <!-- <v-card>
      <div v-if="game.animals.length > 0">
        <strong>Животные:</strong>
        <ul id="animals_list">
          <li v-for="animal in game.animals" :key="animal.id">
            <span>{{ animal.id }}. </span>
            <span>{{ animal["name"] }} - {{ animal["times_claimed"] }}/{{animal["max_claim"]}} </span>
            <strong>({{ minsFormatted(animal["feed_mins"]) }})</strong>
          </li>
        </ul>
      </div>
      <br/>
    </v-card> -->
    <!-- <v-card>
      <div v-if="game.crops.length > 0">
        <strong>Растения:</strong>
        <ul id="crops_list">
          <li v-for="crop in game.crops" :key="crop.id">
            {{ crop.id }}. {{ crop["name"] }} {{ crop["times_claimed"] }}/42
            <span>
              <strong>
                ({{ minsFormatted(crop["crop_mins"]) }})
              </strong>
            </span>
          </li>
        </ul>
        <div>
          Следующий урожай через 
          <span><strong>{{ minsFormatted(game.next_crop_time) }}. </strong></span>
          <span> Всего соберем: 
            <b>{{ formatAsset(game.crop_balance_wax) }}</b> wax
            (${{ formatAsset(game.crop_balance_wax * game.wax_price) }})
          </span>

        </div>
        <div v-if="game.food_needed>0">
           Для полного полива нужно добавить:
           <span>{{ formatAsset(game.food_needed) }} food </span>
           <span>({{ formatAsset(game.food_needed * game.fwf_price) }} wax)</span>
        </div>
        <div v-if="game.hourly_feed > 0">
           Еды и энергии хватит на  
           <strong>{{ minsFormatted((game.food + game.energy / 5) / game.hourly_feed * 60) }}</strong>
        </div>
      </div>
    </v-card> -->
    <!-- <v-card>
      <div v-if="game.mbs.length > 0">
        <strong>Members:</strong>
        <ul id="mbs_list">
          <li v-for="mbs in game.mbs" :key="mbs.id">
            {{ mbs.id }}. {{ mbs["name"] }} 
            <span>
              <strong>
                ({{ minsFormatted(mbs["mins"]) }}
               - {{ minsFormatted(mbs["unstaking_mins"]) }})
              </strong>
            </span>
          </li>
        </ul>
      </div>
    </v-card> -->
    <!-- <v-card>
      <div v-if="game.buildings.length > 0">
        <strong>Здания:</strong>
        <ul id="buildings_list">
          <li v-for="bld in game.buildings" :key="bld.id">
            {{ bld.id }}. {{ bld["name"] }} ({{bld["slots_used"] }})
          </li>
        </ul>
      </div>
      <div v-if="game.unique_assets.length > 0">
        <strong>Сундук:</strong>
        <ul id="chest_list">
          <li v-for="atomic in game.unique_assets" :key="atomic.id">
            {{ atomic.id }}. {{ atomic["name"] }} x {{ atomic["counter"] }}шт. по {{ formatAsset(atomic["cost"])}} wax =
            {{ formatAsset(atomic["counter"] * atomic["cost"] ) }}wax 
            (${{ formatAsset(atomic["counter"] * atomic["cost"]*game.wax_price) }})
          </li>
        </ul>
      </div>
    </v-card> -->
    <!-- <p>аккаунт фермы: <input type="text" v-model="ownerAccount" /></p>     -->
    <pre><code id="response" class="hljs"></code></pre>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // timer: null,
      // ownerAccount: "",
      // game:this.game_state(),
    };
  },
  async mounted() {
    // this.$store.dispatch("startTimer");
    // this.game = this.game_state();
    // await this.autoLogin();
    // this.startTimer();
  },
  methods: {  
    // async startTimer() {
    //   console.log("start Timer for every minute");
    //   this.$store.commit('startChecking');

    //   this.timer = setInterval(async () => {
    //     this.game = this.game_state();
    //     const nowTime = new Date();
    //     if (this.game.next_claim_date!=null) {
    //       this.game.mins_to_action = Math.round((this.game.next_claim_date - nowTime)/1000/60);
    //     }

    //     if (this.$store.state.currentTime <= 0 ) {
    //       if ( this.game.mins_to_action <= 0) {
    //         this.farmer_check_account(this.ownerAccount).then((res)=>{
    //           console.log("проверка прошла")
    //           this.$store.commit('resetCheckTime');
    //         });
    //       } else {
    //         await this.updateGameState(this.ownerAccount);            
    //       }

    //     } else if (this.$store.state.is_checking) this.$store.dispatch("decrementCheckTime");

    //   }, 1000)
    // },
    // async stopTimer() {
    //   console.log("stop timer");
    //   this.$store.commit('stopChecking');

    //   clearTimeout(this.timer);
    // }    
  }
};
</script>