import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, ViewEncapsulation, Output, Input, ViewChild, NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const ChangeOperation = {
    NONE: 0,
    ADD: 1,
    UPDATE: 2,
    REMOVE: 3,
};
ChangeOperation[ChangeOperation.NONE] = 'NONE';
ChangeOperation[ChangeOperation.ADD] = 'ADD';
ChangeOperation[ChangeOperation.UPDATE] = 'UPDATE';
ChangeOperation[ChangeOperation.REMOVE] = 'REMOVE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class NgxVScrollService {
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
/** @nocollapse */ NgxVScrollService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NgxVScrollService_Factory() { return new NgxVScrollService(); }, token: NgxVScrollService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgxVScrollService.prototype.trackBy;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class NgxVScrollComponent {
    /**
     * @param {?} scrollerService
     */
    constructor(scrollerService) {
        this.scrollerService = scrollerService;
        this.viewportItems = new EventEmitter();
        this.scrollEnd = new EventEmitter();
        this.setDefaults();
    }
    /**
     * @return {?}
     */
    get scrollParentDiv() {
        return this.scrollParentElementRef && this.scrollParentElementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    get scrollItemsDiv() {
        return this.scrollItemsElementRef && this.scrollItemsElementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.trackBy) {
            throw new Error('ItemKey must be set to determine the changes and calculations of scroll offsets');
        }
        else {
            this.scrollerService.trackBy = this.trackBy;
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const itemsChange = changes.items;
        if (itemsChange) {
            if (itemsChange.firstChange || ((/** @type {?} */ (itemsChange.previousValue))).length === 0) {
                this.initialRender();
            }
            else {
                /** @type {?} */
                const changeData = this.scrollerService.onItemChange(itemsChange.previousValue, itemsChange.currentValue);
                this.handleItemChange(changeData);
            }
        }
    }
    /**
     * @param {?} options
     * @return {?}
     */
    scrollTo(options) {
        /** @type {?} */
        const top = options.offsetTop || this.itemMeta[options.index].offsetTop;
        this.scrollParentDiv.scrollTo({ top });
    }
    /**
     * @param {?} virtualIndex
     * @return {?}
     */
    getItemIndex(virtualIndex) {
        return this.lastStartIndex + virtualIndex;
    }
    /**
     * @private
     * @return {?}
     */
    setDefaults() {
        this.clonedViewportItems = [];
        this.itemMeta = [];
        this.maxYOffset = 0;
        this.scrollHeight = 0;
        this.buffer = 10;
        this.lastStartIndex = 0;
        this.lastCount = this.buffer;
        this.mutationObservers = [];
    }
    /**
     * @private
     * @return {?}
     */
    initialRender() {
        // Render all items to process the meta
        this.setViewportItems(this.items);
        // Wait a tick for angular to render
        // TODO: do it outside angular zone
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.processItemMeta();
            this.setScrollHeight();
            this.setViewportItems(this.items.slice(0, this.buffer));
            // Wait a tick for angular to render
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.attachMutationObservers();
            }));
        }));
    }
    /**
     * @private
     * @param {?} items
     * @return {?}
     */
    setViewportItems(items) {
        this.clonedViewportItems = Array.from(items);
        this.viewportItems.emit(items);
    }
    /**
     * @private
     * @return {?}
     */
    processItemMeta() {
        /** @type {?} */
        const htmlElements = this.getHtmlElements();
        htmlElements.forEach((/**
         * @param {?} element
         * @param {?} index
         * @return {?}
         */
        (element, index) => {
            this.itemMeta.push({
                offsetTop: element.offsetTop,
                height: element.getBoundingClientRect().height,
                value: this.items[index]
            });
        }));
    }
    /**
     * @private
     * @return {?}
     */
    getHtmlElements() {
        /** @type {?} */
        const elementCollection = this.scrollItemsDiv.childNodes;
        /** @type {?} */
        const elementArray = (/** @type {?} */ (Array.from(elementCollection)));
        return elementArray.filter((/**
         * @param {?} element
         * @return {?}
         */
        element => element.nodeType === 1));
    }
    /**
     * @private
     * @return {?}
     */
    setScrollHeight() {
        // Last item offsetTop is the max
        /** @type {?} */
        const lastItem = this.itemMeta[this.itemMeta.length - 1];
        this.maxYOffset = lastItem.offsetTop;
        // The scroll's height with be the same as the last elements offsetTop plus it's height
        this.scrollHeight = this.maxYOffset + lastItem.height;
    }
    /**
     * @return {?}
     */
    onScroll() {
        clearTimeout(this.isScrolling);
        clearTimeout(this.isScrollingEvent);
        this.isScrolling = setTimeout((/**
         * @return {?}
         */
        () => {
            this.handleScroll();
        }), 15);
        this.isScrollingEvent = setTimeout((/**
         * @return {?}
         */
        () => {
            this.scrollEnd.emit();
        }), 200);
    }
    /**
     * @return {?}
     */
    handleScroll() {
        // Get the user's current scroll position
        /** @type {?} */
        const scrollPosition = this.scrollParentDiv.scrollTop;
        // If we are already at the bottom of the list then don't do anything else
        // and nsure the offset does not exceed the scroll-size height
        if (scrollPosition >= this.maxYOffset) {
            this.updateOffsetYPosition(this.maxYOffset);
            return;
        }
        // Find the closest row to our current scroll position
        /** @type {?} */
        const closestRowIndex = this.scrollerService.getClosestItemIndex(scrollPosition, this.itemMeta);
        // Find the rows that we need to render using the buffer
        /** @type {?} */
        const viewportMeta = this.scrollerService.getViewportMeta(closestRowIndex, this.buffer, this.itemMeta);
        if (viewportMeta.startIndex !== this.lastStartIndex || viewportMeta.count !== this.lastCount) {
            this.lastStartIndex = viewportMeta.startIndex;
            this.lastCount = viewportMeta.count;
            this.deattachMutationObserver();
            // // Get new viewport item acc to start and end indexes
            /** @type {?} */
            const items = this.items.slice(viewportMeta.startIndex, viewportMeta.count);
            this.setViewportItems(items);
            // Being to update the offset's Y position once we have rendered at least 10 elements
            /** @type {?} */
            const updatePosition = Math.max(0, closestRowIndex - this.buffer) === 0 ? 0 : this.itemMeta[viewportMeta.startIndex].offsetTop;
            this.updateOffsetYPosition(updatePosition);
            // Wait a tick for angular to render
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.attachMutationObservers();
            }));
        }
    }
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    handleItemChange(change) {
        switch (change.operation) {
            case ChangeOperation.ADD:
                this.handleAddChange(change);
                break;
            case ChangeOperation.UPDATE:
                this.handleUpdateChange(change);
                break;
            case ChangeOperation.REMOVE:
                this.handleRemoveChange(change);
                break;
            default:
                break;
        }
    }
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    handleAddChange(change) {
        // Get the user's current scroll position
        /** @type {?} */
        const scrollPosition = this.scrollParentDiv.scrollTop;
        // Render the new added items to end on the viewport, this will
        // perform optimization when re-rendering them to it's orginal position
        /** @type {?} */
        const addedItems = change.diff.map((/**
         * @param {?} diff
         * @return {?}
         */
        diff => diff.value));
        this.clonedViewportItems.push(...addedItems);
        this.setViewportItems(this.clonedViewportItems);
        // Wait a tick for angular to render them
        setTimeout((/**
         * @return {?}
         */
        () => {
            // Get rendered item and update item meta
            /** @type {?} */
            const renderedElement = this.getHtmlElements();
            this.scrollerService.processItemMetaForAdd(change.diff, renderedElement, this.itemMeta);
            // Update viewport back to it's original items;
            /** @type {?} */
            const items = this.items.slice(this.lastStartIndex, this.lastCount);
            this.setViewportItems(items);
            this.setScrollHeight();
            // Wait a tick for angular to re-render the added items to it's
            // original position and scroll back to user original scroll position
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.scrollParentDiv.scrollTo({ top: scrollPosition });
            }));
        }));
    }
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    handleUpdateChange(change) {
        // Get the user's current scroll position
        /** @type {?} */
        const scrollPosition = this.scrollParentDiv.scrollTop;
        // Find the change that are outside the viewport
        /** @type {?} */
        const updatedItemsOutsideViewport = change.diff
            .filter((/**
         * @param {?} diff
         * @return {?}
         */
        diff => !(diff.index <= this.lastCount && diff.index >= this.lastStartIndex)));
        if (updatedItemsOutsideViewport.length) {
            // Render the items that are outside viewport, this will
            // perform optimization when re-rendering them to it's orginal position
            this.clonedViewportItems.push(...updatedItemsOutsideViewport.map((/**
             * @param {?} diff
             * @return {?}
             */
            diff => diff.value)));
            this.setViewportItems(this.clonedViewportItems);
            // Wait a tick for angular to render them
            setTimeout((/**
             * @return {?}
             */
            () => {
                // Get rendered element and adjust item meta accordingly
                /** @type {?} */
                const renderedElements = this.getHtmlElements();
                this.scrollerService.processItemMetaForUpdate(updatedItemsOutsideViewport, renderedElements, this.itemMeta);
                // Rerender the original items
                /** @type {?} */
                const items = this.items.slice(this.lastStartIndex, this.lastCount);
                this.setViewportItems(items);
                this.setScrollHeight();
                // Wait a tick for angular to re-render the added items to it's
                // original position and scroll back to user original scroll position
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this.scrollParentDiv.scrollTo({ top: scrollPosition });
                }));
            }));
        }
        else {
            /** @type {?} */
            const updatedItemsOnViewport = change.diff
                .filter((/**
             * @param {?} diff
             * @return {?}
             */
            diff => diff.index <= this.lastCount && diff.index >= this.lastStartIndex));
            // Rerender the original items
            /** @type {?} */
            const items = this.items.slice(this.lastStartIndex, this.lastCount);
            this.setViewportItems(items);
            // Wait a tick for angular to render them
            setTimeout((/**
             * @return {?}
             */
            () => {
                // Get rendered element and adjust item meta accordingly
                /** @type {?} */
                const renderedElements = this.getHtmlElements();
                this.scrollerService.processItemMetaForUpdate(updatedItemsOnViewport, renderedElements, this.itemMeta);
                this.setScrollHeight();
                // Wait a tick for angular to re-render the added items to it's
                // original position and scroll back to user original scroll position
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this.scrollParentDiv.scrollTo({ top: scrollPosition });
                }));
            }));
        }
    }
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    handleRemoveChange(change) {
        // Get the user's current scroll position
        /** @type {?} */
        const scrollPosition = this.scrollParentDiv.scrollTop;
        // Update the item meta of the items that are removed
        this.scrollerService.processItemMetaForRemove(change.diff, this.itemMeta);
        // Update viewport
        /** @type {?} */
        const items = this.items.slice(this.lastStartIndex, this.lastCount);
        this.setViewportItems(items);
        this.setScrollHeight();
        // Wait a Tick for new Items to be rendered
        setTimeout((/**
         * @return {?}
         */
        () => {
            // Now set the scroll to it's previous position before the change
            this.scrollParentDiv.scrollTo({ top: scrollPosition });
        }));
    }
    /**
     * @private
     * @param {?} position
     * @return {?}
     */
    updateOffsetYPosition(position) {
        this.scrollItemsDiv.style.transform = `translateY(${position}px)`;
    }
    /**
     * @private
     * @return {?}
     */
    attachMutationObservers() {
        /** @type {?} */
        const elements = this.getHtmlElements();
        elements.forEach((/**
         * @param {?} element
         * @param {?} index
         * @return {?}
         */
        (element, index) => {
            /** @type {?} */
            const itemIndex = this.getItemIndex(index);
            /** @type {?} */
            const observer = new MutationObserver((/**
             * @return {?}
             */
            () => this.onObserve(element, itemIndex)));
            observer.observe(element, { subtree: true, childList: true });
            this.mutationObservers.push(observer);
        }));
    }
    /**
     * @private
     * @param {?} element
     * @param {?} itemIndex
     * @return {?}
     */
    onObserve(element, itemIndex) {
        /** @type {?} */
        const currentHeight = element.getBoundingClientRect().height;
        if (currentHeight === this.itemMeta[itemIndex].height) {
            return;
        }
        /** @type {?} */
        const adjustmentOffset = currentHeight - this.itemMeta[itemIndex].height;
        this.itemMeta[itemIndex].height = currentHeight;
        for (let index = itemIndex + 1; index < this.itemMeta.length; index++) {
            /** @type {?} */
            const itemMeta = this.itemMeta[index];
            itemMeta.offsetTop += adjustmentOffset;
        }
        this.setScrollHeight();
    }
    /**
     * @private
     * @return {?}
     */
    deattachMutationObserver() {
        this.mutationObservers.forEach((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            observer.disconnect();
        }));
        this.mutationObservers = [];
    }
}
NgxVScrollComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-vscroll',
                template: "<div #scrollParent class=\"scroll-parent\" (scroll)=\"onScroll();\">\n  <div #scrollItems class=\"scroll-items\">\n    <ng-content></ng-content>\n  </div>\n  <div class=\"scroll-size\" [style.height.px]=\"scrollHeight\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".vscroll-scroll-parent{height:100%;overflow:auto;position:relative;scroll-behavior:smooth}.vscroll-scroll-items{position:relative}.vscroll-scroll-size{position:absolute;top:0;left:0;width:100%;opacity:0;z-index:-1}ngx-vscroll{display:block}"]
            }] }
];
/** @nocollapse */
NgxVScrollComponent.ctorParameters = () => [
    { type: NgxVScrollService }
];
NgxVScrollComponent.propDecorators = {
    viewportItems: [{ type: Output }],
    scrollEnd: [{ type: Output }],
    items: [{ type: Input }],
    buffer: [{ type: Input }],
    trackBy: [{ type: Input }],
    scrollParentElementRef: [{ type: ViewChild, args: ['scrollParent', { static: false },] }],
    scrollItemsElementRef: [{ type: ViewChild, args: ['scrollItems', { static: false },] }]
};
if (false) {
    /** @type {?} */
    NgxVScrollComponent.prototype.viewportItems;
    /** @type {?} */
    NgxVScrollComponent.prototype.scrollEnd;
    /** @type {?} */
    NgxVScrollComponent.prototype.items;
    /** @type {?} */
    NgxVScrollComponent.prototype.buffer;
    /** @type {?} */
    NgxVScrollComponent.prototype.trackBy;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.clonedViewportItems;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.itemMeta;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.maxYOffset;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.lastStartIndex;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.lastCount;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.mutationObservers;
    /** @type {?} */
    NgxVScrollComponent.prototype.scrollHeight;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.isScrolling;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.isScrollingEvent;
    /** @type {?} */
    NgxVScrollComponent.prototype.scrollParentElementRef;
    /** @type {?} */
    NgxVScrollComponent.prototype.scrollItemsElementRef;
    /**
     * @type {?}
     * @private
     */
    NgxVScrollComponent.prototype.scrollerService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxVScrollModule {
}
NgxVScrollModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxVScrollComponent],
                imports: [],
                exports: [NgxVScrollComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxVScrollComponent, NgxVScrollModule, NgxVScrollService };
//# sourceMappingURL=ngx-vscroll.js.map
