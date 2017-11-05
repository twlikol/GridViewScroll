
export class GridViewScrollOptions {
    elementID: string;
    width: number;
    height: number;
}

export class GridViewScroll {

    private GridID: string;
    private Width: number;
    private Height: number;

    private Grid: HTMLTableElement;
    private GridHeaderRow: HTMLTableRowElement;
    private GridItemRow: HTMLTableRowElement;

    private Header: HTMLDivElement;
    private HeaderContainer: HTMLDivElement;
    private Content: HTMLDivElement;

    private CGrid: HTMLTableElement;
    private CGridHeaderRow: HTMLTableRowElement;

    private ScrollbarWidth: number;

    private IsVerticalScrollbarEnabled: boolean; // 垂直卷軸
    private IsHorizontalScrollbarEnabled: boolean; // 水平卷軸

    constructor(options: GridViewScrollOptions) {
        this.initializeOptions(options);
    }

    private initializeOptions(options: GridViewScrollOptions) {
        this.GridID = options.elementID;

        this.Width = options.width;
        this.Height = options.height;

        this.IsVerticalScrollbarEnabled = false;
        this.IsHorizontalScrollbarEnabled = false;
    }

    enhance() : void {
        this.Grid = <HTMLTableElement>document.getElementById(this.GridID);
        this.GridHeaderRow = this.Grid.rows.item(0);
        this.GridItemRow = this.Grid.rows.item(1);

        if (this.Grid.rows.length < 2) return;

        var parentElement = this.Grid.parentNode;

        this.Content = <HTMLDivElement>(document.createElement('div'));
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

        this.Header = <HTMLDivElement>(document.createElement('div'));
        this.Header.id = this.GridID + "_Header";
        this.Header.style.backgroundColor = "#F0F0F0";

        this.HeaderContainer = <HTMLDivElement>(document.createElement('div'));
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

        this.Content.onscroll = function (event: UIEvent) {
            self.HeaderContainer.scrollLeft = self.Content.scrollLeft;
        }

        this.isRTL();
    }

    private prepareHeader() : void {
        this.CGrid = <HTMLTableElement>this.Grid.cloneNode(false);
        this.CGrid.id = this.GridID + "_Fixed";

        this.CGrid = this.HeaderContainer.appendChild(this.CGrid);

        this.CGridHeaderRow = <HTMLTableRowElement>this.GridHeaderRow.cloneNode(true);

        this.CGridHeaderRow = <HTMLTableRowElement>this.CGrid.appendChild(this.CGridHeaderRow);

        for (var i = 0; i < this.GridItemRow.cells.length; i++) {
            let gridItemCell = this.GridItemRow.cells.item(i);

            let helperElement = <HTMLDivElement>(document.createElement('div'));
            helperElement.className = "gridViewScrollHelper";

            while (gridItemCell.hasChildNodes()) {
                helperElement.appendChild(gridItemCell.firstChild);
            }

            helperElement = gridItemCell.appendChild(helperElement);

            let cgridHeaderCell = this.CGridHeaderRow.cells.item(i);

            helperElement = <HTMLDivElement>(document.createElement('div'));
            helperElement.className = "gridViewScrollHelper";

            while (cgridHeaderCell.hasChildNodes()) {
                helperElement.appendChild(cgridHeaderCell.firstChild);
            }

            helperElement = cgridHeaderCell.appendChild(helperElement);
        }
    };

    private calculateHeader(): void {
        for (var i = 0; i < this.GridItemRow.cells.length; i++) {
            let gridItemCell = this.GridItemRow.cells.item(i);

            let helperElement = <HTMLDivElement>gridItemCell.firstChild;

            let helperWidth = parseInt(String(helperElement.offsetWidth));

            helperElement.style.width = helperWidth + "px";

            let cgridHeaderCell = this.CGridHeaderRow.cells.item(i);

            helperElement = <HTMLDivElement>cgridHeaderCell.firstChild;

            helperElement.style.width = helperWidth + "px";
        }

        this.GridHeaderRow.style.display = "none";
    };

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
            direction = window.getComputedStyle(this.Grid, null).getPropertyValue('direction');
        } else {
            direction = (<any>this.Grid).currentStyle.direction;
        }
        return (direction === "rtl");
    }
}