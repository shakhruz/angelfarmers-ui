import Vue from "vue"
import { createDfuseClient, waitFor, InboundMessage, InboundMessageType, TableDeltaData } from "@dfuse/client"

const db_keys = require('@/../.keys.js');

const DFUSE_API_KEY = db_keys.DFUSE_API_KEY;
const DFUSE_API_NETWORK = "wax.dfuse.eosnation.io";

Vue.mixin({
    methods: {
        async watch_account_txs(wax_account, message_func) {
            const client1 = createDfuseClient({
                apiKey: DFUSE_API_KEY,
                network: DFUSE_API_NETWORK,
            })

            const streamTransfer = `subscription($cursor: String!) {
                searchTransactionsForward(query: "receiver:${wax_account} action:transfer", cursor: $cursor) {
                undo cursor
                trace {
                    matchingActions { json }
                }
                }
            }`

            const stream = await client1.graphql(streamTransfer, (message, stream) => {
                if (message.type === "error") {
                    console.log("An error occurred", message.errors, message.terminal)
                }

                if (message.type === "data") {
                    const data = message.data.searchTransactionsForward
                    const actions = data.trace.matchingActions

                    actions.forEach(({ json }) => {
                        const { from, to, quantity, memo } = json
                        // console.log("json: " + JSON.stringify(json));
                        // const msg = `Transfer [${from} -> ${to}, ${quantity}] (${memo})`;
                        // console.log(msg);
                        message_func(message);
                    })

                    stream.mark({ cursor: data.cursor })
                }

                if (message.type === "complete") {
                    console.log("Stream completed")
                }
            })

            await stream.join();
            // await waitFor(5000);
            // await stream.close();
            // client1.release();
        },
        async watch_alcor_trx(message_func) {
            const client1 = createDfuseClient({
                apiKey: DFUSE_API_KEY,
                network: DFUSE_API_NETWORK,
            })

            const streamTransfer = `subscription($cursor: String!) {
                searchTransactionsForward(query: "(receiver:alcordexmain && action:buymatch) || (receiver:alcordexmain && action:sellmatch)", cursor: $cursor) {
                undo cursor
                trace {
                    matchingActions { json }
                }
                }
            }`

            const stream = await client1.graphql(streamTransfer, (message, stream) => {
                if (message.type === "error") {
                    console.log("An error occurred", message.errors, message.terminal)
                }

                if (message.type === "data") {
                    const data = message.data.searchTransactionsForward
                    const actions = data.trace.matchingActions

                    actions.forEach(({ json }) => {
                        message_func(json);
                    })

                    stream.mark({ cursor: data.cursor })
                }

                if (message.type === "complete") {
                    console.log("Stream completed")
                }
            })

            await stream.join();
            // await waitFor(5000);
            // await stream.close();
            // client1.release();
        },                
        async watch_table_rows(wax_account, table_name, scope_name, message_func) {
            console.log('watch table rows: contract:' + wax_account + ' table: ' + table_name + ' scope:' + scope_name);
            const client1 = createDfuseClient({
                apiKey: DFUSE_API_KEY,
                network: DFUSE_API_NETWORK,
            })
        
            const stream = await client1.streamTableRows(
                { code: wax_account, scope: scope_name, table: table_name },
                (message) => {
                    message_func(message);

                    if (message.type === InboundMessageType.TABLE_DELTA) {
                        console.log("message: " + JSON.stringify(message.data));
                    }
                    
                    if (message.type === InboundMessageType.LISTENING) {
                        console.log(JSON.stringify(message.data))
                        return
                    }
                
                    if (message.type === InboundMessageType.TABLE_SNAPSHOT) {
                        console.log(JSON.stringify(message.data))
                        return
                    }
                
                    if (message.type === InboundMessageType.TABLE_DELTA) {
                        console.log(JSON.stringify(message.data))
                        return
                    }
                
                    if (message.type === InboundMessageType.ERROR) {
                        console.log(JSON.stringify(message.data))
                        return
                    }
                }, {fetch: true}
            )
        
            // await waitFor(5000)
            // await stream.close()
        
            // client1.release()
        },
        async watch_atomicmarket_trx(message_func) {
            const client1 = createDfuseClient({
                apiKey: DFUSE_API_KEY,
                network: DFUSE_API_NETWORK,
            })

            const streamTransfer = `subscription($cursor: String!) {
                searchTransactionsForward(query: "(receiver:atomicmarket && action:lognewsale)", cursor: $cursor) {
                undo cursor
                trace {
                    matchingActions { json }
                }
                }
            }`

            const stream = await client1.graphql(streamTransfer, (message, stream) => {
                if (message.type === "error") {
                    console.log("An error occurred", message.errors, message.terminal)
                }

                if (message.type === "data") {
                    const data = message.data.searchTransactionsForward
                    const actions = data.trace.matchingActions

                    actions.forEach(({ json }) => {
                        message_func(json);
                    })

                    stream.mark({ cursor: data.cursor })
                }

                if (message.type === "complete") {
                    console.log("Stream completed")
                }
            })

            await stream.join();
            await waitFor(5000);
            await stream.close();
            client1.release();
        },         
    }    
});