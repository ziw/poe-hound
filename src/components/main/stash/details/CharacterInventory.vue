<template>
  <div class="character-inventory">
    <item-container v-for="item in items"
        :item="item"
        :unitDimension="dimension / 12"
        :key="item.id" />
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
import ItemContainer from '@/components/main/stash/details/ItemContainer.vue';

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
export default class CharacterInventory extends AppProps {

  get items() {
    if(!this.renderingTab){
      return [];
    }
    const items = this.renderingTab.itemIds.map(id => ItemStore.queryById(id));
    return items as Item[];
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

