import * as THREE from "three";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
    FBXLoader
} from "three/addons/loaders/FBXLoader.js";


// =====================================================
// LOADERS
// =====================================================

const gltfLoader =
    new GLTFLoader();

const fbxLoader =
    new FBXLoader();


// =====================================================
// UNIVERSAL MODEL LOADER
// Supports GLB, GLTF and FBX
// =====================================================

function loadModel(
    modelPath,
    onLoad,
    onProgress,
    onError
) {

    const extension =
        modelPath
            .split(".")
            .pop()
            .toLowerCase();


    // =================================================
    // GLB / GLTF
    // =================================================

    if (
        extension === "glb" ||
        extension === "gltf"
    ) {

        gltfLoader.load(

            modelPath,

            (gltf) => {

                // GLTF returns a scene
                const model =
                    gltf.scene;


                // Store animations
                model.userData.animations =
                    gltf.animations;


                onLoad(
                    model
                );

            },

            onProgress,

            onError

        );

        return;

    }


    // =================================================
    // FBX
    // =================================================

    if (
        extension === "fbx"
    ) {

        fbxLoader.load(

            modelPath,

            (model) => {

                // FBX animations
                model.userData.animations =
                    model.animations || [];


                onLoad(
                    model
                );

            },

            onProgress,

            onError

        );

        return;

    }


    // =================================================
    // UNSUPPORTED FORMAT
    // =================================================

    console.error(

        "Unsupported model format:",

        modelPath

    );

}