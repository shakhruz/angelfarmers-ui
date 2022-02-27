import Vue from "vue";

Vue.mixin({
  methods: {   
    formatAssetPrice(price, len = 2) {
        if (!price) price = 0;
        const str = price.toFixed(len);
        return str;
    },
    formatAsset(value, len = 2) {
        if (!value) value = 0;
        return Number(value).toFixed(len);
    },
    formatSellAssetPrice(value) {
        if (!value) value = 0;
        return Number(value).toFixed(8) + " WAX";
    },   
    formatLongAsset(value, len = 4) {
        if (!value) value = 0;
        return Number(value).toFixed(len);
    },
    formatLargeAsset(value) {
        if (!value) value = 0;
        value = new Intl.NumberFormat().format(value.toFixed(0))
        return value;
    },
    formatDate(mydate) {
        if (mydate==null) return "";
        var hours = mydate.getHours();
        var minutes = "0" + mydate.getMinutes();
        var seconds = "0" + mydate.getSeconds();
        
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    },
    formatFullDate(mydate) {
        if (mydate==null) return "";
        var formattedTime = mydate.toLocaleString();
        return formattedTime;
    },    
    minsFormatted(minutes) {
        if (minutes==null) return "";
        // if (minutes <0) return "00:00"
        var str = "";
        if (minutes<0) {
            str = "-";
            minutes = Math.abs(minutes);
        }        
        const days = Math.floor(minutes / 1440);
        if (days > 0) {        
            str += days.toString() + this.$t("d") + " ";
        }
        const hours = Math.floor((minutes - days * 1440) / 60);
        if (hours > 0) {        
            str += hours.toString() + this.$t("h") + " ";
        }
        const mins = minutes - days*1440 - hours*60;
        if (Math.floor(mins)>0 || hours==0) str += Math.floor(mins).toString() + this.$t("m");
        return str;
    },
    minutesToAction(minutes) {
        if (minutes==null) return "";
        // if (minutes <0) return "00:00"
        let str = "";
        if (minutes<0) {
            str = "-";
            minutes = Math.abs(minutes);
        }
        const days = Math.floor(minutes / 1440);
        if (days > 0) {        
            str += days.toString() + this.$t("d") + " ";
        }
        const hours = Math.floor((minutes - days * 1440) / 60);
        if (hours > 0) {        
            str += hours.toString() + this.$t("h") + " ";
        }
        const mins = minutes - days*1440 - hours*60;
        str += Math.floor(mins).toString() + this.$t("m");
        return str;
    },    
    minsShort(minutes) {
        if (minutes==null) return "";
        if (minutes <0) return "0:00"
        var str = "";
        const days = Math.floor(minutes / 1440);
        if (days > 0) {        
            str += days.toString() + this.$t("d") + " ";
        }
        const hours = Math.floor((minutes - days * 1440) / 60);
        if (hours > 0) {        
            str += hours.toString() + ":";
        } else str += "0:"
        const mins = minutes - days*1440 - hours*60;
        str += ("0" + Math.floor(mins).toString()).substr(-2);
        return str;
    }, 
    formatPriceAtomic(price) {
        return (parseInt(price)/100000000).toFixed(4)
    },
    minsPassedFormat(fromDate) {
        if (!fromDate) return "";
        const myDate = new Date(parseInt(fromDate)*1000)
        const minutes = (new Date() - myDate) / 1000 / 60
        var str = "";
        const days = Math.floor(minutes / 1440);
        if (days > 0) {        
            str += days.toString() + this.$t("d") + " ";
        }
        const hours = Math.floor((minutes - days * 1440) / 60);
        if (hours > 0) {        
            str += hours.toString() + this.$t("h") + " ";
        }
        const mins = minutes - days*1440 - hours*60;
        str += Math.floor(mins).toString() + "м";
        return str;
    }, 
    timePassedFormat(fromDate, toDate) {
        if (toDate==null) toDate = new Date();
        else toDate = new Date(toDate);
        if (!fromDate) return "";
        const minutes = (toDate - new Date(fromDate)) / 1000 / 60
        // console.log("fromDate: " + toDate + " seconds: " + seconds)
        var str = "";
        const days = Math.floor(minutes / 1440);
        if (days > 0) {        
            str += days.toString() + this.$t("d") + " ";
        }
        const hours = Math.floor((minutes - days * 1440) / 60);
        if (hours > 0) {        
            str += hours.toString() + this.$t("h") + " ";
        }
        const mins = minutes - days*1440 - hours*60;
        str += Math.floor(mins).toString() + this.$t("m") + " ";

        const secs = (minutes * 60) - ((Math.floor(mins) + days*1440 + hours*60) * 60);
        str += Math.floor(secs).toString() + this.$t("s");
        return str;
    },      
  },  
});