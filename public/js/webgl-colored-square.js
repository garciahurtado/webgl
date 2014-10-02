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
var squareVerticesColorBuffer;

var vertexPositionAttribute;
var vertexColorAttribute;

var shader;
var mvMatrix;
var perspectiveMatrix;
var squareRotation = 0.0;
var squareRotationSpeed = 300;
var lastSquareUpdateTime;

function start(){
	initWebGL(document.getElementById("canvas"));

	if(gl){
		gl.clearColor(0, 0, 0, 1); 
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		shader = initShaders(); // vertex and pixel shaders
    initAttr(shader);
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
		gl = canvas.getContext("webgl");
	} catch(e){
		// swallow
	}

	if(!gl){
		alert("Unable to initialize WebGL");
	}
}


/**
 * Initialize shader attributes
 */
function initAttr (shader) {
  vertexPositionAttribute = enableAttr("vertexPosition", shader);
  vertexColorAttribute = enableAttr("vertexColor", shader);
}

/**
 * Vertex data
 */
function initBuffers() {
	// Geometry
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertex colors
  var colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0     // blue
  ];
  
  squareVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

/**
 * Draw the scene
 */
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  loadIdentity();
  mvTranslate([-0.0, 0.0, -3.0]);

  mvPushMatrix();
	mvRotate(squareRotation, [1, 0, 0]);
  
  // vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // colors
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  setMatrixUniforms(shader);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  mvPopMatrix();

  // Rotate the square
  var currentTime = (new Date).getTime();
  if (lastSquareUpdateTime) {
  	var delta = currentTime - lastSquareUpdateTime;
  	
  	squareRotation += ((squareRotationSpeed) * delta) / 1000.0;
  	squareRotationSpeed -= delta / 10;
  }
  
  lastSquareUpdateTime = currentTime;
}
