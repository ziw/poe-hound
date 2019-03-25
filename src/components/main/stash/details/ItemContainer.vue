<template>
  <div class="item-container"
    v-if="this.item"
    :style="styleObject">
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
    left: Number,
    top: Number,
  }
});

@Component({})
export default class ItemContainer extends AppProps {

  get styleObject() {

    const w = this.item ? this.item.w : 0;
    const h = this.item ? this.item.h : 0;

    return {
      left: this.left || 0,
      top: this.top || 0,
      width: `${this.unitDimension * w}px` ,
      height: `${this.unitDimension * h}px`,
    };
  }

}
</script>

<style lang="scss" scoped>
  .item-container{
    position: absolute;
    border: 1px solid white;
  }
</style>
