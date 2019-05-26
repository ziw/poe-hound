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
      :stretch="true"
      :filterType="indexFilterTypes.name"
      :label="labels.itemName"/>

    <text-filter
      class="filter-form__block--stretch"
      :stretch="false"
      :filterType="indexFilterTypes.typeLine"
      :label="labels.itemTypeLine"/>
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
import { IndexerFilterType } from '@/models/filterTypes';
import TextFilter from '@/components/main/filters/TextFilter.vue';
import PrimaryButton from '@/components/shared/PrimaryButton.vue';

@Component({
  components: {
    TextFilter,
    PrimaryButton,
  }
})
export default class FilterForm extends Vue {

  labels = messages.filters;
  indexFilterTypes = IndexerFilterType;


  filterItems() {
    filters.actions.dispatchFilterItems();
  }

  clearFilters() {
    filters.actions.dispatchClearFilters();
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

      &--stretch {
        width: 100%;
      }
    }
  }

</style>

