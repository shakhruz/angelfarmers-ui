import Vue from "vue";
import * as waxjs from "@waxio/waxjs/dist";
import * as data from '@/store/modules/data';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';  
import { TextEncoder, TextDecoder } from 'util'; 
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

const ends = data.endpoints;

let endpoint_num = Math.floor(Math.random()*ends.length);
let endpoint = ends[endpoint_num];

if (localStorage.endpoint) {
    endpoint = localStorage.endpoint;
}

const { Api, JsonRpc } = require('eosjs');
let rpc = new JsonRpc(endpoint);
console.log("⚡️ rpc endpoint: " + endpoint);

let wax = new waxjs.WaxJS({
    rpcEndpoint: endpoint,
    tryAutoLogin: false
});

const transport = new AnchorLinkBrowserTransport()
const link = new AnchorLink({
    transport,
    chains: [
        {
            chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
            nodeUrl: endpoint,
        }
    ],
})

var anchor_login = false;
var identity, session;
var userAccount = "";
var authority = null;

Vue.mixin({
    methods: {   
        changeEndpoint() {
            // endpoint_num = ++endpoint_num >= ends.length ? 0 : endpoint_num;
            // endpoint = ends[endpoint_num];
            // console.log("new endpoint: " + endpoint);
            // rpc = new JsonRpc(endpoint);
                
            // wax = new waxjs.WaxJS({
            //     rpcEndpoint: endpoint,
            //     tryAutoLogin: true
            // });
            
            // const link = new AnchorLink({
            //     transport,
            //     chains: [
            //         {
            //             chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
            //             nodeUrl: endpoint,
            //         }
            //     ],
            // })
            // logged_in = false;
            // this.autoLogin();       
        },
        selectEndpoint(new_endpoint) {
            console.log("new endpoint: " + new_endpoint);
            endpoint = new_endpoint;
            rpc = new JsonRpc(endpoint);
                
            wax = new waxjs.WaxJS({
                rpcEndpoint: endpoint,
                tryAutoLogin: true
            });
            localStorage.endpoint = endpoint;
            this.autoLogin();
        },
        randomEndpoint() {
            let endpoint_num = Math.floor(Math.random()*ends.length);
            endpoint = ends[endpoint_num];
            console.log("new random endpoint: " + endpoint);
            rpc = new JsonRpc(endpoint);
                
            wax = new waxjs.WaxJS({
                rpcEndpoint: endpoint,
                tryAutoLogin: true
            });
            localStorage.endpoint = endpoint;
            this.autoLogin();
            return endpoint;
        },
        getEndpoint() {
            return endpoint;
        },
        getEndpoints() {
            return ends;
        },
        wax() {
            return wax;
        },
        identity() {
            return identity;
        },
        session_auth(account_name=null, delegate = null) {
            if (account_name) {
                return [{
                    actor: account_name,
                    permission: 'active',
                }]
            } 
            return authority;
        },
        userAccount() {
            return userAccount;
        },
        async autoLogin() {
            let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
            if (isAutoLoginAvailable) {
                userAccount = wax.userAccount;
                anchor_login = false;
                authority = [{
                    actor: userAccount,
                    permission: 'active',
                }]
                return userAccount
            }
            else {
                return false;
            }
        },
        async login() {
            try {
                userAccount = await wax.login();
                if (userAccount) {
                    anchor_login = false;
                    authority = [{
                        actor: userAccount,
                        permission: 'active',
                    }]
                    // logged_in = true;
                    return userAccount;
                } else return false;
            } catch (e) {
                return false;
            }
        },
        // logout() {
        //     logged_in = false;
        //     userAccount = null;
        //     authority = null;
        // },
        async login_with_anchor() {
            try {
                identity = await link.login('F12+ AngelFarmers')

                // Save the session within your application for future use
                session = identity.session;
                authority = [session.auth];
                console.log(`Logged in as ${session.auth}`)

                anchor_login = true;
                // console.log("identity: " + JSON.stringify(session.auth));

                return session.auth.actor.toString().trim();
                // let str = 'Account: ' + session.auth;
                // logged_in = true;
                // document.getElementById('loginform').innerHTML = str;
            } catch (e) {
                console.log("error: " + e.message);
                return false;
                // document.getElementById('loginresponse').append(e.message);
            }
        },
        wax_transact(action, pkey = null, delegate = null) {
            if (delegate) {
                // подпишем вакс кошельком
                if (wax && wax.api) {
                    // console.log("wax transact with: " + this.getEndpoint());
                    // console.log(`delegate ${delegate} wax_transact: ` + JSON.stringify(action))
                    return wax.api.transact({actions: [action]}, {blocksBehind: 3, expireSeconds: 1200});
                }
                else {
                    console.log("not logged in, trying to push transaction: " + JSON.stringify(action));
                    return false;
                }
            } else {
                if (pkey) {
                    // подпишем приватным ключом
                    const signatureProvider = new JsSignatureProvider([pkey]);
                    const api = new Api({ rpc, signatureProvider, });
                    if (api) {
                        // console.log("wax_transact with pkey: " + JSON.stringify(action))
                        return api.transact({actions: [action]}, {blocksBehind: 3, expireSeconds: 1200});          
                    }
                    else {
                        console.log("Ошибка, нет api для проведения транзакции: " + JSON.stringify(action));
                        return false;
                    }
                } else {
                    // anchor кошелек
                    if (anchor_login) {
                        if (session) return session.transact({action},  {blocksBehind: 3, expireSeconds: 1200});
                        else {
                            console.log("ОШИБКА. anchor сессия не установлена. транзакция: " + JSON.stringify(action));
                            return false;
                        }
                    } else {
                        // подпишем вакс кошельком
                        if (wax && wax.api) {
                            // console.log("wax transact with: " + this.getEndpoint());
                            // console.log("wax_transact: " + JSON.stringify(action));
                            return wax.api.transact({actions: [action]},  {blocksBehind: 3, expireSeconds: 1200});
                        }
                        else {
                            console.log("ОШИБКА. не залогинен, но пытается провести транзаацию: " + JSON.stringify(action) + " " + JSON.stringify(wax));
                            return false;
                        }
                    }
                }
            }
        },
        wax_rpc() {
            if (anchor_login) {
                return rpc;
            } else {
                // return wax.api.rpc;
                return rpc;
            }
        },
        // get total AWAX balance 
        async getTotalAWAXOnPresale() {
            let total_awax = 0;
            try {
                const awax_info = await rpc.get_table_rows({
                    json: true,               
                    code: 'awaxdaotoken',     
                    scope: 'awaxpresales',    
                    table: 'accounts',        
                }); 
    
                if (awax_info["rows"] && awax_info["rows"][0] && awax_info["rows"][0]["balance"]) {
                    const res = this.parseAsset(awax_info["rows"][0]["balance"]);
                    if (res && res.asset_id && res.asset_id == "AWAX") {
                        total_awax = res.number;
                    }
                }
    
                // console.log("AWAX balance: awaxpresale  " + JSON.stringify(awax_info));
    
            } catch(e) {
                console.log("ОШИБКА при получении AWAX баланса аккаунта: " + e.message);
            }        
            return total_awax;
        },
        // get total WAX on presales contract 
        async getTotalWAXCollected() {
            let total_wax_collected = 0;
            try {
                const awax_info = await rpc.get_table_rows({
                    json: true,               
                    code: 'eosio.token',     
                    scope: 'awaxpresales',    
                    table: 'accounts',        
                }); 

                if (awax_info["rows"] && awax_info["rows"][0] && awax_info["rows"][0]["balance"]) {
                    const res = this.parseAsset(awax_info["rows"][0]["balance"]);
                    if (res && res.asset_id && res.asset_id == "WAX") {
                        total_wax_collected = res.number;
                    }
                }

                // console.log("AWAX balance: " + awax_balance + " " + JSON.stringify(awax_info));

            } catch(e) {
                console.log("ОШИБКА при получении AWAX баланса аккаунта: " + e.message);
            }        
            return total_wax_collected;
        },
        // get AWAX balance 
        async getAWAXBalance(account_name) {
            let total_awax = 0;
            try {
                const awax_info = await rpc.get_table_rows({
                    json: true,               
                    code: 'awaxdaotoken',     
                    scope: account_name,    
                    table: 'accounts',        
                }); 
    
                if (awax_info["rows"] && awax_info["rows"][0] && awax_info["rows"][0]["balance"]) {
                    const res = this.parseAsset(awax_info["rows"][0]["balance"]);
                    if (res && res.asset_id && res.asset_id == "AWAX") {
                        total_awax = res.number;
                    }
                }
    
                // console.log("AWAX balance: awaxpresale  " + JSON.stringify(awax_info));
            } catch(e) {
                console.log("ОШИБКА при получении AWAX баланса аккаунта: " + e.message);
            }        
            return total_awax;
        },
    },
});

