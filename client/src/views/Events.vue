<template>
  <v-container class="full-height" fluid>
    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6">
        <div class="text-h4">Events</div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6">
        <v-card elevation="1">
          <v-data-table :headers="headers" :items="events">
            <template v-slot:item="row">
              <tr @click="goToEvent(row.item.id)">
                <td>{{ row.item.title }}</td>
                <td>{{ row.item.start_date }}-{{ row.item.finish_date }}</td>
                <td>{{ row.item.participants }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="dialog" max-width="650px">
      <ValidationObserver
        ref="form"
        tag="form"
        v-slot="{ invalid, validated, handleSubmit }"
      >
        <v-form @submit.prevent="saveEvent">
          <v-card>
            <v-card-title>
              <span class="headline">New Event</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <ValidationProvider
                      v-slot="{ errors, valid }"
                      name="Title"
                      rules="required"
                    >
                      <v-text-field
                        name="title"
                        v-model="editedItem.title"
                        :error-messages="errors"
                        :success="valid"
                        required
                        counter
                        label="Title"
                      ></v-text-field> </ValidationProvider
                  ></v-col>
                  <v-row align="start" class="align-start justify-center">
                    <v-col
                      align-self="center"
                      class="grey lighten-5 rounded mr-sm-0 mr-md-2 col-sm-12 col-md-4"
                      transition="fade-transition"
                    >
                      <v-img
                        class="mx-auto"
                        v-if="!editedItem.eventpic"
                        :src="`http://127.0.0.1:3333/events/placeholder.png`"
                        height="220"
                        width="220"
                      ></v-img>

                      <v-img
                        class="mx-auto"
                        v-if="editedItem.eventpic"
                        :key="editedItem.eventpic"
                        :src="editedItem.eventpic"
                        height="220"
                        width="220"
                      ></v-img>

                      <v-row justify="center" class="mt-3">
                        <v-col class="py-1 justify-center text-center"
                          ><v-btn
                            :disabled="editedItem.eventpic ? false : true"
                            class="mx-auto"
                            text
                            small
                            color="error"
                            @click="deleteImage"
                            >Delete</v-btn
                          ></v-col
                        >
                        <v-col class="mr-auto py-1 text-center"
                          ><v-btn
                            text
                            small
                            color="primary"
                            class="mx-auto"
                            @click="onPickFile"
                            >upload</v-btn
                          >
                          <input
                            type="file"
                            @change="createBase64Image"
                            ref="imageInput"
                            accept="image/png, image/jpeg, image/bmp"
                            style="display:none"
                        /></v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      class="px-1 py-1 text-subtitle-2 col-sm-12 col-md-6"
                      align-self="center"
                    >
                      <ValidationProvider
                        v-slot="{ errors, valid }"
                        ref="minDatesAmountProvider"
                        rules="minDatesAmount:4"
                      >
                        <input
                          type="text"
                          :value="editedItem.dates.length"
                          disabled
                          v-show="false"
                        />

                        <v-date-picker
                          name="dates"
                          ref="dates"
                          class="mt-3 col-sm-12 col-md-6"
                          show-current="false"
                          v-model="editedItem.dates"
                          :max="$date().format('YYYY-MM-DD')"
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
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Отменить</v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="invalid || !validated"
                @click="handleSubmit(saveEvent)"
                >Сохранить</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </ValidationObserver>
    </v-dialog>
    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6"
        ><v-btn @click="newEvent()" color="success" class="float-right"
          >New event</v-btn
        ></v-col
      ></v-row
    >
  </v-container>
</template>
<script>
import {
  validator,
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required, max, digits } from 'vee-validate/dist/rules';
import dayjs from '../plugins/dayjs';
setInteractionMode('eager');

extend('minDatesAmount', {
  validate: (value, { min }) => {
    return value == min;
  },
  params: ['min'],
  message: 'Количество дней должно быть равно {min}',
});
extend('required', {
  ...required,
  message: 'Поле {_field_} не может быть пустым',
});

export default {
  name: 'Events',
  components: {
    Notification,
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    notification: {
      message: '',
      type: '',
    },
    fixedHeader: true,
    height: 450,
    dialog: false,
    headers: [
      { text: 'Event', value: 'title', sortable: false },
      { text: 'Dates', value: '', sortable: false },
      { text: 'Participants', value: 'participants', sortable: false },
    ],
    events: [],
    error: '',
    editedItem: {
      title: '',
      eventpic: '',
      dates: [],
    },
    defaultItem: {
      title: '',
      eventpic: '',
      dates: [],
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    editedItem: {
      deep: true,
      handler() {
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
      },
    },
  },
  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getAllEvents();
    },
    getAllEvents() {
      this.$store.dispatch('event/getAllEvents').then(
        (response) => {
          this.events = response.events;
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
    goToEvent(id) {
      this.$router.push({ name: `Event`, params: { id: id } });
    },
    //open dialog
    newEvent() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedItem.dates.push(this.$date().format('YYYY-MM-DD'));
      this.dialog = true;
    },
    //sort and validate dates
    onMultiDateChange() {
      this.editedItem.dates.sort((a, b) =>
        this.$date(a, 'YYYY-MM-DD').isAfter(this.$date(b, 'YYYY-MM-DD'))
          ? 1
          : -1,
      );
      this.$nextTick(async () => {
        this.$refs.minDatesAmountProvider.validate();
      });
    },
    //set colored events
    multiFunctionEvents(date) {
      if (
        this.$date(date).isSameOrAfter(this.editedItem.dates[2]) &&
        this.$date(date).isSameOrBefore(this.editedItem.dates[3])
      ) {
        return 'blue';
      } else if (
        this.$date(date).isBefore(this.editedItem.dates[2]) &&
        this.$date(date).isSameOrAfter(this.editedItem.dates[1])
      ) {
        return 'green';
      } else if (
        this.$date(date).isBefore(this.editedItem.dates[1]) &&
        this.$date(date).isSameOrAfter(this.editedItem.dates[0])
      ) {
        return 'orange';
      }
    },
    //open explorer
    onPickFile() {
      this.$refs.imageInput.click();
    },
    //convert input to base64 image
    createBase64Image(event) {
      if (event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editedItem.eventpic = e.target.result;
          //this.uploadImage();
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },
    //clear base64 info pic
    deleteImage() {
      this.editedItem.eventpic = '';
    },
    saveEvent() {
      console.log(this.editedItem);
      this.$store.dispatch('event/saveEvent', this.editedItem).then(
        (response) => {
          this.getAllEvents();
          this.close();
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
    //close dialog and clear info about new event
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
  },
};
</script>
