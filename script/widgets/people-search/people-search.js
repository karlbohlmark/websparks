require.define(
{
   "widgets/people-search/people-search" : function(require, exports){
      var Widget = require('widget').Widget;
    
      var widget = new Widget('people-search');
      
      widget.databound = function(model, element){
        
      }
      
      exports.widget = widget;
  }
},["widget", "model"])



