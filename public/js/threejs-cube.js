/**
 * ThreeJS demo - Textured Cube
 * http://threejs.org/
 */

$(document).ready(function() {
	var tjs = THREE;
	var config = {
		textureFilterMagChoices: [
		  'NEAREST',
		  'LINEAR'
		],
		textureFilterMinChoices: [
		  'NEAREST',
		  'LINEAR',
		  'NEAREST_MIPMAP_NEAREST',
		  'NEAREST_MIPMAP_LINEAR',
		  'LINEAR_MIPMAP_NEAREST',
		  'LINEAR_MIPMAP_LINEAR'
		],
	  magFilter: 'LINEAR',
	  minFilter: 'LINEAR_MIPMAP_LINEAR',
  	cubeDist: 3
  }

	var scene = new tjs.Scene();
	var camera = new tjs.PerspectiveCamera(45, 640.0/480.0, 0.1, 100);

	var canvas = document.getElementById('canvas');
	//renderer = new tjs.CanvasRenderer({canvas: c.get(0)});

	var renderer = new tjs.WebGLRenderer({canvas: canvas});
	renderer.setSize(640, 480);

	var geometry = new tjs.BoxGeometry(1,1,1);
	var material = new tjs.MeshPhongMaterial({
        map: tjs.ImageUtils.loadTexture('img/stormsite-logo.png'),
       	bumpMap:  tjs.ImageUtils.loadTexture('img/stormsite-logo-bump.png'),
      });
	var cube = new tjs.Mesh( geometry, material );
	scene.add( cube );

	// add subtle ambient lighting
  var ambientLight = new tjs.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  // directional lighting
  var directionalLight = new tjs.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

	initGui();
	render();

	/**
	 * Render loop. Calls itself recursively via RAF
	 */
	function render() {
		requestAnimationFrame(render);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		cube.position.z = (-config.cubeDist);
		renderer.render(scene, camera);
	}

	/**
	 * Powered by dat.gui
	 */
	function initGui(){
	  var gui = new dat.GUI({width: 330});
	  gui.add(config, 'magFilter', config.textureFilterMagChoices);
	  gui.add(config, 'minFilter', config.textureFilterMinChoices);
	  gui.add(config, 'cubeDist', 2, 7);
	}
});

