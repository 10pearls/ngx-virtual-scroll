/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ChangeOperation } from './ngx-vscroll.enum';
import { NgxVScrollService } from './ngx-vscroll.service';
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
        (_a = this.clonedViewportItems).push.apply(_a, tslib_1.__spread(addedItems));
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
            (_a = this.clonedViewportItems).push.apply(_a, tslib_1.__spread(updatedItemsOutsideViewport.map((/**
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
export { NgxVScrollComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXZzY3JvbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXZzY3JvbGwvIiwic291cmNlcyI6WyJsaWIvbmd4LXZzY3JvbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBVSxNQUFNLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFDOUMsU0FBUyxFQUFFLFVBQVUsRUFBNEIsaUJBQWlCLEVBQ25FLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQUUxRDtJQVFFLDZCQUNVLGVBQXFDO1FBQXJDLG9CQUFlLEdBQWYsZUFBZSxDQUFzQjtRQUtyQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDeEMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFKNUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFvQkQsc0JBQUksZ0RBQWU7Ozs7UUFBbkI7WUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDO1FBQ2xGLENBQUM7OztPQUFBO0lBR0Qsc0JBQUksK0NBQWM7Ozs7UUFBbEI7WUFDRSxPQUFPLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDO1FBQ2hGLENBQUM7OztPQUFBOzs7O0lBRUQsc0NBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO1NBQ3BHO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzdD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b250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgT25Jbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5wdXQsXG4gIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEl0ZW1NZXRhLCBJdGVtQ2hhbmdlLCBTY3JvbGxUb09wdGlvbnMgfSBmcm9tICcuL25neC12c2Nyb2xsLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDaGFuZ2VPcGVyYXRpb24gfSBmcm9tICcuL25neC12c2Nyb2xsLmVudW0nO1xuaW1wb3J0IHsgTmd4VlNjcm9sbFNlcnZpY2UgfSBmcm9tICcuL25neC12c2Nyb2xsLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtdnNjcm9sbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtdnNjcm9sbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC12c2Nyb2xsLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTmd4VlNjcm9sbENvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHNjcm9sbGVyU2VydmljZTogTmd4VlNjcm9sbFNlcnZpY2U8VD5cbiAgKSB7XG4gICAgdGhpcy5zZXREZWZhdWx0cygpO1xuICB9XG5cbiAgQE91dHB1dCgpIHZpZXdwb3J0SXRlbXMgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oKTtcbiAgQE91dHB1dCgpIHNjcm9sbEVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8VFtdPigpO1xuXG4gIEBJbnB1dCgpIGl0ZW1zOiBUW107XG4gIEBJbnB1dCgpIGJ1ZmZlcjogbnVtYmVyO1xuICBASW5wdXQoKSB0cmFja0J5OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBjbG9uZWRWaWV3cG9ydEl0ZW1zOiBUW107XG4gIHByaXZhdGUgaXRlbU1ldGE6IEl0ZW1NZXRhPFQ+W107XG4gIHByaXZhdGUgbWF4WU9mZnNldDogbnVtYmVyO1xuICBwcml2YXRlIGxhc3RTdGFydEluZGV4OiBudW1iZXI7XG4gIHByaXZhdGUgbGFzdENvdW50OiBudW1iZXI7XG4gIHByaXZhdGUgbXV0YXRpb25PYnNlcnZlcnM6IE11dGF0aW9uT2JzZXJ2ZXJbXTtcbiAgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7XG4gIHByaXZhdGUgaXNTY3JvbGxpbmc7XG4gIHByaXZhdGUgaXNTY3JvbGxpbmdFdmVudDtcblxuICBAVmlld0NoaWxkKCdzY3JvbGxQYXJlbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgc2Nyb2xsUGFyZW50RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIGdldCBzY3JvbGxQYXJlbnREaXYoKTogSFRNTERpdkVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbFBhcmVudEVsZW1lbnRSZWYgJiYgdGhpcy5zY3JvbGxQYXJlbnRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBAVmlld0NoaWxkKCdzY3JvbGxJdGVtcycsIHsgc3RhdGljOiBmYWxzZSB9KSBzY3JvbGxJdGVtc0VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBnZXQgc2Nyb2xsSXRlbXNEaXYoKTogSFRNTERpdkVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbEl0ZW1zRWxlbWVudFJlZiAmJiB0aGlzLnNjcm9sbEl0ZW1zRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnRyYWNrQnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSXRlbUtleSBtdXN0IGJlIHNldCB0byBkZXRlcm1pbmUgdGhlIGNoYW5nZXMgYW5kIGNhbGN1bGF0aW9ucyBvZiBzY3JvbGwgb2Zmc2V0cycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjcm9sbGVyU2VydmljZS50cmFja0J5ID0gdGhpcy50cmFja0J5O1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBpdGVtc0NoYW5nZSA9IGNoYW5nZXMuaXRlbXM7XG4gICAgaWYgKGl0ZW1zQ2hhbmdlKSB7XG4gICAgICBpZiAoaXRlbXNDaGFuZ2UuZmlyc3RDaGFuZ2UgfHwgKGl0ZW1zQ2hhbmdlLnByZXZpb3VzVmFsdWUgYXMgW10pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmluaXRpYWxSZW5kZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNoYW5nZURhdGEgPSB0aGlzLnNjcm9sbGVyU2VydmljZS5vbkl0ZW1DaGFuZ2UoXG4gICAgICAgICAgaXRlbXNDaGFuZ2UucHJldmlvdXNWYWx1ZSxcbiAgICAgICAgICBpdGVtc0NoYW5nZS5jdXJyZW50VmFsdWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ2hhbmdlKGNoYW5nZURhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvKG9wdGlvbnM6IFNjcm9sbFRvT3B0aW9ucykge1xuICAgIGNvbnN0IHRvcCA9IG9wdGlvbnMub2Zmc2V0VG9wIHx8IHRoaXMuaXRlbU1ldGFbb3B0aW9ucy5pbmRleF0ub2Zmc2V0VG9wO1xuICAgIHRoaXMuc2Nyb2xsUGFyZW50RGl2LnNjcm9sbFRvKHsgdG9wIH0pO1xuICB9XG5cbiAgZ2V0SXRlbUluZGV4KHZpcnR1YWxJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5sYXN0U3RhcnRJbmRleCArIHZpcnR1YWxJbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RGVmYXVsdHMoKSB7XG4gICAgdGhpcy5jbG9uZWRWaWV3cG9ydEl0ZW1zID0gW107XG4gICAgdGhpcy5pdGVtTWV0YSA9IFtdO1xuICAgIHRoaXMubWF4WU9mZnNldCA9IDA7XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSAwO1xuICAgIHRoaXMuYnVmZmVyID0gMTA7XG4gICAgdGhpcy5sYXN0U3RhcnRJbmRleCA9IDA7XG4gICAgdGhpcy5sYXN0Q291bnQgPSB0aGlzLmJ1ZmZlcjtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzID0gW107XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxSZW5kZXIoKSB7XG4gICAgLy8gUmVuZGVyIGFsbCBpdGVtcyB0byBwcm9jZXNzIHRoZSBtZXRhXG4gICAgdGhpcy5zZXRWaWV3cG9ydEl0ZW1zKHRoaXMuaXRlbXMpO1xuXG4gICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmVuZGVyXG4gICAgLy8gVE9ETzogZG8gaXQgb3V0c2lkZSBhbmd1bGFyIHpvbmVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvY2Vzc0l0ZW1NZXRhKCk7XG4gICAgICB0aGlzLnNldFNjcm9sbEhlaWdodCgpO1xuICAgICAgdGhpcy5zZXRWaWV3cG9ydEl0ZW1zKHRoaXMuaXRlbXMuc2xpY2UoMCwgdGhpcy5idWZmZXIpKTtcblxuICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmVuZGVyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5hdHRhY2hNdXRhdGlvbk9ic2VydmVycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldFZpZXdwb3J0SXRlbXMoaXRlbXM6IFRbXSkge1xuICAgIHRoaXMuY2xvbmVkVmlld3BvcnRJdGVtcyA9IEFycmF5LmZyb20oaXRlbXMpO1xuICAgIHRoaXMudmlld3BvcnRJdGVtcy5lbWl0KGl0ZW1zKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc0l0ZW1NZXRhKCkge1xuICAgIGNvbnN0IGh0bWxFbGVtZW50cyA9IHRoaXMuZ2V0SHRtbEVsZW1lbnRzKCk7XG4gICAgaHRtbEVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLml0ZW1NZXRhLnB1c2goe1xuICAgICAgICBvZmZzZXRUb3A6IGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICBoZWlnaHQ6IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxuICAgICAgICB2YWx1ZTogdGhpcy5pdGVtc1tpbmRleF1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRIdG1sRWxlbWVudHMoKSB7XG4gICAgY29uc3QgZWxlbWVudENvbGxlY3Rpb24gPSB0aGlzLnNjcm9sbEl0ZW1zRGl2LmNoaWxkTm9kZXM7XG4gICAgY29uc3QgZWxlbWVudEFycmF5ID0gQXJyYXkuZnJvbShlbGVtZW50Q29sbGVjdGlvbikgYXMgSFRNTEVsZW1lbnRbXTtcbiAgICByZXR1cm4gZWxlbWVudEFycmF5LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQubm9kZVR5cGUgPT09IDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTY3JvbGxIZWlnaHQoKSB7XG4gICAgLy8gTGFzdCBpdGVtIG9mZnNldFRvcCBpcyB0aGUgbWF4XG4gICAgY29uc3QgbGFzdEl0ZW0gPSB0aGlzLml0ZW1NZXRhW3RoaXMuaXRlbU1ldGEubGVuZ3RoIC0gMV07XG4gICAgdGhpcy5tYXhZT2Zmc2V0ID0gbGFzdEl0ZW0ub2Zmc2V0VG9wO1xuXG4gICAgLy8gVGhlIHNjcm9sbCdzIGhlaWdodCB3aXRoIGJlIHRoZSBzYW1lIGFzIHRoZSBsYXN0IGVsZW1lbnRzIG9mZnNldFRvcCBwbHVzIGl0J3MgaGVpZ2h0XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLm1heFlPZmZzZXQgKyBsYXN0SXRlbS5oZWlnaHQ7XG4gIH1cblxuXG4gIG9uU2Nyb2xsKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmlzU2Nyb2xsaW5nKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5pc1Njcm9sbGluZ0V2ZW50KTtcbiAgICB0aGlzLmlzU2Nyb2xsaW5nID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICAgIH0sIDE1KTtcbiAgICB0aGlzLmlzU2Nyb2xsaW5nRXZlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsRW5kLmVtaXQoKTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIC8vIEdldCB0aGUgdXNlcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUb3A7XG5cbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBhdCB0aGUgYm90dG9tIG9mIHRoZSBsaXN0IHRoZW4gZG9uJ3QgZG8gYW55dGhpbmcgZWxzZVxuICAgIC8vIGFuZCBuc3VyZSB0aGUgb2Zmc2V0IGRvZXMgbm90IGV4Y2VlZCB0aGUgc2Nyb2xsLXNpemUgaGVpZ2h0XG4gICAgaWYgKHNjcm9sbFBvc2l0aW9uID49IHRoaXMubWF4WU9mZnNldCkge1xuICAgICAgdGhpcy51cGRhdGVPZmZzZXRZUG9zaXRpb24odGhpcy5tYXhZT2Zmc2V0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IHJvdyB0byBvdXIgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cbiAgICBjb25zdCBjbG9zZXN0Um93SW5kZXggPSB0aGlzLnNjcm9sbGVyU2VydmljZS5nZXRDbG9zZXN0SXRlbUluZGV4KHNjcm9sbFBvc2l0aW9uLCB0aGlzLml0ZW1NZXRhKTtcblxuICAgIC8vIEZpbmQgdGhlIHJvd3MgdGhhdCB3ZSBuZWVkIHRvIHJlbmRlciB1c2luZyB0aGUgYnVmZmVyXG4gICAgY29uc3Qgdmlld3BvcnRNZXRhID0gdGhpcy5zY3JvbGxlclNlcnZpY2UuZ2V0Vmlld3BvcnRNZXRhKGNsb3Nlc3RSb3dJbmRleCwgdGhpcy5idWZmZXIsIHRoaXMuaXRlbU1ldGEpO1xuXG4gICAgaWYgKHZpZXdwb3J0TWV0YS5zdGFydEluZGV4ICE9PSB0aGlzLmxhc3RTdGFydEluZGV4IHx8IHZpZXdwb3J0TWV0YS5jb3VudCAhPT0gdGhpcy5sYXN0Q291bnQpIHtcbiAgICAgIHRoaXMubGFzdFN0YXJ0SW5kZXggPSB2aWV3cG9ydE1ldGEuc3RhcnRJbmRleDtcbiAgICAgIHRoaXMubGFzdENvdW50ID0gdmlld3BvcnRNZXRhLmNvdW50O1xuXG4gICAgICB0aGlzLmRlYXR0YWNoTXV0YXRpb25PYnNlcnZlcigpO1xuXG4gICAgICAvLyAvLyBHZXQgbmV3IHZpZXdwb3J0IGl0ZW0gYWNjIHRvIHN0YXJ0IGFuZCBlbmQgaW5kZXhlc1xuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKHZpZXdwb3J0TWV0YS5zdGFydEluZGV4LCB2aWV3cG9ydE1ldGEuY291bnQpO1xuICAgICAgdGhpcy5zZXRWaWV3cG9ydEl0ZW1zKGl0ZW1zKTtcblxuICAgICAgLy8gQmVpbmcgdG8gdXBkYXRlIHRoZSBvZmZzZXQncyBZIHBvc2l0aW9uIG9uY2Ugd2UgaGF2ZSByZW5kZXJlZCBhdCBsZWFzdCAxMCBlbGVtZW50c1xuICAgICAgY29uc3QgdXBkYXRlUG9zaXRpb24gPSBNYXRoLm1heCgwLCBjbG9zZXN0Um93SW5kZXggLSB0aGlzLmJ1ZmZlcikgPT09IDAgPyAwIDogdGhpcy5pdGVtTWV0YVt2aWV3cG9ydE1ldGEuc3RhcnRJbmRleF0ub2Zmc2V0VG9wO1xuXG4gICAgICB0aGlzLnVwZGF0ZU9mZnNldFlQb3NpdGlvbih1cGRhdGVQb3NpdGlvbik7XG5cbiAgICAgIC8vIFdhaXQgYSB0aWNrIGZvciBhbmd1bGFyIHRvIHJlbmRlclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuYXR0YWNoTXV0YXRpb25PYnNlcnZlcnMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlSXRlbUNoYW5nZShjaGFuZ2U6IEl0ZW1DaGFuZ2U8VD4pIHtcbiAgICBzd2l0Y2ggKGNoYW5nZS5vcGVyYXRpb24pIHtcbiAgICAgIGNhc2UgQ2hhbmdlT3BlcmF0aW9uLkFERDpcbiAgICAgICAgdGhpcy5oYW5kbGVBZGRDaGFuZ2UoY2hhbmdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENoYW5nZU9wZXJhdGlvbi5VUERBVEU6XG4gICAgICAgIHRoaXMuaGFuZGxlVXBkYXRlQ2hhbmdlKGNoYW5nZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDaGFuZ2VPcGVyYXRpb24uUkVNT1ZFOlxuICAgICAgICB0aGlzLmhhbmRsZVJlbW92ZUNoYW5nZShjaGFuZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQWRkQ2hhbmdlKGNoYW5nZTogSXRlbUNoYW5nZTxUPikge1xuICAgIC8vIEdldCB0aGUgdXNlcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUb3A7XG5cbiAgICAvLyBSZW5kZXIgdGhlIG5ldyBhZGRlZCBpdGVtcyB0byBlbmQgb24gdGhlIHZpZXdwb3J0LCB0aGlzIHdpbGxcbiAgICAvLyBwZXJmb3JtIG9wdGltaXphdGlvbiB3aGVuIHJlLXJlbmRlcmluZyB0aGVtIHRvIGl0J3Mgb3JnaW5hbCBwb3NpdGlvblxuICAgIGNvbnN0IGFkZGVkSXRlbXMgPSBjaGFuZ2UuZGlmZi5tYXAoZGlmZiA9PiBkaWZmLnZhbHVlKTtcbiAgICB0aGlzLmNsb25lZFZpZXdwb3J0SXRlbXMucHVzaCguLi5hZGRlZEl0ZW1zKTtcbiAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXModGhpcy5jbG9uZWRWaWV3cG9ydEl0ZW1zKTtcblxuICAgIC8vIFdhaXQgYSB0aWNrIGZvciBhbmd1bGFyIHRvIHJlbmRlciB0aGVtXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBHZXQgcmVuZGVyZWQgaXRlbSBhbmQgdXBkYXRlIGl0ZW0gbWV0YVxuICAgICAgY29uc3QgcmVuZGVyZWRFbGVtZW50ID0gdGhpcy5nZXRIdG1sRWxlbWVudHMoKTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJTZXJ2aWNlLnByb2Nlc3NJdGVtTWV0YUZvckFkZChjaGFuZ2UuZGlmZiwgcmVuZGVyZWRFbGVtZW50LCB0aGlzLml0ZW1NZXRhKTtcblxuICAgICAgLy8gVXBkYXRlIHZpZXdwb3J0IGJhY2sgdG8gaXQncyBvcmlnaW5hbCBpdGVtcztcbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSh0aGlzLmxhc3RTdGFydEluZGV4LCB0aGlzLmxhc3RDb3VudCk7XG4gICAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXMoaXRlbXMpO1xuICAgICAgdGhpcy5zZXRTY3JvbGxIZWlnaHQoKTtcblxuICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmUtcmVuZGVyIHRoZSBhZGRlZCBpdGVtcyB0byBpdCdzXG4gICAgICAvLyBvcmlnaW5hbCBwb3NpdGlvbiBhbmQgc2Nyb2xsIGJhY2sgdG8gdXNlciBvcmlnaW5hbCBzY3JvbGwgcG9zaXRpb25cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUbyh7IHRvcDogc2Nyb2xsUG9zaXRpb24gfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlVXBkYXRlQ2hhbmdlKGNoYW5nZTogSXRlbUNoYW5nZTxUPikge1xuICAgIC8vIEdldCB0aGUgdXNlcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUb3A7XG5cbiAgICAvLyBGaW5kIHRoZSBjaGFuZ2UgdGhhdCBhcmUgb3V0c2lkZSB0aGUgdmlld3BvcnRcbiAgICBjb25zdCB1cGRhdGVkSXRlbXNPdXRzaWRlVmlld3BvcnQgPSBjaGFuZ2UuZGlmZlxuICAgICAgLmZpbHRlcihkaWZmID0+ICEoZGlmZi5pbmRleCA8PSB0aGlzLmxhc3RDb3VudCAmJiBkaWZmLmluZGV4ID49IHRoaXMubGFzdFN0YXJ0SW5kZXgpKTtcblxuICAgIGlmICh1cGRhdGVkSXRlbXNPdXRzaWRlVmlld3BvcnQubGVuZ3RoKSB7XG4gICAgICAvLyBSZW5kZXIgdGhlIGl0ZW1zIHRoYXQgYXJlIG91dHNpZGUgdmlld3BvcnQsIHRoaXMgd2lsbFxuICAgICAgLy8gcGVyZm9ybSBvcHRpbWl6YXRpb24gd2hlbiByZS1yZW5kZXJpbmcgdGhlbSB0byBpdCdzIG9yZ2luYWwgcG9zaXRpb25cbiAgICAgIHRoaXMuY2xvbmVkVmlld3BvcnRJdGVtcy5wdXNoKC4uLnVwZGF0ZWRJdGVtc091dHNpZGVWaWV3cG9ydC5tYXAoZGlmZiA9PiBkaWZmLnZhbHVlKSk7XG4gICAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXModGhpcy5jbG9uZWRWaWV3cG9ydEl0ZW1zKTtcblxuICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmVuZGVyIHRoZW1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBHZXQgcmVuZGVyZWQgZWxlbWVudCBhbmQgYWRqdXN0IGl0ZW0gbWV0YSBhY2NvcmRpbmdseVxuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnRzID0gdGhpcy5nZXRIdG1sRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5zY3JvbGxlclNlcnZpY2UucHJvY2Vzc0l0ZW1NZXRhRm9yVXBkYXRlKHVwZGF0ZWRJdGVtc091dHNpZGVWaWV3cG9ydCwgcmVuZGVyZWRFbGVtZW50cywgdGhpcy5pdGVtTWV0YSk7XG5cbiAgICAgICAgLy8gUmVyZW5kZXIgdGhlIG9yaWdpbmFsIGl0ZW1zXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSh0aGlzLmxhc3RTdGFydEluZGV4LCB0aGlzLmxhc3RDb3VudCk7XG4gICAgICAgIHRoaXMuc2V0Vmlld3BvcnRJdGVtcyhpdGVtcyk7XG4gICAgICAgIHRoaXMuc2V0U2Nyb2xsSGVpZ2h0KCk7XG5cbiAgICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmUtcmVuZGVyIHRoZSBhZGRlZCBpdGVtcyB0byBpdCdzXG4gICAgICAgIC8vIG9yaWdpbmFsIHBvc2l0aW9uIGFuZCBzY3JvbGwgYmFjayB0byB1c2VyIG9yaWdpbmFsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUbyh7IHRvcDogc2Nyb2xsUG9zaXRpb24gfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRJdGVtc09uVmlld3BvcnQgPSBjaGFuZ2UuZGlmZlxuICAgICAgICAuZmlsdGVyKGRpZmYgPT4gZGlmZi5pbmRleCA8PSB0aGlzLmxhc3RDb3VudCAmJiBkaWZmLmluZGV4ID49IHRoaXMubGFzdFN0YXJ0SW5kZXgpO1xuXG4gICAgICAvLyBSZXJlbmRlciB0aGUgb3JpZ2luYWwgaXRlbXNcbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSh0aGlzLmxhc3RTdGFydEluZGV4LCB0aGlzLmxhc3RDb3VudCk7XG4gICAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXMoaXRlbXMpO1xuXG4gICAgICAvLyBXYWl0IGEgdGljayBmb3IgYW5ndWxhciB0byByZW5kZXIgdGhlbVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIEdldCByZW5kZXJlZCBlbGVtZW50IGFuZCBhZGp1c3QgaXRlbSBtZXRhIGFjY29yZGluZ2x5XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudHMgPSB0aGlzLmdldEh0bWxFbGVtZW50cygpO1xuICAgICAgICB0aGlzLnNjcm9sbGVyU2VydmljZS5wcm9jZXNzSXRlbU1ldGFGb3JVcGRhdGUodXBkYXRlZEl0ZW1zT25WaWV3cG9ydCwgcmVuZGVyZWRFbGVtZW50cywgdGhpcy5pdGVtTWV0YSk7XG5cbiAgICAgICAgdGhpcy5zZXRTY3JvbGxIZWlnaHQoKTtcblxuICAgICAgICAvLyBXYWl0IGEgdGljayBmb3IgYW5ndWxhciB0byByZS1yZW5kZXIgdGhlIGFkZGVkIGl0ZW1zIHRvIGl0J3NcbiAgICAgICAgLy8gb3JpZ2luYWwgcG9zaXRpb24gYW5kIHNjcm9sbCBiYWNrIHRvIHVzZXIgb3JpZ2luYWwgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsUGFyZW50RGl2LnNjcm9sbFRvKHsgdG9wOiBzY3JvbGxQb3NpdGlvbiB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVJlbW92ZUNoYW5nZShjaGFuZ2U6IEl0ZW1DaGFuZ2U8VD4pIHtcbiAgICAvLyBHZXQgdGhlIHVzZXIncyBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxuICAgIGNvbnN0IHNjcm9sbFBvc2l0aW9uID0gdGhpcy5zY3JvbGxQYXJlbnREaXYuc2Nyb2xsVG9wO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBpdGVtIG1ldGEgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIHJlbW92ZWRcbiAgICB0aGlzLnNjcm9sbGVyU2VydmljZS5wcm9jZXNzSXRlbU1ldGFGb3JSZW1vdmUoY2hhbmdlLmRpZmYsIHRoaXMuaXRlbU1ldGEpO1xuXG4gICAgLy8gVXBkYXRlIHZpZXdwb3J0XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKHRoaXMubGFzdFN0YXJ0SW5kZXgsIHRoaXMubGFzdENvdW50KTtcbiAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXMoaXRlbXMpO1xuICAgIHRoaXMuc2V0U2Nyb2xsSGVpZ2h0KCk7XG5cbiAgICAvLyBXYWl0IGEgVGljayBmb3IgbmV3IEl0ZW1zIHRvIGJlIHJlbmRlcmVkXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBOb3cgc2V0IHRoZSBzY3JvbGwgdG8gaXQncyBwcmV2aW91cyBwb3NpdGlvbiBiZWZvcmUgdGhlIGNoYW5nZVxuICAgICAgdGhpcy5zY3JvbGxQYXJlbnREaXYuc2Nyb2xsVG8oeyB0b3A6IHNjcm9sbFBvc2l0aW9uIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVPZmZzZXRZUG9zaXRpb24ocG9zaXRpb246IG51bWJlcikge1xuICAgIHRoaXMuc2Nyb2xsSXRlbXNEaXYuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHtwb3NpdGlvbn1weClgO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hNdXRhdGlvbk9ic2VydmVycygpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuZ2V0SHRtbEVsZW1lbnRzKCk7XG4gICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1JbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGluZGV4KTtcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4gdGhpcy5vbk9ic2VydmUoZWxlbWVudCwgaXRlbUluZGV4KSk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsXG4gICAgICAgIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25PYnNlcnZlKGVsZW1lbnQ6IEVsZW1lbnQsIGl0ZW1JbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgY3VycmVudEhlaWdodCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIGlmIChjdXJyZW50SGVpZ2h0ID09PSB0aGlzLml0ZW1NZXRhW2l0ZW1JbmRleF0uaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWRqdXN0bWVudE9mZnNldCA9IGN1cnJlbnRIZWlnaHQgLSB0aGlzLml0ZW1NZXRhW2l0ZW1JbmRleF0uaGVpZ2h0O1xuICAgIHRoaXMuaXRlbU1ldGFbaXRlbUluZGV4XS5oZWlnaHQgPSBjdXJyZW50SGVpZ2h0O1xuICAgIGZvciAobGV0IGluZGV4ID0gaXRlbUluZGV4ICsgMTsgaW5kZXggPCB0aGlzLml0ZW1NZXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaXRlbU1ldGEgPSB0aGlzLml0ZW1NZXRhW2luZGV4XTtcbiAgICAgIGl0ZW1NZXRhLm9mZnNldFRvcCArPSBhZGp1c3RtZW50T2Zmc2V0O1xuICAgIH1cbiAgICB0aGlzLnNldFNjcm9sbEhlaWdodCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWF0dGFjaE11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzID0gW107XG4gIH1cblxufVxuIl19