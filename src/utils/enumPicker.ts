import { Item, ItemType } from '@/models/item';

class EnumPicker<T> {

  constructor(private value: T){
  }

  setValue(value: T) {
    this.value = value;
  }

  in(...args: T[]) {
    if(!this.value){
      return false;
    }
    return args.includes(this.value);
  }

  is(other: T) {
    return this.value === other;
  }

  isNot(...args: T[]) {
    return !this.in(...args);
  }

  get enumValue() {
    return this.value;
  }
}

const createEnumPicker = <T>(getEnumValue: (item: Item) => T) => {
  return {
    of: (item: Item) => {
      const enumPicker = new EnumPicker<T>(getEnumValue(item));
      return enumPicker;
    }
  }
}

export const Type = createEnumPicker(item => item.frameType);
