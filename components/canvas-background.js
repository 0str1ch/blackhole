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
import { DoubleSide, CubeTextureLoader } from 'three';
import * as resources from '../resources/index';
import { useTransition, a } from 'react-spring'


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
              envMap={material.envMap}
              specular="#fbe277"
              color="#fbe277"
              shininess={0}
              metalness={0}
              emissive="#fbe277"
              emissiveIntensity={0.95}
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
    <mesh ref={meshRef} castShadow scale={[5, 5, 5]} position={[0, -1, 0]}>
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
      <meshLambertMaterial
        attach="material"
        color="#000"
        opacity={1}
        specular="#000"
        shininess={0}
        roughness={100}
        metalness={0}
        emissive="#000"
        emissiveIntensity={1}
        refractionRatio={0.95}
        transparent
      />
    </mesh>
  );
};

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
      {/* <waterPass attachArray="passes" factor={1} uniforms-distortion={0.1} /> */}
      <unrealBloomPass
        attachArray="passes"
        threshold={0.35}
        strength={1}
        radius={1}
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

function Stars() {
  const group = useRef();
  const theta = 0;
  useRender(() => {
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    // const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
    // const s = Math.cos(THREE.Math.degToRad(theta * 2))
    // group.current.rotation.set(r, r, r)
    // group.current.scale.set(s, s, s)
  });
  const [geo, mat, vertices, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(0.5, 10, 10);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('lightblue')
    });
    const coords = new Array(2000)
      .fill()
      .map(i => [
        Math.random() * 800 - 400,
        Math.random() * 3800 - 400,
        Math.random() * 800 - 400
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

function Loading() {
  const [finished, set] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = () => set(true)
    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
      setWidth((itemsLoaded / itemsTotal) * 200)
  }, [])

  const props = useTransition(finished, null, {
    from: { opacity: 1, width: 0 },
    leave: { opacity: 0 },
    update: { width },
  })

  return props.map(
    ({ item: finished, key, props: { opacity, width } }) =>
      !finished && (
        <a.div className="loading" key={key} style={{ opacity }}>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width }} />
          </div>
        </a.div>
      ),
  )
}

export default function CanvasBackground() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 1, 40], fov: 35 }}
        style={{ height: '100%', position: 'absolute' }}
        pixelRatio={window.devicePixelRatio}
        
      >
        <ambientLight intensity={1.5} />
        {/* <directionalLight intensity={1} position={[-100, 450, 100]} color="white" /> */}
        {/* <spotLight
          castShadow
          intensity={1.25}
          angle={Math.PI / 8}
          position={[2, 2, 2]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        /> */}
        <fog attach="fog" args={['#000', 5, 2050]} />

        {/* <Plane/> */}
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
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 2.05}
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

          div.nav-links {
            position: absolute;
            z-index: 2;
            padding: 3rem;
            text-align: center;
            opacity: 0.9;
          }

          div.credits {
            bottom: 0;
            left: 0;
          }
          div.source {
            bottom: 0;
            right: 0;
          }
        `}
      </style>
      <Loading/>
      <div className="nav-links credits">Made by <a href="http://jeremysmith.dev" target="_blank" rel="noopener noreferrer">Jeremy Smith</a> </div>
      <div className="nav-links source"><a href="http://github.com/0str1ch/blackhole" target="_blank" rel="noopener noreferrer">View Code</a></div>
    </>
  );
}
