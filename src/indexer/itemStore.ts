import ItemIndexer from './itemIndexer';
import Item from '@/models/item';
import { IndexerFilterType } from '../models/filterTypes';

class ItemStore {

  private indexProperties: ({
    filterType: IndexerFilterType,
    filterBy: (item: Item) => string[],
   })[] = [
    {
      filterType: IndexerFilterType.name,
      filterBy: item => [item.name],
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

  getFilterOptions(type: IndexerFilterType): string[] {
    const indexer = this.indexers.get(type);
    const filterProp = this.indexProperties.find(prop => prop.filterType === type);
    const allIds = indexer!.query('');

    return allIds.map(id => {
        const item = this.getItemFromId(id);
        return item ? filterProp!.filterBy(item) : []
      }).reduce((acc, val) => acc.concat(val), []);
  }

}

export default new ItemStore();
