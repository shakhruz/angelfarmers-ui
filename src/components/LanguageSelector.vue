<template>
  <v-menu left  bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-web</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="changeLanguage('en');">
        <v-list-item-title>
          <img class="token" src="/us.svg"/> ENGLISH
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeLanguage('ru');">
        <v-list-item-title>
          <img class="token" src="/ru.svg"/> РУССКИЙ
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeLanguage('cn');">
        <v-list-item-title>
          <img class="token" src="/cn.svg"/> 中文
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "LanguageSelector",
  async mounted() {
  },
  methods: {
    changeLanguage(lang) {
      this.$i18n.locale=lang;
      this.$store.dispatch("loadUserMenuItems");
      localStorage.setItem('language', lang);
    }
  }
};
</script>

<style scoped lang="scss"></style>
