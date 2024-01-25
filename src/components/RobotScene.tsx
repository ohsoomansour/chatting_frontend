import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import  GLTFLoader from 'three-gltf-loader';
/*# THREE.js
  1. 설치
    >  npm install --save three
		 React에서 GLTFLoader 사용 
     #react-three/fiber는 three.js를 component 기반 방식으로 사용
    > npm install three @react-three/fiber 
    #fiber의 components들을 재사용
    > npm install @react-three/drei


    > three-gltf-loader
    > npm i @types/three -D

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

/* #문제: TypeError: Cannot read properties of undefined (reading 'prototype')
 1. useLoader 사용?  
   
*/

export const RobotScene: React.FC = () => {
  const modelRef = useRef<THREE.Object3D>();

  useEffect(() => {
    //canvas 
    const canvas = document.getElementById('root')
    
    // Renderer: param1 - parameters is an optional object with properties defining the renderer's behaviour
    const renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    // Scene
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight());

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 마우스 컨트롤

    camera.position.set(0, 20, 90);
    // Cube (mesh)
    
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    //#3D 로더
    const loader = new GLTFLoader();
    //./dogRobot.gltf
    loader.load( '../3D/dogRobot.gltf', function ( gltf ) {
      modelRef.current = gltf.scene;
      scene.add( gltf.scene );
      

    }, undefined, function ( error ) {

      console.error( error );
    
    } );
    // Rotate the model
 
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current!) {
        modelRef.current!.rotation.x += 0.005;
        modelRef.current!.rotation.y += 0.005;
      }

      // Render the scene: 큐브와 glb파일이 랜더됨
      renderer.render(scene, camera);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start the animation
    animate();
    return
  }, []);

  return <div></div>
};

