import Item from "@/models/item";

export default class ItemIndexer {

  public constructor(
    private readonly getIndexingProperties: (item: Item) => string[],
  ) {

  }

  index(item: Item) {
    const mods = this.getIndexingProperties(item);
  }

  query(q: string): string[] {
    return [];
  }

}
