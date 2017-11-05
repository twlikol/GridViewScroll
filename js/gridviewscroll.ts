
export class GridViewScrollOptions {
    elementID: string;
    width: number;
    height: number;
    freezeColumn: boolean;
}

export class GridViewScroll {

    private GridID: string;
    private Width: number;
    private Height: number;

    private ContentGrid: HTMLTableElement;
    private ContentGridHeaderRow: HTMLTableRowElement;
    private ContentGridItemRow: HTMLTableRowElement;

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

    private ScrollbarWidth: number;

    private IsVerticalScrollbarEnabled: boolean; // 垂直卷軸
    private IsHorizontalScrollbarEnabled: boolean; // 水平卷軸

    private FreezeColumn: boolean;

    constructor(options: GridViewScrollOptions) {
        this.initializeOptions(options);
    }

    private initializeOptions(options: GridViewScrollOptions) {
        this.GridID = options.elementID;

        this.Width = options.width;
        this.Height = options.height;

        this.FreezeColumn = options.freezeColumn;

        this.IsVerticalScrollbarEnabled = false;
        this.IsHorizontalScrollbarEnabled = false;
    }

    enhance() : void {
        this.ContentGrid = <HTMLTableElement>document.getElementById(this.GridID);
        this.ContentGridHeaderRow = this.ContentGrid.rows.item(0);
        this.ContentGridItemRow = this.ContentGrid.rows.item(1);

        if (this.ContentGrid.rows.length < 2) return;

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

        if ((this.Header.offsetHeight + this.ContentFixed.offsetHeight) < this.Height) {
            this.IsVerticalScrollbarEnabled = false;
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

        var self = this;

        this.ContentFixed.onscroll = function (event: UIEvent) {
            self.HeaderFixed.scrollLeft = self.ContentFixed.scrollLeft;

            if(self.ContentFreeze != null)
                self.ContentFreeze.scrollTop = self.ContentFixed.scrollTop;
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

        for (var i = 0; i < this.ContentGrid.rows.length; i++) {
            let gridItemRow = this.ContentGrid.rows.item(i);

            let cgridItemRow = gridItemRow.cloneNode(false);
            let cgridItemCell = gridItemRow.cells.item(0).cloneNode(true);

            cgridItemRow.appendChild(cgridItemCell);

            this.ContentFreeze.appendChild(cgridItemRow);
        }

        this.ContentFreeze.style.height = String(this.Height - this.Header.offsetHeight - this.ScrollbarWidth) + "px";
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
}