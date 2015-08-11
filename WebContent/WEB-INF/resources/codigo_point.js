var camera, scene, renderer, geometry, material, objmesh, mesh, light1, stats;
var posxant, posyant, poszant;
var angx, angy, dir, mov, axisHelper, headlight, spotlight, cx, cy, cz;
var radio= 15;
var crad, phi, psi;
var t_x, t_y, t_z, t_phi, t_psi, t_delta_phi, t_delta_psi, t_radio;
var inv= 1;
var particleSize = 0.2;
var parseStlBinaryToParticle;
var ruta_lib = "ruta_lib_three";
var ruta_jquery = "ruta_lib_jquery";
var ruta_obj = "ruta_objeto_3D";

var id_canvas = "id_canvas";
cargarLibrerias();

function cargarLibrerias() {
var scripts = document.getElementsByTagName('script');
var encontrado = false;
if ( scripts.length ) {
	var elem = scripts.length;
	for (var i=0; i < elem; i++) {
		if ( elem.href != undefined && (elem.href.indexOf('jquery.js')||elem.href.indexOf('jquery.min.js' ))) {
			encontrado = true;
			break;
		}
	}
}

if ( !encontrado ) {
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	s.src = ruta_jquery;
	var x = document.getElementsByTagName('head')[0];
	x.appendChild(s);
}

encontrado = false;
scripts = document.getElementsByTagName('script');
if ( scripts.length ) {
	var elem = scripts.length;
	for (var i=0; i < elem; i++) {
		if ( elem.href != undefined && (elem.href.indexOf('three.js')||elem.href.indexOf('three.min.js' ))) {
			encontrado = true;
			break;
		}
	}
}
if ( encontrado ) {
	createScreen();
} else {
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	s.src = ruta_lib;
	s.onload = function(script){
        createScreen();
    };
	var x = document.getElementsByTagName('head')[0];
	x.appendChild(s);
}
}	

function trim (str) {
	str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
	    if (/\S/.test(str.charAt(i))) {
	        str = str.substring(0, i + 1);
	        break;
	    }
	}
	return str;
}
		
function cargarContenido() {
	t_x = $('#x');
	t_y = $('#y');
	t_z = $('#z');
	t_phi = $('#phi');
	t_psi = $('#psi');
	t_delta_phi = $('#delta_phi');
	t_delta_psi = $('#delta_psi');
	t_radio = $('#radio');
	var angulo = 60;
	var aspecto = window.innerWidth / window.innerHeight;
	
	var maximo = cz*2;
	if ( maximo*aspecto < cx*2 ) {
		maximo = cx*2 / aspecto;
	}
	radio = maximo / (2*Math.tan(angulo * Math.PI / 360));
	if (radio < cy) {
		radio+=cy;
	}
	camera = new THREE.PerspectiveCamera( angulo, aspecto, 0.1, radio+(maximo*1000) );
	camera.position.z = radio;
	scene.add( camera );
	
	phi=0;
	psi=0;
	
	scene.add( new THREE.AmbientLight( 0x222222 ) );
	headlight = new THREE.PointLight( 0xffffff );
	scene.add(headlight);
	
	axisHelper = getAxisHelpers();
	scene.add( axisHelper );
	
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x555555, 1);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	var elem = renderer.domElement;
	anadirEventos(elem);
	
	
	if (id_canvas == 'body') {
		document.body.appendChild(elem);
	} else {
		document.getElementById(id_canvas).appendChild(elem);
	}
	document.oncontextmenu=function(){return false};
	
	animate();
}

function createScreen() {				
	scene = new THREE.Scene(); 
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	    if ( xhr.readyState == 4 ) {
	        if ( xhr.status == 200 || xhr.status == 0 ) {
				parseStlBinaryToParticle(xhr.responseText);
				cargarContenido();
				camera.lookAt( axisHelper.position );
	        }
	    }
	};
	
	xhr.onerror = function(e) {
	    console.log(e);
	};
	
	xhr.open( "GET", ruta_obj,true);
	xhr.setRequestHeader("Accept","text/plain");
	xhr.setRequestHeader("Content-Type","text/plain");
	xhr.setRequestHeader('charset', 'x-user-defined');
	xhr.send( null );
}

function animate() {
	requestAnimationFrame( animate );
	render();
	
	
	t_x.html(camera.position.x);
	t_y.html(camera.position.y);
	t_z.html(camera.position.z);
	t_phi.html(phi);
	t_psi.html(psi);
	t_radio.html(radio);
}

function render() {
	headlight.position.copy( camera.position );
	renderer.render( scene, camera );
}

function anadirEventos(elem) {
	 var startx = 0;
	 angx = 2*Math.PI / window.innerWidth;
	 angy = 2*Math.PI / window.innerHeight;
	
	 elem.addEventListener('touchstart', function(e){
		  var touchobj = e.changedTouches[0]; 
		  startx = parseInt(touchobj.clientX); 
		  e.preventDefault();
	 }, false);
	 
	 elem.addEventListener('touchmove', function(e){
		  var touchobj = e.changedTouches[0];
		  var dist = parseInt(touchobj.clientX) - startx;			  
		  e.preventDefault();
	 }, false);
	 
	 elem.addEventListener('touchend', function(e){
	  var touchobj = e.changedTouches[0]; 
	  e.preventDefault();
	 }, false);
	 
	 elem.addEventListener('mousedown', function(e){
		mov= e.which;
		comienzoMovimiento(e);
		e.preventDefault();
	 }, false);
	 
	 elem.addEventListener('DOMMouseScroll', function(e){
	  escalarObjeto(e);
	  e.preventDefault();
	 }, false);
}

function rotar(posx, posy, posxant, posyant) {
	if (mesh) {
		mesh.rotation.y += (posxant-posx)*angx;
		mesh.rotation.x += (posyant-posy)*angy;
	}
	renderer.render( scene, camera );
}

function rotarcamara(posx, posy, posxant, posyant) {
	if (camera) {
		var delta_phi = (posxant-posx)*angx;
		var delta_psi = (posyant-posy)*angy;
		t_delta_phi.html(delta_phi);
		t_delta_psi.html(delta_psi);
		phi+=delta_phi*camera.up.y;
		psi+=delta_psi*camera.up.y;
	
		if ( psi > Math.PI/2 || psi <= -Math.PI/2 ) { 
			if ( psi>0)
				psi = Math.PI - psi;
			else
				psi = -(Math.PI + psi);
			phi+=Math.PI;
			camera.up.y = -camera.up.y;
			inv*=-1;
			
		}
		camera.position.z = radio * Math.cos( phi ) * Math.cos( psi );
		camera.position.x = radio * Math.sin( phi ) * Math.cos( psi );
		camera.position.y = radio * Math.sin( psi );
		camera.lookAt( axisHelper.position );
	}
	renderer.render( scene, camera );
}

function movercamara(posx, posy, posxant, posyant) {
if (camera) {
	var mvx = (posx - posxant)/10;
	var mvy =(posy - posyant)/10;
	camera.position.x -= mvx;
	camera.position.y -= mvy;
	axisHelper.position.x -= mvx;
	axisHelper.position.y -= mvy;
	camera.lookAt( axisHelper.position );
	radio = camera.position.length();
}
renderer.render( scene, camera );
}

function escalar(valor) {
	if (camera) {
		if ( camera.position.length()>10.0 ) {
			camera.position.setLength(camera.position.length()-valor/10);
		} else if ( camera.position.length()>1.0 ) {
			camera.position.setLength(camera.position.length()-valor/100);
		} else {
			if ( camera.position.length()-valor/1000>0.1 ) {
				camera.position.setLength(camera.position.length()-valor/1000);
			}
		}
		radio = camera.position.length();
	}
	
	renderer.render( scene, camera );
}

function escalarObjeto(e) {
	escalar(e.detail);
}
		 
function comienzoMovimiento(e)
{	
	posxant=e.clientX+window.scrollX;
	posyant=e.clientY+window.scrollY;
	
	document.addEventListener("mousemove", enMovimiento, true);
	document.addEventListener("mouseup", finMovimiento, true);
	e.preventDefault();
}

function enMovimiento(e)
{
	var posx, posy;
	
	posx=e.clientX+window.scrollX;
	posy=e.clientY+window.scrollY;
	switch ( mov ) {
		case 1:
			rotarcamara(posx, posy, posxant, posyant);
			posxant= posx;
			posyant= posy;
			e.preventDefault();
			break;
		case 2:
			escalar(posy - posyant);
			posxant= posx;
			posyant= posy;
			e.preventDefault();
			break;
		case 3:
			movercamara(posx, posy, posxant, posyant);
			posxant= posx;
			posyant= posy;
			e.preventDefault();
			break;
	}
}

function finMovimiento(e)
{
	document.removeEventListener("mousemove", enMovimiento, true);
	document.removeEventListener("mouseup", finMovimiento, true);
}

function getAxisHelpers(params) {
	var axisMesh, arrowGeometry, xArrowMesh, xAxisGeometry, xAxisMaterial, xAxisMesh, yArrowMesh, yAxisGeometry, yAxisMaterial, yAxisMesh, zArrowMesh, zAxisGeometry, zAxisMaterial, zAxisMesh;
	if (params == null) {
		params = {};
	}
	params.radius = params.radius || 0.01;
	params.height = params.height || 2;
	params.scene = params.scene || scene;
	arrowGeometry = new THREE.CylinderGeometry(0, 4 * params.radius, params.height / 5);
	xAxisMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
	xAxisGeometry = new THREE.CylinderGeometry(params.radius, params.radius, params.height);
	axisMesh = new THREE.Object3D();
	xAxisMesh = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
	xArrowMesh = new THREE.Mesh(arrowGeometry, xAxisMaterial);
	xAxisMesh.add(xArrowMesh);
	xArrowMesh.position.y += params.height / 2;
	xAxisMesh.rotation.z -= 90 * Math.PI / 180;
	xAxisMesh.position.x += params.height / 2;
	
	axisMesh.add(xAxisMesh);
	yAxisMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
	yAxisGeometry = new THREE.CylinderGeometry(params.radius, params.radius, params.height);
	yAxisMesh = new THREE.Mesh(yAxisGeometry, yAxisMaterial);
	yArrowMesh = new THREE.Mesh(arrowGeometry, yAxisMaterial);
	yAxisMesh.add(yArrowMesh);
	yArrowMesh.position.y += params.height / 2;
	yAxisMesh.position.y += params.height / 2;
	
	axisMesh.add(yAxisMesh);
	zAxisMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF});
	zAxisGeometry = new THREE.CylinderGeometry(params.radius, params.radius, params.height);
	zAxisMesh = new THREE.Mesh(zAxisGeometry, zAxisMaterial);
	zArrowMesh = new THREE.Mesh(arrowGeometry, zAxisMaterial);
	zAxisMesh.add(zArrowMesh);
	zAxisMesh.rotation.x += 90 * Math.PI / 180;
	zArrowMesh.position.y += params.height / 2;
	zAxisMesh.position.z += params.height / 2;
	axisMesh.add(zAxisMesh);
	return axisMesh;
}

parseStlBinaryToParticle = function(stl) {
	var geo = new THREE.Geometry();
	
	var minX = Number.MAX_VALUE;
	var minY = Number.MAX_VALUE;
	var minZ = Number.MAX_VALUE;
	var maxX = -Number.MAX_VALUE;
	var maxY = -Number.MAX_VALUE;
	var maxZ = -Number.MAX_VALUE;
					
	var lines = stl.split('\n');
	for (var len = lines.length, i = 0; i < len; i++) {
	    parts = trim(lines[i]).split(' ');
		
		var vector = new THREE.Vector3();
		
		vector.x = parts[0];
		vector.y = parts[1];
		vector.z = parts[2];
			
		minX = Math.min(minX, vector.x);
		minY = Math.min(minY, vector.y);
		minZ = Math.min(minZ, vector.z);
		maxX = Math.max(maxX, vector.x);
		maxY = Math.max(maxY, vector.y);
		maxZ = Math.max(maxZ, vector.z);
	
		geo.vertices.push( vector );
	}
	
	var material = new THREE.ParticleBasicMaterial({
		  color: 0xFFFFFF,
		  size: 0.001
		});
	
	var mimesh = new THREE.ParticleSystem(geo, material);				
	mimesh.sortParticles = true;
	mimesh.rotation.x = -Math.PI/2;
	cx = maxX-minX;
	cy = maxY-minY;
	cz = maxZ-minZ;
	mimesh.position.y-=minZ; 
	mimesh.position.x-=minX+(cx/2);
	mimesh.position.z+=minY+(cy/2);
	mesh = new THREE.Object3D();
	mesh.add(mimesh);
	scene.add(mimesh);
	stl = null;
};