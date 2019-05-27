import ItemIndexer from './itemIndexer';
import Item from '@/models/item';
import { IndexerFilterType, FunctionalFilterType, indexerFilters, functionalFilters, Filter } from '../models/filterTypes';
import {
  unique,
} from '@/utils';

class ItemStore {

  private indexProperties = indexerFilters.slice();
  private indexers: Map<IndexerFilterType, ItemIndexer>;
  private itemDetails: Map<string, Item>;

  constructor() {
    this.indexers = new Map();
    this.itemDetails = new Map();
    this.indexProperties.forEach(indexProperty => {
      //for each property, create an indexer trie to index
      //the item by property key
      this.indexers.set(
        indexProperty.filterType,
        new ItemIndexer(indexProperty.getIndexKeys)
      );
    });
  }

  insert(item: Item){
    if(this.itemDetails.get(item.id)){
      //do not index the same item
      return;
    }
    this.itemDetails.set(item.id, item);
    this.indexers.forEach(indexer => indexer.index(item));
  }

  insertAll(items: Item[]) {
    items.forEach(item => this.insert(item));
  }

  getItemFromId(id: string) {
    return this.itemDetails.get(id);
  }

  queryByFilter(type: IndexerFilterType, keyword: string): string[] {
    const indexer = this.indexers.get(type);
    return indexer ? indexer.query(keyword) : [];
  }

  /**
   * pipe a list of item ids through a list of functional filters
   * and return a filtered list of ids that passes all the functions
   * @param ids a list of ids to filter
   * @param filterStates a list of filter type and value to filter by
   */
  filterByFunctions(ids: string[], filterStates: Filter<FunctionalFilterType>[]): string[] {
    const filteringFunctions = filterStates.map(filterState => {
      const filterDef = functionalFilters.find(f => f.filterType === filterState.type);
      if(filterDef){
        return (item: Item) => filterDef.filter(item, filterState.value);
      }
      return () => true;
    });

    return ids.map(id => this.getItemFromId(id))
            .filter(item => item && filteringFunctions.every(f => f(item)))
            .map(item => item!.id);
  }

  /**
   * given a filter type (e.g. name, typeLine), return a list of auto complete options
   * for this type to be shown in filter dropdown
   * @param type the type of filter
   */
  getFilterOptions(type: IndexerFilterType): string[] {
    const indexer = this.indexers.get(type);
    if(!indexer){
      return [];
    }
    const filterProp = this.indexProperties.find(prop => prop.filterType === type);
    const allIds = indexer!.query('');

    const options = allIds.flatMap(id => {
      const item = this.getItemFromId(id);
      return item ? filterProp!.getIndexKeys(item) : []
    });
    return unique(options);
  }

}

export default new ItemStore();
