<template>
  <button
    class="primary-button"
    :class="{
      [`primary-button__${this.size}`]: true,
      [`primary-button__${this.styleType}`]: true,
    }"
    :style="{
      width: this.stretch ? '100%' : '',
    }"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

const AppProps = Vue.extend({
  props: {
    size: {
      type: String,
      default: 'sm',
    },

    styleType: {
      type: String,
      default: 'square',
    },

    stretch: Boolean,
  },
});

@Component({})
export default class PrimaryButton extends AppProps {}
</script>

<style lang="scss">
.primary-button {
  background: none;
  border: none;
  cursor: pointer;

  &__square {
    background: #ffffff;
    border-radius: 4px;
    font-family: OpenSans-Bold;
    font-size: 14px;
    color: #8b0d0d;
    letter-spacing: 0;
    text-align: center;
    padding: 8px 12px;
    height: 46px;

    &:hover {
      color: #ffffff;
      background: #8b0d0d;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: #ffffff;
      color: #8b0d0d;
      transition: 0.2s ease-in-out;
    }
  }
}
</style>
