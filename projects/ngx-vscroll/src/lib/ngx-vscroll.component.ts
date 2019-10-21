import {
  Component, OnInit, Output, EventEmitter, Input,
  ViewChild, ElementRef, SimpleChanges, OnChanges, ViewEncapsulation
} from '@angular/core';
import { ItemMeta, ItemChange, ScrollToOptions } from './ngx-vscroll.interface';
import { ChangeOperation } from './ngx-vscroll.enum';
import { NgxVScrollService } from './ngx-vscroll.service';

@Component({
  selector: 'ngx-vscroll',
  templateUrl: './ngx-vscroll.component.html',
  styleUrls: ['./ngx-vscroll.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxVScrollComponent<T> implements OnInit, OnChanges {

  constructor(
    private scrollerService: NgxVScrollService<T>
  ) {
    this.setDefaults();
  }

  @Output() viewportItems = new EventEmitter<T[]>();
  @Output() scrollEnd = new EventEmitter<T[]>();

  @Input() items: T[];
  @Input() buffer: number;
  @Input() trackBy: string;

  private clonedViewportItems: T[];
  private itemMeta: ItemMeta<T>[];
  private maxYOffset: number;
  private lastStartIndex: number;
  private lastCount: number;
  private mutationObservers: MutationObserver[];
  scrollHeight: number;
  private isScrolling;
  private isScrollingEvent;

  @ViewChild('scrollParent', { static: false }) scrollParentElementRef: ElementRef<HTMLDivElement>;
  get scrollParentDiv(): HTMLDivElement {
    return this.scrollParentElementRef && this.scrollParentElementRef.nativeElement;
  }

  @ViewChild('scrollItems', { static: false }) scrollItemsElementRef: ElementRef<HTMLDivElement>;
  get scrollItemsDiv(): HTMLDivElement {
    return this.scrollItemsElementRef && this.scrollItemsElementRef.nativeElement;
  }

  ngOnInit() {
    if (!this.trackBy) {
      throw new Error('ItemKey must be set to determine the changes and calculations of scroll offsets');
    } else {
      this.scrollerService.trackBy = this.trackBy;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const itemsChange = changes.items;
    if (itemsChange) {
      if (itemsChange.firstChange || (itemsChange.previousValue as []).length === 0) {
        this.initialRender();
      } else {
        const changeData = this.scrollerService.onItemChange(
          itemsChange.previousValue,
          itemsChange.currentValue
        );
        this.handleItemChange(changeData);
      }
    }
  }

  scrollTo(options: ScrollToOptions) {
    const top = options.offsetTop || this.itemMeta[options.index].offsetTop;
    this.scrollParentDiv.scrollTo({ top });
  }

  getItemIndex(virtualIndex: number): number {
    return this.lastStartIndex + virtualIndex;
  }

  private setDefaults() {
    this.clonedViewportItems = [];
    this.itemMeta = [];
    this.maxYOffset = 0;
    this.scrollHeight = 0;
    this.buffer = 10;
    this.lastStartIndex = 0;
    this.lastCount = this.buffer;
    this.mutationObservers = [];
  }

  private initialRender() {
    // Render all items to process the meta
    this.setViewportItems(this.items);

    // Wait a tick for angular to render
    // TODO: do it outside angular zone
    setTimeout(() => {
      this.processItemMeta();
      this.setScrollHeight();
      this.setViewportItems(this.items.slice(0, this.buffer));

      // Wait a tick for angular to render
      setTimeout(() => {
        this.attachMutationObservers();
      });
    });
  }

  private setViewportItems(items: T[]) {
    this.clonedViewportItems = Array.from(items);
    this.viewportItems.emit(items);
  }

  private processItemMeta() {
    const htmlElements = this.getHtmlElements();
    htmlElements.forEach((element, index) => {
      this.itemMeta.push({
        offsetTop: element.offsetTop,
        height: element.getBoundingClientRect().height,
        value: this.items[index]
      });
    });
  }

  private getHtmlElements() {
    const elementCollection = this.scrollItemsDiv.childNodes;
    const elementArray = Array.from(elementCollection) as HTMLElement[];
    return elementArray.filter(element => element.nodeType === 1);
  }

  private setScrollHeight() {
    // Last item offsetTop is the max
    const lastItem = this.itemMeta[this.itemMeta.length - 1];
    this.maxYOffset = lastItem.offsetTop;

    // The scroll's height with be the same as the last elements offsetTop plus it's height
    this.scrollHeight = this.maxYOffset + lastItem.height;
  }


  onScroll() {
    clearTimeout(this.isScrolling);
    clearTimeout(this.isScrollingEvent);
    this.isScrolling = setTimeout(() => {
      this.handleScroll();
    }, 15);
    this.isScrollingEvent = setTimeout(() => {
      this.scrollEnd.emit();
    }, 200);
  }

  handleScroll() {
    // Get the user's current scroll position
    const scrollPosition = this.scrollParentDiv.scrollTop;

    // If we are already at the bottom of the list then don't do anything else
    // and nsure the offset does not exceed the scroll-size height
    if (scrollPosition >= this.maxYOffset) {
      this.updateOffsetYPosition(this.maxYOffset);
      return;
    }

    // Find the closest row to our current scroll position
    const closestRowIndex = this.scrollerService.getClosestItemIndex(scrollPosition, this.itemMeta);

    // Find the rows that we need to render using the buffer
    const viewportMeta = this.scrollerService.getViewportMeta(closestRowIndex, this.buffer, this.itemMeta);

    if (viewportMeta.startIndex !== this.lastStartIndex || viewportMeta.count !== this.lastCount) {
      this.lastStartIndex = viewportMeta.startIndex;
      this.lastCount = viewportMeta.count;

      this.deattachMutationObserver();

      // // Get new viewport item acc to start and end indexes
      const items = this.items.slice(viewportMeta.startIndex, viewportMeta.count);
      this.setViewportItems(items);

      // Being to update the offset's Y position once we have rendered at least 10 elements
      const updatePosition = Math.max(0, closestRowIndex - this.buffer) === 0 ? 0 : this.itemMeta[viewportMeta.startIndex].offsetTop;

      this.updateOffsetYPosition(updatePosition);

      // Wait a tick for angular to render
      setTimeout(() => {
        this.attachMutationObservers();
      });
    }
  }

  private handleItemChange(change: ItemChange<T>) {
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

  private handleAddChange(change: ItemChange<T>) {
    // Get the user's current scroll position
    const scrollPosition = this.scrollParentDiv.scrollTop;

    // Render the new added items to end on the viewport, this will
    // perform optimization when re-rendering them to it's orginal position
    const addedItems = change.diff.map(diff => diff.value);
    this.clonedViewportItems.push(...addedItems);
    this.setViewportItems(this.clonedViewportItems);

    // Wait a tick for angular to render them
    setTimeout(() => {
      // Get rendered item and update item meta
      const renderedElement = this.getHtmlElements();
      this.scrollerService.processItemMetaForAdd(change.diff, renderedElement, this.itemMeta);

      // Update viewport back to it's original items;
      const items = this.items.slice(this.lastStartIndex, this.lastCount);
      this.setViewportItems(items);
      this.setScrollHeight();

      // Wait a tick for angular to re-render the added items to it's
      // original position and scroll back to user original scroll position
      setTimeout(() => {
        this.scrollParentDiv.scrollTo({ top: scrollPosition });
      });
    });
  }

  private handleUpdateChange(change: ItemChange<T>) {
    // Get the user's current scroll position
    const scrollPosition = this.scrollParentDiv.scrollTop;

    // Find the change that are outside the viewport
    const updatedItemsOutsideViewport = change.diff
      .filter(diff => !(diff.index <= this.lastCount && diff.index >= this.lastStartIndex));

    if (updatedItemsOutsideViewport.length) {
      // Render the items that are outside viewport, this will
      // perform optimization when re-rendering them to it's orginal position
      this.clonedViewportItems.push(...updatedItemsOutsideViewport.map(diff => diff.value));
      this.setViewportItems(this.clonedViewportItems);

      // Wait a tick for angular to render them
      setTimeout(() => {
        // Get rendered element and adjust item meta accordingly
        const renderedElements = this.getHtmlElements();
        this.scrollerService.processItemMetaForUpdate(updatedItemsOutsideViewport, renderedElements, this.itemMeta);

        // Rerender the original items
        const items = this.items.slice(this.lastStartIndex, this.lastCount);
        this.setViewportItems(items);
        this.setScrollHeight();

        // Wait a tick for angular to re-render the added items to it's
        // original position and scroll back to user original scroll position
        setTimeout(() => {
          this.scrollParentDiv.scrollTo({ top: scrollPosition });
        });
      });
    } else {
      const updatedItemsOnViewport = change.diff
        .filter(diff => diff.index <= this.lastCount && diff.index >= this.lastStartIndex);

      // Rerender the original items
      const items = this.items.slice(this.lastStartIndex, this.lastCount);
      this.setViewportItems(items);

      // Wait a tick for angular to render them
      setTimeout(() => {
        // Get rendered element and adjust item meta accordingly
        const renderedElements = this.getHtmlElements();
        this.scrollerService.processItemMetaForUpdate(updatedItemsOnViewport, renderedElements, this.itemMeta);

        this.setScrollHeight();

        // Wait a tick for angular to re-render the added items to it's
        // original position and scroll back to user original scroll position
        setTimeout(() => {
          this.scrollParentDiv.scrollTo({ top: scrollPosition });
        });
      });
    }
  }

  private handleRemoveChange(change: ItemChange<T>) {
    // Get the user's current scroll position
    const scrollPosition = this.scrollParentDiv.scrollTop;

    // Update the item meta of the items that are removed
    this.scrollerService.processItemMetaForRemove(change.diff, this.itemMeta);

    // Update viewport
    const items = this.items.slice(this.lastStartIndex, this.lastCount);
    this.setViewportItems(items);
    this.setScrollHeight();

    // Wait a Tick for new Items to be rendered
    setTimeout(() => {
      // Now set the scroll to it's previous position before the change
      this.scrollParentDiv.scrollTo({ top: scrollPosition });
    });
  }

  private updateOffsetYPosition(position: number) {
    this.scrollItemsDiv.style.transform = `translateY(${position}px)`;
  }

  private attachMutationObservers() {
    const elements = this.getHtmlElements();
    elements.forEach((element, index) => {
      const itemIndex = this.getItemIndex(index);
      const observer = new MutationObserver(() => this.onObserve(element, itemIndex));
      observer.observe(element,
        { subtree: true, childList: true });
      this.mutationObservers.push(observer);
    });
  }

  private onObserve(element: Element, itemIndex: number) {
    const currentHeight = element.getBoundingClientRect().height;
    if (currentHeight === this.itemMeta[itemIndex].height) {
      return;
    }

    const adjustmentOffset = currentHeight - this.itemMeta[itemIndex].height;
    this.itemMeta[itemIndex].height = currentHeight;
    for (let index = itemIndex + 1; index < this.itemMeta.length; index++) {
      const itemMeta = this.itemMeta[index];
      itemMeta.offsetTop += adjustmentOffset;
    }
    this.setScrollHeight();
  }

  private deattachMutationObserver() {
    this.mutationObservers.forEach(observer => {
      observer.disconnect();
    });
    this.mutationObservers = [];
  }

}
