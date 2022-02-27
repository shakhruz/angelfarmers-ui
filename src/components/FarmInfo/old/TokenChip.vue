<template>
    <v-chip small>
      <div class="quote">
        <img class="token" :src="`/fw/${name}.png`"/>
        {{ formatAssetPrice(value) }}
      </div>
    </v-chip>
</template>

<script>

export default {
  name: "TokenChip",
  props: ['value', 'name' ]
};
</script>

<style scoped lang="scss"></style>