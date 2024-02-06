import React, { useRef } from 'react'
import * as THREE from 'three';
import {  useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

export const RBproduct = () =>{
  let mixer;
   // GLTFLoader 생성
   const loader = new GLTFLoader();

  const glb = useLoader(GLTFLoader);
  console.log('glb:');
  console.log(glb)
  if(glb.animations.length){
    mixer = new THREE.AnimationMixer(glb.scene) //three.js에서 제공하는 '애니메이션을 관리'하는 핵심 클래스 중 하나
    glb.animations.forEach(clip => {
      const action = mixer.clipAction(clip)
      action.play()
    })
  }
  //
  useFrame((state, delta) => {
    mixer?.update(delta) //주어진 시간 간격(deltaTime)에 따라 모든 애니메이션 clip을 갱신
  })
  
  return (
    <primitive 
        object={glb.scene}
        
    />
)
} 