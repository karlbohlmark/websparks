require.define({
  'test/test4': function(require, exports){
    exports.test4 = function(){
      return "test4";
    }
  }
}, ['test/test5'])
