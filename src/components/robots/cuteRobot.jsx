import React, { useRef } from 'react'
import * as THREE from 'three';
import {  useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

export const CuteRobot = () =>{
  let mixer;
  const gltf = useLoader(GLTFLoader, '/models/cuteRobot.glb');
  console.log('gltf:');
  console.log(gltf)
  if(gltf.animations.length){
    mixer = new THREE.AnimationMixer(gltf.scene)
    gltf.animations.forEach(clip => {
      const action = mixer.clipAction(clip)
      action.play()
    })
  }
  useFrame((state, delta) => {
    mixer?.update(delta)
  })
  
  return (
    <primitive 
        object={gltf.scene}
        
    />
)
} 