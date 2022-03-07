const db_keys = require('@/../.keys.js');

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: db_keys.FB_APIKEY,
    authDomain: db_keys.FB_authDomain,
    projectId: db_keys.FB_projectId,
    storageBucket: db_keys.FB_storageBucket,
    messagingSenderId: db_keys.FB_messagingSenderId,
    appId: db_keys.FB_appId,
    measurementId: db_keys.FB_measurementId
};

// Initialize Firebase
export const db = firebase.initializeApp(firebaseConfig).firestore()
const farm_state_db = db.collection('farm_state');

const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }

export async function calcFarmIncome(account_name) {

    console.log("! calcFarmIncome for " + account_name);
    let income = {wood: 0, food: 0, gold: 0, barley: 0, corn: 0, eggs: 0, milk: 0};

    try {
        await db.collection('farm_state').get(account_name).then(snapshot => {
            income = snapshot.data().income;
        })
    } catch (error) {
        console.log("ОШИБКА при получении данных по ферме:" + error);
    }  

    // получим список логов по доходам
    // await db.collection('actions').where('owner','==', account_name).get().then(snapshot => {
    //     snapshot.forEach(doc => {
    //         let item = doc.data();
    //         if (item.output) {
    //             if (item.output.wood) income.wood += item.output.wood;
    //             if (item.output.food) income.food += item.output.food;
    //             if (item.output.gold) income.gold += item.output.gold;
    //             if (item.output.barley) income.barley += item.output.barley;
    //             if (item.output.corn) income.corn += item.output.corn;
    //             if (item.output.eggs) income.eggs += item.output.eggs;
    //             if (item.output.milk) income.milk += item.output.milk;
    //         } 
    //     })
    // });  

    // получим список донатов для фермы
    let donations = 0;
    // await db.collection('donations').where('account_name','==', account_name).get().then(snapshot => {
    //     snapshot.forEach(doc => {
    //         let item = doc.data();
    //         if (item.amount) donations  += item.amount;
    //     })
    // });  

    return {income, donations};
}

export async function loadFarmIncome(account_name) {

    console.log("! loadFarmIncome for " + account_name);
    let income = {wood: 0, food: 0, gold: 0, barley: 0, corn: 0, eggs: 0, milk: 0};

    // получим список логов по доходам
    await db.collection('actions').where('owner','==', account_name).get().then(snapshot => {
        snapshot.forEach(doc => {
            let item = doc.data();
            if (item.output) {
                if (item.output.wood) income.wood += item.output.wood;
                if (item.output.food) income.food += item.output.food;
                if (item.output.gold) income.gold += item.output.gold;
                if (item.output.barley) income.barley += item.output.barley;
                if (item.output.corn) income.corn += item.output.corn;
                if (item.output.eggs) income.eggs += item.output.eggs;
                if (item.output.milk) income.milk += item.output.milk;
            } 
        })
    });  

    // console.log("+ " + account_name + " farmIncome: " + JSON.stringify(income));

    return income;
}

// Добавить запись по состоянию фермы
export async function fb_updateFarmState(farmState) {
    // console.log("+ update farm state in fb " + farmState.account_name);
    try {  
        await farm_state_db.doc(farmState.account_name).set(farmState);
        // console.log("+ успешно обновил статус фермы " + farmState.account_name);
        return true;
    } catch (error) {
        console.log("ОШИБКА: Не смог добавить state. ОШИБКА: " + error);
        return false;    
    }     
}