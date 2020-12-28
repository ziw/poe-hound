<template>
  <div class="currency-stash">
    <item-container
      v-for="config in renderingConfigs"
      :item="config.item"
      :unitDimension="unitDimension"
      :highlighted="config.highlighted"
      :left="config.x"
      :top="config.y"
      :w="config.w"
      :h="config.h"
      :key="config.item.id"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue/types/options';
import Tab from '@/models/tab';
import { Item, ItemType } from '@/models/item';
import { itemInFilterResults } from '@/utils';
import ItemContainer from '@/components/main/stash/details/ItemContainer.vue';
import { Type } from '../../../../utils/enumPicker';

const AppProps = Vue.extend({
  props: {
    renderingTab: Object as Prop<Tab>,
    dimension: Number,
  },
});

@Component({
  components: {
    ItemContainer,
  },
})
export default class CurrencyStash extends AppProps {
  get unitDimension() {
    return this.dimension / 12;
  }

  get renderingConfigs() {
    if (!this.renderingTab) {
      return [];
    }

    const items = this.renderingTab.renderedItems;

    return items.map((item, index) => {
      let x: number, y: number;
      if (Type.of(item).isNot(ItemType.CURRENCY)) {
        //this is the item in crafting slot of currency tab
        x = this.unitDimension * 10;
        y = this.unitDimension * 8;
      } else {
        x = this.unitDimension * (index % 12);
        y = this.unitDimension * Math.trunc(index / 12);
      }

      return {
        item,
        x,
        y,
        w: item.w,
        h: item.h,
        highlighted: itemInFilterResults(item),
      };
    });
  }
}
</script>

<style lang="scss" scoped>
.currency-stash {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
