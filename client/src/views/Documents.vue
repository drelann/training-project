<template>
  <v-container class="full-height" fluid>
    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6">
        <v-row justify="space-around">
          <div class="text-h4">Documents</div>
          <div class="align-center">
            <v-btn @click="newDocument()" color="success">New document</v-btn>
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6">
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
          </v-data-table>
          <v-dialog persistent v-model="dialog" max-width="650px">
            <ValidationObserver
              ref="form"
              tag="form"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <v-form @submit.prevent="saveDocument">
                <v-card>
                  <v-card-title>
                    <span class="headline">Document</span>
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
                        <v-col cols="12" sm="12" md="12">
                          <v-date-picker
                            name="dates"
                            ref="dates"
                            :min="days[0]"
                            :max="days[3]"
                            v-model="editedItem.day"
                            full-width
                            class="mt-3"
                            show-current="false"
                            required
                          ></v-date-picker>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            rules="required"
                            name="Doument Content"
                          >
                            <v-textarea
                              solo
                              name="content"
                              label="Document Content"
                              required
                              v-model="editedItem.content"
                              :error-messages="errors"
                              :success="valid"
                            ></v-textarea>
                          </ValidationProvider>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            rules="required"
                            name="Role"
                          >
                            <v-autocomplete
                              :items="roles"
                              v-model="editedItem.destination"
                              name="role"
                              label="Role"
                              required
                              :error-messages="errors"
                              :success="valid"
                            ></v-autocomplete>
                          </ValidationProvider>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Отменить</v-btn
                    >
                    <v-btn
                      v-if="editedItem.id"
                      color="red darken-1"
                      text
                      @click="deleteDocument"
                      >Удалить</v-btn
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
          <v-dialog
            persistent
            v-model="menu"
            max-width="650px"
            @keydown.esc="close()"
          >
            <v-card class="d-inline-block mx-auto">
              <v-container class="py-0">
                <v-row class="flex-column fill-height">
                  <v-col cols="auto" class="text-left">
                    <v-row class="flex-column ma-0 fill-height">
                      <v-col class="px-3 py-1">
                        <v-row class="px-1" justify="space-between"
                          ><v-col align-self="start" class="text-overline">
                            Document information
                          </v-col>
                          <v-col align-self="end" class="text-right">
                            <v-btn text color="amber" @click="close"
                              >Close</v-btn
                            >
                            <v-btn text color="indigo" @click="editDocument"
                              >Edit</v-btn
                            >
                          </v-col>
                        </v-row></v-col
                      >

                      <v-col class="px-1 py-1 text-subtitle-2"
                        >Document Title:
                        <span class="text-subtitle-1">
                          {{ editedItem.title }}
                        </span></v-col
                      >
                      <v-col class="px-1 py-1 text-subtitle-2"
                        >Day:
                        <span class="text-subtitle-1">
                          {{ editedItem.date }}
                        </span></v-col
                      >
                      <v-col class="px-1 py-1 text-subtitle-2"
                        >Content:
                        <span class="text-subtitle-1">
                          {{ editedItem.content }}
                        </span></v-col
                      >
                      <v-col class="px-1 py-1 text-subtitle-2"
                        >For:
                        <span class="text-subtitle-1">
                          {{ editedItem.destination }}s
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
  </v-container>
</template>
<script>
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import dayjs from '../plugins/dayjs';

extend('required', {
  ...required,
  message: 'Поле {_field_} не может быть пустым',
});

export default {
  name: 'Documents',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    dialog: false,
    menu: false,
    headers: [
      { text: 'Document', value: 'title', sortable: false },
      { text: 'Day', value: 'date', sortable: false },
      { text: 'For', value: 'destination', sortable: false, align: 'center' },
    ],
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
  watch: {
    dialog(val) {
      val || this.close();
    },
    role_dialog(val) {
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
      this.getAllDocuments();
    },
    editDocument() {
      this.dialog = true;
    },
    handleClick(value) {
      var newObj = Object.assign({}, value);
      newObj.day = this.$date(value.day, 'DD/MM/YYYY').format('YYYY-MM-DD');
      this.editedItem = Object.assign({}, newObj);
      this.menu = true;
    },
    assignEvent(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    newDocument() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedItem.day = this.days[0];
      this.dialog = true;
    },
    close() {
      this.menu = false;
      this.dialog = false;
      this.role_dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    getAllDocuments() {
      this.$store
        .dispatch('document/getAllDocuments', this.$route.params.id)
        .then(
          (response) => {
            this.event = response.event[0];
            this.days = this.event.dates;
            this.documents = response.documents;
            this.defaultItem.event_id = this.$route.params.id;
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

    deleteDocument() {
      if (confirm('Are you sure about that?')) {
        this.$store
          .dispatch('document/deleteDocument', this.editedItem.id)
          .then(
            (response) => {
              const notification = {
                message: response.message,
                type: response.status,
                flag: true,
              };
              this.$store.dispatch('alert/add', notification);
              this.getAllDocuments();
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
      }
    },
    save() {
      if (!this.editedItem.id) {
        this.saveNew();
      } else {
        this.$store.dispatch('document/saveDocument', this.editedItem).then(
          (response) => {
            const notification = {
              message: response.message,
              type: response.status,
              flag: true,
            };
            this.$store.dispatch('alert/add', notification);
            this.getAllDocuments();
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
      }
    },
    saveNew() {
      const newDoc = Object.assign({}, this.editedItem);
      newDoc.day = this.$date(newDoc.day, 'YYYY-MM-DD').format('DD/MM/YYYY');
      this.$store.dispatch('document/newDocument', newDoc).then(
        (response) => {
          const notification = {
            message: response.message,
            type: response.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getAllDocuments();
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
