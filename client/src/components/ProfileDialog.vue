<template>
  <v-dialog v-model="show" max-width="450px">
    <v-card>
      <v-col cols="auto" class="text-left">
        <v-row class="flex-column ma-0 fill-height">
          <v-col class="px-1">
            <div class="text-overline px-1">
              Profile information
            </div>
          </v-col>

          <ValidationObserver
            ref="form"
            tag="form"
            v-slot="{ invalid, validated, handleSubmit }"
          >
            <v-form @submit.prevent="save">
              <v-col class="px-1 py-1 text-subtitle-2">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="First Name"
                  rules="required"
                >
                  <v-text-field
                    name="firstname"
                    v-model="user_child.firstname"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="First Name"
                    prepend-icon="mdi-account"
                  ></v-text-field> </ValidationProvider
              ></v-col>
              <v-col class="px-1 py-1 text-subtitle-2">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="Last Name"
                  rules="required"
                >
                  <v-text-field
                    name="lastname"
                    v-model="user_child.lastname"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="Last Name"
                    prepend-icon="mdi-account"
                  ></v-text-field> </ValidationProvider
              ></v-col>
              <ValidationProvider
                v-slot="{ errors, valid }"
                name="Country"
                rules="required"
              >
                <v-autocomplete
                  :items="countries"
                  item-text="name"
                  item-value="id"
                  :error-messages="errors"
                  :success="valid"
                  v-model="country_backup_child"
                  @input="setCountry(country_backup_child)"
                  label="Country"
                  prepend-icon="mdi-map"
                ></v-autocomplete>
              </ValidationProvider>
              <v-col class="px-1 py-1 text-subtitle-2">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="About"
                  rules="required"
                >
                  <v-text-field
                    name="about"
                    v-model="user_child.about"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="About"
                    prepend-icon="mdi-account"
                  ></v-text-field> </ValidationProvider
              ></v-col>
              <v-row>
                <v-col class="mr-auto">
                  <v-btn
                    class="float-left"
                    color="primary"
                    text
                    @click.stop="closeDialog"
                    >Close</v-btn
                  ></v-col
                >
                <v-col class="ml-auto">
                  <v-btn
                    class="float-right"
                    color="success"
                    text
                    :disabled="invalid || !validated"
                    @click="handleSubmit(save)"
                    >Save</v-btn
                  ></v-col
                >
              </v-row>
            </v-form>
          </ValidationObserver>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import Notification from '../components/Notification';
import axios from 'axios';
import AuthService from '../services/auth.service';
import {
  validator,
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required, confirmed } from 'vee-validate/dist/rules';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'Поле {_field_} не может быть пустым',
});

export default {
  components: { ValidationProvider, ValidationObserver },
  props: {
    value: Boolean,
    user: {},
    countries: {},
    country_backup: {},
  },
  data: () => ({
    user_child: {},
    country_backup_child: {},
    error: '',
  }),
  watch: {
    user: function(val) {
      Object.assign(this.user_child, this.user);
      Object.assign(this.country_backup_child, this.country_backup);
      this.setCountry(this.user.country.id);
    },
  },
  mounted() {},
  computed: {
    show: {
      get() {
        Object.assign(this.user_child, this.user);
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    currentUser() {
      return this.$store.state.auth.userData;
    },
  },
  methods: {
    closeDialog() {
      this.show = false;
    },
    setCountry(country_id) {
      this.country_backup_child = {
        code: this.countries[country_id - 1].code,
        id: country_id,
        name: this.countries[country_id - 1].name,
      };
    },
    save() {
      const user = Object.assign({}, this.user_child);
      user.country = this.country_backup_child;
      return this.$store.dispatch('auth/updateUserInfo', user).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.closeDialog();
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
