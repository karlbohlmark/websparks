require.define({
    'layout': function(require, exports){
      var $ = require('lib/jquery').$;
		
  		var selectors = {
  			workspace : '#workspace'
  		}
  		
  		var widgetChrome = function(widgetName, content){ return '<div data-widget="' + widgetName+ '">' + content + "<div>"};
  		
      exports.addWidgetToWorkspace = function(name){
          return function(content){
              var widget = $(widgetChrome(name,content));
              $(selectors.workspace).append(widget);
  		        return widget.get(0);
          }
      };
    }
},
['lib/jquery'])
