import ItemIndexer from './itemIndexer';
import Item from '@/models/item';
import { IndexerFilterType } from '../models/filterTypes';
import {
  unique,
} from '@/utils';

class ItemStore {

  private indexProperties: ({
    filterType: IndexerFilterType,
    filterBy: (item: Item) => string[],
   })[] = [
    {
      filterType: IndexerFilterType.name,
      filterBy: item => [item.name],
    },
    {
      filterType: IndexerFilterType.typeLine,
      filterBy: item => [item.typeLine],
    },
  ];
  private indexers: Map<IndexerFilterType, ItemIndexer>;
  private itemDetails: Map<string, Item>;

  constructor() {
    this.indexers = new Map();
    this.itemDetails = new Map();
    this.indexProperties.forEach(indexProperty => {
      this.indexers.set(
        indexProperty.filterType,
        new ItemIndexer(indexProperty.filterBy)
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

    const options = allIds.map(id => {
        const item = this.getItemFromId(id);
        return item ? filterProp!.filterBy(item) : []
      }).reduce((acc, val) => acc.concat(val), []);

    return unique(options);
  }

}

export default new ItemStore();
