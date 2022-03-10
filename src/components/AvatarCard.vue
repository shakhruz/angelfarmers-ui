<template>
    <div>
        <v-card elevation="2" 
            :min-width="$vuetify.breakpoint.mobile ? '300px' : '300px'"
            :max-width="$vuetify.breakpoint.mobile ? '300px' : '300px'"
        class="justify-center" raised rounded="lg"
        :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-2 white--text'">
            <span v-if="avatar" >
                <v-card-subtitle class="white--text">
                    <a :href="`https://wax.atomichub.io/explorer/asset/${avatar.asset_id}`" target="_blank">
                        <img :src="avatar.image_url" width="100%">
                    </a>
                </v-card-subtitle>
                <v-divider></v-divider>
                <v-card-text>
                    <div>
                        name: {{avatar.name}}
                    </div>
                    <div v-if="avatar.bio">
                        bio: {{avatar.bio}}
                    </div>
                    <div v-if="avatar.link">
                        link: <a :href="avatar.link" target="_blank">{{avatar.link}}</a>
                    </div>
                </v-card-text>
                <!-- <v-divider></v-divider> -->
                <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon @click = '' class="white--text">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>                            
                    <v-btn icon @click = '' class="white--text">
                        <v-icon>mdi-square-edit-outline</v-icon>
                    </v-btn>                          
                    <v-btn icon @click = '' class="white--text">
                        <v-icon>mdi-email-fast-outline</v-icon>
                    </v-btn>                          
                </v-card-actions> -->
            </span>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "AvatarCard",
    props: ["avatar"],
    data() {
        return {
        }
    },
    components: {
    },
    methods: {  
    },
    mounted() {
    },
    computed: {
    }
};
</script>

<style></style>
