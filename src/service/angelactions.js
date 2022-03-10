import Vue from "vue";

import {ExplorerApi, RpcApi} from "atomicassets"
const api = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});

Vue.mixin({
  methods: { 
    // get avatar nft 
    async getAvatars(account) {
        console.log("get avatars for ", account);
        try {
            const assets = await api.getAssets({owner: this.$store.state.userAccount, collection_name: 'multiavatarz'});
            if (assets && assets.length>0) {
                // console.log("avatars: ", assets);
                let avatars = [];
                
                assets.forEach(asset => {
                    let asset_id = asset.asset_id;
                    let data = asset.data;
                    let bio = data.bio;
                    let link = data.link;
                    let name = data.name;
                    let img = data.img;
                    // let image_url = "https://ipfs.atomichub.io/ipfs/" + img;
                    let image_url = "https://ipfs.infura.io/ipfs/" + img;                    
                    let avatar = {img, bio, link, name, asset_id, image_url}
                    // console.log("avatar: ", avatar);
                    avatars.push(avatar);
                });

                this.$store.commit('updateAvatars', avatars);
            }
        } catch (error) {
            return null;
        }
    },      
    // Mint avatar
    async angel_mintavatar(user, avatar_name, bio, link, img, pkey = null, delegate = null) {
        try {
            const action1 = {
                account: 'awaxdaotoken',
                name: 'transfer',
                authorization: this.session_auth(user, delegate),
                data: {
                    from: user,
                    quantity: "0.9900 AWAX",
                    to: "angelfarmers",
                    memo: ''
                },
            };
            const result1 = await this.wax_transact(action1, pkey, delegate);
            if (result1) {
                const action2 = {
                    account: 'angelfarmers',
                    name: 'mintavatar',
                    authorization: this.session_auth(user, delegate),
                    data: {
                        user,
                        avatar_name,
                        bio,
                        link,
                        img
                    },
                };            
    
                const result2 = await this.wax_transact(action2, pkey, delegate);
                if (result2) return {status: true, result2};
                else return {status: false, result2}
            } else return {status: false, result1}

        } catch(e) {
            return {status: false, result: e.message};
        }
    },
  },
});

