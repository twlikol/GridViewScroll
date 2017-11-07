## GridViewScroll - NEW
Freeze column and fixed header in Table or GridView (ASP.NET WebForms)

<img border="0" border="0" style="border:1px solid #EFEFEF;" src="http://gridviewscroll.aspcity.idv.tw/images/gridviewscrollv2_git.gif?2017110802">

### Features
* Default scrollbar of browser
* Freeze Header, Column, Footer (only last row)

### Getting Started
1. Download the [latest release](https://github.com/twlikol/GridViewScroll/archive/master.zip) from GitHub
2. Include the `gridviewscroll.js` in web page
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

### Options
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

### Methods
```html
<script type="text/javascript">
    var gridViewScroll = new GridViewScroll({
        elementID : "gvMain",
    });
    gridViewScroll.enhance(); // Apply the gridviewscroll features
    gridViewScroll.undo(); // Undo the DOM changes, And remove gridviewscroll features
</script>
```

### Supported Browsers
* Internet Explorer 9+
* Google Chrome (61.0.3163.100)
* Mozilla FireFox (56.0.2)

### Copyright and license
Copyright © Likol Lee. Licensed under the MIT license.

## GridViewScroll with jQuery (v0.9.6.8)
This version is no longer supported, you can find in link:
https://github.com/twlikol/GridViewScroll/tree/v0.9.6.8
