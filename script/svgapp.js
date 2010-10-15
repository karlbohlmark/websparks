var inputstate = {
  mousedown: false,
  ctrlpressed: false
}

var nodes = new Lawnchair({table: 'nodes'});
var relations = new Lawnchair({table:'relations'});
var edits = [];//new Lawnchair({table:'edits'})

var getRelationId = function(fromNode, toNode){
  return 'from=' + fromNode + '&to=' + toNode;
}

var app = (function(){
  var svgElem
    , handlers = {}
    , nodeHeight = 120
    , nodeWidth = 200
    , nodeColor = '#000000'
    , nodeFill = '#efefef'
    , trigger = function(ev, data){
      var callbacks = handlers[ev]
      data.eventName = ev
      if(callbacks){
        for(var i in callbacks){
          if(callbacks.hasOwnProperty(i))
            callbacks[i].call(this, data)
        }
      }
    }
  ;
  
  var actions = {
    'relationcreated': function(relation){
      var points = getRectangleConnectionPoints(document.getElementById(relation.from), document.getElementById(relation.to))
      var id = getRelationId(relation.from, relation.to)
      points.push({id:id})
      svg.drawConnection.apply(svgElem, points)
    },
    'nodemoved' : function(ev){
      nodes.get(ev.key, function(n){
        n.x = ev.x
        n.y = ev.y
        nodes.save(n)
      })
      edits.unshift(ev)
    },
    'nodecreated' : function(nodeData){
      edits.unshift(nodeData)
      var rect = svg.createElement('rect', nodeData);
      svgElem.appendChild(rect)
    },
    'createnode' : createnode = function(where){
      var x = where.x
        , y = where.y
        , height = nodeHeight
        , width = nodeWidth
        , color = nodeColor
      ;
      var props = {
        "x": x-width/2,
        "y": y - height/2,
        "rx": 20,
        "ry": 20,
        "width": width,
        "height": height,
        "fill": nodeFill,
        "stroke": color,
        "stroke-width": '5',
        "id": (new Date).toString() 
      }      
      props.key = props.id
      nodes.save(props)
      trigger.apply(this, ['nodecreated', props])
    },
    'drag' : (function(){
      var canceller = function(ev){
        return function(){
            ev.cancelled = true
        }
      }
       
       return function(ev){
        var thisApp = this
          , cancel = canceller(ev)
          
        svgElem.addEventListener('mouseup', cancel)
        setTimeout(function(){
          svgElem.removeEventListener('mouseup', cancel)
          if(ev.cancelled){
            trigger.apply(thisApp, ['select', ev])
            return
          }
          
          var element = ev.target
            , id = element.getAttributeNS(null, 'id')
            , nodeRelations = []
            , oldx = element.getAttributeNS(null, 'x')
            , oldy = element.getAttributeNS(null, 'y')
          relations.each(function(r){
            if(r.from == id || r.to == id){
              nodeRelations.push(r)
            }
          })
          
          var dragElement = (function(element, nodeRelations, app){
            return function(ev){
              element.setAttributeNS(null, "x", ev.x - element.attributes.width.value/2)
              element.setAttributeNS(null, "y", ev.y - element.attributes.height.value/2)
              for(var r in nodeRelations){
                r = nodeRelations[r]
                var path = document.getElementById(r.key)
                path.parentNode.removeChild(path)
                trigger.apply(thisApp, ['relationcreated', r])
              }
            }
          })(element, nodeRelations, thisApp)
          
          document.onmousemove = dragElement
          
          document.onmouseup = function(ev){
            trigger.apply(thisApp, ['nodemoved', {key: element.id, x: element.getAttributeNS(null, 'x'), y: element.getAttributeNS(null, 'y'), oldx:oldx, oldy:oldy}])
            document.onmousemove = null
            document.onmouseup = null
          }
        }, 100)
      }
    })(),
    'select' : (function(){
      var selected = null
      return function(ev){
        var thisApp = this
        if(selected){
          var relation = {
            key: getRelationId(selected.id, ev.target.id),
            from : selected.id,
            to: ev.target.id
          }
          relations.save(relation)
          trigger.apply(thisApp, ['relationcreated', relation])
          edits.unshift({eventName:'relationcreated', from: relation.from, to:relation.to})
          selected.setAttributeNS(null, "stroke-width", '5px')
          selected = null
        }else{
          selected = ev.target
          selected.setAttributeNS(null, "stroke-width", '7px')
        }
      }
    })()
  };
  
  for(var action in actions){
    if(!handlers[action])
      handlers[action] = []
      
    handlers[action].push(actions[action])
  }
 
  return {
    run: function(parentElem){
      var thisApp = this
      svgElem = svg.createElement('svg')
      parentElem.appendChild(svgElem)
      
      nodes.each(function(node){
        if(typeof node.push === "function" && node.length>0) node = node[0]
        trigger.apply(thisApp, ['nodecreated', node])
      })
      
      relations.each(function(relation){
        if(typeof relation.push === "function" && relation.length>0) relation = relation[0]
        trigger.apply(thisApp, ['relationcreated', relation])
      })
      
      svgElem.addEventListener('mousedown', function(ev){
        if(ev.which!=1) return
        if(ev.target.toString().toUpperCase().match(/RECT/)==null)
        {
          trigger.apply(thisApp, ['createnode', {x:ev.pageX, y: ev.pageY}])
        }else{
          trigger.apply(thisApp, ['drag', {target: ev.target}])
        }
      })
      
      document.onkeydown = function(ev){
        if(ev.which=='z'.charCodeAt(0) || ev.which=='Z'.charCodeAt(0)){
          var edit = edits.shift()
          if(edit.eventName==='nodemoved'){
            var element = document.getElementById(edit.key)
            element.setAttributeNS(null, 'x', edit.oldx)
            element.setAttributeNS(null, 'y', edit.oldy)
          }
        }
      }
    }
  };
})();
