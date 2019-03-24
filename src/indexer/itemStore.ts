import ItemIndexer from './itemIndexer';
import Item from '@/models/item';

class ItemStore {

  private indexProperties: ({
    filterType: FilterType,
    filterBy: (item: Item) => string[],
   })[] = [
    {
      filterType: FilterType.name,
      filterBy: item => [item.name],
    },
  ];
  private indexers: Map<FilterType, ItemIndexer>;

  constructor() {
    this.indexers = new Map();
    this.indexProperties.forEach(indexProperty => {
      this.indexers.set(
        indexProperty.filterType,
        new ItemIndexer(indexProperty.filterBy)
      );
    });
  }

  insert(item: Item){
    this.indexers.forEach(indexer => indexer.index(item));
  }

  insertAll(items: Item[]){
    items.forEach(item => this.insert(item));
  }

  query(type: FilterType, keyword: string): string[] {
    const indexer = this.indexers.get(type);
    return indexer ? indexer.query(keyword) : [];
  }

}

export enum FilterType {
  name = 'name',
  typeLine = 'typeLine',
};

export default new ItemStore();
