/**
 * WebGL Test
 *
 * A textured cube.
 * 
 * @autor Garcia Hurtado
 * @date Oct/1/2014
 * @link https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 */

// Globals
var gl;

// buffers
var cubeVerticesBuffer;
// var cubeVerticesColorBuffer;
var cubeElementsBuffer;
var cubeVerticesUVBuffer;

// attributes
var vertexPositionAttribute;
var textureUVAttribute;

var shader;
var mvMatrix;
var perspectiveMatrix;
var squareRotation = 0.0;
var squareRotationSpeed = 30;
var lastSquareUpdateTime;
var cubeTexture;
var textureFilterMagChoices = [
  'NEAREST',
  'LINEAR'
];
var textureFilterMinChoices = [
  'NEAREST',
  'LINEAR',
  'NEAREST_MIPMAP_NEAREST',
  'NEAREST_MIPMAP_LINEAR',
  'LINEAR_MIPMAP_NEAREST',
  'LINEAR_MIPMAP_LINEAR'
];
var textureConfig = {
  magFilter: 'LINEAR',
  minFilter: 'LINEAR_MIPMAP_LINEAR'
};
var renderConfig = {
  cameraDist: 4.5
}

function start(){
	initWebGL(document.getElementById("canvas"));

	if(gl){
		gl.clearColor(0, 0, 0, 1); 
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

    initGui();
    initTextures();
		shader = initShaders(); // vertex and pixel shaders
    initAttrs(shader); // init shader attributes
		initBuffers(); // build geometry
		setInterval(drawScene, 15);
	}
}

/**
 * Powered by dat.gui
 */
function initGui(){
  var gui = new dat.GUI({width: 330});
  gui.add(textureConfig, 'magFilter', textureFilterMagChoices).onChange(function(value){
    initTextures();
  });
  gui.add(textureConfig, 'minFilter', textureFilterMinChoices).onChange(function(value){
    initTextures();
  });
  gui.add(renderConfig, 'cameraDist', 2, 7);
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

  gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * Initialize shader attributes
 */
function initAttrs (shader) {
  vertexPositionAttribute = enableAttr("vertexPosition", shader);
  textureUVAttribute = enableAttr("textureCoord", shader);

  // TODO: figure out how to do colored vertices as well as Textures in the same program
  // vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  // gl.enableVertexAttribArray(vertexColorAttribute);
}

/**
 * Vertex data
 */
function initBuffers() {
	// Geometry
  cubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  
  // Cube
  var vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertex colors
  // var colors = [
  //   [1.0,  1.0,  1.0,  1.0],    // Front face: white
  //   [1.0,  0.0,  0.0,  1.0],    // Back face: red
  //   [0.0,  1.0,  0.0,  1.0],    // Top face: green
  //   [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
  //   [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
  //   [1.0,  0.0,  1.0,  1.0]     // Left face: purple
  // ];
  
  // var generatedColors = [];
  
  // for (j=0; j<6; j++) {
  //   var c = colors[j];
    
  //   for (var i=0; i<4; i++) { // paint all 4 vertices of the same face the same color
  //     generatedColors = generatedColors.concat(c);
  //   }
  // }

  // Handle elements
  cubeElementsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeElementsBuffer);
  
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  
  var cubeElements = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];
  
  // Now send the element array to GL
  
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeElements), gl.STATIC_DRAW);
  
  // cubeVerticesColorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

  // Handle UV maps
  cubeVerticesUVBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesUVBuffer);
  
  var textureCoords = [
    0,1,
    1,1,
    1,0,
    0,0
  ];

  // clone the array 6 times over, one for each face, since they all share UVs
  for (var i = 0; i < 6; i++) {
    textureCoords = textureCoords.concat(textureCoords);
  };

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
}

/**
 * Load images for textures via the browser
 */
function initTextures() {
  cubeTexture = gl.createTexture();
  var textureImage = new Image();
  textureImage.src = "./img/stormsite-logo.png";
  textureImage.onload = function() { handleTextureLoaded(textureImage, cubeTexture); };
}

/**
 * Read the texture into the GPU
 */
function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[textureConfig.magFilter]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[textureConfig.minFilter]);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Draw the scene
 */
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  loadIdentity();

  // Now move the drawing position a bit to where we want to start
  // drawing the cube.
  mvTranslate([-0.0, 0.0, - renderConfig.cameraDist]);

  mvPushMatrix();
	mvRotate(squareRotation, [1, 1, 1]);
  
  // vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // Set the texture coordinates attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesUVBuffer);
  gl.vertexAttribPointer(textureUVAttribute, 2, gl.FLOAT, false, 0, 0);

  // colors (TODO)
  // gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
  // gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
  gl.uniform1i(gl.getUniformLocation(shader, "uSampler"), 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeElementsBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

  mvPopMatrix();

  // Rotate the square
  var currentTime = (new Date()).getTime();
  if (lastSquareUpdateTime) {
  	var delta = currentTime - lastSquareUpdateTime;
  	
  	squareRotation += ((squareRotationSpeed) * delta) / 1000.0;
  	// squareRotationSpeed -= delta / 100;
  }
  
  lastSquareUpdateTime = currentTime;
}
