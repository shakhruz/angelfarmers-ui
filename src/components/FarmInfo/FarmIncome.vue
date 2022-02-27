<template>
    <span>
        <span v-if="income.gold>0">
            <v-chip small label color="amber" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.gold) }} {{$t("GOLD")}}
            </v-chip>
        </span>
        <span v-if="income.wood>0">
            <v-chip small label color="brown lighten-2" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.wood) }} {{$t("WOOD")}}
            </v-chip>
        </span>
        <span v-if="income.food>0">
            <v-chip small label color="teal" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.food) }} {{$t("FOOD")}}
            </v-chip>
        </span>
        <span v-if="income.barley>0">
            <v-chip small label color="orange" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.barley) }} {{$t("Barley")}}
            </v-chip>
        </span>
        <span v-if="income.corn>0">
            <v-chip small label color="orange" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.corn) }} {{$t("Corn")}}
            </v-chip>
        </span>
        <span v-if="income.eggs>0">
            <v-chip small label color="blue" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.eggs) }} {{$t("Eggs")}}
            </v-chip>
        </span>
        <span v-if="income.milk>0">
            <v-chip small label color="blue" class="mx-1 mb-1" outlined>
                {{ formatAsset(income.milk) }} {{$t("Milk")}}
            </v-chip>
        </span>
    </span>
</template>

<script>
export default {
    name: "FarmIncome",
    props: ["income"],
}
</script>