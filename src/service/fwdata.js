import fs from 'fs'
import fetch from 'node-fetch'

var sline = 2;
var all_members = [];

getMembers();

async function getMembers() {
    console.log("get Members");

    sline = 2;
    last_key = false;
    var key1 = false;
    do {
        key1 = await getMembersPage(last_key);
        last_key = key1;
    } while (key1)  
    console.log("Завершил импорт. " + (sline - 2) + " игроков ");
}
  
async function getMembersPage(index_key) {
    if (!index_key) {
      var data = {
        'code': 'farmersworld',
        'table': 'accounts',
        'scope': 'farmersworld',
        'limit': 1000,
        'encode_type': 'name',
        'json': true,
      };
    } else {
      var data = {
        'code': 'farmersworld',
        'table': 'accounts',
        'scope': 'farmersworld',
        'limit': 1000,
        'encode_type': 'name',
        'json': true,
        'lower_bound': index_key,
        'key_type':'uint64_t'
      };
    }
  
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data)
    };
  
    // var response = UrlFetchApp.fetch("https://chain.wax.io/v1/chain/get_table_rows", options);
    var response = await fetch("https://wax.eosn.io/v1/chain/get_table_rows", options);
    
    var json = response.getContentText();
    var data = JSON.parse(json);
    console.log("data: " + JSON.stringify(data));
  
    const members = data["rows"];
    console.log("Нашел  " + members.length + " аккаунтов");
    for (var line =1; line < members.length; line++) {
      const member = members[line];
      console.log(JSON.stringify(member["account"]));
    
      // parse assets
      if (member["balances"].length > 0) {
        var wood = 0, gold = 0, food = 0;
  
        member["balances"].forEach(item => {
            const res = parseAsset(item);
  
            if (res.asset_id === "WOOD") {
                wood = res.number;
            }
            if (res.asset_id === "GOLD") {
                gold = res.number;
            }
            if (res.asset_id === "FOOD") {
                food = res.number;
            }
        });
        if (wood + food + gold >0) {
            all_members.push({
                'account': member["account"], 
                'wood': wood,
                'food': food,
                'gold': gold
            })
            sline++;
        }
      }
    }
    console.log("Всего добавил " + (sline-2) + " игроков с балансами");
    console.log("Ключ  " + data["next_key"] );
    console.log("More  " + data["more"] );
  
    if (data["more"]) {
      return data["next_key"]
    }
    return false;
}
  
function parseAsset(asset_string) {
    const items = asset_string.split(' ');
    const num = parseFloat(items[0]);
    const asset_id = items[1];
    return {number: num, asset_id: asset_id};
}