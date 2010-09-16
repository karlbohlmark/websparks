require.define(
{
    'template': function(require, exports){
        var defaultEngine = "knockout"
        exports.engine = function(engineName){
          var engine
          try{
            engine = require('template-engines/' + (engineName || defaultEngine))
          }catch(e){
            var error = 'failed to load engine: ' + engineName + ". Innerexception:" + e
            console.error(error)
            throw error
          }
          return engine
        }
    }
});