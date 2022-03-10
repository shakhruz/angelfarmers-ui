<template>
    <div v-if="$store.state.logged_in">
        <v-card elevation="2" 
            :min-width="$vuetify.breakpoint.mobile ? '300px' : '300px'"
            :max-width="$vuetify.breakpoint.mobile ? '350px' : '350px'"
        class="justify-center" raised rounded="lg"
        :color="this.$vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-2 white--text'">
            <div class="text-h5 text-center align-center pa-1 mx-auto mb-1 pb-1">
                {{$t("Avatar Minter")}}
            </div>
            <v-card-subtitle class="align-center text-center mt-0 mb-0 pt-0 pb-0  white--text">
                {{$t("Mint your own NFTAvatar")}}
            </v-card-subtitle>
            <div class="ma-4 mt-1 mb-1 pb-1 pt-0" v-if="avatar_name">
                <img :src="`https://api.multiavatar.com/${avatar_name}.png`" width="100%" valign="middle"/>
            </div>
            <div class="mx-4 mb-1 white--text">
                <v-layout justify-center>
                    <small>Avatars by <a href="https://multiavatar.com" target="_blank" class="amber--text">Multiavatar.com</a></small>
                </v-layout>
            </div>
            <v-divider></v-divider>
            <div class="ma-4 mt-4 mb-0 pb-0 pt-0 white--text" >
                <v-text-field v-model="avatar_name" dense v-on:keyup.enter="avatar()" @change="avatar()" label="image hash"/>
                <v-text-field v-model="name" dense class="ma-0 pa-0" label="name"/>
                <v-text-field v-model="bio" dense class="ma-0 pa-0" label="bio"/>
                <v-text-field v-model="link" dense class="ma-0 pa-0" label="link"/>
            </div>
            <v-card-actions class="text-center">
                <v-layout align-content-center justify-center>
                    <div>
                        <v-btn width="100%" large color="primary" @click="mint">
                            {{$t("MINT NFT")}}<br/>(0.99 AWAX)
                        </v-btn>
                    </div>
                </v-layout>
            </v-card-actions>
            <div v-if="$store.state.farms[0]" class="mb-8">
                <v-layout align-content-center justify-center>
                    <small>
                        {{$t('Balance')}}: {{ $store.state.farms[0].awax_balance }} ₳
                    </small>
                </v-layout>
            </div>
        </v-card>
    </div>
</template>

<script>
import { create, urlSource } from 'ipfs-http-client';
const ipfs_client = create('https://ipfs.infura.io:5001/api/v0')

export default {
    name: "AvatarMinter",
    data() {
        return {
            avatar_name: '',
            avatar_link: '',
            current_avatar: null,
            name: '',
            bio: '',
            link: 'https://',
        }
    },
    components: {
    },
    methods: {  
        async mint() {
            const res = await this.$dialog.confirm({
                    text: this.$t("Please confirm minting new NFTAvatar for 0.99 AWAX"),
                    title: this.$t('Confirmation'),
                    actions: {
                    false: this.$t('No'),
                    true: this.$t('Yes')
                },            
            })
            if (res) {                    
                let source = urlSource(`https://api.multiavatar.com/${this.avatar_name}.png`);
                const { cid } = await ipfs_client.add(source);            
                if (cid) {
                    const url = `https://ipfs.atomichub.io/ipfs/${cid}`
                    console.log("url: ", url, cid);
                    const res = await this.angel_mintavatar(this.$store.state.userAccount, this.avatar_name, this.bio, this.link, cid);
                    if (res.status) {
                        this.$toast.success(this.$t("Successfully minted NFT"));
                    } else {
                        this.$toast.error(res.result);
                    }                
                }
            }
        },
        avatar() {
            this.avatar_link = `https://api.multiavatar.com/${this.avatar_name}.png`;
        },
    },
    mounted() {
        // minting new nft
        // api.countAssets({owner: 'ehcza.wam'}).then(assets => {
        //     console.log("count assets: ", JSON.stringify(assets, null, 2));
        // });
        // api.getAsset("1099664081416").then(asset => {
        //     console.log("asset: ", JSON.stringify(asset));
        // });
        // api.getAccount("ehcza.wam").then(acc=> {
        //     console.log("account : ", JSON.stringify(acc, null, 2));
        // });
        setTimeout(()=>{
            this.name = this.$store.state.userAccount;
            this.avatar_name = this.$store.state.userAccount;
        },1000);
    },
    computed: {
    }
};
</script>

<style></style>
