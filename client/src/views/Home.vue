<template>
  <v-container class="full-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="3"></v-col>
      <v-col cols="6" sm="6" md="6">
        <Notification
          :message="notification.message"
          :type="notification.type"
          v-if="notification.message"
        ></Notification>
      </v-col>
      <v-col cols="3"></v-col
    ></v-row>
    <div v-if="!user.event_id">
      <v-card class="mx-auto" max-width="500" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">
              sorry but you haven't been assigned to the event yet
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div v-else-if="user.event_id">
      <v-row>
        <v-col cols="2" sm="0" md="2"></v-col>
        <v-col cols="8" sm="12" md="8">
          <v-row justify="space-around"
            ><v-col
              ><div class="text-h5">{{ event.title }}</div></v-col
            >
            <v-col class="float-right">
              <v-btn
                :disabled="defaultItem.event_id == -1"
                color="green"
                class="mr-auto"
                @click="downloadAllDocuments"
                >Download all Documents</v-btn
              ></v-col
            ></v-row
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" sm="0" md="2"></v-col>
        <v-col cols="8" sm="12" md="8">
          <v-card elevation="1">
            <v-data-table
              :headers="headers"
              :items="documents"
              @click:row="handleClick"
            >
              <template v-slot:item.destination="props">
                <span v-if="props.item.destination == `expert`"> Experts</span>
                <span v-else-if="props.item.destination == `competitor`">
                  Competitors</span
                >
              </template>
              <template v-slot:item.signed_by="props">
                <span v-if="props.item.signed">
                  Signed by {{ props.item.signed_name }}</span
                >
                <span v-else>
                  <v-btn
                    text
                    color="orange"
                    class="ml-auto"
                    @click.stop="handleClick"
                    @click="editDocument(props.item)"
                    >Sign</v-btn
                  ></span
                >
              </template>
            </v-data-table>
            <v-dialog persistent v-model="dialog" max-width="300px">
              <ValidationObserver
                ref="form"
                tag="form"
                v-slot="{ invalid, validated, handleSubmit }"
              >
                <v-form @submit.prevent="saveDocument">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Sign document</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <ValidationProvider
                              v-slot="{ errors, valid }"
                              name="pin"
                              ref="pinEqual"
                              :rules="`required|max:4|digits:4|pinEqual`"
                            >
                              <v-text-field
                                name="pin"
                                ref="pin"
                                v-model="pin"
                                :error-messages="errors"
                                :success="valid"
                                label="PIN code"
                                type="text"
                                required
                                counter
                                prepend-icon="mdi-lock"
                                @blur="validatePin"
                              ></v-text-field> </ValidationProvider
                          ></v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >Отменить</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        :disabled="invalid || !validated"
                        @click="handleSubmit(save)"
                        >Сохранить</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-form>
              </ValidationObserver>
            </v-dialog>
            <v-dialog v-model="menu" max-width="650px">
              <v-card class="d-inline-block mx-auto">
                <v-container class="py-0">
                  <v-row class="flex-column fill-height">
                    <v-col cols="auto" class="text-left">
                      <v-row class="flex-column ma-0 fill-height">
                        <v-col class="px-3 py-1">
                          <v-row class="d-flex px-1"
                            ><div class="text-overline">
                              Document
                            </div>
                            <v-btn
                              text
                              color="orange"
                              class="ml-auto"
                              @click="downloadDocument(editedItem)"
                              >Download</v-btn
                            ></v-row
                          ></v-col
                        >

                        <v-col class="px-1 py-1 text-subtitle-2">{{
                          editedItem.title
                        }}</v-col>
                        <v-col class="px-1 py-1 text-subtitle-2"
                          >Day:
                          <span class="text-subtitle-1">
                            {{ editedItem.date }}
                          </span></v-col
                        >
                        <v-col class="px-1 py-1 text-subtitle-2"
                          >For:
                          <span class="text-subtitle-1">
                            {{ editedItem.destination }}s
                          </span></v-col
                        >
                        <v-col class="px-1 py-1 text-subtitle-2"
                          >Content:
                          <span class="text-subtitle-1">
                            {{ editedItem.content }}
                          </span></v-col
                        >
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import AuthService from '../services/auth.service';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required, max, digits } from 'vee-validate/dist/rules';
import dayjs from '../plugins/dayjs';
import DownloaderService from '../services/downloader.service';
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

extend('pinEqual', {
  validate: (value, args) => {
    return AuthService.checkPin(value);
  },
  message: 'Поле {_field_} отличается от указанного',
});
export default {
  name: 'Home',
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
    dialog: false,
    menu: false,
    headers: [
      { text: 'Document', value: 'title', sortable: false },
      { text: 'Day', value: 'date', sortable: false },
      { text: 'For', value: 'destination', sortable: false, align: 'center' },
      { text: 'State', value: 'signed_by', sortable: false, align: 'center' },
    ],
    pin: '',
    user: {},
    documents: [],
    event: [],
    days: [],
    roles: [
      { text: 'Experts', value: 'expert' },
      { text: 'Competitors', value: 'competitor' },
    ],
    editedItem: {
      title: '',
      day: '',
      content: '',
      signed: 0,
      destination: '',
      availability: 0,
      event_id: 0,
      signed_by: 0,
    },
    defaultItem: {
      title: '',
      day: '',
      content: '',
      signed: 0,
      destination: '',
      availability: 0,
      event_id: 0,
      signed_by: 0,
    },
  }),
  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    },
    menu(val) {
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
      this.fetchAuthenticatedUser();
    },
    validatePin(pin) {
      this.$refs.pinEqual.validate();
    },
    editDocument(value) {
      this.menu = false;
      value.day = this.$date(value.day, 'DD/MM/YYYY').format('YYYY-MM-DD');
      this.editedItem = Object.assign({}, value);
      this.dialog = true;
    },
    handleClick(value) {
      value.day = this.$date(value.day, 'DD/MM/YYYY').format('YYYY-MM-DD');
      this.editedItem = Object.assign({}, value);
      this.menu = true;
    },
    close() {
      this.menu = false;
      this.dialog = false;
      this.pin = '';
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    downloadAllDocuments() {
      DownloaderService.downloadAllDocuments(this.event, this.documents);
    },
    downloadDocument(document) {
      DownloaderService.downloadDocument(document);
    },
    async fetchAuthenticatedUser() {
      this.$store.dispatch('auth/getUserData').then(
        (response) => {
          this.user = response;
          if (this.user.event_id) this.getAllDocuments(this.user.event_id);
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
    getAllDocuments(id) {
      this.$store.dispatch('document/getAllDocuments', id).then(
        (response) => {
          this.event = response.event[0];
          this.days = this.event.dates;
          this.documents = response.documents;
          if (response.documents.length > 0)
            this.defaultItem.event_id = this.documents[0].event_id;
          else this.defaultItem.event_id = -1;
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
    save() {
      const editedItem = this.editedItem;
      editedItem.signed = 'true';
      editedItem.signed_by = this.user.id;
      this.$store.dispatch('document/saveDocument', editedItem).then(
        (response) => {
          const notification = {
            message: response.message,
            type: response.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getAllDocuments(this.user.event_id);
          this.close();
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
