<template>
  <form v-on:submit.prevent="filterItems" class="filter-form">
    <div class="filter-form__block--stretch">
      <button type="button"
        @click="clearFilters">
        {{ labels.clear }}
      </button>
    </div>
    <text-filter
      class="filter-form__block--stretch"
      :filterType="indexFilterTypes.name"
      :label="labels.itemName"/>

    <text-filter
      class="filter-form__block--stretch"
      :filterType="indexFilterTypes.typeLine"
      :label="labels.itemTypeLine"/>

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

    <div class="filter-form__submit-btn filter-form__block--stretch">
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
import { FilterBooleanOptions } from '../../../constants';

@Component({
  components: {
    TextFilter,
    PrimaryButton,
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

