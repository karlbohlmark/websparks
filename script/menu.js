require.define({
  'menu' : function(require, exports){
    var $ = require('lib/jquery').$
    
    var menu = $(document.createElement('ul'));
    
    var menuItemTemplate = '<li><a href="{{action}}">{{title}}</a></li>';
    
	exports.menu = menu;
	
    exports.registerItems = function(items){
        var html = "";
        
        items.forEach(function(item){
          html += menuItemTemplate.replace(/{{action}}/g, item.action).replace(/{{title}}/g, item.title)
        })
        
        menu.html(html);
    }
  }
}, ['lib/jquery'])
