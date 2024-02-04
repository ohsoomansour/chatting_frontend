import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { DogRobot } from "../components/robots/DogRobot"
import { MoveRobot } from "../components/robots/MoveRobot"
import { HexaRbot } from "../components/robots/hexahedronRobot"
import { CuteRobot } from "../components/robots/cuteRobot"


/*#로그아웃 기능 추가
   1. 스타일 컴포넌트, const Button = styled.button``
   2. 로그 아웃 핸들러
   const history = useHistory() 
   const onLogOut = () => {
    //sessionStorage로 변경
     localStorage.removeItem('tk')
     history.go(0);
     
   }

   <Button onClick={() => onLogOut()} className=" flex flex-col items-center gap-2 font-semibold">
    <OffSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"/>
    </OffSvg>
    로그 아웃
  </Button>
*/

/*
localhost/:1 Access to fetch at 'https://goodganglabs3.s3.ap-northeast-2.amazonaws.com/1706965081463cuteRobot.glb' from origin 'http://localhost:3001' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs
, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.


*/

/**/

const glbUrl= "https://goodganglabs3.s3.ap-northeast-2.amazonaws.com/1706965081463cuteRobot.glb";
fetch(glbUrl, {
   mode: 'no-cors',
   method: 'GET' 
})
.then(response => {
  console.log(response);
  // HTTP 응답이 성공적인지 확인
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }
  // GLB 파일을 ArrayBuffer로 변환: 바이너리 데이터를 로우 레벨로 표현 response.arrayBuffer();
  return response.arrayBuffer();
})
.then(glbData => {
  // 여기에서 glbData를 사용하여 GLB 파일을 처리하십시오.
  console.log('GLB 파일 데이터:', glbData);
  // 예를 들어, Three.js 라이브러리를 사용하여 GLB 모델을 렌더링할 수 있습니다.
  // const loader = new THREE.GLTFLoader();
  // loader.parse(glbData, '', (gltf) => {
  //   scene.add(gltf.scene);
  // });
})
.catch(error => {
  console.error('GLB 파일을 가져오는 중 오류 발생:', error);
});





export const Home = () => {
  //https 

  return(
    <div>
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


