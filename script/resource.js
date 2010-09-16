require.define({
  'resource' : function(require, exports){ 
    var bus = require('eventbus').bus
    var store = new(require('persistentstore').Store)('models')
    
    var resource = {
      getModel : function(modelName, cb){
          var m = store.get(modelName)
          if(typeof m !=="undefined"){
            setTimeout(function(){cb(m)}, 0)
            return
          }
            
          $.ajax(
          {
            url: "query/" + modelName + ".js", 
            dataType : 'text',
            success : function(r){
              var m = JSON.parse(r);
              store.set(modelName, m)
              cb(m);
            },
            error: function(e, r){
              alert(JSON.stringify(e));
              alert(JSON.stringify(r));
            }
          });
        }
      ,
        getTemplate : function(templateName, cb){
          $.get('script/widgets/' + templateName + '/' + templateName + '.html', cb);
        }
      }

    window.resource = exports.resource = resource
    bus.subscribe('data/valueedited', function(message){
      var modelInStore = store.get(message.modelName)
      if(modelInStore){
        if(message.enumeration)
          store.updateCollectionItem(message.modelName, message.enumeration, message.index, message.reference, message.newValue)
        store.update(message.modelName, message.reference, message.newValue)
      }
    })
  }
}, ["eventbus", "persistentstore"])

