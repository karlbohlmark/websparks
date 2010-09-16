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
    }
});