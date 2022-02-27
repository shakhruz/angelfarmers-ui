<template>
    <div v-if="cows && cows.length>0" class="mt-0 mb-0 pt-0 pb-0">
        <v-card-title class="my-0 py-1 mx-0 px-2">
            <v-chip label small>
                <strong>{{$t("Milking COW")}}:</strong>
            </v-chip>
            <v-chip label small :color="'red--text'" outlined>
                -{{cows.length*6}}
                <img class="token" src="/fw/barley_small.png"/>
            </v-chip>
            <v-chip label small :color="'green--text'" outlined>
                {{cows.length*3*140}}
                <img class="token" src="/fw/FWG2.png"/>
            </v-chip>                          
            <v-chip label small :color="'green--text'" outlined>
                {{ formatAsset(cows.length*3*140*farm.prices.fwg)}}￦
            </v-chip>                          
            <v-chip label small :color="'green--text'" outlined>
                ${{ formatAsset(cows.length*3*140*farm.prices.fwg*farm.prices.wax)}}
            </v-chip>                          
        </v-card-title>
        <v-card-text class="my-0 mx-0 py-1 px-1">
            <span v-for="cow in cows" :key="cow.id" class="ma-0 px-1">
                <v-chip label outlined>
                    <img class="token" src="/fw/dairycow2.png"/>
                    &nbsp;&nbsp;
                    <small>
                        <strong :class="getMinsColor(cow.feed_mins)">
                            {{minsFormatted(cow.feed_mins)}}
                        </strong>
                    </small>&nbsp;&nbsp;
                    <small>
                        {{cow.times_claimed}}/{{cow.max_claim}}
                    </small>
                </v-chip>
            </span>
        </v-card-text>  
        <v-divider class="mx-1"></v-divider>    
    </div>
</template>

<script>
export default {
    name: "FarmCowshedInfo",
    props: ["farm"],
    data() {
        return {
            cows: [],
        }
    },  
    mounted() {
      this.cows = this.farm.animals.list.filter(a => this.isCow(a));
    },
    methods: {
      isCow(animal) {
          return animal.template_id == "298607";
      },
    }    
}
</script>