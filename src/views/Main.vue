<template>
  <main class="main-page">
    <button @click="logout" class="main-page__logout-button">
      Log out
    </button>
    <main-header></main-header>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import MainHeader from '@/components/main/MainHeader.vue';

@Component({
  components: {
    MainHeader,
  }
})
export default class Main extends Vue{

  logout() {
    this.$router.push('/');
  }
}
</script>

<style lang="scss" scoped>
  .main-page {
    width: 100%;
    height: 100%;
    display: flex;

    &__logout-button {
      position: absolute;
    }
  }
</style>

