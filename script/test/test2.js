require.define({
  'test/test2': function(require, exports){
    exports.test2 = function(){
      return "test2";
    }
  }
}, ['test/test3'])
