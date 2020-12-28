import { Item } from '@/models/item';
import TrieNode from '@/utils/trie';

export default class ItemIndexer {
  private trie: TrieNode<string>;

  public constructor(
    private readonly getIndexingProperties: (item: Item) => string[],
    private readonly shouldIndex: (item: Item) => boolean = () => true,
  ) {
    this.trie = new TrieNode();
  }

  index(item: Item) {
    if (!this.shouldIndex(item)) {
      return;
    }
    const mods = this.getIndexingProperties(item);
    mods.forEach((mod) => {
      this.trie.insert(mod, item.id);
    });
  }

  query(q: string): string[] {
    return this.trie.find(q);
  }
}
