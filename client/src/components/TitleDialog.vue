<template>
  <v-dialog v-model="show" max-width="450px">
    <v-card>
      <v-col cols="auto" class="text-left">
        <v-row class="flex-column ma-0 fill-height">
          <v-col class="px-1">
            <div class="text-overline px-1">
              Title information
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
                  name="Title"
                  rules="required"
                >
                  <v-text-field
                    name="title"
                    v-model="title"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="Title"
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
import AdminService from '../services/admin.service';
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
    event: {},
  },
  data: () => ({
    title: '',
    error: '',
  }),
  computed: {
    show: {
      get() {
        this.title = this.event.title;
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    closeDialog() {
      this.show = false;
      this.country_backup = null;
    },
    save() {
      const event = this.event;
      event.title = this.title;
      return this.$store.dispatch('event/updateEventInfo', event).then(
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
