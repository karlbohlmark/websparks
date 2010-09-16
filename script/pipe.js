require.define({'pipe': function(require, exports){
  exports.pipe = function(){ 
    var todos = arguments, u = require('util');
    return function(){
      var arg = arguments[0];
      u.toArray(todos).forEach(function(f){
        arg = f.call(null, arg)
      })
    }
  };
}}, ['util'])