import { ItemMeta, ViewportMeta, ItemChange, ItemDiff } from './ngx-vscroll.interface';
export declare class NgxVScrollService<T> {
    constructor();
    trackBy: string;
    getClosestItemIndex(scrollPosition: number, itemMeta: ItemMeta<T>[]): number;
    getViewportMeta(closestRowIndex: number, buffer: number, itemMeta: ItemMeta<T>[]): ViewportMeta;
    /**
     * Find out the difference of item on Add/Update/Remove
     * @param oldItems Takes previous item list
     * @param newItems Takes latest item list
     * @returns Item changes with operation
     */
    onItemChange(oldItems: T[], newItems: T[]): ItemChange<T>;
    handleItemChange(): void;
    processItemMetaForAdd(addedItems: ItemDiff<T>[], renderedElements: HTMLElement[], itemsMeta: ItemMeta<T>[]): void;
    processItemMetaForUpdate(updatedItems: ItemDiff<T>[], renderedElements: HTMLElement[], itemsMeta: ItemMeta<T>[]): void;
    processItemMetaForRemove(removedItems: ItemDiff<T>[], itemsMeta: ItemMeta<T>[]): void;
    updateIndexes(removedIndex: number, items: ItemDiff<T>[]): ItemDiff<T>[];
    /**
     * Takes 2 param array1 and array2 of type T
     * @param itemsA Takes old item for add difference and new item for added difference
     * @param itemsB Takes new item for add difference and old item for deletion difference
     * @returns ItemDiff of type T
     */
    private getItemDifference;
    private getItemDifferenceForEqualLength;
}
