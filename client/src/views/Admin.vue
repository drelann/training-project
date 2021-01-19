<template>
  <v-container class="full-height" fluid>
    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6">
        <div class="text-h4">Admin</div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="col-sm-12 col-md-8 col-lg-8 col-xl-6">
        <v-card elevation="1">
          <v-data-table :headers="headers" :items="users">
            <template v-slot:item.role="props">
              <v-btn
                v-if="props.item.role != 'no_role'"
                text
                small
                color="warning"
                @click="deleteRole(props.item)"
              >
                Remove ({{ props.item.role }})</v-btn
              >
              <v-btn
                v-else-if="props.item.role == `no_role`"
                text
                small
                color="success"
                @click="assignRole(props.item)"
                >Assign</v-btn
              >
            </template>
            <template v-slot:item.assign="props">
              <v-btn
                v-if="props.item.event_title"
                text
                small
                color="warning"
                @click="deleteEvent(props.item)"
                >Remove</v-btn
              >
              <v-btn
                v-else
                text
                small
                color="success"
                @click="assignEvent(props.item)"
                >Assign</v-btn
              >
            </template>
          </v-data-table>
          <v-dialog v-model="dialog" max-width="400px">
            <ValidationObserver
              ref="form"
              tag="form"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <v-form @submit.prevent="editEvent">
                <v-card>
                  <v-card-title>
                    <span class="headline">Assign event</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            rules="required"
                            name="Event"
                          >
                            <v-autocomplete
                              :items="events"
                              v-model="editedItem.event_id"
                              name="event"
                              item-text="title"
                              item-value="id"
                              label="Event"
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
                      color="blue darken-1"
                      text
                      :disabled="invalid || !validated"
                      @click="handleSubmit(editEvent)"
                      >Сохранить</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
            </ValidationObserver>
          </v-dialog>
          <v-dialog v-model="role_dialog" max-width="400px">
            <ValidationObserver
              ref="form"
              tag="form"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <v-form @submit.prevent="saveRole">
                <v-card>
                  <v-card-title>
                    <span class="headline">Assign role</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <ValidationProvider
                            v-slot="{ errors, valid }"
                            rules="required"
                            name="Role"
                          >
                            <v-autocomplete
                              :items="roles"
                              v-model="editedItem.role"
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
                      color="blue darken-1"
                      text
                      :disabled="invalid || !validated"
                      @click="handleSubmit(editRole)"
                      >Сохранить</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
            </ValidationObserver>
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
import EventDialog from '../components/EventDialog';

extend('required', {
  ...required,
  message: 'Поле {_field_} не может быть пустым',
});
export default {
  name: 'Admin',
  components: {
    ValidationProvider,
    ValidationObserver,
    EventDialog,
  },
  data: () => ({
    dialog: false,
    role_dialog: false,
    headers: [
      { text: 'Name', value: 'fullname', sortable: false },
      { text: 'Event', value: 'event_title', sortable: false },
      { text: 'Role', value: 'role', sortable: false, align: 'center' },
      { text: 'Assign Event', value: 'assign', sortable: false },
    ],
    users: [],
    events: [],
    roles: ['expert', 'competitor'],
    editedIndex: -1,
    editedItem: {
      date_of_reg: '',
      event_id: null,
      event_title: null,
      firstname: '',
      fullname: '',
      id: 0,
      lastname: '',
      role: 'no_role',
    },
    defaultItem: {
      date_of_reg: '',
      event_id: null,
      event_title: null,
      firstname: '',
      fullname: '',
      id: 0,
      lastname: '',
      role: 'no_role',
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
      this.getAllUsers();
    },
    assignEvent(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteEvent(item) {
      this.editedItem = Object.assign({}, item);
      this.editedItem.event_id = null;
      this.editEvent();
    },
    assignRole(item) {
      this.editedItem = Object.assign({}, item);
      this.role_dialog = true;
    },
    deleteRole(item) {
      this.editedItem = Object.assign({}, item);
      this.editedItem.role = 'no_role';
      this.editRole();
    },
    close() {
      this.dialog = false;
      this.role_dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    getAllUsers() {
      this.$store.dispatch('admin/getAllUsers').then(
        (response) => {
          this.users = response.users;
          this.getAllEvents();
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
    editEvent() {
      this.$store.dispatch('admin/editEvent', this.editedItem).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getAllUsers();
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
    editRole() {
      this.$store.dispatch('admin/editRole', this.editedItem).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getAllUsers();
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
