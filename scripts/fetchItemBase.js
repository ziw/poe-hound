const { parse } = require('node-html-parser');
const request = require('request-promise-native');
const path = require('path');
const { promises: fs } = require('fs');

const POEDB_ITEMS_PAGE = 'https://poedb.tw/us/item.php';
const GROUPED_ITEM_CATEGORIES = {
  'Any One Handed Weapon': ['Claw', 'Dagger', 'Wand', 'One Hand Sword', 'Thrusting One Hand Sword', 'One Hand Axe', 'One Hand Mace', 'Sceptre', 'Rune Dagger'],
  'Any Two Handed Weapon': ['Bow', 'Staff', 'Two Hand Sword', 'Two Hand Axe', 'Two Hand Mace', 'Warstaff', 'FishingRod'],
  'Offhand': ['Quiver', 'Shield'],
  'Jewellery': ['Amulet', 'Ring', 'Belt'],
  'Any Armor': ['Gloves', 'Boots', 'Body Armour', 'Helmet'],
  'Other': ['Jewel', 'AbyssJewel'],
};
const outputCategories = {
  category: {},
  groupedCategory: { ...GROUPED_ITEM_CATEGORIES },
};

const readItemCategories = async () => {
  const categories = [];
  Object.entries(GROUPED_ITEM_CATEGORIES).forEach(([category, subCategories]) => subCategories.forEach(subCategory => categories.push({ category, subCategory })));
  for(const entry of categories){
    const { category, subCategory } = entry;
    const url = `${POEDB_ITEMS_PAGE}/?cn=${subCategory.replace(' ', '+')}`;
    const document = await request(url).then(body => parse(body)).catch(() => console.log(`${subCategory } failed`));
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const baseName = (row.querySelector('a').innerHTML || '');
      outputCategories.category[subCategory] = [...(outputCategories.category[subCategory] || []), baseName];
    });
    await new Promise(r => setTimeout(r, 3000));
  }

  //clean up special cases
  const { category, groupedCategory } = outputCategories;
  category['One Hand Sword'] = [ ...category['One Hand Sword'], ...category['Thrusting One Hand Sword'] ];
  category['Jewel'] = [ ...category['Jewel'], ...category['AbyssJewel'] ];
  delete category['Thrusting One Hand Sword'];
  delete groupedCategory['Other'];
  delete groupedCategory['Jewellery'];
  delete groupedCategory['Offhand'];
  fs.writeFile(path.join(__dirname, '../src', 'itemBase.json'), JSON.stringify(outputCategories, undefined, 2))
}

readItemCategories();
