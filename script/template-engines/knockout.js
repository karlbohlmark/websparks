require.define(
{
    'template-engines/knockout': function(require, exports){
        var ko = require('knockout').ko
        exports.databind = function(element, model){
            var f = ko.applyBindings;
            console.log(typeof f)
            f(element, model)
        }
    }
},['knockout']);