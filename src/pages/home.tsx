import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { DogRobot } from "../components/robots/DogRobot"
import { MoveRobot } from "../components/robots/MoveRobot"
import { HexaRbot } from "../components/robots/hexahedronRobot"
import { CuteRobot } from "../components/robots/cuteRobot"
import { Helmet } from "react-helmet"

export const Home = () => {

  return(
    <div>
      <Helmet>
         <title>Trader | Home </title>       
      </Helmet>
      <h1 className=" text-lg font-bold text-center mt-6">Welcome to Robot Trader </h1>
      <Canvas>
      <OrbitControls autoRotate={true}/>
        <mesh>
          <ambientLight intensity={1}/>
          <directionalLight position={[-1,0,1]} intensity={0.5} />
          <boxGeometry args={[1, 1, 1]}></boxGeometry>
          <meshStandardMaterial attach="material" color={0xa3b18a}/>
          
        </mesh>
      </Canvas>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls autoRotate={true}/>
        <group rotation-y={-Math.PI / 2}>
          <DogRobot />
        </group>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
      </Canvas>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls autoRotate={true}/>
        <group rotation-y={-Math.PI / 2}>
          <MoveRobot />
        </group>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
      </Canvas>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls autoRotate={false}/>
        <group rotation-y={-Math.PI / 2}>
          <mesh
          castShadow
          receiveShadow
            >
            <HexaRbot />
          </mesh>
        </group>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={2} />
          
      </Canvas>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls autoRotate={false}/>
        <group rotation-y={-Math.PI / 2}>
          <CuteRobot />
        </group>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={2} />
          
      </Canvas>
      
    </div>
  )
}


