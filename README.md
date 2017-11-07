## GridViewScroll - NEW
Freeze column and fixed header in Table or GridView (ASP.NET WebForms)

<img border="0" border="0" style="border:1px solid #EFEFEF;" src="http://gridviewscroll.aspcity.idv.tw/images/gridviewscrollv2_git.png?2017110701">

### Features
* Default scrollbar of browser
* Freeze Header, Column, Footer (only last row)

### Getting Started
1. Download the [latest release](https://github.com/twlikol/GridViewScroll/archive/master.zip)
2. Include the `gridviewscroll.js`
```html
   <script type="text/javascript" src="js/gridviewscroll.js"></script>
  ``` 
3. Initialize table with options, then call `enhance`
  ```html
  <script type="text/javascript">
    window.onload = function () {
        var options = new GridViewScrollOptions();
        options.elementID = "gvMain";

        var gridViewScroll = new GridViewScroll(options);
        var gridViewScroll.enhance();
    }
  </script>
  ```

### Options
**elementID**: `String`  
**width**: `Integer (700)`  
**height**: `Integer (350)`  
**freezeColumn**: `Boolean (null)`  
**freezeFooter**: `Boolean (null)`  
**freezeColumnCssClass**: `String (null)`  
**freezeFooterCssClass**: `String (null)`  
**freezeHeaderRowCount**: `Integer (1)`  
**freezeColumnCount**: `Integer (1)`  

### Public Methods
**enhance()**: Apply the gridviewscroll features to element id.  
**undo()**:  Undo the DOM changes when apply gridviewscroll.

### Supported Browsers
* Internet Explorer 9+
* Google Chrome

## GridViewScroll with jQuery (v0.9.6.8)
This version is no longer supported, you can find in link:
https://github.com/twlikol/GridViewScroll/tree/v0.9.6.8
