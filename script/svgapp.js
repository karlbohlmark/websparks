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
    , generateGuid = function(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
       }).toUpperCase();
    }
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
    , moveElement = function(x, y, element, nodeRelations, app){
      element.setAttributeNS(null, "x", x)
      element.setAttributeNS(null, "y", y)
      for(var r in nodeRelations){
        r = nodeRelations[r]
        var path = document.getElementById(r.key)
        path.parentNode.removeChild(path)
        trigger.apply(app, ['relationcreated', r])
      }
    }
    , getNodeRelations = function(id){
        var nodeRelations = []
        relations.each(function(r){
          if(r.from == id || r.to == id){
            nodeRelations.push(r)
          }
        })
        return nodeRelations
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
        "id": generateGuid() 
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
            , nodeRelations = getNodeRelations(id)
            , oldx = element.getAttributeNS(null, 'x')
            , oldy = element.getAttributeNS(null, 'y')
          ;
          
          
          var dragElement = (function(element, nodeRelations, app){
            return function(ev){
              moveElement(ev.x - parseInt(element.attributes.width.value)/2, ev.y - parseInt(element.attributes.height.value)/2, element, nodeRelations, app)
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
          var key = getRelationId(selected.id, ev.target.id)
            , relation = {
                key: key
              , from : selected.id
              , to: ev.target.id
            }
          ;
          relations.save(relation)
          trigger.apply(thisApp, ['relationcreated', relation])
          edits.unshift({eventName:'relationcreated', from: relation.from, to:relation.to, key: key})
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
  
  var undos = {
    'nodemoved' : function(edit){
      var element = document.getElementById(edit.key)
      var id = edit.key
        , nodeRelations = getNodeRelations(id)
        
      nodes.get(id, function(node){
        node.x = edit.oldx
        node.y = edit.oldy
        nodes.save(node)
      })
      
      moveElement(parseInt(edit.oldx), 
        parseInt(edit.oldy), 
        element, nodeRelations, this
      )
    }
    , 'nodecreated' : function(edit){
      var id = edit.id
        , element = document.getElementById(id)
       
      element.parentNode.removeChild(element)
      nodes.remove(id)
    }
    , 'relationcreated' : function(edit){
      var id = edit.key
        , element = document.getElementById(id)
      relations.remove(id)
      element.parentNode.removeChild(element)
    }
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
      
      edits.length = 0
      
      document.onkeydown = function(ev){
        if(ev.which=='z'.charCodeAt(0) || ev.which=='Z'.charCodeAt(0)){
          var edit = edits.shift()
            , undoAction
          edit && (undoAction = undos[edit.eventName])
          undoAction && undoAction.call(this, edit)
        }
      }
    }
  };
})();
