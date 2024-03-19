import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { MoveRobot } from "../components/robots/MoveRobot"
import { CuteRobot } from "../components/robots/cuteRobot"

import { Helmet } from "react-helmet"
import { CooperativeRobot } from "../components/robots/CooperativeRobot"
import { DeliveryRobot } from "../components/robots/DeliveryRobot"
import { ManufacturingRobot } from "../components/robots/ManufacturingRobot"
import { useEffect, useState } from "react"
import { Loading } from "../components/loading"
import { HandleScroll } from "../components/handleScroll"



export const Home = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(()=> {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 6000);

    
    return () => {
      clearTimeout(timer);
      
    }
    
  }, []);
  


  
  
  return(
    <div className=" ">
      <Helmet>
         <title>Trader | Home </title>       
      </Helmet>
      <h1 className=" text-2xl font-bold text-center mt-6 mb-1">Welcome to Robot Trader </h1>
      {isLoading ? <Loading /> : null}
      
      <div className=" flex flex-col items-center"> 
        <Canvas camera={{ position: [0, 4, 7], fov:55}} style={{ width: '100%', height: '45vh' }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={Math.PI / 2} scale={[0.6, 0.6, 0.6]} >
            <mesh
            castShadow
            receiveShadow
              >
              <ManufacturingRobot />
            </mesh>
          </group>
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            
        </Canvas>
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

        <Canvas camera={{ position: [0, 3, 7], fov:35 }} style={{ width: '70%', height: '55vh' }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={-Math.PI / 2} scale={[1.1, 1.1, 1.2]} >
            <mesh
              castShadow
              receiveShadow
            >  
              <CooperativeRobot />
            </mesh>
            </group>
          <ambientLight intensity={1} />
          <spotLight position={[1, 1, 1]} angle={Math.PI / 3}  />
            
        </Canvas>
        <Canvas camera={{ position: [7, 8, 3], fov:35 }} style={{ width: '70%', height: '45vh' }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={-Math.PI / 2} scale={[1.1, 1.1, 1.2]} >
            <mesh
              castShadow
              receiveShadow
            >  
              <DeliveryRobot />
            </mesh>  
          </group>
          <ambientLight intensity={1} />
          <spotLight position={[10, 2, 5]} angle={0.15}  penumbra={1}/>
            
        </Canvas>

      </div>
      <HandleScroll />
    </div>
  )
}


