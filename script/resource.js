require.define({
  'resource' : function(require, exports){ 
    var bus = require('eventbus').bus
      , util = require('util')
      , Promise = util.Promise
      , addPrefix = function(prefix){return function(key){return prefix + key}}
      , Store = require('persistentstore').Store
      , createNamedStore = function(name){return new Store(name, addPrefix(name))}
      , modelStorePrefix = 'models__'
      , modelStore = createNamedStore(modelStorePrefix)
      , templateStore = createNamedStore('templates__')
    
    var backend = function(serverUrl){ 
      return {
        set: function(key, value){
          $.ajax({
            'url' : serverUrl,
            'type' : 'PUT',
            'data' : key + '=' + value,
            'success' : function(response){
              alert('successfully put data on backend')
            },
            'error' : function(){
              alert('failed to write data to backend server')
            }
          })
        }
      }
    }('http://192.168.161.130:8181')
    
    var resource = {
      getModel : function(modelName, cb){
          var m = modelStore.get(modelName)
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
              modelStore.set(modelName, m)
              cb(m);
            },
            error: function(e, r){
              alert(JSON.stringify(e));
              alert(JSON.stringify(r));
            }
          });
        },
        
        getTemplate : function(templateName, cb){
          var t = templateStore.get(templateName)
          $.get('script/widgets/' + templateName + '/' + templateName + '.html', function(response){
            templateStore.set(response)
            cb(response)
          });
        },
        
        getStyle : function(widget, cb){
          var promise
          if(typeof cb === 'undefined'){
            promise = new Promise()
          }
          $.get('script/widgets/' + widget + '/' + widget + '.css', function(response){
            if(promise)
              promise.resolve(response)
            else
              cb(response)
          })
          return promise
        }
      }

    window.resource = exports.resource = resource
    
    var updateModelFromMessage = function(model, message){
      if(message.enumeration){ // An item in a collection has changed
          var coll = model[message.enumeration]
          coll[message.index][message.reference] = message.newValue
      }else{ // A primitive property changed
        var property = message.reference,
            oldVal = model[property]
        if(typeof oldVal == "function"){
          oldVal.call(model, message.newValue)
        }else{
          model[property] = message.newValue
        }
      }
    }
    
    bus.subscribe('data/valueedited', function(message){
      var key = message.modelName,
          stored = modelStore.get(key)
      if(stored){
        updateModelFromMessage(stored, message)
        modelStore.set(key, stored)
        backend.set(modelStorePrefix + key, JSON.stringify(stored))
      }
    })
  }
}, ["eventbus", "persistentstore", "util"])

