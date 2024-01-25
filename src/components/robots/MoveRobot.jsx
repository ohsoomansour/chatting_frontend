import React, { useRef } from 'react'
import * as THREE from 'three';
import {  useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

export const MoveRobot = () =>{
  let mixer;
  const gltf = useLoader(GLTFLoader, '/models/dogRobot.glb');
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