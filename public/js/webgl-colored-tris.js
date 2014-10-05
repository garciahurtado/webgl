/**
 * WebGL Test
 * Two color tris based on a 2D drawing made by Chia. Him and I figured out the coordinates 
 * for the 6 points and entered them into the script together.
 * 
 * @autor Garcia Hurtado
 * @date Oct/2/2014
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
var rotation = 100.0;
var config = {
  rotationSpeed: 100,
  rotateX: false,
  rotateY: true,
  rotateZ: false
}
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
    initGui();

		setInterval(drawScene, 15);
	}
}

function initGui () {
  var gui = new dat.GUI();
  gui.add(config, 'rotationSpeed', 0, 2000);
  gui.add(config, 'rotateX');
  gui.add(config, 'rotateY');
  gui.add(config, 'rotateZ');
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
    2,3,0,
    3,2,0,
    1.5,2.25,0,
    3,2,0,
    4,0,0,
    1.25,0,0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertex colors
  var colors = [
    0x05 / 255, 0x7D / 255, 0x9F / 255,  1.0,
    0xFF / 255, 0xB3 / 255, 0x00 / 255,  1.0,
    0xFF / 255, 0x23 / 255, 0x00 / 255,  1.0,
    0xEB / 255, 0x3B / 255, 0x8B / 255,  1.0,
    0x64 / 255, 0xDE / 255, 0x89 / 255,  1.0,
    0x97 / 255, 0xA3 / 255, 0x00 / 255,  1.0
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
  mvTranslate([-0.0, 0.0, -10.0]);

  mvPushMatrix();
	mvRotate(rotation, [config.rotateX, config.rotateY, config.rotateZ]);
  
  // vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // colors
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  setMatrixUniforms(shader);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  mvPopMatrix();

  // Rotate the square
  var currentTime = (new Date).getTime();
  if (lastSquareUpdateTime) {
  	var delta = currentTime - lastSquareUpdateTime;
  	
  	rotation += (config.rotationSpeed * delta) / 1000.0;
  	//rotationSpeed -= delta / 10;
  }
  
  lastSquareUpdateTime = currentTime;
}
