/*참고 블로그:https://velog.io/@loopydoopy/R3F-React-Three-Fiber%EC%97%90%EC%84%9C-3D-%EB%AA%A8%EB%8D%B8-%EB%9D%84%EC%9A%B0%EA%B8%B0
 1.gltf파일은 json 파일로 묶여있다.
 2.glb파일은 바이너리 파일로 묶여있음
 3.React에서는 jsx파일로 변경해줘야된다.
 > npm i gltfjsx
 > npx gltfjsx [파일명].jsx
 4. glb 혹은 gltf 파일 valid test site: https://github.khronos.org/glTF-Validator/
 
  

*/
//---------------------------------- 테스트 중 -----------------------------------
import React, { useRef} from 'react'
import { useGLTF } from '@react-three/drei'

//---------------------------------- -----------------------------------------------------


export function DogRobot(props) {
  const groupRef = useRef()
  const { nodes, materials } = useGLTF('/models/dogRobot.glb')
  //animation
  console.log('DogROBOT:')
  console.log(nodes);
  //const { actions } = useAnimations(animations, group)
  //useFrame((state, delta) => (groupRef.current.position.x += delta))
  
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="WALKfbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="OctaneCamera" position={[-1220.751, 249.789, -2476.77]} rotation={[0, -1.114, -0.036]}>
                  <group name="Object_9" />
                </group>
                <group name="CINEMA_4D_Editor" position={[506.22, 215.781, 382.678]} rotation={[Math.PI, 0.652, 2.936]}>
                  <group name="Object_5" />
                </group>
                <group name="OctaneCamera_1" position={[1065.326, 286.368, 1206.777]} rotation={[-Math.PI, 0.754, 3.03]}>
                  <group name="Object_7" />
                </group>
                <group name="SPOT_DOG">
                  <group name="SPOT_BODY" position={[-0.554, 150, 9.057]} rotation={[0.003, 0, -0.122]}>
                    <group name="FRONT_R_LEG" position={[-41.856, -0.563, 89.784]} rotation={[0.469, 0, 0]}>
                      <group name="Object_14">
                        <primitive object={nodes._rootJoint} />
                        <group name="Object_16" position={[-41.733, 165.929, 82.393]} rotation={[0.469, 0, 0]} />
                        <group name="Root" rotation={[-0.469, 0, 0]} />
                        <skinnedMesh name="Object_17" geometry={nodes.Object_17.geometry} material={materials['Scene_-_Root']} skeleton={nodes.Object_17.skeleton} />
                      </group>
                    </group>
                    <group name="REAR_R_LEG" position={[-44.122, -0.315, -88.279]}>
                      <group name="Object_23">
                        <primitive object={nodes._rootJoint_1} />
                        <group name="Object_25" position={[-44, 166.177, -95.669]} />
                        <group name="Root_2" />
                        <skinnedMesh name="Object_26" geometry={nodes.Object_26.geometry} material={materials['Scene_-_Root']} skeleton={nodes.Object_26.skeleton} />
                      </group>
                    </group>
                    <group name="REAR_LEG" position={[43.878, -0.315, -88.279]}>
                      <group name="Object_32">
                        <primitive object={nodes._rootJoint_2} />
                        <group name="Object_34" position={[44, 166.177, -95.669]} />
                        <skinnedMesh name="Object_35" geometry={nodes.Object_35.geometry} material={materials['Scene_-_Root']} skeleton={nodes.Object_35.skeleton} />
                      </group>
                    </group>
                    <group name="FRONT_LEG" position={[42.814, -0.315, 89.721]}>
                      <group name="Object_41">
                        <primitive object={nodes._rootJoint_3} />
                        <group name="Object_43" position={[42.937, 166.177, 82.331]} />
                        <skinnedMesh name="Object_44" geometry={nodes.Object_44.geometry} material={materials['Scene_-_Root']} skeleton={nodes.Object_44.skeleton} />
                      </group>
                    </group>
                    <mesh name="SPOT_BODY__0" geometry={nodes.SPOT_BODY__0.geometry} material={materials['Scene_-_Root']} />




                  </group>
                  <group name="FRONLT_R_LEG_CONTROL" position={[-41.806, -1.347, 170.71]} rotation={[-2.444, 0, 0]} />
                  <group name="FRONT_L_LEG_CONTROL" position={[42.525, -1.167, 29.773]} rotation={[-2.245, 0, 0]} />
                  <group name="REAR_R_LEG_CONTROL" position={[-44.064, -1.992, -158.474]} rotation={[-2.553, 0, 0]} />
                  <group name="REAR_L_LEG_CONTROL" position={[43.584, -0.817, -19.318]} rotation={[-1.992, 0, 0]} />
                  
                
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/dogRobot.glb')
