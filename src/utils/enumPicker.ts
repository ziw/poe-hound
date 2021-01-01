import { Item, ItemType } from '@/models/item';
import { JobSummary } from '@/models/job';

class EnumPicker<T> {
  constructor(private value: T) {}

  setValue(value: T) {
    this.value = value;
  }

  in(...args: T[]) {
    if (!this.value) {
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

const createEnumPicker = <S, T>(getEnumValue: (obj: S) => T) => {
  return {
    of: (obj: S) => {
      const enumPicker = new EnumPicker<T>(getEnumValue(obj));
      return enumPicker;
    },
  };
};

export const Type = createEnumPicker((item: Item) => item.frameType);
export const CurrentStatus = createEnumPicker((job: JobSummary) => job.status);
