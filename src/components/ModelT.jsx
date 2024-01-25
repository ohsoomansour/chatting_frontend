import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
/*
 <mesh castShadow receiveShadow geometry={nodes.Curve007_1.geometry} material={materials['Material.001']} />
      <mesh castShadow receiveShadow geometry={nodes.Curve007_2.geometry} material={materials['Material.002']} />
geometry={nodes.object_2.children[0]}
*/
export default function ModelT(props) {
  const groupRef = useRef()
  const { nodes, materials } = useGLTF('../3D/robot_dog__4kriggedasset.glb')
  console.log(nodes);
  //console.log(materials)
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.children} material={materials['Material.001']} />
      <mesh castShadow receiveShadow  material={materials['Material.002']} />
    </group>
  )
}

useGLTF.preload('../3D/robot_dog__4kriggedasset.glb')