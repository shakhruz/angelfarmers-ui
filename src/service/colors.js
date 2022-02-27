import Vue from "vue";

Vue.mixin({
  methods: {        
    getOutputColor(output) {
        if (output<0) return 'red lighten-4';
        if (output>0) return "green lighten-1";
        if (output==0) return "";
        return '';
    }, 
    percentStyle(value) {
        if (!value) return '';
        if (value>0) return 'num_positive';
        if (value<0) return 'num_negative';
    },
    getNumberColor (num) {
        if (num==0) return '';
        if (num > 0) return 'green--text'
        else return 'red--text'
    }, 
    getMinsColor (num) {
        if (num==0) return '';
        if (num > 0) return 'green--text'
        else return 'red--text'
    }, 
    toolColor(tool) {
        if (tool.claim_mins<0) return 'red';
        if (tool.current_durability < tool.durability/2) return 'red';
        return 'green'
    },
    mbsColor(tool) {
        if (tool.claim_mins<0) return 'red';
        return 'green'
    },
    getResourceNumberColor (num) {
        if (num==0) return '';
        if (num > 0) return 'green--text'
        if (num < 0) return 'red--text'
        return '';
    },        
    getMinsToActionColor(mins) {
        if (!mins || mins==null) return '';
        if (mins<0) return 'red--text';
        return '';
    },
    getCPUColor(cpu_used) {
        return this.getPercentColor(cpu_used);
    },    
    getEnergyColor(energy, max_energy) {
        const ratio = 100 - energy / max_energy * 100;
        return this.getPercentColor(ratio);
    },
    // даем цвет для процентов - чем выше, тем краснее. Ниже 50% без цвета
    getPercentColor(ratio) {
        if (ratio>99) return 'red darken-3';
        if (ratio>90) return 'red darken-2';
        if (ratio>80) return 'red darken-1';
        if (ratio>70) return 'orange darken-3';
        if (ratio>60) return 'orange darken-2';
        if (ratio>50) return "orange darken-1";
        if (ratio>40) return "green darken-5";
        if (ratio>30) return "green darken-4";
        if (ratio>20) return "green darken-3";
        if (ratio>10) return "green darken-2";
        return 'green darken-1';
    },
    getFoodColor(food) {
        if (food<100) return "red lighten-4";
        return '';
    },
    getGoldColor(gold) {
        if (gold<50) return "red lighten-4";
        return '';
    }, 
    farmBackgroundColor(farm) {
        if (this.$store.state.pause_all || farm.settings.pause_all_actions) return 'grey darken-1 white--text';
        if (farm.managed) {
            return farm.ok ? 'green white--text' : 'red white--text'
        } else {
            return farm.ok ? 'grey darken-1 white--text' : 'red white--text'
        }
        return '';
    }, 
  },  
});