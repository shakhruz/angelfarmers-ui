<template>
    <v-dialog transition="dialog-bottom-transition" max-width="350">
        <template v-slot:activator="{on,attrs}">
            <v-chip small label class="amber darken-4 white--text" v-bind="attrs" v-on="on">
                CPU: {{ formatAsset(farm.account.wax_staked) }}￦
            </v-chip>
            <!-- <v-btn icon  v-bind="attrs" v-on="on">
                <v-icon>mdi-circle-multiple-outline</v-icon>
            </v-btn>                             -->
        </template>
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark> 
                    {{$t("CPU Stake")}} {{farm.account_name}}
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                <div class="pa-1 ma-1">
                    <CPUStakeDialog :farm="farm" @closeDialog="dialog.value = false"/>
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
import CPUStakeDialog from "@/components/Dialogs/CPUStakeDialog.vue";

export default {
  name: "FarmCPUButton",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  },
  components: {
      CPUStakeDialog
  }
};
</script>

<style scoped lang="scss"></style>