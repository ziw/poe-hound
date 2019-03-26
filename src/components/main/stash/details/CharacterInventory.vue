<template>
  <div class="character-inventory">
    <item-container v-for="config in renderingConfigs"
        :item="config.item"
        :unitDimension="unitDimension"
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
import { session } from '@/store/modules/session';
import { Prop } from 'vue/types/options';
import Tab from '@/models/tab';
import ItemStore from '@/indexer/itemStore';
import Item,{ InventoryId } from '@/models/item';
import ItemContainer from '@/components/main/stash/details/ItemContainer.vue';
import { BASE_DIMENSION } from '@/constants';

const AppProps = Vue.extend({
  props: {
    renderingTab: Object as Prop<Tab>,
    dimension: Number,
  }
});

const layoutMapping: { [key in InventoryId]?: { x: number, y: number }} = {
  BodyArmour: { x: 259, y: 101 },
  Gloves: { x: 167, y: 189 },
  Boots: { x: 351, y: 189 },
  Helm: { x: 258, y: 13 },
  Ring: { x: 208, y: 142 },
  Ring2: { x: 351, y: 142 },
  Weapon: { x: 104, y: 17},
  Offhand: { x:413, y: 17 },
  Weapon2: { x: 15, y: 17 },
  Offhand2: { x: 500, y: 17 },
  Belt: { x: 259, y: 231 },
  Amulet: { x: 351, y: 97 },
  Flask: { x: 195, y: 281 },
  MainInventory: { x: 55, y: 377 },
};

const getPosition = (item: Item, dimension: number) => {
  const position = layoutMapping[item.inventoryId] || { x: 0, y: 500 };
  return {
    x: position.x * (dimension / BASE_DIMENSION),
    y: position.y * (dimension / BASE_DIMENSION),
  }
}

@Component({
  components: {
    ItemContainer,
  }
})
export default class CharacterInventory extends AppProps {

  get unitDimension() {
    return this.dimension / 14;
  }

  get renderingConfigs() {
    if(!this.renderingTab){
      return [];
    }

    const items = this.renderingTab.itemIds.map(id => ItemStore.queryById(id)) as Item[];
    return items.map(item => {
      let { x, y } = getPosition(item, this.dimension);
      if(item.inventoryId === InventoryId.Flask
          || item.inventoryId === InventoryId.MainInventory) {
        x += (this.unitDimension) * item.x;
        y += (this.unitDimension) * item.y;
      }
      return {
        item,
        x,
        y,
        w: item.w,
        h: item.h,
      };
    });
  }
}
</script>

<style lang="scss" scoped>
  .character-inventory {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>

