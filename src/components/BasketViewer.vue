<template>
  <div>
    <input v-model="msg">
    <p>prop: {{ propMessage }}</p>
    <p>msg: {{ msg }}</p>
    <p>helloMsg: {{ helloMsg }}</p>
    <p>computed msg: {{ computedMsg }}</p>

    <p>
      <button @click="greet">Greet</button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import HelloWorld from './HelloWorld.vue'
//import { mapState, mapMutations } from 'vuex'

// We declare the props separately
// to make props types inferable.
const AppProps = Vue.extend({
  props: {
    propMessage: String
  }
})

@Component({
  components: {
    HelloWorld
  },

  // Vuex's component binding helper can use here
  // computed: mapState([
  //   'count'
  // ]),
  // methods: mapMutations([
  //   'increment'
  // ])
})
export default class App extends AppProps {
  // inital data
  msg: number = 123

  // use prop values for initial data
  helloMsg: string = 'Hello, ' + this.propMessage

  // annotate refs type
  $refs!: {
    //helloComponent: Hello
  }

  // additional declaration is needed
  // when you declare some properties in `Component` decorator
  count!: number
  increment!: () => void

  // lifecycle hook
  mounted () {
    //this.greet()
  }

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet () {
    alert('greeting: ' + this.computedMsg)
    //this.$refs.helloComponent.sayHello()
  }

  // direct dispatch example
  incrementIfOdd () {
    //this.$store.dispatch('incrementIfOdd')
  }
}
</script>
