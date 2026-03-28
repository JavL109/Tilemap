import { BoxS, keyAudioRoute, keyVolume, deadAudioRoute, deadVolume, portalAudioRoute, portalVolume } from "./config.js"
import { ctx, position, state } from "./state.js"
import { assets } from "./assets.js"
import { playMusic } from "./audio.js"
import { CanMove, moveMaker } from "./pathfinding.js"
import { nextLevel, refreshKeyStatus } from "./map.js"

export const prota = function (x, y, image, movL) {
    this.dead = false
    this.x = x;
    this.y = y;
    this.image = image
    this.win = false
    this.key = 0
    this.requestAccepted = true
    this.movL = movL

    this.logic = function (prevX, prevY) {
        const gridX = Math.floor(this.x / BoxS)
        const gridY = Math.floor(this.y / BoxS)
        if (state.keys.length > 0) {
            let i = 0
            for (const k of state.keys) {
                if (gridX == k.gridX && gridY == k.gridY) {
                    this.requestAccepted = true
                    this.key++
                    playMusic(keyAudioRoute, keyVolume)
                    refreshKeyStatus()
                    console.log("LLAVE RECOGIDA. Restantes en keys:", state.keys.length);
                    break
                }
                i++
            }
            state.keys.splice(i, 1)
        }

        if (state.doors.length > 0) {
            for (const door of state.doors) {
                if (door.gridX == gridX && door.gridY == gridY) {
                    if (this.key >= state.numKeys) {
                        this.win = true
                        playMusic(portalAudioRoute, portalVolume)
                        nextLevel()
                    } else {
                        this.requestAccepted = false
                        console.log(this.requestAccepted)
                        this.y = prevY
                        this.x = prevX
                    }
                    break
                }
            }
        }
    }

    this.enemyColition = function () {
        const gridX = this.x / BoxS
        const gridY = this.y / BoxS

        const enemiesGridList = []
        for (const enemy of state.enemies) {
            const enemyGridX = enemy.x / BoxS
            const enemyGridY = enemy.y / BoxS
            enemiesGridList.push({ "gridX": enemyGridX, "gridY": enemyGridY })
        }

        let hit = false
        for (const grid of enemiesGridList) {
            if (gridX == grid.gridX) {
                if (gridY == grid.gridY) {
                    hit = true
                    break
                }
            }
        }

        if (hit) {
            this.dead = true
            playMusic(deadAudioRoute, deadVolume)
        }
    }

    this.paint = function () {
        ctx.drawImage(this.image, this.x, this.y, BoxS, BoxS)
    }

    this.move = function (where) {
        if (CanMove(this.x, this.y, where, this.movL)) {
            let prevX = this.x
            let prevY = this.y
            switch (where) {
                case "Up":
                    this.y -= BoxS
                    break
                case "Down":
                    this.y += BoxS
                    break
                case "Left":
                    this.x -= BoxS
                    break
                case "Right":
                    this.x += BoxS
                    break
            }
            this.logic(prevX, prevY)
            this.text()
            // playMusic(moveAudioRoute,moveVolume)
        }
    }

    this.text = function () {
        position.innerHTML = "<p>X:" + this.x + " Y:" + this.y + "</p>"
    }
}

export const enemy = function (x, y, image, movL, timeToMov, range) {
    this.x = x
    this.y = y
    this.image = image
    this.movL = movL
    this.timeMov = timeToMov
    this.time = 0
    this.range = range

    this.paint = function () {
        ctx.drawImage(this.image, this.x, this.y, BoxS, BoxS)
    }

    this.move = function () {
        this.time += 1
        if (this.time >= this.timeMov) {
            this.time = 0
            const list = moveMaker(this.x, this.y, this.range, this.movL)
            this.x = list[0]
            this.y = list[1]
        }
    }
}

export function init_creatures() {
    state.enemies = []
    if (state.typesOfEnemies) {
        for (const enemyType of state.typesOfEnemies) {
            const movL = enemyType.walkableStructures
            const name = enemyType.type
            const image = assets.enemies[name]
            const range = enemyType.range
            const timeToMov = enemyType.time
            for (const coord of enemyType.coords) {
                const x = coord.gridX * BoxS
                const y = coord.gridY * BoxS
                state.enemies.push(new enemy(x, y, image, movL, timeToMov, range))
            }
        }
    }

    if (state.playerStart) {
        const x = state.playerStart.gridX * BoxS
        const y = state.playerStart.gridY * BoxS
        const image = assets.player
        state.player = new prota(x, y, image, state.playerMovList)
        refreshKeyStatus()
    }
}