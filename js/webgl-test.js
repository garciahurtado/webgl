/**
 * WebGL Test
 * 
 * @autor Garcia Hurtado
 * @date Oct/1/2014
 * @link https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 */

// Globals
var gl;
var squareVerticesBuffer;
var vertexPositionAttribute;
var shaderProgram;
var mvMatrix;
var perspectiveMatrix;

function start(){
	initWebGL(document.getElementById("canvas"));

	if(gl){
		gl.clearColor(0.5, 0, 0, 1); // fully black
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.EQUAL);

		initShaders(); // vertex and pixel shaders
		initBuffers(); // build geometry
		setInterval(drawScene, 15);
	}
}

/**
 * Init WebGL
 */	
function initWebGL(canvas){
	gl = null;

	try {
		gl = canvas.getContext("experimental-webgl");
	} catch(e){
		// swallow
	}

	if(!gl){
		alert("Unable to initialize WebGL");
	}
}

/**
 * Vertex data
 */
function initBuffers() {
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene
 */
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  loadIdentity();
  mvTranslate([-0.0, 0.0, -6.0]);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * Init Shaders
 */
function initShaders(){
	var vertexShader = getShader("shader-vs");
	var fragmentShader = getShader("shader-fs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}


/**
 * Shader Loader
 */
function getShader(id) {
  var shaderScript, source, currentChild, shader;
  
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