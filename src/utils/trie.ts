export default class TrieNode<V> {

  private readonly values: V[] = [];
  private readonly nodes: { [key: string]: TrieNode<V> } = {};

  insert(key: string, value: V){
    if(!value || !key) {
      return;
    }

    const prefix = key.toLowerCase().split('');
    let root: TrieNode<V> = this;
    prefix.forEach(char => {
      root.nodes[char] = root.nodes[char] || new TrieNode<V>();
      root = root.nodes[char];
    });
    root.values.push(value);
  }

  find(key: string, exact = false): V[] {
    if(!key){
      key = '';
    }
    const prefix = key.toLowerCase().split('');
    let root: TrieNode<V> = this;

    prefix.forEach(char => {
      root.nodes[char] = root.nodes[char] || new TrieNode<V>();
      root = root.nodes[char];
    });

    return exact ? root.values : root.getAllItemsFromNode();
  }

  private getAllItemsFromNode(): V[] {
    let results = this.values;
    Object.keys(this.nodes).forEach(char => {
      results = results.concat(this.nodes[char].getAllItemsFromNode());
    });
    return results;
  }

}
