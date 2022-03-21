import Vue from 'vue'
import Vuex from 'vuex'
import * as fw from "./modules/fw";
import * as atomic from "./modules/atomic";
import ls from 'localstorage-slim';
ls.config.encrypt = true;

const { db, calcFarmIncome, loadFarmIncome, fb_updateFarmState } = require('@/db');

import i18n from '@/i18n';

Vue.use(Vuex);

// Главное хранилище состояния приложения

export default new Vuex.Store({
  state: {
    prices: { fwf: 0, fwg: 0, fww: 0, wax: 0 },
    farms: [],
    showAllFarms: false,
    selectedFarmIndex: 0,
    config: null,
    // account: null,
    userAccount: null,
    logged_in: false,
    is_checking: false,
    atomic_assets: [],
    showAll: true,
    // logs: [],
    // errors: [],
    // warnings: [],
    default_settings: {
      pause_all_actions: false, // остановить все операции
      refill_energy: true, // пополнить энергию, когда заканчивается
      min_energy: 250,     // минимальный порог энергии, ниже которой нужно пополнить
      recover_tools: true, // восстанавливать инструменты
      min_durability: 50,  // минимальный процент износа инструментов, ниже - чиним
      min_food: 100,       // минимально еды в игре, если меньше, пытаемся пополнить
      deposit_fwf: true,   // депонировать fwf токены если закончилась еда
      max_fwf_to_deposit: 400, // максимальное количество fwf токенов для загрузки
      deposit_fwg: true,   // депонировать fwg токены если закончилось золотов игре (0 золота)
      max_fwg_to_deposit: 100, // максимальное количество fwg токеноы для депонирования
      claim_buildings: true, // строить здания
      manage_tools: true, // собирать ресурсы инструментами, чинить инструменты
      plant_seeds: true,  // сажать семена на пустых полях
      buy_seeds: false,   // покупать семена если не хватает
      claim_crops: true,  // поливаем поля
      hatch_eggs: true,   // высижывать яйца
      feed_with_barley: true, // кормить курицу и корову барли
      feed_cow_with_barley: true, // кормить коров и телят
      feed_with_milk: true, // корпить baby calf молоком
      claim_members: true,    // собирать бонусы с мемберов
      private_key: '',        // приватный ключ
      delegated_account: '',  // аккаунт, имеющий право на операции
      delegated_permission: 'active',        // ключ для другого аккаунта .ex - active
      wear_buildings: false,  // ставить здания при возможности
      send_crops_to: '',      // отправлять урожай на этот адрес
      send_food_to: '',       // отправлять еду на адреса
      send_barley_seeds_to: '', // отправлять семена барли
      hide: false, // прятать диалог с настройками
      check_cpu_level: true,
      use_stored_mining: false,
    },
    updatingPrices: false,
    updatingInfo: false,
    updatingAtomic: false,
    total_status: true, // общее состояние всех ферм, если хоть одна с проблемой, будет false, иначе - true
    next_action: '',
    next_action_date: null,
    next_action_account: '',
    pause_all: false,
    daily_profits: { wood: 0, food: 0, gold: 0 },
    total_tokens: {fww: 0, fwf: 0, fwg: 0},
    total_resources: {wood: 0, food: 0, gold: 0},
    daily_output: { wood: 0, food: 0, gold: 0 },
    top_loading: false,
    goDark: false,
    menu_items: [],
    showAtomicPanel: false,
    showAlcorOrderbook: false,
    avatars: [],
    showTopFarms: true,
  },
  mutations: {
    // Перейти в режим обновления
    startChecking(state) {
      state.is_checking = true;
    },
    // Остановить режим автообновления
    stopChecking(state) {
      state.is_checking = false;
    },
    // Пометить что пользователь авторизировался
    loggedIn(state, logged_in) {
      state.logged_in = true;
      state.userAccount = logged_in;
      for (let f = 0; f < state.farms.length; f++) {
        if (state.farms[f].account_name == state.userAccount) {
          state.farms[f].wax_login = true; // отметим что пользователь залогинился
        }
      }
    },
    // Пометить что пользователь вышел
    logout(state) {
      state.logged_in = false;
      for (let f = 0; f < state.farms.length; f++) {
        if (state.farms[f].account_name == state.userAccount) {
          state.farms[f].wax_login = false; // отметим что вышли из фермы
        }
      }
      state.userAccount = null;
    },
    // Обновить котировки токенов
    updatePrices(state, newPrices) {
      state.prices = newPrices;
    },
    // Обновить ферму из наблюдаемых
    updateFarm(state, farm_info) {
      let found = false;
      if (state.farms == null) state.farms = [];
      if (state.farms.length > 0) {
        for (let c = 0; c < state.farms.length && !found; c++) {
          if (state.farms[c].account_name == farm_info.account_name) {
            state.farms[c] = farm_info;
            found = true;
          }
        }
      }
      if (!found) {
        if (state.farms[0] && state.farms[0].wax_login) {
          // добавим вторым по счету
          state.farms.splice(1,0,farm_info)
        } else {
          state.farms.splice(0,0,farm_info);
        }
      }
    },
    // Остановить/запустить управление фермой
    pauseFarm(state, {account_name, paused}) {
      for (let c = 0; c < state.farms.length; c++) {
        if (state.farms[c].account_name == account_name) {
          state.farms[c].settings.pause_all_actions = paused;
          break;
        }
      }
    },
    // Удалить ферму из списка
    deleteFarm(state, account_name) {
      state.farms = state.farms.filter(f => f.account_name != account_name);
    },
    // Обновить панель активов
    updateAtomicAssets(state, updated_assets) {
      state.atomic_assets = updated_assets;
    },
    updateTotalStats(state, { total_profit, total_cost, total_status, next_action_date, next_action, next_action_account, daily_profits, daily_output, total_tokens, total_resources }) {
      state.total_income_wax = total_profit;
      state.total_cost_wax = total_cost;
      state.total_status = total_status;
      state.next_action_date = next_action_date;
      state.next_action = next_action;
      state.next_action_account = next_action_account;
      state.daily_profits = daily_profits;
      state.daily_output = daily_output;
      state.total_tokens = total_tokens;
      state.total_resources = total_resources;
    },
    // обновим данные по доходу фермы
    updateFarmIncome(state, { account_name, income }) {
      let found = false;
      if (state.farms.length > 0) {
        for (let c = 0; c < state.farms.length && !found; c++) {
          if (state.farms[c].account_name == account_name) {
            state.farms[c].income = income;
            found = true;
            break;
          }
        }
      }
      if (!found) console.log("Не смог обновить доходы фермы " + account_name);
    },
    // добавить доход в состояние фермы из лога
    updateFarmIncomeFromLog(state, log) {
      if (log.owner && log.output) {
        let found = false;
        if (state.farms.length > 0) {
          for (let c = 0; c < state.farms.length && !found; c++) {
            if (state.farms[c].account_name == log.owner) {
              if (log.output) {
                  if (log.output.wood) state.farms[c].income.wood += log.output.wood;
                  if (log.output.food) state.farms[c].income.food += log.output.food;
                  if (log.output.gold) state.farms[c].income.gold += log.output.gold;
                  if (log.output.barley) state.farms[c].income.barley += log.output.barley;
                  if (log.output.corn) state.farms[c].income.corn += log.output.corn;
                  if (log.output.eggs) state.farms[c].income.eggs += log.output.eggs;
                  if (log.output.milk) state.farms[c].income.milk += log.output.milk;
                  if (log.output.fc) state.farms[c].income.fc += log.output.fc;
              } 
              found = true;
            }
          }
        }
        if (!found) console.log("Не смог обновить доходы фермы " + account_name);
      }
    },
    // Обновим аватары текущего пользователя
    updateAvatars(state, avatars) {
      state.avatars = avatars;
    }
  },
  actions: {
    logout(context) {
      context.commit("logout");
    },
    // Действия после логина пользователя - добавим аккаунт, обновим данные
    login(context, logged_in) {
      context.commit("loggedIn", logged_in);

      let f = false;
      for (let i = 0; i < context.state.farms.length && !f; i++) {
        if (context.state.farms[i].account_name == logged_in) {
          context.state.farms[i].wax_login = true;
          f = true;
        }
      }
      if (!f) context.dispatch("addFarm", logged_in);
    },
    // сохраним курсы токенов
    savePrices(context) {
      ls.set("prices", JSON.stringify(context.state.prices));
    },
    loadPrices(context) {
      // загрузим курсы токенов
      if (ls.get("prices")) {
        try {
          const newPrices = JSON.parse(ls.get("prices"));
          // context.commit('updatePrices', newPrices);
        } catch (error) {
          console.log("ошибка загрузки курсов токенов из кэша: " + error.message);
        }
      }
    },
    saveFarms(context) {
      ls.set("farmsData", JSON.stringify(context.state.farms));
    },
    updateTheme(context, goDark) {
      ls.set("goDark", goDark);
      context.state.goDark = goDark;
    },
    loadUserMenuItems(context) {
      context.state.menu_items = [
        { title: i18n.t('FARMS'), icon: 'mdi-view-dashboard', link: '/' },
        { title: i18n.t('AVATARS'), icon: 'mdi-format-list-bulleted', link: '/avatars'  },
        // { title: i18n.t('ATOMIC PANEL'), icon: 'mdi-atom', link: '/atomic-panel'  },
        // { title: i18n.t('ATOMIC BUYER'), icon: 'mdi-atom', link: '/atomic-buyer'  },
        // { title: i18n.t('ALL FARMS'), icon: 'mdi-format-list-bulleted', link: '/all-farms'  },
        // { title: i18n.t('ALCOR ORDERBOOKS'), icon: 'mdi-swap-horizontal', link: '/alcor-orderbooks'  },
        // { title: this.$t('SETTINGS'), icon: 'mdi-cog', link: '/setup' },
      ]
      if (context.state.userAccount == "ehcza.wam") {
        // меню для админа
        // context.state.menu_items.push(
        // { title: this.$t('ALL FARMS'), icon: 'mdi-format-list-bulleted', link: '/all-farms'  });
        // context.state.menu_items.push(
        // { title: i18n.t('MY ATOMIC SALES'), icon: 'mdi-atom', link: '/atomic-sales'  });
        // context.state.menu_items.push(
        // { title: i18n.t('MY SALES HISTORY'), icon: 'mdi-atom', link: '/trade-history'  });
        // context.state.menu_items.push(
        // { title: i18n.t('ALCOR TRADER'), icon: 'mdi-swap-horizontal', link: '/alcor-trader'  });
        // context.state.menu_items.push(
        // { title: i18n.t('ALL FARMERS'), icon: 'mdi-format-list-bulleted', link: '/all-farmers'  });
      }
    },
    loadSettings(context) {
      if (ls.get("goDark")) {
        context.state.goDark = ls.get("goDark");
      }
      if (ls.get("pause_all_farms")) {
        context.state.pause_all = ls.get("pause_all_farms");
      }
    },
    loadFarms(context) {
      // загрузим сохраненные фермы
      if (ls.get("farmsData")) {
        try {
          context.state.farms = JSON.parse(ls.get("farmsData"));
        } catch (error) {
          context.state.farms = [];
        }
      }
      context.dispatch("updateInfo");
    },
    // Сохраним информацию об nft активах 
    saveAtomicAssets(context) {
      ls.set("atomic_assets", JSON.stringify(context.state.atomic_assets));
      // console.log("saved atomic assets locally");
    },
    // Загрузим данные по атомик активам
    loadAtomicAssets(context) {
      if (ls.get("atomic_assets")) {
        try {
          const new_atomic_assets = JSON.parse(ls.get("atomic_assets"));
          context.commit('updateAtomicAssets', new_atomic_assets);
          console.log("restored atomic assets from cache");
        } catch (e) {
          console.log("не смог загрузить атомик активы");
        }
      }
    },

    // Обновим все данные по всем фермам
    async updateInfo({ state, commit, dispatch }) {
      // console.log("updateInfo");
      state.updatingInfo = true;

      // Обновим конфигурацию игры
      const newConfig = await fw.getFWConfig();
      if (newConfig) state.config = newConfig;

      // Обновим данные ферм
      for (let ff = 0; ff < state.farms.length; ff++) {
        const info = await fw.getGame(state.farms[ff], state.prices, state.atomic_assets, state.default_settings);
        if (info) {
          info.num = ff + 1;
          commit('updateFarm', info);
          // dispatch('updateFarmIncome', info.account_name);
          dispatch('saveFarms');
        } else {
          console.log("не удалось обновить данные для " + state.farms[ff].account_name);
        }
      }
      dispatch("calcFarms");
      state.updatingInfo = false;
    },

    // Пересчитаем общие данные по всем фермам
    calcFarms({ state, commit, dispatch }) {
      // Обновим данные ферм
      let total_status = true;
      let next_action_date = null;
      let next_action = null;
      let next_action_account = '';
      let total_profit = 0, total_cost = 0;
      let daily_profits = { wood: 0, food: 0, gold: 0 };
      let total_tokens = {fww: 0, fwf: 0, fwg: 0};
      let total_resources = {wood: 0, food: 0, gold: 0};
      let daily_output = { wood: 0, food: 0, gold: 0 };

      for (let ff = 0; ff < state.farms.length; ff++) {
        const info = state.farms[ff];
        if (info) {
          total_status = total_status && info.ok; // если будет проблема, станет false

          if (info.next_action_date != null) {
            if (next_action_date == null || (next_action_date != null && info.next_action_date < next_action_date)) {
              next_action_date = info.next_action_date;
              next_action = info.next_action;
              next_action_account = info.account_name;
            }
          }
          if (info.total_wax) total_cost += info.total_wax;
          if (info.profit_wax) total_profit += info.profit_wax;
          // daily profits
          if (info.daily_profit_wood) daily_profits.wood += info.daily_profit_wood
          if (info.daily_profit_food) daily_profits.food += info.daily_profit_food
          if (info.daily_profit_gold) daily_profits.gold += info.daily_profit_gold
          // daily output
          if (info.daily_output_wood) daily_output.wood += info.daily_output_wood
          if (info.daily_output_food) daily_output.food += info.daily_output_food
          if (info.daily_output_gold) daily_output.gold += info.daily_output_gold
          // resources
          if (info.balance.wood) total_resources.wood += info.balance.wood;
          if (info.balance.food) total_resources.food += info.balance.food;
          if (info.balance.gold) total_resources.gold += info.balance.gold;
          // tokens
          if (info.tokens.fww) total_tokens.fww += info.tokens.fww;
          if (info.tokens.fwf) total_tokens.fwf += info.tokens.fwf;
          if (info.tokens.fwg) total_tokens.fwg += info.tokens.fwg;
        }
      }
      commit("updateTotalStats", { total_profit, total_cost, total_status, next_action, next_action_date, next_action_account, daily_profits, 
          daily_output, total_tokens, total_resources });
    },

    // Обновим только курсы токенов и пересчитаем фермы
    async updatePrices({ state, commit, dispatch }) {
      // console.log("updatePrices");
      state.updatingPrices = true;
      let newPrices = await fw.getTokenPrices();
      if (newPrices) {
        if (newPrices.fwf == 0) newPrices.fwf = state.prices.fwf;
        if (newPrices.fwg == 0) newPrices.fwg = state.prices.fwg;
        if (newPrices.fww == 0) newPrices.fww = state.prices.fww;
        // ищем фармер коин чтобы обновить его цену
        if (state.atomic_assets.length > 0) {
          let fc_info = state.atomic_assets.filter((f) => f.template_id == "260676");
          if (fc_info && fc_info[0]) {
            newPrices.fc = fc_info[0]["average_price"];
          }
        }
        commit('updatePrices', newPrices);
        dispatch('savePrices');
      }

      // Обновим данные дополнительных ферм
      for (let ff = 0; ff < state.farms.length; ff++) {
        const info = await fw.updateGame(state.farms[ff], newPrices, state.atomic_assets);
        if (info) {
          commit('updateFarm', info);
          dispatch('saveFarms');
          // console.log("пересчитал ферму " + farm);
        } else {
          console.log("не удалось пересчитать ферму " + ff);
        }
      }
      dispatch('calcFarms');
      state.updatingPrices = false;
    },

    // Добавить новую ферму
    async addFarm(context, newFarm) {
      let f = false;
      for (let i = 0; i < context.state.farms.length && !f; i++) {
        if (context.state.farms[i].account_name == newFarm) {
          f = true;
        }
      }
      if (f) {
        console.log("Уже есть такая ферма...");
      } else {
        context.state.top_loading = true;
        const info = await fw.getGame({ account_name: newFarm }, context.state.prices, 
                                        context.state.atomic_assets, context.state.default_settings);
        if (info) {
          info.num = context.state.farms.length + 1;
          context.commit('updateFarm', info);
          context.dispatch('loadFarmIncome', info.account_name);
          context.dispatch('calcFarms');
          context.dispatch('saveFarms');
          console.log("обновил данные для " + newFarm);
        } else {
          console.log("не удалось обновить данные для " + newFarm);
        }
        context.state.top_loading = false;
      }
    },
    // Обновить одну ферму
    async updateFarm(context, account_name) {
      let farm = null;
      for (let i = 0; i < context.state.farms.length; i++) {
        if (context.state.farms[i].account_name == account_name) {
          farm = context.state.farms[i]; break;
        }
      }
      if (farm) {
        const info = await fw.getGame(farm, context.state.prices, context.state.atomic_assets, context.state.default_settings);
        if (info) {
          context.commit('updateFarm', info);
          context.dispatch('saveFarms');
          context.dispatch('calcFarms');
          // console.log("обновил данные для " + account_name);
        } else {
          console.log("не удалось обновить данные для " + account_name);
        }
      }
    },
    // просчитаем и обновим доход фермы из базы логов
    async updateFarmIncome({ state, commit }, account_name) {
      // let found = false;
      // if (state.farms.length > 0) {
      //   for (let c = 0; c < state.farms.length; c++) {
      //     if (state.farms[c].account_name == account_name) {
      //       let {income, donations} = await calcFarmIncome(state.farms[c].account_name);
      //       commit('updateFarmIncome', { account_name: state.farms[c].account_name, income, donations });
      //       found = true;
      //       break;
      //     }
      //   }
      // }
      // if (!found) console.log("Не смог обновить доходы фермы " + account_name);
    },

    // загрузим данные по доходам фермы из базы
    async loadFarmIncome({ state, commit }, account_name) {
      let income = await loadFarmIncome(account_name);
      console.log("+ loadFarmIncome: " + account_name + " income: " + JSON.stringify(income));

      commit('updateFarmIncome', { account_name: account_name, income });
    },
    // Удалить ферму из списка
    async deleteFarm(context, account_name) {
      context.commit("deleteFarm", account_name);
      context.dispatch('saveFarms');
      context.dispatch('calcFarms');
    },

    // Выбрать ферму для показа
    selectFarm(context, farm_name) {
      let f = false; let index = 0;
      for (let i = 0; i < context.state.farms.length; i++) {
        if (context.state.farms[i].account_name == farm_name) {
          f = true; index = i; break;
        }
      }
      if (f) {
        context.state.selectedFarmIndex = index;
        context.state.showAllFarms = false;
      }
    },

    // Выбрать все фермы для показа
    selectAllFarms(context) {
      context.state.showAllFarms = true;
    },

    // Убрать все фермы из списка
    clearAllFarms(context) {
      let newFarms = context.state.farms.filter(f=>f.wax_login);
      context.state.farms = newFarms;
      context.state.selectedFarmIndex = 0;
    },    

    // Начать обновление
    async startGameUpdateTimer({ commit, state, dispatch }) {
      commit('startChecking');
    },
    // Остановить обновление ферм
    async stopTimer(context) {
      context.commit('stopChecking');
    },
    // Обновить атомик активы
    async updateAtomicAssets({ state, commit, dispatch }) {
      // const assets_on_sale = await fw.get_assets_on_sale('ehcza.wam');
      // console.log("!!! Sales: " + JSON.stringify(assets_on_sale, null, 2));

      state.updatingAtomic = true;
      const updated_assets = await atomic.updateAssetPrices(state.atomic_assets, state.prices);
      commit('updateAtomicAssets', updated_assets);
      state.updatingAtomic = false;
      // сохраним список активов через минуту, дадим время на загрузку
      setTimeout(() => { dispatch('saveAtomicAssets') }, 10000);
    },
    // Обновим данные по доходу фермы из логов
    async updateFarmIncomeFromLog(context, log) {
      context.commit("updateFarmIncomeFromLog", log);
      let found = false; 
      for (let i = 0; i < context.state.farms.length && !found; i++) {
        const ff = context.state.farms[i];
        if (ff.account_name == log.owner) {
          let balance_wax = 0;
          let total_wax = 0;
          let donate = 0;
          if (ff.income) {
            // посчитаем общую сумму дохода по текущим ценам
            total_wax = ff.income.wood * ff.prices.fww + ff.income.food*ff.prices.fwf + ff.income.gold*ff.prices.fwg +
            ff.income.barley*ff.prices.fwg*41 + ff.income.corn*ff.prices.fwg*61 + ff.income.eggs*ff.prices.fwg*281 + 
            ff.income.milk*ff.prices.fwg*141;
            balance_wax = total_wax*0.05;
            donate = balance_wax - ff.awax_balance;
          }

          let state = {
            last_update: new Date(),
            account_name: ff.account_name,
            mins_to_action: ff.mins_to_action,
            cpu_used: ff.account.cpu_used_percent,
            food: (ff.tokens.fwf + ff.balance.food + ff.balance.energy / 5) / 
                    (ff.daily_expense_food / 24 / 60),
            total_wax: ff.total_wax,
            total_usd: ff.total_wax*ff.prices.wax,
            income: ff.income,
            profit_wax: ff.profit_wax,
            profit_usd: ff.profit_wax * ff.prices.wax,
            balance_wax: balance_wax,
            total_income_wax: total_wax,
            donate: donate, 
            awax_balance: ff.awax_balance,        
          }
          await fb_updateFarmState(state);      
        }
      }
    }
  },
  modules: {
    fw, atomic
  }
})