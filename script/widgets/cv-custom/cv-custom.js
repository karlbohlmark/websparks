require.define(
{
   "widgets/cv-custom/cv-custom" : function(require, exports){
      require('model').toObservable('extend', 'cv-custom', function(model){
        
      })
      var widget = new (require('widget').Widget)('cv-custom',{
        templateEngine: "spark"
        //,databound: function(){alert('cv databound')}
      })
      
      widget.on('databound', function(element){
        $('[data-refs=""]').removeAttr('data-refs')
        
        /*
        $(element).delegate('[data-refs]', 'mouseenter', function(e){
          var el = $(this)
          el.editable()
        })
        $(element).delegate('input', 'mouseleave', function(e){
          var el = $(this)
          var displayElem = $('[data-editor="' + el.attr('id') + '"]')
          displayElem.editable('exit')
        })
        */
        
        $('[data-refs]',element).click(
          function(e){
            $(this).editable()
            var widget = $(this).closest('[data-widget]')
            var addProject = widget.find('.add-project')
            addProject.show()
            addProject.click(function(e){
              resource.getTemplate('cv-custom', function(t){
                //var p = $(t).find('[each="project in projects"]')
                var p = widget.find('[data-enumeration="project in projects"]:last-child')
                p.after(p.clone())
              })
              e.stopPropagation()
              e.preventDefault()
            })
          }
        )
      })
      
      exports.widget = widget;
  }
},["widget", "model", "editable"])
