[по-русски](/README-ru.md)

## F12+ FarmersWorld.io tools by AngelFarmers
> Play like professional.
> Farm resources and participate in building the Metaverse.
> Join our AngelFarmers Guild, participate in DAO, invest and get dividends

![Снимок экрана 2022-03-02 в 21 02 57](https://user-images.githubusercontent.com/6615/156410626-00a41166-04fe-4112-987d-6a863e71dfc3.png)

F12+ is open source dapp that helps FarmersWorld.io players farm resources and trade on Atomic and Alcor.

https://fw.angelfarmers.com - official version for AngelFamers guild members


### Features overview:
1. Calculate current value of your farm assets
2. Estimate earnings and ROI
3. Automatically perform mundane actions like claiming, repairing, recovering energy, feeding animals and more
4. Easily perform farm management actions like Withdraw and deposit funds, Exchange tokens, Transfer NFTs and tokens, Craft and buy in the game market, Stake for CPU, Exchange crops, Sell NFTs on Atomic and etc.
5. Overview and manage multiple farms in one window. Calculate total value and estimate earnings on all your farms.
6. Use non-Wax Cloud Wallet (Anchor and others) accounts for farming
7. Check-in with your farms status on Telegram via F12+ bot. Get notifications for all transfers on your accounts and issues
8. Analyze Atomic market for artitrage opportunities
9. Analyze Alcor orderbooks for trading
10. Bilingual support in English and Russian

### About AngelFarmers
We are a gaming league of players and investors, enjoying [FarmersWorld.io](https://farmersworld.io) game on WAX blockchain. 
Our goal is to support fellow members of the league in playing the game, earning passive income and having most fun with it.
In order to help best players expand and investors make most of their money we have created a guid token - AWAX.

AWAX or Angel WAX is a savings/dividends/governance token of AngelFarmers Guild. AWAX is a native token on WAX blockchain that is traded on Alcor exchange:

[Swap WAX/AWAX](https://wax.alcor.exchange/swap?output=WAX-eosio.token&input=AWAX-awaxdaotoken)

[Orderbooks for WAX/AWAX](https://wax.alcor.exchange/trade/awax-awaxdaotoken_wax-eosio.token)

Every guild member who invests 5% of their income from Farmers World into AWAX are eligible to participate in the following:
1. Propose new features and work done for F12+ tools
2. Vote on new development and community agenda
3. Receive airdrops with NFTs and tokens earned by community investfund
4. Receive dividends from community investment fund
5. Receive funds to invest and trade from community fund
----

### Use
#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Key settings:
In order to make the app work with Firestore Database you will need to create a new Firebase project, add a web app and generate API_KEY and obtain configuration info from Firebase.

Place the configuratino info into .keys.js file in the root project folder with the following code:

```
export const FB_APIKEY="..."
export const FB_authDomain="..."
export const FB_projectId="..."
export const FB_storageBucket="..."
export const FB_messagingSenderId="..."
export const FB_appId="..."
export const FB_measurementId="..."
```

## Contributions

Chineese translation by cnscdh!