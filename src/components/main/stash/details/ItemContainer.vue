<template>
  <div class="item-container"
    v-if="this.item"
    :style="styleObject">
    <span v-if="showStackSize">
      {{ item.stackSize }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { session } from '@/store/modules/session';
import { Prop } from 'vue/types/options';
import Tab from '@/models/tab';
import ItemStore from '@/indexer/itemStore';
import Item from '@/models/item';

const AppProps = Vue.extend({
  props: {
    item: Object as Prop<Item>,
    unitDimension: Number,
    left: {
      type: Number,
      default: 0,
    },
    top: {
      type: Number,
      default: 0,
    },
  }
});

@Component({})
export default class ItemContainer extends AppProps {

  get styleObject() {
    const item = this.item || {};
    const width = this.unitDimension * item.w;
    const height = this.unitDimension * item.h;

    return {
      left: `${this.left}px`,
      top: `${this.top}px`,
      width: `${width}px` ,
      height: `${height}px`,
      'background-image': `url("${item.icon}")`,
      'background-repeat': 'no-repeat',
      'background-size': `${width}px ${height}px`,
      'background-color': `rgba(0,0,0,0.60)`,
    };
  }

  get showStackSize() {
    return this.item && this.item.stackSize;
  }

}
</script>

<style lang="scss" scoped>
  .item-container{
    position: absolute;
    border: 1px solid white;
  }
</style>
