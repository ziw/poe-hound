<template>
  <header class="main-header">
    <div>
      <v-select :options="[{label: 'foo', value: 'Foo'}]"></v-select>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
})
export default class MainHeader extends Vue {

}
</script>

<style lang="scss">
  .main-header {
    height: 68px;
    width: 100%;
    background-image: radial-gradient(100% 100%, #620909 0%, #230202 100%);
    display: flex;
    align-items: center;
  }
</style>
