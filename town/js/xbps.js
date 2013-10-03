/*
*/
var ps_include = function(path){
  var lastScript = document.getElementsByTagName("head")[0].lastChild;
  var fullUrl = lastScript.src.substring(0, lastScript.src.lastIndexOf('/') + 1) + path;
  document.write('<' + 'script');
  document.write(' language="javascript"');
  document.write(' type="text/javascript"');
  document.write(' src="' + fullUrl + '">');
  document.write('</' + 'script' + '>');
}


ps_include('psapi.js');
ps_include('mjs.js');
ps_include('asc.js');
ps_include('psi.js');
ps_include('pts.js');
ps_include('ply.js');
ps_include('hps0.js');
ps_include('psi2.js');