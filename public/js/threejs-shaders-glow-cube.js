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

	var cubes = [];
	var posX;
	var posY;
	var scale;

	var maxBoxes = 1;

	for (var i = 0; i < maxBoxes; i++) {
		var cube = new THREE.Mesh( geometry, material );
		posX = Math.random() - 0.5;
		posY = Math.random() - 0.5;
		posZ = Math.random() - 0.5;
		// posX = posY = posZ = 0;
		
		cube.position.set(posX, posY, posZ + config.cubeDist);
		scale = (Math.random() * 0.1)	 + 0.2;
		// cube.scale.set(scale,scale,scale);
		scene.add( cube );
		cubes.push(cube);
	};

	var cube2 = new THREE.Mesh(geometry, material);
	cube2.position.set(0.5,0.5,config.cubeDist);
	cube2.scale.set(0.5,0.5,0.5);
	cube2.position.x = 1;
	scene.add(cube2);

	// add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  // directional lighting
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Create light
	var pointLight = new THREE.PointLight(0xffffff, 1.0);
	// We want it to be very close to our character
	pointLight.position.set(0.0,0.0,0.1);
	scene.add(pointLight);

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
			alphaTest: 0.5,
			blending: THREE.CustomBlending,
			blendSrc: THREE.DestAlphaFactor,
			blendDest: THREE.OneFactor
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

		requestAnimationFrame(render);
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
	}

	/**
	 * Powered by dat.gui
	 */
	function initGui(){
	  var gui = new dat.GUI();
	  gui.add(config, 'rotate');
	  gui.add(config, 'cubeDist', 0.5, 5);
	  gui.add(config, 'edgeWidth', 0.05, 0.5);
	}
});

