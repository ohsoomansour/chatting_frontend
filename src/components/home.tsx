import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Link } from "react-router-dom"
import { DogRobot } from "./robots/DogRobot"
import { MoveRobot } from "./robots/MoveRobot"

export const Home = () => {


  return(
    <div>
      <h1 className=" text-lg font-bold text-center mt-6">Welcome to SM Entertainment </h1>
      <ul>
        <li><Link to="/streaming">스트리밍</Link></li>
      </ul>
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
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
      </Canvas>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls autoRotate={true}/>
        <group rotation-y={-Math.PI / 2}>
          <MoveRobot />
        </group>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
      </Canvas>
    </div>
  )
}


