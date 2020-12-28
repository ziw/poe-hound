<template>
  <div class="text-input">
    <input
      type="text"
      v-bind="$attrs"
      :value="value"
      :id="id"
      :placeholder="label"
      v-on="inputListeners"
    />
  </div>
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
    value: String,
    id: String,
    label: String,
  },
});

@Component({
  inheritAttrs: false,
})
export default class TextInput extends AppProps {
  get inputListeners(): object {
    return {
      ...this.$listeners,
      ...{
        input: this.updateValue,
      },
    };
  }

  updateValue(e: KeyboardEvent) {
    this.$emit('input', (<HTMLInputElement>e.target).value);
  }

  mounted() {}
}
</script>

<style lang="scss" scoped>
.text-input {
  border: 1px solid #ffffff;
  border-radius: 4px;
  height: 46px;
  display: flex;
  box-sizing: border-box;

  input {
    border: none;
    background: none;
    padding: 12px;
    font-family: OpenSans-Bold;
    font-size: 18px;
    color: #ffffff;
    width: 100%;
  }
}
</style>
