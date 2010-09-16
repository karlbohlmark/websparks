require.define({
  'app' : function(require, exports){
    console.log("factory for app")
    var ko = require('knockout').ko
        , u = require('util')
        , when = u.when
        , Promise = u.Promise
        , pipe = require('pipe').pipe
        , template = require('template')
        , toObservable = require('model').toObservable
	      , layout = require('layout')
	      , sammy = require('lib/sammy/sammy').sammy
    ;
	
    var databind = function(name, templateEngine){
      return function(element){
        var p = new Promise()
        resource.getModel(name, function(model){
          var observableModel = toObservable(name, model);
		      templateEngine.databind(element, observableModel)
		      p.resolve(undefined)
        })
        return p
      }
    }
    
    var initView = function(name){
  		var widget = require("widgets/" + name + '/'+ name).widget;;
  		var templateEngine = template.engine(widget.templateEngine)
  		var currentWidget = $('#workspace [data-widget]:visible');
  		
  		if(currentWidget.attr('data-widget')===name)
  			return;
  		
  		if(currentWidget.length>0){
  			currentWidget.hide();
  		}
  		
  		alreadyInstantiated = $('#workspace [data-widget=' + name +']');
  		if(alreadyInstantiated.length>0){
  			alreadyInstantiated.show();
  			return;
  		}
  		
  		resource.getTemplate(name, 
  			function(template){
  				var element = layout.addWidgetToWorkspace(name)(template), 
  				    databound = databind(name, templateEngine)(element)
			    
			    when(databound, function(){
		        widget && widget.emit('databound', element)
		      })
  			}
  		)
    }
	
	  var app = sammy(function() {
        this.get('#/view/:view', function() {
          initView(this.params['view'])
        });

        this.get('#/test', function() {
          $('#main').text('Hello World');
        });

    });
    
    exports.run = function(){
		  
		  var widgets = [];
		  ['cv', 'cv-custom', 'skill-add', 'person-add', 'people-search'].forEach(function(widgetName){
	       var widget = require("widgets/name/name".replace(/name/g, widgetName)).widget;
		   widgets.push({title: widgetName, action: '#/view/' + widgetName});
		  })
		  
		  var menu = require('menu');
		  menu.registerItems(widgets);
		  
		  $('#context').html('').append(menu.menu);
		  
		  app.run('#/view/skill-add');
		  //initView("skill-add")
    }  
  }
}, [
    "core",
    "template",
    "template-engines/knockout",
    "template-engines/spark",
	  "lib/sammy/sammy", 
	  "menu",
	  "widgets/cv/cv",
	  "widgets/cv-custom/cv-custom",
    "widgets/skill-add/skill-add", 
    "widgets/person-add/person-add",
    "widgets/people-search/people-search",
    "layout",
    "editable"
   ]
) 

/*
    var databind = function(){
        resource.getModel('add-skill', function(model){
          var observableModel = $m.toObservable("add-skill", model);
          ko.applyBindings(document.body, observableModel);
        })
    }

    $(function() {

      resource.getTemplate('add-skill', 
        steps($u.appendTo('#workspace'), databind)
      )
  
      alert(typeof addskill);
*/