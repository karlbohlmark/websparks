var halfway = function(here, there){
  return {
    x: here.x + (there.x - here.x)/2,
    y: here.y + (there.y - here.y)/2
  }
}

var createRectangle = function(x, y, width, height, color){
  var rect = document.createElementNS(ns.svg, 'rect')
  console.log(x)
  console.log(y)
  
  var attrs = {
    "x": x-width/2,
    "y": y - height/2,
    "rx": 20,
    "ry": 20,
    "width": width,
    "height": height,
    "fill": '#efefef',
    "stroke": color,
    "stroke-width": '5',
    "opacity": '0.7'
  }
  
  for(attr in attrs){
    rect.setAttributeNS(null, attr, attrs[attr])
  }
  return rect;
}