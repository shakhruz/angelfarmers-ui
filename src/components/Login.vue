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

    <v-list width="200px">
      <v-list-item v-if="$store.state.userAccount">
        <v-list-item-title>
          <span v-if="$store.state.avatars && $store.state.avatars[0]">
            <img :src="$store.state.avatars[0].image_url" width="40" height="40" 
                  valign="top" align="left" hspace="10"/>
            <span class="ml-4">
              {{ $store.state.avatars[0].name }}
              <br/>
            </span >
            <span class="ml-4 mt-1">
              {{ $store.state.userAccount }}
            </span>
          </span>
          <span v-else>
            {{ $store.state.userAccount }}
          </span>
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
    async followLogin(logged_in) {
      if (logged_in) {
        console.log("logged_in: " + logged_in);
        this.$store.dispatch("login", logged_in);
        await this.getAvatars(logged_in);
      }
    }
  },
  computed: {
      avatar_link(){
          return `https://api.multiavatar.com/${this.$store.state.userAccount}.png`
      }
  }

};
</script>

<style scoped lang="scss"></style>
