define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GridViewScrollOptions = /** @class */ (function () {
        function GridViewScrollOptions() {
        }
        return GridViewScrollOptions;
    }());
    exports.GridViewScrollOptions = GridViewScrollOptions;
    var GridViewScroll = /** @class */ (function () {
        function GridViewScroll(options) {
            this.initializeOptions(options);
        }
        GridViewScroll.prototype.initializeOptions = function (options) {
            this.GridID = options.elementID;
            this.Width = options.width;
            this.Height = options.height;
            this.FreezeColumn = options.freezeColumn;
            this.FreezeFooter = options.freezeFooter;
            this.FreezeColumnCssClass = options.freezeColumnCssClass;
            this.FreezeFooterCssClass = options.freezeFooterCssClass;
            this.IsVerticalScrollbarEnabled = false;
            this.IsHorizontalScrollbarEnabled = false;
        };
        GridViewScroll.prototype.enhance = function () {
            this.FreezeCellWidths = [];
            this.ContentGrid = document.getElementById(this.GridID);
            //if (this.ContentGrid.rows.length < 2) return;
            this.ContentGridHeaderRow = this.ContentGrid.rows.item(0);
            this.ContentGridItemRow = this.ContentGrid.rows.item(1);
            var footerIndex = this.ContentGrid.rows.length - 1;
            this.ContentGridFooterRow = this.ContentGrid.rows.item(footerIndex);
            var parentElement = this.ContentGrid.parentNode;
            this.Content = (document.createElement('div'));
            this.Content.id = this.GridID + "_Content";
            this.Content.style.position = "relative";
            this.Content = parentElement.insertBefore(this.Content, this.ContentGrid);
            this.ContentFixed = (document.createElement('div'));
            this.ContentFixed.id = this.GridID + "_Content_Fixed";
            this.ContentFixed.style.overflow = "auto";
            this.ContentFixed = this.Content.appendChild(this.ContentFixed);
            this.ContentGrid = this.ContentFixed.appendChild(this.ContentGrid);
            this.ContentFixed.style.width = String(this.Width) + "px";
            if (this.ContentGrid.offsetWidth > this.Width) {
                this.IsHorizontalScrollbarEnabled = true;
            }
            if (this.ContentGrid.offsetHeight > this.Height) {
                this.IsVerticalScrollbarEnabled = true;
            }
            this.Header = (document.createElement('div'));
            this.Header.id = this.GridID + "_Header";
            this.Header.style.backgroundColor = "#F0F0F0";
            this.Header.style.position = "relative";
            this.HeaderFixed = (document.createElement('div'));
            this.HeaderFixed.id = this.GridID + "_Header_Fixed";
            this.HeaderFixed.style.overflow = "hidden";
            this.Header = parentElement.insertBefore(this.Header, this.Content);
            this.HeaderFixed = this.Header.appendChild(this.HeaderFixed);
            this.ScrollbarWidth = this.getScrollbarWidth();
            this.prepareHeader();
            this.calculateHeader();
            if (this.FreezeColumn && this.IsHorizontalScrollbarEnabled) {
                this.appendFreezeHeader();
                this.appendFreezeContent();
            }
            this.Header.style.width = String(this.Width) + "px";
            if (this.IsVerticalScrollbarEnabled) {
                this.HeaderFixed.style.width = String(this.Width - this.ScrollbarWidth) + "px";
                if (this.IsHorizontalScrollbarEnabled) {
                    this.ContentFixed.style.width = this.HeaderFixed.style.width;
                    if (this.isRTL()) {
                        this.ContentFixed.style.paddingLeft = String(this.ScrollbarWidth) + "px";
                    }
                    else {
                        this.ContentFixed.style.paddingRight = String(this.ScrollbarWidth) + "px";
                    }
                }
                this.ContentFixed.style.height = String(this.Height - this.Header.offsetHeight) + "px";
            }
            else {
                this.HeaderFixed.style.width = this.Header.style.width;
                this.ContentFixed.style.width = this.Header.style.width;
            }
            if (this.FreezeFooter && this.IsVerticalScrollbarEnabled) {
                this.appendFreezeFooter();
                if (this.FreezeColumn && this.IsHorizontalScrollbarEnabled) {
                    this.appendFreezeFooterColumn();
                }
            }
            var self = this;
            this.ContentFixed.onscroll = function (event) {
                self.HeaderFixed.scrollLeft = self.ContentFixed.scrollLeft;
                if (self.ContentFreeze != null)
                    self.ContentFreeze.scrollTop = self.ContentFixed.scrollTop;
                if (self.FooterFreeze != null)
                    self.FooterFreeze.scrollLeft = self.ContentFixed.scrollLeft;
            };
        };
        GridViewScroll.prototype.prepareHeader = function () {
            this.HeaderGrid = this.ContentGrid.cloneNode(false);
            this.HeaderGrid.id = this.GridID + "_Header_Fixed_Grid";
            this.HeaderGrid = this.HeaderFixed.appendChild(this.HeaderGrid);
            this.HeaderGridHeaderRow = this.ContentGridHeaderRow.cloneNode(true);
            this.HeaderGridHeaderRow = this.HeaderGrid.appendChild(this.HeaderGridHeaderRow);
            for (var i = 0; i < this.ContentGridItemRow.cells.length; i++) {
                var gridItemCell = this.ContentGridItemRow.cells.item(i);
                var helperElement = (document.createElement('div'));
                helperElement.className = "gridViewScrollHelper";
                while (gridItemCell.hasChildNodes()) {
                    helperElement.appendChild(gridItemCell.firstChild);
                }
                helperElement = gridItemCell.appendChild(helperElement);
                var cgridHeaderCell = this.HeaderGridHeaderRow.cells.item(i);
                helperElement = (document.createElement('div'));
                helperElement.className = "gridViewScrollHelper";
                while (cgridHeaderCell.hasChildNodes()) {
                    helperElement.appendChild(cgridHeaderCell.firstChild);
                }
                helperElement = cgridHeaderCell.appendChild(helperElement);
            }
        };
        ;
        GridViewScroll.prototype.calculateHeader = function () {
            for (var i = 0; i < this.ContentGridItemRow.cells.length; i++) {
                var gridItemCell = this.ContentGridItemRow.cells.item(i);
                var helperElement = gridItemCell.firstChild;
                var helperWidth = parseInt(String(helperElement.offsetWidth));
                this.FreezeCellWidths.push(helperWidth);
                helperElement.style.width = helperWidth + "px";
                var cgridHeaderCell = this.HeaderGridHeaderRow.cells.item(i);
                helperElement = cgridHeaderCell.firstChild;
                helperElement.style.width = helperWidth + "px";
            }
            this.ContentGridHeaderRow.style.display = "none";
        };
        ;
        GridViewScroll.prototype.appendFreezeHeader = function () {
            this.HeaderFreeze = (document.createElement('div'));
            this.HeaderFreeze.id = this.GridID + "_Header_Freeze";
            this.HeaderFreeze.style.position = "absolute";
            this.HeaderFreeze.style.overflow = "hidden";
            this.HeaderFreeze.style.top = "0px";
            this.HeaderFreeze.style.left = "0px";
            this.HeaderFreeze.style.width = "";
            this.HeaderFreeze = this.Header.appendChild(this.HeaderFreeze);
            this.HeaderFreezeGrid = this.HeaderGrid.cloneNode(false);
            this.HeaderFreezeGrid.id = this.GridID + "_Header_Freeze_Grid";
            this.HeaderFreezeGrid = this.HeaderFreeze.appendChild(this.HeaderFreezeGrid);
            this.HeaderFreezeGridHeaderRow = this.HeaderGridHeaderRow.cloneNode(false);
            this.HeaderFreezeGridHeaderRow = this.HeaderFreezeGrid.appendChild(this.HeaderFreezeGridHeaderRow);
            var freezeColumn = this.HeaderGridHeaderRow.cells.item(0).cloneNode(true);
            this.HeaderFreezeGridHeaderRow.appendChild(freezeColumn);
        };
        GridViewScroll.prototype.appendFreezeContent = function () {
            this.ContentFreeze = (document.createElement('div'));
            this.ContentFreeze.id = this.GridID + "_Content_Freeze";
            this.ContentFreeze.style.position = "absolute";
            this.ContentFreeze.style.overflow = "hidden";
            this.ContentFreeze.style.top = "0px";
            this.ContentFreeze.style.left = "0px";
            this.ContentFreeze.style.width = "";
            this.ContentFreeze = this.Content.appendChild(this.ContentFreeze);
            for (var i = 0; i < this.ContentGrid.rows.length; i++) {
                var gridItemRow = this.ContentGrid.rows.item(i);
                var cgridItemRow = gridItemRow.cloneNode(false);
                var cgridItemCell = gridItemRow.cells.item(0).cloneNode(true);
                cgridItemRow.appendChild(cgridItemCell);
                if (this.FreezeColumnCssClass != null)
                    cgridItemRow.className = this.FreezeColumnCssClass;
                this.ContentFreeze.appendChild(cgridItemRow);
            }
            this.ContentFreeze.style.height = String(this.Height - this.Header.offsetHeight - this.ScrollbarWidth) + "px";
        };
        GridViewScroll.prototype.appendFreezeFooter = function () {
            this.FooterFreeze = (document.createElement('div'));
            this.FooterFreeze.id = this.GridID + "_Footer_Freeze";
            this.FooterFreeze.style.position = "absolute";
            this.FooterFreeze.style.overflow = "hidden";
            this.FooterFreeze.style.left = "0px";
            this.FooterFreeze.style.width = String(this.ContentFixed.offsetWidth - this.ScrollbarWidth) + "px";
            this.FooterFreeze = this.Content.appendChild(this.FooterFreeze);
            this.FooterFreezeGrid = this.HeaderGrid.cloneNode(false);
            this.FooterFreezeGrid.id = this.GridID + "_Footer_Freeze_Grid";
            this.FooterFreezeGrid = this.FooterFreeze.appendChild(this.FooterFreezeGrid);
            this.FooterFreezeGridHeaderRow = this.ContentGridFooterRow.cloneNode(true);
            if (this.FreezeFooterCssClass != null)
                this.FooterFreezeGridHeaderRow.className = this.FreezeFooterCssClass;
            for (var i = 0; i < this.FooterFreezeGridHeaderRow.cells.length; i++) {
                var cgridHeaderCell = this.FooterFreezeGridHeaderRow.cells.item(i);
                var helperElement = (document.createElement('div'));
                helperElement.className = "gridViewScrollHelper";
                helperElement.style.width = String(this.FreezeCellWidths[i]) + "px";
                while (cgridHeaderCell.hasChildNodes()) {
                    helperElement.appendChild(cgridHeaderCell.firstChild);
                }
                helperElement = cgridHeaderCell.appendChild(helperElement);
            }
            this.FooterFreezeGridHeaderRow = this.FooterFreezeGrid.appendChild(this.FooterFreezeGridHeaderRow);
            var footerFreezeTop = this.ContentFixed.offsetHeight - this.FooterFreeze.offsetHeight;
            if (this.IsHorizontalScrollbarEnabled) {
                footerFreezeTop -= this.ScrollbarWidth;
            }
            this.FooterFreeze.style.top = String(footerFreezeTop) + "px";
        };
        GridViewScroll.prototype.appendFreezeFooterColumn = function () {
            this.FooterFreezeColumn = (document.createElement('div'));
            this.FooterFreezeColumn.id = this.GridID + "_Footer_FreezeColumn";
            this.FooterFreezeColumn.style.position = "absolute";
            this.FooterFreezeColumn.style.overflow = "hidden";
            this.FooterFreezeColumn.style.left = "0px";
            this.FooterFreezeColumn.style.width = "";
            this.FooterFreezeColumn = this.Content.appendChild(this.FooterFreezeColumn);
            this.FooterFreezeColumnGrid = this.HeaderGrid.cloneNode(false);
            this.FooterFreezeColumnGrid.id = this.GridID + "_Footer_FreezeColumn_Grid";
            this.FooterFreezeColumnGrid = this.FooterFreezeColumn.appendChild(this.FooterFreezeColumnGrid);
            this.FooterFreezeColumnGridHeaderRow = this.FooterFreezeGridHeaderRow.cloneNode(false);
            this.FooterFreezeColumnGridHeaderRow = this.FooterFreezeColumnGrid.appendChild(this.FooterFreezeColumnGridHeaderRow);
            if (this.FreezeFooterCssClass != null)
                this.FooterFreezeColumnGridHeaderRow.className = this.FreezeFooterCssClass;
            var freezeColumn = this.FooterFreezeGridHeaderRow.cells.item(0).cloneNode(true);
            this.FooterFreezeColumnGridHeaderRow.appendChild(freezeColumn);
            var footerFreezeTop = this.ContentFixed.offsetHeight - this.FooterFreeze.offsetHeight;
            if (this.IsHorizontalScrollbarEnabled) {
                footerFreezeTop -= this.ScrollbarWidth;
            }
            this.FooterFreezeColumn.style.top = String(footerFreezeTop) + "px";
        };
        GridViewScroll.prototype.getScrollbarWidth = function () {
            var innerElement = document.createElement('p');
            innerElement.style.width = "100%";
            innerElement.style.height = "200px";
            var outerElement = document.createElement('div');
            outerElement.style.position = "absolute";
            outerElement.style.top = "0px";
            outerElement.style.left = "0px";
            outerElement.style.visibility = "hidden";
            outerElement.style.width = "200px";
            outerElement.style.height = "150px";
            outerElement.style.overflow = "hidden";
            outerElement.appendChild(innerElement);
            document.body.appendChild(outerElement);
            var innerElementWidth = innerElement.offsetWidth;
            outerElement.style.overflow = 'scroll';
            var outerElementWidth = innerElement.offsetWidth;
            if (innerElementWidth === outerElementWidth)
                outerElementWidth = outerElement.clientWidth;
            document.body.removeChild(outerElement);
            return (innerElementWidth - outerElementWidth);
        };
        GridViewScroll.prototype.isRTL = function () {
            var direction = "";
            if (window.getComputedStyle) {
                direction = window.getComputedStyle(this.ContentGrid, null).getPropertyValue('direction');
            }
            else {
                direction = this.ContentGrid.currentStyle.direction;
            }
            return (direction === "rtl");
        };
        return GridViewScroll;
    }());
    exports.GridViewScroll = GridViewScroll;
});
