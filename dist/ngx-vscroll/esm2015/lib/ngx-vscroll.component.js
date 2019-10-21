/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ChangeOperation } from './ngx-vscroll.enum';
import { NgxVScrollService } from './ngx-vscroll.service';
/**
 * @template T
 */
export class NgxVScrollComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXZzY3JvbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXZzY3JvbGwvIiwic291cmNlcyI6WyJsaWIvbmd4LXZzY3JvbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFVLE1BQU0sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUM5QyxTQUFTLEVBQUUsVUFBVSxFQUE0QixpQkFBaUIsRUFDbkUsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7O0FBUTFELE1BQU0sT0FBTyxtQkFBbUI7Ozs7SUFFOUIsWUFDVSxlQUFxQztRQUFyQyxvQkFBZSxHQUFmLGVBQWUsQ0FBc0I7UUFLckMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3hDLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBSjVDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDOzs7O0lBb0JELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDO0lBQ2xGLENBQUM7Ozs7SUFHRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQztJQUNoRixDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUZBQWlGLENBQUMsQ0FBQztTQUNwRzthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM3QztJQUNILENBQUM7Ozs7O0lB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QUN4QixDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQzs7O1lBblZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsd1BBQTJDO2dCQUUzQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7Ozs7WUFQUSxpQkFBaUI7Ozs0QkFnQnZCLE1BQU07d0JBQ04sTUFBTTtvQkFFTixLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsS0FBSztxQ0FZTCxTQUFTLFNBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtvQ0FLM0MsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Ozs7SUF0QjNDLDRDQUFrRDs7SUFDbEQsd0NBQThDOztJQUU5QyxvQ0FBb0I7O0lBQ3BCLHFDQUF3Qjs7SUFDeEIsc0NBQXlCOzs7OztJQUV6QixrREFBaUM7Ozs7O0lBQ2pDLHVDQUFnQzs7Ozs7SUFDaEMseUNBQTJCOzs7OztJQUMzQiw2Q0FBK0I7Ozs7O0lBQy9CLHdDQUEwQjs7Ozs7SUFDMUIsZ0RBQThDOztJQUM5QywyQ0FBcUI7Ozs7O0lBQ3JCLDBDQUFvQjs7Ozs7SUFDcEIsK0NBQXlCOztJQUV6QixxREFBaUc7O0lBS2pHLG9EQUErRjs7Ozs7SUEzQjdGLDhDQUE2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgT25Jbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5wdXQsXG4gIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEl0ZW1NZXRhLCBJdGVtQ2hhbmdlLCBTY3JvbGxUb09wdGlvbnMgfSBmcm9tICcuL25neC12c2Nyb2xsLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDaGFuZ2VPcGVyYXRpb24gfSBmcm9tICcuL25neC12c2Nyb2xsLmVudW0nO1xuaW1wb3J0IHsgTmd4VlNjcm9sbFNlcnZpY2UgfSBmcm9tICcuL25neC12c2Nyb2xsLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtdnNjcm9sbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtdnNjcm9sbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC12c2Nyb2xsLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTmd4VlNjcm9sbENvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHNjcm9sbGVyU2VydmljZTogTmd4VlNjcm9sbFNlcnZpY2U8VD5cbiAgKSB7XG4gICAgdGhpcy5zZXREZWZhdWx0cygpO1xuICB9XG5cbiAgQE91dHB1dCgpIHZpZXdwb3J0SXRlbXMgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oKTtcbiAgQE91dHB1dCgpIHNjcm9sbEVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8VFtdPigpO1xuXG4gIEBJbnB1dCgpIGl0ZW1zOiBUW107XG4gIEBJbnB1dCgpIGJ1ZmZlcjogbnVtYmVyO1xuICBASW5wdXQoKSB0cmFja0J5OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBjbG9uZWRWaWV3cG9ydEl0ZW1zOiBUW107XG4gIHByaXZhdGUgaXRlbU1ldGE6IEl0ZW1NZXRhPFQ+W107XG4gIHByaXZhdGUgbWF4WU9mZnNldDogbnVtYmVyO1xuICBwcml2YXRlIGxhc3RTdGFydEluZGV4OiBudW1iZXI7XG4gIHByaXZhdGUgbGFzdENvdW50OiBudW1iZXI7XG4gIHByaXZhdGUgbXV0YXRpb25PYnNlcnZlcnM6IE11dGF0aW9uT2JzZXJ2ZXJbXTtcbiAgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7XG4gIHByaXZhdGUgaXNTY3JvbGxpbmc7XG4gIHByaXZhdGUgaXNTY3JvbGxpbmdFdmVudDtcblxuICBAVmlld0NoaWxkKCdzY3JvbGxQYXJlbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgc2Nyb2xsUGFyZW50RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIGdldCBzY3JvbGxQYXJlbnREaXYoKTogSFRNTERpdkVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbFBhcmVudEVsZW1lbnRSZWYgJiYgdGhpcy5zY3JvbGxQYXJlbnRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBAVmlld0NoaWxkKCdzY3JvbGxJdGVtcycsIHsgc3RhdGljOiBmYWxzZSB9KSBzY3JvbGxJdGVtc0VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBnZXQgc2Nyb2xsSXRlbXNEaXYoKTogSFRNTERpdkVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbEl0ZW1zRWxlbWVudFJlZiAmJiB0aGlzLnNjcm9sbEl0ZW1zRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnRyYWNrQnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSXRlbUtleSBtdXN0IGJlIHNldCB0byBkZXRlcm1pbmUgdGhlIGNoYW5nZXMgYW5kIGNhbGN1bGF0aW9ucyBvZiBzY3JvbGwgb2Zmc2V0cycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjcm9sbGVyU2VydmljZS50cmFja0J5ID0gdGhpcy50cmFja0J5O1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBpdGVtc0NoYW5nZSA9IGNoYW5nZXMuaXRlbXM7XG4gICAgaWYgKGl0ZW1zQ2hhbmdlKSB7XG4gICAgICBpZiAoaXRlbXNDaGFuZ2UuZmlyc3RDaGFuZ2UgfHwgKGl0ZW1zQ2hhbmdlLnByZXZpb3VzVmFsdWUgYXMgW10pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmluaXRpYWxSZW5kZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNoYW5nZURhdGEgPSB0aGlzLnNjcm9sbGVyU2VydmljZS5vbkl0ZW1DaGFuZ2UoXG4gICAgICAgICAgaXRlbXNDaGFuZ2UucHJldmlvdXNWYWx1ZSxcbiAgICAgICAgICBpdGVtc0NoYW5nZS5jdXJyZW50VmFsdWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ2hhbmdlKGNoYW5nZURhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvKG9wdGlvbnM6IFNjcm9sbFRvT3B0aW9ucykge1xuICAgIGNvbnN0IHRvcCA9IG9wdGlvbnMub2Zmc2V0VG9wIHx8IHRoaXMuaXRlbU1ldGFbb3B0aW9ucy5pbmRleF0ub2Zmc2V0VG9wO1xuICAgIHRoaXMuc2Nyb2xsUGFyZW50RGl2LnNjcm9sbFRvKHsgdG9wIH0pO1xuICB9XG5cbiAgZ2V0SXRlbUluZGV4KHZpcnR1YWxJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5sYXN0U3RhcnRJbmRleCArIHZpcnR1YWxJbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RGVmYXVsdHMoKSB7XG4gICAgdGhpcy5jbG9uZWRWaWV3cG9ydEl0ZW1zID0gW107XG4gICAgdGhpcy5pdGVtTWV0YSA9IFtdO1xuICAgIHRoaXMubWF4WU9mZnNldCA9IDA7XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSAwO1xuICAgIHRoaXMuYnVmZmVyID0gMTA7XG4gICAgdGhpcy5sYXN0U3RhcnRJbmRleCA9IDA7XG4gICAgdGhpcy5sYXN0Q291bnQgPSB0aGlzLmJ1ZmZlcjtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzID0gW107XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxSZW5kZXIoKSB7XG4gICAgLy8gUmVuZGVyIGFsbCBpdGVtcyB0byBwcm9jZXNzIHRoZSBtZXRhXG4gICAgdGhpcy5zZXRWaWV3cG9ydEl0ZW1zKHRoaXMuaXRlbXMpO1xuXG4gICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmVuZGVyXG4gICAgLy8gVE9ETzogZG8gaXQgb3V0c2lkZSBhbmd1bGFyIHpvbmVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvY2Vzc0l0ZW1NZXRhKCk7XG4gICAgICB0aGlzLnNldFNjcm9sbEhlaWdodCgpO1xuICAgICAgdGhpcy5zZXRWaWV3cG9ydEl0ZW1zKHRoaXMuaXRlbXMuc2xpY2UoMCwgdGhpcy5idWZmZXIpKTtcblxuICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmVuZGVyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5hdHRhY2hNdXRhdGlvbk9ic2VydmVycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldFZpZXdwb3J0SXRlbXMoaXRlbXM6IFRbXSkge1xuICAgIHRoaXMuY2xvbmVkVmlld3BvcnRJdGVtcyA9IEFycmF5LmZyb20oaXRlbXMpO1xuICAgIHRoaXMudmlld3BvcnRJdGVtcy5lbWl0KGl0ZW1zKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc0l0ZW1NZXRhKCkge1xuICAgIGNvbnN0IGh0bWxFbGVtZW50cyA9IHRoaXMuZ2V0SHRtbEVsZW1lbnRzKCk7XG4gICAgaHRtbEVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLml0ZW1NZXRhLnB1c2goe1xuICAgICAgICBvZmZzZXRUb3A6IGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICBoZWlnaHQ6IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxuICAgICAgICB2YWx1ZTogdGhpcy5pdGVtc1tpbmRleF1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRIdG1sRWxlbWVudHMoKSB7XG4gICAgY29uc3QgZWxlbWVudENvbGxlY3Rpb24gPSB0aGlzLnNjcm9sbEl0ZW1zRGl2LmNoaWxkTm9kZXM7XG4gICAgY29uc3QgZWxlbWVudEFycmF5ID0gQXJyYXkuZnJvbShlbGVtZW50Q29sbGVjdGlvbikgYXMgSFRNTEVsZW1lbnRbXTtcbiAgICByZXR1cm4gZWxlbWVudEFycmF5LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQubm9kZVR5cGUgPT09IDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTY3JvbGxIZWlnaHQoKSB7XG4gICAgLy8gTGFzdCBpdGVtIG9mZnNldFRvcCBpcyB0aGUgbWF4XG4gICAgY29uc3QgbGFzdEl0ZW0gPSB0aGlzLml0ZW1NZXRhW3RoaXMuaXRlbU1ldGEubGVuZ3RoIC0gMV07XG4gICAgdGhpcy5tYXhZT2Zmc2V0ID0gbGFzdEl0ZW0ub2Zmc2V0VG9wO1xuXG4gICAgLy8gVGhlIHNjcm9sbCdzIGhlaWdodCB3aXRoIGJlIHRoZSBzYW1lIGFzIHRoZSBsYXN0IGVsZW1lbnRzIG9mZnNldFRvcCBwbHVzIGl0J3MgaGVpZ2h0XG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLm1heFlPZmZzZXQgKyBsYXN0SXRlbS5oZWlnaHQ7XG4gIH1cblxuXG4gIG9uU2Nyb2xsKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmlzU2Nyb2xsaW5nKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5pc1Njcm9sbGluZ0V2ZW50KTtcbiAgICB0aGlzLmlzU2Nyb2xsaW5nID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICAgIH0sIDE1KTtcbiAgICB0aGlzLmlzU2Nyb2xsaW5nRXZlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsRW5kLmVtaXQoKTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIC8vIEdldCB0aGUgdXNlcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUb3A7XG5cbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBhdCB0aGUgYm90dG9tIG9mIHRoZSBsaXN0IHRoZW4gZG9uJ3QgZG8gYW55dGhpbmcgZWxzZVxuICAgIC8vIGFuZCBuc3VyZSB0aGUgb2Zmc2V0IGRvZXMgbm90IGV4Y2VlZCB0aGUgc2Nyb2xsLXNpemUgaGVpZ2h0XG4gICAgaWYgKHNjcm9sbFBvc2l0aW9uID49IHRoaXMubWF4WU9mZnNldCkge1xuICAgICAgdGhpcy51cGRhdGVPZmZzZXRZUG9zaXRpb24odGhpcy5tYXhZT2Zmc2V0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IHJvdyB0byBvdXIgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cbiAgICBjb25zdCBjbG9zZXN0Um93SW5kZXggPSB0aGlzLnNjcm9sbGVyU2VydmljZS5nZXRDbG9zZXN0SXRlbUluZGV4KHNjcm9sbFBvc2l0aW9uLCB0aGlzLml0ZW1NZXRhKTtcblxuICAgIC8vIEZpbmQgdGhlIHJvd3MgdGhhdCB3ZSBuZWVkIHRvIHJlbmRlciB1c2luZyB0aGUgYnVmZmVyXG4gICAgY29uc3Qgdmlld3BvcnRNZXRhID0gdGhpcy5zY3JvbGxlclNlcnZpY2UuZ2V0Vmlld3BvcnRNZXRhKGNsb3Nlc3RSb3dJbmRleCwgdGhpcy5idWZmZXIsIHRoaXMuaXRlbU1ldGEpO1xuXG4gICAgaWYgKHZpZXdwb3J0TWV0YS5zdGFydEluZGV4ICE9PSB0aGlzLmxhc3RTdGFydEluZGV4IHx8IHZpZXdwb3J0TWV0YS5jb3VudCAhPT0gdGhpcy5sYXN0Q291bnQpIHtcbiAgICAgIHRoaXMubGFzdFN0YXJ0SW5kZXggPSB2aWV3cG9ydE1ldGEuc3RhcnRJbmRleDtcbiAgICAgIHRoaXMubGFzdENvdW50ID0gdmlld3BvcnRNZXRhLmNvdW50O1xuXG4gICAgICB0aGlzLmRlYXR0YWNoTXV0YXRpb25PYnNlcnZlcigpO1xuXG4gICAgICAvLyAvLyBHZXQgbmV3IHZpZXdwb3J0IGl0ZW0gYWNjIHRvIHN0YXJ0IGFuZCBlbmQgaW5kZXhlc1xuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKHZpZXdwb3J0TWV0YS5zdGFydEluZGV4LCB2aWV3cG9ydE1ldGEuY291bnQpO1xuICAgICAgdGhpcy5zZXRWaWV3cG9ydEl0ZW1zKGl0ZW1zKTtcblxuICAgICAgLy8gQmVpbmcgdG8gdXBkYXRlIHRoZSBvZmZzZXQncyBZIHBvc2l0aW9uIG9uY2Ugd2UgaGF2ZSByZW5kZXJlZCBhdCBsZWFzdCAxMCBlbGVtZW50c1xuICAgICAgY29uc3QgdXBkYXRlUG9zaXRpb24gPSBNYXRoLm1heCgwLCBjbG9zZXN0Um93SW5kZXggLSB0aGlzLmJ1ZmZlcikgPT09IDAgPyAwIDogdGhpcy5pdGVtTWV0YVt2aWV3cG9ydE1ldGEuc3RhcnRJbmRleF0ub2Zmc2V0VG9wO1xuXG4gICAgICB0aGlzLnVwZGF0ZU9mZnNldFlQb3NpdGlvbih1cGRhdGVQb3NpdGlvbik7XG5cbiAgICAgIC8vIFdhaXQgYSB0aWNrIGZvciBhbmd1bGFyIHRvIHJlbmRlclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuYXR0YWNoTXV0YXRpb25PYnNlcnZlcnMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlSXRlbUNoYW5nZShjaGFuZ2U6IEl0ZW1DaGFuZ2U8VD4pIHtcbiAgICBzd2l0Y2ggKGNoYW5nZS5vcGVyYXRpb24pIHtcbiAgICAgIGNhc2UgQ2hhbmdlT3BlcmF0aW9uLkFERDpcbiAgICAgICAgdGhpcy5oYW5kbGVBZGRDaGFuZ2UoY2hhbmdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENoYW5nZU9wZXJhdGlvbi5VUERBVEU6XG4gICAgICAgIHRoaXMuaGFuZGxlVXBkYXRlQ2hhbmdlKGNoYW5nZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDaGFuZ2VPcGVyYXRpb24uUkVNT1ZFOlxuICAgICAgICB0aGlzLmhhbmRsZVJlbW92ZUNoYW5nZShjaGFuZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQWRkQ2hhbmdlKGNoYW5nZTogSXRlbUNoYW5nZTxUPikge1xuICAgIC8vIEdldCB0aGUgdXNlcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUb3A7XG5cbiAgICAvLyBSZW5kZXIgdGhlIG5ldyBhZGRlZCBpdGVtcyB0byBlbmQgb24gdGhlIHZpZXdwb3J0LCB0aGlzIHdpbGxcbiAgICAvLyBwZXJmb3JtIG9wdGltaXphdGlvbiB3aGVuIHJlLXJlbmRlcmluZyB0aGVtIHRvIGl0J3Mgb3JnaW5hbCBwb3NpdGlvblxuICAgIGNvbnN0IGFkZGVkSXRlbXMgPSBjaGFuZ2UuZGlmZi5tYXAoZGlmZiA9PiBkaWZmLnZhbHVlKTtcbiAgICB0aGlzLmNsb25lZFZpZXdwb3J0SXRlbXMucHVzaCguLi5hZGRlZEl0ZW1zKTtcbiAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXModGhpcy5jbG9uZWRWaWV3cG9ydEl0ZW1zKTtcblxuICAgIC8vIFdhaXQgYSB0aWNrIGZvciBhbmd1bGFyIHRvIHJlbmRlciB0aGVtXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBHZXQgcmVuZGVyZWQgaXRlbSBhbmQgdXBkYXRlIGl0ZW0gbWV0YVxuICAgICAgY29uc3QgcmVuZGVyZWRFbGVtZW50ID0gdGhpcy5nZXRIdG1sRWxlbWVudHMoKTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJTZXJ2aWNlLnByb2Nlc3NJdGVtTWV0YUZvckFkZChjaGFuZ2UuZGlmZiwgcmVuZGVyZWRFbGVtZW50LCB0aGlzLml0ZW1NZXRhKTtcblxuICAgICAgLy8gVXBkYXRlIHZpZXdwb3J0IGJhY2sgdG8gaXQncyBvcmlnaW5hbCBpdGVtcztcbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSh0aGlzLmxhc3RTdGFydEluZGV4LCB0aGlzLmxhc3RDb3VudCk7XG4gICAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXMoaXRlbXMpO1xuICAgICAgdGhpcy5zZXRTY3JvbGxIZWlnaHQoKTtcblxuICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmUtcmVuZGVyIHRoZSBhZGRlZCBpdGVtcyB0byBpdCdzXG4gICAgICAvLyBvcmlnaW5hbCBwb3NpdGlvbiBhbmQgc2Nyb2xsIGJhY2sgdG8gdXNlciBvcmlnaW5hbCBzY3JvbGwgcG9zaXRpb25cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUbyh7IHRvcDogc2Nyb2xsUG9zaXRpb24gfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlVXBkYXRlQ2hhbmdlKGNoYW5nZTogSXRlbUNoYW5nZTxUPikge1xuICAgIC8vIEdldCB0aGUgdXNlcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUb3A7XG5cbiAgICAvLyBGaW5kIHRoZSBjaGFuZ2UgdGhhdCBhcmUgb3V0c2lkZSB0aGUgdmlld3BvcnRcbiAgICBjb25zdCB1cGRhdGVkSXRlbXNPdXRzaWRlVmlld3BvcnQgPSBjaGFuZ2UuZGlmZlxuICAgICAgLmZpbHRlcihkaWZmID0+ICEoZGlmZi5pbmRleCA8PSB0aGlzLmxhc3RDb3VudCAmJiBkaWZmLmluZGV4ID49IHRoaXMubGFzdFN0YXJ0SW5kZXgpKTtcblxuICAgIGlmICh1cGRhdGVkSXRlbXNPdXRzaWRlVmlld3BvcnQubGVuZ3RoKSB7XG4gICAgICAvLyBSZW5kZXIgdGhlIGl0ZW1zIHRoYXQgYXJlIG91dHNpZGUgdmlld3BvcnQsIHRoaXMgd2lsbFxuICAgICAgLy8gcGVyZm9ybSBvcHRpbWl6YXRpb24gd2hlbiByZS1yZW5kZXJpbmcgdGhlbSB0byBpdCdzIG9yZ2luYWwgcG9zaXRpb25cbiAgICAgIHRoaXMuY2xvbmVkVmlld3BvcnRJdGVtcy5wdXNoKC4uLnVwZGF0ZWRJdGVtc091dHNpZGVWaWV3cG9ydC5tYXAoZGlmZiA9PiBkaWZmLnZhbHVlKSk7XG4gICAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXModGhpcy5jbG9uZWRWaWV3cG9ydEl0ZW1zKTtcblxuICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmVuZGVyIHRoZW1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBHZXQgcmVuZGVyZWQgZWxlbWVudCBhbmQgYWRqdXN0IGl0ZW0gbWV0YSBhY2NvcmRpbmdseVxuICAgICAgICBjb25zdCByZW5kZXJlZEVsZW1lbnRzID0gdGhpcy5nZXRIdG1sRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5zY3JvbGxlclNlcnZpY2UucHJvY2Vzc0l0ZW1NZXRhRm9yVXBkYXRlKHVwZGF0ZWRJdGVtc091dHNpZGVWaWV3cG9ydCwgcmVuZGVyZWRFbGVtZW50cywgdGhpcy5pdGVtTWV0YSk7XG5cbiAgICAgICAgLy8gUmVyZW5kZXIgdGhlIG9yaWdpbmFsIGl0ZW1zXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSh0aGlzLmxhc3RTdGFydEluZGV4LCB0aGlzLmxhc3RDb3VudCk7XG4gICAgICAgIHRoaXMuc2V0Vmlld3BvcnRJdGVtcyhpdGVtcyk7XG4gICAgICAgIHRoaXMuc2V0U2Nyb2xsSGVpZ2h0KCk7XG5cbiAgICAgICAgLy8gV2FpdCBhIHRpY2sgZm9yIGFuZ3VsYXIgdG8gcmUtcmVuZGVyIHRoZSBhZGRlZCBpdGVtcyB0byBpdCdzXG4gICAgICAgIC8vIG9yaWdpbmFsIHBvc2l0aW9uIGFuZCBzY3JvbGwgYmFjayB0byB1c2VyIG9yaWdpbmFsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNjcm9sbFBhcmVudERpdi5zY3JvbGxUbyh7IHRvcDogc2Nyb2xsUG9zaXRpb24gfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRJdGVtc09uVmlld3BvcnQgPSBjaGFuZ2UuZGlmZlxuICAgICAgICAuZmlsdGVyKGRpZmYgPT4gZGlmZi5pbmRleCA8PSB0aGlzLmxhc3RDb3VudCAmJiBkaWZmLmluZGV4ID49IHRoaXMubGFzdFN0YXJ0SW5kZXgpO1xuXG4gICAgICAvLyBSZXJlbmRlciB0aGUgb3JpZ2luYWwgaXRlbXNcbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSh0aGlzLmxhc3RTdGFydEluZGV4LCB0aGlzLmxhc3RDb3VudCk7XG4gICAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXMoaXRlbXMpO1xuXG4gICAgICAvLyBXYWl0IGEgdGljayBmb3IgYW5ndWxhciB0byByZW5kZXIgdGhlbVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIEdldCByZW5kZXJlZCBlbGVtZW50IGFuZCBhZGp1c3QgaXRlbSBtZXRhIGFjY29yZGluZ2x5XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkRWxlbWVudHMgPSB0aGlzLmdldEh0bWxFbGVtZW50cygpO1xuICAgICAgICB0aGlzLnNjcm9sbGVyU2VydmljZS5wcm9jZXNzSXRlbU1ldGFGb3JVcGRhdGUodXBkYXRlZEl0ZW1zT25WaWV3cG9ydCwgcmVuZGVyZWRFbGVtZW50cywgdGhpcy5pdGVtTWV0YSk7XG5cbiAgICAgICAgdGhpcy5zZXRTY3JvbGxIZWlnaHQoKTtcblxuICAgICAgICAvLyBXYWl0IGEgdGljayBmb3IgYW5ndWxhciB0byByZS1yZW5kZXIgdGhlIGFkZGVkIGl0ZW1zIHRvIGl0J3NcbiAgICAgICAgLy8gb3JpZ2luYWwgcG9zaXRpb24gYW5kIHNjcm9sbCBiYWNrIHRvIHVzZXIgb3JpZ2luYWwgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsUGFyZW50RGl2LnNjcm9sbFRvKHsgdG9wOiBzY3JvbGxQb3NpdGlvbiB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVJlbW92ZUNoYW5nZShjaGFuZ2U6IEl0ZW1DaGFuZ2U8VD4pIHtcbiAgICAvLyBHZXQgdGhlIHVzZXIncyBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxuICAgIGNvbnN0IHNjcm9sbFBvc2l0aW9uID0gdGhpcy5zY3JvbGxQYXJlbnREaXYuc2Nyb2xsVG9wO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBpdGVtIG1ldGEgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIHJlbW92ZWRcbiAgICB0aGlzLnNjcm9sbGVyU2VydmljZS5wcm9jZXNzSXRlbU1ldGFGb3JSZW1vdmUoY2hhbmdlLmRpZmYsIHRoaXMuaXRlbU1ldGEpO1xuXG4gICAgLy8gVXBkYXRlIHZpZXdwb3J0XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKHRoaXMubGFzdFN0YXJ0SW5kZXgsIHRoaXMubGFzdENvdW50KTtcbiAgICB0aGlzLnNldFZpZXdwb3J0SXRlbXMoaXRlbXMpO1xuICAgIHRoaXMuc2V0U2Nyb2xsSGVpZ2h0KCk7XG5cbiAgICAvLyBXYWl0IGEgVGljayBmb3IgbmV3IEl0ZW1zIHRvIGJlIHJlbmRlcmVkXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBOb3cgc2V0IHRoZSBzY3JvbGwgdG8gaXQncyBwcmV2aW91cyBwb3NpdGlvbiBiZWZvcmUgdGhlIGNoYW5nZVxuICAgICAgdGhpcy5zY3JvbGxQYXJlbnREaXYuc2Nyb2xsVG8oeyB0b3A6IHNjcm9sbFBvc2l0aW9uIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVPZmZzZXRZUG9zaXRpb24ocG9zaXRpb246IG51bWJlcikge1xuICAgIHRoaXMuc2Nyb2xsSXRlbXNEaXYuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHtwb3NpdGlvbn1weClgO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hNdXRhdGlvbk9ic2VydmVycygpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuZ2V0SHRtbEVsZW1lbnRzKCk7XG4gICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1JbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGluZGV4KTtcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4gdGhpcy5vbk9ic2VydmUoZWxlbWVudCwgaXRlbUluZGV4KSk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsXG4gICAgICAgIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25PYnNlcnZlKGVsZW1lbnQ6IEVsZW1lbnQsIGl0ZW1JbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgY3VycmVudEhlaWdodCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIGlmIChjdXJyZW50SGVpZ2h0ID09PSB0aGlzLml0ZW1NZXRhW2l0ZW1JbmRleF0uaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWRqdXN0bWVudE9mZnNldCA9IGN1cnJlbnRIZWlnaHQgLSB0aGlzLml0ZW1NZXRhW2l0ZW1JbmRleF0uaGVpZ2h0O1xuICAgIHRoaXMuaXRlbU1ldGFbaXRlbUluZGV4XS5oZWlnaHQgPSBjdXJyZW50SGVpZ2h0O1xuICAgIGZvciAobGV0IGluZGV4ID0gaXRlbUluZGV4ICsgMTsgaW5kZXggPCB0aGlzLml0ZW1NZXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaXRlbU1ldGEgPSB0aGlzLml0ZW1NZXRhW2luZGV4XTtcbiAgICAgIGl0ZW1NZXRhLm9mZnNldFRvcCArPSBhZGp1c3RtZW50T2Zmc2V0O1xuICAgIH1cbiAgICB0aGlzLnNldFNjcm9sbEhlaWdodCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWF0dGFjaE11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzID0gW107XG4gIH1cblxufVxuIl19