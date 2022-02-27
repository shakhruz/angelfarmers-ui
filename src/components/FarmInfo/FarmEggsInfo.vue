<template>
    <div v-if="eggs && eggs.length>0" class="mt-0 mb-0 pt-0 pb-0">
        <v-card-title class="my-0 py-1 mx-0 px-2">
            <v-chip label small>
                <strong>{{$t("Raising CHICS")}}:</strong>
            </v-chip>
        </v-card-title>
        <v-card-text class="my-0 mx-0 py-1 px-1">
            <span v-for="egg in eggs" :key="egg.id" class="ma-0 px-1">
                <v-chip label outlined>
                    <img class="token" src="/fw/chickenegg2.png"/>
                    &nbsp;&nbsp;
                    <small>
                        <strong :class="getMinsColor(egg.feed_mins)">
                            {{minsFormatted(egg.feed_mins)}}
                        </strong>
                    </small>&nbsp;&nbsp;
                    <small>
                        {{egg.times_claimed}}/{{egg.max_claim}}
                    </small>
                </v-chip>
            </span>
        </v-card-text>  
        <v-divider class="mx-1"></v-divider>    
    </div>
</template>

<script>
export default {
    name: "FarmEggsInfo",
    props: ["farm"],
    data() {
        return {
            eggs: [],
        }
    },  
    mounted() {
      this.eggs = this.farm.animals.list.filter(a => this.isCow(a));
    },
    methods: {
      isCow(animal) {
          // яйца и цыплята
          return animal.template_id == "298612" || animal.template_id == "298613" ;
    },
  }    
}
</script>