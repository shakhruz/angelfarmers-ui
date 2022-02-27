<template>
    <div>
        <div v-if="(cows && cows.length>0) || (babies && babies>0)" class="mt-0 mb-0 pt-0 pb-0">
            <v-card-title class="my-0 py-1 mx-0 px-2">
                <v-chip label small>
                    <strong>{{$t("Raising COW")}}:</strong>
                </v-chip>
                <v-chip label small :color="'red--text'" outlined v-if="babies.length>0">
                    -{{babies.length*2}}
                    <img class="token" src="/fw/milk2.png"/>
                </v-chip>
                <v-chip label small :color="'red--text'" outlined>
                    -{{cows.length*4}}
                    <img class="token" src="/fw/barley_small.png"/>
                </v-chip>
            </v-card-title>
            <v-card-text class="my-0 mx-0 py-1 px-1">
                <span v-for="baby in babies" :key="baby.id" class="ma-0 px-1">
                    <v-chip label outlined>
                        <img class="calf_image" src="/fw/babycalf2.png"/>
                        &nbsp;&nbsp;
                        <small>
                            <strong :class="getMinsColor(baby.feed_mins)">
                                {{minsFormatted(baby.feed_mins)}}
                            </strong>
                        </small>&nbsp;&nbsp;
                        <small>
                            {{baby.times_claimed}}/{{baby.max_claim}}
                        </small>
                    </v-chip>
                </span>
                <span v-for="cow in cows" :key="cow.id" class="ma-0 px-1">
                    <v-chip label outlined>
                        <img class="calf_image" src="/fw/babycalf2.png"/>
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
    </div>
</template>

<script>
export default {
    name: "FarmCowshedInfo",
    props: ["farm"],
    data() {
        return {
            cows: [],
            babies: []
        }
    },  
    mounted() {
      this.cows = this.farm.animals.list.filter(a => this.isCow(a));
      this.babies = this.farm.animals.list.filter(a => this.isBabyCalf(a));
    },
    methods: {
        isCow(animal) {
          // телята
          return animal.template_id == "298599" || animal.template_id == "298600" ;
        },
        isBabyCalf(animal) {
          // телята
          return animal.template_id == "298597" ;
        },
    }    
}
</script>

<style scoped>
.calf_image {
    height: 18px;
    vertical-align: middle;
}
</style>