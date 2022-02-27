<template>
    <v-dialog v-model="dialog" max-width="1200px">
        <template v-slot:activator="{ on, attrs }">
            <!-- <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon small>mdi-cog</v-icon>
            </v-btn>             -->
        </template>
        <v-card class="pa-3">
            <v-card-title class="text-center justify-center py6">
                <h1 class="text-h5">Transfer to</h1>
            </v-card-title>
            <small></small>
            <v-divider></v-divider>
            <v-row>
                <v-col>
                    <v-select v-model="sendTo" 
                        label="Send to" 
                        :items="farms_list" 
                        required></v-select>

                </v-col>           
            </v-row>
            <v-card-actions>
              <v-btn color="cancel" @click="hideDialog()">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="hideDialog()">
                Done
              </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>             
</template>

<script>

export default {
    name: "TransferAccountDialog",
    props: ["dialog"],
    data: () => ({
        // dialog: false,
        farms_list: [],
        sendTo: null,
    }),
    mounted() {
        this.farms_list = [];
        this.$store.state.farms.forEach(f => {
            this.farms_list.push(f.account_name);
        })
        this.sendTo = this.$store.state.farms.length > 0 ? this.$store.state.farms[0] : '';    
    },
    methods: {
        showDialog() {
            this.dialog = true;
        },
        hideDialog() {
            this.dialog = false;
        },
    },
};
</script>

<style scoped lang="scss"></style>