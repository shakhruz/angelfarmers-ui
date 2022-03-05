<template>
    <v-dialog transition="dialog-bottom-transition" max-width="450">
        <template v-slot:activator="{on,attrs}">
            <v-btn x-small text outlined class="blue white--text" v-bind="attrs" v-on="on">
                {{$t('BUY')}}&nbsp;AWAX
            </v-btn>
            &nbsp;&nbsp;
            <!-- <v-btn small text outlined class="blue white--text" v-bind="attrs" v-on="on">
                AWAX: {{formatAsset( farm.awax_balance )}}₳
            </v-btn> -->
        </template>
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark> 
                    {{$t("AWAX")}}
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.value = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                <div class="pa-1 ma-1">
                    <BuyAwaxDialog :farm="farm" @closeDialog="dialog.value = false"/>
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
import BuyAwaxDialog from "@/components/Dialogs/BuyAwaxDialog.vue";

export default {
  name: "SmallBuyAwaxButton",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  },
  components: {
      BuyAwaxDialog
  }
};
</script>

<style scoped lang="scss"></style>