<template>
    <v-dialog transition="dialog-bottom-transition" max-width="800">
        <template v-slot:activator="{on,attrs}">
            <v-btn icon  v-bind="attrs" v-on="on">
                <v-icon>mdi-swap-horizontal</v-icon>
            </v-btn>                            
        </template>
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark> 
                    {{$t("Deposit/Withdraw")}} {{farm.account_name}}
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                <div class="pa-1 ma-1">
                    <FarmDepositDialog :farm="farm" @closeDialog="dialog.value = false"/>
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
import FarmDepositDialog from "@/components/Dialogs/FarmDepositDialog.vue";

export default {
  name: "FarmDepositButton",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  },
  components: {
      FarmDepositDialog
  }
};
</script>

<style scoped lang="scss"></style>