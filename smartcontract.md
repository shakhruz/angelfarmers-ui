### контракты и действия

farmersworld 
- newuser

owner: drminer11111
referral_partner: 


farmersworld
- claim
asset_id: 1099567885359
owner: ehcza.wam

- cropclaim
crop_id: 1099586679612
owner: ehcza.wam

- recover
energy_recovered: 117
owner: ehcza.wam

- mintasset
owner: 3pezg.wam
memo: Saw

- clamiasset
asset_id: 1099588805562
asset_owner: 3pezg.wam

- unstake
asset_owner: 3pezg.wam
asset_id: 1099586724055

- mbsclaim
owner: 3pezg.wam
asset_id: 1099586303503

- repair
asset_owner: 3pezg.wam
asset_id: 1099586709346

farmerstoken
- transfers

from: ehcza.wam
memo: deposit
quantities:
975.0000 FWF
to: farmersworld

atomicassets 
- transfer

asset_ids:1099588201045
from: 3pezg.wam
memo: feed_animal:1099587695513
to: farmersworld

atomicassets 
- transfer

asset_ids: 1099588421279
from: 3pezg.wam
memo: feed_animal:1099587695459
to: farmersworld

atomicassets 
- transfer

asset_ids:1099588421280
from: 3pezg.wam
memo: feed_animal:1099568584850
to: farmersworld
	
farmerstoken 
- transfers

from: 3pezg.wam
memo: deposit
quantities: 418.0000 FWF
to: farmersworld


farmersworld 
- claimasset

asset_id: 1099588805562
asset_owner: 3pezg.wam

farmersworld 
- mintasset

memo: Ancient Stone Axe
owner: 3pezg.wam

eosio.token - transfer
3pezg.wam    →   alcordexmain   
77.06726588 WAX
0.0000 FWG@farmerstoken

farmersworld 
- unstake

asset_id: 1099586724055
asset_owner: 3pezg.wam

farmersworld 
- mktbuy

owner: 3pezg.wam
quantity: 8
template_id: 298595

farmersworld 
- mbsunstake

asset_id: 1099586303503
asset_owner: 3pezg.wam

farmersworld 
- withdraw

fee: 5
owner: 3pezg.wam
quantities:
99.0000 GOLD

farmersworld 
- withdraw

fee: 5
owner: 3pezg.wam
quantities:
52.0000 WOOD

	
farmersworld 
- mktbuy

owner: 3pezg.wam
quantity: 8
template_id: 298595

	
farmersworld 
- bldclaim

asset_id: 1099580302376
owner: mq2ju.wam

	
atomicassets 
- transfer

asset_ids:
1099587210572
from: ehcza.wam
memo: stake
to: farmersworld


# сажаем seeds	
atomicassets 
- transfer

asset_ids:
1099590910780
from: p1tjy.wam
memo: stake
to: farmersworld

## купить barley seed
farmersworld 
- mktbuy

owner: ehcza.wam
quantity: 2
template_id: 298595

## обменять barley на золото
atomicassets 
- transfer
asset_ids:
1099591760866

from: ehcza.wam
memo: burn
to: farmersworld

## высижывать яйцо
farmersworld 
- anmclaim

animal_id: 1099588922412
owner: mplzm.wam

# купить по рынку
eosio.token - transfer
ehcza.wam    →   alcordexmain   1 WAX
0.0000 FWF@farmerstoken

# deposit tokens into game
farmerstoken 
- transfers

from: ehcza.wam
memo: deposit
quantities:
14.0000 FWF

6.0000 FWW

to: farmersworld

# widthdraw
farmersworld 
- withdraw

fee: 7
owner: ehcza.wam
quantities:
1.0000 GOLD

farmersworld 
- withdraw

fee: 7
owner: ehcza.wam
quantities:
1.0000 GOLD

## добавил токен в кошелек
wallet.wax 
- tokenset

contract: farmerstoken
displayname: FWG
from: 2ng.a.c.wam
image: QmVz8PYSc6oqKU4kwL4WwLhsfA4TrK897Z5rGo9mW6syV6
token: 4,FWG

# продать на атомике

atomicmarket - announcesale
asset_ids:
1099596471810

listing_price: 5.21000000 WAX
maker_marketplace: 
seller: ehcza.wam
settlement_symbol: 8,WAX

atomicassets 
- createoffer

memo: sale
recipient: atomicmarket
recipient_asset_ids:
sender: ehcza.wam
sender_asset_ids:
1099597960934

# отменить заявку на продажу

atomicmarket 
- cancelsale
sale_id: 51008861

# скрафтить здание

farmersworld - mintbld
new_owner: ehcza.wam
template_id: 298592