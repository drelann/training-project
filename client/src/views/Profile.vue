<template>
  <v-container class="fill-height" fluid>
    <v-card class="d-inline-block mx-auto">
      <v-container class="py-0"
        ><v-row class="space-between">
          <v-col
            cols="auto"
            class="mx-auto grey darken-4 rounded mr-sm-0 mr-md-2"
            transition="fade-transition"
          >
            <v-img
              v-if="!user.userpic"
              :src="`http://127.0.0.1:3333/userpic/placeholder.png`"
              height="180"
              width="180"
            ></v-img>

            <v-img
              v-if="user.userpic"
              :key="user.userpic"
              :src="`http://127.0.0.1:3333/userpic/` + user.userpic"
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
                  small
                  :disabled="userHavePic"
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
                      Login information
                    </div>
                    <v-btn
                      icon
                      color="indigo"
                      class="ml-auto"
                      @click.stop="showPasswordDialog = true"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <PasswordDialog
                      :user="user"
                      v-model="showPasswordDialog"
                    /> </v-row
                ></v-col>

                <v-col class="px-1 py-1 text-subtitle-2"
                  >Email:
                  <span class="text-subtitle-1"> {{ user.email }} </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2"
                  >Password:
                  <span class="text-subtitle-1">
                    ********
                  </span></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="auto" class="text-left">
              <v-row class="flex-column ma-0 fill-height">
                <v-col class="px-3 py-1">
                  <v-row class="d-flex px-1"
                    ><div class="text-overline">
                      Profile information
                    </div>
                    <v-btn
                      icon
                      color="indigo"
                      class="ml-auto"
                      @click.stop="showProfileDialog = true"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    ></v-row
                  ></v-col
                >

                <v-col class="px-1 py-1 text-subtitle-2"
                  >First Name:
                  <span class="text-subtitle-1">
                    {{ user.firstname }}
                  </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2"
                  >Last Name:
                  <span class="text-subtitle-1">
                    {{ user.lastname }}
                  </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2"
                  >Country:
                  <span class="text-subtitle-1">
                    {{ user.country.name }}
                  </span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2" v-if="user.about"
                  >About:
                  <span class="text-subtitle-1">{{ user.about }}</span></v-col
                >
                <v-col class="px-1 py-1 text-subtitle-2" v-if="!user.about"
                  >About:
                  <span class="text-subtitle-1">nothing yet</span></v-col
                >
                <ProfileDialog
                  :countries="countries"
                  :user="currentUser"
                  :country_backup="user.country"
                  v-model="showProfileDialog"
                />
              </v-row>
            </v-col>

            <v-col cols="auto" class="text-left">
              <v-row class="flex-column ma-0 fill-height">
                <v-col class="px-3 py-1">
                  <v-row class="d-flex px-1"
                    ><div class="text-overline">
                      Personal Identification Number
                    </div>
                    <v-btn
                      icon
                      color="indigo"
                      class="ml-auto"
                      @click.stop="showPinDialog = true"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    ></v-row
                  ></v-col
                >
                <v-row class="pa-3"
                  ><v-col class="px-1 py-1 text-subtitle-2 mr-auto" cols="auto"
                    >PIN:
                    <span class="text-subtitle-1" v-if="user.PIN">
                      {{ user.PIN }}
                    </span>
                    <span class="text-subtitle-1" v-if="!user.PIN">
                      ****
                    </span></v-col
                  >
                  <v-col
                    v-if="user.PIN"
                    class="ml-auto py-1 justify-center"
                    cols="auto"
                    ><v-btn text small color="warning" @click="deletePin"
                      >DELETE PIN</v-btn
                    ></v-col
                  >
                  <v-col
                    v-if="!user.PIN"
                    class="ml-auto py-1 justify-center"
                    cols="auto"
                    ><v-btn
                      text
                      small
                      color="warning"
                      @click.stop="showPinDialog = true"
                      >Set PIN</v-btn
                    ></v-col
                  >
                  <PinDialog :user="user" v-model="showPinDialog"
                /></v-row>
              </v-row>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Notification from '../components/Notification';
import PasswordDialog from '../components/PasswordDialog';
import ProfileDialog from '../components/ProfileDialog';
import PinDialog from '../components/PinDialog';
import User from '../models/user';
export default {
  name: 'Profile',
  components: { Notification, PasswordDialog, ProfileDialog, PinDialog },
  data() {
    return {
      countries: null,
      alert: true,
      showPasswordDialog: false,
      showProfileDialog: false,
      showPinDialog: false,
      userHavePic: true,
      newImage: '',
      user: new User('', '', '', {}, '', '', '', '', '', ''),
      notification: {
        message: '',
        type: '',
      },
    };
  },
  watch: {
    showProfileDialog: function(val) {
      this.fetchAuthenticatedUser();
    },
    showPasswordDialog: function(val) {
      this.fetchAuthenticatedUser();
    },
    showPinDialog: function(val) {
      this.fetchAuthenticatedUser();
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.userData;
    },
    userPIN() {
      return this.$store.state.auth.userData.PIN;
    },
    passwordLength() {
      const length = this.$store.state.auth.userData.password.length;
      return length;
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getAllCountries();
    },
    onPickFile() {
      this.$refs.imageInput.click();
    },
    uploadImage() {
      this.$store.dispatch('auth/uploadImage', this.newImage).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.fetchAuthenticatedUser();
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
    async getAllCountries() {
      this.$store.dispatch('misc/getAllRecords').then(
        (response) => {
          this.countries = response.countries;
          this.fetchAuthenticatedUser();
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
    async fetchAuthenticatedUser() {
      this.$store.dispatch('auth/getUserData').then(
        (response) => {
          this.user = response;
          this.userHavePic = this.user.userpic == 'placeholder.png';
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
      this.$store.dispatch('auth/deleteImage').then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.fetchAuthenticatedUser();
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
    deletePin() {
      this.$store.dispatch('auth/deletePin', this.newImage).then(
        (response) => {
          const notification = {
            message: response.data.message,
            type: response.data.status,
            flag: true,
          };
          this.$store.dispatch('alert/add', notification);
          this.fetchAuthenticatedUser();
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
