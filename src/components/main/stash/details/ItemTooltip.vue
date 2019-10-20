<template>
  <div class="item-tooltip">
    <div :class="this.headerClass">
      <div :class="this.itemNameClass" v-if="this.doubleHeader">
        {{this.item.name}}
      </div>
      <div :class="this.itemTypeClass">
        {{this.item.typeLine}}
      </div>
    </div>
    <div class="item-tooltip__content">

      <div v-for="enchant in enchantMods" :key="enchant"
        class="item-tooltip__mods--enchant">
        {{ enchant }}
      </div>

      <div v-for="impMod in implicitMods" :key="impMod"
        class="item-tooltip__mods--implicit">
        {{ impMod }}
      </div>

      <div v-for="expMod in explicitMods" :key="expMod"
        class="item-tooltip__mods--explicit">
        {{ expMod }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue/types/options';
import { Item, ItemType } from '@/models/item';
import { Type } from '../../../../utils/enumPicker';

const AppProps = Vue.extend({
  props: {
    item: Object as Prop<Item>,
  }
});

const classMap:{ [key in keyof typeof ItemType]?: string } = {
  [ItemType.NORMAL]: 'normal',
  [ItemType.MAGIC]: 'magic',
  [ItemType.RARE]: 'rare',
  [ItemType.UNIQUE]: 'unique',
  [ItemType.CURRENCY]: 'currency',
}

@Component({})
export default class ItemTooltip extends AppProps {

  get typeClass() {
    return classMap[Type.of(this.item).enumValue] || 'normal';
  }

  get headerClass() {
    const double = this.doubleHeader ? '--double' : '';
    return `item-tooltip__header--${this.typeClass}${double}`;
  }

  get itemNameClass() {
    return `item-tooltip__item-name ${this.fontClass}`;
  }

  get itemTypeClass() {
    return `item-tooltip__item-type ${this.fontClass}`;
  }

  get doubleHeader() {
    return this.item.identified && Type.of(this.item).in(ItemType.UNIQUE, ItemType.RARE)
  }

  get fontClass() {
    return `item-tooltip__font--${this.typeClass}`;
  }

  get contentClass() {
    return 'item-tooltip__content';
  }

  get explicitMods() {
    return this.item.explicitMods;
  }

  get implicitMods() {
    return this.item.implicitMods;
  }

  get enchantMods() {
    return this.item.enchantMods;
  }
}
</script>

<style lang="scss" scoped>

  $unique_font_color: #af6025;
  $rare_font_color: #ff7;
  $magic_font_color: #88f;
  $currency_font_color: #aa9e82;
  $normal_font_color: #c8c8c8;

  $property_label_color: #7f7f7f;
  $property_value_color: #fff;
  $mod_color: #8888FF;
  $enchant_color: #b4b4ff;

  .item-tooltip{
    display: block;
  	font-family: "FontinSmallCaps",Verdana,Arial,Helvetica,sans-serif;
    background: rgba(0,0,0,0.8);
    color: $property_label_color;

    &__font {
      &--unique {
        color: $unique_font_color;
      }

      &--rare {
        color: $rare_font_color;
      }

      &--magic {
        color: $magic_font_color;
      }

      &--currency {
        color: $currency_font_color;
      }

      &--normal {
        color: $normal_font_color;
      }
    }

    &__item-name {
      padding-top: 5px;
      display: flex;
      justify-content: center;
    }

    &__item-type {
      padding-top: 3px;
      display: flex;
      justify-content: center;
    }

    &__header {

      &--currency {
        background:
          url('~@/assets/header-currency-left.png') top left no-repeat,
          url('~@/assets/header-currency-right.png') top right no-repeat,
          url('~@/assets/header-currency-middle.png') top center repeat-x;
      }

      &--normal {
        background:
          url('~@/assets/header-normal-left.png') top left no-repeat,
          url('~@/assets/header-normal-right.png') top right no-repeat,
          url('~@/assets/header-normal-middle.png') top center repeat-x;
      }

      &--magic {
        background:
          url('~@/assets/header-magic-left.png') top left no-repeat,
          url('~@/assets/header-magic-right.png') top right no-repeat,
          url('~@/assets/header-magic-middle.png') top center repeat-x;
      }

      &--rare {
        background:
          url('~@/assets/header-rare-left.png') top left no-repeat,
          url('~@/assets/header-rare-right.png') top right no-repeat,
          url('~@/assets/header-rare-middle.png') top center repeat-x;
      }

      &--rare--double {
        background:
          url('~@/assets/header-double-rare-left.png') top left no-repeat,
          url('~@/assets/header-double-rare-right.png') top right no-repeat,
          url('~@/assets/header-double-rare-middle.png') top center repeat-x;
      }

      &--unique {
        background:
          url('~@/assets/header-unique-left.png') top left no-repeat,
          url('~@/assets/header-unique-right.png') top right no-repeat,
          url('~@/assets/header-unique-middle.png') top center repeat-x;
      }

      &--unique--double {
        background:
          url('~@/assets/header-double-unique-left.png') top left no-repeat,
          url('~@/assets/header-double-unique-right.png') top right no-repeat,
          url('~@/assets/header-double-unique-middle.png') top center repeat-x;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__mods {
      &--implicit,
      &--explicit {
        color: $mod_color;
      }

      &--enchant {
        color: $enchant_color;
      }
    }
  }
</style>
