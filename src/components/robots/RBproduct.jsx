/**/
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import {  useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { TextureLoader } from 'three';

/* 
 # URL -> 로드하는 방법 
https://carrotweb.tistory.com/304

npm install buffer
*/
import { useRecoilValue} from 'recoil';
import { tokenState } from "../../recoil/atom_token";

export const RBproduct = ({rb3dURL}) => {
  const [buff, setBuff] = useState()
  const token = useRecoilValue(tokenState)
  const objTest = "1706965081463cuteRobot.glb";
  let arrBuffer;
  
  const onGlb = async () => {
    const arrBuff = 
    await(
      await fetch('http://localhost:3000/download/glb', {
      /**/
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'x-jwt': `${token}`,
        
      },
      method: 'POST',
      body:JSON.stringify({
        objTest
      })
    })
    ).arrayBuffer()
    arrBuffer = arrBuff;
    const blob = new Blob([arrBuff], {type: 'application/octet-stream'})
    //const reader = new FileReader(arrBuff);
    //const red = reader.readAsDataURL(blob);

    
    return arrBuff;

  }
  useEffect(()=> {
    const arrbuff = onGlb();
    setBuff(arrbuff)
  }, [])
  
    /*const reader = new FileReader();
      객체는 웹 애플리케이션이 비동기적으로 데이터를 읽기 위하여 읽을 파일을 가리키는File 
      혹은 Blob 객체를 이용해 파일의 내용을(혹은 raw data버퍼로) 읽고 사용자의 컴퓨터에 저장하는 것을 가능하게 해줍니다.
    */
    
    let mixer
    
    const glb = useLoader(GLTFLoader, buff);
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
        <div>
          <p>{rb3dURL}</p>

          <primitive 
            object={glb.scene}
              
          />
              
         
        </div>
    )
  }

  
  /*
  let mixer;
   // GLTFLoader 생성
   const glb = new GLTFLoader()
  
   //const glb = useLoader(GLTFLoader, );
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

  <primitive 
        object={glb.scene}
  />      
  */
  
  
