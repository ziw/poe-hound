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

  queryById(id: string) {
    return this.itemDetails.get(id);
  }

  queryByFilter(type: FilterType, keyword: string): string[] {
    const indexer = this.indexers.get(type);
    return indexer ? indexer.query(keyword) : [];
  }

}

export enum FilterType {
  name = 'name',
  typeLine = 'typeLine',
};

export default new ItemStore();
