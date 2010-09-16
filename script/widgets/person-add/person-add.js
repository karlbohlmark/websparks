require.define(
{
   "widgets/person-add/person-add" : function(require, exports){
      var Widget = require('widget').Widget;
	  require('model').toObservable('extend', 'person-add', function(model){
        model.addPerson = function () {
          if (this.name() != "") {
            this.people.push(this.name()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
            this.name(""); // Clears the text box, because it's bound to the "itemToAdd" observable
          }
          return false;
        }
      })
      var widget = new Widget('person-add');
      exports.widget = widget;
  }
},["widget", "model"])



