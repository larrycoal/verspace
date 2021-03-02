import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { softShadows, MeshWobbleMaterial, OrbitControls } from "drei";
import { useSpring, animated } from "react-spring/three";
import * as THREE from "three/src/Three";
import reactLogo from './Assets/reactLogo.jpg'
import nodeLogo from './Assets/nodeLogo.png'
import verspace from './Assets/verspace.png'
import Olanrewaju from './Olanrewaju'

softShadows();
const Stars = () => {
  let group = useRef();
  let theta = 0;
  useFrame(() => {
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)));
    const s = Math.cos(THREE.Math.degToRad(theta * 2));
    group.current.rotation.set(r, r, r);
    group.current.scale.set(s, s, s);
  });
  const [geo, mat, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(1, 10, 10);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("lightblue"),
    });
    const coords = new Array(2000)
      .fill()
      .map((i) => [
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
        Math.random() * 800 - 400,
      ]);
    return [geo, mat,  coords];
  }, []);
  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  );
};
const SpinningBox = ({ position, args, color, speed }) => {
  const mesh = useRef(null);
  const [expand, setExpand] = useState(false);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });
  return (
    <animated.mesh
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow
      position={position}
      ref={mesh}
    >
      <boxBufferGeometry attach="geometry" args={args} />

      <MeshWobbleMaterial
        attach="material"
        map={color}
        speed={speed}
        factor={0.0}
        
      />
    </animated.mesh>
  );
};

const App = () => {
  const reactlogo = new THREE.TextureLoader().load(reactLogo)
  const nodelogo = new THREE.TextureLoader().load(nodeLogo)
  const codng = new THREE.TextureLoader().load(verspace)
  return (
    <>
    <div className="proposal_wrapper">
      <Canvas shadowMap camera={{ position: [-5, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.4}
          shadow-mapSize-height={1024}
          shadow-mapSize-width={1024}
          shadow-camera-far={50}
          shadow-camera-right={10}
          shadow-camera-left={-10}
          shadow-camera-bottom={-10}
          shadow-camera-top={10}
        />
        <pointLight position={[-10, 0, -20]} intensity={0.3} />
        <pointLight position={[0, -10, 0]} intensity={1.3} />
        <group>
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
          >
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <shadowMaterial attach="material" opacity={0.3} />
          </mesh>
          <SpinningBox
            position={[0, 1, 0]}
            args={[3, 2, 1]}
            color={codng}
            
            speed={2}
          />
          <SpinningBox position={[-2, 1, -5]} color={reactlogo} speed={4} />
          <SpinningBox position={[5, 1, -2]} color={nodelogo} speed={4} />
          <Stars/>
        </group>
        <OrbitControls/>
      </Canvas>
      <div className="proposal_text">
      <Olanrewaju/>
      </div>
      </div>
    </>
  );
};

export default App;
