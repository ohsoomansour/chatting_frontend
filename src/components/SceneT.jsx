import { Canvas, Camera, useFrame, useLoader } from '@react-three/fiber';
import { useState } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //🌟체크 
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// 문제 해결: gltf 파일을 -> jsx파일로 변환 -> React에서 랜더링


export default function SceneT(){
  const [hovered, setHover] = useState(false);
  const glb = useLoader(GLTFLoader, "../3D/simple_robot.glb");
  console.log("glb:")
  console.log(glb)
  /*
  useFrame((state, delta, frame) => {
    const mesh = gltf.scene.children[0];
    mesh.rotation.y = mesh.rotation.z += 0.01;
    mesh.rotation.x = state.clock.getElapsedTime();
  });
  */
  return(
    <>
    <primitive
        object={glb.scene}
        scale={0.01}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
        onClick={(e) =>
          window.open("https://sketchfab.com/anthonyjamesgirdler")
        }
      />
    </>
  )
}
