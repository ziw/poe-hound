import ItemIndexer from './itemIndexer';
import { Item } from '@/models/item';
import {
  IndexerFilterType,
  FunctionalFilterType,
  indexerFilters,
  functionalFilters,
  Filter,
} from '../models/filterTypes';
import { unique } from '@/utils';
import { session } from '@/store/modules/session';
import { OPTION_ANY } from '@/constants';

class ItemStore {
  private indexProperties = indexerFilters.slice();
  private indexers: Map<IndexerFilterType, ItemIndexer>;
  private itemDetails: Map<string, Item>;

  constructor() {
    this.indexers = new Map();
    this.itemDetails = new Map();
    this.indexProperties.forEach((indexProperty) => {
      //for each property, create an indexer trie to index
      //the item by property key
      this.indexers.set(
        indexProperty.type,
        new ItemIndexer(indexProperty.getIndexKeys, indexProperty.shouldIndex),
      );
    });
  }

  insert(item: Item) {
    if (this.itemDetails.get(item.id)) {
      //do not index the same item
      return;
    }
    this.itemDetails.set(item.id, item);
    this.indexers.forEach((indexer) => indexer.index(item));
  }

  insertAll(items: Item[]) {
    items.forEach((item) => this.insert(item));
  }

  getItemFromId(id: string) {
    return this.itemDetails.get(id);
  }

  getAllItemIds() {
    return new Set(this.itemDetails.keys());
  }

  queryIndexerResults(type: IndexerFilterType, keyword: string): Set<string> {
    const indexer = this.indexers.get(type);
    return new Set(indexer ? indexer.query(keyword) : []);
  }

  /**
   * pipe a list of item ids through a list of functional filters
   * and return a filtered set of ids that passes all the functions
   * @param ids a list of ids to filter
   * @param filterStates a list of filter type and value to filter by
   */
  filterByFunctions(ids: string[], filterStates: Filter<FunctionalFilterType>[]): Set<string> {
    const filteringFunctions = filterStates.map((filterState) => {
      const filterDef = functionalFilters.find((f) => f.type === filterState.type);
      if (filterDef && filterState.value != undefined) {
        return (item: Item) => filterDef.filter(item, filterState.value);
      }
      return () => true;
    });

    const resultIds = ids
      .map((id) => this.getItemFromId(id))
      .filter((item) => item && filteringFunctions.every((f) => f(item)))
      .map((item) => item!.id);
    return new Set(resultIds);
  }

  /**
   * given an indexer filter type (e.g. name, typeLine), return a list of auto complete options
   * for this type to be shown in filter dropdown
   * @param type the type of filter
   */
  getFilterOptions(type: IndexerFilterType, supportAnyOption = false): string[] {
    const indexer = this.indexers.get(type);
    if (!indexer) {
      return [];
    }
    const filterProp = this.indexProperties.find((prop) => prop.type === type);
    const allIds = indexer!.query('');
    const currentLeage = session.getters.getCurrentLeague()?.name;

    const options = allIds.flatMap((id) => {
      const item = this.getItemFromId(id);
      return item && (!item.league || item.league === currentLeage)
        ? filterProp?.getIndexKeys(item) ?? []
        : [];
    });
    if (supportAnyOption) {
      options.unshift(OPTION_ANY);
    }
    return unique(options);
  }
}

export default new ItemStore();
