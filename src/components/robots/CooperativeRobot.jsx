import * as THREE from 'three';
import {  useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

export const CooperativeRobot = () =>{
  let mixer;
  const gray_robot_arm = useLoader(GLTFLoader, '/models/cooperativeRobot.glb');
  console.log('gray_robot_arm:');
  console.log(gray_robot_arm);
  if(gray_robot_arm.animations.length){
    mixer = new THREE.AnimationMixer(gray_robot_arm.scene)
    gray_robot_arm.animations.forEach(clip => {
      const action = mixer.clipAction(clip)
      action.play()
    })
  }
  useFrame((state, delta) => {
    mixer?.update(delta)
  })
  
  return (
    <primitive 
      object={gray_robot_arm.scene}  
    />
  )
} 