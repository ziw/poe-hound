<template>
  <div class="item-container"
    :title="title"
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
import { Item } from '@/models/item';
import { convertItemToTitle } from '@/utils/itemUtil';

const AppProps = Vue.extend({
  props: {
    item: Object as Prop<Item>,
    unitDimension: Number,
    highlighted: Boolean,
    left: {
      type: Number,
      default: 0,
    },
    top: {
      type: Number,
      default: 0,
    },
    w: {
      type: Number,
      default: 0,
    },
    h: {
      type: Number,
      default: 0,
    }
  }
});

@Component({})
export default class ItemContainer extends AppProps {

  get styleObject() {
    const item = this.item || {};
    const width = this.unitDimension * this.w;
    const height = this.unitDimension * this.h;

    return {
      left: `${this.left}px`,
      top: `${this.top}px`,
      width: `${width}px`,
      height: `${height}px`,
      'background-image': `url("${item ? item.icon : ''}")`,
      'background-repeat': 'no-repeat',
      'background-size': `${width}px ${height}px`,
      'background-color': this.highlighted ? `rgba(255, 255,255,0.5)`: `rgba(0,0,0,0.60)`,
      'border': this.highlighted ? '1px solid yellow' : '',
    };
  }

  get title() {
    return this.item ? `${ convertItemToTitle(this.item)} ` : '';
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
