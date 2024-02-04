import React, { useRef } from 'react'
import * as THREE from 'three';
import {  useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { TextureLoader } from 'three';
/* setTranscoderPath 사용
 GLB (Binary glTF) 파일은 glTF (GL Transmission Format) 형식의 3D 모델 데이터를 이진 형태로 포함한 파일입니다. 
  이 GLB 파일을 로드할 때 Three.js는 glTF transcoder를 사용하여 해당 이진 데이터를 파싱하고 Three.js의 데이터 구조로 변환합니다.

*/
//Three.TextureLoader 또는 
export const RBproduct = () =>{
  let mixer;
  
  const glb = useLoader(GLTFLoader, "https://goodganglabs3.s3.ap-northeast-2.amazonaws.com/1706965081463cuteRobot.glb");
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