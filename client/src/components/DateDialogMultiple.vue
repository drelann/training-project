<template>
  <v-dialog v-model="show" persistent max-width="450px">
    <v-card>
      <v-col cols="auto" class="text-left">
        <v-row class="flex-column ma-0 fill-height">
          <v-col class="px-1">
            <div class="text-overline px-1">
              Dates information - Select 4 dates
            </div>
          </v-col>

          <ValidationObserver
            ref="form"
            tag="form"
            v-slot="{ invalid, validated, handleSubmit }"
          >
            <v-form @submit.prevent="save">
              <v-row>
                <v-col cols="12" class="px-1 py-1 text-subtitle-2">
                  <ValidationProvider
                    v-slot="{ errors, valid }"
                    ref="minDatesAmountProvider"
                    rules="minDatesAmount:4"
                  >
                    <input
                      type="text"
                      :value="multidates_copy.length"
                      disabled
                      v-show="false"
                    />

                    <v-date-picker
                      name="dates"
                      ref="dates"
                      v-model="multidates_copy"
                      full-width
                      class="mt-3"
                      show-current="false"
                      multiple
                      required
                      :events="multiFunctionEvents"
                      @input="onMultiDateChange"
                    ></v-date-picker>
                    <v-col
                      cols="12"
                      class="red--text"
                      :error-messages="errors"
                      :success="valid"
                      v-show="invalid"
                    >
                      {{ errors[0] }}
                    </v-col>
                  </ValidationProvider></v-col
                >
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
import { required, max, digits } from 'vee-validate/dist/rules';
import { mapState } from 'vuex';
setInteractionMode('eager');

extend('minDatesAmount', {
  validate: (value, { min }) => {
    return value == min;
  },
  params: ['min'],
  message: 'Количество дней должно быть равно {min}',
});

export default {
  name: 'DateDialogMultiple',
  components: { ValidationProvider, ValidationObserver },
  props: {
    value: Boolean,
    event_dates: Array,
    event: Object,
  },
  data: () => ({
    error: '',
    multidates_copy: [],
  }),
  created() {
    this.initialize();
  },
  watch: {
    event: function(val) {
      this.initialize();
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    initialize() {
      this.multidates_copy.length = 0;
      this.multidates_copy.push(this.event.start_date_format);
      this.multidates_copy.push(this.event.c1_date_format);
      this.multidates_copy.push(this.event.c_plus_1_date_format);
      this.multidates_copy.push(this.event.finish_date_format);
    },
    closeDialog() {
      //this.multidates_copy = [];
      this.show = false;
    },
    onMultiDateChange() {
      this.multidates_copy.sort((a, b) =>
        this.$date(a, 'YYYY-MM-DD').isAfter(this.$date(b, 'YYYY-MM-DD'))
          ? 1
          : -1,
      );
      this.$nextTick(async () => {
        this.$refs.minDatesAmountProvider.validate();
      });
    },
    multiFunctionEvents(date) {
      if (
        this.$date(date).isSameOrAfter(this.multidates_copy[2]) &&
        this.$date(date).isSameOrBefore(this.multidates_copy[3])
      ) {
        return 'blue';
      } else if (
        this.$date(date).isBefore(this.multidates_copy[2]) &&
        this.$date(date).isSameOrAfter(this.multidates_copy[1])
      ) {
        return 'green';
      } else if (
        this.$date(date).isBefore(this.multidates_copy[1]) &&
        this.$date(date).isSameOrAfter(this.multidates_copy[0])
      ) {
        return 'orange';
      }
    },
    save() {
      const event = {
        id: this.event.id,
        title: this.event.title,
        start_date: this.multidates_copy[0],
        c1_date: this.multidates_copy[1],
        c_plus_1_date: this.multidates_copy[2],
        finish_date: this.multidates_copy[3],
      };
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
