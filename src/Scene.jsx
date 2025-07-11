import React, { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Box,
  Grid,
  OrbitControls,
  PivotControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import Lights from "./Components/ThreeComp/Lights";
import ModelLoader from "./Components/ThreeComp/ModelLoader";

function Scene({ objects }) {
  const [targetObject, setTargetObject] = useState(null);

  const [values, setValues] = useState({
    position: [],
    rotation: [],
    scale: [],
  });

  return (
    <>
      <Canvas
        camera={{ position: [0, 5, 5] }}
        onPointerMissed={() => {
          setTargetObject(null);
        }}
      >
        {targetObject && (
          <PivotControls
            name="exclude"
            disableScaling
            disableSliders
            matrix={targetObject.matrix}
            scale={2}
            depthTest={false}
            onDrag={(local) => {
              const position = new THREE.Vector3();
              const scale = new THREE.Vector3();
              const quaternion = new THREE.Quaternion();
              local.decompose(position, quaternion, scale);
              targetObject;
              targetObject.position.copy(position);
              targetObject.scale.copy(scale);
              targetObject.quaternion.copy(quaternion);

              {
                targetObject &&
                  setValues({
                    position: [
                      targetObject.position.x,
                      targetObject.position.y,
                      targetObject.position.z,
                    ],
                    rotation: [
                      targetObject.rotation.x,
                      targetObject.rotation.y,
                      targetObject.rotation.z,
                    ],
                    scale: [
                      targetObject.scale.x,
                      targetObject.scale.y,
                      targetObject.scale.z,
                    ],
                  });
              }
            }}
            // onDragStart={()=>console.log(undoState)}
          />
        )}

       
        {objects &&
          objects.map((obj, i) => (
            <ModelLoader
              path={obj.path}
              name={obj.name}
              scale={obj.scale}
              position={[i+1,0,0]}
              onClick={(e) => {
                e.stopPropagation();
                if (e.delta === 0) {
                  console.log(e);

                  setTargetObject(e.eventObject);
                }
              }}
            />
          ))}
        {/* <Box
          onClick={(e) => {
            e.stopPropagation();
            if (e.delta === 0) {
              console.log(e);

              setTargetObject(e.eventObject);
            }
          }}
        /> */}
        <Grid
          position={[0, -1, 0]}
          name="exclude"
          infiniteGrid={true}
          cellSize={1}
          sectionSize={1}
          fadeDistance={100}
          fadeStrength={10}
        />
        <OrbitControls makeDefault />
         <Lights />

      </Canvas>
      {targetObject && (
        <div className="val">
          <strong>Object:</strong>{" "}
          {targetObject.name} <br />
          <strong>Position:</strong>{" "}
          {values.position.map((n) => n.toFixed(2)).join(", ")} <br />
          <strong>Rotation:</strong>{" "}
          {values.rotation.map((n) => n.toFixed(2)).join(", ")} <br />
          <strong>Scale:</strong>{" "}
          {values.scale.map((n) => n.toFixed(2)).join(", ")}
        </div>
      )}
    </>
  );
}

export default Scene;
