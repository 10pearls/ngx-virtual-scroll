import { Injectable } from '@angular/core';
import { ItemMeta, ViewportMeta, ItemChange, ItemDiff } from './ngx-vscroll.interface';
import { ChangeOperation } from './ngx-vscroll.enum';

@Injectable({
  providedIn: 'root'
})
export class NgxVScrollService<T> {


  constructor() { }

  trackBy: string;

  getClosestItemIndex(scrollPosition: number, itemMeta: ItemMeta<T>[]) {
    let current = itemMeta[0].offsetTop;
    let currentIndex = 0;
    let difference = Math.abs(scrollPosition - current);

    for (let index = 0; index < itemMeta.length; index++) {
      const newDifference = Math.abs(scrollPosition - itemMeta[index].offsetTop);
      if (newDifference < difference) {
        difference = newDifference;
        current = itemMeta[index].offsetTop;
        currentIndex = index;
      }
    }
    return currentIndex;
  }

  getViewportMeta(closestRowIndex: number, buffer: number, itemMeta: ItemMeta<T>[]): ViewportMeta {
    let startIndex = closestRowIndex - buffer;
    let count = closestRowIndex + buffer;

    // Safe check startIndex and count;
    if (startIndex < 0) {
      startIndex = 0;
    }
    if (count >= itemMeta.length) {
      count = itemMeta.length;
    }

    return {
      count,
      startIndex,
    };
  }

  /**
   * Find out the difference of item on Add/Update/Remove
   * @param oldItems Takes previous item list
   * @param newItems Takes latest item list
   * @returns Item changes with operation
   */
  onItemChange(oldItems: T[], newItems: T[]): ItemChange<T> {
    if (newItems.length === oldItems.length) {
      const updationDifference = this.getItemDifferenceForEqualLength(oldItems, newItems);
      if (updationDifference.length) {
        return {
          operation: ChangeOperation.UPDATE,
          diff: updationDifference
        };
      }
    }

    if (newItems.length > oldItems.length) {
      const additionDifference = this.getItemDifference(oldItems, newItems);
      if (additionDifference.length) {
        return {
          operation: ChangeOperation.ADD,
          diff: additionDifference
        };
      }
    }

    if (newItems.length < oldItems.length) {
      const deletionDifference = this.getItemDifference(newItems, oldItems);
      if (deletionDifference.length) {
        return {
          operation: ChangeOperation.REMOVE,
          diff: deletionDifference
        };
      }
    }

    return {
      operation: ChangeOperation.NONE
    };
  }

  handleItemChange() {

  }

  processItemMetaForAdd(addedItems: ItemDiff<T>[], renderedElements: HTMLElement[], itemsMeta: ItemMeta<T>[]) {
    // Filter out only added elements and get height
    const heights: { [index: number]: number } = {};
    renderedElements = renderedElements.slice(renderedElements.length - addedItems.length);
    addedItems.forEach((item, index) => {
      heights[item.index] = renderedElements[index].getBoundingClientRect().height;
    });

    // divide items into above and lower bound of itemsMeta
    const newArrivals = addedItems.reduce((previous, next) => {
      if (next.index >= itemsMeta.length) {
        previous.above.push(next);
      } else {
        previous.below.push(next);
      }
      return previous;
    }, { above: [], below: [] });
    newArrivals.above.sort((a, b) => a - b);

    // Process meta for newly added item and
    // adjust the heights of other items
    let addedItemIndex = 0;
    let originalIndex = newArrivals.below.length && newArrivals.below[addedItemIndex].index;
    let heightAddition = 0;


    // loop if items are added in between
    if (newArrivals.below.length) {
      for (let index = 0; index < itemsMeta.length; index++) {
        const itemMeta = itemsMeta[index];
        if (index === originalIndex) {
          const newItemMeta: ItemMeta<T> = {
            height: heights[originalIndex],
            offsetTop: itemMeta.offsetTop + heightAddition,
            value: newArrivals.below[addedItemIndex].value
          };
          itemsMeta.splice(index, 0, newItemMeta);
          heightAddition += heights[originalIndex];
          addedItemIndex = addedItemIndex + 1;
          originalIndex = newArrivals.below[addedItemIndex] && newArrivals.below[addedItemIndex].index;
        } else {
          itemMeta.offsetTop += heightAddition;
        }
      }
    }

    // just push new items at the end of array
    while (newArrivals.above.length !== 0) {
      const newArrival = newArrivals.above.pop();
      const newItemMeta: ItemMeta<T> = {
        height: heights[newArrival.index],
        offsetTop: itemsMeta[itemsMeta.length - 1].offsetTop + heights[newArrival.index],
        value: newArrival.value
      };
      itemsMeta.push(newItemMeta);
    }
  }


  processItemMetaForUpdate(updatedItems: ItemDiff<T>[], renderedElements: HTMLElement[], itemsMeta: ItemMeta<T>[]) {
    const heights: { [index: number]: number } = {};
    renderedElements = renderedElements.slice(renderedElements.length - updatedItems.length);
    updatedItems.forEach((diff, index) => {
      heights[diff.index] = renderedElements[index].getBoundingClientRect().height;
    });

    let diffIndex = 0;
    let originalIndex = updatedItems[diffIndex].index;
    let adjustmentHeight = 0;
    for (let index = 0; index < itemsMeta.length; index++) {
      const itemMeta = itemsMeta[index];
      if (index === originalIndex) {
        itemMeta.offsetTop += adjustmentHeight;
        itemMeta.value = updatedItems[diffIndex].value;
        const currentHeight = heights[originalIndex];
        adjustmentHeight += (currentHeight - itemMeta.height);
        itemMeta.height = currentHeight;
        diffIndex++;
        originalIndex = updatedItems[diffIndex] && updatedItems[diffIndex].index;
      } else {
        itemMeta.offsetTop += adjustmentHeight;
      }
    }
  }

  processItemMetaForRemove(removedItems: ItemDiff<T>[], itemsMeta: ItemMeta<T>[]) {
    let diffIndex = 0;
    let findIndex = removedItems[diffIndex] && removedItems[diffIndex].index;
    let heightSubtraction = 0;
    // Following loop is not a simple for loop, as the array being iterated is being mutated in the loop
    // tslint:disable-next-line: prefer-for-of
    for (
      let index = 0, renderedItem = itemsMeta[index];
      index < itemsMeta.length;
      index++ , renderedItem = itemsMeta[index]
    ) {
      if (index === findIndex) {
        heightSubtraction += renderedItem.height;
        itemsMeta.splice(index, 1);
        removedItems = this.updateIndexes(index, removedItems);
        index--;
        diffIndex++;
        findIndex = removedItems[diffIndex] && removedItems[diffIndex].index;
      } else {
        renderedItem.offsetTop -= heightSubtraction;
      }
    }
  }


  updateIndexes(removedIndex: number, items: ItemDiff<T>[]) {
    return items.map(item => {
      if (item.index > removedIndex) {
        item.index -= 1;
      }
      return item;
    });
  }

  /**
   * Takes 2 param array1 and array2 of type T
   * @param itemsA Takes old item for add difference and new item for added difference
   * @param itemsB Takes new item for add difference and old item for deletion difference
   * @returns ItemDiff of type T
   */
  private getItemDifference(itemsA: T[], itemsB: T[]): ItemDiff<T>[] {
    const itemsAKeys = itemsA.map(item => item[this.trackBy]);
    const diff: ItemDiff<T>[] = [];
    itemsB.forEach((item, index) => {
      if (!itemsAKeys.includes(item[this.trackBy])) {
        diff.push({ value: item, index });
      }
    });
    return diff;
  }

  private getItemDifferenceForEqualLength(itemsA: T[], itemsB: T[]): ItemDiff<T>[] {
    const itemsAKeys = itemsA.map(item => item[this.trackBy]);
    const diff: ItemDiff<T>[] = [];
    itemsB.forEach((item, index) => {
      if (!itemsAKeys.includes(item[this.trackBy])) {
        diff.push({ value: item, index });
      } else {
        const previousObjectindex = itemsA.findIndex((prevItem) => {
          return prevItem[this.trackBy] === item[this.trackBy];
        });
        if (previousObjectindex !== -1 && itemsA[previousObjectindex] !== item) {
          diff.push({ value: item, index });
        }
      }
    });
    return diff;
  }
}
