require.define(
{
   "widgets/cv/cv" : function(require, exports){
      require('model').toObservable('extend', 'cv', function(model){
        
      })
      var widget = new (require('widget').Widget)('cv',{
        templateEngine: "spark"
        //,databound: function(){alert('cv databound')}
      })
      exports.widget = widget;
  }
},["widget", "model"])
