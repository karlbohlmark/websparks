require.define({
  'widget' : function(require, exports){
      exports.Widget = function(name, options){
        this.handlers = {}
        this.name=name;
        for(p in options){
          if(options.hasOwnProperty(p))
            this[p] = options[p];
        }
      }
      
      exports.Widget.prototype.on = function(ev, handler){
        (this.handlers[ev] = (this.handlers[ev] || [])).push(handler)
      }
    
      exports.Widget.prototype.emit = function(ev, eventdata){
        this.handlers[ev] && this.handlers[ev].forEach(function(h){h(eventdata)})
      }
  }
})
