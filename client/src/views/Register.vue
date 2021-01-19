<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <ValidationObserver
          ref="observer"
          v-slot="{ invalid, validated, handleSubmit }"
        >
          <v-card class="elevation-12">
            <v-toolbar color="red" dark flat>
              <v-toolbar-title>Регистрация</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="register">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="First Name"
                  rules="required"
                >
                  <v-text-field
                    name="firstname"
                    v-model="user.firstname"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="First Name"
                    prepend-icon="mdi-account"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="Last Name"
                  rules="required"
                >
                  <v-text-field
                    name="lastname"
                    v-model="user.lastname"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="Last Name"
                    prepend-icon="mdi-account-supervisor"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="Country"
                  rules="required"
                >
                  <v-autocomplete
                    :items="countries"
                    item-text="name"
                    return-object
                    v-model="user.country"
                    :error-messages="errors"
                    :success="valid"
                    auto-select-first
                    label="Country"
                    prepend-icon="mdi-map"
                    @blur="getCountry"
                  ></v-autocomplete>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    name="email"
                    v-model="user.email"
                    :error-messages="errors"
                    :success="valid"
                    required
                    label="Email"
                    prepend-icon="mdi-email"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="password"
                  rules="required"
                >
                  <v-text-field
                    name="password"
                    v-model="user.password"
                    :error-messages="errors"
                    :success="valid"
                    label="Password"
                    required
                    prepend-icon="mdi-lock"
                    type="password"
                    @click:append="showp != showp"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  name="confirm"
                  rules="required|confirmed:password"
                  v-slot="{ errors, valid }"
                >
                  <v-text-field
                    name="confirm"
                    v-model="confirm"
                    :error-messages="errors"
                    :success="valid"
                    label="Repeat password"
                    required
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </ValidationProvider>
                <v-row>
                  <v-col cols="6">
                    <v-file-input
                      label="File input"
                      prepend-icon="mdi-camera"
                      @change="createBase64Image"
                      @click:clear="clearPhoto"
                      accept="image/*"
                      type="file"
                    ></v-file-input
                  ></v-col>
                  <v-col cols="6"
                    ><v-img :src="image" aspect-ratio="1.8" contain></v-img
                  ></v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="handleSubmit(register)"
                :disabled="invalid || !validated"
                >Регистрация <v-icon dark right>mdi-key</v-icon></v-btn
              >
            </v-card-actions>
            <v-col class="px-16">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <div class="text-body text-center">
                Уже зарегистрированы?
                <router-link :to="'/login'">Авторизация</router-link>
              </div>
            </v-col>
          </v-card>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required, email, confirmed } from 'vee-validate/dist/rules';
import User from '../models/user';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'Поле "{_field_}" не может быть пустым',
});

extend('email', {
  ...email,
  message: 'Введите корректный email',
});

extend('confirmed', {
  ...confirmed,
  message: 'This field confirmation does not match',
});

export default {
  name: 'RegisterForm',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    source: String,
  },
  data() {
    return {
      countries: null,
      image: '',
      confirm: '',
      user: new User('', '', '', '', '', '', '', '', ''),
      notification: {
        message: '',
        type: '',
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getAllCountries();
    },

    clearPhoto() {
      this.image = '';
      this.user.userpic = this.image;
    },
    createBase64Image(files) {
      if (files) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.image = e.target.result; //вывод на странице
          this.user.userpic = this.image; //передача файла при регистрации
        };
        reader.readAsDataURL(files);
      }
    },
    getCountry() {
      console.log('&');
      try {
        const country_id = this.countries.filter((country) => {
          return country.name == this.user.country;
        });
      } catch (error) {}
    },
    async getAllCountries() {
      this.$store.dispatch('misc/getAllRecords').then(
        (response) => {
          this.countries = response.countries;
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
    async register() {
      //обход "полезной" реализации списка стран стягиванием с бд
      const user = Object.assign({}, this.user);
      user.country = user.country.id;
      this.$store.dispatch('auth/register', user).then(
        () => {
          this.$router.push('/login');
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
  },
};
</script>
