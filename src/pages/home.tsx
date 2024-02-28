import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { MoveRobot } from "../components/robots/MoveRobot"
import { HexaRbot } from "../components/robots/hexahedronRobot"
import { CuteRobot } from "../components/robots/cuteRobot"
import { Helmet } from "react-helmet"

export const Home = () => {

  return(
    <div className=" ">
      <Helmet>
         <title>Trader | Home </title>       
      </Helmet>
      <h1 className=" text-lg font-bold text-center mt-6">Welcome to Robot Trader </h1>
      <div className=" flex flex-col items-center"> 
        <Canvas camera={{ position: [0, 3, 7], fov:75 }} style={{ width: '50%', height: '35vh' }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={-Math.PI / 2}>
            <CuteRobot />
          </group>
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={2} />
        </Canvas>
        <Canvas camera={{ position: [0, 3, 7], fov:75 }} style={{ width: '50%', height: '35vh' }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={-Math.PI / 2} scale={[1.2, 1.2, 1.2]}>
            <MoveRobot />
          </group>
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        </Canvas>
        <Canvas camera={{ position: [0, 4, 7], fov:75 }} style={{ width: '50%', height: '40vh' }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={-Math.PI / 2} scale={[0.6, 0.6, 0.6]} >
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
      </div>
    </div>
  )
}


