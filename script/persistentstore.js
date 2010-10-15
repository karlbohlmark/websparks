require.define({
  "persistentstore" : function(require, exports){
    var store = require('lib/store').store

    var PersistentStore = function(name, keyGenerator){
      this.name = name
      if(keyGenerator)
        this.generateKey = keyGenerator
    }
    
    PersistentStore.prototype.generateKey = function(key){
      return this.name + '__' + key; 
    }
    
    PersistentStore.prototype.get = function(key){
      return store.get(this.generateKey(key))
    }
    
    PersistentStore.prototype.set = function(key, value){
      var key = this.generateKey(key)
      store.set(key, value)
    }
    
    exports.Store = PersistentStore
  }
}, ['lib/store'])


    
