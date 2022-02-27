<template>
    <v-dialog transition="dialog-bottom-transition" max-width="800">
        <template v-slot:activator="{on,attrs}">
            <v-btn icon  v-bind="attrs" v-on="on">
                <v-icon>mdi-hammer</v-icon>
            </v-btn>                            
        </template>
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark> 
                    {{$t("Craft")}} {{farm.account_name}}
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                <div class="pa-1 ma-1">
                    <FarmCraftDialog :farm="farm" @closeDialog="dialog.value = false"/>
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
import FarmCraftDialog from "@/components/Dialogs/FarmCraftDialog.vue";

export default {
  name: "FarmCraftButton",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  },
  components: {
      FarmCraftDialog
  }
};
</script>

<style scoped lang="scss"></style>