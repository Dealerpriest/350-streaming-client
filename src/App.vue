<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <img
          class="rise-logo"
          :src="require('./assets/rise-logo-white.svg')"
          alt="RISE Logo"
        />
        <span class="font-weight-light"> 360 Streaming</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>open_in_new</v-icon>
      </v-btn> -->
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      //
    };
  },
};
</script>

<style lang="scss" scoped>
.rise-logo {
  width: 40px;
  height: 40px;
}
</style>
