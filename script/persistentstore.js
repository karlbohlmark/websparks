require.define({
  "persistentstore" : function(require, exports){
    var store = require('lib/store').store
  
    /*
    var replaceValue = function(model, property, value){
      var oldVal = model[property]
      if(typeof oldVal == "function"){
        model[property].call(model, value)
      }else{
        model[property] = value
      }
    }
    */
    
    var buildKey = function(storeName, key){
      return storeName + '__' + key; 
    }
    
    var PersistentStore = function(name){
      this.name = name
    }
    
    PersistentStore.prototype.get = function(key){
      return store.get(buildKey(this.name, key))
    }
    
    PersistentStore.prototype.set = function(key, value){
      store.set(buildKey(this.name, key), value)
    }
    
    PersistentStore.prototype.update = function(key, property, value){
      var stored = this.get(key)
      var oldVal = stored[property]
      if(typeof oldVal == "function"){
        oldVal.call(stored, value)
      }else{
        stored[property] = value
        this.set(key, stored)
      }
    }
    
    PersistentStore.prototype.updateCollectionItem = function(key, collection, index, property, value){
      var stored = this.get(key)
      
      
      var coll = stored[collection]
      coll[index][property] = value
      
      this.set(key, stored)
    }
    
    exports.Store = PersistentStore
  }
}, ['lib/store'])


    
