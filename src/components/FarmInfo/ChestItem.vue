<template>
    <v-dialog transition="dialog-bottom-transition" max-width="600">
        <template v-slot:activator="{on,attrs}">
            <v-chip label outlined class="mr-1 green mb-1">
                <span v-bind="attrs" v-on="on">                                
                    {{$t(asset.name).toUpperCase()}}
                    x
                    <span>{{ asset.counter }}</span>
                </span>
            </v-chip>
        </template>
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark> 
                    {{$t(asset.name).toUpperCase()}} 
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                <div class="pa-1 ma-1">
                    <ChestItemDialog :farm="farm" :asset="asset" @closeDialog="dialog.value = false"/>
                </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">{{$t('Close')}}</v-btn>
                </v-card-actions>
            </v-card>                        
        </template>
    </v-dialog>    
</template>

<script>
import ChestItemDialog from "@/components/Dialogs/ChestItemDialog.vue";

export default {
  name: "ChestItem",
  props: ["farm", "asset"],
  async mounted() {
  },
  methods: {
  },
  components: {
      ChestItemDialog
  }
};
</script>

<style scoped lang="scss"></style>