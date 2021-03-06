import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Canvas,
  useRender,
  extend,
  useLoader,
  useThree,
  apply
} from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useTransition, a } from 'react-spring';
import * as resources from '../resources/index';

extend({ OrbitControls, UnrealBloomPass });
const Controls = props => {
  const { gl, camera } = useThree();
  const orbitRef = useRef();
  useRender(() => {
    orbitRef.current.update();
  });
  return (
    <orbitControls ref={orbitRef} args={[camera, gl.domElement]} {...props} />
  );
};

apply(resources);

function Model({ url }) {
  const modelRef = useRef();
  const model = useLoader(GLTFLoader, url, loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <group
      rotation={[-Math.PI / 2.05, 0, 0]}
      position={[0, -1, 0]}
      scale={[0.1, 0.1, 0.1]}
    >
      {model.map(({ geometry, material }) => {
        return (
          <mesh
            key={geometry.uuid}
            geometry={geometry}
            ref={modelRef}
            receiveShadow
          >
            <meshPhongMaterial
              attach="material"
              map={material.map}
              emissiveMap={material.emissiveMap}
              specular="#fff"
              color="#000"
              shininess={0}
              metalness={0}
              emissive="#ededed"
              emissiveIntensity={7.5}
              transparent
              // Don't show both sides as it ruins the black hole effect
              // args={[{side: DoubleSide}]}
            />
          </mesh>
        );
      })}
    </group>
  );
}

const Sphere = () => {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} scale={[5.4, 5.4, 5.4]} position={[0, -1, 0]}>
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
      <meshBasicMaterial attach="material" color="#000" />
    </mesh>
  );
};

function Stars() {
  const group = useRef();
  const [geo, mat, vertices, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(0.4, 10, 10);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('lightblue')
    });
    const coords = new Array(2000)
      .fill()
      .map(i => [
        Math.random() * 1800 - 700,
        Math.random() * 1800 - 700,
        Math.random() * 1800 - 700
      ]);
    return [geo, mat, vertices, coords];
  }, []);
  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  );
}

function Effect() {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size
  ]);

  useRender(() => composer.current.render(), true);

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* <waterPass attachArray="passes" factor={1} args={[{uniformsintensity: 0}]} /> */}
      <unrealBloomPass
        attachArray="passes"
        threshold={0.899}
        strength={1}
        radius={0.1}
      />
      <shaderPass
        attachArray="passes"
        args={[resources.FXAAShader]}
        material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
        renderToScreen
      />
    </effectComposer>
  );
}

function Loading() {
  const [finished, set] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = () => set(true);
    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
      setWidth((itemsLoaded / itemsTotal) * 300);
  }, []);

  const props = useTransition(finished, null, {
    from: { opacity: 1, width: 0 },
    leave: { opacity: 0 },
    update: { width }
  });

  return props.map(
    ({ item: finished, key, props: { opacity, width } }) =>
      !finished && (
        <a.div className="loading" key={key} style={{ opacity }}>
          <span className="loading-text">Loading</span>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width }} />
          </div>
        </a.div>
      )
  );
}

export default function CanvasBackground() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 1, 40], fov: 35 }}
        style={{ height: '100%', position: 'absolute' }}
        pixelRatio={window.devicePixelRatio}
        gl={{ antialias: false, alpha: false }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          // castShadow
          intensity={0.2}
          // shadow-mapSize-width={2048}
          // shadow-mapSize-height={2048}
        />

        <fog attach="fog" args={['#000', 500, 2050]} />
        <Stars />
        <Model url="/static/blackhole/scene.gltf" />
        <Sphere />
        <Controls
          autoRotate
          enablePan
          enableZoom
          enableDamping
          dampingFactor={0.9}
          rotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / -2}
        />
        <Effect />
      </Canvas>
      <style jsx global>
        {`
          .canvas {
            position: absolute;
            top: 0;
            overflow: hidden;
          }
        `}
      </style>
      <Loading />
    </>
  );
}
