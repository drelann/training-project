<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" v-if="notification.message">
      <v-col cols="3"></v-col>
      <v-col cols="6" sm="6" md="6">
        <Notification
          :message="notification.message"
          :type="notification.type"
        ></Notification>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
    <v-card class="d-inline-block mx-auto">
      <v-container class="py-0"
        ><v-row class="space-between">
          <v-col
            cols="auto"
            class="mx-auto grey darken-4 rounded mr-sm-0 mr-md-2"
            transition="fade-transition"
          >
            <v-img
              v-if="!event.eventpic"
              :src="`http://127.0.0.1:3333/events/placeholder.png`"
              height="180"
              width="180"
            ></v-img>

            <v-img
              v-if="event.eventpic"
              :key="event.eventpic"
              :src="`http://127.0.0.1:3333/events/` + event.eventpic"
              height="180"
              width="180"
            ></v-img>

            <v-row class="space-between mt-3">
              <v-col class="mr-auto py-1"
                ><v-btn text small color="primary" @click="onPickFile"
                  >upload</v-btn
                >
                <input
                  type="file"
                  @change="createBase64Image"
                  ref="imageInput"
                  accept="image/png, image/jpeg, image/bmp"
                  style="display:none"
              /></v-col>

              <v-col class="ml-auto py-1 justify-center"
                ><v-btn
                  text
                  :disabled="eventHavePic"
                  small
                  color="error"
                  @click="deleteImage"
                  >Delete</v-btn
                ></v-col
              >
            </v-row></v-col
          >
          <v-row class="flex-column fill-height">
            <v-col cols="auto" class="text-left">
              <v-row class="flex-column ma-0 fill-height">
                <v-col class="px-3 py-1">
                  <v-row class="d-flex px-1"
                    ><div class="text-overline">
                      Event information
                    </div>
                    <v-btn
                      icon
                      color="indigo"
                      class="ml-auto"
                      @click.stop="showTitleDialog = true"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                  </v-row></v-col
                >
                <TitleDialog :event="event" v-model="showTitleDialog" />
                <v-col class="px-1 py-1 text-subtitle-2"
                  >Title:
                  <span class="text-subtitle-1">
                    {{ event.title }}
                  </span></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="auto" class="text-left">
              <v-row class="flex-column ma-0 fill-height">
                <v-col class="px-3 py-1">
                  <v-row class="d-flex px-1"
                    ><div class="text-overline">
                      Dates information
                    </div>
                    <v-btn
                      icon
                      color="indigo"
                      class="ml-auto"
                      @click.stop="showDateDialog = true"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    ></v-row
                  ></v-col
                >
                <template v-if="everthingIsReady">
                  <DateDialogMultiple :event="event" v-model="showDateDialog" />
                </template>
                <v-col class="px-1 py-1 text-subtitle-2"
                  >Start Date:
                  <span class="text-subtitle-1">
                    {{ event.start_date }}
                  </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2"
                  >C1 Date:
                  <span class="text-subtitle-1">
                    {{ event.c1_date }}
                  </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2"
                  >C+1 Date:
                  <span class="text-subtitle-1">
                    {{ event.c_plus_1_date }}
                  </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2"
                  >Finish Date:
                  <span class="text-subtitle-1">
                    {{ event.finish_date }}
                  </span></v-col
                >
              </v-row>
            </v-col>

            <v-col cols="auto" class="text-left">
              <v-row class="flex-column ma-0 fill-height">
                <v-col class="px-3 py-1">
                  <v-row class="d-flex px-1"
                    ><div class="text-overline">
                      Participants
                    </div>
                    <v-btn
                      @click.stop="showAssignDialog = true"
                      icon
                      color="indigo"
                      class="ml-auto"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    ></v-row
                  ></v-col
                >
                <v-row class="pa-3"
                  ><v-col class="px-1 py-1 text-subtitle-2 mr-auto" cols="auto"
                    >Participants:
                    <span class="text-subtitle-1">
                      {{ event.participants }}
                    </span></v-col
                  >

                  <v-col class="ml-auto py-1 justify-center" cols="auto"
                    ><v-btn
                      @click.stop="showAssignDialog = true"
                      text
                      small
                      color="warning"
                      >Assign Users</v-btn
                    ></v-col
                  ></v-row
                >
              </v-row>
              <AssignDialog :event="event" v-model="showAssignDialog" />
            </v-col>
            <v-col cols="auto" class="text-left">
              <v-btn @click="goToDocuments(event.id)" text small color="warning"
                >Documents</v-btn
              >
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import TitleDialog from '../components/TitleDialog';
import DateDialog from '../components/DateDialog';
import AssignDialog from '../components/AssignDialog';
import DateDialogMultiple from '../components/DateDialogMultiple';
import dayjs from '../plugins/dayjs';

export default {
  name: 'Event',
  components: {
    TitleDialog,
    DateDialog,
    DateDialogMultiple,
    AssignDialog,
  },
  data() {
    return {
      alert: true,
      everthingIsReady: false,
      showTitleDialog: false,
      showDateDialog: false,
      showAssignDialog: false,
      event: {},
      eventHavePic: true,
      newImage: '',
      notification: {
        message: '',
        type: '',
      },
    };
  },
  watch: {
    showTitleDialog: function(val) {
      this.getEvent();
    },
    showDateDialog: function(val) {
      this.getEvent();
    },
    showAssignDialog: function(val) {
      this.getEvent();
    },
  },
  created() {
    this.initialize();
    setTimeout(() => {
      this.notification.alert = false;
    }, 2000);
  },
  methods: {
    initialize() {
      this.getEvent();
    },
    onPickFile() {
      this.$refs.imageInput.click();
    },
    createBase64Image(event) {
      if (event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newImage = e.target.result;
          this.uploadImage();
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },
    goToDocuments(id) {
      this.$router.push({ name: `Documents`, params: { id: id } });
    },
    async getEvent() {
      this.$store.dispatch('event/getEvent', this.$route.params.id).then(
        (response) => {
          this.event = response.event;
          this.eventHavePic = this.event.eventpic == 'placeholder.png';
          this.everthingIsReady = true;
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
    deleteImage() {
      const id = this.event.id;
      this.$store.dispatch('event/deleteImage', id).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getEvent();
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
    uploadImage() {
      const event = { id: this.event.id, eventpic: this.newImage };
      this.$store.dispatch('event/uploadImage', event).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.getEvent();
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
