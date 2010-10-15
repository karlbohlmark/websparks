require.define(
{
    'util': function(require, exports){
        
        function Promise(){
            this.listeners = []
            if(arguments.length>0)
                this.name = arguments[0]
        }
        
        Promise.prototype = {
            addListener: function(listener){
              this.listeners.push(listener)
            },
            resolve: function(value){
                this.listeners.forEach(function(l){
                    l(value)
                })
            }
        }
        
        function MultiPromise(){
          this.promises = []
          this.listeners = []
        }
        
        MultiPromise.prototype.push = function(promise){
          this.promises.push(promise)
          var self = this
          promise.addListener(function(value){
            promise.value = value
            promise.resolved = true
            self.promiseResolved()
          })
        }
        
        MultiPromise.prototype.promiseResolved = function(){
          this.promises.forEach(function(p){
            if((p instanceof Promise) ||)
          })
        }
        
        MultiPromise.prototype.addListener = function(cb){
          this.listeners.push(cb)
        }
        
        exports.toArray = function(args){
            return Array.prototype.slice.apply(args, [0, args.length])
        };
        exports.Promise = Promise
         
        exports.when = function(valueOrPromise, doThis){
          if(valueOrPromise instanceof Promise){
            valueOrPromise.addListener(doThis)
          }else{
            doThis(valueOrPromise())
            return valueOrPromise
          }
        }
        
        exports.whenAll = function(promises){
          promises.forEach(function(p){
            
          })
        }
    }
});