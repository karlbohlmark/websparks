require.define(
{
   "widgets/cv-custom/cv-custom" : function(require, exports){
      require('model').toObservable('extend', 'cv-custom', function(model){
        
      })
      var widget = new (require('widget').Widget)('cv',{
        templateEngine: "spark"
        //,databound: function(){alert('cv databound')}
      })
      
      widget.on('databound', function(element){
        $('[data-refs=""]').each(function(){
          $(this).removeAttr('data-refs')
        })
        $('[data-refs]',element).click(
          function(e){
            $(this).editable()
          }
        )
      })
      
      exports.widget = widget;
  }
},["widget", "model", "editable"])
