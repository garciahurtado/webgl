/**
 * Collection of common WebGL utility functions to reduce boilerplate
 *
 * @author Garcia Hurtado
 */

/**
 * Init Shaders
 */
function initShaders(){
	var vertexShader = getShader("shader-vs");
	var fragmentShader = getShader("shader-fs");

	shader = gl.createProgram();
	gl.attachShader(shader, vertexShader);
	gl.attachShader(shader, fragmentShader);
	gl.linkProgram(shader);

	if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }

  gl.useProgram(shader);
  return shader;
}

/**
 * Enables a OpenGL shader attribute, referred to by the variable name "attrName" in
 * shader source, and returns the index of this new attribute, so it can be bound to a 
 * buffer later.
 */
function enableAttr(attrName, shader){
  var index = null;

  index = gl.getAttribLocation(shader, attrName);
  gl.enableVertexAttribArray(index);

  if(index == null){
    throw "Unable to enable attribute '" + attrName + "'";
  }
  return index;
}


/**
 * Shader source code loader from script tag. You pass it the DOM ID of the element
 * which is used to load the text contents of the script tag. The mime-type of the
 * script tag will be used to determine the kind of shader to create and compile.
 */
function getShader(id) {
  shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  source = "";
  currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      source += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
     // Unknown shader type
     return null;
  }

  gl.shaderSource(shader, source);
    
  // Compile the shader program
  gl.compileShader(shader);  
    
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
      return null;  
  }
    
  return shader;
}