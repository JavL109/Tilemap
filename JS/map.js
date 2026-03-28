import { BoxS } from "./config.js"
import { ctx, canvas, state, history, status } from "./state.js"
import { assets, loadImage } from "./assets.js"
import { init_creatures } from "./entities.js"

async function chargeMap() {
    try {
        const response = await fetch("./maps/map" + state.currentMap + ".json")
        if (response.ok) {
            const map = await response.json()
            return map
        } else {
            throw new Error(response.status)
        }
    } catch (error) {
        console.error("Carga fallida", error)
    }
}

export async function getMapInfo() {
    if (state.currentMap > state.mapCharged) {
        try {
            state.mapInfo = await chargeMap()
            if (!state.mapInfo) throw new Error("No se ha recibido el mapa")

            state.newMap = state.mapInfo.mapCoords
            state.structures = state.mapInfo.structuresCode
            state.keys = state.mapInfo.keysCoords
            state.doors = state.mapInfo.doorsCoords
            state.typesOfEnemies = state.mapInfo.enemies
            state.playerStart = state.mapInfo.playerStart
            state.mapId = state.mapInfo.id
            state.mapHistory = state.mapInfo.history
            state.mapName = state.mapInfo.mapName
            state.playerMovList = state.mapInfo.playerMovList
            state.numKeys = state.keys.length
            state.originalKeys = JSON.parse(JSON.stringify(state.mapInfo.keysCoords))
            console.log("MAPA CARGADO:", state.currentMap, "Llaves originales:", state.originalKeys)

            for (const structure of state.structures) {
                const src = "./images/structures/" + structure.name + ".png"
                assets.structures[structure.code] = await loadImage(src)
            }
            for (const enemy of state.typesOfEnemies) {
                const name = enemy.type
                const src = "./images/enemies/" + name + ".png"
                assets.enemies[name] = await loadImage(src)
            }
            assets.key = await loadImage("./images/general/book.png")
            assets.player = await loadImage("./images/general/player.png")
            assets.door = await loadImage("./images/general/portal.png")

            state.mapCharged++
        } catch (error) {
            console.error("Error: " + error)
        }
    }
}

export function init_paint_map() {
    for (let gridY = 0; gridY < state.newMap.length; gridY++) {
        for (let gridX = 0; gridX < state.newMap[0].length; gridX++) {
            const code = state.newMap[gridY][gridX]
            const img = assets.structures[code]
            const x = gridX * BoxS
            const y = gridY * BoxS
            if (img) {
                if (state.newMap[gridY][gridX] == code) {
                    ctx.drawImage(img, x, y, BoxS, BoxS)
                }
            } else {
                ctx.Style = "magenta"
                ctx.fillRect(x, y, BoxS, BoxS)
            }
        }
    }

    if (state.keys) {
        for (const key of state.keys) {
            const x = key.gridX * BoxS
            const y = key.gridY * BoxS
            ctx.drawImage(assets.key, x, y, BoxS, BoxS)
        }
    }
    if (state.doors) {
        for (const door of state.doors) {
            const x = door.gridX * BoxS
            const y = door.gridY * BoxS
            ctx.drawImage(assets.door, x, y, BoxS, BoxS)
        }
    }
}

export function paint_map(x, y, color) {
    const gridX = x / BoxS
    const gridY = y / BoxS
    state.newMap[parseInt(gridY)][parseInt(gridX)] = color
}

export function loadMapInfo() {
    history.innerHTML = state.mapInfo.history
}

export function refreshKeyStatus() {
    init_paint_map()
    status.innerHTML = "<p>Amount of books: " + state.player.key + "</p><p>Total needed: " + state.numKeys
    const bookTrue = state.player.key
    const bookFalse = state.numKeys - bookTrue
    for (let i = 0; i < bookTrue; i++) {
        status.innerHTML += "<img src='./images/icon/IconBookTrue.png' style='width:75px;height:75px' >"
    }
    for (let i = 0; i < bookFalse; i++) {
        status.innerHTML += "<img src='./images/icon/IconBookFalse.png' style='width:75px;height:75px'>"
    }
}

export async function nextLevel() {
    state.currentMap++
    await getMapInfo()
    init_paint_map()
    init_creatures()
    loadMapInfo()
    state.player.text()
    refreshKeyStatus()
}

export function reset_level() {
    console.log("REINICIANDO... Llaves en memoria:", state.keys, "Copia de seguridad:", state.originalKeys)
    state.keys = JSON.parse(JSON.stringify(state.originalKeys))
    state.player.x = state.playerStart.gridX * BoxS
    state.player.y = state.playerStart.gridY * BoxS
    init_paint_map()
    init_creatures()
    loadMapInfo()
}