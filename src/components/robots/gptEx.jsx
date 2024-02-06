import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ArrayBuffer를 가져오는 함수
async function loadArrayBuffer(url) {
  //https://goodganglabs3.s3.ap-northeast-2.amazonaws.com/1707223578702dogRobot.gltf
  // const objTest = "1706965081463cuteRobot.glb";
  //https://goodganglabs3.s3.ap-northeast-2.amazonaws.com/1707223733700hexaRobot.glb
  const objTest = "1707223733700hexaRobot.glb"
  const response =
    await(
      await fetch(url, {
      /**/
      headers: {
        'Content-Type':'application/json; charset=utf-8',
      },
      method: 'POST',
      body:JSON.stringify({
        objTest
      })
    })
    ).arrayBuffer()
    console.log('response:')
    console.log(response)
  /*
  if (!response.ok) {
    throw new Error(`Failed to load array buffer from ${url}: ${response.status}`);
  }
  */
  return response;
}

// ArrayBuffer를 로드하고 처리하는 함수
async function loadModelFromBuffer(buffer) {
  console.log('로드하고 처리하는 함수에 들어오니?')
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(buffer, '', resolve, reject);
  });
}

// Three.js 컴포넌트
const ThreeScene = ({ modelUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // AmbientLight를 생성하여 장면에 추가합니다.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 색상과 강도를 설정합니다.
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 색상과 강도를 설정합니다.
    directionalLight.position.set(1, 1, 1); // 빛의 방향을 설정합니다.
    scene.add(directionalLight);
    // 오브젝트를 생성합니다. (예: 기하체)
    
    // ArrayBuffer를 로드하고 모델을 장면에 추가
    const loadModel = async () => {
      const buffer = await loadArrayBuffer(modelUrl); // ArrayBuffer를 가져옵니다.
      console.log('loadModel 함수 안에는 들어오니?')
      console.log(buffer);
      const gltf = await loadModelFromBuffer(buffer); // ArrayBuffer를 파싱하여 모델을 로드합니다.
      console.log('loadModel 함수 안 gltf는?')
      scene.add(gltf.scene); // 장면에 모델을 추가합니다.
      /*
      try {
      } catch (error) {
        console.error('Failed to load model:', error);
      }*/
    };

    loadModel();

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.x += 0.01;
      scene.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
    /*
    return () => {
      // 컴포넌트가 언마운트될 때 렌더러를 제거합니다.
      renderer.dispose();
    };*/
  }, [modelUrl]);

  return <canvas ref={canvasRef} />;
};

export default ThreeScene;
