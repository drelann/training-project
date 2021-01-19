<template>
  <div>
    <v-alert :value="alert" :type="type" dismissible>
      {{ message }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {};
  },
  watch: {
    alert: {
      handler() {
        window.setTimeout(() => {
          this.alert = false;
          console.log('hide alert after 3 seconds');
        }, 5000);
      },
    },
  },
  props: {
    alert: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
};
</script>
