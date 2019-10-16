<template>
  <div class="quad-stash">
    <item-container v-for="config in renderingConfigs"
        :item="config.item"
        :unitDimension="unitDimension"
        :highlighted="config.highlighted"
        :left="config.x"
        :top="config.y"
        :w="config.w"
        :h="config.h"
        :key="config.item.id" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue/types/options';
import Tab from '@/models/tab';
import ItemStore from '@/indexer/itemStore';
import { Item } from '@/models/item';
import ItemContainer from '@/components/main/stash/details/ItemContainer.vue';
import { itemInFilterResults } from '@/utils';

const AppProps = Vue.extend({
  props: {
    renderingTab: Object as Prop<Tab>,
    dimension: Number,
  }
});


@Component({
  components: {
    ItemContainer,
  }
})
export default class QuadStash extends AppProps {

  get unitDimension() {
    return this.dimension / 24;
  }

  get renderingConfigs() {
    if(!this.renderingTab){
      return [];
    }

    const items = this.renderingTab.renderedItems;
    return items.map(item => {
      const x = (this.unitDimension) * item.x;
      const y = (this.unitDimension) * item.y;

      return {
        item,
        x,
        y,
        w: item.w,
        h: item.h,
        highlighted: itemInFilterResults(item)
      };
    })
  }
}
</script>

<style lang="scss" scoped>
  .quad-stash {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>