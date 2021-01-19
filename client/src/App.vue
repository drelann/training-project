<template>
  <v-app>
    <v-app-bar app clipped-left color="red" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey darken-4">
      <v-list dense>
        <v-list-item v-if="!loggedIn" link to="/login">
          <v-list-item-action>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Авторизация</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!loggedIn" link to="/register">
          <v-list-item-action>
            <v-icon>mdi-account-plus-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Регистрация</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="userIsClient" to="/home">
          <v-list-item-action>
            <v-icon>mdi-alarm-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Events</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="loggedIn" to="/profile">
          <v-list-item-action>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="userIsAdmin" to="/admin">
          <v-list-item-action>
            <v-icon>mdi-account-supervisor-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="userIsAdmin" to="/events">
          <v-list-item-action>
            <v-icon>mdi-clipboard-list-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Events</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="loggedIn" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-row justify="center">
        <v-col class="col-sm-12 col-md-6">
          <div
            :type="alert.raw.type"
            v-for="alert in alerts"
            :key="alert.message"
          >
            <v-snackbar v-model="alert.raw.flag" :color="alert.raw.type">
              {{ alert.raw.message }}

              <template v-slot:action="{ attrs }">
                <v-btn
                  color="black"
                  text
                  v-bind="attrs"
                  @click="dismiss(alert)"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </div>
        </v-col>
      </v-row>

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {},
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    content: '',
    user: {},
  }),
  computed: {
    alerts() {
      //Get all notifications from store
      return this.$store.state.alert.alerts;
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    userIsAdmin() {
      if (this.$store.state.auth.userData == null) {
        return false;
      }
      return (
        this.$store.state.auth.userData.role == 'admin' &&
        this.$store.state.auth.status.loggedIn
      );
    },
    userIsClient() {
      if (this.$store.state.auth.userData == null) {
        return false;
      }
      return (
        ['no_role', 'expert', 'competitor'].includes(
          this.$store.state.auth.userData.role,
        ) && this.$store.state.auth.status.loggedIn
      );
    },
  },
  created() {
    this.$vuetify.theme.dark = true;
    this.initialize();
  },
  methods: {
    initialize() {
      this.getAllCountries();
    },
    async getAllCountries() {
      this.$store.dispatch('misc/getAllRecords').then(
        (response) => {
          this.countries = response.countries;
          this.fetchAuthenticatedUser();
        },
        (error) => {
          const notification = {
            message: error.response.data.message,
            type: error.response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
        },
      );
    },
    async fetchAuthenticatedUser() {
      if (this.$store.state.auth.status.loggedIn) {
        this.$store.dispatch('auth/getUserData').then(
          (response) => {
            this.user = response;
          },
          (error) => {
            const notification = {
              message: error.response.data.message,
              type: error.response.data.status,
              flag: true,
            };
            this.$store.dispatch('alert/add', notification);
          },
        );
      }
    },
    logout() {
      this.$store.dispatch('auth/logout', null, { root: true });
      this.$router.push('/login');
    },
    dismiss(alert) {
      this.$store.dispatch('alert/dismiss', alert);
    },
  },
};
</script>
