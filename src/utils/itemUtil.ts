import Item from '@/models/item';

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
