<template>
  <div class="tab-detail"
    :style="styleObject">
    <keep-alive>
        <component
          :is="selectedStashRenderer"
          :dimension="dimension"
          :renderingTab="renderingTab">
        </component>
    </keep-alive>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Tab from '@/models/tab';
import { session } from '@/store/modules/session';
import { Status } from '@/constants';
import { StashType } from '@/models/stashPage';
import { CharacterType } from '@/models/character';
import CurrencyStash from '@/components/main/stash/details/CurrencyStash.vue';
import NormalStash from '@/components/main/stash/details/NormalStash.vue';
import QuadStash from '@/components/main/stash/details/QuadStash.vue';
import CharacterInventory from '@/components/main/stash/details/CharacterInventory.vue';

@Component({
  components: {
    CurrencyStash,
    NormalStash,
    QuadStash,
    CharacterInventory,
  }
})
export default class TabDetail extends Vue {

  static stashRenderer: { [key in (StashType | CharacterType)]?: string } = {
    [StashType.NormalStash]: 'NormalStash',
    [StashType.QuadStash]: 'QuadStash',
    [CharacterType.Character]: 'CharacterInventory',
    [StashType.PremiumStash]: 'NormalStash',
    [StashType.CurrencyStash]: 'CurrencyStash',
  };

  dimension: number = 660;

  get renderingTab() {
    return session.getters.getSelectedStashTab();
  }

  get selectedStashRenderer() {
    const tab = this.renderingTab;
    if(tab){
      return TabDetail.stashRenderer[tab.type];
    }
  }

  get styleObject() {
    const tab = this.renderingTab;
    const borderColor = tab ? `rgb(${tab.color.r}, ${tab.color.g}, ${tab.color.b})` : `white`;
    return {
      border: `1px solid ${borderColor}`,
      height: `${this.dimension}px`,
      width: `${this.dimension}px`,
    };
  }
}
</script>

<style lang="scss">
  .tab-detail {
    margin-top: 15px;
    position: relative;

  }
</style>
