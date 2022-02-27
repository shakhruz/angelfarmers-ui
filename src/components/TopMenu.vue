<template>
  <span v-if="!$vuetify.breakpoint.mobile">
    <v-btn small text outlined class="mx-1" @click="$router.push('/')">
        {{$t('FARMS')}}
    </v-btn>
    <v-btn small text outlined class="mx-1" @click="$router.push('/atomic-panel')">
        {{$t('ATOMIC')}}
    </v-btn>
    <v-btn small text outlined class="mx-1" @click="$router.push('/alcor-orderbooks')">
        {{$t('ALCOR')}}
    </v-btn>
  </span>
</template>

<script>
export default {
  name: "TopMenu",
  methods: {
  }
};
</script>

<style scoped lang="scss"></style>
