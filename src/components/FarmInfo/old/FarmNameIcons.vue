<template>
    <span v-if="farm.wax_login">
        &nbsp;<v-icon small>mdi-account-key</v-icon>
    </span>
    <span v-else-if="farm.settings.delegated_account && farm.settings.delegated_account.trim()!=''">
        &nbsp;<v-icon small>mdi-account-key-outline</v-icon>
    </span>
    <span v-else-if="farm.settings.private_key && farm.settings.private_key.trim()!=''">
        &nbsp;<v-icon small>mdi-key</v-icon>
    </span>    
</template>

<script>
export default {
  name: "FarmNameIcons",
  props: ["farm"],
  async mounted() {
  },
  methods: {
  }    
}
</script>

<style scoped>
</style>