## GridViewScroll - NEW
將 您 的 表 格 或 GridView 固 定 標 題 列 與 凍 結 欄 位

<img border="0" border="0" style="border:1px solid #EFEFEF;" src="http://gridviewscroll.aspcity.idv.tw/images/gridviewscrollv2_git.gif?2017110802">

### 支援的功能
* Default scrollbar of browser
* Freeze Header, Column, Footer (only last row)

### 開始使用
1. Download the [latest release](https://github.com/twlikol/GridViewScroll/archive/master.zip)
2. Include the `gridviewscroll.js`
```html
<script type="text/javascript" src="js/gridviewscroll.js"></script>
  ``` 
3. Initialize table with options, then call `enhance`
```html
<script type="text/javascript">
    window.onload = function () {
        var gridViewScroll = new GridViewScroll({
            elementID : "gvMain" // Target element id
        });
        gridViewScroll.enhance();
    }
</script>
```

### 可用參數
```html
<script type="text/javascript">
    var gridViewScroll = new GridViewScroll({
        elementID : null, // String
        width : "700", // Integer
        height : "350", // Integer
        freezeColumn : false, // Boolean
        freezeFooter : false, // Boolean
        freezeColumnCssClass : null, // String
        freezeFooterCssClass : null, // String
        freezeHeaderRowCount : 1, // Integer
        freezeColumnCount : 1 // Integer
    });
</script>
```

### 方法
```html
<script type="text/javascript">
    var gridViewScroll = new GridViewScroll({
        elementID : "gvMain",
    });
    gridViewScroll.enhance(); // Apply the gridviewscroll features
    gridViewScroll.undo(); // Undo the DOM changes, And remove gridviewscroll features
</script>
```

### 支援的瀏覽器
* Internet Explorer 9+
* Google Chrome (61.0.3163.100)
* Mozilla FireFox (56.0.2)

### Copyright and license
Copyright © Likol Lee. Licensed under the MIT license.

## GridViewScroll with jQuery (v0.9.6.8)
This version is no longer supported, you can find in link:
https://github.com/twlikol/GridViewScroll/tree/v0.9.6.8
