<template>
    <div v-if="chickens && chickens.length>0" class="my-0 py-0 px-0 mx-0">
        <v-card-title class="my-0 mx-0 py-1 px-2">
            <v-chip label small>
                <strong>{{$t("Raising CHICKEN")}}:</strong>
            </v-chip>
            <v-chip label small :color="'red--text'" outlined>
                -{{chickens.length*4}}
                <img class="token" src="/fw/barley_small.png"/>
            </v-chip>
        </v-card-title>
        <v-card-text class="my-0 mx-0 py-0 px-1">
            <span v-for="chicken in chickens" :key="chicken.id" class="ma-1">
                <v-chip label outlined class="mb-1">
                    <img class="token" src="/fw/chicken2.png"/>
                    &nbsp;&nbsp;
                    <small>
                        <strong :class="getMinsColor(chicken.feed_mins)">
                            {{minsFormatted(chicken.feed_mins)}}
                        </strong>
                    </small>&nbsp;&nbsp;
                    <small>
                        {{chicken.times_claimed}}/{{chicken.max_claim}}
                    </small>
                </v-chip>
            </span>
        </v-card-text>  
        <v-divider class="mx-1"></v-divider>    
    </div>
</template>

<script>
export default {
    name: "FarmChickenInfo",
    props: ["farm"],
    data() {
        return {
            chickens: [],
        }
    },  
    mounted() {
      this.chickens = this.farm.animals.list.filter(a => this.isChicken(a));
    },
    methods: {
      isChicken(animal) {
          return animal.template_id == "298614";
      },
    }    
}
</script>