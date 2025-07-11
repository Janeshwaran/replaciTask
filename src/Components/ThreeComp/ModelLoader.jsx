import { useRef } from "react";
import suzanne from "/suzanne.glb?url";
import { useGLTF } from "@react-three/drei";

const ModelLoader = (props) => {
const gltf = useGLTF(props.path)
  const groupRef = useRef()

 

  return (
    <group ref={groupRef}  {...props}>
      <primitive object={gltf.scene.clone()} />
    </group>
  )
}

export default ModelLoader;
