import React, { useRef, useEffect } from 'react';
import * as BABYLON from 'babylonjs';
//import 'babylonjs-loaders'; // Babylon.js 로더 모듈

const BabylonScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Babylon.js 엔진 생성
    const engine = new BABYLON.Engine(canvasRef.current, true);

    // 씬(scene) 생성
    const scene = new BABYLON.Scene(engine);

    // 카메라(camera) 생성
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);

    // 조명(light) 생성
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    // glTF 모델 로드
    //https://goodganglabs3.s3.ap-northeast-2.amazonaws.com/1707232216128ddog.glb
    BABYLON.SceneLoader.AppendAsync('/public/models/', 'dogRobot.glb', scene).then(() => {
      // 모델이 로드된 후 실행할 코드
      // 이 부분에서 모델의 속성을 설정하거나 처리할 작업을 수행할 수 있습니다.

      // 모델 추가 후 화면 렌더링
      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    // 창 크기 변경 시 리사이징
    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      // 컴포넌트 언마운트 시 Babylon.js 리소스 정리
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default BabylonScene;
