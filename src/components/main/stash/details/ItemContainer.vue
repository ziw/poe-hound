<template>
  <a-tooltip :svisible="this.item.id === 'b24c745c6fa7a00c5cc288aec77e8ecceb3373ae2386d8dcfafa202eed36f3d8'">
    <template slot="title">
      <item-tooltip :item="this.item" />
    </template>
    <div class="item-container"
      :style="styleObject">
      <span v-if="showStackSize">
        {{ item.stackSize }}
      </span>
    </div>
  </a-tooltip>
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
import ItemTooltip from '@/components/main/stash/details/ItemTooltip.vue';

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

@Component({
  components: {
    ItemTooltip,
  }
})
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
