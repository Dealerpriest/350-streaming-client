<template>
  <transition name="fade" v-on:after-leave="afterLeave">
    <v-card v-if="showDialog" class="login-box">
      <v-text-field
        @input="checkPassword()"
        v-model="providedPassword"
        type="password"
        label="Lösenord"
        outline
      >
      </v-text-field>
    </v-card>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component({})
export default class LoginView extends Vue {
  @State password!: string;
  @Mutation setAuthenticated: any;

  private showDialog = true;
  private providedPassword = '';

  private checkPassword() {
    if (this.providedPassword == this.password) {
      this.showDialog = false;
      this.setAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
    }
  }

  private afterLeave() {
    // this.setAuthenticated(true);
    this.$router.push('/');
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.login-box {
  margin: auto;
  padding: 2em;
  width: 400px;
}
</style>
