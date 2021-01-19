<template>
  <v-dialog persistent v-model="show" max-width="450px">
    <v-card>
      <v-col cols="auto" class="text-left">
        <v-row class="flex-column ma-0 fill-height">
          <v-col class="px-1">
            <div class="text-overline px-1">
              Assign users to event
            </div>
          </v-col>

          <v-col class="px-1 py-1 text-subtitle-2">
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-card elevation="1">
                  <v-card-title>
                    Users
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    :headers="headers"
                    :items="users"
                    :search="search"
                  >
                    <template v-slot:item.assign="props">
                      <v-btn
                        v-if="props.item.event_id"
                        text
                        small
                        color="warning"
                        @click="deleteEvent(props.item.id)"
                        >Remove</v-btn
                      >
                      <v-btn
                        v-else
                        text
                        small
                        color="success"
                        @click="assignEvent(props.item.id)"
                        >Assign</v-btn
                      >
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
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
          </v-row>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import Notification from '../components/Notification';

export default {
  name: 'AssignDialog',
  components: {},
  props: {
    value: Boolean,
    event: Object,
  },
  data: () => ({
    search: '',
    users: {},
    headers: [
      { text: 'Name', value: 'fullname', sortable: false },
      { text: 'Assign Event', value: 'assign', sortable: false },
    ],
  }),
  created() {
    this.initialize();
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
      this.getAllFreeUsers();
    },
    getAllFreeUsers() {
      this.$store.dispatch('admin/getAllFreeUsers').then(
        (response) => {
          this.users = response.users;
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
    assignEvent(id) {
      const user = { id: id, event_id: this.event.id };
      this.$store.dispatch('admin/editEvent', user).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getAllFreeUsers();
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
    closeDialog() {
      this.show = false;
      this.getAllFreeUsers();
    },
  },
};
</script>
