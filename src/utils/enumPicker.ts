import { Item, ItemType } from '@/models/item';

class EnumPicker<T> {
  private value: T | undefined = undefined;

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
}

const createEnumPicker = <T>(getEnumValue: (item: Item) => T) => {
  const enumPicker = new EnumPicker<T>();
  return {
    of: (item: Item) => {
      enumPicker.setValue(getEnumValue(item));
      return enumPicker;
    }
  }
}

export const Type = createEnumPicker(item => item.frameType);
