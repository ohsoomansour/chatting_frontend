import { ThemeProvider } from 'styled-components';
import { LoggedInRouter } from './router/logged-in-router';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './recoil/atom_Theme';
import { darkTheme, lightTheme } from './theme.t';
import {Canvas} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DogRobot } from './components/robots/DogRobot';

   /*Q.컴포넌트가 랜더링될 때: DOM 리랜더링? 
      > React의 리랜더링 조건
      > Parent 컴포넌트가 리렌더링되면 자식 component는 리랜더링

    [문제]
    react component life-cycle 

    <div className="App">
      <LoggedInRouter />

    </div>
    
    .././public/3D/dogRobot.gltf"

    <Robot position={[0, 0, -10]} />
    <Environment preset="sunset" background />
  */ 


export default function App() {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <LoggedInRouter />
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
    </ThemeProvider>
  );
}

