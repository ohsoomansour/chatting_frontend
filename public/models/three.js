
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*# THREE.js
  1. 설치
    >  npm install --save three
		 React에서 GLTFLoader 사용 
    > npm install three @react-three/fiber three-gltf-loader
    > npx gltfjsx scene.gltf
		  > scene.gltf does not exist.
      Need to install the following packages: gltfjsx@6.2.1

			

    > build tool: npm install --save-dev vite
	2. new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	  - 1번째 param: field of view, 장면의 degree 정도를 나타냄
		- 2번째 param: aspect ratio, 가로 세로 비율을 나타냄
		- 3,4번째, param: near and far, 카메라로부터 멀리 떨어져있는 정도

  3.<canvas> element 	
*/


//1. 기본 값 세팅 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight ); //window.innerWidth/2, window.innerHeight/2, false
//#<canvas> element 큐브 
document.body.appendChild( renderer.domElement );
//-----------------------------------------------------------------------------------------------------
/*웹팩을 typescript로 설정을 하고 해야되는 것인가
  1. TypeScript 컴파일러와 로더를 설치
		> npm install --save-dev webpack webpack -cli webpack-dev-server typescript ts-loader
		> webpack -cli

*/
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 5;
//document.getElementById('root')
//const controls = new OrbitControls( camera, renderer.domElement );
//#3D 로더
renderer.render( scene, camera );
function render() {
	
	
	//#큐브 컨트롤
	cube.rotation.x += 0.05;
	cube.rotation.y += 0.05;
	requestAnimationFrame( render );
	
	//controls.update();
	

}

const loader = new GLTFLoader();

loader.load( './dogRobot.gltf', function ( glb ) {

	scene.add( glb.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
//controls.update();

