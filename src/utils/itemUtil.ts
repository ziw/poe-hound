import Item from '@/models/item';

/**
 * return a multi-lined string containing an item's
 * basic information to display in an element 'title' tooltip
 * @param item the item to display
 */
export const convertItemToTitle = (item: Item) => {
  return [
    item.name,
    item.typeLine,
    ...(item.enchantMods || []),
    ...(item.implicitMods || []),
    ...(item.explicitMods || []),
    ...(item.craftedMods || []),
    ...(item.identified ? [] : ['Unidentified']),
    ...(item.corrupted ? ['Corrupted'] : ''),
  ].join('\n');
};
