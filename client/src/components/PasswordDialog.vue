<template>
  <v-dialog v-model="show" max-width="350px">
    <v-card>
      <!-- <v-row class="flex-column fill-height px-3"> -->
      <v-col cols="auto" class="text-left">
        <v-row class="flex-column ma-0 fill-height">
          <v-col class="px-1">
            <div class="text-overline px-1">
              Login information
            </div>
          </v-col>

          <v-col class="px-1 py-1 text-subtitle-2"
            >Email:
            <span class="text-subtitle-1">
              {{ user.email }}
            </span></v-col
          >
          <ValidationObserver
            ref="form"
            tag="form"
            v-slot="{ invalid, validated, handleSubmit }"
          >
            <v-form @submit.prevent="save">
              <v-col class="px-1 py-1 text-subtitle-2">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="oldpass"
                  rules="required|checkHash"
                >
                  <v-text-field
                    name="oldpass"
                    ref="oldpass"
                    v-model="oldpass"
                    :error-messages="errors"
                    :success="valid"
                    label="Current password"
                    type="password"
                    required
                    counter
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col class="px-1 py-1 text-subtitle-2">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="password"
                  rules="required"
                >
                  <v-text-field
                    name="password"
                    ref="password"
                    v-model="password"
                    :error-messages="errors"
                    :success="valid"
                    label="Password"
                    type="password"
                    required
                    counter
                    prepend-icon="mdi-lock"
                  ></v-text-field> </ValidationProvider
              ></v-col>

              <v-col class="px-1 py-1 text-subtitle-2">
                <ValidationProvider
                  name="confirm"
                  rules="required|confirmed:password"
                  v-slot="{ errors, valid }"
                >
                  <v-text-field
                    name="confirm"
                    ref="confirm"
                    v-model="confirm"
                    :error-messages="errors"
                    :success="valid"
                    label="Repeat password"
                    type="password"
                    required
                    counter
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
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
      <!-- </v-row> -->
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

extend('confirmed', {
  ...confirmed,
  message: 'Пароли не совпадают',
});

extend('checkHash', (value) => {
  return AuthService.checkHash(value);
});
export default {
  components: { ValidationProvider, ValidationObserver },
  props: {
    value: Boolean,
    user: {},
  },
  data: () => ({
    error: '',
    check: false,
    oldpass: '',
    password: '',
    confirm: '',
  }),
  computed: {
    show: {
      get() {
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
      this.oldpass = '';
      this.password = '';
      this.confirm = '';
    },
    save() {
      const user = this.user;
      user.password = this.confirm;
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
