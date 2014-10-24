/*
 * GridViewScroll with jQuery v0.9.6.8
 * http://gridviewscroll.aspcity.idv.tw/

 * Copyright (c) 2012 Likol Lee
 * Released under the MIT license

 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 */
(function ($) {

    jQuery.fn.extend({

        gridviewScroll: function (options) {

            var defaults = {
                width: 500,
                height: 300,
                railcolor: "#F0F0F0",
                barcolor: "#CDCDCD",
                barhovercolor: "#606060",
                bgcolor: "#F0F0F0",
                freezesize: 0,
                arrowsize: 0,
                varrowtopimg: "",
                varrowbottomimg: "",
                harrowleftimg: "",
                harrowrightimg: "",
                headerrowcount: 1,
                railsize: 15,
                barsize: 15,
                wheelstep: 20,
                minscrollbarsize: 10,
                startVertical: 0,
                startHorizontal: 0,
                onScrollVertical: null,
                onScrollHorizontal: null,
                enabled: true,
                scrollAssociate: null,
                verticalbar: "auto",
                horizontalbar: "auto",
                wrapperAutoHeight: true,
                rowIndexElementID: ""
            };

            var opt = $.extend(defaults, options);

            function replaceFormElement(target, replaceName) {
                replaceInput(target, replaceName);
                replaceSelect(target, replaceName);
                replaceTextarea(target, replaceName);
            }

            function replaceInput(target, replaceName) {
                target.find('input').each(function () {

                    var inputtype = $(this)[0].type;

                    if (inputtype == "checkbox" || inputtype == "radio" || inputtype == "text") {

                        var replaceinput = $(this);

                        var inputid = replaceinput[0].id.replace("_Copy", "");
                        var inputname = replaceinput[0].name.replace("_Copy", "");

                        replaceinput[0].name = inputname + "_" + replaceName;
                        replaceinput[0].id = inputid + "_" + replaceName;

                        var input = $("#" + inputid);

                        switch (inputtype) {
                            case "checkbox":
                            case "radio":

                                replaceinput.off('change');

                                replaceinput.change(function () {
                                    var checked = $(this).is(':checked');
                                    input.attr('checked', checked);
                                });
                                break;

                            case "text":
                                replaceinput.change(function () {
                                    var value = $(this).val();
                                    input.val(value);
                                });
                                break;
                        }
                    }
                });
            }

            function replaceSelect(target, replaceName) {
                target.find('select').each(function () {

                    var replaceselect = $(this);

                    var selectid = replaceselect[0].id.replace("_Copy", "");
                    var selectname = replaceselect[0].name.replace("_Copy", "");

                    replaceselect[0].name = selectname + "_" + replaceName;
                    replaceselect[0].id = selectid + "_" + replaceName;

                    var select = $("#" + selectid);

                    replaceselect.off('change');

                    replaceselect.prop('selectedIndex', select[0].selectedIndex);

                    replaceselect.change(function () {
                        var index = this.selectedIndex;
                        select.prop('selectedIndex', index);
                    });
                });
            }

            function replaceTextarea(target, replaceName) {
                target.find('textarea').each(function () {

                    var replacetextarea = $(this);

                    var textareaid = replacetextarea[0].id.replace("_Copy", "");
                    var textareaname = replacetextarea[0].name.replace("_Copy", "");

                    replacetextarea[0].name = textareaname + "_" + replaceName;
                    replacetextarea[0].id = textareaid + "_" + replaceName;

                    var textarea = $("#" + textareaid);

                    replacetextarea.off('change');

                    replacetextarea.change(function () {
                        var value = $(this).val();
                        textarea.val(value);
                    });
                });
            }

            function createFreeze() {

                var freezeheadercontentid = panelheadercontent.attr("id") + "Freeze";

                calculateFreezeIndex();

                if (!document.getElementById(freezeheadercontentid)) {
                    freezeheadercontent = $(panelheadercontent[0].cloneNode(false));
                    freezeheadercontent.attr("id", freezeheadercontentid);

                    freezeheadercontent.css({
                        position: "absolute",
                        width: "",
                        height: "100%",
                        top: 0,
                        left: 0,
                        zIndex: freezeZIndex
                    });

                    var freezegridCopy = $(gridCopy[0].cloneNode(false));

                    var freezegridCopyid = freezegridCopy.attr("id") + "Freeze";
                    freezegridCopy.attr("id", freezegridCopyid);

                    freezegridCopy.css({
                        width: "",
                        height: "100%"
                    });

                    freezeheadercontent[0].appendChild(freezegridCopy[0]);

                    panelheader[0].appendChild(freezeheadercontent[0]);
                }
                else { freezeheadercontent = $("#" + freezeheadercontentid); }

                var freezegridCopy = freezeheadercontent.children().eq(0);

                while (freezegridCopy[0].hasChildNodes()) {
                    freezegridCopy[0].removeChild(freezegridCopy[0].lastChild);
                }

                var freezegridCopybody = document.createElement("TBODY");

                freezegridCopy[0].appendChild(freezegridCopybody);

                var gridCopybody = gridCopy.children().eq(0);

                var cellcount = calculateCells[0].length;

                for (var i = 0; i < opt.headerrowcount; i++) {

                    var gridrowf = gridCopybody[0].rows[i].cloneNode(false);

                    for (var j = 0; j < cellcount; j++) {

                        var value = calculateCells[i][j];

                        if (value == "RS" || value == "CS") { continue; }

                        var index = parseInt(value.split(':')[1]);

                        if (j < freezeIndex) {
                            var gridcellf = gridCopybody[0].rows[i].cells[index].cloneNode(true);

                            gridrowf.appendChild(gridcellf);
                        }
                    }

                    replaceFormElement($(gridrowf), "freezeheader");

                    freezegridCopy[0].childNodes[0].appendChild(gridrowf);
                }

                freezeheadercontent[0].style.display = "";

                var freezeitemcontentid = panelitemcontent.attr("id") + "Freeze";

                if (!document.getElementById(freezeitemcontentid)) {
                    freezeitemcontent = $(panelitemcontent[0].cloneNode(false));
                    freezeitemcontent.attr("id", freezeitemcontentid);

                    freezeitemcontent.css({
                        position: "absolute",
                        width: "",
                        top: 0,
                        left: 0,
                        zIndex: freezeZIndex,
                        display: "none"
                    });

                    var freezegrid = $(grid[0].cloneNode(false));

                    var freezegridid = freezegrid.attr("id") + "Freeze";
                    freezegrid.attr("id", freezegridid);
                    freezegrid[0].style.width = "";

                    freezeitemcontent[0].appendChild(freezegrid[0]);

                    panelitem[0].appendChild(freezeitemcontent[0]);
                }
                else {
                    freezeitemcontent = $("#" + freezeitemcontentid);

                    freezeitemcontent[0].style.height = panelitemcontent[0].style.height;
                    freezeitemcontent.scrollTop(0);
                }

                var freezegrid = freezeitemcontent.children().eq(0);

                while (freezegrid[0].hasChildNodes()) {
                    freezegrid[0].removeChild(freezegrid[0].lastChild);
                }

                var freezegridbody = document.createElement("TBODY");

                freezegrid[0].appendChild(freezegridbody);

                var rows = gridbody[0].rows.length;

                var freezeCount = freezeIndex;
                var freezeCountNext = freezeCount;
                var freezeSpan = new Array();

                for (var i = 0; i < rows; i++) {

                    var gridrowf = gridbody[0].rows[i].cloneNode(false);

                    if (i < opt.headerrowcount) {
                        gridrowf.style.display = "none";
                    }
                    else {
                        for (var j = 0; j < cellcount; j++) {

                            var gridcell = gridbody[0].rows[i].cells[j];

                            if (j < freezeCount) {

                                var rowspan = gridcell.rowSpan;
                                if (!rowspan) { rowspan = 1; } else { rowspan = parseInt(rowspan); }

                                if (rowspan != 1) {
                                    freezeCountNext--;
                                    freezeSpan[j] = rowspan;
                                }

                                var gridcellf = gridcell.cloneNode(true);

                                gridrowf.appendChild(gridcellf);
                            }
                        }

                        for (var j = 0; j < cellcount; j++) {
                            if (freezeSpan[j]) {

                                if (freezeSpan[j] > 0) {
                                    freezeSpan[j]--;

                                    if (freezeSpan[j] == 0) {
                                        freezeCountNext++;
                                    }
                                }
                            }
                        }

                        freezeCount = freezeCountNext;

                        replaceFormElement($(gridrowf), "freezeitem");

                        //gridrowf.childNodes[0].childNodes[0].style.display = "table-cell";
                        //gridrowf.childNodes[0].childNodes[0].style.verticalAlign = opt.freezeverticalalign;
                    }

                    freezegrid[0].childNodes[0].appendChild(gridrowf);
                }

                freezeitemcontent[0].style.display = "";
            }

            function calculateFreezeIndex() {

                var freezeCount = 0;
                freezeIndex = 0;

                for (var i = 0; i < calculateCells[0].length; i++) {
                    var value = calculateCells[0][i];

                    if (value == "RS" || value == "CS") {

                        freezeIndex++;
                        continue;
                    }

                    if (opt.freezesize == freezeCount) {
                        return freezeIndex;
                    }

                    freezeCount++;
                    freezeIndex++;
                }
            }

            function calculateColumnHeight() {

                gridcellsheight = new Array();

                var rows = gridbody.children().length;

                for (var i = opt.headerrowcount; i < rows; i++) {
                    var gridrow1 = gridbody[0].rows[i];
                    var gridcell = gridrow1.cells[0];

                    gridcell.style.height = "";

                    var gridcelldiv = gridcell.childNodes[0];

                    if (!gridcelldiv || gridcelldiv.className != "GridCellDiv") {
                        gridcelldiv = applayCellDiv(gridcell);
                    }
                }

                var currentRowspan = 1;

                for (var i = opt.headerrowcount; i < rows; i++) {

                    var gridrow1 = gridbody[0].rows[i];

                    var gridcell = gridrow1.cells[0];
                    var gridcelldiv = gridcell.childNodes[0];

                    var cellheight = 0;

                    if (currentRowspan == 1) {
                        var rowspan = gridcell.rowSpan;
                        if (!rowspan) { rowspan = 1; } else { rowspan = parseInt(rowspan); }

                        currentRowspan = rowspan;

                        cellheight = calculateMaxHeight(gridrow1);
                    }
                    else {
                        currentRowspan--;
                    }

                    cellheight = calculateMaxHeight(gridrow1);

                    gridcellsheight[i] = cellheight;
                }

                for (var i = opt.headerrowcount; i < rows; i++) {
                    var gridrow1 = gridbody[0].rows[i];
                    var gridcell = gridrow1.cells[0];
                    var gridcelldiv = gridcell.childNodes[0];

                    if (gridcellsheight[i] != 0) {
                        gridcell.style.height = gridcellsheight[i] + "px";
                    }
                }
            }

            function calculateMaxHeight(gridrow1) {

                var maxHeight = 0;

                var cell = gridrow1.cells[0];
                var jcell = $(cell);

                var paddingTop = parseInt(jcell.css("padding-top"));
                var paddingBottom = parseInt(jcell.css("padding-bottom"));

                maxHeight = cell.offsetHeight - paddingTop - paddingBottom;

                var cellheight = maxHeight + 0;

                return cellheight;
            }

            var mouseInterval = null;

            function createScrollbar() {

                var verticalrailid = grid.attr("id") + "VerticalRail";

                if (!document.getElementById(verticalrailid)) {
                    verticalrail = $(defaultdiv)
                        .css({
                            background: opt.railcolor,
                            width: opt.railsize + "px",
                            position: "absolute",
                            zIndex: scrollbarZIndex
                        });

                    verticalrail.attr("id", verticalrailid);

                    panelitem.append(verticalrail);

                    var verticalrailCss = { right: 0 };
                    verticalrail.css(verticalrailCss);

                    verticalrail.mousedown(function (e) {
                        clearInterval(mouseInterval);
                        var offset = $(this).offset();
                        var clickY = e.clientY - offset.top + $(document).scrollTop();
                        var minY = verticalbar.offset().top - offset.top;
                        var maxY = verticalbar.height() + minY;
                        if (clickY < minY) { scrollVertical(-1, false, true); }
                        if (clickY > maxY) { scrollVertical(1, false, true); }

                        mouseInterval = window.setInterval(function () {
                            var clickY = e.clientY - offset.top + $(document).scrollTop();
                            var minY = verticalbar.offset().top - offset.top;
                            var maxY = verticalbar.height() + minY;
                            if (clickY < minY) { scrollVertical(-1, false, true); }
                            if (clickY > maxY) { scrollVertical(1, false, true); }
                        }, 200);
                    });

                    verticalrail.mouseup(function () {
                        clearInterval(mouseInterval);
                    });

                    verticalrail.mouseout(function () {
                        clearInterval(mouseInterval);
                    });
                }
                else { verticalrail = $("#" + verticalrailid); }

                var verticalbarid = grid.attr("id") + "VerticalBar";

                if (!document.getElementById(verticalbarid)) {
                    verticalbar = $(defaultdiv)
                        .css({
                            background: opt.barcolor,
                            width: opt.barsize + "px",
                            position: "absolute",
                            zIndex: scrollbarZIndex
                        });

                    verticalbar.attr("id", verticalbarid);

                    var verticalbarCss = { right: (opt.railsize - opt.barsize) / 2 };
                    verticalbar.css(verticalbarCss);

                    panelitem.append(verticalbar);

                    verticalbar.draggable({
                        axis: 'y',
                        containment: verticalrail,
                        start: function () {
                            $(this).css({ backgroundColor: opt.barhovercolor });
                        },
                        stop: function () {
                            $(this).css({ backgroundColor: opt.barcolor });
                        },
                        drag: function () {
                            scrollVertical(0, false);
                        }
                    });
                }
                else { verticalbar = $("#" + verticalbarid); }

                var verticalarrowtid = grid.attr("id") + "Vertical_TIMG";

                if (!document.getElementById(verticalarrowtid)) {
                    verticalarrowt = $(defaultimg)
                        .css({
                            height: opt.arrowsize,
                            position: "absolute",
                            zIndex: scrollbarZIndex,
                            top: 0
                        });

                    verticalarrowt.attr("id", verticalarrowtid);
                    verticalarrowt.attr("src", opt.varrowtopimg);

                    panelitem.append(verticalarrowt);

                    var verticalrailCss = { right: 0 };
                    verticalarrowt.css(verticalrailCss);

                    verticalarrowt.mousedown(function () {
                        clearInterval(mouseInterval);
                        scrollVertical(-1, false, true);

                        mouseInterval = window.setInterval(function () {
                            scrollVertical(-1, false, true);
                        }, 200);
                    });

                    verticalarrowt.mouseup(function () {
                        clearInterval(mouseInterval);
                    });

                    verticalarrowt.mouseout(function () {
                        clearInterval(mouseInterval);
                    });
                }
                else { verticalarrowt = $("#" + verticalarrowtid); }

                var verticalarrowbid = grid.attr("id") + "Vertical_BIMG";

                if (!document.getElementById(verticalarrowbid)) {
                    verticalarrowb = $(defaultimg)
                        .css({
                            height: opt.arrowsize,
                            position: "absolute",
                            zIndex: scrollbarZIndex
                        });

                    verticalarrowb.attr("id", verticalarrowbid);
                    verticalarrowb.attr("src", opt.varrowbottomimg);

                    panelitem.append(verticalarrowb);

                    var verticalrailCss = { right: 0 };
                    verticalarrowb.css(verticalrailCss);

                    verticalarrowb.mousedown(function () {
                        clearInterval(mouseInterval);
                        scrollVertical(1, false, true);

                        mouseInterval = window.setInterval(function () {
                            scrollVertical(1, false, true);
                        }, 200);
                    });

                    verticalarrowb.mouseup(function () {
                        clearInterval(mouseInterval);
                    });

                    verticalarrowb.mouseout(function () {
                        clearInterval(mouseInterval);
                    });
                }
                else { verticalarrowb = $("#" + verticalarrowbid); }

                var horizontalrailid = grid.attr("id") + "HorizontalRail";

                if (!document.getElementById(horizontalrailid)) {
                    horizontalrail = $(defaultdiv)
                        .css({
                            background: opt.railcolor,
                            height: opt.railsize + "px",
                            position: "absolute",
                            zIndex: scrollbarZIndex
                        });

                    horizontalrail.attr("id", horizontalrailid);

                    panelitem.append(horizontalrail);

                    horizontalrail.mousedown(function (e) {
                        clearInterval(mouseInterval);
                        var offset = $(this).offset();
                        var clickX = e.clientX - offset.left + $(document).scrollLeft();
                        var minX = horizontalbar.offset().left - offset.left;
                        var maxX = horizontalbar.width() + minX;
                        if (clickX < minX) { scrollHorizontal(-1, true); }
                        if (clickX > maxX) { scrollHorizontal(1, true); }

                        mouseInterval = window.setInterval(function () {
                            var clickX = e.clientX - offset.left + $(document).scrollLeft();
                            var minX = horizontalbar.offset().left - offset.left;
                            var maxX = horizontalbar.width() + minX;
                            if (clickX < minX) { scrollHorizontal(-1, true); }
                            if (clickX > maxX) { scrollHorizontal(1, true); }
                        }, 200);
                    });

                    horizontalrail.mouseup(function () {
                        clearInterval(mouseInterval);
                    });

                    horizontalrail.mouseout(function () {
                        clearInterval(mouseInterval);
                    });
                }
                else { horizontalrail = $("#" + horizontalrailid); }

                var horizontalbarid = grid.attr("id") + "HorizontalBar";

                if (!document.getElementById(horizontalbarid)) {
                    horizontalbar = $(defaultdiv)
                        .css({
                            background: opt.barcolor,
                            height: opt.barsize + "px",
                            position: "absolute",
                            zIndex: scrollbarZIndex
                        });

                    horizontalbar.attr("id", horizontalbarid);

                    panelitem.append(horizontalbar);

                    horizontalbar.draggable({
                        axis: 'x',
                        containment: horizontalrail,
                        start: function () {
                            $(this).css({ backgroundColor: opt.barhovercolor });
                        },
                        stop: function () {
                            $(this).css({ backgroundColor: opt.barcolor });
                        },
                        drag: function () {
                            scrollHorizontal();
                        }
                    });
                }
                else { horizontalbar = $("#" + horizontalbarid); }

                var horizontalarrowlid = grid.attr("id") + "Horizontal_LIMG";

                if (!document.getElementById(horizontalarrowlid)) {
                    horizontalarrowl = $(defaultimg)
                        .css({
                            width: opt.arrowsize,
                            position: "absolute",
                            zIndex: scrollbarZIndex,
                            top: 0
                        });

                    horizontalarrowl.attr("id", horizontalarrowlid);
                    horizontalarrowl.attr("src", opt.harrowleftimg);

                    panelitem.append(horizontalarrowl);

                    horizontalarrowl.mousedown(function () {
                        clearInterval(mouseInterval);
                        scrollHorizontal(-1, true);

                        mouseInterval = window.setInterval(function () {
                            scrollHorizontal(-1, true);
                        }, 200);
                    });

                    horizontalarrowl.mouseup(function () {
                        clearInterval(mouseInterval);
                    });

                    horizontalarrowl.mouseout(function () {
                        clearInterval(mouseInterval);
                    });
                }
                else { horizontalarrowl = $("#" + horizontalarrowlid); }

                var horizontalarrowrid = grid.attr("id") + "Horizontal_RIMG";

                if (!document.getElementById(horizontalarrowrid)) {
                    horizontalarrowr = $(defaultimg)
                        .css({
                            width: opt.arrowsize,
                            position: "absolute",
                            zIndex: scrollbarZIndex
                        });

                    horizontalarrowr.attr("id", horizontalarrowrid);
                    horizontalarrowr.attr("src", opt.harrowrightimg);

                    panelitem.append(horizontalarrowr);

                    horizontalarrowr.mousedown(function () {
                        clearInterval(mouseInterval);
                        scrollHorizontal(1, true);

                        mouseInterval = window.setInterval(function () {
                            scrollHorizontal(1, true);
                        }, 200);
                    });

                    horizontalarrowr.mouseup(function () {
                        clearInterval(mouseInterval);
                    });

                    horizontalarrowr.mouseout(function () {
                        clearInterval(mouseInterval);
                    });
                }
                else { horizontalarrowr = $("#" + horizontalarrowrid); }
            }

            function calculateScrollbar() {

                verticalrail.css({
                    height: panelitem.outerHeight() - opt.railsize - (opt.arrowsize * 2),
                    top: opt.arrowsize
                });

                verticalbar.css({
                    top: opt.arrowsize
                });

                horizontalrail.css({
                    width: panelitem.outerWidth() - opt.railsize - (opt.arrowsize * 2),
                    top: panelitem.outerHeight() - opt.railsize,
                    left: opt.arrowsize
                });

                horizontalbar.css({
                    top: panelitem.outerHeight() - ((opt.railsize + opt.barsize) / 2),
                    left: opt.arrowsize
                });

                var verticalbarHeight = Math.max((panelitemcontent.outerHeight() / panelitemcontent[0].scrollHeight) * verticalrail.outerHeight(), opt.minscrollbarsize);
                verticalbar.css({ height: verticalbarHeight + 'px' });

                var horizontalbarWidth = Math.max((panelitemcontent.outerWidth() / panelitemcontent[0].scrollWidth) * horizontalrail.outerWidth(), opt.minscrollbarsize);
                horizontalbar.css({ width: horizontalbarWidth + 'px' });

                if ((verticalbarHeight + (opt.arrowsize * 2)) + 1 >= panelitemcontent.outerHeight() || opt.verticalbar == "hidden") {
                    verticalrail.hide();
                    verticalbar.hide();

                    verticalarrowt.hide();
                    verticalarrowb.hide();

                    releasescroll = true;
                }
                else {
                    verticalrail.show();
                    verticalbar.show();

                    verticalarrowt.show();
                    verticalarrowb.show();
                }

                if ((horizontalbarWidth + (opt.arrowsize * 2)) + 1 >= panelitemcontent.outerWidth() || opt.horizontalbar == "hidden") {

                    horizontalrail.hide();
                    horizontalbar.hide();

                    horizontalarrowl.hide();
                    horizontalarrowr.hide();
                }
                else {
                    horizontalrail.show();
                    horizontalbar.show();

                    horizontalarrowl.show();
                    horizontalarrowr.show();
                }

                if (verticalrail.is(":hidden")) {
                    panelheader.css({ width: scrollWidth });
                    panelheadercontent.css({ width: scrollWidth });

                    panelitem.css({ width: scrollWidth });
                    panelitemcontent.css({ width: scrollWidth });

                    horizontalrail.css({ width: scrollWidth - (opt.arrowsize * 2) });

                    horizontalbarWidth = Math.max((panelitemcontent.outerWidth() / panelitemcontent[0].scrollWidth) * horizontalrail.outerWidth(), opt.minscrollbarsize);
                    horizontalbar.css({ width: horizontalbarWidth + 'px' });

                    horizontalrail.css({
                        top: panelitem.height() - opt.railsize
                    });

                    horizontalbar.css({
                        top: panelitem.height() - ((opt.railsize + opt.barsize) / 2)
                    });

                    var cellcount = gridrow[0].cells.length;

                    //var lastedWidth = $(gridrow[0].cells[cellcount - 1].childNodes[0]).width();
                    //$(gridrow[0].cells[cellcount - 1].childNodes[0]).width(lastedWidth + opt.railsize);
                }

                if (horizontalrail.is(":hidden")) {
                    if (!verticalrail.is(":hidden")) {
                        panelitem.css({ height: currentItemHeight });
                        panelitemcontent.css({ height: currentItemHeight });
                    }
                    else {
                        panelitem.css({ height: grid.height() });
                        panelitemcontent.css({ height: grid.height() });

                        if (opt.wrapperAutoHeight) {
                            wrapper[0].style.height = "";
                        }
                    }

                    verticalrail.css({ height: currentItemHeight - (opt.arrowsize * 2) });

                    verticalbarHeight = Math.max((panelitemcontent.outerHeight() / panelitemcontent[0].scrollHeight) * verticalrail.outerHeight(), opt.minscrollbarsize);
                    verticalbar.css({ height: verticalbarHeight + 'px' });
                }
                else {
                    if (verticalrail.is(":hidden")) {

                        if (opt.height == -1 || (opt.wrapperAutoHeight && scrollHeight > (grid.height() + currentHeaderHeight - opt.railsize))) {
                            panelitem.css({ height: grid.height() + opt.railsize });
                            panelitemcontent.css({ height: grid.height() });

                            wrapper[0].style.height = "";

                            horizontalrail.css({
                                top: panelitem.height() - opt.railsize
                            });

                            horizontalbar.css({
                                top: panelitem.height() - ((opt.railsize + opt.barsize) / 2)
                            });
                        }

                        //else {

                        //}

                        //panelitem[0].style.height = "";
                        //panelitemcontent[0].style.height = "";

                        //wrapper[0].style.height = "";
                    }
                }

                verticalarrowt.css({
                    top: 0
                });

                verticalarrowb.css({
                    top: verticalrail.outerHeight() + opt.arrowsize
                });

                horizontalarrowl.css({
                    top: panelitemcontent.outerHeight()
                });

                horizontalarrowr.css({
                    top: panelitemcontent.outerHeight(),
                    left: horizontalrail.outerWidth() + opt.arrowsize
                });

                if (opt.arrowsize == 0) {
                    verticalarrowt.hide();
                    verticalarrowb.hide();

                    horizontalarrowl.hide();
                    horizontalarrowr.hide();
                }
            }

            function scrollVertical(y, isWheel, isClick, isCustom) {

                var delta = y;

                var maxTop = panelitemcontent.outerHeight() - verticalbar.outerHeight() - opt.arrowsize;

                if (isWheel || isClick) {

                    var step = 0;

                    if (isWheel) {
                        step = y * parseInt(opt.wheelstep) / 100;
                    }
                    else {
                        step = y * 0.8;
                    }

                    delta = (parseInt(verticalbar.css('top'))) + step * ((panelitemcontent.outerHeight() / panelitemcontent[0].scrollHeight) * verticalrail.outerHeight());

                    delta = Math.min(Math.max(delta, opt.arrowsize), maxTop);

                    verticalbar.css({ top: delta + 'px' });
                }
                else if (isCustom) {
                    delta = Math.min(Math.max(delta, opt.arrowsize), maxTop);

                    verticalbar.css({ top: delta + 'px' });
                }

                if (typeof (opt.onScrollVertical) == "function") {
                    opt.onScrollVertical(parseInt(verticalbar.css('top')) - opt.arrowsize);
                }

                var percentScroll = (parseInt(verticalbar.css('top')) - opt.arrowsize) / (verticalrail.outerHeight() - verticalbar.outerHeight());

                delta = percentScroll * (panelitemcontent[0].scrollHeight - panelitemcontent.outerHeight());

                panelitemcontent.scrollTop(delta);

                if (opt.freezesize != 0 && horizontalrail[0].style.display != "none") {

                    if ((delta + panelitemcontent.outerHeight()) > panelitemcontent[0].scrollHeight) {
                        delta = panelitemcontent[0].scrollHeight - panelitemcontent.outerHeight();
                    }

                    if (freezeitemcontent != null) {
                      freezeitemcontent.scrollTop(delta);
                    }
                }
            }

            function scrollHorizontal(x, isClick, isCustom) {

                var delta = x;

                if (isClick) {

                    var step = x * 0.8;

                    delta = (parseInt(horizontalbar.css('left'))) + step * ((panelitemcontent.outerWidth() / panelitemcontent[0].scrollWidth) * horizontalrail.outerWidth());

                    var maxLeft = panelitemcontent.outerWidth() - horizontalbar.outerWidth() - opt.arrowsize;
                    delta = Math.min(Math.max(delta, opt.arrowsize), maxLeft);

                    horizontalbar.css({ left: delta + 'px' });
                }
                else if (isCustom) {
                    var maxLeft = panelitemcontent.outerWidth() - horizontalbar.outerWidth() - opt.arrowsize;
                    delta = Math.min(Math.max(delta, opt.arrowsize), maxLeft);

                    horizontalbar.css({ left: delta + 'px' });
                }

                if (typeof (opt.onScrollHorizontal) == "function") {
                    opt.onScrollHorizontal(parseInt(horizontalbar.css('left')) - opt.arrowsize);
                }

                var percentScroll = (parseInt(horizontalbar.css('left')) - opt.arrowsize) / (horizontalrail.outerWidth() - horizontalbar.outerWidth());
                delta = percentScroll * (panelitemcontent[0].scrollWidth - panelitemcontent.outerWidth());

                if ((delta + panelheadercontent.outerWidth()) > panelheadercontent[0].scrollWidth) {
                    delta = panelheadercontent[0].scrollWidth - panelheadercontent.outerWidth();
                }

                panelitemcontent.scrollLeft(delta);
                panelheadercontent.scrollLeft(delta);

                //console.log();
                //console.log("percentScroll: " + percentScroll);
                //console.log("panelitemcontent scrollWidth: " + panelitemcontent[0].scrollWidth);
                //console.log("panelitemcontent Width: " + panelitemcontent.outerWidth());
                //console.log("panelitemcontent scrollLeft: " + panelitemcontent[0].scrollLeft);
                //console.log("horizontalrail Width: " + horizontalrail.outerWidth());
                //console.log("horizontalbar Width: " + horizontalbar.outerWidth());
                //console.log("horizontalbar scrollLeft: " + horizontalbar.css('left'));
            }

            function calculateColumnWidth() {

                var cellcount = gridrow[0].cells.length;

                gridheader.show();

                if (opt.headerrowcount > 1) {
                    for (var i = 1; i < opt.headerrowcount; i++) {
                        gridbody.children().eq(i).show();
                    }
                }
                for (var i = 0 ; i < cellcount; i++) {
                    gridrow[0].cells[i].childNodes[0].style.width = "";
                }

                //gridrow.find('td').each(function () {
                //    $(this).children().eq(0).css('width', '');
                //});

                var celldiff = 1;

                var gridwidth = grid[0].offsetWidth;

                if (gridwidth < panelitem[0].offsetWidth) {
                    celldiff = 0;
                }

                var gridCopyBody = gridCopy.children().eq(0);

                calculateColumnCells();

                gridcellswidth = new Array();
                gridcellswidthset = new Array();
                //var cellcount = gridrow[0].cells.length;

                for (var i = 0 ; i < cellcount; i++) {

                    gridcellswidthset[i] = false;

                    var gridrowcell = gridrow[0].cells[i];

                    var width = gridrowcell.childNodes[0].offsetWidth + celldiff;

                    if (gridrowcell.style.width && gridrowcell.style.width != "auto") {

                        var tmpWidth = gridrowcell.style.width;

                        if (tmpWidth.indexOf("%") == -1) {
                            width = parseInt(gridrowcell.style.width);
                        }
                        else {
                            tmpWidth = tmpWidth.replace("%", "");

                            width = parseInt(gridwidth * (tmpWidth / 100));

                            gridcellswidthset[i] = true;
                        }
                    }

                    if (celldiff == 0 && i == cellcount - 1) {
                        width--;
                    }

                    gridcellswidth[i] = width;
                }

                for (var i = 0; i < cellcount; i++) {
                    var width = gridcellswidth[i];
                    
                    gridrow[0].cells[i].childNodes[0].style.width = width + "px";

                    if (gridcellswidthset[i]) {

                        //$(gridrow[0].cells[i]).css('width', '');
                        $(gridrow[0].cells[i]).css('width', width + "px");

                        for (var j = opt.headerrowcount; j < grid[0].rows.length; j++) {
                            //$(grid[0].rows[j].cells[i]).css('width', '');
                            $(grid[0].rows[j].cells[i]).css('width', width + "px");
                        }
                    }

                    for (var j = 0; j < opt.headerrowcount; j++) {

                        var value = calculateCells[j][i];

                        if (value == "RS" || value == "CS") { continue; }

                        var status = value.split(':')[0];

                        if (status == "N") { continue; }

                        var cellIndex = value.split(':')[1];

                        if (gridcellswidthset[i]) {
                            //$(gridCopyBody[0].rows[j].cells[cellIndex]).css('width', '');
                            $(gridCopyBody[0].rows[j].cells[cellIndex]).css('width', width + "px");
                        }

                        gridCopyBody[0].rows[j].cells[cellIndex].childNodes[0].style.width = width + "px";
                    }
                }

                //gridrow.find('td').each(function (i) {
                //    var width = gridcellswidth[i];

                //    $(this)[0].childNodes[0].style.width = width + "px";

                //    for (var j = 0; j < opt.headerrowcount; j++) {

                //        var value = calculateCells[j][i];

                //        if (value == "RS" || value == "CS") { continue; }

                //        var status = value.split(':')[0];

                //        if (status == "N") { continue; }

                //        var cellIndex = value.split(':')[1];

                //        gridCopyBody[0].rows[j].cells[cellIndex].childNodes[0].style.width = width + "px";
                //    }
                //});

                gridheader.hide();

                if (opt.headerrowcount > 1) {
                    for (var i = 1; i < opt.headerrowcount; i++) {
                        gridbody.children().eq(i).hide();
                    }
                }
            }

            function calculateColumnCells() {

                var cellcount = gridrow[0].cells.length;
                var rowSpanTmp = [];

                for (var j = 0; j < opt.headerrowcount; j++) {
                    calculateCells[j] = [];
                    rowSpanTmp[j] = 0;
                }

                for (var i = 0; i < cellcount; i++) {
                    //gridrow.find('td').each(function (i) {

                    for (var j = 0; j < opt.headerrowcount; j++) {

                        if (calculateCells[j][i] != "RS" && calculateCells[j][i] != "CS") {

                            var headercell = gridbody.children().eq(j).children().eq(rowSpanTmp[j]);
                            //var headercell = gridbody[0].rows[j].cells[rowSpanTmp[j]];

                            rowSpanTmp[j]++;

                            var rowspan = headercell.attr("rowspan");
                            var colspan = headercell.attr("colspan");
                            //var rowspan = headercell.rowspan;
                            //var colspan = headercell.colspan;

                            if (!rowspan) { rowspan = 1; } else { rowspan = parseInt(rowspan); }
                            if (!colspan) { colspan = 1; } else { colspan = parseInt(colspan); }

                            if (rowspan != 1) {
                                for (var k = j; k < rowspan; k++) {
                                    calculateCells[k][i] = "RS";
                                }
                            }

                            if (colspan != 1) {
                                for (var k = 1; k < colspan; k++) {
                                    calculateCells[j][k + i] = "CS";
                                }
                                calculateCells[j][i] = "N:" + (rowSpanTmp[j] - 1);
                            }

                            if (colspan == 1) {
                                calculateCells[j][i] = "Y:" + (rowSpanTmp[j] - 1);
                            }
                        }
                    }
                    //});
                }

                //var outputHTML = "<table border=1 style='width:50%;'>";

                //for (var i = 0; i < calculateCells.length; i++)
                //{
                //    outputHTML += "<tr>";

                //    for (var j = 0; j < calculateCells[0].length; j++)
                //    {
                //        outputHTML += "<td>" + calculateCells[i][j] + "</td>";
                //    }

                //    outputHTML += "</tr>";
                //}

                //outputHTML += "</table>";

                //var output = $("<div>1</div>");
                //output.html(outputHTML);
                //output.appendTo($(document.body));

                return calculateCells;
            }

            function applayDiv() {

                grid[0].style.display = "none";

                var applyCount = opt.headerrowcount + 1;

                for (var i = 0; i < applyCount; i++) {
                    gridbody.children().eq(i).find('td, th').each(function () {

                        var gridcell = $(this)[0];

                        if (!gridcell.childNodes[0] ||
                            (gridcell.childNodes[0].tagName != "DIV" && gridcell.childNodes[0].className != "GridCellDiv")) {
                            applayCellDiv(gridcell);
                        }
                    });
                }

                grid[0].style.display = "";
            }

            function applayCellDiv(gridcell) {

                var gridcelldiv = document.createElement("DIV");
                gridcelldiv.className = "GridCellDiv";

                while (gridcell.hasChildNodes()) {
                    gridcelldiv.appendChild(gridcell.firstChild);
                }

                gridcell.appendChild(gridcelldiv);

                return gridcelldiv;
            }

            function removeScroll() {

                var wrapperid = grid.attr("id") + "Wrapper";
                var wrapper = $("#" + wrapperid);

                if (!wrapper[0]) { return; }

                var gridcopyid = grid[0].id + "Copy";
                var gridcopy = document.getElementById(gridcopyid);

                if (!gridcopy) { return; }

                wrapper[0].parentNode.insertBefore(grid[0], wrapper[0]);

                var headerrowcount = gridcopy.rows.length;

                for (var i = 0; i < headerrowcount; i++) {
                    grid[0].rows[i].style.display = "";
                }

                gridbody = grid.children().eq(0);

                removeDiv(headerrowcount);

                var rows = grid[0].rows.length;

                for (var i = headerrowcount; i < rows; i++) {
                    var gridrow1 = gridbody[0].rows[i];
                    var gridcell = gridrow1.cells[0];

                    gridcell.style.height = "";

                    if (gridcell.childNodes[0] &&
                            gridcell.childNodes[0].tagName == "DIV" && gridcell.childNodes[0].className == "GridCellDiv") {
                        removeCellDiv(gridcell);
                    }
                }

                var pagerBottomid = grid[0].id + "PagerBottom";
                var pagerBottom = document.getElementById(pagerBottomid);
                if (pagerBottom) {

                    var pagerBottomCell = document.createElement("TD");
                    pagerBottomCell.colSpan = grid[0].rows[rows - 2].cells.length;

                    pagerBottomCell.appendChild(pagerBottom.childNodes[0]);

                    var pagerBottomRow = document.createElement("TR");
                    pagerBottomRow.className = pagerBottom.className;

                    pagerBottomRow.appendChild(pagerBottomCell);

                    $(pagerBottomRow).appendTo(grid.children().eq(0));
                }

                wrapper.remove();
            }

            function removeDiv(headerrowcount) {

                var applyCount = headerrowcount + 1;

                for (var i = 0; i < applyCount; i++) {
                    gridbody.children().eq(i).find('td, th').each(function () {

                        var gridcell = $(this)[0];

                        if (gridcell.childNodes[0] &&
                            gridcell.childNodes[0].tagName == "DIV" && gridcell.childNodes[0].className == "GridCellDiv") {
                            removeCellDiv(gridcell);
                        }
                    });
                }
            }

            function removeCellDiv(gridcell) {
                var gridcelldiv = gridcell.childNodes[0];

                while (gridcelldiv.hasChildNodes()) {
                    gridcell.appendChild(gridcelldiv.firstChild);
                }

                $(gridcelldiv).remove();
            }

            function moveTo(rowIndex)
            {
                var realRowIndex = rowIndex - 1 + opt.headerrowcount;

                var realRow = gridbody[0].rows[realRowIndex];

                var gridTop = $(grid).offset().top;

                var rowTop = $(realRow).offset().top;

                var top = rowTop - gridTop;

                var percentScroll = top / (panelitemcontent[0].scrollHeight - panelitemcontent.outerHeight());

                var realTop = percentScroll * (verticalrail.outerHeight() - verticalbar.outerHeight());
                realTop += opt.arrowsize;
                scrollVertical(realTop, false, false, true);
            }

            var prepared = true;

            var gridbody = null;
            var gridheader = null;
            var gridrow = null;

            var isovergrid = false;
            var releasescroll = false;

            var defaultdiv = "<div></div>";
            var defaultimg = "<img />";

            var panelheader = null;
            var panelitem = null;
            var panelheadercontent = null;
            var panelitemcontent = null;

            var verticalrail = null;
            var verticalbar = null;

            var verticalarrowt = null;
            var verticalarrowb = null;

            var horizontalrail = null;
            var horizontalbar = null;

            var horizontalarrowl = null;
            var horizontalarrowr = null;

            var freezeheadercontent = null;
            var freezeitemcontent = null;

            var gridCopy = null;
            var gridheaderCopy = null;

            var grid = null;
            var wrapper = null;
            var panelpagerbottom = null;

            var calculateCells = [];
            var gridcellswidth = null;
            var gridcellswidthset = null;
            var gridcellsheight = null;

            var panelZIndex = 0;
            var freezeZIndex = 0;
            var scrollbarZIndex = 0;

            var currentHeaderHeight = 0;
            var currentItemHeight = 0;

            var freezeIndex = -1;

            var grid = $(this);

            if (!grid[0]) { return; }

            if (!opt.enabled) {

                removeScroll();

                return;
            }

            gridbody = grid.children().eq(0);

            if (gridbody.children().length < 2) { return; }

            var scrollWidth = opt.width;
            var scrollHeight = opt.height;

            if (scrollWidth == "100%") {
                scrollWidth = $(window).width();
            }

            if (scrollHeight == "100%") {
                scrollHeight = $(window).height();
            }

            var wrapperid = grid.attr("id") + "Wrapper";

            if (!document.getElementById(wrapperid)) {
                wrapper = $(defaultdiv);
                wrapper.attr("id", wrapperid);
                wrapper.css({ width: scrollWidth, height: scrollHeight });
                grid.before(wrapper);
            }
            else {
                wrapper = $("#" + wrapperid);
                wrapper.css({ width: scrollWidth, height: scrollHeight });
            }

            var panelheaderid = grid.attr("id") + "PanelHeader";

            if (!document.getElementById(panelheaderid)) {
                panelheader = $(defaultdiv);
                panelheader.attr("id", panelheaderid);
                panelheader.appendTo(wrapper);
            }
            else { panelheader = $("#" + panelheaderid); }

            panelheader.css({ background: opt.bgcolor });

            var panelitemid = grid.attr("id") + "PanelItem";

            if (!document.getElementById(panelitemid)) {
                panelitem = $(defaultdiv);
                panelitem.attr("id", panelitemid);
                panelitem.appendTo(wrapper);
            }
            else { panelitem = $("#" + panelitemid); }

            panelitem.css({ background: opt.bgcolor });

            var panelheadercontentid = grid.attr("id") + "PanelHeaderContent";

            if (!document.getElementById(panelheadercontentid)) {
                panelheadercontent = $(defaultdiv).css({ background: "#FFFFFF" });
                panelheadercontent.attr("id", panelheadercontentid);
                panelheadercontent.appendTo(panelheader);
            }
            else {
                panelheadercontent = $("#" + panelheadercontentid);

                panelheadercontent.scrollLeft(0);
                panelheadercontent.scrollTop(0);
            }

            var panelitemcontentid = grid.attr("id") + "PanelItemContent";

            if (!document.getElementById(panelitemcontentid)) {
                panelitemcontent = $(defaultdiv).css({ background: "#FFFFFF" });
                panelitemcontent.attr("id", panelitemcontentid);
                panelitemcontent.appendTo(panelitem);
                grid.appendTo(panelitemcontent);
            }
            else {
                panelitemcontent = $("#" + panelitemcontentid);

                panelitemcontent.scrollLeft(0);
                panelitemcontent.scrollTop(0);
            }

            gridheader = gridbody.children().eq(0);
            gridheader.attr("id", grid.attr("id") + "Header");
            gridrow = gridbody.children().eq(opt.headerrowcount);

            var gridCopyid = grid.attr("id") + "Copy";

            if (!document.getElementById(gridCopyid)) {
                gridCopy = $(grid[0].cloneNode(false));
                gridCopy.attr("id", gridCopyid);

                gridCopy.appendTo(panelheadercontent);

                prepared = false;
            }
            else { gridCopy = $("#" + gridCopyid); }

            applayDiv();

            var gridheaderCopyid = gridheader.attr("id") + "Copy";

            if (!document.getElementById(gridheaderCopyid)) {

                gridheaderCopy = gridheader.clone(false);
                gridheaderCopy.attr("id", gridheaderCopyid);

                replaceFormElement(gridheaderCopy, "Copy");

                gridheaderCopy.appendTo(gridCopy);

                if (opt.headerrowcount > 1) {
                    for (var i = 1; i < opt.headerrowcount; i++) {
                        var headerCopy = gridbody.children().eq(i).clone(false);

                        replaceFormElement(headerCopy, "Copy");

                        headerCopy.appendTo(gridCopy);
                    }
                }
            }
            else { gridheaderCopy = $("#" + gridheaderCopyid); }

            panelitemcontent[0].style.display = "none";

            currentHeaderHeight = panelheader[0].offsetHeight;

            currentItemHeight = scrollHeight - currentHeaderHeight;

            panelitemcontent[0].style.display = "";

            var panelpagerbottomid = grid.attr("id") + "PagerBottom";

            if (!document.getElementById(panelpagerbottomid)) {

                var gridrowpagerbottom = gridbody.children().eq(gridbody.children().length - 1);
                var gridcellpagerbottom = gridrowpagerbottom.children().eq(0);

                var pagerbottom = gridcellpagerbottom.children().eq(0);

                if (pagerbottom[0] != null && pagerbottom[0].tagName == "TABLE") {
                    if (!document.getElementById(panelpagerbottomid)) {
                        panelpagerbottom = $(defaultdiv);
                        panelpagerbottom.attr("id", panelpagerbottomid);
                        panelpagerbottom.addClass(gridrowpagerbottom[0].className);

                        panelitem.after(panelpagerbottom);

                        pagerbottom.appendTo(panelpagerbottom);

                        panelpagerbottom.width(scrollWidth);
                    }

                    gridrowpagerbottom.remove();
                }
            }
            else {
                panelpagerbottom = $("#" + panelpagerbottomid);

                if (panelpagerbottom[0]) {
                    panelpagerbottom.width(scrollWidth);
                }
            }

            if (panelpagerbottom && panelpagerbottom[0]) {
                currentItemHeight -= panelpagerbottom.height();
            }

            panelitem.css({ position: "relative", overflow: "hidden", width: scrollWidth, height: currentItemHeight });
            panelitemcontent.css({ overflow: "hidden", width: scrollWidth - opt.railsize, height: currentItemHeight - opt.railsize, zIndex: panelZIndex });

            panelheader.css({ position: "relative", overflow: "hidden", width: scrollWidth });
            panelheadercontent.css({ overflow: "hidden", width: scrollWidth - opt.railsize, zIndex: panelZIndex });

            calculateColumnWidth();

            if (opt.freezesize != 0) {
                var rowsCount = gridbody.children().length - 1;
                var datarowstart = opt.headerrowcount + 1;

                calculateColumnHeight();
            }

            createScrollbar();

            calculateScrollbar();

            var freezeheadercontentid = panelheadercontent.attr("id") + "Freeze";
            var freezeitemcontentid = panelitemcontent.attr("id") + "Freeze";

            if (opt.freezesize != 0 && horizontalrail[0].style.display != "none") {
                createFreeze();
            }
            else {
                var freezeheadercontentid = panelheadercontent.attr("id") + "Freeze";
                var freezeitemcontentid = panelitemcontent.attr("id") + "Freeze";

                if (document.getElementById(freezeheadercontentid)) {
                    $("#" + freezeheadercontentid).hide();
                    $("#" + freezeitemcontentid).hide();
                }
            }

            if (opt.startVertical > 0) {

                var delta = parseInt(opt.startVertical) + opt.arrowsize;
                scrollVertical(delta, false, false, true);
            }
            else if (opt.startVertical == -1) {
                var maxTop = panelitemcontent.outerHeight() - verticalbar.outerHeight() - opt.arrowsize;

                scrollVertical(maxTop, false, false, true);
            }

            if (opt.startHorizontal > 0) {

                var delta = parseInt(opt.startHorizontal) + opt.arrowsize;
                scrollHorizontal(delta, false, true);
            }

            if (opt.scrollAssociate) {

                var mode = opt.scrollAssociate.mode;
                var target = opt.scrollAssociate.target;

                var gridviewScrollAssociate = $("#" + target + "PanelItemContent");

                var verticalbarAssociate = $("#" + target + "VerticalBar");
                var horizontalbarAssociate = $("#" + target + "HorizontalBar");

                if (mode == "both") {
                    gridviewScrollAssociate.bind("scroll", function () {
                        var top = parseInt(verticalbarAssociate.css('top'));
                        var left = parseInt(horizontalbarAssociate.css('left'));

                        scrollVertical(top, false, false, true);
                        scrollHorizontal(left, false, true);
                    });
                }
                else if (mode == "vertical") {
                    gridviewScrollAssociate.bind("scroll", function () {
                        var top = parseInt(verticalbarAssociate.css('top'));

                        scrollVertical(top, false, false, true);
                    });
                }
                else if (mode == "horizontal") {
                    gridviewScrollAssociate.bind("scroll", function () {
                        var left = parseInt(horizontalbarAssociate.css('left'));

                        scrollHorizontal(left, false, true);
                    });
                }
            }

            panelitemcontent.bind("keyup", function (e) {

                if (e.keyCode == 9) {

                    var target = $(e.target);

                    if (!target[0]) { return; }

                    processHorizontal(target);
                    processVertical(target);

                    var targetfreezeid = target[0].id + "_freezeitem";

                    var targetfreeze = $("#" + targetfreezeid);

                    if (targetfreeze[0]) {
                        targetfreeze.focus();
                    }
                }
            });

            function processHorizontal(target) {

                var scrollLeft = panelitemcontent[0].scrollLeft;
                var panelWidth = panelitemcontent.outerWidth();

                var targetLeft = target.position().left;
                var targetWidth = target.outerWidth();

                //console.log("---processHorizontal");
                //console.log("scrollLeft: " + scrollLeft);
                //console.log("panelWidth: " + panelWidth);
                //console.log("targetLeft: " + targetLeft);
                //console.log("targetWidth: " + targetWidth);

                scrollLeft = targetLeft + targetWidth - panelWidth + scrollLeft + 5;

                if (scrollLeft < 0) {
                    scrollLeft = 0;
                }

                //console.log("scrollLeft: " + scrollLeft);
                //console.log("---");

                var minWidthh = horizontalrail.outerWidth() - horizontalbar.outerWidth();
                var maxWidthh = panelitemcontent[0].scrollWidth - panelitemcontent.outerWidth();

                var left = (scrollLeft / (maxWidthh / minWidthh)) + opt.arrowsize;

                horizontalbar.css({ left: left + 'px' });

                panelitemcontent.scrollLeft(scrollLeft);
                panelheadercontent.scrollLeft(scrollLeft);
            }

            function processVertical(target) {

                var targetTop = target.position().top;
                var targetHeight = target.outerHeight();

                var scrollTop = panelitemcontent[0].scrollTop;
                var panelHeight = panelitemcontent.outerHeight();

                //console.log("processVertical");
                //console.log("scrollTop: " + scrollTop);
                //console.log("panelHeight: " + panelHeight);
                //console.log("targetTop: " + targetTop);
                //console.log("targetHeight: " + targetHeight);

                scrollTop = targetTop + targetHeight - panelHeight + scrollTop + 5;

                if (scrollTop < 0) {
                    scrollTop = 0;
                }

                //console.log("scrollTop: " + scrollTop);
                //console.log("---");

                var minWidthv = verticalrail.outerHeight() - verticalbar.outerHeight();
                var maxWidthv = panelitemcontent[0].scrollHeight - panelitemcontent.outerHeight();

                var top = (scrollTop / (maxWidthv / minWidthv)) + opt.arrowsize;

                verticalbar.css({ top: top + 'px' });

                panelitemcontent.scrollTop(scrollTop);

                if (opt.freezesize != 0 && horizontalrail[0].style.display != "none") {
                    freezeitemcontent.scrollTop(scrollTop);
                }
            }

            if (opt.freezesize != 0 && horizontalrail[0].style.display != "none") {
                freezeitemcontent.bind("keydown", function (e) {

                    if (e.keyCode == 9) {
                        var targetfreeze = $(e.target);

                        if (!targetfreeze[0]) { return; }

                        //console.log(targetfreeze[0].id);

                        var targetid = targetfreeze[0].id.replace("_freezeitem", "");

                        //console.log(targetid);

                        var target = $("#" + targetid);

                        if (target[0]) {
                            target.focus();
                        }
                    }
                });
            }

            if (prepared) { return; }

            panelitemcontent.hover(
                function () { isovergrid = true; },
                function () { isovergrid = false; }
            );

            if (opt.freezesize != 0 && horizontalrail[0].style.display != "none") {
                freezeitemcontent.hover(
                    function () { isovergrid = true; },
                    function () { isovergrid = false; }
                );
            }

            var _onWheel = function (e) {

                if (!isovergrid) { return; }

                if (verticalrail.is(":hidden")) { return; }

                var e = e || window.event;

                var delta = 0;
                if (e.wheelDelta) { delta = -e.wheelDelta / 120; }
                if (e.detail) { delta = e.detail / 3; }

                scrollVertical(delta, true);

                if (e.preventDefault && !releasescroll) { e.preventDefault(); }
                if (!releasescroll) { e.returnValue = false; }
            };

            var attachWheel = function () {
                if (window.addEventListener) {
                    this.addEventListener('DOMMouseScroll', _onWheel, false);
                    this.addEventListener('mousewheel', _onWheel, false);
                }
                else {
                    document.attachEvent("onmousewheel", _onWheel);
                }
            };

            attachWheel();

            if (opt.rowIndexElementID != "")
            {
                $("#" + opt.rowIndexElementID).on("change", function () {
                    var rowIndex = $("#" + opt.rowIndexElementID).val();
                    var rowCount = gridbody[0].rows.length;
                    if (!isNaN(rowIndex) && rowIndex < (rowCount - opt.headerrowcount))
                        moveTo(parseInt(rowIndex));
                });
            }

            return this;
        }
    });

    jQuery.fn.extend({
        gridviewScroll: jQuery.fn.gridviewScroll
    });

})(jQuery);
