require.define({'editable': function(require, exports){
      var uid = function(){
        return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18)
      },
      bus = require('eventbus').bus,
    
      editors = {
        'basic-text' : function(){
          var elem = this,
              jElem = $(elem),
              id = jElem.attr('data-editor'),
              createEditor = !id,
              editor 
          
          if(createEditor){
            id = uid()
            jElem.attr('data-editor', id)
            editor = $('<input type="text" id="' + id + '" />')
            editor.css({
              'font-size': jElem.css('font-size'), 
              'font-weight': jElem.css('font-weight'),
              'margin-bottom': jElem.css('margin-bottom'),
              'margin-top': jElem.css('margin-top')
            })
            
            jElem.after(editor)
            editor.bind('keydown', function(e){
            if(e.which==13){
              saveEditedValue()
              exitEditmode()
            }
            if(e.which==27){
              exitEditmode()
            }
          })
          }else{
            editor = $('#' + id)
          }
          
          
          var enterEditmode = function(){
            editor.val(elem.innerHTML.replace(/^\s*(.*)\s$/, '$1'))
            jElem.css({'display': 'none'})
            editor.show()
            editor.focus()
          }
          
          var exitEditmode = function(){
            editor.hide()
            jElem.show()
          }
          
          var saveEditedValue = function(){
            var newVal = editor.val(),
                oldVal = jElem.text()
            if(newVal!=oldVal){
              jElem.text(newVal)
              var widgetName = jElem.closest('[data-widget]').attr('data-widget')
                , collection = jElem.closest('[data-enumeration]')
                , message    = {
                modelName : widgetName,
                reference : jElem.attr('data-refs').replace(/[^.\w\d-]/g, ''),
                newValue : newVal,
                oldValue : oldVal
              }
              if(!!collection.length){
                var collParts = collection.attr('data-enumeration').split(' ')
                message.enumeration = collParts[2]
                message.reference = message.reference.replace(collParts[0] + '.', '')
                message.index = collection.attr('data-index')
              }
                
              bus.publish('data/valueedited', message)
            }
          }
          
          enterEditmode()
        }
      },
    
      elementEditorMappings = {
      }
  ;
  $.fn.editable = function(){
    this.each(function(){
      var nodeName = this.nodeName,
          editor = elementEditorMappings[nodeName] || 'basic-text'
      ; 

      editors[editor].call(this)
    })
  }
}}, ['lib/jquery', 'eventbus'])