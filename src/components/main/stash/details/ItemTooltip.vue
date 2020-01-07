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
      <div v-if="this.item.level">
        <span>{{levelLabel}}:</span>
        <span class="item-tooltip__mods--explicit">{{this.item.level}}</span>
      </div>
      <div v-if="this.item.quality">
        <span>{{qualityLabel}}:</span>
        <span class="item-tooltip__mods--explicit">{{this.item.quality}} %</span>
      </div>
      <div v-for="enchant in enchantMods" :key="enchant"
        class="item-tooltip__mods--enchant">
        {{ enchant }}
      </div>

      <div v-for="impMod in implicitMods" :key="impMod"
        class="item-tooltip__mods--implicit">
        {{ impMod }}
      </div>
      <div :class="seperatorClass"
            v-if="hasExplicitBlock && (hasImplicitBlock)"></div>
      <div v-for="expMod in explicitMods" :key="expMod"
        class="item-tooltip__mods--explicit">
        {{ expMod }}
      </div>
      <div v-for="craftedMod in craftedMods" :key="craftedMod"
        class="item-tooltip__mods--enchant">
        {{ craftedMod }}
      </div>
      <div v-if="!this.item.identified"
        class="item-tooltip__font--corrupted">
        {{ unidedLabel }}
      </div>
      <div v-if="this.item.corrupted"
        class="item-tooltip__font--corrupted">
        {{ corruptedLabel }}
      </div>
    </div>
    <div>
      <div v-for="gem in gems" :key="gem.gemName"
        class="item-tooltip__font--gem">
        {{`${gem.gemName}  [${gem.level}/${gem.quality ? gem.quality : 0}%]`}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import message from '@/i18n';
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
  [ItemType.RELIC]: 'relic',
}

@Component({})
export default class ItemTooltip extends AppProps {

  private corruptedLabel = message.mods.corrupted;
  private unidedLabel = message.mods.unided;
  private qualityLabel = message.mods.quality;
  private levelLabel = message.mods.level;

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

  get seperatorClass() {
    return `item-tooltip__seperator item-tooltip__seperator--${this.typeClass}`;
  }

  get contentClass() {
    return 'item-tooltip__content';
  }

  get explicitMods() {
    return this.item.explicitMods;
  }

  get craftedMods() {
    return this.item.craftedMods;
  }

  get implicitMods() {
    return this.item.implicitMods;
  }

  get gems() {
    return this.item.socketedItems.filter(socketed => socketed.frameType === ItemType.GEM);
  }

  get enchantMods() {
    return this.item.enchantMods;
  }

  get fracturedMods() {
    return this.item.fracturedMods;
  }

  private get hasExplicitBlock() {
    return this.explicitMods.length
              || this.item.corrupted
              || !this.item.identified;
  }

  private get hasImplicitBlock() {
    return this.implicitMods.length
              || this.fracturedMods.length
              || this.enchantMods.length;
  }
}
</script>

<style lang="scss" scoped>

  $unique_font_color: #af6025;
  $rare_font_color: #ff7;
  $magic_font_color: #88f;
  $currency_font_color: #aa9e82;
  $normal_font_color: #c8c8c8;
  $gem_font_color: #1ba29b;

  $property_label_color: #7f7f7f;
  $property_value_color: #fff;
  $mod_color: #8888FF;
  $enchant_color: #b4b4ff;
  $corrupted_color: #d20000;
  $unid_color: #d20000;
  $crafted_mod_color: $enchant_color;

  .item-tooltip{
    display: block;
  	font-family: "FontinSmallCaps",Verdana,Arial,Helvetica,sans-serif;
    background: rgba(0,0,0,0.8);
    color: $property_label_color;
    text-align: center;
    min-width: 200px;

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

      &--normal {
        color: $normal_font_color;
      }

      &--currency {
        color: $currency_font_color;
      }

      &--gem {
        color: $gem_font_color;
      }

      &--corrupted {
        color: $corrupted_color;
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

      &--gem {
        background:
          url('~@/assets/header-gem-left.png') top left no-repeat,
          url('~@/assets/header-gem-right.png') top right no-repeat,
          url('~@/assets/header-gem-middle.png') top center repeat-x;
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

    &__seperator {
      background-color:rgba(0, 0, 0, 0);
      background-position-x: center;
      background-position-y: center;
      background-repeat: no-repeat;
      background-attachment: scroll;
      background-size: auto;
      background-origin: padding-box;
      background-clip: border-box;
      height: 8px;
      margin: 1px 0px;
      width: 100%;

      &--gem {
        background-image: url('~@/assets/seperator-gem.png');
      }

      &--currency {
        background-image: url('~@/assets/seperator-currency.png');
      }

      &--normal {
        background-image: url('~@/assets/seperator-normal.png');
      }

      &--magic {
        background-image: url('~@/assets/seperator-magic.png');
      }

      &--rare {
        background-image: url('~@/assets/seperator-rare.png');
      }

      &--unique {
        background-image: url('~@/assets/seperator-unique.png');
      }

      &--relic {
        background-image: url('~@/assets/seperator-relic.png');
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 6px;
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
