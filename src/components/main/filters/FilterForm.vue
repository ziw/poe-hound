<template>
  <form class="filter-form"
    v-on:submit.prevent="filterItems"
    v-on:reset.prevent="clearFilters">
    <filter-section :sectionTitle="labels.sections.itemNameType"
      class="filter-form__block--stretch">
      <text-filter
        class="filter-form__block--stretch"
        :filterType="indexFilterTypes.name"
        :label="labels.itemName"/>
      <text-filter
        class="filter-form__block--stretch"
        :filterType="indexFilterTypes.typeLine"
        :label="labels.itemTypeLine"/>
      <text-filter
        class="filter-form__block"
        :filterType="functionalFilterTypes.category"
        :filterOptions="itemCategoryOptions"
        :label="labels.itemCategory"/>
      <text-filter
        class="filter-form__block"
        :filterType="functionalFilterTypes.rarity"
        :filterOptions="itemRarityOptions"
        :label="labels.itemRarity"/>
    </filter-section>

    <filter-section :sectionTitle="labels.sections.mods"
      class="filter-form__block--stretch">
      <indexer-filter-group
        class="filter-form__block--stretch"
        :filterType="indexFilterTypes.explicitMods"
        :maxFilterCount="maxExplicitModsFilter"
        :label="labels.explicitMods"/>
      <text-filter
        class="filter-form__block--stretch"
        :filterType="indexFilterTypes.implicitMods"
        :label="labels.implicitMods"/>
      <text-filter
        class="filter-form__block--stretch"
        :filterType="indexFilterTypes.enchantedMods"
        :label="labels.enchantedMods"/>
      <text-filter
        class="filter-form__block--stretch"
        :filterType="indexFilterTypes.craftedMods"
        :label="labels.craftedMods"/>
    </filter-section>

    <filter-section :sectionTitle="labels.sections.influence"
      class="filter-form__block--stretch">
      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.shaped"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.shaped"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.elder"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.elder"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.hunter"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.hunter"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.redeemer"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.redeemer"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.warlord"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.warlord"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.crusader"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.crusader"/>
    </filter-section>

    <filter-section :sectionTitle="labels.sections.properties"
      class="filter-form__block--stretch">
      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.corrupted"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.corrupted"/>

      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minQuality"
        :maxFilterType="functionalFilterTypes.maxQuality"
        :label="labels.quality"/>

      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minLevel"
        :maxFilterType="functionalFilterTypes.maxLevel"
        :label="labels.level"/>
      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minArmor"
        :maxFilterType="functionalFilterTypes.maxArmor"
        :label="labels.armor"/>
      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minEvasion"
        :maxFilterType="functionalFilterTypes.maxEvasion"
        :label="labels.evasion"/>
      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minEnergyShield"
        :maxFilterType="functionalFilterTypes.maxEnergyShield"
        :label="labels.energyShield"/>
    </filter-section>

    <filter-section :sectionTitle="labels.sections.sockets"
      class="filter-form__block--stretch">
      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minSockets"
        :maxFilterType="functionalFilterTypes.maxSockets"
        :label="labels.numSockets"/>

      <range-filter
        class="filter-form__block--3"
        :minFilterType="functionalFilterTypes.minLinks"
        :maxFilterType="functionalFilterTypes.maxLinks"
        :label="labels.numLinks"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.hasAbyssalSocket"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.abyssalSocket"/>

      <text-filter
        class="filter-form__block--3"
        :filterType="functionalFilterTypes.hasWhiteSocket"
        :filterOptions="booleanWithAnyOptions"
        :label="labels.whiteSocket"/>
    </filter-section>

    <div class="filter-form__submit-btn filter-form__block">
      <primary-button type="reset" stretch style-type="square">
        {{ labels.reset }}
      </primary-button>
    </div>
    <div class="filter-form__submit-btn filter-form__block">
      <primary-button type="submit" stretch style-type="square">
        {{ labels.search }}
      </primary-button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { session } from '@/store/modules/session';
import { filters } from '@/store/modules/filters';
import messages from '@/i18n';
import { IndexerFilterType, FunctionalFilterType } from '@/models/filterTypes';
import TextFilter from '@/components/main/filters/TextFilter.vue';
import PrimaryButton from '@/components/shared/PrimaryButton.vue';
import RangeFilter from '@/components/main/filters/RangeFilter.vue';
import FilterSection from '@/components/main/filters/FilterSection.vue';
import IndexerFilterGroup from '@/components/main/filters/IndexerFilterGroup.vue';
import { FilterBooleanOptions } from '@/constants';
import ItemBase from '@/itemBase.json';
import { rarityCheck } from '@/utils';

@Component({
  components: {
    TextFilter,
    RangeFilter,
    PrimaryButton,
    FilterSection,
    IndexerFilterGroup,
  }
})
export default class FilterForm extends Vue {

  labels = messages.filters;
  indexFilterTypes = IndexerFilterType;
  functionalFilterTypes = FunctionalFilterType;
  booleanWithAnyOptions = [
    FilterBooleanOptions.ANY,
    FilterBooleanOptions.YES,
    FilterBooleanOptions.NO,
  ];
  maxExplicitModsFilter = 5;
  itemCategoryOptions = [
    ...Object.keys(ItemBase.category),
    ...Object.keys(ItemBase.groupedCategory),
  ].sort();
  itemRarityOptions = Object.keys(rarityCheck);

  filterItems() {
    filters.actions.filterItems();
  }

  clearFilters() {
    filters.actions.clearFilters();
  }
}
</script>

<style lang="scss" scoped>
  .filter-form {
    display: flex;
    flex-wrap: wrap;

    &__submit-btn {
      margin-top: 15px;
      padding: 0 20px;
    }

    &__block {
      width: 50%;

      &--3 {
        width: 32%;
      }

      &--4 {
        width: 25%;
      }

      &--stretch {
        width: 100%;
      }
    }
  }
</style>
