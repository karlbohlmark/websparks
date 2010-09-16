require.define(
{
    'template-engines/spark': function(require, exports){
        var spark = require('lib/spark')
        exports.databind = function(element, model){
            element.innerHTML = spark.render(element.innerHTML, model)
        }
    }
},['lib/spark']);