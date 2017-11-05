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
            this.IsVerticalScrollbarEnabled = false;
            this.IsHorizontalScrollbarEnabled = false;
        };
        GridViewScroll.prototype.enhance = function () {
            this.Grid = document.getElementById(this.GridID);
            this.GridHeaderRow = this.Grid.rows.item(0);
            this.GridItemRow = this.Grid.rows.item(1);
            if (this.Grid.rows.length < 2)
                return;
            var parentElement = this.Grid.parentNode;
            this.Content = (document.createElement('div'));
            this.Content.id = this.GridID + "_Content";
            this.Content.style.overflow = "auto";
            this.Content = parentElement.insertBefore(this.Content, this.Grid);
            this.Grid = this.Content.appendChild(this.Grid);
            this.Content.style.width = String(this.Width) + "px";
            if (this.Grid.offsetWidth > this.Width) {
                this.IsHorizontalScrollbarEnabled = true;
            }
            if (this.Grid.offsetHeight > this.Height) {
                this.IsVerticalScrollbarEnabled = true;
            }
            this.Header = (document.createElement('div'));
            this.Header.id = this.GridID + "_Header";
            this.Header.style.backgroundColor = "#F0F0F0";
            this.HeaderContainer = (document.createElement('div'));
            this.HeaderContainer.id = this.GridID + "_Header_Container";
            this.HeaderContainer.style.overflow = "hidden";
            this.Header = parentElement.insertBefore(this.Header, this.Content);
            this.HeaderContainer = this.Header.appendChild(this.HeaderContainer);
            this.ScrollbarWidth = this.getScrollbarWidth();
            this.prepareHeader();
            this.calculateHeader();
            if ((this.Header.offsetHeight + this.Content.offsetHeight) < this.Height) {
                this.IsVerticalScrollbarEnabled = false;
            }
            this.Header.style.width = String(this.Width) + "px";
            if (this.IsVerticalScrollbarEnabled) {
                this.HeaderContainer.style.width = String(this.Width - this.ScrollbarWidth) + "px";
                if (this.IsHorizontalScrollbarEnabled) {
                    this.Content.style.width = this.HeaderContainer.style.width;
                    if (this.isRTL()) {
                        this.Content.style.paddingLeft = String(this.ScrollbarWidth) + "px";
                    }
                    else {
                        this.Content.style.paddingRight = String(this.ScrollbarWidth) + "px";
                    }
                }
                this.Content.style.height = String(this.Height - this.Header.offsetHeight) + "px";
            }
            else {
                this.HeaderContainer.style.width = this.Header.style.width;
                this.Content.style.width = this.Header.style.width;
            }
            var self = this;
            this.Content.onscroll = function (event) {
                self.HeaderContainer.scrollLeft = self.Content.scrollLeft;
            };
            this.isRTL();
        };
        GridViewScroll.prototype.prepareHeader = function () {
            this.CGrid = this.Grid.cloneNode(false);
            this.CGrid.id = this.GridID + "_Fixed";
            this.CGrid = this.HeaderContainer.appendChild(this.CGrid);
            this.CGridHeaderRow = this.GridHeaderRow.cloneNode(true);
            this.CGridHeaderRow = this.CGrid.appendChild(this.CGridHeaderRow);
            for (var i = 0; i < this.GridItemRow.cells.length; i++) {
                var gridItemCell = this.GridItemRow.cells.item(i);
                var helperElement = (document.createElement('div'));
                helperElement.className = "gridViewScrollHelper";
                while (gridItemCell.hasChildNodes()) {
                    helperElement.appendChild(gridItemCell.firstChild);
                }
                helperElement = gridItemCell.appendChild(helperElement);
                var cgridHeaderCell = this.CGridHeaderRow.cells.item(i);
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
            for (var i = 0; i < this.GridItemRow.cells.length; i++) {
                var gridItemCell = this.GridItemRow.cells.item(i);
                var helperElement = gridItemCell.firstChild;
                var helperWidth = parseInt(String(helperElement.offsetWidth));
                helperElement.style.width = helperWidth + "px";
                var cgridHeaderCell = this.CGridHeaderRow.cells.item(i);
                helperElement = cgridHeaderCell.firstChild;
                helperElement.style.width = helperWidth + "px";
            }
            this.GridHeaderRow.style.display = "none";
        };
        ;
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
                direction = window.getComputedStyle(this.Grid, null).getPropertyValue('direction');
            }
            else {
                direction = this.Grid.currentStyle.direction;
            }
            return (direction === "rtl");
        };
        return GridViewScroll;
    }());
    exports.GridViewScroll = GridViewScroll;
});
