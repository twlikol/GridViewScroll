## GridViewScroll - 新版
將 您 的 表 格 或 GridView 固 定 標 題 列 與 凍 結 欄 位

<img border="0" border="0" style="border:1px solid #EFEFEF;" src="https://github.com/twlikol/GridViewScroll/raw/master/gridviewscrollv2_git.gif">

### 支援的功能
* 使用瀏覽器預設捲軸
* 固定標題列, 凍結欄位與凍結頁尾(目前僅支援凍結最後一列)

### 開始使用
1. 從 GitHub 下載 [最新版本](https://github.com/twlikol/GridViewScroll/archive/master.zip)
2. 將 `gridviewscroll.js` 加入頁面
```html
<script type="text/javascript" src="js/gridviewscroll.js"></script>
  ``` 
3. 初始化相關參數, 呼叫 `enhance` 方法
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
        elementID : "", // String
        width : 700, // Integer or String(Percentage)
        height : 350, // Integer or String(Percentage)
        freezeColumn : false, // Boolean
        freezeFooter : false, // Boolean
        freezeColumnCssClass : "", // String
        freezeFooterCssClass : "", // String
        freezeHeaderRowCount : 1, // Integer
        freezeColumnCount : 1, // Integer
        onscroll: function (scrollTop, scrollLeft) // 卷軸捲動事件
    });
</script>
```
### 屬性
```html
<script type="text/javascript">
    var gridViewScroll = new GridViewScroll({
        elementID : "gvMain"
    });
    gridViewScroll.enhance();
    var scrollPosition = gridViewScroll.scrollPosition // 取得卷軸位置
    var scrollTop = scrollPosition.scrollTop;
    var scrollLeft = scrollPosition.scrollLeft;
  
    var scrollPosition = { scrollTop: 50, scrollLeft: 50};
    gridViewScroll.scrollPosition = scrollPosition; // 設定卷軸位置
</script>
```

### 方法
```html
<script type="text/javascript">
    var gridViewScroll = new GridViewScroll({
        elementID : "gvMain",
    });
    gridViewScroll.enhance(); // 套用 gridviewscroll 功能
    gridViewScroll.undo(); // 復原 DOM 的變更, 並移除 gridviewscroll 功能
</script>
```

### 事件
```html
<script type="text/javascript">
    var gridViewScroll = new GridViewScroll({
        elementID : "gvMain",
        onscroll: function (scrollTop, scrollLeft) {
            console.log("scrollTop: " + scrollTop + ", scrollLeft: " + scrollLeft);
        }
    });
    gridViewScroll.enhance();
</script>
```

### 支援的瀏覽器
* Internet Explorer 9+
* Google Chrome (61.0.3163.100)
* Mozilla FireFox (56.0.2)

### 技術支援
如果你有任何關於GridViewScoll的問題,你可以在GitHub的網站上填寫 [Issue](https://github.com/twlikol/GridViewScroll/issues/new) ,我們會盡力協助處理.

或是你可以直接寄E-Mai: [twlikol@msn.com](mailto:twlikol@msn.com).

### Copyright and License
Copyright © Likol Lee. Licensed under the MIT license.

## GridViewScroll with jQuery (v0.9.6.8)
此版本已不再進行任何更新或修正, 如果你還需要請參考以下連結:
https://github.com/twlikol/GridViewScroll/tree/v0.9.6.8
