/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { ChangeOperation } from './ngx-vscroll.enum';
import * as i0 from "@angular/core";
/**
 * @template T
 */
export class NgxVScrollService {
    constructor() { }
    /**
     * @param {?} scrollPosition
     * @param {?} itemMeta
     * @return {?}
     */
    getClosestItemIndex(scrollPosition, itemMeta) {
        /** @type {?} */
        let current = itemMeta[0].offsetTop;
        /** @type {?} */
        let currentIndex = 0;
        /** @type {?} */
        let difference = Math.abs(scrollPosition - current);
        for (let index = 0; index < itemMeta.length; index++) {
            /** @type {?} */
            const newDifference = Math.abs(scrollPosition - itemMeta[index].offsetTop);
            if (newDifference < difference) {
                difference = newDifference;
                current = itemMeta[index].offsetTop;
                currentIndex = index;
            }
        }
        return currentIndex;
    }
    /**
     * @param {?} closestRowIndex
     * @param {?} buffer
     * @param {?} itemMeta
     * @return {?}
     */
    getViewportMeta(closestRowIndex, buffer, itemMeta) {
        /** @type {?} */
        let startIndex = closestRowIndex - buffer;
        /** @type {?} */
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
     * @param {?} oldItems Takes previous item list
     * @param {?} newItems Takes latest item list
     * @return {?} Item changes with operation
     */
    onItemChange(oldItems, newItems) {
        if (newItems.length === oldItems.length) {
            /** @type {?} */
            const updationDifference = this.getItemDifferenceForEqualLength(oldItems, newItems);
            if (updationDifference.length) {
                return {
                    operation: ChangeOperation.UPDATE,
                    diff: updationDifference
                };
            }
        }
        if (newItems.length > oldItems.length) {
            /** @type {?} */
            const additionDifference = this.getItemDifference(oldItems, newItems);
            if (additionDifference.length) {
                return {
                    operation: ChangeOperation.ADD,
                    diff: additionDifference
                };
            }
        }
        if (newItems.length < oldItems.length) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    handleItemChange() {
    }
    /**
     * @param {?} addedItems
     * @param {?} renderedElements
     * @param {?} itemsMeta
     * @return {?}
     */
    processItemMetaForAdd(addedItems, renderedElements, itemsMeta) {
        // Filter out only added elements and get height
        /** @type {?} */
        const heights = {};
        renderedElements = renderedElements.slice(renderedElements.length - addedItems.length);
        addedItems.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        (item, index) => {
            heights[item.index] = renderedElements[index].getBoundingClientRect().height;
        }));
        // divide items into above and lower bound of itemsMeta
        /** @type {?} */
        const newArrivals = addedItems.reduce((/**
         * @param {?} previous
         * @param {?} next
         * @return {?}
         */
        (previous, next) => {
            if (next.index >= itemsMeta.length) {
                previous.above.push(next);
            }
            else {
                previous.below.push(next);
            }
            return previous;
        }), { above: [], below: [] });
        newArrivals.above.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a - b));
        // Process meta for newly added item and
        // adjust the heights of other items
        /** @type {?} */
        let addedItemIndex = 0;
        /** @type {?} */
        let originalIndex = newArrivals.below.length && newArrivals.below[addedItemIndex].index;
        /** @type {?} */
        let heightAddition = 0;
        // loop if items are added in between
        if (newArrivals.below.length) {
            for (let index = 0; index < itemsMeta.length; index++) {
                /** @type {?} */
                const itemMeta = itemsMeta[index];
                if (index === originalIndex) {
                    /** @type {?} */
                    const newItemMeta = {
                        height: heights[originalIndex],
                        offsetTop: itemMeta.offsetTop + heightAddition,
                        value: newArrivals.below[addedItemIndex].value
                    };
                    itemsMeta.splice(index, 0, newItemMeta);
                    heightAddition += heights[originalIndex];
                    addedItemIndex = addedItemIndex + 1;
                    originalIndex = newArrivals.below[addedItemIndex] && newArrivals.below[addedItemIndex].index;
                }
                else {
                    itemMeta.offsetTop += heightAddition;
                }
            }
        }
        // just push new items at the end of array
        while (newArrivals.above.length !== 0) {
            /** @type {?} */
            const newArrival = newArrivals.above.pop();
            /** @type {?} */
            const newItemMeta = {
                height: heights[newArrival.index],
                offsetTop: itemsMeta[itemsMeta.length - 1].offsetTop + heights[newArrival.index],
                value: newArrival.value
            };
            itemsMeta.push(newItemMeta);
        }
    }
    /**
     * @param {?} updatedItems
     * @param {?} renderedElements
     * @param {?} itemsMeta
     * @return {?}
     */
    processItemMetaForUpdate(updatedItems, renderedElements, itemsMeta) {
        /** @type {?} */
        const heights = {};
        renderedElements = renderedElements.slice(renderedElements.length - updatedItems.length);
        updatedItems.forEach((/**
         * @param {?} diff
         * @param {?} index
         * @return {?}
         */
        (diff, index) => {
            heights[diff.index] = renderedElements[index].getBoundingClientRect().height;
        }));
        /** @type {?} */
        let diffIndex = 0;
        /** @type {?} */
        let originalIndex = updatedItems[diffIndex].index;
        /** @type {?} */
        let adjustmentHeight = 0;
        for (let index = 0; index < itemsMeta.length; index++) {
            /** @type {?} */
            const itemMeta = itemsMeta[index];
            if (index === originalIndex) {
                itemMeta.offsetTop += adjustmentHeight;
                itemMeta.value = updatedItems[diffIndex].value;
                /** @type {?} */
                const currentHeight = heights[originalIndex];
                adjustmentHeight += (currentHeight - itemMeta.height);
                itemMeta.height = currentHeight;
                diffIndex++;
                originalIndex = updatedItems[diffIndex] && updatedItems[diffIndex].index;
            }
            else {
                itemMeta.offsetTop += adjustmentHeight;
            }
        }
    }
    /**
     * @param {?} removedItems
     * @param {?} itemsMeta
     * @return {?}
     */
    processItemMetaForRemove(removedItems, itemsMeta) {
        /** @type {?} */
        let diffIndex = 0;
        /** @type {?} */
        let findIndex = removedItems[diffIndex] && removedItems[diffIndex].index;
        /** @type {?} */
        let heightSubtraction = 0;
        // Following loop is not a simple for loop, as the array being iterated is being mutated in the loop
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0, renderedItem = itemsMeta[index]; index < itemsMeta.length; index++, renderedItem = itemsMeta[index]) {
            if (index === findIndex) {
                heightSubtraction += renderedItem.height;
                itemsMeta.splice(index, 1);
                removedItems = this.updateIndexes(index, removedItems);
                index--;
                diffIndex++;
                findIndex = removedItems[diffIndex] && removedItems[diffIndex].index;
            }
            else {
                renderedItem.offsetTop -= heightSubtraction;
            }
        }
    }
    /**
     * @param {?} removedIndex
     * @param {?} items
     * @return {?}
     */
    updateIndexes(removedIndex, items) {
        return items.map((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (item.index > removedIndex) {
                item.index -= 1;
            }
            return item;
        }));
    }
    /**
     * Takes 2 param array1 and array2 of type T
     * @private
     * @param {?} itemsA Takes old item for add difference and new item for added difference
     * @param {?} itemsB Takes new item for add difference and old item for deletion difference
     * @return {?} ItemDiff of type T
     */
    getItemDifference(itemsA, itemsB) {
        /** @type {?} */
        const itemsAKeys = itemsA.map((/**
         * @param {?} item
         * @return {?}
         */
        item => item[this.trackBy]));
        /** @type {?} */
        const diff = [];
        itemsB.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        (item, index) => {
            if (!itemsAKeys.includes(item[this.trackBy])) {
                diff.push({ value: item, index });
            }
        }));
        return diff;
    }
    /**
     * @private
     * @param {?} itemsA
     * @param {?} itemsB
     * @return {?}
     */
    getItemDifferenceForEqualLength(itemsA, itemsB) {
        /** @type {?} */
        const itemsAKeys = itemsA.map((/**
         * @param {?} item
         * @return {?}
         */
        item => item[this.trackBy]));
        /** @type {?} */
        const diff = [];
        itemsB.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        (item, index) => {
            if (!itemsAKeys.includes(item[this.trackBy])) {
                diff.push({ value: item, index });
            }
            else {
                /** @type {?} */
                const previousObjectindex = itemsA.findIndex((/**
                 * @param {?} prevItem
                 * @return {?}
                 */
                (prevItem) => {
                    return prevItem[this.trackBy] === item[this.trackBy];
                }));
                if (previousObjectindex !== -1 && itemsA[previousObjectindex] !== item) {
                    diff.push({ value: item, index });
                }
            }
        }));
        return diff;
    }
}
NgxVScrollService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgxVScrollService.ctorParameters = () => [];
/** @nocollapse */ NgxVScrollService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NgxVScrollService_Factory() { return new NgxVScrollService(); }, token: NgxVScrollService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgxVScrollService.prototype.trackBy;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXZzY3JvbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC12c2Nyb2xsLyIsInNvdXJjZXMiOlsibGliL25neC12c2Nyb2xsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7OztBQUtyRCxNQUFNLE9BQU8saUJBQWlCO0lBRzVCLGdCQUFnQixDQUFDOzs7Ozs7SUFJakIsbUJBQW1CLENBQUMsY0FBc0IsRUFBRSxRQUF1Qjs7WUFDN0QsT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTOztZQUMvQixZQUFZLEdBQUcsQ0FBQzs7WUFDaEIsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztRQUVuRCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTs7a0JBQzlDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzFFLElBQUksYUFBYSxHQUFHLFVBQVUsRUFBRTtnQkFDOUIsVUFBVSxHQUFHLGFBQWEsQ0FBQztnQkFDM0IsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BDLFlBQVksR0FBRyxLQUFLLENBQUM7YUFDdEI7U0FDRjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7Ozs7Ozs7SUFFRCxlQUFlLENBQUMsZUFBdUIsRUFBRSxNQUFjLEVBQUUsUUFBdUI7O1lBQzFFLFVBQVUsR0FBRyxlQUFlLEdBQUcsTUFBTTs7WUFDckMsS0FBSyxHQUFHLGVBQWUsR0FBRyxNQUFNO1FBRXBD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QUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUM7O2NBQ25ELElBQUksR0FBa0IsRUFBRTtRQUM5QixNQUFNLENBQUMsT0FBTzs7Ozs7UUFBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDbkM7aUJBQU07O3NCQUNDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxTQUFTOzs7O2dCQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQ3hELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxDQUFDLEVBQUM7Z0JBQ0YsSUFBSSxtQkFBbUIsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQ3RFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ25DO2FBQ0Y7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7O1lBbFBGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs7OztJQU1DLG9DQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEl0ZW1NZXRhLCBWaWV3cG9ydE1ldGEsIEl0ZW1DaGFuZ2UsIEl0ZW1EaWZmIH0gZnJvbSAnLi9uZ3gtdnNjcm9sbC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2hhbmdlT3BlcmF0aW9uIH0gZnJvbSAnLi9uZ3gtdnNjcm9sbC5lbnVtJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4VlNjcm9sbFNlcnZpY2U8VD4ge1xuXG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICB0cmFja0J5OiBzdHJpbmc7XG5cbiAgZ2V0Q2xvc2VzdEl0ZW1JbmRleChzY3JvbGxQb3NpdGlvbjogbnVtYmVyLCBpdGVtTWV0YTogSXRlbU1ldGE8VD5bXSkge1xuICAgIGxldCBjdXJyZW50ID0gaXRlbU1ldGFbMF0ub2Zmc2V0VG9wO1xuICAgIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICAgIGxldCBkaWZmZXJlbmNlID0gTWF0aC5hYnMoc2Nyb2xsUG9zaXRpb24gLSBjdXJyZW50KTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpdGVtTWV0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IG5ld0RpZmZlcmVuY2UgPSBNYXRoLmFicyhzY3JvbGxQb3NpdGlvbiAtIGl0ZW1NZXRhW2luZGV4XS5vZmZzZXRUb3ApO1xuICAgICAgaWYgKG5ld0RpZmZlcmVuY2UgPCBkaWZmZXJlbmNlKSB7XG4gICAgICAgIGRpZmZlcmVuY2UgPSBuZXdEaWZmZXJlbmNlO1xuICAgICAgICBjdXJyZW50ID0gaXRlbU1ldGFbaW5kZXhdLm9mZnNldFRvcDtcbiAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gIH1cblxuICBnZXRWaWV3cG9ydE1ldGEoY2xvc2VzdFJvd0luZGV4OiBudW1iZXIsIGJ1ZmZlcjogbnVtYmVyLCBpdGVtTWV0YTogSXRlbU1ldGE8VD5bXSk6IFZpZXdwb3J0TWV0YSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSBjbG9zZXN0Um93SW5kZXggLSBidWZmZXI7XG4gICAgbGV0IGNvdW50ID0gY2xvc2VzdFJvd0luZGV4ICsgYnVmZmVyO1xuXG4gICAgLy8gU2FmZSBjaGVjayBzdGFydEluZGV4IGFuZCBjb3VudDtcbiAgICBpZiAoc3RhcnRJbmRleCA8IDApIHtcbiAgICAgIHN0YXJ0SW5kZXggPSAwO1xuICAgIH1cbiAgICBpZiAoY291bnQgPj0gaXRlbU1ldGEubGVuZ3RoKSB7XG4gICAgICBjb3VudCA9IGl0ZW1NZXRhLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY291bnQsXG4gICAgICBzdGFydEluZGV4LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRmluZCBvdXQgdGhlIGRpZmZlcmVuY2Ugb2YgaXRlbSBvbiBBZGQvVXBkYXRlL1JlbW92ZVxuICAgKiBAcGFyYW0gb2xkSXRlbXMgVGFrZXMgcHJldmlvdXMgaXRlbSBsaXN0XG4gICAqIEBwYXJhbSBuZXdJdGVtcyBUYWtlcyBsYXRlc3QgaXRlbSBsaXN0XG4gICAqIEByZXR1cm5zIEl0ZW0gY2hhbmdlcyB3aXRoIG9wZXJhdGlvblxuICAgKi9cbiAgb25JdGVtQ2hhbmdlKG9sZEl0ZW1zOiBUW10sIG5ld0l0ZW1zOiBUW10pOiBJdGVtQ2hhbmdlPFQ+IHtcbiAgICBpZiAobmV3SXRlbXMubGVuZ3RoID09PSBvbGRJdGVtcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHVwZGF0aW9uRGlmZmVyZW5jZSA9IHRoaXMuZ2V0SXRlbURpZmZlcmVuY2VGb3JFcXVhbExlbmd0aChvbGRJdGVtcywgbmV3SXRlbXMpO1xuICAgICAgaWYgKHVwZGF0aW9uRGlmZmVyZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcGVyYXRpb246IENoYW5nZU9wZXJhdGlvbi5VUERBVEUsXG4gICAgICAgICAgZGlmZjogdXBkYXRpb25EaWZmZXJlbmNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5ld0l0ZW1zLmxlbmd0aCA+IG9sZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgY29uc3QgYWRkaXRpb25EaWZmZXJlbmNlID0gdGhpcy5nZXRJdGVtRGlmZmVyZW5jZShvbGRJdGVtcywgbmV3SXRlbXMpO1xuICAgICAgaWYgKGFkZGl0aW9uRGlmZmVyZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcGVyYXRpb246IENoYW5nZU9wZXJhdGlvbi5BREQsXG4gICAgICAgICAgZGlmZjogYWRkaXRpb25EaWZmZXJlbmNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5ld0l0ZW1zLmxlbmd0aCA8IG9sZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgY29uc3QgZGVsZXRpb25EaWZmZXJlbmNlID0gdGhpcy5nZXRJdGVtRGlmZmVyZW5jZShuZXdJdGVtcywgb2xkSXRlbXMpO1xuICAgICAgaWYgKGRlbGV0aW9uRGlmZmVyZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcGVyYXRpb246IENoYW5nZU9wZXJhdGlvbi5SRU1PVkUsXG4gICAgICAgICAgZGlmZjogZGVsZXRpb25EaWZmZXJlbmNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZXJhdGlvbjogQ2hhbmdlT3BlcmF0aW9uLk5PTkVcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlSXRlbUNoYW5nZSgpIHtcblxuICB9XG5cbiAgcHJvY2Vzc0l0ZW1NZXRhRm9yQWRkKGFkZGVkSXRlbXM6IEl0ZW1EaWZmPFQ+W10sIHJlbmRlcmVkRWxlbWVudHM6IEhUTUxFbGVtZW50W10sIGl0ZW1zTWV0YTogSXRlbU1ldGE8VD5bXSkge1xuICAgIC8vIEZpbHRlciBvdXQgb25seSBhZGRlZCBlbGVtZW50cyBhbmQgZ2V0IGhlaWdodFxuICAgIGNvbnN0IGhlaWdodHM6IHsgW2luZGV4OiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xuICAgIHJlbmRlcmVkRWxlbWVudHMgPSByZW5kZXJlZEVsZW1lbnRzLnNsaWNlKHJlbmRlcmVkRWxlbWVudHMubGVuZ3RoIC0gYWRkZWRJdGVtcy5sZW5ndGgpO1xuICAgIGFkZGVkSXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGhlaWdodHNbaXRlbS5pbmRleF0gPSByZW5kZXJlZEVsZW1lbnRzW2luZGV4XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgfSk7XG5cbiAgICAvLyBkaXZpZGUgaXRlbXMgaW50byBhYm92ZSBhbmQgbG93ZXIgYm91bmQgb2YgaXRlbXNNZXRhXG4gICAgY29uc3QgbmV3QXJyaXZhbHMgPSBhZGRlZEl0ZW1zLnJlZHVjZSgocHJldmlvdXMsIG5leHQpID0+IHtcbiAgICAgIGlmIChuZXh0LmluZGV4ID49IGl0ZW1zTWV0YS5sZW5ndGgpIHtcbiAgICAgICAgcHJldmlvdXMuYWJvdmUucHVzaChuZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZpb3VzLmJlbG93LnB1c2gobmV4dCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfSwgeyBhYm92ZTogW10sIGJlbG93OiBbXSB9KTtcbiAgICBuZXdBcnJpdmFscy5hYm92ZS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAvLyBQcm9jZXNzIG1ldGEgZm9yIG5ld2x5IGFkZGVkIGl0ZW0gYW5kXG4gICAgLy8gYWRqdXN0IHRoZSBoZWlnaHRzIG9mIG90aGVyIGl0ZW1zXG4gICAgbGV0IGFkZGVkSXRlbUluZGV4ID0gMDtcbiAgICBsZXQgb3JpZ2luYWxJbmRleCA9IG5ld0Fycml2YWxzLmJlbG93Lmxlbmd0aCAmJiBuZXdBcnJpdmFscy5iZWxvd1thZGRlZEl0ZW1JbmRleF0uaW5kZXg7XG4gICAgbGV0IGhlaWdodEFkZGl0aW9uID0gMDtcblxuXG4gICAgLy8gbG9vcCBpZiBpdGVtcyBhcmUgYWRkZWQgaW4gYmV0d2VlblxuICAgIGlmIChuZXdBcnJpdmFscy5iZWxvdy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpdGVtc01ldGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1NZXRhID0gaXRlbXNNZXRhW2luZGV4XTtcbiAgICAgICAgaWYgKGluZGV4ID09PSBvcmlnaW5hbEluZGV4KSB7XG4gICAgICAgICAgY29uc3QgbmV3SXRlbU1ldGE6IEl0ZW1NZXRhPFQ+ID0ge1xuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRzW29yaWdpbmFsSW5kZXhdLFxuICAgICAgICAgICAgb2Zmc2V0VG9wOiBpdGVtTWV0YS5vZmZzZXRUb3AgKyBoZWlnaHRBZGRpdGlvbixcbiAgICAgICAgICAgIHZhbHVlOiBuZXdBcnJpdmFscy5iZWxvd1thZGRlZEl0ZW1JbmRleF0udmFsdWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGl0ZW1zTWV0YS5zcGxpY2UoaW5kZXgsIDAsIG5ld0l0ZW1NZXRhKTtcbiAgICAgICAgICBoZWlnaHRBZGRpdGlvbiArPSBoZWlnaHRzW29yaWdpbmFsSW5kZXhdO1xuICAgICAgICAgIGFkZGVkSXRlbUluZGV4ID0gYWRkZWRJdGVtSW5kZXggKyAxO1xuICAgICAgICAgIG9yaWdpbmFsSW5kZXggPSBuZXdBcnJpdmFscy5iZWxvd1thZGRlZEl0ZW1JbmRleF0gJiYgbmV3QXJyaXZhbHMuYmVsb3dbYWRkZWRJdGVtSW5kZXhdLmluZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1NZXRhLm9mZnNldFRvcCArPSBoZWlnaHRBZGRpdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGp1c3QgcHVzaCBuZXcgaXRlbXMgYXQgdGhlIGVuZCBvZiBhcnJheVxuICAgIHdoaWxlIChuZXdBcnJpdmFscy5hYm92ZS5sZW5ndGggIT09IDApIHtcbiAgICAgIGNvbnN0IG5ld0Fycml2YWwgPSBuZXdBcnJpdmFscy5hYm92ZS5wb3AoKTtcbiAgICAgIGNvbnN0IG5ld0l0ZW1NZXRhOiBJdGVtTWV0YTxUPiA9IHtcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHRzW25ld0Fycml2YWwuaW5kZXhdLFxuICAgICAgICBvZmZzZXRUb3A6IGl0ZW1zTWV0YVtpdGVtc01ldGEubGVuZ3RoIC0gMV0ub2Zmc2V0VG9wICsgaGVpZ2h0c1tuZXdBcnJpdmFsLmluZGV4XSxcbiAgICAgICAgdmFsdWU6IG5ld0Fycml2YWwudmFsdWVcbiAgICAgIH07XG4gICAgICBpdGVtc01ldGEucHVzaChuZXdJdGVtTWV0YSk7XG4gICAgfVxuICB9XG5cblxuICBwcm9jZXNzSXRlbU1ldGFGb3JVcGRhdGUodXBkYXRlZEl0ZW1zOiBJdGVtRGlmZjxUPltdLCByZW5kZXJlZEVsZW1lbnRzOiBIVE1MRWxlbWVudFtdLCBpdGVtc01ldGE6IEl0ZW1NZXRhPFQ+W10pIHtcbiAgICBjb25zdCBoZWlnaHRzOiB7IFtpbmRleDogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcbiAgICByZW5kZXJlZEVsZW1lbnRzID0gcmVuZGVyZWRFbGVtZW50cy5zbGljZShyZW5kZXJlZEVsZW1lbnRzLmxlbmd0aCAtIHVwZGF0ZWRJdGVtcy5sZW5ndGgpO1xuICAgIHVwZGF0ZWRJdGVtcy5mb3JFYWNoKChkaWZmLCBpbmRleCkgPT4ge1xuICAgICAgaGVpZ2h0c1tkaWZmLmluZGV4XSA9IHJlbmRlcmVkRWxlbWVudHNbaW5kZXhdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICB9KTtcblxuICAgIGxldCBkaWZmSW5kZXggPSAwO1xuICAgIGxldCBvcmlnaW5hbEluZGV4ID0gdXBkYXRlZEl0ZW1zW2RpZmZJbmRleF0uaW5kZXg7XG4gICAgbGV0IGFkanVzdG1lbnRIZWlnaHQgPSAwO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpdGVtc01ldGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBpdGVtTWV0YSA9IGl0ZW1zTWV0YVtpbmRleF07XG4gICAgICBpZiAoaW5kZXggPT09IG9yaWdpbmFsSW5kZXgpIHtcbiAgICAgICAgaXRlbU1ldGEub2Zmc2V0VG9wICs9IGFkanVzdG1lbnRIZWlnaHQ7XG4gICAgICAgIGl0ZW1NZXRhLnZhbHVlID0gdXBkYXRlZEl0ZW1zW2RpZmZJbmRleF0udmFsdWU7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRIZWlnaHQgPSBoZWlnaHRzW29yaWdpbmFsSW5kZXhdO1xuICAgICAgICBhZGp1c3RtZW50SGVpZ2h0ICs9IChjdXJyZW50SGVpZ2h0IC0gaXRlbU1ldGEuaGVpZ2h0KTtcbiAgICAgICAgaXRlbU1ldGEuaGVpZ2h0ID0gY3VycmVudEhlaWdodDtcbiAgICAgICAgZGlmZkluZGV4Kys7XG4gICAgICAgIG9yaWdpbmFsSW5kZXggPSB1cGRhdGVkSXRlbXNbZGlmZkluZGV4XSAmJiB1cGRhdGVkSXRlbXNbZGlmZkluZGV4XS5pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1NZXRhLm9mZnNldFRvcCArPSBhZGp1c3RtZW50SGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NJdGVtTWV0YUZvclJlbW92ZShyZW1vdmVkSXRlbXM6IEl0ZW1EaWZmPFQ+W10sIGl0ZW1zTWV0YTogSXRlbU1ldGE8VD5bXSkge1xuICAgIGxldCBkaWZmSW5kZXggPSAwO1xuICAgIGxldCBmaW5kSW5kZXggPSByZW1vdmVkSXRlbXNbZGlmZkluZGV4XSAmJiByZW1vdmVkSXRlbXNbZGlmZkluZGV4XS5pbmRleDtcbiAgICBsZXQgaGVpZ2h0U3VidHJhY3Rpb24gPSAwO1xuICAgIC8vIEZvbGxvd2luZyBsb29wIGlzIG5vdCBhIHNpbXBsZSBmb3IgbG9vcCwgYXMgdGhlIGFycmF5IGJlaW5nIGl0ZXJhdGVkIGlzIGJlaW5nIG11dGF0ZWQgaW4gdGhlIGxvb3BcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcbiAgICBmb3IgKFxuICAgICAgbGV0IGluZGV4ID0gMCwgcmVuZGVyZWRJdGVtID0gaXRlbXNNZXRhW2luZGV4XTtcbiAgICAgIGluZGV4IDwgaXRlbXNNZXRhLmxlbmd0aDtcbiAgICAgIGluZGV4KysgLCByZW5kZXJlZEl0ZW0gPSBpdGVtc01ldGFbaW5kZXhdXG4gICAgKSB7XG4gICAgICBpZiAoaW5kZXggPT09IGZpbmRJbmRleCkge1xuICAgICAgICBoZWlnaHRTdWJ0cmFjdGlvbiArPSByZW5kZXJlZEl0ZW0uaGVpZ2h0O1xuICAgICAgICBpdGVtc01ldGEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmVtb3ZlZEl0ZW1zID0gdGhpcy51cGRhdGVJbmRleGVzKGluZGV4LCByZW1vdmVkSXRlbXMpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgICBkaWZmSW5kZXgrKztcbiAgICAgICAgZmluZEluZGV4ID0gcmVtb3ZlZEl0ZW1zW2RpZmZJbmRleF0gJiYgcmVtb3ZlZEl0ZW1zW2RpZmZJbmRleF0uaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW5kZXJlZEl0ZW0ub2Zmc2V0VG9wIC09IGhlaWdodFN1YnRyYWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgdXBkYXRlSW5kZXhlcyhyZW1vdmVkSW5kZXg6IG51bWJlciwgaXRlbXM6IEl0ZW1EaWZmPFQ+W10pIHtcbiAgICByZXR1cm4gaXRlbXMubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0uaW5kZXggPiByZW1vdmVkSW5kZXgpIHtcbiAgICAgICAgaXRlbS5pbmRleCAtPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgMiBwYXJhbSBhcnJheTEgYW5kIGFycmF5MiBvZiB0eXBlIFRcbiAgICogQHBhcmFtIGl0ZW1zQSBUYWtlcyBvbGQgaXRlbSBmb3IgYWRkIGRpZmZlcmVuY2UgYW5kIG5ldyBpdGVtIGZvciBhZGRlZCBkaWZmZXJlbmNlXG4gICAqIEBwYXJhbSBpdGVtc0IgVGFrZXMgbmV3IGl0ZW0gZm9yIGFkZCBkaWZmZXJlbmNlIGFuZCBvbGQgaXRlbSBmb3IgZGVsZXRpb24gZGlmZmVyZW5jZVxuICAgKiBAcmV0dXJucyBJdGVtRGlmZiBvZiB0eXBlIFRcbiAgICovXG4gIHByaXZhdGUgZ2V0SXRlbURpZmZlcmVuY2UoaXRlbXNBOiBUW10sIGl0ZW1zQjogVFtdKTogSXRlbURpZmY8VD5bXSB7XG4gICAgY29uc3QgaXRlbXNBS2V5cyA9IGl0ZW1zQS5tYXAoaXRlbSA9PiBpdGVtW3RoaXMudHJhY2tCeV0pO1xuICAgIGNvbnN0IGRpZmY6IEl0ZW1EaWZmPFQ+W10gPSBbXTtcbiAgICBpdGVtc0IuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghaXRlbXNBS2V5cy5pbmNsdWRlcyhpdGVtW3RoaXMudHJhY2tCeV0pKSB7XG4gICAgICAgIGRpZmYucHVzaCh7IHZhbHVlOiBpdGVtLCBpbmRleCB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGlmZjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SXRlbURpZmZlcmVuY2VGb3JFcXVhbExlbmd0aChpdGVtc0E6IFRbXSwgaXRlbXNCOiBUW10pOiBJdGVtRGlmZjxUPltdIHtcbiAgICBjb25zdCBpdGVtc0FLZXlzID0gaXRlbXNBLm1hcChpdGVtID0+IGl0ZW1bdGhpcy50cmFja0J5XSk7XG4gICAgY29uc3QgZGlmZjogSXRlbURpZmY8VD5bXSA9IFtdO1xuICAgIGl0ZW1zQi5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFpdGVtc0FLZXlzLmluY2x1ZGVzKGl0ZW1bdGhpcy50cmFja0J5XSkpIHtcbiAgICAgICAgZGlmZi5wdXNoKHsgdmFsdWU6IGl0ZW0sIGluZGV4IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNPYmplY3RpbmRleCA9IGl0ZW1zQS5maW5kSW5kZXgoKHByZXZJdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByZXZJdGVtW3RoaXMudHJhY2tCeV0gPT09IGl0ZW1bdGhpcy50cmFja0J5XTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcmV2aW91c09iamVjdGluZGV4ICE9PSAtMSAmJiBpdGVtc0FbcHJldmlvdXNPYmplY3RpbmRleF0gIT09IGl0ZW0pIHtcbiAgICAgICAgICBkaWZmLnB1c2goeyB2YWx1ZTogaXRlbSwgaW5kZXggfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGlmZjtcbiAgfVxufVxuIl19