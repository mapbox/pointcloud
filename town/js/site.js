var ps;
var town;
var townProgObj;

var townRot = 0;

var buttonDown = false;
var zoomed = -15;
var rot = [0, -20];
var curCoords = [0, 0];

function zoom(amt){
  zoomed += amt * 2 * -1;
}

function mousePressed(){
  curCoords[0] = ps.mouseX;
  curCoords[1] = ps.mouseY;
  buttonDown = true;
}

function mouseReleased(){
  buttonDown = false;
}

function updateStatus(cloud, str){
  var status = document.getElementById(str);
  status.innerHTML = '';
  switch(cloud.getStatus()){
    case 1: status.innerHTML = 'STARTED';break;
    case 2: status.innerHTML = 'STREAMING';break;
    case 3: status.innerHTML = 'COMPLETE';break;
    default:break;
  }
}

function updateProgress(cloud, str){
  var prog = document.getElementById(str);
  prog.innerHTML = Math.floor(cloud.getProgress()*100) + '%';
}

function updatePointCount(cloud, str){
  var numPoints = cloud.getNumPoints();
  if(numPoints >= 0){
    var elem = document.getElementById(str);
    elem.innerHTML = numPoints;
  }
}

function render() {
  townRot += 0.05;
  

  var deltaX = ps.mouseX - curCoords[0];
  var deltaY = ps.mouseY - curCoords[1];
  
  if(buttonDown){
    rot[0] += deltaX / ps.width * 5;
    rot[1] += deltaY / ps.height * 5;
    
    curCoords[0] = ps.mouseX;
    curCoords[1] = ps.mouseY;
  }

  ps.clear();
  
  // users transformations with mouse & kb
  ps.translate(0, 0, zoomed);  
  ps.rotateY(rot[0]);
  ps.rotateX(rot[1]);
  ps.pointSize(8);
  ps.pushMatrix();
  
  ps.uniformi('uOutline', false);

  ps.useProgram(townProgObj);
  
  ps.uniformi('lights0.isOn', true);
  ps.uniformf('lights0.position', [0,0,40]);
  ps.uniformf('lights0.diffuse', [1,1,1]);
  
  ps.pointSize(2);
  ps.translate(0, 0, 0);
  ps.scale(0.01);
  c = town.getCenter();
  ps.translate(-c[0], -c[1], -c[2]);
  ps.render(town);
  ps.popMatrix();
  
  updateStatus(town, 'townStatus');
  updatePointCount(town, 'townNumPoints');
}

function start(){

    ps = new PointStream();
    ps.setup(document.getElementById('canvas'));
    ps.background('red');

    var fragShaderFixed = ps.getShaderStr('shaders/fixed_function.fs');
    var vertShaderFixed = ps.getShaderStr('shaders/fixed_function.vs');
    townProgObj = ps.createProgram(vertShaderFixed, fragShaderFixed);
     
    ps.onRender = render
    ps.onMouseScroll = zoom;
    ps.onMousePressed = mousePressed;
    ps.onMouseReleased = mouseReleased;
    
    town = ps.load('clouds/town.asc');
  
}

$(function(){
  // Check for canvas
  try {
    document.createElement('canvas').getContext('2d');
    start()
  } catch (e) {
    $('body').append('Your browser does not support this demo. Here is what you are missing:')
    $('body').append('<img src="css/error.gif" id="no-canvas" />')
  }
});