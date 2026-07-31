import * as THREE from "three";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
    FBXLoader
} from "three/addons/loaders/FBXLoader.js";


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let worldData = null;
let islandsData = null;
let buildingsData = null;

let player = null;

let playerMixer = null;

let playerAnimations = {};

let currentAnimation = null;

let water = null;

let waterGeometry = null;

let waterMaterial = null;

const islands = [];

const buildings = [];


// =====================================================
// GAME SETTINGS
// =====================================================

let GRAVITY = 25;

let WATER_LEVEL = -2;

const PLAYER_SPEED = 6;

const JUMP_FORCE = 10;

const CAMERA_DISTANCE = 8;

const CAMERA_HEIGHT = 5;


// =====================================================
// PLAYER STATE
// =====================================================

const playerVelocity =
    new THREE.Vector3();

let isGrounded = false;


// =====================================================
// KEYBOARD
// =====================================================

const keys = {};


// =====================================================
// SCENE
// =====================================================

const scene =
    new THREE.Scene();


// =====================================================
// CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(

        60,

        window.innerWidth /
        window.innerHeight,

        0.1,

        2000

    );
    window.camera = camera;
    window.scene = scene;

// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        powerPreference:
            "high-performance"

    });


renderer.setSize(

    window.innerWidth,

    window.innerHeight

);


renderer.setPixelRatio(

    Math.min(

        window.devicePixelRatio,

        2

    )

);


renderer.shadowMap.enabled =
    true;


renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


document.body.appendChild(

    renderer.domElement

);


// =====================================================
// LOADERS
// =====================================================

const gltfLoader =
    new GLTFLoader();

const fbxLoader =
    new FBXLoader();


// =====================================================
// STATUS
// =====================================================

function updateStatus(
    message
) {

    const status =
        document.getElementById(
            "status"
        );


    if (status) {

        status.textContent =
            message;

    }


    console.log(
        "[STATUS]",
        message
    );

}


// =====================================================
// UNIVERSAL MODEL LOADER
// GLB / GLTF / FBX
// =====================================================

function loadModel(

    modelPath,

    onLoad,

    onProgress,

    onError

) {

    console.log(

        "[MODEL] Loading:",

        modelPath

    );


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

                console.log(

                    "[MODEL] GLTF loaded:",

                    modelPath

                );


                const model =
                    gltf.scene;


                model.userData.animations =

                    gltf.animations || [];


                onLoad(

                    model,

                    gltf.animations || []

                );

            },

            (xhr) => {

                if (

                    xhr.lengthComputable

                ) {

                    const percent =

                        (

                            xhr.loaded /

                            xhr.total

                        ) * 100;


                    console.log(

                        `[MODEL] ${modelPath}: ${percent.toFixed(1)}%`

                    );

                }


                if (onProgress) {

                    onProgress(
                        xhr
                    );

                }

            },

            (error) => {

                console.error(

                    "[MODEL] GLTF ERROR:",

                    modelPath,

                    error

                );


                if (onError) {

                    onError(
                        error
                    );

                }

            }

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

                console.log(

                    "[MODEL] FBX loaded:",

                    modelPath

                );


                model.userData.animations =

                    model.animations || [];


                onLoad(

                    model,

                    model.animations || []

                );

            },

            (xhr) => {

                if (

                    xhr.lengthComputable

                ) {

                    const percent =

                        (

                            xhr.loaded /

                            xhr.total

                        ) * 100;


                    console.log(

                        `[MODEL] ${modelPath}: ${percent.toFixed(1)}%`

                    );

                }


                if (onProgress) {

                    onProgress(
                        xhr
                    );

                }

            },

            (error) => {

                console.error(

                    "[MODEL] FBX ERROR:",

                    modelPath,

                    error

                );


                if (onError) {

                    onError(
                        error
                    );

                }

            }

        );


        return;

    }


    console.error(

        "[MODEL] Unsupported format:",

        modelPath

    );

}


// =====================================================
// APPLY MODEL TRANSFORM
// =====================================================

function applyTransform(

    model,

    data

) {

    if (

        data.position

    ) {

        model.position.set(

            data.position.x || 0,

            data.position.y || 0,

            data.position.z || 0

        );

    }


    if (

        data.rotation

    ) {

        model.rotation.set(

            data.rotation.x || 0,

            data.rotation.y || 0,

            data.rotation.z || 0

        );

    }


    if (

        data.scale

    ) {

        model.scale.set(

            data.scale.x || 1,

            data.scale.y || 1,

            data.scale.z || 1

        );

    }

}


// =====================================================
// PREPARE MODEL
// =====================================================

function prepareModel(
    model
) {

    model.traverse(

        (child) => {

            if (

                child.isMesh

            ) {

                child.castShadow =
                    true;

                child.receiveShadow =
                    true;

            }

        }

    );

}


// =====================================================
// LOAD JSON FILE
// =====================================================

async function loadJSON(

    path

) {

    console.log(

        "[JSON] Loading:",

        path

    );


    const response =

        await fetch(
            path
        );


    console.log(

        "[JSON] Response:",

        path,

        response.status

    );


    if (

        !response.ok

    ) {

        throw new Error(

            `Failed to load ${path}: ${response.status}`

        );

    }


    const data =

        await response.json();


    console.log(

        "[JSON] Loaded:",

        path,

        data

    );


    return data;

}


// =====================================================
// LOAD WORLD CONFIGURATION
// =====================================================

async function loadWorldConfig() {

    console.log(

        "===================================="

    );

    console.log(

        "LOADING WORLD CONFIGURATION"

    );

    console.log(

        "===================================="

    );


    worldData =

        await loadJSON(

            "./data/world.json"

        );


    islandsData =

        await loadJSON(

            "./data/islands.json"

        );


    buildingsData =

        await loadJSON(

            "./data/buildings.json"

        );


    console.log(

        "===================================="

    );

    console.log(

        "ALL JSON FILES LOADED"

    );

    console.log(

        "===================================="

    );


    console.log(

        "World:",

        worldData

    );


    console.log(

        "Islands:",

        islandsData

    );


    console.log(

        "Buildings:",

        buildingsData

    );


    // Gravity

    if (

        worldData.world &&

        worldData.world.gravity

    ) {

        GRAVITY =

            worldData.world.gravity;

    }


    // Water level

    if (

        worldData.world &&

        worldData.world.waterLevel

        !== undefined

    ) {

        WATER_LEVEL =

            worldData.world.waterLevel;

    }


    // Sky

    if (

        worldData.sky &&

        worldData.sky.color

    ) {

        scene.background =

            new THREE.Color(

                worldData.sky.color

            );

    }


    console.log(

        "Gravity:",

        GRAVITY

    );


    console.log(

        "Water Level:",

        WATER_LEVEL

    );

}


// =====================================================
// CREATE LIGHTING
// =====================================================

function createLighting() {

    console.log(

        "[LIGHTING] Creating lighting..."

    );


    const lighting =

        worldData.lighting || {};


    const ambientIntensity =

        lighting.ambientIntensity ||

        2;


    const sunIntensity =

        lighting.sunIntensity ||

        3;


    const ambientLight =

        new THREE.HemisphereLight(

            0xffffff,

            0x4477aa,

            ambientIntensity

        );


    scene.add(

        ambientLight

    );


    const sun =

        new THREE.DirectionalLight(

            0xffffff,

            sunIntensity

        );


    if (

        lighting.sunPosition

    ) {

        sun.position.set(

            lighting.sunPosition.x,

            lighting.sunPosition.y,

            lighting.sunPosition.z

        );

    } else {

        sun.position.set(

            100,

            150,

            100

        );

    }


    sun.castShadow =
        true;


    sun.shadow.mapSize.width =
        2048;


    sun.shadow.mapSize.height =
        2048;


    scene.add(

        sun

    );


    console.log(

        "[LIGHTING] Ready"

    );

}


// =====================================================
// CREATE WATER
// =====================================================

function createWater() {

    console.log(

        "[WATER] Creating water..."

    );


    if (

        !worldData.water ||

        !worldData.water.enabled

    ) {

        console.log(

            "[WATER] Disabled"

        );

        return;

    }


    const settings =

        worldData.water;


    const size =

        settings.size || 500;


    const segments =

        settings.segments || 100;


    waterGeometry =

        new THREE.PlaneGeometry(

            size,

            size,

            segments,

            segments

        );


    waterMaterial =

        new THREE.MeshStandardMaterial({

            color:

                settings.color ||

                "#1687d9",

            transparent:

                true,

            opacity:

                settings.opacity ||

                0.85,

            roughness:

                settings.roughness ||

                0.15,

            metalness:

                settings.metalness ||

                0.05,

            side:

                THREE.DoubleSide

        });


    water =

        new THREE.Mesh(

            waterGeometry,

            waterMaterial

        );


    water.rotation.x =

        -Math.PI / 2;


    water.position.set(

        settings.position?.x || 0,

        settings.position?.y ??

            WATER_LEVEL,

        settings.position?.z || 0

    );


    water.receiveShadow =
        true;


    scene.add(

        water

    );


    console.log(

        "[WATER] Created"

    );


    console.log(

        "[WATER SETTINGS]",

        settings

    );

}


// =====================================================
// ANIMATE WATER
// =====================================================

function animateWater(

    time

) {

    if (

        !waterGeometry ||

        !worldData.water

    ) {

        return;

    }


    const settings =

        worldData.water;


    const positions =

        waterGeometry

            .attributes

            .position;


    for (

        let i = 0;

        i < positions.count;

        i++

    ) {

        const x =

            positions.getX(i);


        const y =

            positions.getY(i);


        const wave1 =

            Math.sin(

                x *

                (

                    settings.waveFrequency ||

                    0.04

                ) +

                time *

                0.001 *

                (

                    settings.waveSpeed ||

                    1.5

                )

            ) *

            (

                settings.waveHeight ||

                0.15

            );


        const wave2 =

            Math.sin(

                y *

                (

                    settings.wave2Frequency ||

                    0.06

                ) +

                time *

                0.001 *

                (

                    settings.wave2Speed ||

                    2

                )

            ) *

            (

                settings.wave2Height ||

                0.1

            );


        const wave3 =

            Math.sin(

                (

                    x +

                    y

                ) *

                (

                    settings.wave3Frequency ||

                    0.03

                ) +

                time *

                0.001 *

                (

                    settings.wave3Speed ||

                    1

                )

            ) *

            (

                settings.wave3Height ||

                0.1

            );


        positions.setZ(

            i,

            wave1 +

            wave2 +

            wave3

        );

    }


    positions.needsUpdate =
        true;

}


// =====================================================
// LOAD ISLANDS
// =====================================================

async function loadIslands() {

    console.log(

        "===================================="

    );

    console.log(

        "LOADING ISLANDS"

    );

    console.log(

        "===================================="

    );


    if (

        !islandsData ||

        !islandsData.islands

    ) {

        console.error(

            "[ISLANDS] No islands found"

        );

        return;

    }


    for (

        const data of

        islandsData.islands

    ) {

        console.log(

            "[ISLAND] Loading:",

            data.id,

            data.model

        );


        await new Promise(

            (resolve) => {

                loadModel(

                    data.model,

                    (island) => {

                        applyTransform(

                            island,

                            data

                        );


                        prepareModel(

                            island

                        );


                        scene.add(

                            island

                        );


                        const box =

                            new THREE.Box3()

                                .setFromObject(

                                    island

                                );


                        islands.push({

                            id:

                                data.id,

                            data:

                                data,

                            object:

                                island,

                            box:

                                box

                        });


                        console.log(

                            "[ISLAND] Loaded:",

                            data.id

                        );


                        resolve();

                    },

                    undefined,

                    (error) => {

                        console.error(

                            "[ISLAND] Failed:",

                            data.model,

                            error

                        );


                        resolve();

                    }

                );

            }

        );

    }


    console.log(

        "[ISLANDS] Total loaded:",

        islands.length

    );

}


// =====================================================
// LOAD BUILDINGS
// =====================================================

async function loadBuildings() {

    console.log(

        "===================================="

    );

    console.log(

        "LOADING BUILDINGS"

    );

    console.log(

        "===================================="

    );


    if (

        !buildingsData ||

        !buildingsData.buildings

    ) {

        console.error(

            "[BUILDINGS] No buildings found"

        );

        return;

    }


    for (

        const data of

        buildingsData.buildings

    ) {

        console.log(

            "[BUILDING] Loading:",

            data.id,

            data.model

        );


        const island =

            islands.find(

                (item) =>

                    item.id ===

                    data.island

            );


        if (!island) {

            console.error(

                "[BUILDING] Island not found:",

                data.island

            );

            continue;

        }


        await new Promise(

            (resolve) => {

                loadModel(

                    data.model,

                    (building) => {

                        // --------------------------------
                        // Apply local transform
                        // --------------------------------

                        applyTransform(

                            building,

                            data

                        );


                        prepareModel(

                            building

                        );


                        // --------------------------------
                        // Add to island
                        // --------------------------------

                        island.object.add(

                            building

                        );


                        buildings.push({

                            id:

                                data.id,

                            data:

                                data,

                            object:

                                building,

                            island:

                                island

                        });


                        console.log(

                            "[BUILDING] Loaded:",

                            data.id,

                            "on",

                            data.island

                        );


                        resolve();

                    },

                    undefined,

                    (error) => {

                        console.error(

                            "[BUILDING] Failed:",

                            data.model,

                            error

                        );


                        resolve();

                    }

                );

            }

        );

    }


    console.log(

        "[BUILDINGS] Total loaded:",

        buildings.length

    );

}


// =====================================================
// LOAD PLAYER
// =====================================================

async function loadPlayer() {

    console.log(

        "===================================="

    );

    console.log(

        "LOADING PLAYER"

    );

    console.log(

        "===================================="

    );


    // Change this to your character
    // GLB, GLTF or FBX

    const playerModel =

        "./models/character.glb";


    await new Promise(

        (resolve) => {

            loadModel(

                playerModel,

                (model, animations) => {

                    player =
                        model;


                    prepareModel(

                        player

                    );


                    // --------------------------------
                    // Spawn
                    // --------------------------------

                    const spawn =

                        worldData.world

                            ?.spawnPoint || {

                            x: 0,

                            y: 5,

                            z: 0

                        };


                    player.position.set(

                        spawn.x,

                        spawn.y,

                        spawn.z

                    );


                    scene.add(

                        player

                    );


                    // --------------------------------
                    // Animations
                    // --------------------------------

                    if (

                        animations &&

                        animations.length > 0

                    ) {

                        console.log(

                            "[PLAYER] Animations:",

                            animations.map(

                                clip =>

                                    clip.name

                            )

                        );


                        playerMixer =

                            new THREE.AnimationMixer(

                                player

                            );


                        animations.forEach(

                            (clip) => {

                                playerAnimations[
                                    clip.name
                                ] =

                                    playerMixer

                                        .clipAction(

                                            clip

                                        );

                            }

                        );


                        const firstAnimation =

                            animations[0].name;


                        playAnimation(

                            firstAnimation

                        );

                    }


                    console.log(

                        "[PLAYER] Loaded"

                    );


                    resolve();

                },

                undefined,

                (error) => {

                    console.error(

                        "[PLAYER] Failed:",

                        error

                    );


                    resolve();

                }

            );

        }

    );

}


// =====================================================
// PLAY ANIMATION
// =====================================================

function playAnimation(

    name

) {

    if (

        !playerAnimations[name]

    ) {

        return;

    }


    Object.values(

        playerAnimations

    ).forEach(

        (action) => {

            action.fadeOut(

                0.2

            );

        }

    );


    const action =

        playerAnimations[name];


    action

        .reset()

        .fadeIn(

            0.2

        )

        .play();


    currentAnimation =
        name;

}


// =====================================================
// KEYBOARD EVENTS
// =====================================================

window.addEventListener(

    "keydown",

    (event) => {

        keys[
            event.code
        ] = true;


        if (

            event.code ===

            "Space"

        ) {

            event.preventDefault();

            jump();

        }

    }

);


window.addEventListener(

    "keyup",

    (event) => {

        keys[
            event.code
        ] = false;

    }

);


// =====================================================
// PLAYER UPDATE
// =====================================================

function updatePlayer(

    delta

) {

    if (!player) {

        return;

    }


    let moveX = 0;

    let moveZ = 0;


    if (

        keys["KeyW"] ||

        keys["ArrowUp"]

    ) {

        moveZ -= 1;

    }


    if (

        keys["KeyS"] ||

        keys["ArrowDown"]

    ) {

        moveZ += 1;

    }


    if (

        keys["KeyA"] ||

        keys["ArrowLeft"]

    ) {

        moveX -= 1;

    }


    if (

        keys["KeyD"] ||

        keys["ArrowRight"]

    ) {

        moveX += 1;

    }


    const moving =

        moveX !== 0 ||

        moveZ !== 0;


    if (moving) {

        const length =

            Math.sqrt(

                moveX *

                moveX +

                moveZ *

                moveZ

            );


        moveX /= length;

        moveZ /= length;


        player.position.x +=

            moveX *

            PLAYER_SPEED *

            delta;


        player.position.z +=

            moveZ *

            PLAYER_SPEED *

            delta;


        const targetRotation =

            Math.atan2(

                moveX,

                moveZ

            );


        player.rotation.y =

            THREE.MathUtils.lerp(

                player.rotation.y,

                targetRotation,

                0.15

            );


        if (

            playerAnimations["Walk"] &&

            currentAnimation !== "Walk"

        ) {

            playAnimation(

                "Walk"

            );

        }

    } else {

        if (

            playerAnimations["Idle"] &&

            currentAnimation !== "Idle"

        ) {

            playAnimation(

                "Idle"

            );

        }

    }


    // Gravity

    playerVelocity.y -=

        GRAVITY *

        delta;


    player.position.y +=

        playerVelocity.y *

        delta;


    checkGround();


    // Respawn

    if (

        player.position.y <

        WATER_LEVEL - 10

    ) {

        respawnPlayer();

    }

}


// =====================================================
// GROUND CHECK
// =====================================================

function checkGround() {

    if (!player) {

        return;

    }


    const playerBox =

        new THREE.Box3()

            .setFromObject(

                player

            );


    let grounded = false;


    islands.forEach(

        (island) => {

            island.box

                .setFromObject(

                    island.object

                );


            const box =

                island.box;


            const horizontalInside =

                player.position.x >=

                box.min.x &&

                player.position.x <=

                box.max.x &&

                player.position.z >=

                box.min.z &&

                player.position.z <=

                box.max.z;


            if (

                horizontalInside &&

                playerBox.min.y <=

                box.max.y + 1 &&

                playerBox.min.y >=

                box.max.y - 3 &&

                playerVelocity.y <= 0

            ) {

                player.position.y =

                    box.max.y;


                playerVelocity.y =

                    0;


                grounded =

                    true;

            }

        }

    );


    isGrounded =

        grounded;

}


// =====================================================
// JUMP
// =====================================================

function jump() {

    if (

        !player ||

        !isGrounded

    ) {

        return;

    }


    playerVelocity.y =

        JUMP_FORCE;


    isGrounded =

        false;


    if (

        playerAnimations["Jump"]

    ) {

        playAnimation(

            "Jump"

        );

    }

}


// =====================================================
// RESPAWN
// =====================================================

function respawnPlayer() {

    console.log(

        "[PLAYER] Respawning"

    );


    const spawn =

        worldData.world

            ?.spawnPoint || {

            x: 0,

            y: 5,

            z: 0

        };


    player.position.set(

        spawn.x,

        spawn.y,

        spawn.z

    );


    playerVelocity.set(

        0,

        0,

        0

    );

}


// =====================================================
// CAMERA
// =====================================================

function updateCamera() {

    if (!player) {

        return;

    }


    const target =

        new THREE.Vector3(

            player.position.x,

            player.position.y +

            CAMERA_HEIGHT,

            player.position.z

        );


    const desiredPosition =

        new THREE.Vector3(

            player.position.x,

            player.position.y +

            CAMERA_HEIGHT,

            player.position.z +

            CAMERA_DISTANCE

        );


    camera.position.lerp(

        desiredPosition,

        0.08

    );


    camera.lookAt(

        target

    );

}


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(

    "resize",

    () => {

        camera.aspect =

            window.innerWidth /

            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }

);


// =====================================================
// START GAME
// =====================================================

async function startGame() {

    console.log(

        "===================================="

    );

    console.log(

        "STARTING THREE.JS ISLAND WORLD"

    );

    console.log(

        "===================================="


    );


    updateStatus(

        "Loading world configuration..."

    );


    try {

        // --------------------------------------------
        // JSON
        // --------------------------------------------

        await loadWorldConfig();


        // --------------------------------------------
        // Lighting
        // --------------------------------------------

        updateStatus(

            "Creating world..."

        );


        createLighting();


        // --------------------------------------------
        // Water
        // --------------------------------------------

        createWater();


        // --------------------------------------------
        // Islands
        // --------------------------------------------

        updateStatus(

            "Loading islands..."

        );


        await loadIslands();


        // --------------------------------------------
        // Buildings
        // --------------------------------------------

        updateStatus(

            "Loading buildings..."

        );


        await loadBuildings();


        // --------------------------------------------
        // Player
        // --------------------------------------------

        updateStatus(

            "Loading character..."

        );


        await loadPlayer();


        // --------------------------------------------
        // Ready
        // --------------------------------------------

        updateStatus(

            "World ready!"

        );


        console.log(

            "===================================="

        );

        console.log(

            "GAME READY"

        );

        console.log(

            "===================================="

        );


    } catch (error) {

        console.error(

            "===================================="

        );

        console.error(

            "GAME FAILED TO START"

        );

        console.error(

            error

        );

        console.error(

            "===================================="

        );


        updateStatus(

            "ERROR - Check browser console"

        );

    }

}


// =====================================================
// CLOCK
// =====================================================

const clock =

    new THREE.Clock();


// =====================================================
// ANIMATION LOOP
// =====================================================

function animate(

    time

) {

    requestAnimationFrame(

        animate

    );


    const delta =

        Math.min(

            clock.getDelta(),

            0.05

        );


    // Water

    animateWater(

        time

    );


    // Player

    updatePlayer(

        delta

    );


    // Camera

    updateCamera();


    // Animations

    if (

        playerMixer

    ) {

        playerMixer.update(

            delta

        );

    }


    // Render

    renderer.render(

        scene,

        camera

    );

}


// =====================================================
// START
// =====================================================

startGame();

animate();