<template>
  <v-menu left  bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-if="$store.state.userAccount">
        <v-list-item-title>
          {{ $store.state.userAccount }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="!$store.state.logged_in" @click="manual_login()">
        <v-list-item-title>
          {{$t("WAX Cloud Login")}}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!$store.state.logged_in" @click="anchor_login()">
        <v-list-item-title>
          {{$t("Anchor Login")}}
        </v-list-item-title>
      </v-list-item>
      <v-list-item  v-if="$store.state.logged_in" @click="manual_logout()">
        <v-list-item-title>
            {{$t("Logout")}}&nbsp;<v-icon>mdi-exit-to-app</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "Login",
  async mounted() {
    this.autoLogin().then(logged_in => this.followLogin(logged_in));
  },
  methods: {
    manual_logout() {
      this.$store.dispatch("logout");
    },
    manual_login() {
      this.login().then(logged_in => this.followLogin(logged_in));
    },
    anchor_login() {
      this.login_with_anchor().then(logged_in => this.followLogin(logged_in));
    },
    followLogin(logged_in) {
      if (logged_in) {
        console.log("logged_in: " + logged_in);
        this.$store.dispatch("login", logged_in);
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>
