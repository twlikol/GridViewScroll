
export class GridViewScrollOptions {
    elementID: string;
    width: number;
    height: number;
    freezeColumn: boolean;
    freezeFooter: boolean;
    freezeColumnCssClass: string;
    freezeFooterCssClass: string;
}

export class GridViewScroll {

    private GridID: string;
    private Width: number;
    private Height: number;

    private ContentGrid: HTMLTableElement;
    private ContentGridHeaderRow: HTMLTableRowElement;
    private ContentGridItemRow: HTMLTableRowElement;
    private ContentGridFooterRow: HTMLTableRowElement;

    private Header: HTMLDivElement;
    private HeaderFixed: HTMLDivElement;
    private Content: HTMLDivElement;
    private ContentFixed: HTMLDivElement;

    private HeaderGrid: HTMLTableElement;
    private HeaderGridHeaderRow: HTMLTableRowElement;

    private HeaderFreeze: HTMLDivElement;
    private HeaderFreezeGrid: HTMLTableElement;
    private HeaderFreezeGridHeaderRow: HTMLTableRowElement;

    private ContentFreeze: HTMLDivElement;
    private ContentFreezeGrid: HTMLTableElement;

    private FooterFreeze: HTMLDivElement;
    private FooterFreezeGrid: HTMLTableElement;
    private FooterFreezeGridHeaderRow: HTMLTableRowElement;

    private FooterFreezeColumn: HTMLDivElement;
    private FooterFreezeColumnGrid: HTMLTableElement;
    private FooterFreezeColumnGridHeaderRow: HTMLTableRowElement;

    private ScrollbarWidth: number;

    private IsVerticalScrollbarEnabled: boolean; // 垂直卷軸
    private IsHorizontalScrollbarEnabled: boolean; // 水平卷軸

    private FreezeCellWidths: Array<number>;
    private FreezeCellHeights: Array<number>;

    private FreezeColumn: boolean;
    private FreezeFooter: boolean;

    private FreezeColumnCssClass: string;
    private FreezeFooterCssClass: string;

    constructor(options: GridViewScrollOptions) {
        this.initializeOptions(options);
    }

    private initializeOptions(options: GridViewScrollOptions) {
        this.GridID = options.elementID;

        this.Width = options.width;
        this.Height = options.height;

        this.FreezeColumn = options.freezeColumn;
        this.FreezeFooter = options.freezeFooter;

        this.FreezeColumnCssClass = options.freezeColumnCssClass;
        this.FreezeFooterCssClass = options.freezeFooterCssClass;

        this.IsVerticalScrollbarEnabled = false;
        this.IsHorizontalScrollbarEnabled = false;
    }

    enhance(): void {

        this.FreezeCellWidths = [];
        this.FreezeCellHeights = [];

        this.ContentGrid = <HTMLTableElement>document.getElementById(this.GridID);

        //if (this.ContentGrid.rows.length < 2) return;

        this.ContentGridHeaderRow = this.ContentGrid.rows.item(0);
        this.ContentGridItemRow = this.ContentGrid.rows.item(1);

        let footerIndex = this.ContentGrid.rows.length - 1;

        this.ContentGridFooterRow = this.ContentGrid.rows.item(footerIndex);

        var parentElement = this.ContentGrid.parentNode;

        this.Content = <HTMLDivElement>(document.createElement('div'));
        this.Content.id = this.GridID + "_Content";
        this.Content.style.position = "relative";

        this.Content = parentElement.insertBefore(this.Content, this.ContentGrid);

        this.ContentFixed = <HTMLDivElement>(document.createElement('div'));
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

        this.Header = <HTMLDivElement>(document.createElement('div'));
        this.Header.id = this.GridID + "_Header";
        this.Header.style.backgroundColor = "#F0F0F0";
        this.Header.style.position = "relative";

        this.HeaderFixed = <HTMLDivElement>(document.createElement('div'));
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

        this.ContentFixed.onscroll = function (event: UIEvent) {
            self.HeaderFixed.scrollLeft = self.ContentFixed.scrollLeft;

            if(self.ContentFreeze != null)
                self.ContentFreeze.scrollTop = self.ContentFixed.scrollTop;

            if (self.FooterFreeze != null)
                self.FooterFreeze.scrollLeft = self.ContentFixed.scrollLeft;
        }
    }

    private prepareHeader() : void {
        this.HeaderGrid = <HTMLTableElement>this.ContentGrid.cloneNode(false);
        this.HeaderGrid.id = this.GridID + "_Header_Fixed_Grid";

        this.HeaderGrid = this.HeaderFixed.appendChild(this.HeaderGrid);

        this.HeaderGridHeaderRow = <HTMLTableRowElement>this.ContentGridHeaderRow.cloneNode(true);

        this.HeaderGridHeaderRow = <HTMLTableRowElement>this.HeaderGrid.appendChild(this.HeaderGridHeaderRow);

        for (var i = 0; i < this.ContentGridItemRow.cells.length; i++) {
            let gridItemCell = this.ContentGridItemRow.cells.item(i);

            let helperElement = <HTMLDivElement>(document.createElement('div'));
            helperElement.className = "gridViewScrollHelper";

            while (gridItemCell.hasChildNodes()) {
                helperElement.appendChild(gridItemCell.firstChild);
            }

            helperElement = gridItemCell.appendChild(helperElement);

            let cgridHeaderCell = this.HeaderGridHeaderRow.cells.item(i);

            helperElement = <HTMLDivElement>(document.createElement('div'));
            helperElement.className = "gridViewScrollHelper";

            while (cgridHeaderCell.hasChildNodes()) {
                helperElement.appendChild(cgridHeaderCell.firstChild);
            }

            helperElement = cgridHeaderCell.appendChild(helperElement);
        }
    };

    private calculateHeader(): void {
        for (var i = 0; i < this.ContentGridItemRow.cells.length; i++) {
            let gridItemCell = this.ContentGridItemRow.cells.item(i);

            let helperElement = <HTMLDivElement>gridItemCell.firstChild;

            let helperWidth = parseInt(String(helperElement.offsetWidth));

            this.FreezeCellWidths.push(helperWidth);

            helperElement.style.width = helperWidth + "px";

            let cgridHeaderCell = this.HeaderGridHeaderRow.cells.item(i);

            helperElement = <HTMLDivElement>cgridHeaderCell.firstChild;

            helperElement.style.width = helperWidth + "px";
        }

        this.ContentGridHeaderRow.style.display = "none";
    };

    private appendFreezeHeader() : void {
        this.HeaderFreeze = <HTMLDivElement>(document.createElement('div'));
        this.HeaderFreeze.id = this.GridID + "_Header_Freeze";
        this.HeaderFreeze.style.position = "absolute";
        this.HeaderFreeze.style.overflow = "hidden";
        this.HeaderFreeze.style.top = "0px";
        this.HeaderFreeze.style.left = "0px";
        this.HeaderFreeze.style.width = "";

        this.HeaderFreeze = this.Header.appendChild(this.HeaderFreeze);

        this.HeaderFreezeGrid = <HTMLTableElement>this.HeaderGrid.cloneNode(false);
        this.HeaderFreezeGrid.id = this.GridID + "_Header_Freeze_Grid";

        this.HeaderFreezeGrid = this.HeaderFreeze.appendChild(this.HeaderFreezeGrid);

        this.HeaderFreezeGridHeaderRow = <HTMLTableRowElement>this.HeaderGridHeaderRow.cloneNode(false);

        this.HeaderFreezeGridHeaderRow = <HTMLTableRowElement>this.HeaderFreezeGrid.appendChild(this.HeaderFreezeGridHeaderRow);

        let freezeColumn = this.HeaderGridHeaderRow.cells.item(0).cloneNode(true);

        this.HeaderFreezeGridHeaderRow.appendChild(freezeColumn);
    }

    private appendFreezeContent(): void {
        this.ContentFreeze = <HTMLDivElement>(document.createElement('div'));
        this.ContentFreeze.id = this.GridID + "_Content_Freeze";
        this.ContentFreeze.style.position = "absolute";
        this.ContentFreeze.style.overflow = "hidden";
        this.ContentFreeze.style.top = "0px";
        this.ContentFreeze.style.left = "0px";
        this.ContentFreeze.style.width = "";

        this.ContentFreeze = this.Content.appendChild(this.ContentFreeze);

        this.ContentFreezeGrid = <HTMLTableElement>this.HeaderGrid.cloneNode(false);
        this.ContentFreezeGrid.id = this.GridID + "_Content_Freeze_Grid";

        this.ContentFreezeGrid = this.ContentFreeze.appendChild(this.ContentFreezeGrid);

        let freezeCellHeights = [];

        for (var i = 0; i < this.ContentGrid.rows.length; i++) {
            let gridItemRow = this.ContentGrid.rows.item(i);
            let gridItemCell = gridItemRow.cells.item(0);

            let helperElement;

            if ((<HTMLElement>gridItemCell.firstChild).className == "gridViewScrollHelper") {
                helperElement = <HTMLDivElement>gridItemCell.firstChild;
            }
            else {
                helperElement = <HTMLDivElement>(document.createElement('div'));
                helperElement.className = "gridViewScrollHelper";

                while (gridItemCell.hasChildNodes()) {
                    helperElement.appendChild(gridItemCell.firstChild);
                }

                helperElement = gridItemCell.appendChild(helperElement);
            }

            let paddingTop = this.getPaddingTop(gridItemCell);
            let paddingBottom = this.getPaddingBottom(gridItemCell);

            let helperHeight = parseInt(String(gridItemCell.offsetHeight - paddingTop - paddingBottom));

            freezeCellHeights.push(helperHeight);

            let cgridItemRow = <HTMLTableRowElement>gridItemRow.cloneNode(false);
            let cgridItemCell = gridItemCell.cloneNode(true);

            cgridItemRow.appendChild(cgridItemCell);

            this.ContentFreezeGrid.appendChild(cgridItemRow);
        }

        for (var i = 0; i < this.ContentGrid.rows.length; i++) {
            let gridItemRow = this.ContentGrid.rows.item(i);
            let gridItemCell = gridItemRow.cells.item(0);

            let cgridItemRow = this.ContentFreezeGrid.rows.item(i);
            let cgridItemCell = cgridItemRow.cells.item(0);

            if (this.FreezeColumnCssClass != null)
                cgridItemRow.className = this.FreezeColumnCssClass;

            let helperElement = <HTMLDivElement>gridItemCell.firstChild;

            helperElement.style.height = String(freezeCellHeights[i]) + "px";

            helperElement = <HTMLDivElement>cgridItemCell.firstChild;

            helperElement.style.height = String(freezeCellHeights[i]) + "px";
        }

        this.ContentFreeze.style.height = String(this.Height - this.Header.offsetHeight - this.ScrollbarWidth) + "px";
    }

    private appendFreezeFooter(): void {
        this.FooterFreeze = <HTMLDivElement>(document.createElement('div'));
        this.FooterFreeze.id = this.GridID + "_Footer_Freeze";
        this.FooterFreeze.style.position = "absolute";
        this.FooterFreeze.style.overflow = "hidden";
        this.FooterFreeze.style.left = "0px";

        this.FooterFreeze.style.width = String(this.ContentFixed.offsetWidth - this.ScrollbarWidth) + "px";

        this.FooterFreeze = this.Content.appendChild(this.FooterFreeze);

        this.FooterFreezeGrid = <HTMLTableElement>this.HeaderGrid.cloneNode(false);
        this.FooterFreezeGrid.id = this.GridID + "_Footer_Freeze_Grid";

        this.FooterFreezeGrid = this.FooterFreeze.appendChild(this.FooterFreezeGrid);

        this.FooterFreezeGridHeaderRow = <HTMLTableRowElement>this.ContentGridFooterRow.cloneNode(true);

        if (this.FreezeFooterCssClass != null)
            this.FooterFreezeGridHeaderRow.className = this.FreezeFooterCssClass;

        for (var i = 0; i < this.FooterFreezeGridHeaderRow.cells.length; i++) {
            let cgridHeaderCell = this.FooterFreezeGridHeaderRow.cells.item(i);

            let helperElement = <HTMLDivElement>(document.createElement('div'));
            helperElement.className = "gridViewScrollHelper";
            helperElement.style.width = String(this.FreezeCellWidths[i]) + "px";

            while (cgridHeaderCell.hasChildNodes()) {
                helperElement.appendChild(cgridHeaderCell.firstChild);
            }

            helperElement = cgridHeaderCell.appendChild(helperElement);
        }

        this.FooterFreezeGridHeaderRow = <HTMLTableRowElement>this.FooterFreezeGrid.appendChild(this.FooterFreezeGridHeaderRow);

        let footerFreezeTop = this.ContentFixed.offsetHeight - this.FooterFreeze.offsetHeight;

        if (this.IsHorizontalScrollbarEnabled) {
            footerFreezeTop -= this.ScrollbarWidth;
        }

        this.FooterFreeze.style.top = String(footerFreezeTop) + "px";
    }

    private appendFreezeFooterColumn(): void {
        this.FooterFreezeColumn = <HTMLDivElement>(document.createElement('div'));
        this.FooterFreezeColumn.id = this.GridID + "_Footer_FreezeColumn";
        this.FooterFreezeColumn.style.position = "absolute";
        this.FooterFreezeColumn.style.overflow = "hidden";
        this.FooterFreezeColumn.style.left = "0px";
        this.FooterFreezeColumn.style.width = "";

        this.FooterFreezeColumn = this.Content.appendChild(this.FooterFreezeColumn);

        this.FooterFreezeColumnGrid = <HTMLTableElement>this.HeaderGrid.cloneNode(false);
        this.FooterFreezeColumnGrid.id = this.GridID + "_Footer_FreezeColumn_Grid";

        this.FooterFreezeColumnGrid = this.FooterFreezeColumn.appendChild(this.FooterFreezeColumnGrid);

        this.FooterFreezeColumnGridHeaderRow = <HTMLTableRowElement>this.FooterFreezeGridHeaderRow.cloneNode(false);

        this.FooterFreezeColumnGridHeaderRow = <HTMLTableRowElement>this.FooterFreezeColumnGrid.appendChild(this.FooterFreezeColumnGridHeaderRow);

        if (this.FreezeFooterCssClass != null)
            this.FooterFreezeColumnGridHeaderRow.className = this.FreezeFooterCssClass;

        let freezeColumn = this.FooterFreezeGridHeaderRow.cells.item(0).cloneNode(true);

        this.FooterFreezeColumnGridHeaderRow.appendChild(freezeColumn);

        let footerFreezeTop = this.ContentFixed.offsetHeight - this.FooterFreeze.offsetHeight;

        if (this.IsHorizontalScrollbarEnabled) {
            footerFreezeTop -= this.ScrollbarWidth;
        }

        this.FooterFreezeColumn.style.top = String(footerFreezeTop) + "px";
    }

    private getScrollbarWidth(): number {
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
        if (innerElementWidth === outerElementWidth) outerElementWidth = outerElement.clientWidth;

        document.body.removeChild(outerElement);

        return (innerElementWidth - outerElementWidth);
    }

    private isRTL(): boolean {
        let direction = "";
        if (window.getComputedStyle) {
            direction = window.getComputedStyle(this.ContentGrid, null).getPropertyValue('direction');
        } else {
            direction = (<any>this.ContentGrid).currentStyle.direction;
        }
        return (direction === "rtl");
    }

    private getPaddingTop(element: HTMLElement): number {
        let value = "";
        if (window.getComputedStyle) {
            value = window.getComputedStyle(element, null).getPropertyValue('padding-Top');
        } else {
            value = (<any>element).currentStyle.paddingTop;
        }
        return parseInt(value);
    }

    private getPaddingBottom(element: HTMLElement): number {
        let value = "";
        if (window.getComputedStyle) {
            value = window.getComputedStyle(element, null).getPropertyValue('padding-Bottom');
        } else {
            value = (<any>element).currentStyle.paddingBottom;
        }
        return parseInt(value);
    }
}