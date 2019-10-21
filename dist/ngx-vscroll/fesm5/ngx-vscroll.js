import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, ViewEncapsulation, Output, Input, ViewChild, NgModule } from '@angular/core';
import { __spread } from 'tslib';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var ChangeOperation = {
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
var NgxVScrollService = /** @class */ (function () {
    function NgxVScrollService() {
    }
    /**
     * @param {?} scrollPosition
     * @param {?} itemMeta
     * @return {?}
     */
    NgxVScrollService.prototype.getClosestItemIndex = /**
     * @param {?} scrollPosition
     * @param {?} itemMeta
     * @return {?}
     */
    function (scrollPosition, itemMeta) {
        /** @type {?} */
        var current = itemMeta[0].offsetTop;
        /** @type {?} */
        var currentIndex = 0;
        /** @type {?} */
        var difference = Math.abs(scrollPosition - current);
        for (var index = 0; index < itemMeta.length; index++) {
            /** @type {?} */
            var newDifference = Math.abs(scrollPosition - itemMeta[index].offsetTop);
            if (newDifference < difference) {
                difference = newDifference;
                current = itemMeta[index].offsetTop;
                currentIndex = index;
            }
        }
        return currentIndex;
    };
    /**
     * @param {?} closestRowIndex
     * @param {?} buffer
     * @param {?} itemMeta
     * @return {?}
     */
    NgxVScrollService.prototype.getViewportMeta = /**
     * @param {?} closestRowIndex
     * @param {?} buffer
     * @param {?} itemMeta
     * @return {?}
     */
    function (closestRowIndex, buffer, itemMeta) {
        /** @type {?} */
        var startIndex = closestRowIndex - buffer;
        /** @type {?} */
        var count = closestRowIndex + buffer;
        // Safe check startIndex and count;
        if (startIndex < 0) {
            startIndex = 0;
        }
        if (count >= itemMeta.length) {
            count = itemMeta.length;
        }
        return {
            count: count,
            startIndex: startIndex,
        };
    };
    /**
     * Find out the difference of item on Add/Update/Remove
     * @param oldItems Takes previous item list
     * @param newItems Takes latest item list
     * @returns Item changes with operation
     */
    /**
     * Find out the difference of item on Add/Update/Remove
     * @param {?} oldItems Takes previous item list
     * @param {?} newItems Takes latest item list
     * @return {?} Item changes with operation
     */
    NgxVScrollService.prototype.onItemChange = /**
     * Find out the difference of item on Add/Update/Remove
     * @param {?} oldItems Takes previous item list
     * @param {?} newItems Takes latest item list
     * @return {?} Item changes with operation
     */
    function (oldItems, newItems) {
        if (newItems.length === oldItems.length) {
            /** @type {?} */
            var updationDifference = this.getItemDifferenceForEqualLength(oldItems, newItems);
            if (updationDifference.length) {
                return {
                    operation: ChangeOperation.UPDATE,
                    diff: updationDifference
                };
            }
        }
        if (newItems.length > oldItems.length) {
            /** @type {?} */
            var additionDifference = this.getItemDifference(oldItems, newItems);
            if (additionDifference.length) {
                return {
                    operation: ChangeOperation.ADD,
                    diff: additionDifference
                };
            }
        }
        if (newItems.length < oldItems.length) {
            /** @type {?} */
            var deletionDifference = this.getItemDifference(newItems, oldItems);
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
    };
    /**
     * @return {?}
     */
    NgxVScrollService.prototype.handleItemChange = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} addedItems
     * @param {?} renderedElements
     * @param {?} itemsMeta
     * @return {?}
     */
    NgxVScrollService.prototype.processItemMetaForAdd = /**
     * @param {?} addedItems
     * @param {?} renderedElements
     * @param {?} itemsMeta
     * @return {?}
     */
    function (addedItems, renderedElements, itemsMeta) {
        // Filter out only added elements and get height
        /** @type {?} */
        var heights = {};
        renderedElements = renderedElements.slice(renderedElements.length - addedItems.length);
        addedItems.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        function (item, index) {
            heights[item.index] = renderedElements[index].getBoundingClientRect().height;
        }));
        // divide items into above and lower bound of itemsMeta
        /** @type {?} */
        var newArrivals = addedItems.reduce((/**
         * @param {?} previous
         * @param {?} next
         * @return {?}
         */
        function (previous, next) {
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
        function (a, b) { return a - b; }));
        // Process meta for newly added item and
        // adjust the heights of other items
        /** @type {?} */
        var addedItemIndex = 0;
        /** @type {?} */
        var originalIndex = newArrivals.below.length && newArrivals.below[addedItemIndex].index;
        /** @type {?} */
        var heightAddition = 0;
        // loop if items are added in between
        if (newArrivals.below.length) {
            for (var index = 0; index < itemsMeta.length; index++) {
                /** @type {?} */
                var itemMeta = itemsMeta[index];
                if (index === originalIndex) {
                    /** @type {?} */
                    var newItemMeta = {
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
            var newArrival = newArrivals.above.pop();
            /** @type {?} */
            var newItemMeta = {
                height: heights[newArrival.index],
                offsetTop: itemsMeta[itemsMeta.length - 1].offsetTop + heights[newArrival.index],
                value: newArrival.value
            };
            itemsMeta.push(newItemMeta);
        }
    };
    /**
     * @param {?} updatedItems
     * @param {?} renderedElements
     * @param {?} itemsMeta
     * @return {?}
     */
    NgxVScrollService.prototype.processItemMetaForUpdate = /**
     * @param {?} updatedItems
     * @param {?} renderedElements
     * @param {?} itemsMeta
     * @return {?}
     */
    function (updatedItems, renderedElements, itemsMeta) {
        /** @type {?} */
        var heights = {};
        renderedElements = renderedElements.slice(renderedElements.length - updatedItems.length);
        updatedItems.forEach((/**
         * @param {?} diff
         * @param {?} index
         * @return {?}
         */
        function (diff, index) {
            heights[diff.index] = renderedElements[index].getBoundingClientRect().height;
        }));
        /** @type {?} */
        var diffIndex = 0;
        /** @type {?} */
        var originalIndex = updatedItems[diffIndex].index;
        /** @type {?} */
        var adjustmentHeight = 0;
        for (var index = 0; index < itemsMeta.length; index++) {
            /** @type {?} */
            var itemMeta = itemsMeta[index];
            if (index === originalIndex) {
                itemMeta.offsetTop += adjustmentHeight;
                itemMeta.value = updatedItems[diffIndex].value;
                /** @type {?} */
                var currentHeight = heights[originalIndex];
                adjustmentHeight += (currentHeight - itemMeta.height);
                itemMeta.height = currentHeight;
                diffIndex++;
                originalIndex = updatedItems[diffIndex] && updatedItems[diffIndex].index;
            }
            else {
                itemMeta.offsetTop += adjustmentHeight;
            }
        }
    };
    /**
     * @param {?} removedItems
     * @param {?} itemsMeta
     * @return {?}
     */
    NgxVScrollService.prototype.processItemMetaForRemove = /**
     * @param {?} removedItems
     * @param {?} itemsMeta
     * @return {?}
     */
    function (removedItems, itemsMeta) {
        /** @type {?} */
        var diffIndex = 0;
        /** @type {?} */
        var findIndex = removedItems[diffIndex] && removedItems[diffIndex].index;
        /** @type {?} */
        var heightSubtraction = 0;
        // Following loop is not a simple for loop, as the array being iterated is being mutated in the loop
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0, renderedItem = itemsMeta[index]; index < itemsMeta.length; index++, renderedItem = itemsMeta[index]) {
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
    };
    /**
     * @param {?} removedIndex
     * @param {?} items
     * @return {?}
     */
    NgxVScrollService.prototype.updateIndexes = /**
     * @param {?} removedIndex
     * @param {?} items
     * @return {?}
     */
    function (removedIndex, items) {
        return items.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (item.index > removedIndex) {
                item.index -= 1;
            }
            return item;
        }));
    };
    /**
     * Takes 2 param array1 and array2 of type T
     * @param itemsA Takes old item for add difference and new item for added difference
     * @param itemsB Takes new item for add difference and old item for deletion difference
     * @returns ItemDiff of type T
     */
    /**
     * Takes 2 param array1 and array2 of type T
     * @private
     * @param {?} itemsA Takes old item for add difference and new item for added difference
     * @param {?} itemsB Takes new item for add difference and old item for deletion difference
     * @return {?} ItemDiff of type T
     */
    NgxVScrollService.prototype.getItemDifference = /**
     * Takes 2 param array1 and array2 of type T
     * @private
     * @param {?} itemsA Takes old item for add difference and new item for added difference
     * @param {?} itemsB Takes new item for add difference and old item for deletion difference
     * @return {?} ItemDiff of type T
     */
    function (itemsA, itemsB) {
        var _this = this;
        /** @type {?} */
        var itemsAKeys = itemsA.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item[_this.trackBy]; }));
        /** @type {?} */
        var diff = [];
        itemsB.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        function (item, index) {
            if (!itemsAKeys.includes(item[_this.trackBy])) {
                diff.push({ value: item, index: index });
            }
        }));
        return diff;
    };
    /**
     * @private
     * @param {?} itemsA
     * @param {?} itemsB
     * @return {?}
     */
    NgxVScrollService.prototype.getItemDifferenceForEqualLength = /**
     * @private
     * @param {?} itemsA
     * @param {?} itemsB
     * @return {?}
     */
    function (itemsA, itemsB) {
        var _this = this;
        /** @type {?} */
        var itemsAKeys = itemsA.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item[_this.trackBy]; }));
        /** @type {?} */
        var diff = [];
        itemsB.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        function (item, index) {
            if (!itemsAKeys.includes(item[_this.trackBy])) {
                diff.push({ value: item, index: index });
            }
            else {
                /** @type {?} */
                var previousObjectindex = itemsA.findIndex((/**
                 * @param {?} prevItem
                 * @return {?}
                 */
                function (prevItem) {
                    return prevItem[_this.trackBy] === item[_this.trackBy];
                }));
                if (previousObjectindex !== -1 && itemsA[previousObjectindex] !== item) {
                    diff.push({ value: item, index: index });
                }
            }
        }));
        return diff;
    };
    NgxVScrollService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NgxVScrollService.ctorParameters = function () { return []; };
    /** @nocollapse */ NgxVScrollService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NgxVScrollService_Factory() { return new NgxVScrollService(); }, token: NgxVScrollService, providedIn: "root" });
    return NgxVScrollService;
}());
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
var NgxVScrollComponent = /** @class */ (function () {
    function NgxVScrollComponent(scrollerService) {
        this.scrollerService = scrollerService;
        this.viewportItems = new EventEmitter();
        this.scrollEnd = new EventEmitter();
        this.setDefaults();
    }
    Object.defineProperty(NgxVScrollComponent.prototype, "scrollParentDiv", {
        get: /**
         * @return {?}
         */
        function () {
            return this.scrollParentElementRef && this.scrollParentElementRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxVScrollComponent.prototype, "scrollItemsDiv", {
        get: /**
         * @return {?}
         */
        function () {
            return this.scrollItemsElementRef && this.scrollItemsElementRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxVScrollComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.trackBy) {
            throw new Error('ItemKey must be set to determine the changes and calculations of scroll offsets');
        }
        else {
            this.scrollerService.trackBy = this.trackBy;
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgxVScrollComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var itemsChange = changes.items;
        if (itemsChange) {
            if (itemsChange.firstChange || ((/** @type {?} */ (itemsChange.previousValue))).length === 0) {
                this.initialRender();
            }
            else {
                /** @type {?} */
                var changeData = this.scrollerService.onItemChange(itemsChange.previousValue, itemsChange.currentValue);
                this.handleItemChange(changeData);
            }
        }
    };
    /**
     * @param {?} options
     * @return {?}
     */
    NgxVScrollComponent.prototype.scrollTo = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var top = options.offsetTop || this.itemMeta[options.index].offsetTop;
        this.scrollParentDiv.scrollTo({ top: top });
    };
    /**
     * @param {?} virtualIndex
     * @return {?}
     */
    NgxVScrollComponent.prototype.getItemIndex = /**
     * @param {?} virtualIndex
     * @return {?}
     */
    function (virtualIndex) {
        return this.lastStartIndex + virtualIndex;
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.setDefaults = /**
     * @private
     * @return {?}
     */
    function () {
        this.clonedViewportItems = [];
        this.itemMeta = [];
        this.maxYOffset = 0;
        this.scrollHeight = 0;
        this.buffer = 10;
        this.lastStartIndex = 0;
        this.lastCount = this.buffer;
        this.mutationObservers = [];
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.initialRender = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        // Render all items to process the meta
        this.setViewportItems(this.items);
        // Wait a tick for angular to render
        // TODO: do it outside angular zone
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.processItemMeta();
            _this.setScrollHeight();
            _this.setViewportItems(_this.items.slice(0, _this.buffer));
            // Wait a tick for angular to render
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.attachMutationObservers();
            }));
        }));
    };
    /**
     * @private
     * @param {?} items
     * @return {?}
     */
    NgxVScrollComponent.prototype.setViewportItems = /**
     * @private
     * @param {?} items
     * @return {?}
     */
    function (items) {
        this.clonedViewportItems = Array.from(items);
        this.viewportItems.emit(items);
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.processItemMeta = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var htmlElements = this.getHtmlElements();
        htmlElements.forEach((/**
         * @param {?} element
         * @param {?} index
         * @return {?}
         */
        function (element, index) {
            _this.itemMeta.push({
                offsetTop: element.offsetTop,
                height: element.getBoundingClientRect().height,
                value: _this.items[index]
            });
        }));
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.getHtmlElements = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var elementCollection = this.scrollItemsDiv.childNodes;
        /** @type {?} */
        var elementArray = (/** @type {?} */ (Array.from(elementCollection)));
        return elementArray.filter((/**
         * @param {?} element
         * @return {?}
         */
        function (element) { return element.nodeType === 1; }));
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.setScrollHeight = /**
     * @private
     * @return {?}
     */
    function () {
        // Last item offsetTop is the max
        /** @type {?} */
        var lastItem = this.itemMeta[this.itemMeta.length - 1];
        this.maxYOffset = lastItem.offsetTop;
        // The scroll's height with be the same as the last elements offsetTop plus it's height
        this.scrollHeight = this.maxYOffset + lastItem.height;
    };
    /**
     * @return {?}
     */
    NgxVScrollComponent.prototype.onScroll = /**
     * @return {?}
     */
    function () {
        var _this = this;
        clearTimeout(this.isScrolling);
        clearTimeout(this.isScrollingEvent);
        this.isScrolling = setTimeout((/**
         * @return {?}
         */
        function () {
            _this.handleScroll();
        }), 15);
        this.isScrollingEvent = setTimeout((/**
         * @return {?}
         */
        function () {
            _this.scrollEnd.emit();
        }), 200);
    };
    /**
     * @return {?}
     */
    NgxVScrollComponent.prototype.handleScroll = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Get the user's current scroll position
        /** @type {?} */
        var scrollPosition = this.scrollParentDiv.scrollTop;
        // If we are already at the bottom of the list then don't do anything else
        // and nsure the offset does not exceed the scroll-size height
        if (scrollPosition >= this.maxYOffset) {
            this.updateOffsetYPosition(this.maxYOffset);
            return;
        }
        // Find the closest row to our current scroll position
        /** @type {?} */
        var closestRowIndex = this.scrollerService.getClosestItemIndex(scrollPosition, this.itemMeta);
        // Find the rows that we need to render using the buffer
        /** @type {?} */
        var viewportMeta = this.scrollerService.getViewportMeta(closestRowIndex, this.buffer, this.itemMeta);
        if (viewportMeta.startIndex !== this.lastStartIndex || viewportMeta.count !== this.lastCount) {
            this.lastStartIndex = viewportMeta.startIndex;
            this.lastCount = viewportMeta.count;
            this.deattachMutationObserver();
            // // Get new viewport item acc to start and end indexes
            /** @type {?} */
            var items = this.items.slice(viewportMeta.startIndex, viewportMeta.count);
            this.setViewportItems(items);
            // Being to update the offset's Y position once we have rendered at least 10 elements
            /** @type {?} */
            var updatePosition = Math.max(0, closestRowIndex - this.buffer) === 0 ? 0 : this.itemMeta[viewportMeta.startIndex].offsetTop;
            this.updateOffsetYPosition(updatePosition);
            // Wait a tick for angular to render
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.attachMutationObservers();
            }));
        }
    };
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    NgxVScrollComponent.prototype.handleItemChange = /**
     * @private
     * @param {?} change
     * @return {?}
     */
    function (change) {
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
    };
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    NgxVScrollComponent.prototype.handleAddChange = /**
     * @private
     * @param {?} change
     * @return {?}
     */
    function (change) {
        var _a;
        var _this = this;
        // Get the user's current scroll position
        /** @type {?} */
        var scrollPosition = this.scrollParentDiv.scrollTop;
        // Render the new added items to end on the viewport, this will
        // perform optimization when re-rendering them to it's orginal position
        /** @type {?} */
        var addedItems = change.diff.map((/**
         * @param {?} diff
         * @return {?}
         */
        function (diff) { return diff.value; }));
        (_a = this.clonedViewportItems).push.apply(_a, __spread(addedItems));
        this.setViewportItems(this.clonedViewportItems);
        // Wait a tick for angular to render them
        setTimeout((/**
         * @return {?}
         */
        function () {
            // Get rendered item and update item meta
            /** @type {?} */
            var renderedElement = _this.getHtmlElements();
            _this.scrollerService.processItemMetaForAdd(change.diff, renderedElement, _this.itemMeta);
            // Update viewport back to it's original items;
            /** @type {?} */
            var items = _this.items.slice(_this.lastStartIndex, _this.lastCount);
            _this.setViewportItems(items);
            _this.setScrollHeight();
            // Wait a tick for angular to re-render the added items to it's
            // original position and scroll back to user original scroll position
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.scrollParentDiv.scrollTo({ top: scrollPosition });
            }));
        }));
    };
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    NgxVScrollComponent.prototype.handleUpdateChange = /**
     * @private
     * @param {?} change
     * @return {?}
     */
    function (change) {
        var _a;
        var _this = this;
        // Get the user's current scroll position
        /** @type {?} */
        var scrollPosition = this.scrollParentDiv.scrollTop;
        // Find the change that are outside the viewport
        /** @type {?} */
        var updatedItemsOutsideViewport = change.diff
            .filter((/**
         * @param {?} diff
         * @return {?}
         */
        function (diff) { return !(diff.index <= _this.lastCount && diff.index >= _this.lastStartIndex); }));
        if (updatedItemsOutsideViewport.length) {
            // Render the items that are outside viewport, this will
            // perform optimization when re-rendering them to it's orginal position
            (_a = this.clonedViewportItems).push.apply(_a, __spread(updatedItemsOutsideViewport.map((/**
             * @param {?} diff
             * @return {?}
             */
            function (diff) { return diff.value; }))));
            this.setViewportItems(this.clonedViewportItems);
            // Wait a tick for angular to render them
            setTimeout((/**
             * @return {?}
             */
            function () {
                // Get rendered element and adjust item meta accordingly
                /** @type {?} */
                var renderedElements = _this.getHtmlElements();
                _this.scrollerService.processItemMetaForUpdate(updatedItemsOutsideViewport, renderedElements, _this.itemMeta);
                // Rerender the original items
                /** @type {?} */
                var items = _this.items.slice(_this.lastStartIndex, _this.lastCount);
                _this.setViewportItems(items);
                _this.setScrollHeight();
                // Wait a tick for angular to re-render the added items to it's
                // original position and scroll back to user original scroll position
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.scrollParentDiv.scrollTo({ top: scrollPosition });
                }));
            }));
        }
        else {
            /** @type {?} */
            var updatedItemsOnViewport_1 = change.diff
                .filter((/**
             * @param {?} diff
             * @return {?}
             */
            function (diff) { return diff.index <= _this.lastCount && diff.index >= _this.lastStartIndex; }));
            // Rerender the original items
            /** @type {?} */
            var items = this.items.slice(this.lastStartIndex, this.lastCount);
            this.setViewportItems(items);
            // Wait a tick for angular to render them
            setTimeout((/**
             * @return {?}
             */
            function () {
                // Get rendered element and adjust item meta accordingly
                /** @type {?} */
                var renderedElements = _this.getHtmlElements();
                _this.scrollerService.processItemMetaForUpdate(updatedItemsOnViewport_1, renderedElements, _this.itemMeta);
                _this.setScrollHeight();
                // Wait a tick for angular to re-render the added items to it's
                // original position and scroll back to user original scroll position
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.scrollParentDiv.scrollTo({ top: scrollPosition });
                }));
            }));
        }
    };
    /**
     * @private
     * @param {?} change
     * @return {?}
     */
    NgxVScrollComponent.prototype.handleRemoveChange = /**
     * @private
     * @param {?} change
     * @return {?}
     */
    function (change) {
        var _this = this;
        // Get the user's current scroll position
        /** @type {?} */
        var scrollPosition = this.scrollParentDiv.scrollTop;
        // Update the item meta of the items that are removed
        this.scrollerService.processItemMetaForRemove(change.diff, this.itemMeta);
        // Update viewport
        /** @type {?} */
        var items = this.items.slice(this.lastStartIndex, this.lastCount);
        this.setViewportItems(items);
        this.setScrollHeight();
        // Wait a Tick for new Items to be rendered
        setTimeout((/**
         * @return {?}
         */
        function () {
            // Now set the scroll to it's previous position before the change
            _this.scrollParentDiv.scrollTo({ top: scrollPosition });
        }));
    };
    /**
     * @private
     * @param {?} position
     * @return {?}
     */
    NgxVScrollComponent.prototype.updateOffsetYPosition = /**
     * @private
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.scrollItemsDiv.style.transform = "translateY(" + position + "px)";
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.attachMutationObservers = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var elements = this.getHtmlElements();
        elements.forEach((/**
         * @param {?} element
         * @param {?} index
         * @return {?}
         */
        function (element, index) {
            /** @type {?} */
            var itemIndex = _this.getItemIndex(index);
            /** @type {?} */
            var observer = new MutationObserver((/**
             * @return {?}
             */
            function () { return _this.onObserve(element, itemIndex); }));
            observer.observe(element, { subtree: true, childList: true });
            _this.mutationObservers.push(observer);
        }));
    };
    /**
     * @private
     * @param {?} element
     * @param {?} itemIndex
     * @return {?}
     */
    NgxVScrollComponent.prototype.onObserve = /**
     * @private
     * @param {?} element
     * @param {?} itemIndex
     * @return {?}
     */
    function (element, itemIndex) {
        /** @type {?} */
        var currentHeight = element.getBoundingClientRect().height;
        if (currentHeight === this.itemMeta[itemIndex].height) {
            return;
        }
        /** @type {?} */
        var adjustmentOffset = currentHeight - this.itemMeta[itemIndex].height;
        this.itemMeta[itemIndex].height = currentHeight;
        for (var index = itemIndex + 1; index < this.itemMeta.length; index++) {
            /** @type {?} */
            var itemMeta = this.itemMeta[index];
            itemMeta.offsetTop += adjustmentOffset;
        }
        this.setScrollHeight();
    };
    /**
     * @private
     * @return {?}
     */
    NgxVScrollComponent.prototype.deattachMutationObserver = /**
     * @private
     * @return {?}
     */
    function () {
        this.mutationObservers.forEach((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            observer.disconnect();
        }));
        this.mutationObservers = [];
    };
    NgxVScrollComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-vscroll',
                    template: "<div #scrollParent class=\"scroll-parent\" (scroll)=\"onScroll();\">\n  <div #scrollItems class=\"scroll-items\">\n    <ng-content></ng-content>\n  </div>\n  <div class=\"scroll-size\" [style.height.px]=\"scrollHeight\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: [".vscroll-scroll-parent{height:100%;overflow:auto;position:relative;scroll-behavior:smooth}.vscroll-scroll-items{position:relative}.vscroll-scroll-size{position:absolute;top:0;left:0;width:100%;opacity:0;z-index:-1}ngx-vscroll{display:block}"]
                }] }
    ];
    /** @nocollapse */
    NgxVScrollComponent.ctorParameters = function () { return [
        { type: NgxVScrollService }
    ]; };
    NgxVScrollComponent.propDecorators = {
        viewportItems: [{ type: Output }],
        scrollEnd: [{ type: Output }],
        items: [{ type: Input }],
        buffer: [{ type: Input }],
        trackBy: [{ type: Input }],
        scrollParentElementRef: [{ type: ViewChild, args: ['scrollParent', { static: false },] }],
        scrollItemsElementRef: [{ type: ViewChild, args: ['scrollItems', { static: false },] }]
    };
    return NgxVScrollComponent;
}());
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
var NgxVScrollModule = /** @class */ (function () {
    function NgxVScrollModule() {
    }
    NgxVScrollModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgxVScrollComponent],
                    imports: [],
                    exports: [NgxVScrollComponent]
                },] }
    ];
    return NgxVScrollModule;
}());

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
