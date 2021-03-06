import { OnInit, EventEmitter, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { ScrollToOptions } from './ngx-vscroll.interface';
import { NgxVScrollService } from './ngx-vscroll.service';
export declare class NgxVScrollComponent<T> implements OnInit, OnChanges {
    private scrollerService;
    constructor(scrollerService: NgxVScrollService<T>);
    viewportItems: EventEmitter<T[]>;
    scrollEnd: EventEmitter<T[]>;
    items: T[];
    buffer: number;
    trackBy: string;
    private clonedViewportItems;
    private itemMeta;
    private maxYOffset;
    private lastStartIndex;
    private lastCount;
    private mutationObservers;
    scrollHeight: number;
    private isScrolling;
    private isScrollingEvent;
    scrollParentElementRef: ElementRef<HTMLDivElement>;
    readonly scrollParentDiv: HTMLDivElement;
    scrollItemsElementRef: ElementRef<HTMLDivElement>;
    readonly scrollItemsDiv: HTMLDivElement;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    scrollTo(options: ScrollToOptions): void;
    getItemIndex(virtualIndex: number): number;
    private setDefaults;
    private initialRender;
    private setViewportItems;
    private processItemMeta;
    private getHtmlElements;
    private setScrollHeight;
    onScroll(): void;
    handleScroll(): void;
    private handleItemChange;
    private handleAddChange;
    private handleUpdateChange;
    private handleRemoveChange;
    private updateOffsetYPosition;
    private attachMutationObservers;
    private onObserve;
    private deattachMutationObserver;
}
