require.define(
{
   "widgets/skill-add/skill-add" : function(require, exports){
      require('model').toObservable('extend', 'skill-add', function(model){
        model.addItem = function () {
          if (this.itemToAdd() != "") {
            this.items.push(this.itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
            this.itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable
          }
          return false;
        }
      })
      var widget = new (require('widget').Widget)('skill-add');
      widget.on('databound', function(){alert('yay I got data')})
      exports.widget = widget;
  }
},["widget", "model"])



