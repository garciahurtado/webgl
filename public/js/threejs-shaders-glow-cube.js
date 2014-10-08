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
  	edgeWidth: 0.1,
  	jitter: 0.5,
  	time: 0
  }

  // Pass time variable to the shader
  var clock = new THREE.Clock();

  var shader = {
  	edgeWidth: 0 // total rendered edge width, including jitter
  }

  var width = 640;
  var height = 480;

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 100);
	var canvas = $('#canvas');

	var renderer = new THREE.WebGLRenderer({canvas: canvas[0]});
	renderer.setSize(width, height);

	var geometry = new THREE.BoxGeometry(1,1,1);
	var texture = THREE.ImageUtils.loadTexture('img/stormsite-logo.png');
	var material;
	var composers;

	initMaterials();

	var posX;
	var posY;
	var posZ;
	var scale;

	var cube = new THREE.Mesh( geometry, material );
	posX = posY = posZ = 0;

	cube.position.set(posX, posY, posZ + config.cubeDist);
	scale = (Math.random() * 0.1)	 + 0.2;
	// cube.scale.set(scale,scale,scale);
	scene.add( cube );

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
	composers = compose({blur: true});
	render();

	/**
	 * Functions
	 */
	function initMaterials() {
		material = new THREE.ShaderMaterial({
      uniforms: {
				edgeWidth: {type: 'f', value: shader.edgeWidth},
      	cubeColor: {type: 'f', value: config.cubeColor},
				texture: {type: 't', value: texture},
				time: { type: 'f', value: config.time },
			},
			vertexShader: $('#vertexShader').text(),
			fragmentShader: $('#fragmentShader').text(),
			transparent: true,
			side: THREE.DoubleSide,
			depthTest: false, 
			alphaTest: 0.5,
			blending: THREE.AdditiveBlending
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
			cube.rotation.x += deltaRotation;
			cube.rotation.y += deltaRotation;	
		}
		cube.position.z = (-config.cubeDist);

		material.uniforms.edgeWidth.value = config.edgeWidth;
		material.uniforms.time.value += clock.getDelta();

		composers.forEach(function(composer){
		    composer.render();
		});
	}

	/**
	 * Create the rendering pipeline using several composers and shaders
	 */
	function compose(options){
    var composerList = [];
		var targetOpts = { 	
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
		 	format: THREE.RGBFormat
		};

    var blurTarget = new THREE.WebGLRenderTarget(width, height, targetOpts);
    var cubeTarget = new THREE.WebGLRenderTarget(width, height, targetOpts);

    // Main composer
    var blurComposer = new THREE.EffectComposer( renderer, blurTarget  );
    var renderPass = new THREE.RenderPass( scene, camera );
    blurComposer.addPass( renderPass );

    if (options && options.blur === true) {
        var blurFactor = 1.0;

        // Prepare the blur shader passes
        var hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
        hblur.uniforms[ "h" ].value = blurFactor / width;
        blurComposer.addPass(hblur);

        var vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
        vblur.uniforms[ "v" ].value = blurFactor / height;
        blurComposer.addPass( vblur );

        // Dial up the brightness
		    var brightness = new THREE.ShaderPass( THREE.BrightnessContrastShader );
		        brightness.uniforms.brightness.value = 0.3;
		        brightness.uniforms.contrast.value = 0.6;
				blurComposer.addPass( brightness );
    }
    var copy = new THREE.ShaderPass( THREE.CopyShader);
		copy.uniforms["opacity"].value = 0.1;
    blurComposer.addPass( copy );
    composerList.push(blurComposer);

    // Normal geometry composer
    var cubeComposer = new THREE.EffectComposer(renderer, cubeTarget);
    cubeComposer.addPass( new THREE.RenderPass( scene, camera ));

    var color = new THREE.ShaderPass( THREE.ColorifyShader);
    cubeComposer.addPass(color);

		var copy = new THREE.ShaderPass( THREE.CopyShader );
		copy.uniforms["opacity"].value = 1;
    cubeComposer.addPass( copy );
    composerList.push(cubeComposer);

    // Final composer: combines the edge shader and blur composer into final image
    var blendPass = new THREE.ShaderPass( THREE.AdditiveBlendShader);
    blendPass.uniforms[ 'tDiffuse1' ].value = blurTarget;
    blendPass.uniforms[ 'tDiffuse2' ].value = cubeTarget;
    var blendComposer = new THREE.EffectComposer( renderer );
    blendComposer.addPass( blendPass );
    blendPass.renderToScreen = true;

    composerList.push(blendComposer);

    return composerList;
	};

	/**
	 * Powered by dat.gui
	 */
	function initGui(){
	  var gui = new dat.GUI();
	  gui.add(config, 'rotate');
	  gui.add(config, 'cubeDist', 0.5, 5);
	  gui.add(config, 'edgeWidth', 0.03, 0.3);
	}
});

