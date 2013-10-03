
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
var ps;
var glacier;
var glacierProgObj;
 
var glacierRot = 0;
 
var buttonDown = false;
var zoomed = -30;
var rot = [0, 0];
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
  glacierRot += 0.05;
   
 
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
 
  ps.useProgram(glacierProgObj);
   
  ps.uniformi('lights0.isOn', true);
  ps.uniformf('lights0.position', [0,0,40]);
  ps.uniformf('lights0.diffuse', [1,1,1]);
   
  ps.pointSize(5);
  ps.translate(0, 0, 0);
  ps.scale(0.01);
  c = glacier.getCenter();
  ps.translate(-c[0], -c[1], -c[2]);
  ps.render(glacier);
  ps.popMatrix();
   
  updateStatus(glacier, 'glacierStatus');
  updatePointCount(glacier, 'glacierNumPoints');
}
 
function start(){
 
    ps = new PointStream();
    ps.setup(document.getElementById('canvas'));
    ps.background('red');
 
    var fragShaderFixed = ps.getShaderStr('shaders/fixed_function.fs');
    var vertShaderFixed = ps.getShaderStr('shaders/fixed_function.vs');
    glacierProgObj = ps.createProgram(vertShaderFixed, fragShaderFixed);
      
    ps.onRender = render
    ps.onMouseScroll = zoom;
    ps.onMousePressed = mousePressed;
    ps.onMouseReleased = mouseReleased;
     
    glacier = ps.load('clouds/glacier.asc');
   
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
})