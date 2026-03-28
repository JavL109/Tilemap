export const canvas = document.getElementById("canv")
export const ctx = canvas.getContext("2d")
canvas.width = 1650
canvas.height = 850

export const position = document.getElementById("position")
export const status = document.getElementById("status")
export const history = document.getElementById("history")

export const state = {
    // Control del juego
    canmove: true,
    pause: false,
    delay: 0,

    // Entidades
    player: null,
    enemies: [],

    // Mapa
    currentMap: 1,
    mapCharged: 0,
    mapInfo: null,
    newMap: null,
    structures: null,
    typesOfEnemies: null,
    playerStart: null,
    playerMovList: null,

    // Elementos del mapa
    keys: [],
    originalKeys: [],
    doors: [],
    numKeys: 0,

    // Info del mapa
    mapId: null,
    mapName: null,
    mapHistory: null,
}