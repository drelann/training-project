<template>
  <v-dialog v-model="show" max-width="450px">
    <v-card>
      <v-col cols="auto" class="text-left">
        <v-row class="flex-column ma-0 fill-height">
          <v-col class="px-1">
            <div class="text-overline px-1">
              PIN information
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
                  name="pin"
                  rules="required|max:4|digits:4"
                >
                  <v-text-field
                    name="pin"
                    ref="pin"
                    v-model="pin_backup"
                    :error-messages="errors"
                    :success="valid"
                    label="PIN code"
                    type="text"
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
    </v-card>
  </v-dialog>
</template>

<script>
import Notification from '../components/Notification';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required, max, digits } from 'vee-validate/dist/rules';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'Поле {_field_} не может быть пустым',
});

extend('max', {
  validate(value, args) {
    return value.length == args.length;
  },
  params: ['length'],
  message: 'Поле {_field_} должно быть равно 4 символам',
});

extend('digits', {
  validate(value, args) {
    return /^\d+$/.test(value);
  },
  message: 'Поле {_field_} должно состоять только из цифр',
});

export default {
  components: { ValidationProvider, ValidationObserver },
  props: {
    user: {},
    value: Boolean,
    pin: '',
  },
  data: () => ({
    error: '',
    pin_backup: 0,
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
      this.pin_backup = 0;
    },
    save() {
      const user = this.user;
      user.PIN = this.pin_backup;
      return this.$store.dispatch('auth/updateUserInfo', user).then(
        //TODO: вывести alert
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
