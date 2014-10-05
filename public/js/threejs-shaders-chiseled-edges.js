/**
 * ThreeJS demo - Textured Cube
 * http://threejs.org/
 */

$(document).ready(function() {
	var config = {
		cubeColor: 0,
  	cubeDist: 2.9,
  	rotate: true,
  	cubeRotationSpeed: 5,
  	edgeWidth: 0.08,
  	jitter: 0.5
  }

  var shader = {
  	edgeWidth: 0 // total rendered edge width, including jitter
  }

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, 640.0/480.0, 0.1, 100);
	var canvas = $('#canvas');

	var renderer = new THREE.WebGLRenderer({canvas: canvas[0]});
	renderer.setSize(640, 480);

	var geometry = new THREE.BoxGeometry(1,1,1);
	var texture = THREE.ImageUtils.loadTexture('img/stormsite-logo.png');
	var material;

	initMaterials();

	var posX;
	var posY;
	var scale;

	var cubes = [];
	var cube = new THREE.Mesh( geometry, material );
	posX = posY = posZ = 0;
	cube.position.set(posX, posY, posZ + config.cubeDist);
	scene.add( cube );
	cubes.push(cube);
	// var cube2 = cube.clone();
	// cube2.translateZ(0.1);	
	// scene.add(cube2);

	initGui();
	render();

	function initMaterials() {
		material = new THREE.ShaderMaterial({
      uniforms: {
				edgeWidth: {type: 'f', value: shader.edgeWidth},
      	cubeColor: {type: 'f', value: config.cubeColor},
				texture: {type: 't', value: texture},
			},
			vertexShader: $('#vertexShader').text(),
			fragmentShader: $('#fragmentShader').text(),
			transparent: true,
			side: THREE.DoubleSide,
			depthTest: false, 
			alphaTest: 0.5
    });

    // in case we need to change any of the immutable propers, ie: shaders or textures
    material.needsUpdate = true; 
	}
	/**
	 * Render loop. Calls itself recursively via RAF
	 */
	function render() {

		var jitterDelta = Math.random() * config.jitter;
		shader.edgeWidth = config.edgeWidth + jitterDelta;

		if(config.rotate){
			deltaRotation = config.cubeRotationSpeed / 1000;
			cubes.forEach(function(cube){
				cube.rotation.x += deltaRotation;
				cube.rotation.y += deltaRotation;	
				cube.position.z = (-config.cubeDist);
			});
		}

		config.cubeColor += 0.001;
		material.uniforms.edgeWidth.value = config.edgeWidth;

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	/**
	 * Powered by dat.gui
	 */
	function initGui(){
	  var gui = new dat.GUI({width: 330});
	  gui.add(config, 'rotate');
	  gui.add(config, 'cubeDist', 0.5, 5);
	  gui.add(config, 'edgeWidth', 0.05, 0.5);
	}
});

