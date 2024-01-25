/* https://velog.io/@loopydoopy/R3F-React-Three-Fiber%EC%97%90%EC%84%9C-3D-%EB%AA%A8%EB%8D%B8-%EB%9D%84%EC%9A%B0%EA%B8%B0
 gltf파일은 json 파일로 묶여있다.
 glb파일은 바이너리 파일로 묶여있음
 React에서는 jsx파일로 변경해줘야된다.
 > npm i gltfjsx
 > npx gltfjsx [파일명].jsx
 > glb 혹은 gltf 파일 테스트: https://github.khronos.org/glTF-Validator/

*/

import { useGLTF } from '@react-three/drei'

export function Robot(props) {
  const { nodes, materials } = useGLTF('/models/simple_robot.glb')
  
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[0, 0.02, 2.357]} scale={[0.879, 0.666, 0.833]}>
          <group position={[0.672, -0.042, -1.617]} scale={[0.186, 0.394, 0.723]}>
            <mesh geometry={nodes.Leg_Left_1.geometry} material={materials.Root} />
            <mesh geometry={nodes.Foot_Left_1.geometry} material={materials.Root} position={[0.766, -0.903, -1.252]} rotation={[0.003, -0.111, 0.035]} scale={[2.388, 2.657, 0.383]} />
          </group>
          <group position={[-0.682, 0.004, -1.513]} scale={[0.186, 0.394, 0.723]}>
            <mesh geometry={nodes.Leg_Right_1.geometry} material={materials.Root} />
            <mesh geometry={nodes.Foot_Right_1.geometry} material={materials.Root} position={[-0.57, -1.024, -1.406]} rotation={[0.003, -0.111, 0.035]} scale={[2.388, 2.657, 0.383]} />
          </group>
          <group position={[0, -0.057, 1.184]} scale={[0.833, 1.099, 1.077]}>
            <group position={[0, 0.024, 1.554]} scale={[2.152, 1.446, 1.348]}>
              <mesh geometry={nodes.Head_1.geometry} material={materials.Root} />
              <mesh geometry={nodes.Antenna_Right_Top_1.geometry} material={materials.Root} position={[-1.141, -0.187, 2.102]} scale={[0.051, 0.076, 0.067]} />
              <mesh geometry={nodes.Antenna_Right_1.geometry} material={materials.Root} position={[-1.035, -0.188, 1.191]} scale={[0.635, 0.944, 0.827]} />
              <mesh geometry={nodes.Eye_Right_1.geometry} material={materials.Root} position={[-0.465, -1.023, 0.126]} rotation={[Math.PI / 2, 0, 0]} scale={[1.375, 1.792, 0.944]} />
              <mesh geometry={nodes.Eye_Left_1.geometry} material={materials.Root} position={[0.467, -1.023, 0.126]} rotation={[Math.PI / 2, 0, 0]} scale={[1.016, 1.324, 0.944]} />
              <mesh geometry={nodes.Antenna_Left_Top_1.geometry} material={materials.Root} position={[1.077, -0.204, 1.955]} scale={[0.051, 0.076, 0.067]} />
              <mesh geometry={nodes.Ears_1.geometry} material={materials.Root} position={[0, -0.213, 0.11]} rotation={[0, Math.PI / 2, 0]} scale={[1.32, 1.508, 1.013]} />
            </group>
            <mesh geometry={nodes.Neck_1.geometry} material={materials.Root} />
          </group>
          <group position={[0, 0.067, 0.179]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2.929, 2.343, 1.509]}>
            <group position={[-0.002, -0.053, -1.22]} rotation={[0, 0, -Math.PI / 2]} scale={[0.085, 0.085, 0.443]}>
              <mesh geometry={nodes.Arm_Right_1.geometry} material={materials.Root} />
              <mesh geometry={nodes.Hand_Right_1.geometry} material={materials.Root} position={[1.902, -0.004, -1.299]} rotation={[1.171, 0.088, 1.689]} scale={[0.347, 1.369, 0.604]} />
            </group>
            <group position={[-0.002, -0.053, 1.22]} rotation={[0, 0, -Math.PI / 2]} scale={[0.085, 0.085, 0.443]}>
              <mesh geometry={nodes.Arm_Left_1.geometry} material={materials.Root} />
              <mesh geometry={nodes.Hand_Left_1.geometry} material={materials.Root} position={[1.993, -0.004, 1.307]} rotation={[1.171, 0.088, 1.689]} scale={[0.347, 1.369, 0.604]} />
            </group>
            <mesh geometry={nodes.Shoulders_1.geometry} material={materials.Root} />
          </group>
          <mesh geometry={nodes.Body_1.geometry} material={materials.Root} />
          <mesh geometry={nodes.Pipes_1.geometry} material={materials.Root} position={[0, -0.887, -0.292]} rotation={[Math.PI / 2, 0, 0]} scale={[0.282, 0.298, 0.372]} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/simple_robot.glb')
