import { Engine } from "./engine/Engine.js";


const canvas = document.getElementById("game");

const engine = new Engine(canvas);

engine.start();