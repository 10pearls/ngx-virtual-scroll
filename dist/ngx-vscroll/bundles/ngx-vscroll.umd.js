(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-vscroll', ['exports', '@angular/core'], factory) :
    (global = global || self, factory(global['ngx-vscroll'] = {}, global.ng.core));
}(this, function (exports, core) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        NgxVScrollService.ctorParameters = function () { return []; };
        /** @nocollapse */ NgxVScrollService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function NgxVScrollService_Factory() { return new NgxVScrollService(); }, token: NgxVScrollService, providedIn: "root" });
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
            this.viewportItems = new core.EventEmitter();
            this.scrollEnd = new core.EventEmitter();
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
            { type: core.Component, args: [{
                        selector: 'ngx-vscroll',
                        template: "<div #scrollParent class=\"scroll-parent\" (scroll)=\"onScroll();\">\n  <div #scrollItems class=\"scroll-items\">\n    <ng-content></ng-content>\n  </div>\n  <div class=\"scroll-size\" [style.height.px]=\"scrollHeight\"></div>\n</div>\n",
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".vscroll-scroll-parent{height:100%;overflow:auto;position:relative;scroll-behavior:smooth}.vscroll-scroll-items{position:relative}.vscroll-scroll-size{position:absolute;top:0;left:0;width:100%;opacity:0;z-index:-1}ngx-vscroll{display:block}"]
                    }] }
        ];
        /** @nocollapse */
        NgxVScrollComponent.ctorParameters = function () { return [
            { type: NgxVScrollService }
        ]; };
        NgxVScrollComponent.propDecorators = {
            viewportItems: [{ type: core.Output }],
            scrollEnd: [{ type: core.Output }],
            items: [{ type: core.Input }],
            buffer: [{ type: core.Input }],
            trackBy: [{ type: core.Input }],
            scrollParentElementRef: [{ type: core.ViewChild, args: ['scrollParent', { static: false },] }],
            scrollItemsElementRef: [{ type: core.ViewChild, args: ['scrollItems', { static: false },] }]
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
            { type: core.NgModule, args: [{
                        declarations: [NgxVScrollComponent],
                        imports: [],
                        exports: [NgxVScrollComponent]
                    },] }
        ];
        return NgxVScrollModule;
    }());

    exports.NgxVScrollComponent = NgxVScrollComponent;
    exports.NgxVScrollModule = NgxVScrollModule;
    exports.NgxVScrollService = NgxVScrollService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-vscroll.umd.js.map
