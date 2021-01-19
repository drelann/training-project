<template>
  <v-dialog v-model="show" max-width="1000px">
    <v-card>
      <v-row class="flex-column fill-height px-3">
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
                <v-row>
                  <v-col cols="3" class="px-1 py-1 text-subtitle-2">
                    <span>Start date</span>
                    <v-date-picker
                      v-model="dates.start_date"
                      full-width
                      class="mt-3"
                      show-current="false"
                      :max="allowedDates.start_date.max"
                      :events="functionEvents"
                      @input="onStartDateChange"
                    ></v-date-picker
                  ></v-col>
                  <v-col cols="3" class="px-1 py-1 text-subtitle-2">
                    <span>C1 date</span>
                    <v-date-picker
                      v-model="dates.c1_date"
                      full-width
                      class="mt-3"
                      :min="allowedDates.c1_date.min"
                      :max="allowedDates.c1_date.max"
                      :events="functionEvents"
                      show-current="false"
                      @input="onC1DateChange"
                    ></v-date-picker
                  ></v-col>
                  <v-col cols="3" class="px-1 py-1 text-subtitle-2">
                    <span>C+1 date</span>
                    <v-date-picker
                      v-model="dates.c1p_date"
                      full-width
                      class="mt-3"
                      :min="allowedDates.c1p_date.min"
                      :max="allowedDates.c1p_date.max"
                      :events="functionEvents"
                      show-current="false"
                      @input="onC1PDateChange"
                    ></v-date-picker
                  ></v-col>
                  <v-col cols="3" class="px-1 py-1 text-subtitle-2">
                    <span>Finish date</span>
                    <v-date-picker
                      v-model="dates.finish_date"
                      full-width
                      class="mt-3"
                      :min="allowedDates.finish_date.min"
                      :events="functionEvents"
                      show-current="false"
                      @input="onFinishDateChange"
                    ></v-date-picker
                  ></v-col>
                </v-row>
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
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import Notification from '../components/Notification';
import dayjs from '../plugins/dayjs';
import axios from 'axios';
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
  name: 'DateDialog',
  components: { ValidationProvider, ValidationObserver },
  props: {
    value: Boolean,
    event: {},
  },
  data: () => ({
    error: '',
    allowedDates: {
      start_date: {
        min: '',
        max: '',
      },
      c1_date: {
        min: '',
        max: '',
      },
      c1p_date: {
        min: '',
        max: '',
      },
      finish_date: {
        min: '',
        max: '',
      },
    },
    dates: {
      start_date: '',
      c1_date: '',
      c1p_date: '',
      finish_date: '',
    },
  }),
  computed: {
    show: {
      get() {
        //start date
        this.allowedDates.start_date.max = this.$date(
          this.event.c1_date,
          'DD/MM/YYYY',
        )
          .subtract(1, 'day')
          .format('YYYY-MM-DD');
        this.dates.start_date = this.$date(
          this.event.start_date,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
        //C1 date
        this.allowedDates.c1_date.min = this.$date(
          this.event.start_date,
          'DD/MM/YYYY',
        )
          .add(1, 'day')
          .format('YYYY-MM-DD');
        this.allowedDates.c1_date.max = this.$date(
          this.event.c_plus_1_date,
          'DD/MM/YYYY',
        )
          .subtract(1, 'day')
          .format('YYYY-MM-DD');
        this.dates.c1_date = this.$date(
          this.event.c1_date,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
        //C+1 Date
        this.allowedDates.c1p_date.min = this.$date(
          this.event.c_plus_1_date,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
        this.allowedDates.c1p_date.max = this.$date(
          this.event.finish_date,
          'DD/MM/YYYY',
        )
          .subtract(1, 'day')
          .format('YYYY-MM-DD');
        this.dates.c1p_date = this.$date(
          this.event.c_plus_1_date,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
        //Finish Date
        this.allowedDates.finish_date.min = this.$date(
          this.event.finish_date,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
        this.dates.finish_date = this.$date(
          this.event.finish_date,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');

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
    },
    onStartDateChange() {
      this.allowedDates.c1_date.min = this.$date(this.dates.start_date)
        .add(1, 'day')
        .format('YYYY-MM-DD');
    },
    onC1DateChange() {
      this.allowedDates.start_date.max = this.$date(this.dates.c1_date)
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
      this.allowedDates.c1p_date.min = this.$date(this.dates.c1_date)
        .add(1, 'day')
        .format('YYYY-MM-DD');
    },
    onC1PDateChange() {
      this.allowedDates.finish_date.min = this.$date(
        this.dates.c1p_date,
      ).format('YYYY-MM-DD');
      this.allowedDates.c1_date.max = this.$date(this.dates.c1p_date)
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
      //   this.allowedDates.c1p_date.max = this.$date(this.dates.finish_date)
      //     .subtract(1, 'day')
      //     .format('YYYY-MM-DD');
    },
    onFinishDateChange() {
      this.allowedDates.finish_date.min = this.dates.finish_date;
      this.allowedDates.c1p_date.max = this.dates.finish_date;
    },
    functionEvents(date) {
      if (
        this.$date(date).isSameOrAfter(this.dates.c1p_date) &&
        this.$date(date).isSameOrBefore(this.dates.finish_date)
      ) {
        return 'blue';
      } else if (
        this.$date(date).isBefore(this.dates.c1p_date) &&
        this.$date(date).isSameOrAfter(this.dates.c1_date)
      ) {
        return 'green';
      } else if (
        this.$date(date).isBefore(this.dates.c1_date) &&
        this.$date(date).isSameOrAfter(this.dates.start_date)
      ) {
        return 'orange';
      }
    },
    save() {
      const event = this.event;
      event.title = this.title;
      return this.$store.dispatch('event/updateEventInfo', event).then(
        //TODO: вывести alert
        (response) => {
          //this.user = response.data;
          this.closeDialog();
        },
        (error) => {
          const err = {
            message: error.response.data.message,
            type: error.response.data.status,
          };
          this.notification = Object.assign({}, this.notification, {
            message: err.message,
            type: err.type,
          });
        },
      );
    },
  },
};
</script>
