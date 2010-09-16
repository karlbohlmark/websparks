require.define(
{
    'model': function(require, exports){
     
      var modelExtensions = {}, ko = require('knockout').ko;
    
      var extendModel = function(modeltype, extension){
        var currentExtension = modelExtensions[modeltype];
        if(typeof currentExtension === "undefined")
          modelExtensions[modeltype] = [];
        
        modelExtensions[modeltype].push(extension)
      }
      
      var toObservable = function(modelType, model){
        if(arguments[0]==="extend" && arguments.length===3){
          return extendModel(arguments[1], arguments[2]);
        }
        
        
        for(var p in model){
          if($.isArray(model[p])){
            model[p] = ko.observableArray(model[p])
          }else{
            model[p] = ko.observable(model[p])
          }
        }
		
		var extensions = modelExtensions[modelType];
		if(extensions){
			for(e in extensions){
				extensions[e].apply({}, [model]);
			}
		}
		
        return model;
      }
    
      exports.extendModel = extendModel;
      exports.toObservable = toObservable;
    }
}, ["knockout"]);