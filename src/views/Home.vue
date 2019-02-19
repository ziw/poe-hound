<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <div>
      {{ numberOfItems }}
      {{derived}}
    </div>
    <button @click="push">add</button>

    <BasketViewer propMessage="from Home"></BasketViewer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import BasketViewer from '@/components/BasketViewer.vue';
import basket from '@/store/basket/basket';

export default Vue.extend({
  name: 'home',

  components: {
    HelloWorld,
    BasketViewer,
  },

  data() {
    return {
      someData: 1,
    }
  },

  computed: {
    numberOfItems(){
      return basket.numberOfItems
    },

    derived() {
      return basket.derivedValue
    }
  },
  methods: {
    push() {
      basket.commitAppendItem({
        productId: "913",
        quantity: 100,
      })
    }
  }
});
</script>
